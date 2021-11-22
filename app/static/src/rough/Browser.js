!function() {

   var player = { name: '', puid: '' };
   var codesFetched = false;
   var pcolors = { players: { 0: "#6b6ecf", 1: "#a55194" } };

   /// SETUP Page Components
   var spin_opts = {
     lines: 9, // The number of lines to draw
     length: 9, // The length of each line
     width: 5, // The line thickness
     radius: 14, // The radius of the inner circle
     color: ['red', 'blue', 'green'], // #rgb or #rrggbb or array of colors
     speed: 1.9, // Rounds per second
     trail: 40, // Afterglow percentage
     className: 'spinner', // The CSS class to assign to the spinner
     top: '30%'
   };

   search
      .options({
         domElement: 'searchbox',
         searchForm: 'thePlayer',
         searchIcon: 'searchIcon'
      })
      .events({
         submit: displayMatches
      })
      .init();


   mv = matchView();
   mv
      .options({
         elements: {
            tournament:    "tournament",  matchOverview: "matchOverview",
            geoLocation:   "geoLocation", statPanel:     "statPanel",
            rt_div:        "rallytree",   gt_div:        "gametree",
            horizon_div:   "ptsHorizon",  pts_div:       "pts",
            m_chart:       "momentum",    gf_chart:      "gamefish"
         },
         colors: pcolors
      })
      .init();

   pv = playerView();
   pv
      .options({
         elements: {
            season_div:       "seasonChart",
            dp_div:           "datePicker",
            pc_div:           "pCoords",
            mr_div:           "matchRadar",
            horizon_group:    "tournamentHorizons",
            t_overview:       "tournamentOverview",
            t_end:            "tournamentEnd"
         },
         colors: pcolors
      })
      .events({
         clickTournament: tournamentView,
         updateMatch: updateMatch
      })
      .init();

   function tournamentView() {
      interact.toggleMenu('close');
      mv.hide();
   }
   /// END SETUP

   // the one bit of code executed on load
   checkArgs();

   ////////////////// UPLOADED FILES /////////////////////
   if (sources) {
      sources.umo = mo.matchObject();
      sources.uponCompletion = function() {
         pv.hide();
         displayMatch(sources.umo); 
      }
   }
   if (readWrite) {
      readWrite.uponCompletion = function() { 
         pv.hide(); 
         displayMatch(readWrite.umo);
      };
   }

   function displayMatch(umo) {
      displayState('match');
      menuState('clear');
      var report = ('Player Match: ' + umo.teams().join(' - '));
      if (aip) aip.sendReport(report);
      updateMatch(umo);
   }

   ///////////////// END UPLOADED FILES //////////////////

   function updateMatch(umo) {
      interact.toggleMenu('close');
      displayState('match');
      mv.umo(umo);
   }

   // check for player in URL
   function checkArgs() {
      var okeys = aip.okeys;

      // Look for a specific match reference
      // var muid = (okeys.length && okeys.indexOf('muid') >= 0) ? decodeURIComponent(aip.QueryString['muid']) : undefined;

      if (okeys.length) {
         if (okeys.indexOf('player') >= 0) {
            player.name = decodeURIComponent(aip.QueryString['player']).split('+').join(' ');
            if (!player.name.length) { return; }
            player.name = player.name.toLowerCase();
            player.name = player.name.split(' ').filter(function(f) { return f; }).map(function(w) {return w[0].toUpperCase() + w.slice(1);}).join(' ')
            thePlayer.value = player.name;
            displayMatches(thePlayer.value);
            // history.pushState({ foo: "" }, "", "?"); // clears the URL location
         } else {
            var able_to_process = parsers.loaders.filter(function(value) { 
               return okeys.indexOf(value.toLowerCase()) > -1 && parsers[value.toUpperCase()].file_format == 'text'; 
            });
            if (able_to_process.length > 0) {
               d3.text("/cache/mailcache/" + able_to_process[0].toLowerCase() + "/" + aip.QueryString[able_to_process[0].toLowerCase()], function(err, data) {
                  if (!err && data) {
                     parsers.umo = mo.matchObject();
                     parsers[able_to_process[0]].parse(data);
                     pv.hide();
                     displayMatch(parsers.umo);
                  }
               });
            }
         }
      }
   }

   function onLoad(match_list) {
      if (!match_list.length) { return; }
      displayState('match');
      // hide radar chart until it is put back into service...
      d3.select('#radar').style('display', 'none');

      window.scrollTo(0, 0);
      menuState('results');

      mv.hide();
      pv.show(['pc_div']);

      history.pushState({ foo: "" }, "", "?player=" + thePlayer.value);
      pv.player.name = thePlayer.value;
      pv.player.puid = player.puid;
      pv.codesFetched = codesFetched;
      pv.tournaments(match_list);
      var date_range = [
         match_list.length ? new Date(match_list[0].data.metadata.match.date) : undefined, 
         match_list.length ? new Date(match_list[match_list.length - 1].data.metadata.match.date) : undefined,
      ];
      pv.charts().datePicker.data(date_range).update();
      pv.charts().ladderChart.options({ plot: { title: { text: pv.player.name }}});
      pv.displayLadder();
      pv.updateCharts();
      pv.resize();
   }

   function displayState(state) {

      if (state == 'match') { 
         d3.select('#matchesDisplay').style('display', 'inline');
         d3.select('#splashSection').style('display', 'none');
         mv.show(); 
      } else { 
         pv.clear()
         // d3.select('#matchesDisplay').style('display', 'none');
         // d3.select('#splashSection').style('display', 'inline');
         mv.hide(); 
      }
   }

   window.addEventListener( 'resize', onWindowResize, false );

   function onWindowResize() {
      mv.resize();
      pv.resize();
   }

   function menuState(state) {
      if (state == 'results') {
         d3.select('#prompt').style('display', 'none');
         d3.select('#resultMenu').style('display', 'inline');
      } else {
         d3.select('#prompt').style('display', 'inline');
         d3.select('#resultMenu').style('display', 'none');
      }
   }

   function displayMatches(playerName) {
      console.log(playerName);
      if (!playerName) {
         displayState('clear');
         menuState('clear');
         return;
      } else {
         displayState('match');
      }

      aip.playerBio(playerName, function(err, bio_data) {
         if (!err && bio_data.length) {
            player.puid = bio_data[0].puid;
            pc();
         } else {
            displayState('clear');
            menuState('clear');
            d3.select('#matchesDisplay').style('display', 'none');
            d3.select('#splashSection').style('display', 'inline');
         }
      });

      function pc() {
         pv.clear();
         var ldr = document.getElementById('seasonChart');
         var spinner = new Spinner(spin_opts).spin(ldr);

         var start = new Date();
         // aip.limitPlayerCodes(playerName, 50, function(err, data) {
         aip.findPlayerCodes(playerName, '', function(err, data) {
         // aip.findPlayerMatches(playerName, '', function(err, data) {  // Djokovic only matches 2563 vs. incl. codes 2212
            spinner.stop();
            if (!err) {
               console.log('Fetch Time:', new Date() - start);
               codesFetched = false; // only if findPlayerCodes() was called

               data = data.filter(function(m) {
                  return (
                      m.metadata.tournament.name.indexOf('Fed Cup') < 0
                      && 
                      m.metadata.tournament.name.indexOf('Davis Cup') < 0 
                     )
               });

               if (data.length < 0) { gracefulExit(); }

               // if there is data then hide search prompt in menu
               d3.select('#prompt').style('display', 'none');

               var report = ('Player Search: ' + playerName).replace(/\ /g, '_');
               if (aip) aip.sendReport(report);

               displayStats(playerName);

               // TODO: ?? buildMatchList() and  buildScore can be moved to playerView
               var match_list = buildMatchList(data, playerName);
               onLoad(match_list);
            }

            function gracefulExit() {
                  search.toggleSearch('close');
                  displayState('clear');
                  menuState('clear');
                  return;
            }

         });
      }

   }
  
   function displayStats(playerName) {
      aip.getPlayerStats(playerName, function(err, data) {
         pv.addStats(playerName, data);
      });
   }

   function pcStats(matches) {
      var statObjs = [];
      matches.forEach(function(match) {
         statObj = { muid: match.muid };

         // statObj['Avg Rally'] = match.stats[0].overview.avg_rally;
         var calcObj = genCalcObj(match.stats[0].overview.calcs);
         statObj['Aces'] = calcObj['Aces'] ? calcObj['Aces'].n[0] : 0;
         statObj['Double Faults'] = calcObj['Double Faults'] ? calcObj['Double Faults'].n[0] : 0;
         statObj['Sv Pts %'] = calcObj['Service Points Won'] ? calcObj['Service Points Won'].p[0] : 0;
         statObj['Rc Pts %'] = calcObj['Receiving Points Won'] ? calcObj['Receiving Points Won'].p[0] : 0;
         statObj['BP Won %'] = calcObj['Break Points Won'] ? calcObj['Break Points Won'].p[0] : 0;
         statObj['BP Saved %'] = calcObj['Break Points Saved'] ? calcObj['Break Points Saved'].p[0] : 0;
         statObj['Pts %'] = ptsPct(calcObj['Total Points Won']);

         statObjs.push(statObj);
      });

      return statObjs;

      function ptsPct(tpw) {
         return ((tpw.n[0] / tpw.n.reduce(function(a, b) { return (a+b); })) * 100).toFixed(0);
      }

      function genCalcObj(calcs) {
         var calcObj = {};
         calcs.forEach(function(calc) {
            calcObj[calc.name] = { n: calc.numerator, d: calc.denominator, p: calc.pct }
         });
         return calcObj;
      }

   }

   function orientStats(playerName, matches) {
      matches.forEach(function(match) {
         var players = match.metadata.players.map(function(p) { return p.name; });

         if (players.indexOf(playerName) == 1) {
            match.metadata.players = reversePlayers(match.metadata.players);
            match.stats.forEach(function(s) {
               reverseStats(s);
            });
         }

      });

      function reversePlayers(players) {
         return [players[1], players[0], players[3] || '', players[2] || ''];
      }

      function reverseStats(stats) {
         stats.overview.calcs.forEach(function(calc) {
            var keys = Object.keys(calc);
            keys.forEach(function(key) {
               if (Array.isArray(calc[key]) && calc[key].length) { 
                  calc[key].reverse(); 
               }
            });
         });
      }
   }

   function generateSortFn(props) {
      return function (a, b) {
          for (var i = 0; i < props.length; i++) {
              var prop = props[i];
              var name = prop.name;
              var reverse = prop.reverse;
              if (a[name] < b[name])
                  return reverse ? 1 : -1;
              if (a[name] > b[name])
                  return reverse ? -1 : 1;
          }
          return 0;
      };
   };

   function buildMatchList(data, playerName) {
      var lom = [];
      data.sort(function(a,b) { var dateA = new Date(a.metadata.match.date); var dateB = new Date(b.metadata.match.date); return dateB - dateA; });

      // data.sort(function (a, b) {
      //     var aConcat = new Date(a.metadata.match.date).valueOf() + a.metadata.tournament.name;
      //     var bConcat = new Date(b.metadata.match.date).valueOf() + b.metadata.tournament.name;
      //     return (aConcat < bConcat) ? 1 : (aConcat > bConcat) ? -1 : 0;
      // });

      for (var m=0; m < data.length; m++) {
         var this_match = data[m];
         var reverse = (this_match.metadata.players[0].name != playerName) ? true : false;

         if (reverse) {
            this_match.opts.match.first_service = 1 - this_match.opts.match.first_service;

            // REVERSE PLAYERS
            var players = this_match.metadata.players;
            var temp = players[0];
            players[0] = players[1];
            players[1] = temp;
            var temp = players[2];
            players[2] = players[3];
            players[3] = temp;

            // REVERSE SCORE...
            for (var s=0; s < this_match.score.length; s++) {
               var temp = this_match.score[s].player0;
               this_match.score[s].player0 = this_match.score[s].player1;
               this_match.score[s].player1 = temp;
            }

            // REVERSE First Service since player names reversed
            if (this_match.codes && this_match.codes.length) {
               this_match.codes.forEach(function(c) {
                  c.first_service = 1 - c.first_service;
               });
            }
         }

         if (!this_match.score.length) { continue; }  // Skup matches with no score

         this_match.won = lastElement(this_match.score).player0 > lastElement(this_match.score).player1;

         if (['retired', 'default', 'walkover'].indexOf(this_match.metadata.match.status) >= 0) {
            this_match.won = (playerName == this_match.metadata.match.winner);
         }

         // only use the first stats instance !!!
         if (this_match.stats && this_match.stats.length) this_match.stats = this_match.stats[0];

         var round = this_match.metadata.tournament.round;
         this_match.reversed = reverse;

         // only 'won' and 'umo' are new elements, the rest is convenience
         var new_match = {
            reversed: reverse,
            muid: this_match.muid,
            tournament: this_match.metadata.tournament.name, 
            tuid: this_match.metadata.tournament.tuid,
            round: round,
            year: this_match.metadata.match.year,
            won: this_match.won,
            first_service: this_match.opts.match.first_service,
            data: this_match,
            umo: undefined
         }

         lom.push(new_match);

      }
      return lom;
   }

   function lastElement(arr) { return arr[arr.length - 1]; }

   /////////////// MatchRadar supporting functionsa ////////////////////
   /*
   var match_stats = {};
   var player_avg_stats;

   var axes = { 
                'RIP %':         ['Returns In Play', 'pct' ],
                'Points Won':    ['Total Points Won', 'numerator'],
                '1st Serve %':   ['1st Serve In', 'pct'],
                '1st SPW %':     ['1st Serve Points Won', 'pct'], 
                '2nd Serve %':   ['2nd Serve In', 'pct'],
                '2nd SPW %':     ['2nd Serve Points Won', 'pct'], 
                'RPW %':         ['Receiving Points Won', 'pct' ],
                // '1st RPW %':     ['Receiving Points Won 1st', 'pct' ],
                '2nd RPW %':     ['Receiving Points Won 2nd', 'pct' ],
                'Dbl Fault':     ['Double Faults', 'numerator'],
                'Aces %':        ['Aces', 'numerator'], 
                // 'BGames %':      ['breakgames', 'pct'],
                'BPts %':        ['Break Points Won', 'pct'], 
                'BP Saved %':    ['Break Points Saved', 'pct'], 
                // 'GP %':          ['gamepoints', 'pct'],
                'Winners':       ['Winners', 'numerator']
   };

   var xKeys = Object.keys(axes);

   function matchStats(match) {
      var calcs = match.stats[0].overview.calcs;
      ci = {};
      calcs.forEach(function(c, i) { ci[c.name] = i; });
      var teams = [match.players[0].name, match.players[1].name]
      var stat_objects = {};
      stat_objects[teams[0]] = {
         'key': teams[0], 
         'values': xKeys.map(function(m) { 
            if (!calcs[ci[axes[m][0]]]) { console.log(axes[m]); return; }
            return { 'axis': m, 'value': calcs[ci[axes[m][0]]][axes[m][1]][0] }; 
         }) 
      };
      stat_objects[teams[1]] = {
         'key': teams[1], 
         'values': xKeys.map(function(m) { 
            if (!calcs[ci[axes[m][0]]]) { return; } 
            return { 'axis': m, 'value': calcs[ci[axes[m][0]]][axes[m][1]][1] }; 
         }) 
      };
      return [stat_objects[player.name], stat_objects[teams[1 - teams.indexOf(player.name)]]];
   }

   function avgStats(stat_arrays) {
      var stat_calc = {0: {}, 1: {}};
      var avg_stats = {0: [], 1: []};
      var divisor = 0;
      stat_arrays.forEach(function(e, i) { if (e) { divisor += 1; rollUp(e, 0); rollUp(e, 1); } });
      [0, 1].forEach(function(i) { xKeys.forEach(function(e) { avg_stats[i].push({'axis': e, 'value': stat_calc[i][e] / divisor}); }); });

      function rollUp(row, index) {
         if (!row[index]) return;
         row[index].values.forEach( function(e) {
            stat_calc[index][e.axis] = stat_calc[index][e.axis] ? stat_calc[index][e.axis] + e.value : e.value;
         });
      }
      return [{key: player.name, values: avg_stats[0]}, {key: "Opponents", values: avg_stats[1]}];
   }

      function so() {
         aip.playerStatsOverview(player.name, '', function(err, stat_array) {
            if (!err && stat_array.length) {
               for (var s=0; s < stat_array.length; s++) {
                  if (stat_array[s].stats.constructor == Array) {
                     if (!stat_array[s].stats.length) continue;  
                     if (!stat_array[s].stats[0].overview.calcs.length) continue;  
                  } else {
                     if (!stat_array[s].stats.overview.players.calcs.length) continue;
                  }
                  match_stats[stat_array[s].muid] = matchStats(stat_array[s]);
               }
               var muids = Object.keys(match_stats);
               var avg_stats = avgStats(muids.map(function(m) { return match_stats[m]; }));

               configureMR(player.name);
               pv.charts().matchRadar.data([player_avg_stats]);
               pv.charts().matchRadar.push(avg_stats);

               pv.charts().matchRadar.duration(1000); // set transition time *after* first data load
            }
         });
      }

      function configureMR(player) {
         var custom_colors = {};
         var avg_id = player.name.split(' ').last() + ' Avg';
         player_avg_stats = { key: avg_id, values: [] };
         custom_colors[avg_id] = "yellow";
         custom_colors[player] = pcolors.players[0];
         custom_colors['Opponents'] = pcolors.players[1];
         pv.charts().matchRadar.colors(custom_colors);
         pv.charts().matchRadar.color(d3.scale.ordinal().range(["blue"]));
         pv.charts().matchRadar.ranges({'Aces %': [.01, .09], 'Dbl Fault %': [.01, .08] });
         pv.charts().matchRadar.update();
      }
      */

      /*
      var stats_avg = avgStats(d.matches.map(function(m) { return match_stats[m.muid]; }));
      pv.charts().matchRadar.data([player_avg_stats]);
      pv.charts().matchRadar.push(stats_avg);
      pv.charts().matchRadar.update();
      */

   /////////////// END MatchRadar supporting functionsa ////////////////////

}();
