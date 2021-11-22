!function() {

   var matches;

   var events = {
      'init': init, 'onload': onLoad, 'add_attributes': addAttributes,
   };

   var player_name = '';

   if (!Array.prototype.last) { Array.prototype.last = function() { return this[this.length - 1]; }; }

      d3.select('#overview').style('display', 'inline');
      d3.select('#presentation').style('display', 'none');
      spFx.displayDefault();

   function init(player, year) {
      player_name = player;
   }

   function addAttributes(match, reverse) {
      var new_attributes = {};
      return new_attributes;
   }

   function onLoad(match_list) {
      matches = match_list;
      var distribution = analyzeMatches(match_list);
      createChart(distribution, '#playerScatter');
   }

   // specific

   spt = scatterPlot();
   spt.width(650).height(270);

   var pts_div = d3.select("#pts");
   var pts_match = ptsMatch();
   pts_match.duration(1000);
   var popt = { resize: false };
   pts_match.options(popt);
   pts_match.width(600);

   // pts_match.events({ 'point_bars': { 'mouseover': describePoint }});

   var match_data;
   match_data = mo.matchObject();

   // create UMO instance and assigne to pts_match as data source
   pts_match.data(match_data);

   // add callback so that pts_match updates when match_data updates
   match_data.callback(pts_match.update)

   pts_div.call(pts_match);

   var vizcontrol = d3.select('#playerScatter_controls');
   var viztable = vizcontrol.append('table');

   var row1 = viztable.append('tr').append('td').attr('align', 'left');
   row1.append('input').attr('name', 'player_dataset').attr('id', 'player_perSet').attr('type', 'radio').attr('value', 'player_perSet').attr('checked', 'checked');
   row1.append('label').html('&nbsp; per Set Totals').attr('id', 'player_perSet_label');
   document.getElementById("player_perSet").addEventListener("change", function() { 
      spFx.displayPerSet(spt);
      spt.update();
   });

   var row2 = viztable.append('tr').append('td').attr('align', 'left');
   row2.append('input').attr('name', 'player_dataset').attr('id', 'player_perGame').attr('type', 'radio').attr('value', 'player_perGame');
   row2.append('label').html('&nbsp; per Game Avgerages').attr('id', 'player_perGame_label');
   document.getElementById("player_perGame").addEventListener("change", function() { 
      spFx.displayPerGame(spt);
      spt.update();
   });

   var row3 = viztable.append('tr').append('td').attr('align', 'left');
   row3.append('input').attr('name', 'player_dataset').attr('id', 'player_ppsSPP').attr('type', 'radio').attr('value', 'perGame');
   row3.append('label').html('&nbsp; pts/Game Shots/pt').attr('id', 'player_ppsSPP_label');
   document.getElementById("player_ppsSPP").addEventListener("change", function() { 
      spFx.displaySPP(spt);
      spt.update();
   });

   viztable.append('input').attr('autocomplete', 'off').attr('name', 'player_highlight')
         .attr('class', 'valid').attr('type', 'text').attr('value', '')
         .attr('id', 'player_highlight').attr('placeholder', 'Player Name').attr('tabindex', '3')
         .attr('spellcheck', 'false')
         .attr('autofocus');

   player_highlight.addEventListener("keyup", function(event) {
      if (!player_highlight.value) spt.highlight(undefined);
      if (event.keyCode == 13) {
         spt.highlight(player_highlight.value);
      }
   });

   function analyzeMatches(results) {
      var distribution = [];
      var bins = { '6-0': [], '6-1': [], '6-2': [], '6-3': [], '6-4': [], '7-5': [], '7-6': [] };
      results.forEach(function(r) {
         var result = r.data;

         var year = result.date.year;
         var tournament = result.tournament.name;
         var score = result.score;
         var players = result.players;
         var gid = (players.join('') + tournament + year).replace(/ /g,'');
         var h2h = players[0].name + ' v. ' + players[1].name;

         if (result.fingerprints && (result.fingerprints.wp || result.fingerprints.length)) {
            var win_progression = result.fingerprints.wp ? result.fingerprints.wp : result.fingerprints[0].wp;
            var rally_progression = result.fingerprints.yp ? result.fingerprints.yp : result.fingerprints[0].yp;

            if (rally_progression) {
               var all_rallies = [];
               for (var s=0; s < rally_progression.length; s++) {
                  rally_progression[s].split('::').map(function(e) { return e.split(':') })
                   .forEach(function(f) { f.forEach(function(a) { all_rallies.push(a); }) })
               }
            }
            if (all_rallies.reduce(function(a, b) { return a + b; }) > 0) {
               win_progression.forEach(function(w, i) {
                  var set_score = [score[i].player0, score[i].player1].sort().reverse().join('-');

                  var wp = (w.indexOf(':') >= 0) ? w.split(':').filter(function(f) { return f; }) : w;
                  var total_points = wp.length;
                  var rp = [];
                  rally_progression[i].split('::').map(function(e) { return e.split(':') })
                   .forEach(function(f) { f.forEach(function(a) { rp.push(a); }) })

                  var total_shots = rp.reduce(function(a, b) { return +a + +b; });
                  var games = (rally_progression[i].match(/::/g)||[]).length + 1;
                  var ppg = (total_points / games).toFixed(2);
                  var spg = (total_shots / games).toFixed(2);
                  var spp = (total_shots / total_points).toFixed(2);

                  if (['6-0', '6-1', '6-2', '6-3', '6-4', '7-5', '7-6'].indexOf(set_score) >= 0) {
                     bins[set_score].push(
                        { 
                           "Set Score":      set_score, 
                           "Total Points":   total_points, 
                           "Total Shots":    total_shots, 
                           "PPG"          :  ppg,
                           "SPG"          :  spg,
                           "SPP"          :  spp,
                           "Tournament"   :  tournament,
                           "h2h":            h2h,
                           "muid":           r.muid
                        }
                     );
                  }
               });
            }
         }
      });
      var scores = Object.keys(bins);
      scores.forEach(function(s) { distribution = distribution.concat(bins[s]); });
      return distribution;
   }


   function createChart(data, target) {
      var container = d3.select(target);
      var legend = d3.select('#playerScatter_legend');

      function highlightMatch(d) {
         spt.highlight(d.muid);

         var gs = ['Wimbledon', 'US Open', 'Australian Open', 'Roland Garros', 'French Open'];
         var data = matches.filter(function(f) { return f.muid == d.muid } );
         if (data.length == 1) {
            data = data[0];
            aip.sendReport('Scatter: ' + data.data.players[0].name + ' ' + data.data.players[1].name);
            if (gs.indexOf(data.tournament.replace('_', ' ')) >= 0) {
               if (data.tournament.replace('_', ' ') == 'US Open') {
                  var mopt = { match: { sets: 5, final_set_tiebreak: true, final_set_tiebreak_to: 7 } }
               } else {
                  var mopt = { match: { sets: 5, final_set_tiebreak: false } }
               }
            } else {
               var mopt = { match: { sets: 3, final_set_tiebreak: true, final_set_tiebreak_to: 7 } }
            }
            match_data.options(mopt);
            displayPTS(data);
         }
      }

      spFx.init(spt);
      spt.events({
         'element': { 'click': highlightMatch }
      });
      spt.options({
         data: {
            identifier:    'h2h',
            abbreviation:  'Set Score',
            group:         'Set Score',
            sub_group:     'muid',
            r_scale:       'PPG',
            x:             'Total Shots',
            y:             'Total Points'
         },
         axes  : {
            x: { label:   'Shots per Set' },
            y: { label:   'Points per Set' } 
         }
      });

      spt.options({
         legend: { 
            dom_element: legend,
            title:   'SET SCORE',
            text:    'Click Legend to select group<br> Click Legend title to reset',
            },
         display: {
            reset:         '#playerScatter_legend',
            zoom:          true,
            bubble_legend: false,
            highlight: {
               radius:     12,
               fill:       undefined
            }
         }
      });

      spt.data(data);
      container.call(spt);
      spt.update();

   }

   function displayPTS(d) {
      var win_progression = d.data.fingerprints.wp;
      if (win_progression) {

         var options = { set: { first_service: d.first_service } };

         match_data.options(options);
         match_data.players(d.data.players[0].name, d.data.players[1].name);

         var all_points = [];
         if (win_progression[0].indexOf(':') >= 0) {
            for (var s=0; s < win_progression.length; s++) {
                  d.data.fingerprints.wp[s].split('::').map(function(e) { return e.split(':') })
                   .forEach(function(f) { f.forEach(function(a) { all_points.push(a); }) })
            }
         } else {
            for (var s=0; s < win_progression.length; s++) {
               all_points += d.data.fingerprints.wp[s];
            }
            all_points = all_points.split('');
            all_points = all_points.filter(function(f) { return f; });
         }

         match_data.points(all_points);

         var rally_progression = d.data.fingerprints.yp;
         if (rally_progression) {
            var all_rallies = [];
            for (var s=0; s < rally_progression.length; s++) {
               rally_progression[s].split('::').map(function(e) { return e.split(':') })
                .forEach(function(f) { f.forEach(function(a) { all_rallies.push(a); }) })
            }
            if (all_rallies.reduce(function(a, b) { return a + b; }) > 0) {
               all_rallies.forEach(function(y, i) {
                  match_data.decoratePoint(i, { rally: new Array(+y) });
               });
            }
         }

         var result_progression = d.data.fingerprints.rp;
         var results = {
            'A': 'Ace', 'W': 'Winner', 'SW': 'Serve Winner', 
            'FE': 'Forced Error', 'UE': 'Unforced Error', 
            'DF': 'Double Fault', 'P': 'Penalty', 'O': 'Out',
            'N': 'Net'
         };
         if (result_progression) {
            var all_results = [];
            for (var s=0; s < result_progression.length; s++) {
               d.data.fingerprints.rp[s].split('::').map(function(e) { return e.split(':') })
                .forEach(function(f) { f.forEach(function(a) { all_results.push(a); }) })
            }
            all_results.forEach(function(y, i) {
               match_data.decoratePoint(i, { result: results[y] });
            });
         }

         pts_match.update();

      }
   }

}();
