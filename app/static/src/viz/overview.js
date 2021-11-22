function mOverview() {

    var data;
    var update;

    var fsf = 1.5; // font scaling factor

    var options = {
        width: window.innerWidth,
        height: window.innerHeight,
        margins: {
           top:    30, bottom: 20, 
           left:   10, right:  10
        },
        display: {
           sizeToFit: true,
           responsive: false,
           highlight_winner: true
        },
        colors: {
           players: { 0: "#a55194", 1: "#6b6ecf" }
        }
    };

    var events = {
       'update':  { 'begin': null, 'end': null }
    };

    function chart(selection) {
      var root = selection.append('svg')
          .attr('class', 'ov');

      var chartHolder = root.append('g')
         .attr({
            'class': 'chartHolder',
            'transform': 'translate(0,0)'
         });

      update = function(opts) {

         if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
            var dims = selection.node().getBoundingClientRect();
            options.width = Math.max(dims.width, 300);
            options.height = options.width / 4;
         }

         root
            .attr({
               'width':    options.width,
               'height':   options.height
            });

         var frame = chartHolder.selectAll('.frame')
            .data([0])

         frame.enter()
            .append('rect')
            .attr({ 'class':  'frame' })

         frame.exit().remove()

         frame
            .attr({
               'height': options.height,
               'width' : options.width,
               'fill'  : 'white',
               'stroke': 'blue',
               'opacity': 0
            })

         var divider = chartHolder.selectAll('.divider')
            .data([0])

         divider.enter()
            .append('line')
            .attr({ 'class': 'divider' })

         divider.exit().remove()

         divider
            .attr({
               'stroke':   'black',
               'x1': options.width * .05,
               'x2': options.width * .95,
               'y1': options.height / 2,
               'y2': options.height / 2
            })

         var font_size = options.width * .05;
         var max_length =0;

         var players = chartHolder.selectAll('.player')
            .data(data.teams())

         players.enter()
            .append('text')
            .attr({ 'class': 'player' })

         players.exit().remove()

         players
            .text(function(d) { return d })
            .style({
               'font-size':   font_size + 'px',
               'fill': function(d) { 
                  if (options.display.highlight_winner) {
                     return d == data.score().winner ? (options.colors.players[data.teams().indexOf(d)]) : 'black' 
                  } else {
                     return options.colors.players[data.teams().indexOf(d)];
                  }
               },
               'font-weight': function(d) { return d == data.score().winner ? 'bold' : 'normal' }
            })
            .attr({
               'length': function() { 
                  var length = this.getComputedTextLength(); 
                  if (length > max_length) max_length = length;
               }
            })
            .translate(function(d, i) { return [options.width * .045, options.height * .38 + (i * options.height * .4)] })

         var game_scores = data.score().sets
         .map(function(m) { 
            var this_set = m.games.map(function(f, i) { 
               return [i, f, m.tiebreak]; 
            });
            if (this_set[0][1] > this_set[1][1]) {
               // flag to bold and color leading player score
               this_set[0][3] = 'leads';
            } else if (this_set[0][1] < this_set[1][1]) {
               // flag to bold and color leading player score
               this_set[1][3] = 'leads';
            }
            return this_set;
         })

         game_scores = game_scores.length ? game_scores 
         .reduce(function(a, b) { return a.concat(b); })
         .reverse() : [[0,0], [1,0]];

         if (data.score().point_score) {
            var ps = data.score().point_score.split('-');
            game_scores.unshift([0, ps[0], undefined, 'points']);
            game_scores.unshift([1, ps[1], undefined, 'points']);
         }

         var points_divider = chartHolder.selectAll('.pointsDivider')
            .data(data.score().point_score ? [0] : [])

         points_divider.enter()
            .append('line')
            .attr({ 'class': 'pointsDivider' })

         points_divider.exit().remove()

         points_divider
            .attr({
               'stroke': 'gray',
               'x1': options.width * .9 - (.25 * font_size * fsf),
               'x2': options.width * .9 - (.25 * font_size * fsf),
               'y1': options.height * .25,
               'y2': options.height * .75
            })

         var scores = chartHolder.selectAll('.gamescore')
            .data(game_scores)

         scores.enter()
            .append('text')
            .attr({ 'class': 'gamescore' })

         scores.exit().remove()

         scores
            .text(function(d) { return d[1]; })
            .style({ 
               'font-size': font_size + 'px', 
               'fill': function(d) { return d[3] == 'leads' ? (options.colors.players[d[0]]) : d[3] == 'points' ? 'red' : 'black' },
               'font-weight': function(d) { return d[3] == 'leads' ? 'bold' : 'normal' }
            })
            .translate(function(d, i) { 
               return [options.width * .9 - (Math.floor(i / 2) * font_size * fsf), options.height * .38 + (d[0] * options.height * .4)] 
            })

         var sScript = scores.selectAll('.super')
            .data(function(d) { return [d]; })

         sScript.enter()
            .append('tspan')
            .attr('class', 'super')
            .attr('baseline-shift', "super")

         sScript.exit().remove()

         sScript
            .style({ 'font-size':   (font_size * .8) + 'px', })
            .text(function(d) { if (d[2] != undefined && d[1] == 6) return d[2]; })

      }
    }

    // ACCESSORS

    chart.exports = function() {
       return {}
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

    window.addEventListener( 'resize', scaleChart, false );

    function scaleChart() {
       if (!options.display.responsive) return;
       chart.update();
    }

   return chart;
}

d3.selection.prototype.translate = function(xy) {
     return this.attr('transform', function(d,i) {
         return 'translate('+[typeof xy == 'function' ? xy.call(this, d,i) : xy]+')';
     });
};

d3.selection.prototype.tspans = function(lines, lh) {
     return this.selectAll('tspan')
         .data(lines)
         .enter()
         .append('tspan')
         .attr('class', 'sb-text')
         .text(function(d) { return d; })
         .attr('x', 0)
         .attr('dy', function(d,i) { return i ? lh || 15 : 0; });
}; 

