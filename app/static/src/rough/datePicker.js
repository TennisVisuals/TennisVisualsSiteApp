function datePicker() {

   var current_year = new Date().getFullYear();
   var options = {

      width: 890,
      height: 30,

      start_date: new Date(current_year + '-01-01'),
      end_date: new Date(),
      dateformat: d3.time.format('%m-%Y'),
    
      dateString: { 
         // weekday : 'long', 
         year    : 'numeric', 
         month   : 'long', 
         // day     : 'numeric' 
      },

      display: {
         transition_time: 0,
         sizeToFit: true,
      },

      margin: {top: 0, right: 30, bottom: 0, left: 30},
   }
    
    var events = {
       'update':  { 'begin': null, 'end': null },
       'brush':   { 'start': null, 'move': null, 'end': null, 'clear': null },
    };

   var dom_parent;
   var selected_range;
   var update;
   var brush;
   var brushg;

   function chart(selection) {
      selection.each(function () {

         dom_parent = d3.select(this);

         var root = dom_parent.append('svg')
            .attr({
               'class'     : 'datePicker',
               'width'     : options.width,
               'height'    : options.height
            })

         var picker = root.append("g").attr('class', 'picker');

         update = function(opts) {
            if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
               var dims = dom_parent.node().getBoundingClientRect();
               options.width = Math.max(dims.width, 300);
            }

            root
               .attr({
                  'width'     : options.width,
                  'height'    : options.height
               })

            var plot_width = options.width - options.margin.left - options.margin.right;

            picker
               .attr({
                  "transform": "translate("+options.margin.left+","+options.margin.top+")"
               });
              
            var rangeLine = picker.selectAll('.rangeLine')
               .data([0])

            rangeLine.enter()
               .append("line");

            rangeLine.exit().remove();

            rangeLine
               .attr({ 
                  "class"           : "rangeLine",
                  "shape-rendering" : "crispEdges",
                  "stroke"          : "#777",
                  "stroke-dasharray": "2,2",
                  "x2"              : plot_width,
                  "y1"              : options.height / 2,
                  "y2"              : options.height / 2,
               })

            var tb = picker.selectAll('.dateAnchor')
               .data([options.start_date, options.end_date])

            tb.enter()
               .append('text')   
               .attr({
                  "class"        : "dateAnchor",
                  "id"           : function(d, i) { return "dA" + i; },
                  "text-anchor"  : function(d, i) { return i < 1 ? "start" : "end"},
                  "alignment-baseline": "middle"
               })

            tb.exit().remove()

            tb
               .attr({ "transform"    : transl, })
               .text(function(d) { return d.toLocaleDateString("en-US", options.dateString); })
               .each(function(d, i) { bkgnd(d3.select(this), i); });

            function bkgnd(txtElement, i) {
               var bbox = txtElement.node().getBBox();
               var padding = 6;

               var bk = picker.selectAll('#bkgnd' + i)
                  .data([0])

               bk.enter()
                  .insert("rect", "text")
                  .attr({ "id"        : "bkgnd" + i, })
                  .style("fill", "white");

               bk.exit().remove();

               bk
                  .attr({
                     "transform" : transl(null, i),
                     "x"         : bbox.x - padding,
                     "y"         : bbox.y - padding,
                     "width"     : bbox.width + (padding*2),
                     "height"    : bbox.height + (padding*2),
                  })
            }

            function transl(d, i) {
               var t = "translate(";
               t = t + (i < 1 ? 0 : plot_width); 
               t = t + ","+ (options.height - options.margin.bottom) / 2 + ")";
               return t;
            }

            // Selection brush
            var x = d3.time.scale();
            var y = d3.scale.linear();
            x.domain([options.start_date, options.end_date]).rangeRound([0, plot_width]);
            y.domain([0,1]).rangeRound([0, options.height]);

            // Selection caption
            picker.selectAll('.selection_caption').remove();

            var selection_caption = picker.append('g')
              .attr({
                 'class'         : 'selection_caption',
                 'display'       : 'none'
              })
             
            selection_caption.append('rect')
               .attr({
                  'height'       : 14,
                  'width'        : 90,
                  'fill'         : "#fff",
                  'rx'           : 4,
                  'ry'           : 4,
               })
               .style({
                  'stroke'       : 'black',
                  'opacity'      : 0.8,
                  'stroke-width' : 0.3,
               })
              
            selection_caption.append('text')
               .attr({
                  'x'            : 2,
                  'y'            : 11,
               })
               .style({
                  'font-size'    : 10,
                  'font-family'  : 'sans-serif',
               })

            picker.selectAll('.brush').remove();

            brush = d3.svg.brush()
                .x(x)
                .on("brushstart", brushstart)
                .on("brush", brushmove)
                .on("brushend", brushend)
                
            brushg = picker.append("g")
                .attr({
                   "class"       : "brush",  
                   "stroke"      : "rgb(108, 122, 168)",
                   "fill"        : "rgb(68, 104, 168)",
                   "fill-opacity": .10,
                   "shape-rendering": "crispEdges",
                })
                .call(brush)
                
            brushg.selectAll("rect")
                .attr({
                   "height"      : options.height
                });
                
            brushg.selectAll(".resize")
               .append("path")
               .attr({
                 "fill"          : "#eee",
                 "stroke"        : "#666",
                 "d"             : resizePath,
               })

            function brushstart() {
               picker.selectAll('.selection_caption').style('opacity', .8);
               if (typeof events.brush.start == 'function') { events.brush.start(); }
            }
             
            function brushmove() {
              var g = d3.select(this.parentNode);
              brushUpdate();

              /*
              var extent = brush.extent();
              var start = d3.time.day.round(extent[0]);
              var end = d3.time.day.round(extent[1]);
              if (start.getTime() > end || start.valueOf() == end.valueOf()) {
                 selection = null;  
              } else {
                 end.setHours(23,59,59,999); // make sure set for end of day
                 selection = [start, end];
              }
              extent = extent.map(d3.time.day.round);
              console.log(extent);

              brushg
                  .call(brush.extent(extent.map(d3.time.day.round)))
                .selectAll(".resize")
                  .style("display", selection && start.getTime() <= end.getTime() ? null : 'none');
              */
              updateSelectionCaption();

              if (typeof events.brush.move == 'function' && selected_range) {
                 var range = selected_range ? selected_range : [options.start_date, options.end_date];
                 events.brush.move({ range: range });
              }
            }
             
            function brushend() {
               picker.selectAll('.selection_caption').style('opacity', 0);
               if (typeof events.brush.end == 'function') {
                  var range = selected_range ? selected_range : [options.start_date, options.end_date];
                  events.brush.end({ range: range });
               }
            }
             
            function updateSelectionCaption() {
              selection_caption
                  .attr('display', function() { return selected_range && selected_range[0].getTime() <= selected_range[1].getTime() ? null : 'none'} )
                  .attr('transform', function() { return selected_range && 'translate('+(x(selected_range[0]))+','+(0)+')'} )
                .select('text')
                  .text(selected_range && options.dateformat(selected_range[0]) + " \u25b8 " + options.dateformat(selected_range[1]))
            }    
         }           
      })
   }
     
   function resizePath(d) {
     var e = +(d == "e"),
         x = e ? 1 : -1,
         h = options.height * 2/3,
         y = (options.height - h) / 2;

     return "M" + (.5 * x) + "," + y
         + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
         + "V" + (y + h - 6)
      + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (y + h)
      + "Z"
      + "M" + (2.5 * x) + "," + (y + 8)
      + "V" + (y + h - 8)
      + "M" + (4.5 * x) + "," + (y + 8)
      + "V" + (y + h - 8);
   }

   function brushUpdate() {
        var extent = brush.extent();
        var start = d3.time.day.round(extent[0]);
        var end = d3.time.day.round(extent[1]);
        if (start.getTime() > end || start.valueOf() == end.valueOf()) {
           selected_range = null;  
        } else {
           end.setHours(23,59,59,999); // make sure set for end of day
           selected_range = [start, end];
        }
        extent = extent.map(d3.time.day.round);

        brushg
            .call(brush.extent(extent.map(d3.time.day.round)))
          .selectAll(".resize")
            .style("display", selected_range && start.getTime() <= end.getTime() ? null : 'none');
        // updateSelectionCaption();
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

    chart.update = function(opts) {
      if (events.update.begin) events.update.begin(); 
      if (typeof update === 'function') update(opts);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
    }

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.data = function(value) {
        if (!arguments.length) return [options.start_date, options.end_date];
        if (!Array.isArray(value)) return;
        if (value[0] && value[1] && value[0].valueOf() > value[1].valueOf()) {
           value.reverse();
        }
        options.start_date = value[0] ? value[0] : new Date(current_year + '-01-01');
        options.end_date = value[1] ? value[1] : new Date();
        return chart;
    };

   chart.set = function(start_date, end_date) {
      brush.extent([start_date, end_date])
      brush(d3.select(".brush").transition());
      brush.event(d3.select(".brush"));
      brushUpdate();
   }
   return chart;
}

