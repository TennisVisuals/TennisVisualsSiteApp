// TODO: color the gamescore in the momentum chart

function momentumChart() {

    var data;
    var update;
    var fish_school = [];

    var options = {
        id: 'm1',
        fullWidth: window.innerWidth,
        fullHeight: window.innerHeight,
        margins: {
           top:    1, bottom: 1,  // Chrome bug can't be 0
           left:   3, right:  3   // Chrome bug can't be 0
        },
        fish: {
           gridcells: ['0', '15', '30', '40', 'G'],
           tailcells: ['D', 'A', 'G'],
           cell_size: undefined,
           min_cell_size: 5,
           max_cell_size: 10
        },
        display: {
           continuous:  false,
           orientation: 'vertical',
           settingsImg: false,
           transition_time: 0,
           sizeToFit:   true,
           service:     true,
           player:      true,
           rally:       true,
           score:       false,
           momentum_score: true,
           grid:        true
        },
        colors: {
           players: { 0: 'red', 1: 'black' },
           results: { 'Out': 'red', 'Net': 'coral', 'Unforced Error': 'red', 'Forced': 'orange', 
                      'Ace': 'lightgreen', 'Serve Winner': 'lightgreen', 'Winner': 'lightgreen', 
                      'Forced Volley Error': 'orange', 'Forced Error': 'orange', 'In': 'yellow', 
                      'Passing Shot': 'lightgreen', 'Out Passing Shot': 'red', 'Net Cord': 'yellow', 
                      'Out Wide': 'red', 'Out Long': 'red', 'Double Fault': 'red', 'Unknown': 'blue',
                      'Error': 'red'
           }
        }
    };

    function width() { return options.fullWidth - options.margins.left - options.margins.right }
    function height() { return options.fullHeight - options.margins.top - options.margins.bottom }

    options.height = height();
    options.width = width();

    var default_colors = { default: "#235dba" };
    var colors = JSON.parse(JSON.stringify(default_colors));

    var events = {
       'settings': { 'click': null },
       'update':  { 'begin': null, 'end': null },
       'point':    { 'mouseover': null, 'mouseout': null, 'click': null }
    };

    function chart(selection) {
      selection.each(function () {
         dom_parent = d3.select(this);

       var root = dom_parent.append('div')
           .attr('class', 'momentumRoot')
           .attr('transform', "translate(0, 0)")

       var momentumFrame = root.append('svg')
          .attr({ 
             'class':'momentumFrame', 
//             'xmlns': "http://www.w3.org/2000/svg",
//             'xmlns:xlink': "http://www.w3.org/1999/xlink"
          });

       momentumFrame.node().setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
       momentumFrame.node().setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

       var bars = momentumFrame.append('g').attr('id', 'momentumBars');
       var fish = momentumFrame.append('g').attr('id', 'momentumFish');
       var game = momentumFrame.append('g').attr('id', 'momentumGame');
 
       update = function(opts) {

          if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
             var dims = selection.node().getBoundingClientRect();
             if (options.display.orientation == 'vertical') {
                options.fullWidth = Math.max(dims.width, 100);
                options.fullHeight = Math.max(dims.height, 100);
             } else {
                options.fullHeight = cellSize() * maxDiff() * 2;
             }
          }

          options.height = height();
          options.width = width();

          var vert = options.display.orientation == 'vertical' ? 1 : 0;
          var fish_offset = vert ? options.width : options.height;
          var fish_length = vert ? options.height : options.width;
          var midpoint = fish_offset / 2;

          // extract all games from UMO
          var max_rally = 0;
          var all_games = [];
          var sets = data.sets();
          sets.forEach(function(s) {
             var games = s.games();
             games.forEach(function(g, i) {
                var points = s.points().slice(g.range[0], g.range[1] + 1);
                points.forEach(function(p) {
                   if (p.rally != undefined && p.rally.length > max_rally) max_rally = p.rally.length;
                })
                all_games.push({ points: points, score: g.score, last_game: games.length == i + 1 });
             });
          })

          var cell_size = cellSize();

          // remove extraneous fish instances
          var old_fish = fish_school.slice(all_games.length);
          old_fish.forEach(function(f) {
              d3.selectAll('.c' + f.options().id).remove();
          });
          // trim school based on length of data
          fish_school = fish_school.slice(0, all_games.length);

          var radius;
          var coords = [0, 0];
          var score_lines = [];
          all_games.forEach(function(g, i) {
             // add fish where necessary
             if (!fish_school[i]) { 
                fish_school.push(gameFish()); 
                momentumFrame.call(fish_school[i]);
                fish_school[i].g({ 
                   bars: bars.append('g').attr('class', 'cGF' + i), 
                   fish: fish.append('g').attr('class', 'cGF' + i), 
                   game: game.append('g').attr('class', 'cGF' + i) 
                });
                fish_school[i].options({id: 'GF' + i, display: { score: false, point_score: false }});
             }
             fish_school[i].width(fish_offset).height(fish_offset);
             fish_school[i].options({ 
                score: g.score, 
                fish: { cell_size: cell_size, max_rally: max_rally },
                display: { 
                   orientation: options.display.orientation,
                   service: options.display.service,
                   rally: options.display.rally,
                   player: options.display.player,
                   grid: options.display.grid
                },
                colors: { players: { 0: options.colors.players[0], 1: options.colors.players[1] }}
             });
             fish_school[i].data(g.points);
             fish_school[i].coords(coords).update();
             var new_coords = fish_school[i].coords();
             coords[0] += vert ? new_coords[0] : new_coords[1] - (new_coords[2] / 2);
             coords[1] += vert ? new_coords[1] : new_coords[0] + (new_coords[2] / 2);
             score_lines.push({ 
                score: g.score, 
                l: coords[1] + (new_coords[2] * 1.75),
                o: coords[0] + (new_coords[2] * 1.75),
                set_end: g.last_game
             });
             if (g.last_game && !options.display.continuous) { coords[vert ? 0 : 1] = 0; }
             radius = new_coords[2] / 2;
          });

          // This resize *must* take place after the fishshcool has been generated!
          // ---------------------------------------------------------------------
          root
             .attr({
                'width':    options.width + 'px',
                'height':   (vert ? (100 + coords[1]) : options.height) + 'px'
             })
             .on('mouseover', showSettings)
             .on('mouseout', hideSettings);

          momentumFrame
             .attr({
                'width':    options.width + 'px',
                'height':   (vert ? (100 + coords[1])  : options.height) + 'px'
             });
          // ---------------------------------------------------------------------

          var midline = fish.selectAll('.midline' + options.id)
             .data([0])

          midline.enter()
            .append('line')
            .attr({
               "class":          "midline" + options.id,
               "x1":             vert ? midpoint : radius,
               "x2":             vert ? midpoint : coords[0] + (5 * (radius || 0)),
               "y1":             vert ? radius : midpoint,
               "y2":             vert ? coords[1] + (5 * radius) : midpoint,
               "stroke-width":   lineWidth,
               "stroke":         "#ccccdd"
            })

          midline.exit().remove()

          midline
            .transition().duration(options.display.transition_time)
            .attr({
               "x1":             vert ? midpoint : radius,
               "x2":             vert ? midpoint : coords[0] + (5 * (radius || 0)),
               "y1":             vert ? radius : midpoint,
               "y2":             vert ? coords[1] + (5 * radius) : midpoint,
               "stroke-width":   lineWidth,
               "stroke":         "#ccccdd"
            })

          var scoreLines = fish.selectAll('.score_line' + options.id)
             .data(score_lines)

          scoreLines.enter()
            .append('line')
            .attr({
               "class":          "score_line" + options.id,
               "x1":             function(d) { return vert ? cell_size * 2 : d.o },
               "x2":             function(d) { return vert ? fish_offset - cell_size * 2 : d.o },
               "y1":             function(d) { return vert ? d.l : cell_size * 3 },
               "y2":             function(d) { return vert ? d.l : fish_offset - cell_size * 3 },
               "stroke-width":   lineWidth,
               "stroke-dasharray": function(d) { return d.set_end ? "0" : "5,5"; },
               "stroke":         function(d) { return d.set_end ? "#000000" : "#ccccdd"; }
            })
 
          scoreLines.exit().remove()
 
          scoreLines
            .transition().duration(options.display.transition_time)
            .attr({
               "x1":             function(d) { return vert ? cell_size * 2 : d.o },
               "x2":             function(d) { return vert ? fish_offset - cell_size * 2 : d.o },
               "y1":             function(d) { return vert ? d.l : cell_size * 3 },
               "y2":             function(d) { return vert ? d.l : fish_offset - cell_size * 3 },
               "stroke-width":   lineWidth,
               "stroke-dasharray": function(d) { return d.set_end ? "0" : "5,5"; },
               "stroke":         function(d) { return d.set_end ? "#000000" : "#ccccdd"; }
            })

          if (options.display.momentum_score) {
             var score_text = fish.selectAll(".score_text" + options.id)
                .data(score_lines)

             score_text.enter()
                .append('g')
                .attr("class", "score_text" + options.id)

             score_text.exit().remove()

             score_text
                .attr({ 'transform':  scoreText })

             var scores = score_text.selectAll(".score" + options.id)
                .data(function(d) { return d.score; })

             scores.enter()
                .append('text')
                .attr({
                   'class':          'score' + options.id,
                   'transform':      scoreT,
                   'font-size':       radius * 4.0 + 'px',
                   'opacity':         .1,
                   'text-anchor':    'middle'
                })

             scores.exit().remove()

             scores
                .transition().duration(options.display.transition_time)
                .attr({
                   'transform':      scoreT,
                   'font-size':      radius * 4.0 + 'px',
                   'opacity':        .1,
                   'text-anchor':    'middle'
                })
                .text(function(d) { return d } )
          } else {
             fish.selectAll(".score_text" + options.id).remove();
          }

          function scoreText(d) { return translate(0, (vert ? d.l : d.o - radius), 0); }
          function scoreT(d, i) {
             var offset = vert ? fish_offset / 3 : options.height / 3;
             var o = i ? midpoint + offset : midpoint - offset + radius * 3;
             var l = -1 * radius * (vert ? .25 : .5);
             return translate(o, l, 0);
          }

          function translate(o, l, rotate) {
             var x = vert ? o : l;
             var y = vert ? l : o;
             return "translate(" + x + "," + y + ") rotate(" + rotate + ")" 
          }

          function lineWidth(d, i) { return radius > 20 ? 2 : 1; }

          function cellSize() {
             var cell_size;

             if (options.display.orientation == 'vertical') {
                // if the display is vertical use the width divided by maxDiff
                cell_size = options.width / 2 / (maxDiff() + 1);
             } else {
                // if the display is horizontal use the width divided by # points
                var radius = options.width / (data.points().length + 4);
                var cell_size = Math.sqrt(2 * radius * radius);
             }
            return Math.min(options.fish.max_cell_size, cell_size);
          }

          function maxDiff() {
             var max_diff = 0;
             var cumulative = [0, 0];
             var pp = data.winProgression().split('');
             pp.forEach(function(p) {
                cumulative[p] += 1;
                var diff = Math.abs(cumulative[0] - cumulative[1]);
                if (diff > max_diff) max_diff = diff;
             });
             return max_diff;
          }

          if (options.display.settingsImg) {
             var settings = momentumFrame.selectAll('image')
                .data([0])

             settings.enter()
               .append('image')
                .attr({
                   'xlink:href': options.display.settingsImg,
                   'x': 0, 'y': 0,
                   'height': '20px',
                   'width':  '20px',
                   'opacity': 0
                })
               .on('click', function() { if (events.settings.click) events.settings.click(); }) 

             settings.exit().remove();
          } else {
             momentumFrame.selectAll('image').remove();
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
       return { function1: function1, function1: function1 }
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
        if (!arguments.length) return options.fullWidth;
        options.fullWidth = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.fullHeight;
        options.fullHeight = value;
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

function gameFish() {

    var data;
    var fish_width;
    var fish_height;
    var coords = [0, 0];
    var last_coords;
    var update;

    var options = {
        id: 'gf1',
        score: [0, 0],
        width: window.innerWidth,
        height: window.innerHeight,
        margins: {
           top:    10, bottom: 10, 
           left:   10, right:  10
        },
        fish: {
           gridcells: ['0', '15', '30', '40', 'G'],
           tailcells: ['D', 'A', 'G'],
           max_rally: undefined,
           cell_size: undefined,
           min_cell_size: 5,
           max_cell_size: 20
        },
        set: {
           tiebreak_to: 7
        },
        display: {
           orientation: 'vertical',
           transition_time: 1000,
           sizeToFit: false,

           point_score: true,
           service: true,
           player: true,
           rally: true,
           score: true,
           grid: true
        },
        colors: {
           players: { 0: 'red', 1: 'black' },
           results: { 'Out': 'red', 'Net': 'coral', 'Unforced Error': 'red', 'Forced': 'orange', 
                      'Ace': 'lightgreen', 'Serve Winner': 'lightgreen', 'Winner': 'lightgreen', 
                      'Forced Volley Error': 'orange', 'Forced Error': 'orange', 'In': 'yellow', 
                      'Passing Shot': 'lightgreen', 'Out Passing Shot': 'red', 'Net Cord': 'yellow', 
                      'Out Wide': 'red', 'Out Long': 'red', 'Double Fault': 'red', 'Unknown': 'blue',
                      'Error': 'red'
           }
        }
    };

    var default_colors = { default: "#235dba" };
    var colors = JSON.parse(JSON.stringify(default_colors));

    var events = {
       'update':  { 'begin': null, 'end': null },
       'point':    { 'mouseover': null, 'mouseout': null, 'click': null }
    };

    var root;
    var bars;
    var fish;
    var game;

    function chart(selection) {
      var parent_type = selection[0][0].tagName.toLowerCase();

      if (parent_type != 'svg') {
         root = selection.append('div')
             .attr('class', 'fishRoot');

         var fishFrame = root.append('svg')
            .attr({ 
               'id':    'gameFish' + options.id,
               'class': 'fishFrame' 
            });

         bars = fishFrame.append('g');
         fish = fishFrame.append('g');
         game = fishFrame.append('g');

      }

      update = function(opts) {

         if (bars == undefined || fish == undefined || game == undefined) return;

         if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
            var dims = selection.node().getBoundingClientRect();
            options.width = Math.max(dims.width, 100);
            options.height = Math.max(dims.height, 100);
         }

         var tiebreak = false;
         var max_rally = 0;
         data.forEach(function(e) { 
            if (e.rally && e.rally.length > max_rally) max_rally = e.rally.length;
            if (e.score.indexOf('T') > 0) tiebreak = true; 
         });

         if (options.fish.max_rally && options.fish.max_rally > max_rally) max_rally = options.fish.max_rally;

         fish_width  = options.width  - (options.margins.left + options.margins.right);
         fish_height = options.height - (options.margins.top + options.margins.bottom);
         var vert = options.display.orientation == 'vertical' ? 1 : 0;
         var fish_offset = vert ? fish_width : fish_height;
         var fish_length = vert ? fish_height : fish_width;
         var midpoint = (vert ? options.margins.left : options.margins.top) + fish_offset / 2;
         var sw = 1;    // service box % offset
         var rw = .9;   // rally_width % offset

         bars.attr('transform', 'translate(' + (vert ? 0 : coords[0]) + ',' + (vert ? coords[1] : 0) + ')');
         fish.attr('transform', 'translate(' + coords[0] + ',' + coords[1] + ')');
         game.attr('transform', 'translate(' + coords[0] + ',' + coords[1] + ')');

         if (options.fish.cell_size) {
            var cell_size = options.fish.cell_size;
         } else {
            var offset_divisor = tiebreak ? options.set.tiebreak_to + 4 : options.fish.gridcells.length + 2;
            var cell_offset = fish_offset / (options.fish.gridcells.length + (options.display.service ? offset_divisor : 0));
            var cell_length = fish_length / (data.length + 2);
            var cell_size = Math.min(cell_offset, cell_length);
            var cell_size = Math.max(options.fish.min_cell_size, cell_size);
            var cell_size = Math.min(options.fish.max_cell_size, cell_size);
         }

         var diag = Math.sqrt(2 * Math.pow(cell_size, 2));
         var radius = diag / 2;

         grid_data = [];
         grid_labels = [];
         var grid_side = tiebreak ? options.set.tiebreak_to : options.fish.gridcells.length - 1;
         for (var g=0; g < grid_side; g++) {
            var label = tiebreak ? g : options.fish.gridcells[g];
            // l = length, o = offset
            grid_labels.push({ label: label, l: (g + (vert ? 1.25 : .75)) * radius, o: (g + (vert ? .75 : 1.25)) * radius, rotate: 45 });
            grid_labels.push({ label: label, l: (g + 1.25) * radius, o: -1 * (g + .75) * radius, rotate: -45 });
            for (var c=0; c < grid_side; c++) {
               grid_data.push([g, c]);
            }
         }

         var score_offset = options.display.score ? cell_size : 0;

         // check if this is a standalone SVG or part of larger SVG
         if (root) {
            root
               .attr({
                  'width':    options.width  + 'px',
                  'height':   options.height + 'px'
               });

            fishFrame
               .attr({
                  'width':    options.width  + 'px',
                  'height':   options.height + 'px'
               });
         }

         if (options.display.point_score) {
            var game_score = fish.selectAll('.game_score' + options.id)
               .data(grid_labels)
               
            game_score.enter()
               .append('text')
               .attr({
                  "font-size":   radius * .8 + "px",
                  "transform":   gscoreT,
                  "text-anchor": "middle"
               })

            game_score.exit()
               .remove()

            game_score
               .transition().duration(options.display.transition_time)
               .attr({
                  "class": "game_score" + options.id,
                  "font-size":   radius * .8 + 'px',
                  "transform":   gscoreT,
                  "text-anchor": "middle"
               })
               .text(function(d) { return d.label })
         } else {
            fish.selectAll('.game_score' + options.id).remove();
         }

         if (options.display.grid) {
            var gridcells = fish.selectAll('.gridcell' + options.id)
               .data(grid_data);

            gridcells.enter()
               .append('rect')
               .attr({
                  "class":          "gridcell" + options.id,
                  "stroke":         "#ccccdd",
                  "stroke-width":   lineWidth,
                  "width":          cell_size,
                  "height":         cell_size,
                  "transform":      gridCT,
                  "fill-opacity":   0
               })

            gridcells.exit()
               .remove()

            gridcells
               .transition().duration(options.display.transition_time)
               .attr({
                  "class":          "gridcell" + options.id,
                  "stroke-width":   lineWidth,
                  "width":          cell_size,
                  "height":         cell_size,
                  "transform":      gridCT,
                  "fill-opacity":   0
               })
         } else {
            fish.selectAll('.gridcell' + options.id).remove();
         }

         var gamecells = game.selectAll('.gamecell' + options.id)
              .data(data);

         gamecells.enter()
            .append('rect')
            .attr({
               "class":          "gamecell" + options.id,
               "transform":      gameCT,
               "stroke":         "#ccccdd",
               "stroke-width":   lineWidth,
               "opacity":     0
            })
            .style("fill", function(d) { return options.colors.players[d.winner]; })

         gamecells.exit()
            .remove()

         gamecells
            .attr("id", function(d, i) { return options.id + 'Gs' + d.set + 'g' + d.game + 'p' + i })
            .transition().duration(options.display.transition_time)
            .attr({
               "class":          "gamecell" + options.id,
               "width":          cell_size,
               "height":         cell_size,
               "transform":      gameCT,
               "stroke":         "#ccccdd",
               "stroke-width":   lineWidth,
               "opacity":        options.display.player ? 1 : 0
            })
            .style("fill", function(d) { return options.colors.players[d.winner]; })

         var results = game.selectAll('.result' + options.id)
            .data(data)
            
         results.enter()
            .append('circle')
            .attr({
               'class':    'result' + options.id,
               'opacity':  0,
               "cx":       zX,
               "cy":       zY,
               "r":        circleRadius
            })
            .style("fill", function(d) { return options.colors.results[d.result]; })

         results.exit()
            .remove()

         results
            .attr("id", function(d, i) { return options.id + 'Rs' + d.set + 'g' + d.game + 'p' + i })
            .transition().duration(options.display.transition_time)
            .attr({
               'opacity':        1,
               'stroke':         'black',
               "stroke-width":   lineWidth,
               "cx":             zX,
               "cy":             zY,
               "r":              circleRadius
            })
            .style("fill", function(d) { return options.colors.results[d.result]; })

         // offset Scale
         var oScale = d3.scale.linear()
            .range([0, fish_offset * rw])
            .domain([0, max_rally])

         // lengthScale
         var lScale = d3.scale.ordinal()
            .domain(d3.range(data.length))
            .rangeRoundBands([0, (data.length) * radius])

         if (options.display.rally) {
            var rally_bars = bars.selectAll(".rally_bar" + options.id)
               .data(data)

            rally_bars.enter()
               .append("rect")
               .attr({
                  "class":          "rally_bar" + options.id,
                  "opacity":        0,
                  "stroke":         "white",
                  "stroke-width":   lineWidth,
                  "fill":           "#eeeeff",
                  "transform":      rallyTstart,
                  "height":         vert ? lScale.rangeBand() : 0,
                  "width":          vert ? 0 : lScale.rangeBand()
               })

            rally_bars.exit()
               .remove()

            rally_bars
               .on("mouseover", function(d) { d3.select(this).attr('fill', 'yellow'); })
               .on("mouseout", function(d) { d3.select(this).attr('fill', '#eeeeff'); })
               .transition().duration(options.display.transition_time)
               .attr("id", function(d, i) { return options.id + 'Bs' + d.set + 'g' + d.game + 'p' + i })
               .attr({
                  "opacity":        1,
                  "stroke":         "white",
                  "stroke-width":   lineWidth,
                  "fill":           "#eeeeff",
                  "transform":      rallyT,
                  "height":         vert ? lScale.rangeBand() : rallyCalc,
                  "width":          vert ? rallyCalc : lScale.rangeBand()
               })
         } else {
            bars.selectAll(".rally_bar" + options.id).remove();
         }

         if (options.display.score) {
            var set_score = bars.selectAll(".set_score" + options.id)
               .data(options.score)

            set_score.enter()
               .append('text')
               .attr("class", "set_score" + options.id)

            set_score.exit().remove()

            set_score
               .attr({
                  'transform':      sscoreT,
                  'font-size':      radius * .8 + 'px',
                  'text-anchor':    'middle',
               })
               .text(function(d) { return d } )

            var ssb = bars.selectAll(".ssb" + options.id)
               .data(options.score)

            ssb.enter()
               .append('rect')
               .attr("class", "ssb" + options.id)

            ssb.exit().remove()

            ssb
               .attr({
                  'transform':      ssbT,
                  'stroke':         'black',
                  'stroke-width':   lineWidth,
                  'fill-opacity':   0,
                  'height':         radius + 'px',
                  'width':          radius + 'px'
               })

         } else {
            bars.selectAll(".set_score" + options.id).remove();
            bars.selectAll(".ssb" + options.id).remove();
         }

         if (options.display.service) {
            var serves = [];
            data.forEach(function(s, i) {
               var first_serve = false;
               var serve_outcomes = ['Ace', 'Serve Winner', 'Double Fault'];
               if (s.first_serve) {
                  first_serve = true;
                  serves.push({ point: i, serve: 'first', server: s.server, result: s.first_serve.error });
               }

               serves.push({ 
                  point: i, 
                  serve: first_serve ? 'second' : 'first', 
                  server: s.server,
                  result: serve_outcomes.indexOf(s.result) >= 0 ? s.result : 'In' 
               });
            });

            var service = bars.selectAll(".serve" + options.id)
               .data(serves)

            service.enter() .append("circle")
            service.exit()  .remove()

            service
               .attr({
                  "class":          "serve" + options.id,
                  "cx":             sX,
                  "cy":             sY,
                  "r":              circleRadius,
                  "stroke":         colorShot,
                  "stroke-width":   lineWidth,
                  "fill":           colorShot
               })

            var service_box = bars.selectAll(".sbox" + options.id)
               .data(data)

            service_box.enter()
               .append("rect")
               .attr({
                  "transform":      sBoxT,
                  "stroke":         "#ccccdd",
                  "stroke-width":   lineWidth,
                  "fill-opacity":   0,
                  "height":         vert ? lScale.rangeBand() : 1.5 * radius,
                  "width":          vert ? 1.5 * radius : lScale.rangeBand()
               })

            service_box.exit().remove()

            service_box
               .attr({
                  "transform":      sBoxT,
                  "class":          "sbox" + options.id,
                  "stroke-width":   lineWidth,
                  "height":         vert ? lScale.rangeBand() : 1.5 * radius,
                  "width":          vert ? 1.5 * radius : lScale.rangeBand()
               })

            var returns = bars.selectAll(".return" + options.id)
               .data(data)

            returns.enter()
               .append("circle")
               .attr({
                  "class":          "return" + options.id,
                  "cx":             rX,
                  "cy":             rY,
                  "r":              circleRadius,
                  "stroke":         colorReturn,
                  "stroke-width":   lineWidth,
                  "fill":           colorReturn
               })

            returns.exit()
               .remove()

            returns
               .attr({
                  "class":          "return" + options.id,
                  "cx":             rX,
                  "cy":             rY,
                  "r":              circleRadius,
                  "stroke":         colorReturn,
                  "stroke-width":   lineWidth,
                  "fill":           colorReturn
               })

         } else {
            bars.selectAll(".sbox" + options.id).remove();
            bars.selectAll(".return" + options.id).remove();
            bars.selectAll(".serve" + options.id).remove();
         }

         // ancillary functions for update()
         function circleRadius(d, i) { 
            return (options.display.player || options.display.service) ? radius / 4 : radius / 2; 
         }
         function lineWidth(d, i) { return radius > 20 ? 1 : .5; }
         function colorShot(d, i) { return options.colors.results[d.result]; }
         function colorReturn(d, i) { 
            if (d.rally == undefined) return "white";
            if (d.rally.length > 1) return 'yellow';
            if (d.rally.length == 1) return options.colors.results[d.result]; 
            return "white";
         }

         function rallyCalc(d, i) { return d.rally ? oScale(d.rally.length) : 0; }

         function sscoreT(d, i) {
            var o = i ? midpoint + radius * .5 : midpoint - radius * .5;
            var o = vert ? o : o + radius * .3;
            var l = radius * (vert ? .8 : .5);
            return translate(o, l, 0);
         }

         function ssbT(d, i) {
            var o = i ? midpoint : midpoint - radius;
            var l = 0;
            return translate(o, l, 0);
         }

         function gscoreT(d, i) {
            var o = +midpoint + d.o;
            var l = radius + d.l;
            return translate(o, l, d.rotate);
         }

         function gridCT(d, i) {
            var o = midpoint + ((d[1] - d[0] + vert - 1) * radius);
            var l = (d[0] + d[1] + 3 - vert ) * radius;
            return translate(o, l, 45);
         }

         function gameCT(d, i) {
            var o = midpoint + (findOffset(d.fish_score) + vert - 1) * radius;
            var l = (i + 4 - vert) * radius;
            last_coords = [o - midpoint, l - diag, diag];
            return translate(o, l, 45);
         }

         function sBoxT(d, i) {
            var o = d.server == 0 ? midpoint - (fish_offset / 2 * sw) : midpoint + (fish_offset / 2 * sw) - (1.5 * radius);
            var l = radius + cL(d, i);
            return translate(o, l, 0); 
         }

         function rallyTstart(d, i) {
            var o = midpoint;
            var l = radius + cL(d, i);
            return translate(o, l, 0);
         }

         function rallyT(d, i) {
            var o = d.rally ? (midpoint - (oScale(d.rally.length) / 2)) : 0;
            var l = radius + cL(d, i);
            return translate(o, l, 0);
         }

         function translate(o, l, rotate) {
            var x = vert ? o : l;
            var y = vert ? l : o;
            return "translate(" + x + "," + y + ") rotate(" + rotate + ")" 
         }

         function cL(d, i) { return (i + 2.5) * radius; }

         function rX(d, i) { return vert ? rO(d, i) : rL(d, i); }
         function rY(d, i) { return vert ? rL(d, i) : rO(d, i); }
         function rL(d, i) { return radius + (i + 3) * radius; }
         function rO(d, i) {
            return d.server == 0 ? midpoint + (fish_offset / 2 * sw) - (.75 * radius) : midpoint - (fish_offset / 2 * sw) + (.75 * radius);
         }

         function sX(d, i) { return vert ? sO(d, i) : sL(d, i); }
         function sY(d, i) { return vert ? sL(d, i) : sO(d, i); }
         function sL(d, i) { return radius + (d.point + 3) * radius; }
         function sO(d) {
            var offset = ((d.serve == 'first' && d.server == 0) || (d.serve == 'second' && d.server == 1)) ? .4 : 1.1;
            return d.server == 0 ? midpoint - (fish_offset / 2 * sw) + (offset * radius) : midpoint + (fish_offset / 2 * sw) - (offset * radius);
         }

         function zX(d, i) { return vert ? zO(d, i) : zL(d, i); }
         function zY(d, i) { return vert ? zL(d, i) : zO(d, i); }
         function zL(d, i) { return radius + (i + 3) * radius; }
         function zO(d, i) { return +midpoint + findOffset(d.fish_score) * radius; }
      }

      function findOffset(score) {
         var scores = score.split('-').map(function(m) { return m.replace('T', ''); });
         var p0 = scores[0];
         var p1 = scores[1];

         if (score.indexOf('T') > 0) {
            if (p0 >= options.set.tiebreak_to && p1 >= options.set.tiebreak_to) {
               p0 = p0 - options.set.tiebreak_to;
               p1 = p1 - options.set.tiebreak_to;
            }
            return p1 - p0;
         } else {
            if (options.fish.gridcells.indexOf(p0) >=0 && options.fish.gridcells.indexOf(p1) >=0) {
               return options.fish.gridcells.indexOf(p1) - options.fish.gridcells.indexOf(p0);
            } else if (options.fish.tailcells.indexOf(p0) >=0 && options.fish.tailcells.indexOf(p1) >=0) {
               return options.fish.tailcells.indexOf(p1) - options.fish.tailcells.indexOf(p0);
            } else {
               return;
            }
         }
      }
    }

    // ACCESSORS

    chart.g = function(values) {
        if (!arguments.length) return chart;
        if (typeof values != 'object' || values.constructor == Array) return;
        if (values.bars) bars = values.bars;
        if (values.fish) fish = values.fish;
        if (values.game) game = values.game;
    }

    chart.exports = function() {
       return { function1: function1, function1: function1 }
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

    chart.coords = function(value) {
        if (!arguments.length) return last_coords;
        coords = value;
       return chart;
    }

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = JSON.parse(JSON.stringify(value));
        massageData(data);
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

   // ancillary functions

   function massageData(data) {
      var first_deuce = false;
      data.forEach(function(point) {
         var scores = point.score.split('-');
         if (scores[0] == '40' && scores[1] == '40' && !first_deuce) {
            first_deuce = true;
            point.fish_score = point.score;
         } else if (!first_deuce) {
            point.fish_score = point.score;
         } else {
            if (scores[0] == '40') scores[0] = 'D';
            if (scores[1] == '40') scores[1] = 'D';
            point.fish_score = scores.join('-');
         }
      });
   }
}
