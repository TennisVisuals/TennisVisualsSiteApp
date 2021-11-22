// TODO: highlight matches on doubles flags for second player

function burstChart() {

    var flag_extension = '.png';
    var flags_directory = '/images/flags/';

    var data;
    var color;
    var radius;
    var update;
    var frozen = 0;
    var dom_parent;
    var root;
    var options = {
       width: window.innerWidth,
	    height: window.innerHeight,
       margins: {
          top:    10, bottom: 10, 
          left:   10, right:  10
       },
       palette: [
         "#a6cee3","#1f78b4","#b2df8a","#33a02c",
         "#fb9a99","#e31a1c","#fdbf6f","#ff7f00",
         "#cab2d6","#6a3d9a","#ffff99","#b15928"
         ],
      display: {
         seeds: false,
         transition_time: 1000,
         highlight: true,
         title: undefined,
         flags: undefined,
         freeze: true
      }
    };

    var nodes = {
       root: undefined,
       burst: undefined,
       flags: undefined,
       winning_flags: undefined,
       losing_flags: undefined,
       hover: undefined,
       message: undefined
    };

    // DEFINABLE EVENTS
    // Define with ACCESSOR function chart.events()
    var events = {
       'update': { 'begin': defaultDisplay, 'end': null },
       'path': { 'mouseover': eventHover, 'mouseout': defaultDisplay, 'click': displayFreeze }
    };

    function chart(selection) {
        selection.each(function () {

            dom_parent = d3.select(this);

            root = dom_parent.append('svg')
                .attr('class', 'tournamentBurst');

            var partition = d3.layout.partition()
                .children(function(d) { return d.values; })
                .sort(null)
                .value(function(d) { return 1; });

            nodes.burst = root.append('g');
            nodes.hover = root.append('g');

            update = function(resize) {

               radius = Math.min(options.width - (options.margins.left + options.margins.right), 
                                 options.height - (options.margins.top + options.margins.bottom)) / 2;

               var x = d3.scale.linear()
                   .range([0, 2 * Math.PI]);

               var y = d3.scale.linear()
                   .range([radius / 2, radius]);

               var arc = d3.svg.arc()
                   .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
                   .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
                   .innerRadius(function(d) { return Math.max(0, y(d.y)); })
                   .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

               if (events.update.begin) events.update.begin();

               root
                  .attr('width', options.width )
                  .attr('height', options.height );

               nodes.burst
                  .translate( [(options.width - (options.margins.left + options.margins.right)) / 2,
                               ((options.height - (options.margins.top + options.margins.bottom)) / 2 + 10)]); 

               var burst = nodes.burst.datum(data).selectAll("path")
                   .data(partition.nodes);

               // color domain must be defined *after* partitioning
               color = d3.scale.linear().domain([0, data.value]).range([0, 1]);

               burst.enter().append("path")
                 .style("fill", "white")
                 .attr("d", arc)
                 .transition().duration(options.display.transition_time)
                 .style("fill", function(d) { return colorIndication(d); })

               burst.exit()
                 .transition().duration(options.display.transition_time)
                 .remove()
 
               burst
                 .on("mouseover", function(d) {
                    if (events.path.mouseover) events.path.mouseover(d);
                 })
                 .on("mouseout", function(d) {
                    if (events.path.mouseout) events.path.mouseout(d);
                 })
                 .on("click", function(d) {
                    if (events.path.click) events.path.click(d);
                 })
                 .transition().duration(options.display.transition_time)
                 .attr("d", arc)
                 .style("fill", function(d) { return colorIndication(d); })
            }

        });
    }

    function colorIndication(d) {
        if (options.display.seeds && d.seed) {
           var heatmap = d3.scale.linear()
                .domain(d3.range(0, 1, 1.0 / 7))
                .range(["#81D4FA","#42A5F5","#1E88E5","#1565C0","#5C6BC0","#673AB7","#9C27B0"]);
           var seeded = d3.scale.linear().domain([1, 32]).range([0, 1]);
           return heatmap(seeded(d.seed));
        } else if (options.display.seeds && d.entry) {
           if (d.entry.toUpperCase() == "WC") return "red";
           var heatmap = d3.scale.linear()
                .domain(d3.range(0, 1, 1.0 / 3))
                .range(['#FFF176','#FBC02D','#FF9800']);
           return heatmap(color(d.Draw));
        } else {
           if (options.display.seeds) {
              palette = ["#C8E6C9","#81C784","#4CAF50","#388E3C"];
           } else {
              palette = options.palette;
           }
           var heatmap = d3.scale.linear()
                .domain(d3.range(0, 1, 1.0 / palette.length))
                .range(palette);
           return d.Draw ? heatmap(color(d.Draw)) : 'white';
        }
    }

    function eventHover(d) {
        if (!d.Draw || !options.display.highlight) return;
        if (!frozen) nodes.burst.selectAll('path').attr('opacity', function(e) { if (e.Draw != d.Draw) { return .2; } else { return 1; } });

        nodes.flags.selectAll('image').remove();
        if (d.country) {
           nodes.winning_flags.append('image').translate([-15, 10 - (radius / 2)])
            .attr('height', "20px").attr('width', "30px")
            .attr('xlink:href', flags_directory + d.country + flag_extension);
        } else if (d.players) {
           if (d.players[0].country) {
              nodes.winning_flags.append('image').translate([-32, 10 - (radius / 2)])
               .attr('height', "20px").attr('width', "30px")
               .attr('xlink:href', flags_directory + d.players[0].country + flag_extension);
           }
           if (d.players[1].country) {
              nodes.winning_flags.append('image').translate([2, 10 - (radius / 2)])
               .attr('height', "20px").attr('width', "30px")
               .attr('xlink:href', flags_directory + d.players[1].country + flag_extension);
           }
        }

        message_text = [];
        nodes.message.selectAll('tspan').remove();
        if (d.player) {
           message_text.push(d.player);
        } else if (d.players) {
           d.players.forEach(function(f) { message_text.push(f.player); });
        }
        // if (d.score) message_text.push('<tspan font-weight="bold">' + d.score + '</tspan>');
        if (d.score) message_text.push(d.score);
        if (d.children) {
           var opponent = d.children.filter(function(f) { 
              if (f.player != d.player) return true;
              if (f.players && d.players) { 
                 if (f.players[0].player != d.players[0].player) return true;
              }
              return false;
           })[0];
           if (opponent) {
              if (opponent.player) {
                 message_text.push(opponent.player);
              }
              if (opponent.players) {
                 opponent.players.forEach(function(f) { message_text.push(f.player) });
                 if (opponent.players[0].country) {
                    nodes.winning_flags.append('image').translate([-32, (radius / 2) - 30])
                     .attr('height', "20px").attr('width', "30px")
                     .attr('xlink:href', flags_directory + opponent.players[0].country + flag_extension);
                 }
                 if (opponent.players[1].country) {
                    nodes.winning_flags.append('image').translate([2, (radius / 2) - 30])
                     .attr('height', "20px").attr('width', "30px")
                     .attr('xlink:href', flags_directory + opponent.players[1].country + flag_extension);
                 }
              }
              if (opponent.country) {
                 nodes.losing_flags.append('image').translate([-15, (radius / 2) - 30])
                  .attr('height', "20px").attr('width', "30px")
                  .attr('xlink:href', flags_directory + opponent.country + flag_extension);
              }
           }
        } else {
           if (d.seed) {
              message_text.push('Seeded: [' + d.seed + ']');
           } else if (d.entry) {
              message_text.push('Entry: [' + d.entry + ']');
           }
           if (d.country) message_text = message_text.concat(d3.wordwrap(country_codes[d.country], 15));
        }
        nodes.message.tspans(message_text);
        nodes.message.translate([0,  -(message_text.length * 8) / 2]);
    }

    function defaultDisplay(d) {
        if (!nodes.message) {
           nodes.message = nodes.burst.append('text').attr('text-anchor', 'middle');
        }
        nodes.message.selectAll('tspan').remove();
        nodes.message.tspans(function(d) { return d3.wordwrap(options.display.title, 15); });
        var spans = nodes.message.selectAll('tspan');
        var count = spans[0].length ? spans[0].length : 1;
        nodes.message.translate([0, -(count / 2) * 8]);
        if (nodes.flags) {
           nodes.flags.selectAll('image').remove();
        } else {
           nodes.flags = nodes.burst.append('g')
           nodes.winning_flags = nodes.flags.append('g')
           nodes.losing_flags = nodes.flags.append('g')
        }
        if (options.display.flags.length) displayFlags();
        nodes.message
           .on('mouseover', function() {
              if (!frozen) displayScoreHeatmap();
           })
           .on('mouseout', function(d) {
              if (!frozen) {
                 nodes.burst.selectAll('path')
                     .style("fill", function(d) { return colorIndication(d); })
              }
           })
           .on('click', function() {
              displayFreeze();
           })
        if (frozen) return;
        if (nodes.burst) {
           nodes.burst.selectAll('path')
              .attr('opacity', function(e) { return 1; })
              .style("fill", function(d) { return colorIndication(d); })
        } else {
           return;
        }
    }

    function displayScoreHeatmap() {
       var heat = d3.scale.linear().range(['#d3d3d3', 'red']);
       var paths =  nodes.burst.selectAll('path');
       var range = [];

       paths[0].forEach(function(f) { 
          var d = f.__data__;
          if (d && d.score && d.score.indexOf('-') > 0) {
             var total = reduceScore(f.__data__.score);

             // isNaN() not necessary when using d3.min(), d3.max()
             if (!isNaN(total)) range.push(total); 
          }
       });
       heat.domain([d3.min(range), d3.max(range)]);
          
       paths
           .style("fill", function(d) { 
              var score = d.score && d.score.indexOf('-') > 0 ? d.score : undefined;
              return score ? heat(reduceScore(d.score)) : '#d3d3d3'; 
           })
    }

    function reduceScore(score) {
       if (!score) return;
       return score.split(',')
          .map(function(m) { return m.split('(')[0] })
          .map(function(m) { 
             return m.split('-').reduce(function (a,b) { 
                var total = +a + +b; 
                return (!isNaN(total)) ? total : 0; 
             }) 
          })
          .reduce(function(a, b) { return +a + +b; });
    }

    function displayFreeze() {
       frozen = 1 - frozen;
       if (!frozen) defaultDisplay();
    }

    function displayFlags() {
       if (!options.display.flags || !radius) return;
       var flags = options.display.flags;
       var a = d3.scale.linear()
           .range([0, Math.PI * 2])
           .domain([0, flags.length]);
       var x = function(i) { return Math.cos(a(i)) * ((radius - 30) / 2) }
       var y = function(i) { return Math.sin(a(i)) * ((radius - 30) / 2) }

       var countries = nodes.flags.selectAll('image')
         .data(flags)

       countries.enter()
          .append('image')

       countries.exit()
          .remove();

       countries
          .translate(function(d, i) { return [x(i) - 12, y(i) - 8] })
          .attr('height', "15px").attr('width', "25px")
          .attr('xlink:href', function(d) { return flags_directory + d + flag_extension })
          .on('mouseover', function(d) {
             if (Object.keys(country_codes).length) {
                nodes.message.selectAll('tspan').remove();
                nodes.message.tspans(function() { return d3.wordwrap(country_codes[d], 15); });
             }
             if (frozen) return;
             nodes.burst.selectAll('path').attr('opacity', function(e) { 
                 if (!e.player && !e.players) { return .2; }
                 if (e.country && e.country == d) return 1;
                 if (e.players && (e.players[0].country == d || e.players[1].country == d)) return 1;
                 return .2;
              });
          })
          .on('mouseout', function(d) {
             if (frozen) return;
             defaultDisplay();
          })
          .on('click', function(d) {
              displayFreeze();
          })

    }

    // ACCESSORS

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
              if (typeof oo == 'object' && typeof vo !== 'function') {
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

    // e.g. chart.palette(colorbrewer.Paired[12]);
    chart.palette = function(value) {
        if (!arguments.length) return palette;
        // check that value is an array of color values
        options.palette = value;
        return chart;
    };

    chart.update = function(resize) {
      if (events.update.begin) events.update.begin(); 
      if (typeof update === 'function') update(resize);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
    }

    chart.duration = function(value) {
        if (!arguments.length) return options.display.transition_time;
       options.display.transition_time = value;
       return chart;
    }

    chart.highlightPlayer = function(player) {
       var highlighted = 0;
       if (nodes.burst) {
          frozen = true;
          nodes.burst.selectAll('path')
             .attr('opacity', function(d) { 
                if (!player) return 1;
                if (d.player && d.player.toLowerCase() == player.toLowerCase()) highlighted += 1;
                return (d.player == player) ? 1 : .2 
             })
       }
       return highlighted;
    }

    chart.hide = function(bool) {
       if (bool) {
          root.style('display', 'none');
       } else {
          root.style('display', 'inline');
       }
    }

    return chart;
}

// modified from d3-jetpack to support .html() instead of .text()
// e.g.: element.tspans(['<tspan font-weight="bold">Foo</tspan>']);
d3.selection.prototype.tspans = function(lines, lh) {
     return this.selectAll('tspan')
         .data(lines)
         .enter()
         .append('tspan')
         // .html(function(d) { return d; })
         .text(function(d) { return d; })
         .attr('x', 0)
         .attr('dy', function(d,i) { return i ? lh || 15 : 0; });
}; 

d3.selection.prototype.translate = function(xy) {
     return this.attr('transform', function(d,i) {
         return 'translate('+[typeof xy == 'function' ? xy.call(this, d,i) : xy]+')';
     });
};

d3.wordwrap = function(line, maxCharactersPerLine) {
   var w = line.split(' '),
       lines = [],
       words = [],
       maxChars = maxCharactersPerLine || 40,
       l = 0;
   w.forEach(function(d) {
       if (l+d.length > maxChars) {
           lines.push(words.join(' '));
           words.length = 0;
           l = 0;
       }
       l += d.length;
       words.push(d);
   });
   if (words.length) { lines.push(words.join(' ')); }
   return lines;
};

// this tweak allows setting a listener for multiple events, jquery style
var d3_selection_on = d3.selection.prototype.on;
d3.selection.prototype.on = function(type, listener, capture) {
    if (typeof type == 'string' && type.indexOf(' ') > -1) {
        type = type.split(' ');
        for (var i = 0; i<type.length; i++) {
            d3_selection_on.apply(this, [type[i], listener, capture]);
        }
    } else {
        d3_selection_on.apply(this, [type, listener, capture]);
    }
    return this;
};
