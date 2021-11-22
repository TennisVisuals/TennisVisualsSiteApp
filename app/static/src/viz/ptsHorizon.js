(function() {

   ptsHorizonGroup = function() {
      var data = [];
      var update;

      var options = {
          id:         0,
          width:      900,     
          height:     80,
          margins:  { spacing: 10 },
          display:  {
             ppp:             undefined,     // pixels per point
             bands:           3,
             mode:            'mirror',
             orientation:     'horizontal',
             transition_time: 1000,
             interpolate:     'basis',
             sizeToFit:       false
         },
         bounds: { vRangeMax: 24 },
         color: {
            range: ["#6b6ecf", "#f0f0f0", "#f0f0f0", "#a55194"]
         }
      }

      var events = {
         'update':  { 'begin': null, 'end': null }
      };

      function chart(selection) {
       selection.each(function() {

         var root = selection.append('div').attr('id', 'ptsHorizonGroup' + options.id)

         update = function(opts) {
            selection.each(function() {

               if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
                  var dims = selection.node().getBoundingClientRect();
                  if (horizontal) {
                     options.width = Math.max(dims.width, 100);
                  } else {
                     options.height = Math.max(dims.height, 80);
                  }
               }

               root.selectAll('.hz' + options.id).remove();

               data.forEach(function(d, i) {
                  var container = root
                     .append('div')
                     .attr('class', 'flex-chart-group hz' + options.id)
                     .attr('id', 'hz' + options.id + 'x' + i);

                  var score = d.horizon.data().score();
                  var legend = score.winner + ' d. ' + score.loser;
                  var meta = d.horizon.data().metadata();
                  var match_score = d.horizon.data().score().match_score;
                  var display = meta.tournament.round + ': ' + match_score;
              
                  container
                     .append('div')
                     .attr('class', 'flex-h-score')
                     .append('p')
                     .text(d.score)
                     .style("color", function() { return d.won ? 'green' : 'red'; })
                     .on('click', function() { 
                        // console.log(d.umo); 
                        // TODO: events.click to invoke clickMatch
                     })

                  container
                     .append('div')
                     .attr('class', 'flex-h-pts')
                     .call(d.horizon);

                  d.horizon.update();
               });
            });
         }
       });
      }

     // allows updating individual options and suboptions
     // while preserving state of other options
     chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
     }

     chart.events = function(functions) {
        if (!arguments.length) return events;
        keyWalk(functions, events);
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

     chart.data = function(dataset) {
       if (!arguments.length) return data;
       data = dataset;
       return chart;
     }

     chart.update = function(opts) {
       if (events.update.begin) events.update.begin(); 

       update(opts);

        setTimeout(function() { 
          if (events.update.end) events.update.end(); 
        }, options.display.transition_time);
     }

     // TODO: calculate the middle range colors
     chart.colors = function(colors) {
      if (!arguments.length) return [options.color.range[0], options.color.range[3]];
         options.color.range = [colors[0], '#f0f0f0', '#f0f0f0', colors[1]];
         // set colors for each chart in the group
         data.forEach(function(pHc) { pHc.colors(colors); });
         return chart;
      };

    return chart;
  };

  ptsHorizon = function() {
      var data;
      var update;
      var horizon_sets = [];

      var options = {
          id:         0,
          width:      900,     
          height:     80,
          margins:  { spacing: 10 },
          position: { x: 0, y: 0 },
          elements: { brush: true },
          display:  {
             ppp:             undefined,     // pixels per point
             bands:           3,
             mode:            'mirror',
             orientation:     'horizontal',
             transition_time: 1000,
             interpolate:     'basis',
             sizeToFit:       false
         },
         bounds: { vRangeMax: 24 },
         color: {
            range: ["#6b6ecf", "#f0f0fa", "#f6edf4", "#a55194"]
         }
      }

      var events = {
         update    : { 'begin': null, 'end': null },
         brush     : { 'brushing': null, 'start': null, 'end': null },
         chart     : { 'click': null },
         mouseover : undefined,
         mouseout  : undefined
      };

      function showMatch(d) {
         if (events.chart.click) { 
            events.chart.click({umo: d});   
         }
      }

      // prepare charts
      var horizon_charts = [];
      for (var s=0; s < 5; s++) {
         horizon_charts.push(horizonChart());
      }

      function chart(selection) {
       selection.each(function() {

         var dom_parent = d3.select(this);
         var root = dom_parent.append('svg').attr('id', 'ptsHorizon' + options.id)

         for (var s=0; s < 5; s++) {
            horizon_sets[s] = root.append("g").attr("id", "horizon" + options.id + s).style('display', 'none')
            horizon_sets[s]
               .call(horizon_charts[s]);
         }

         update = function(opts) {

            if (options.elements.brush) options.margins.spacing = 0;

            var horizontal = options.display.orientation == 'horizontal' ? true : false;

            if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
               var dims = dom_parent.node().getBoundingClientRect();
               if (horizontal) {
                  options.width = Math.max(dims.width, 100);
               } else {
                  options.height = Math.max(dims.height, 80);
               }
            }

            var set_map = setMap(data);

            // calculate pixels per point
            var num = set_map.map(function(m) { return m.length; }).reduce(function(a, b) { return a + b; });
            var ppp_range = horizontal ? options.width : options.height;
            var ppp = (ppp_range - (set_map.length * options.margins.spacing)) / num;

            root
               .attr('id', 'ptsHorizon' + options.id)
               .attr('width', options.width)
               .attr('height', options.height)

            var xadd = 0;
            var yadd = 0;
            for (var s=0; s < horizon_charts.length; s++) {
               if (set_map[s]) {
                  var sdata = set_map[s].map(function(m, i) { return [i + 1, m]; });
                  if (!sdata.length) continue;

                  horizon_charts[s]
                     .height(options.height)
                     .width(options.width)
                     .options({ 
                        id: options.id + 'c' + s, 
                        display: { ppp: ppp, bands: options.display.bands, orientation: options.display.orientation },
                        position: { 
                           x: options.position.x + xadd, 
                           y: options.position.y + yadd
                        },
                        bounds: { vRangeMax: options.bounds.vRangeMax }
                     })
                     .events({
                        chart: { click: showMatch }, 
                        path: { 
                           mouseover: options.elements.brush ? undefined : events.mouseover, 
                           mouseout: options.elements.brush ? undefined : events.mouseout 
                        }
                     })
                     .duration(options.display.transition_time)
                     .colors(options.color.range)
                     .mode(options.display.mode)
                     .data(data)
                     .sdata(sdata)
                     .update()

                  if (options.display.orientation == 'horizontal') {
                     xadd += ppp * set_map[s].length + options.margins.spacing;
                  } else {
                     yadd += ppp * set_map[s].length + options.margins.spacing;
                  }

                  horizon_sets[s].style('display', 'inline')

               } else {
                  horizon_sets[s].style('display', 'none')
               }
            }

            if (options.elements.brush) {
               var x1 = d3.scale.linear() 
                  .domain([0, num])
                  .range([0, options.width])
               var x2 = d3.scale.linear() 
                  .domain(x1.domain())
                  .range([0, options.width])
   
               var brush = d3.svg.brush().x(x2)
                  .on("brush", brushing)
                  .on("brushstart", brushStart)
                  .on("brushend", brushEnd)
  
               var brushes = root.selectAll('.brush' + options.id)
               brushes.remove();

               root.append("g")
                   .attr("class", "brush" + options.id)
                   .style({
                      'stroke':            '#fff',
                      'fill-opacity':      .125,
                      'shape-rendering':   'crispEdges'
                   })
                   .call(brush)
                 .selectAll("rect")
                   .attr("y", -6)
                   .attr("height", options.height + 7);
       
               function brushing() {
                  x1.domain(brush.empty() ? x2.domain() : brush.extent());
                  if (events.brush.brushing) events.brush.brushing(brush.extent());
               }
               function brushStart() {
                  x1.domain(brush.empty() ? x2.domain() : brush.extent());
                  if (events.brush.start) events.brush.start(brush.extent());
               }
               function brushEnd() {
                  x1.domain(brush.empty() ? x2.domain() : brush.extent());
                  if (events.brush.end) events.brush.end(brush.extent());
               }
            } else {
               root.select('.brush' + options.id).remove();
            }
         }

         function setMap(md) {
            var z1 = [];
            var z2 = [];

            var sets = md.sets();
            for (var s=0; s < sets.length; s++) {
               z1 = z1.concat(sets[s].player_data()[0].map(function(m) { return m.pts }));
               z2 = z2.concat(sets[s].player_data()[1].map(function(m) { return m.pts }));
            }
            gai = function(arr, val) { 
               return arr.reduce(function(a, e, i) { if (e === val) a.push(i); return a; }, []); 
            }
            var set_ends = gai(z1, 0).concat(gai(z2, 0));
            set_ends.sort(function(a, b){return a-b});

            // fix for sets that end early
            if (set_ends.indexOf(z1.length - 1) < 0) set_ends.push(z1.length - 1);

            var diff = z1.map(function(m, i) { return m - z2[i]; });
            var sm = set_ends.map(function(m, i) {
               return diff.slice(i == 0 ? 0 : set_ends[i - 1] + 1, m + 1);
            });

            return sm;
         }
       });
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
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        return chart;
    };
 
    chart.data = function(umo) {
       if (!arguments.length) return data;
       data = umo;
       return chart;
    }

    chart.update = function(opts) {
      if (events.update.begin) events.update.begin(); 
      if (typeof update === 'function') update(opts);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
    }

    chart.bands = function(bands) {
      if (!arguments.length) return options.display.bands;
      options.display.bands = +bands;
      return chart;
    };

    chart.mode = function(mode) {
      if (!arguments.length) return options.display.mode;
      options.display.mode = mode + "";
      return chart;
    };

    chart.duration = function(transition_time) {
      if (!arguments.length) return options.display.transition_time;
      options.display.transition_time = +transition_time;
      return chart;
    };

    chart.orientation = function(orientation) {
      if (!arguments.length) return options.display.orientation;
      options.display.orientation = orientation + "";
      return chart;
    };

    chart.colors = function(colors) {
      if (!arguments.length) return [options.color.range[0], options.color.range[3]];
      options.color.range = [colors[0], '#f0f0f0', '#f0f0f0', colors[1]];
      return chart;
    };

    return chart;
  };

  /*
  // ttip element needs to be exist in HTML and scoped variable defined
  function ttip_hide() { 
      ttip.transition().duration(500).style("opacity", 0) 
   }

   function ttip_show(d) {
      var x_offset = 30;
      var y_offset = 60;
      ttip.style('font', '12px sans-serif');
      ttip.style('width', '230px');
      var score = d.score().match_score; 
      var players = d.players();
      if (score) {
         ttip.transition() .duration(200).style("opacity", .7);    
         ttip.html( players[0] + ' v. ' + players[1] + '<br>' + score )     
            .style("left", (d3.event.pageX - x_offset) + "px")             
            .style("top", (d3.event.pageY - y_offset) + "px");
      }
   }
   */

})();
