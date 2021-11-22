(function() {

  horizonChart = function() {

     var update;
     var data;
     var sdata = [];
     var options = {
         id:         0,
         width:      960,     
         height:     100,
         position: { x: 0, y: 0 },
         elements: { brush: false },
         display:  {
            ppp:              undefined,     // pixels per point
            bands:            1,
            mode:             'mirror',
            orientation:      'horizontal',
            transition_time:  0,
            interpolate:      'basis',
        },
        bounds: { vRangeMax: undefined }
     }

    var color = d3.scale.linear()
        .domain([-options.display.bands, 0, 0, options.display.bands])
        .range(["#08519c", "#bdd7e7", "#bae4b3", "#006d2c"]);

    var events = {
       'update':  { 'begin': null, 'end': null },
       'chart':   { 'click': null },
       'path':    { 'mouseover': null, 'mouseout': null },
       'xlink':   { 'click': null },
       'brush' :  { 'update': null }
    };

    function chart(selection) {
       selection.each(function() {
          var root = d3.select(this).append('svg:g') 
            .attr('class', 'hcc')
            .append("a")

          update = function() {
             var horizontal = options.display.orientation == 'horizontal' ? true : false;
             var band_range = horizontal ? options.height : options.width;
             var ppp = options.display.ppp ? options.display.ppp : band_range / sdata.length;
             var zwidth  = horizontal ? ppp * sdata.length : options.width;
             var zheight = horizontal ? options.height : ppp * sdata.length;

             root
                .attr("xlink:href", events.xlink.click)
                .attr('width', zwidth)
                .attr('height', zheight)
                .attr("transform", "translate(" + +options.position.x + "," + +options.position.y + ")")
                .on('click', function() { if (events.chart.click) events.chart.click(data); })

             var xExtent = d3.extent(sdata.map(function(d) { return d[0]; }));
             var yExtent = d3.extent(sdata.map(function(d) { return d[1]; }));

             var x = d3.scale.linear()
                .domain(xExtent)
                .range([0, ppp * sdata.length]);

             var y = d3.scale.linear()
                .domain([0, options.bounds.vRangeMax ? options.bounds.vRangeMax : yExtent[1]])
                .range([0, band_range * options.display.bands]);

             if (horizontal) {
                var transform = (options.display.mode == "offset")
                     ? function(d) { return "translate(0, " + (d + (d < 0) - options.display.bands) * band_range + ")"; }
                     : function(d) { return (d < 0 ? "scale(1,-1)" : "") + "translate(0, " + (d - options.display.bands) * band_range + ")"; };
             } else {
                var transform = (options.display.mode == "offset")
                     ? function(d) { return "translate(" + (d + (d < 0) - options.display.bands) * band_range + ", 0)"; }
                     : function(d) { return (d < 0 ? "scale(-1,1)" : "") + "translate(" + (d - options.display.bands) * band_range + ", 0)"; };
             }

             var defs = root.selectAll("defs")
                .data([null]);

             defs.enter()
               .append("defs")
               .append("clipPath")
               .attr("id", "horizon_clip" + options.id)
               .append("rect")
               .attr("width", zwidth)
               .attr("height", zheight);

             defs.select("rect")
               .transition().duration(options.display.transition_time)
               .attr("width", zwidth)
               .attr("height", zheight);

             root.selectAll("g")
                .data([null])
               .enter().append("g")
                .attr("clip-path", "url(#horizon_clip" + options.id + ")");

             var path = root.select("g").selectAll("path")
                   .data(d3.range(-1, -options.display.bands - 1, -1).concat(d3.range(1, options.display.bands + 1)), Number);

             if (horizontal) {
                var horizonArea = d3.svg.area()
                   .interpolate(options.display.interpolate)
                   .x(function(d) { return x(d[0]); })
                   .y0(band_range * options.display.bands)
                   .y1(function(d) { return band_range * options.display.bands - y(d[1]); })
                   (sdata);
             } else {
                var horizonArea = d3.svg.area()
                   .interpolate(options.display.interpolate)
                   .y(function(d) { return x(d[0]); })
                   .x0(band_range * options.display.bands)
                   .x1(function(d) { return band_range * options.display.bands - y(d[1]); })
                   (sdata);
             }

             path.enter().append("path")
                .style("fill", color)
                .attr("transform", transform)
                .attr("d", horizonArea);

             path.exit().remove()

             path
                // .on('mouseover', function(d, i) { if (events.path.mouseover) events.path.mouseover(d, i, this); } )
                .on('mouseover', function() { if (events.path.mouseover) events.path.mouseover(data); } )
                .on('mouseout', function(d, i) { if (events.path.mouseout) events.path.mouseout(d, i, this); } )
                .transition().duration(options.display.transition_time)
                .style("fill", color)
                .attr("transform", transform)
                .attr("d", horizonArea)
    
             if (options.elements.brush) {
                var x1 = d3.scale.linear() 
                   .domain(xExtent)
                   .range([0, zwidth])
                var x2 = d3.scale.linear() 
                   .domain(x1.domain())
                   .range([0, zwidth])
    
                var brush = d3.svg.brush().x(x2).on("brush", brushed);
    
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
        
                function brushed() {
                   x1.domain(brush.empty() ? x2.domain() : brush.extent());
                   var extent = brush.extent();
                }
             } else {
                root.select('.brush' + options.id).remove();
             }
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
              if (typeof oo == 'object' && typeof vo !== 'function' && oo && oo.constructor !== Array) {
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
 
    chart.data = function(values) {
       if (!arguments.length) return data;
       if ( values.constructor === Function ) { data = values; }
       return chart;
    }

    chart.sdata = function(values) {
       if (!arguments.length) return sdata;
       if ( values.constructor === Array ) { sdata = values; }
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
      color.domain([-options.display.bands, 0, 0, options.display.bands]);
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

    chart.colors = function(color_range) {
      if (!arguments.length) return color.range();
      color.domain([-options.display.bands, 0, 0, options.display.bands]);
      color.range(color_range);
      return chart;
    };

    return chart;
  };

})();
