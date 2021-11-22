function statView() {

    var data = [];
    var update;
    var dom_parent;
    var transition_time = 1000;

    var options = {
        id: 'sv',
        fullWidth: window.innerWidth,
        // fullHeight: window.innerHeight,
        fullHeight: 300,
        fullRowHeight: 30,
        margins: {
           top:    2, bottom: 2, 
           left:   10, right:  10
        },
       display: {
          sizeToFit: { width: true, height: false },
          responsive: false
       },
       colors: {
          players: { 0: "#a55194", 1: "#6b6ecf" }
       }
    }

    function width() { return options.fullWidth - options.margins.left - options.margins.right }
    function height() { return options.fullHeight - options.margins.top - options.margins.bottom }
    function rowHeight() { return options.fullRowHeight - options.margins.top - options.margins.bottom }
    function svgTranslate(vector) { return "translate(" + vector[0] + "," + vector[1] + ")" }

    var events = {
       'update':  { 'begin': null, 'end': null }
    }

    function chart(selection) {
      selection.each(function () {
         dom_parent = d3.select(this);

         var root = dom_parent.append('div').attr('id', options.id)

         update = function(opts) {

            var Fdata = data.filter(function(f) { return f.numerator && (f.numerator[0] || f.numerator[1]) })

            var dims = selection.node().getBoundingClientRect()
            if (options.display.sizeToFit.width || (opts && opts.sizeToFit && opts.sizeToFit.width)) {
               options.fullWidth = Math.max(dims.width, 100)
            }
            if (options.display.sizeToFit.height || (opts && opts.sizeToFit && opts.sizeToFit.height)) {
               options.fullHeight = Math.max(dims.height, 100)
            }

            options.width = width()
            options.height = height()
            options.rowHeight = rowHeight()
            options.marginTranslate = [options.margins.left, options.margins.top]

            var font_size = options.rowHeight * .5;
            // var middle = options.fullWidth / 2;
            // var itemCount = Fdata.length;
            var itemContainer = root.selectAll("svg")
               .data(Fdata)

            itemContainer.enter()
               .append("svg")
               .attr('id', function(d, i) { return options.id + 'i' + i })

            itemContainer.exit().remove()

            itemContainer
               .attr("width", function(s) { return options.fullWidth })
               .attr("height", function(s) { return options.fullRowHeight })

            var item = itemContainer.selectAll('g')
               .data(function(d) { return [d] })

            item.enter()
               .append("g")

            item.exit().remove()

            item
               .attr("width", function(s) { return options.fullWidth })
               .attr("height", function(s) { return options.rowHeight })
               .attr("transform", function(s) {
                   return svgTranslate(options.marginTranslate)
               });

            var textElements = item.selectAll('text')
               .data(function(d) {
                  var elements = []
                  var player0 = (d.numerator != undefined && d.denominator != undefined) ? 
                                d.numerator[0] + '/' + d.denominator[0] : 
                                (d.numerator != undefined) ? d.numerator[0] : ''
                  var player1 = (d.numerator != undefined && d.denominator != undefined) ? 
                                d.numerator[1] + '/' + d.denominator[1] : 
                                (d.numerator != undefined) ? d.numerator[1] : ''

                  if (d.pct != undefined) {
                     if (options.width > 400) {
                        player0 = Math.round(d.pct[0]) + '% (' + player0 + ')'
                        player1 = Math.round(d.pct[1]) + '% (' + player1 + ')'
                     } else {
                        player0 = Math.round(d.pct[0]) + '%'
                        player1 = Math.round(d.pct[1]) + '%'
                     }
                  }
                  elements.push({
                     text: d.name,
                     anchor: 'middle',
                     translate: [options.fullWidth / 2, options.rowHeight / 4]
                  });
                  elements.push({
                     text: player0,
                     anchor: 'start',
                     translate: [0, options.rowHeight / 4]
                  });
                  elements.push({
                     text: player1,
                     anchor: 'end',
                     translate: [options.width, options.rowHeight / 4]
                  });
                  return elements;
               })

            textElements.enter().append('text')

            textElements.exit().remove()

            textElements
               .text(function(d) { return d.text })
               .style({
                  'text-anchor': function(d) { return d.anchor },
                  'alignment-baseline': 'middle',
                  'font-size':   font_size + 'px',
                  'fill': 'black',
                  'font-weight': function(d) { return false ? 'bold' : 'normal' }
               })
               .attr("transform", function(d) {
                   return svgTranslate(d.translate);
               });

            var barScale = d3.scale.linear().domain([ 0, 100 ]).range([0, options.width])

            var bar = item.selectAll('rect')
               .data(calcBarData);

            bar.enter()
               .append('rect')
               .attr({
                  'width': barWidth,
                  'height': barHeight,
                  "fill": function(d, i) { return options.colors.players[i] },
                  "transform": barTransform
               })

            bar.exit().remove()

            bar
               .transition().duration(transition_time)
               .attr({
                  'width': barWidth,
                  'height': barHeight,
                  "fill": function(d, i) { return options.colors.players[i] },
                  "transform": barTransform
               })

            function barWidth(d) {
               var s = !isNaN(d) ? barScale(d) : 0; 
               var w = s < 0 || isNaN(s) ? 0 : s; 
               return w;
            }

            function barHeight(d) { return options.rowHeight / 2; };

            function barTransform(d, i) {
               var xoffset = i ? options.width - barScale(d) : 0
               return svgTranslate([!isNaN(xoffset) ? xoffset : 0, options.rowHeight / 2])
            }

            function calcBarData(d) {
               if (d.numerator != undefined) {
                  var total = d.numerator.reduce(function(a, b) { return a + b });
                  if (total != 0) {
                     var pct1 = (d.numerator[0] / total).toFixed(1) * 100
                     pct1 = pct1 > 100 ? 100 : pct1;
                     var pct2 = 100 - (!isNaN(pct1) ? pct1 : 0);
                     if (d.numerator[0] < 0 && d.numerator[1] < 0) { 
                        return [pct2, pct1]; 
                     } else {
                        return [pct1, pct2]
                     }
                  } else if (d.numerator[0] > d.numerator[1]) {
                     return [100, 0];
                  } else if (d.numerator[1] > d.numerator[0]) {
                     return [0, 100];
                  }
               }
               return [];
            }
         }

      })
    }

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
      if (events.update.begin) events.update.begin()
      if (typeof update === 'function' && data) update(opts)
       setTimeout(function() { 
         if (events.update.end) events.update.end()
       }, options.display.transition_time)
    }

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        return chart;
    };

    window.addEventListener( 'resize', scaleChart, false );

    function scaleChart() {
       if (!options.display.responsive) return;
       chart.update();
    }

    return chart
}
