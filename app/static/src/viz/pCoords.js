// NOTES:
// '_context_' is a reserved data attribute for passing object related to data origins

function pCoords() {

    var data = [];
    var dom_parent;
    var plot_width;
    var plot_height;
    var update;

    var s_color = d3.scale.category10();
    var color_scale = d3.scale.quantize()
       .range([ "#33cccc", "#66CD00", "#db3e3e", "#235dba", ]);

    var drag_data = {};

    var options = {
        id: 'pCoords',
        width: window.innerWidth,
        height: window.innerHeight,
        margins: {
           top:    30, bottom: 30, 
           left:   10, right:  10
        },
        data: {
           hide: [],
           scales: {}
        },
        plot: {
           lines: {
              opacity:  0.5,
              colorKey: undefined
           },
           color: {
              default: '#b3b3cc'
           },
           xAxis: {
              rotate:      0,
              fontSize:    20,
              fontWeight:  400
           },
        },
       display: {
          transition_time: 0,
          settingsImg: false,
          helpImg:     false,
          sizeToFit:   true
       },
    };

    var default_colors = { default: "#b3b3cc" };
    var colors = JSON.parse(JSON.stringify(default_colors));

    var events = {
       'settings': { 'click': null },
       'help':    { 'click': null },
       'update':  { 'begin': null, 'end': null },
       'lines':   { 'click': null, 'mouseover': null, 'mouseout': null },
       'item':    { 'mouseover': null, 'mouseout': null, 'click': null },
       'brush':   { 'start': null, 'brushed': null, 'end': null, 'clear': null },
       'axis':    { 'x': { 'click': null }, 'y': {'click': null } },
    };

    var root;
    var lines;
    var axis_brushes;
    var axesX;
    var axesY;
    var click_check;
    var sorted_dimensions;
    var dimensions;

    function chart(selection) {
        selection.each(function () {
            dom_parent = d3.select(this);

            root = dom_parent.append('svg')
                .attr('class', 'pCoords')

            var chartHolder = root.append('g')
               .attr({
                  'class':'chartHolder',
                  'transform':'translate(0,0)'
               });

            var help;
            var settings;

            var hoverFrame = root.append('svg')
                .attr({ 'class':'hoverFrame', });

            var coordsPlot = chartHolder.append("g")
                  .attr("class", "coordsPlot");

            var background = coordsPlot.append("g")
            var foreground = coordsPlot.append("g")

            update = function(opts) {

               if (!data.length) { return; }

               color_scale
                  .domain([0, data.length])

               root
                  .on('mouseover', showImgs)
                  .on('mouseout', hideImgs);

               if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
                  var dims = dom_parent.node().getBoundingClientRect();
                  options.width = Math.max(dims.width, 300);
                  options.height = Math.min(Math.max(options.width / 3, 100), 250);
               }

               plot_width  = options.width  - (options.margins.left + options.margins.right);
               plot_height = options.height - (options.margins.top + options.margins.bottom);

               root
                  .attr({
                     'width':    options.width  + 'px',
                     'height':   options.height + 'px'
                  });

               chartHolder
                  .attr({
                     'width':    plot_width  + 'px',
                     'height':   plot_height + 'px',
                      "transform":  'translate(' + options.margins.left + ',' + options.margins.top + ')'
                  });

               coordsPlot
                  .attr({
                     'width':    plot_width  + 'px',
                     'height':   plot_height + 'px',
                  });

               axesX = d3.scale.ordinal().rangePoints([0, plot_width], 1);
               dimensions = getDimensions();

               if (sorted_dimensions) {
                  var ordered_dimensions = [];

                  // deal with situation where dimensions may have been hidden or unhidden
                  sorted_dimensions.forEach(function(dimension) {
                     // first add all sorted dimensions that are present in dimensions.x
                     if (dimensions.x.indexOf(dimension) >= 0) ordered_dimensions.push(dimension);
                  });
                  dimensions.x.forEach(function(dimension) {
                     // now add all dimensions from dimensions.x that weren't present in dimensions.x
                     if (ordered_dimensions.indexOf(dimension) < 0) ordered_dimensions.push(dimension);
                  });
                  dimensions.x = ordered_dimensions;
               }

               axesY = dimensions.y;
               axesX.domain(dimensions.x);

               var pcoord_line = d3.svg.line().interpolate("cardinal");
               var num_axis = d3.svg.axis().orient("left");
               var text_axis = d3.svg.axis().orient("left");

              // Add grey background lines for context.
               var o_lines = background.selectAll("path")
                  .data(data)

               o_lines.enter()
                  .append("path")
                  .attr("class", "o_line")

               o_lines.exit()
                  .remove();

               o_lines
                  .attr({
                     "fill": "none",
                     "stroke": "#ddd",
                     "stroke-opacity": .3,
                     "stroke-width": 1.5,
                     "d": path,
                  })
                  .style({
                     "shape-rendering": "crispEdges",
                  });


               // Add lines.
               lines = foreground.selectAll("path")
                  .data(data)
               lines.enter()
                  .append("path")
                  .attr('class', 'pc_line')
               lines.exit()
                  .remove();
               lines
                  .attr({
                     "id": function(d, i) { return 'm' + 'idx' + i},
                     "d": path,
                  })
                  .style({
                     "fill": "none",
                     "stroke-opacity": options.plot.lines.opacity, 
                     "stroke": function(d, i) { return line_color(d, i) },
                     "stroke-width": 1.5,
                  })
                  .on('click', function(d, i) { 
                     if (events.lines.click) events.lines.click({ d: d, i: i });
                  })
                  .on('mouseover', function(d, i) { 
                     if (events.lines.mouseover) { events.lines.mouseover({ d: d, i: i }); }
                     d3.select(this).style('stroke', 'yellow');
                  })
                  .on('mouseout', function(d, i)  { 
                     if (events.lines.mouseout) events.lines.mouseout({ d: d, i: i });
                     d3.select(this).style('stroke', line_color(d, i)) 
                  });

               // Add a group element for each dimension.
               var dmz = coordsPlot.selectAll(".cpDimension")
                    .data(dimensions.x);

               dmz.enter().append("g")
                  .attr("class", "cpDimension")
               dmz.exit()
                  .remove();
               dmz
                  .attr("transform", function(d) { return "translate(" + axesX(d) + ")"; })
                  .call(d3.behavior.drag()
                    .origin(function(d) { return {x: axesX(d)}; })
                    .on("dragstart", function(d) {
                       drag_data[d] = axesX(d);
                       o_lines.attr("visibility", "hidden");
                    })
                    .on("drag", function(d) {
                       drag_data[d] = Math.min(plot_width, Math.max(0, d3.event.x));
                       lines.attr("d", path);
                       dimensions.x.sort(function(a, b) { return position(a) - position(b); });
                       axesX.domain(dimensions.x);
                       dmz.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
                    })
                    .on("dragend", function(d) {
                       sorted_dimensions = dimensions.x.slice();
                       delete drag_data[d];
                       transition(d3.select(this)).attr("transform", "translate(" + axesX(d) + ")");
                       transition(lines).attr("d", path);

                       o_lines
                         .attr("d", path)
                         .transition()
                         .attr("visibility", null);

                    }));

               dmz.exit()
                  .remove();

               // TODO: fontScale can also have something to do with the # of dimensions
               var fontScale = d3.scale.linear();
               fontScale.domain([0, 2000]).range([0, options.plot.xAxis.fontSize]);

               axis_scale = dmz.selectAll('.pc_axis')
                  .data(function(d) { return [d]; }, get_key);

               axis_scale.enter()
                   .append("g")
                   .attr({
                      "class": "pc_axis",
                      "shape-rendering": "crispEdges",
                   })

               axis_scale.exit().remove();

               axis_scale
                   .each(function(d) { d3.select(this).call(text_axis.scale(axesY[d])); })


               axis_text = dmz.selectAll('.pc_axis_text')
                  .data(function(d) { return [d]; }, get_key);

               axis_text.enter()
                  .append("text")
                  .attr({
                     "class": "pc_axis_text"
                  })

               axis_text
                  .style({
                     "font-size": fontScale(plot_width) + "px",
                     "text-anchor": "middle",
                     "cursor": "move",
                     "shape-rendering": "crispEdges"
                  })
                  .attr("y", -9)
                  .attr('transform', 'rotate(' + options.plot.xAxis.rotate + ')')
                  .text(function(d) { return d; })

               axis_text.exit().remove();

               chartHolder.selectAll('.pc_axis text')
                  .style({
                      "font-size": fontScale(plot_width) + "px",
                      "text-shadow": "0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff",
                      "cursor": "move"
                  });
 
               chartHolder.selectAll('.pc_axis path')
                  .style({
                     "fill": "none",
                     "stroke": "#000",
                     "shape-rendering": "crispEdges"
                  });
 
               axis_brushes = dmz.selectAll('.brush')
                  .data(function(d) { return [d]; }, get_key);

               axis_brushes.enter()
                  .append('g')
                  .attr('class', 'brush')
               axis_brushes.exit().remove();

               axis_brushes
                  .each(function(d, i) {
                     d3.select(this)
                        .call(
                           axesY[d].brush = d3.svg.brush()
                             .y(axesY[d])
                             .on("brushstart", brushstart)
                             .on("brushend", brushend)
                             .on("brush", brush)
                       );
                  })
                  .selectAll("rect")
                     .attr("fill-opacity", ".3")
                     .attr("stroke", "#fff")
                     .attr("shape-rendering", "crispEdges")
                     .attr("x", -8)
                     .attr("width", 16)


               displayAverages();

               function displayAverages() {
                  averages = calcAverages();
                  
                  axis_avgs = dmz.selectAll('.pc_axis_avg')
                     .data(function(d) { return [d]; }, get_key);

                  axis_avgs.enter()
                     .append("text")
                     .attr({
                        "class": "pc_axis_avg"
                     })

                  axis_avgs
                     .style({
                        "font-size": fontScale(plot_width) + "px",
                        "text-anchor": "end",
                        "fill": "blue",
                        "cursor": "move",
                        "shape-rendering": "crispEdges"
                     })
                     .attr("y", plot_height + 25)
                     .text(function(d) { return averages[d]; })
                     .on('mousedown', function() { click_check = sorted_dimensions; })
                     .on('click', function(d, i) {
                        if (!idArrs(sorted_dimensions, click_check)) return;
    
                        var extents = axesY[d].brush.extent();
                        var axis_values = data.map(function(v) { return v[d]; } );
    
                        if (extents[0] != extents[1]) {
                           var filtered_data = data
                                 .filter(function(f) { return f[d] >= extents[0] && f[d] <= extents[1]; })
                           var context = filtered_data.map(function(m) { return m._context_; });
                        }
    
                        var item_values = data.map(function(m) {
                           var c = {};
                           dimensions.x.forEach(function(dim) { c[dim] = m[dim]; });
                           return c;
                        })
                        .filter(function(f) {
                           return (extents[0] == extents[1]) ? true : f[d] >= extents[0] && f[d] <= extents[1];
                        });
    
                        if (events.axis.y.click) {
                           events.axis.y.click( { d: d, i: i, axis_values: axis_values, extents: extents, item_values: item_values, context: context });
                        }
                     });
               }

               // hover event to show settings/help icons
               if (options.display.settingsImg) {
                  settings = hoverFrame.selectAll('image.settings')
                     .data([0])

                  settings.enter()
                    .append('image')
                    .attr('class', 'settings')
                    .on('click', function() { if (events.settings.click) events.settings.click(options.id + 'Settings'); }) 

                  settings.exit().remove();

                  settings
                     .attr({
                        'xlink:href': options.display.settingsImg,
                        'x': plot_width - 10, 
                        'y': plot_height / 2 + 30,
                        'height': '20px',
                        'width':  '20px',
                        'opacity': 0
                     })

               } else {
                  hoverFrame.selectAll('image.settings').remove();
               }

               if (options.display.helpImg) {
                  help = hoverFrame.selectAll('image.help')
                     .data([0])

                  help.enter()
                    .append('image')
                    .attr('class', 'help')
                    .on('click', function() { if (events.help.click) events.help.click(options.id); }) 

                  help.exit().remove();

                  help
                     .attr({
                        'xlink:href': options.display.helpImg,
                        'x': plot_width - 10, 
                        'y': plot_height / 2,
                        'height': '20px',
                        'width':  '20px',
                        'opacity': 0
                     })

               } else {
                  hoverFrame.selectAll('image.help').remove();
               }

               function showImgs() {
                  if (options.display.helpImg) help.attr('opacity', 1);
                  if (options.display.settingsImg) settings.attr('opacity', 1);
               }

               function hideImgs() {
                  if (options.display.helpImg) help.attr('opacity', 0);
                  if (options.display.settingsImg) settings.attr('opacity', 0);
               }

               // Returns the path for a given data point.
               function path(d) {
                 return pcoord_line(dimensions.x.map(function(p) { 
                    return [position(p), axesY[p](d[p])]; 
                 }));
               }

               function transition(g) {
                  return g.transition().duration(500);
               }

               function position(d) {
                  var v = drag_data[d];
                  return v == null ? axesX(d) : v;
               }

               function brushstart() {
                  d3.event.sourceEvent.stopPropagation();
                  if (events.brush.start) events.brush.start();
               }

               function brushend() {
                  if (events.brush.end) events.brush.end();
               }

               // Handles a brush event, toggling the display of foreground lines.
               // doesn't handle ordinal scales...
               function brush() {
                  displayAverages();
                  if (events.brush.brushed) events.brush.brushed();
                  var actives = dimensions.x.filter(function(p) { return !axesY[p].brush.empty(); });
                  var extents = actives.map(function(p) { return axesY[p].brush.extent(); });
                  lines.style("display", function(d) {
                    return actives.every(function(p, i) {
                      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                    }) ? null : "none";
                  });
               }

               /* Ordinal Scale brushing
                // http://bl.ocks.org/chrisbrich/4173587
                var brushed = function(){
                   var selected =  yScale.domain().filter(function(d) {
                        return (brush.extent()[0] <= yScale(d)) && (yScale(d) <= brush.extent()[1])
                  });                     
               */

               // Extract the list of dimensions and create a scale for each.
               function getDimensions() {
                  var scales = options.data.scales;
                  var scale_keys = Object.keys(scales);

                  var y = axesY || {};

                  var x = d3.keys(data[0]).filter(function(d) {
                     if (options.data.hide.indexOf(d) >= 0) return false;
                     if (d == '_context_') return false;

                     if (scale_keys.indexOf(d) >= 0) {

                        y[d] = y[d] || scales[d].scale;

                        y[d]
                           .domain(scales[d].domain)
                           .range([plot_height, 0]);

                        // TODO: make this work...
                        if (scales[d].type == 'date') {
                           y[d].tickFormat(d3.time.format("%Y-%m-%d"))
                        }

                     } else {
                        y[d] = y[d] || d3.scale.linear();

                        var extent = d3.extent(data, function(p) { return +p[d]; });
                        if (data.length == 1) {
                           extent = [Math.min(0, extent[0]), Math.max(extent[1], 100)];
                        }

                        y[d]
                           .domain(extent)
                           .range([plot_height, 0]);
                     }

                     return true;
                  });

                  return { x: x, y: y };
               }

            }

        });
    }

    var get_key = function(d) { return d && d.key; };

    function line_color(d, i) {
       if (options.plot.lines.colorKey) {
          if (d[options.plot.lines.colorKey] && colors[d[options.plot.lines.colorKey]]) {
             var color = colors[d[options.plot.lines.colorKey]];
             return color;
          } else {
             return '#ddd';
          }
       }
       return color_scale(i);
    }

    // ACCESSORS

    chart.exports = function() {
       return {};
    }

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
    }

    function keyWalk(valuesObject, optionsObject) {
        if (!valuesObject || !optionsObject) return;
        var vKeys = Object.keys(valuesObject);
        var oKeys = Object.keys(optionsObject);
        for (var k=0; k < vKeys.length; k++) {
           if (oKeys.indexOf(vKeys[k]) >= 0) {
              var oo = optionsObject[vKeys[k]];
              var vo = valuesObject[vKeys[k]];
              if (typeof oo == 'object' && typeof vo !== 'function' && oo.constructor !== Array) {
                 keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
              } else {
                 optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
              }
           }
        }
    }

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return options.width;
        options.width = value;
        chart.update();
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        chart.update();
        return chart;
    };

    chart.data = function(value) {
        if (!arguments.length) return data;
        if (lines) lines.style('display', null);
        if (events.brush.clear) events.brush.clear();
        chart.clearBrushes();
        data = value;
        if (sorted_dimensions == undefined) {
           sorted_dimensions = Object.keys(data[0]).filter(function(d) {
              if (options.data.hide.indexOf(d) > 0) return false;
              if (d == '_context_') return false;
              return true;
           });
        }
        return chart;
    };

    chart.filteredData = filteredData;
    function filteredData() {
       var f_lines = [];
       lines.each(function(d) { if (d3.select(this).style('display') == 'inline') f_lines.push(d); })
       return f_lines;
    }

    chart.activeBrushes = function() {
       var active = [];
       if (axesY) {
          Object.keys(axesY).forEach(function(e) { 
             if (!axesY[e].brush.empty()) active.push(e);
          });
       }
       return active;
    }

    chart.clearBrushes = function() {
       var active = chart.activeBrushes();
       if (active.length) d3.selectAll('.brush rect.extent').attr('height', 0) // Dirty Hack
       active.forEach(function(e) {
          axesY[e].brush.clear(); // Not sufficient, perhaps v4.0 will solve
       });
       if (lines) lines.each(function(d) { d3.select(this).style('display', 'inline'); })
    }

    chart.activeAxes = function(dims) {
       if (!arguments.length) return sorted_dimensions || Object.keys(axesY);
       sorted_dimensions = dims;
    }

    chart.hide = function(columns) {
       if (!arguments.length) return options.data.hide;
       if (columns.constructor !== Array) columns = [columns];
       options.data.hide = columns;
       return chart;
    }

    chart.scales = function(scales) {
       if (!arguments.length) return options.data.scales;
       options.data.scales = scales;
       return chart;
    }

    chart.update = function(opts) {
      if (events.update.begin) events.update.begin(); 
      if (typeof update === 'function' && data) update(opts);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
    }

    chart.colors = function(color3s) {
        if (!arguments.length) return colors;
        if (typeof color3s !== 'object') return false;
        var keys = Object.keys(color3s);        
        if (!keys.length) return false;
        // remove all properties that are not colors
        keys.forEach(function(f) { if (! /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color3s[f])) delete color3s[f]; })
        if (Object.keys(color3s).length) {
           colors = color3s;
        } else {
           colors = JSON.parse(JSON.stringify(default_colors));
        }
        return chart;
    }

    function idArrs(a, b) {
        if (!Array.isArray(a) || !Array.isArray(b)) return false;
        if (a.length != b.length) return false;
        for (var i=0; i < a.length; i++) {
           if (a[i] != b[i]) return false;
        }
        return true;
    }

    function calcAverages() {
       // these are averages, not weighted averages...
       var averages = {};
       sorted_dimensions.forEach(function(dim) { averages[dim] = 0; });
       var fd = filteredData();
       fd.forEach(function(row) {
          sorted_dimensions.forEach(function(dim) {
             averages[dim] += +row[dim];
          });
       });
       sorted_dimensions.forEach(function(dim) { averages[dim] = fd.length ? (averages[dim] / fd.length).toFixed(2) : '' });
       return averages;
    };

   return chart;
}
