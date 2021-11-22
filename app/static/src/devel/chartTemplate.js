function template() {

    var data;
    var dom_parent;
    var plot_width;
    var plot_height;
    var update;

    var options = {
        width: window.innerWidth,
        height: window.innerHeight,
        margins: {
           top:    30, bottom: 20, 
           left:   10, right:  10
        },
        data: {
           calculateDomain:   true,
           oneYearMinimum:    false,
           fullYearsOnly:     false
        },
        plot: {
           margins: {
              top:     0, bottom: 12, 
              left:   25, right:  10
           },
           content: {
              rows: []
           },
           color: {
              default: '#b3b3cc'
           },
           xAxis: {
              ticks:       4,
              fontSize:    "16px",
              fontWeight:  400
           },
        },
       display: {
          transition_time: 0,
          settingsImg: false,
          sizeToFit: true
       },
    };

    var default_colors = { default: "#b3b3cc" };
    var colors = JSON.parse(JSON.stringify(default_colors));

    var events = {
       'settings': { 'click': null },
       'update':  { 'begin': null, 'end': null },
       'item':    { 'mouseover': null, 'mouseout': null, 'click': null },
       'axis':    { 'x': { 'click': null }, 'y': {'click': null } },
       'title':   { 'click': null }
    };

    function chart(selection) {
        selection.each(function () {
            dom_parent = d3.select(this);

            var root = dom_parent.append('svg')
                .attr('class', 'itemCalendar')

            var chartHolder = root.append('g')
               .attr({
                  'class':'chartHolder',
                  'transform':'translate(0,0)'
               });

            var settings;
            var hoverFrame = root.append('svg')
                .attr({ 'class':'hoverFrame', });

            var calendarPlot = chartHolder.append("g")
                  .attr("class", "calendarPlot");
            var connector = calendarPlot.append('path.connector');

            var xAxis = calendarPlot.append('g.axis.x');
            var yAxis = calendarPlot.append('g.axis.y');
            var legends = chartHolder.append('g.legends');
            var footnote = legends.append('text.footnote');

            update = function(opts) {

               if (!data.values.length) {
                  console.log('no values: ', data);
                  return;
               }

               root
                  .on('mouseover', showSettings)
                  .on('mouseout', hideSettings);

               if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
                  var dims = dom_parent.node().getBoundingClientRect();
                  options.width = Math.max(dims.width, 300);
                  options.height = Math.min(Math.max(options.width / 3, 100), 200);
               }

               plot_width  = options.width  - (options.margins.left + options.margins.right);
               plot_height = options.height - (options.margins.top + options.margins.bottom);

               var xScale = d3.time.scale()
                    .range([options.plot.margins.left, plot_width - options.plot.margins.right])
                    .domain(dateDomain);

               var axisX = d3.svg.axis()
                   .orient("bottom")
                   .ticks(options.plot.xAxis.ticks)
                   .tickSize(-plot_height)
                   .tickFormat(d3.time.format(xTicks))
                   .scale(xScale);

               var yScale = d3.scale.linear()
                   .range([plot_height - options.plot.margins.bottom, options.plot.margins.top])
                   .domain([0,options.plot.content.rows.length - 1]);

               var axisY = d3.svg.axis()
                   .orient("left")
                   .ticks(options.plot.content.rows.length)
                   .tickSize(-plot_width, 0, 0)
                   .tickFormat(ladderScale)
                   .scale(yScale);

               root
                  .attr({
                     'width':    options.width  + 'px',
                     'height':   options.height + 'px'
                  });

               // hover event to show settings/help icons
               if (options.display.settingsImg) {
                  settings = hoverFrame.selectAll('image')
                     .data([0])

                  settings.enter()
                    .append('image')
                    .on('click', function() { if (events.settings.click) events.settings.click(); }) 

                  settings.exit().remove();

                  settings
                     .attr({
                        'xlink:href': options.display.settingsImg,
                        'x': plot_width - 20, 'y': 0,
                        'height': '20px',
                        'width':  '20px',
                        'opacity': 0
                     })

               } else {
                  hoverFrame.selectAll('image').remove();
               }

               function showSettings() {
                  if (options.display.settingsImg) settings.attr('opacity', 1);
               }

               function hideSettings() {
                  if (options.display.settingsImg) settings.attr('opacity', 0);
               }
            }

        });
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
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        return chart;
    };

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        return chart;
    };

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

   return chart;
}
