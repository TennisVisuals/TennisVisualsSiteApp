// TODO: datePicker auto-selects when click on selection of matches, i.e. MCP

function playerView() {

   var pv = { player: { name: undefined, puid: undefined }, codesFetched: false };

   var idx = {};
   var charts = {};
   var all_matches = [];
   var tournaments = [];
   var selected_matches = [];
   var displayed_matches = [];
   var displayed_tournaments = [];
   var selected_tournaments = [];
   var displayState = 'inline';
   var selected_tournament;
   var filter_view = false;

   var options = {
      elements: {
         season_div:       undefined,
         dp_div:           undefined,
         pc_div:           undefined,
         mr_div:           undefined,
         horizon_group:    undefined,
         t_overview:       undefined,
         t_end:            undefined
      },
      colors: { 
         players: { 0: '', 1: '' },
         surfaces: {
            "hard":        "#235dba",
            "clay":        "#db3e3e",
            "grass":       "#66CD00",
            "carpet":      "#33cccc",
            "unknown":     "#a7a59b"
         },
         filters: {
         }
      }
   };

   var events = {
      clickTournament: null,
      updateMatch: null
   };

   var ladder_rungs = ["Q", "R128","R64","R32","R16","QF","SF","F","W"];
   var tournament_ranks = {
      'F': 600,   //
      'C': 500,   //                       
      'A': 400,   //                       250
      'D': 900,   // Fed Cup               500
      'M': 1200,  // ATP Masters           1000
      'G': 2000,  // Grand Slam            2000
      'W': 1500,  // WTA Championships     1500
      'PM': 1000, // WTA Premier Mandatory 1000
      'P': 800,   // WTA Premeir (12)      470
      'I': 600    // WTA International     280
   };

   pv.init = function() {

      if (options.elements.pc_div) {
         charts.pCoords = pCoords()
            .colors(options.colors.surfaces)
            .options({
               plot: {
                  lines: {
                     colorKey: 'surface'
                  }
               },
               display: {
                  settingsImg:      '/images/gear.png',
                  helpImg:          '/images/help.png',
               }
            })
            .events({
               'lines': {
                  'click': clickLine,
                  'mouseover': lineMouseOver,
                  'mouseout' : lineMouseOut
               },
               'axis': {
                  'y': { 'click': clickPCaxis }
               },
               'brush': {
                  'brushed': displaySurfaceMatches,
                  'start': brushStart,
                  'end': brushEnd,
                  'clear': clearFilteredMatches
               },
               'settings' : { 'click': settingsPC },
               'help' :     { 'click': pvHelpModal },
            })
            .hide([
               'muid', 'surface', 'Date', 
               'vRank', 'aRank', 'vAge', 'aAge', 'Time',
               'vA %', 'v1st %', 'v2nd %',
               'BP', 'BP Cnv', 'BPC %', 'BP Svd', 'BP Fcd', 'BPS %'
            ])
            // need fix for ordinal scale brushing (see pCoords.js)
            // .scales({ 'Won': { scale: d3.scale.ordinal(), domain: [0, 1] }});
            .scales({ 'Won': { scale: d3.scale.linear(), domain: [0, 1] }});

         d3.select('#' + options.elements.pc_div).call(charts.pCoords);
      }

      if (options.elements.season_div) {

         charts.ladderChart = ladderChart()
            .colors(options.colors.surfaces)
            .options({
               data: {
                  contextAttribute: 'tidx',
                  fullYearsOnly: true,
                  oneYearMinimum: true
               },
               display: { source: '' },
               plot: {
                  source: { text: '' },
                  shape: {
                     dateKey:        'date',
                     rungKey:        'rung',
                     colorKey:       'surface',
                     sizeKey:        'rank',
                     shapeSizeBase:  22000,

                     typeKey:        'category',
                     typeRange:      ["circle", "circle", "triangle", "triangle", "square"],
                     typeDomain:     ["atp", "wta", "itf", "ch", "fu"]
                  },
                  content: {
                    rows: ladder_rungs
                  }
               },
               display: {
                  settingsImg:      '/images/gear.png',
                  helpImg:          '/images/help.png',
               }
            });
         charts.ladderChart
            .events({
               'settings' : { 'click': pvHelpModal },
               'help'     : { 'click': pvHelpModal },
               'item': { 
                  'mouseover': tournamentMouseOver, 
                  'mouseout': tournamentMouseOut, 
                  'click': tournamentClick 
               },
               'axis': { 
                  'x': { 'click': zoomByYear },
                  'y': { 'click': zoomByRound }
               },
               'title': { 'click': fullLadder }
                
            });

         d3.select('#' + options.elements.season_div).call(charts.ladderChart);
      }

      if (options.elements.dp_div) {
         charts.datePicker = datePicker();
         charts.datePicker.events({brush: { end: function(data) { zoomByRange(data.range); }}})
         d3.select('#' + options.elements.dp_div).call(charts.datePicker);
      }

      if (options.elements.mr_div) {
         // COLORS ARE SET WHEN STATS LOADED BASED ON PLAYER NAME
         // TODO: change this behavior
         charts.matchRadar = RadarChart()
            .options({
               legend: { display: true }, 
               resize: true,
               margins: { top: 100, right: 60, bottom: 80, left: 80 },
               axes: { threshold: 90 }
            })
         charts.matchRadar .levels(6) .duration(0) .update();
         d3.select('#' + options.elements.mr_div).call(charts.matchRadar);
      }

      if (options.elements.horizon_group) {
         charts.pHorizonGroup = ptsHorizonGroup();
         d3.select('#' + options.elements.horizon_group).call(charts.pHorizonGroup);
      }
   }

   function clickLine(data) {
      pv.show();

      horizons_data = [];
      horizons_data.push(genHorizonData(data.d._context_));
      charts.pHorizonGroup.data(horizons_data);
      charts.pHorizonGroup.update();

      var meta = data.d._context_.metadata;
   }

   function lineMouseOver(data) {
      tournamentMouseOver(data.d._context_);
   }

   function lineMouseOut(data) {
      tournamentMouseOut(data.d._context_);
   }

   function clickPCaxis(data) {
      console.log('d', data.d);
      console.log('x', data.extents);
      console.log('a', data.axis_values);
      console.log('v', data.item_values);
      console.log('m', data);
   }

   pv.displayMCPmatches = function() {
      selected_tournaments = selected_tournaments.filter(function(tournament) { return tournament.sources.indexOf('mcp') >= 0; } );
      displayed_tournaments = selected_tournaments;
      selected_matches = selected_matches.filter(function(match) { return match.data.sources.indexOf('mcp') >= 0; });
      displayed_matches = selected_matches;

      pv.displayLadder(selected_tournaments);
   }

   function mcpCount(matches) {
      var total = 0;
      matches.forEach(function(match) { if (match.data.sources.indexOf('mcp') >= 0) total += 1; });
      return total;
   }

   pv.displayPBPmatches = function() {
      selected_tournaments = selected_tournaments.filter(function(tournament) { return tournament.sources.indexOf('pbp') >= 0; } );
      displayed_tournaments = selected_tournaments;
      selected_matches = selected_matches.filter(function(match) { return match.data.sources.indexOf('pbp') >= 0; });
      displayed_matches = selected_matches;

      pv.displayLadder(selected_tournaments);
   }

   function pbpCount(matches) {
      var total = 0;
      matches.forEach(function(match) { if (match.data.sources.indexOf('pbp') >= 0) total += 1; });
      return total;
   }

   function opponentNames(matches) {
      var opponents = [];
      matches.forEach(function(match) {
         var opponent = match.data.metadata.players[1].name;
         if (opponents.indexOf(opponent) < 0) opponents.push(opponent);
      });
      return opponents;
   }

   function tournamentNames(tournaments) {
      var tnames = [];
      tournaments.forEach(function(tournament) {
         if (tnames.indexOf(tournament.tournament) < 0) tnames.push(tournament.tournament);
      });
      return tnames;
   }

   function displayOpponentMatches(opponent) {
      var modified_tournaments = [];
      selected_tournaments.forEach(function(t) {
         var modified_tournament = {};
         for (var m=0; m < t.matches.length; m++) {
            if (t.matches[m].data.metadata.players[1].name == opponent) {
               Object.keys(t).forEach(function(key) {
                  modified_tournament[key] = t[key];
               });
               modified_tournament.matches = [t.matches[m]];
               modified_tournaments.push(modified_tournament);
            }
         }
      });
      selected_tournaments = modified_tournaments;
      displayed_tournaments = selected_tournaments;
      selected_matches = selected_matches.filter(function(match) { return match.data.metadata.players[1].name == opponent; });
      displayed_matches = selected_matches;

      pv.displayLadder(selected_tournaments);
   }

   function displayTournamentMatches(tournament) {
      selected_tournaments = selected_tournaments.filter(function(t) { return t.tournament == tournament; });
      displayed_tournaments = selected_tournaments;
      selected_matches = selected_matches.filter(function(match) { return match.data.metadata.tournament.name == tournament; });
      displayed_matches = selected_matches;

      pv.displayLadder(selected_tournaments);
   }

   function displaySurfaceMatches() {
      var f_data = charts.pCoords.filteredData();
      var data = f_data.map(function(m) { return m._context_; });
      var sc = pv.matchSurfaces(data);
      pv.displayCounts(sc, '#filteredSurfaces', false);
   }

   pv.clearFilteredMatches = clearFilteredMatches;
   function clearFilteredMatches() {
      d3.select('#filteredSurfaces').selectAll('.sc').remove();
   }

   function brushStart() {
      pv.hide(['horizon_group']);
      mv.hide();
   }

   function brushEnd(brushes) {
      var activeBrushes = charts.pCoords.activeBrushes();
      if (activeBrushes.length) {
         displaySurfaceMatches();
      } else {
         clearFilteredMatches();
      }
   }
  
   function pvHelpModal(data) {
      interact.showModal(data);
   }

   function settingsPC() {
      var hidden = charts.pCoords.hide().filter(function(f) { return ['_context_', 'Date', 'surface', 'muid'].indexOf(f) < 0; });
      var dimensions = charts.pCoords.activeAxes().concat(hidden);
      var content = '<h2> Parallel Coordinates Settings </h2><p>Select the Dimensions to view in the Parallel Coordinates Chart:  <\p>';

      content = content + '<div class="flex-modal-parent">';
      dimensions.forEach(function(dimension) {
         var checked = hidden.indexOf(dimension) < 0;
         content = content + '<div class="flex-modal-check">'
         content = content + '<input type="checkbox" class="settingsPC" name="' + dimension + '" value="' + dimension + '"';
         if (checked) content = content + 'checked';
         content = content + '>' + dimension + '</div>'
      });
      content = content + '</div>';
      content = content + '<div class="flex-meta-parent"> <div class="flex-meta-child"> <button class="btn meta-btn meta-submit" alt="Submit" onclick="pv.selectAxes()" tabindex="-1">Submit</button> <button class="btn meta-btn meta-cancel" alt="Cancel" onclick="interact.closeModal()" tabindex="-1">Cancel</button> </div> </div>';

      interact.showModal(content, 'Parallel Coordinates Settings');

   }

   pv.selectAxes = function() {
      var selection = [];

      var checks = document.querySelectorAll('.settingsPC');
      for (a=0; a < checks.length; a++) {
         if (checks[a].checked) selection.push(checks[a].value);
      }
        
      var hidden = charts.pCoords.hide();
      var all = charts.pCoords.activeAxes().concat(hidden);
      var hide = all.filter(function(f) { return selection.indexOf(f) < 0; });
      charts.pCoords.clearBrushes();
      charts.pCoords.activeAxes(selection);
      charts.pCoords.hide(hide).update();
      interact.closeModal();
   }

   pv.surfaceCount = surfaceCount;
   function surfaceCount(tourneys) {
      tourneys = tourneys || tournaments;
      var surfaces = {};
      tourneys.forEach(function(tournament) {
         var surface = tournament.surface.toLowerCase();
         if (Object.keys(surfaces).indexOf(surface) < 0) {
            surfaces[surface] = { tournaments: 0, matches: 0, wins: 0 };
         }

         surfaces[surface].tournaments += 1;
         surfaces[surface].matches += tournament.matches.length;
         
         tournament.matches.forEach(function(match) {
            if (match.won) { surfaces[surface].wins += 1; }
         });
      });
      return surfaces;
   }

   pv.matchSurfaces = matchSurfaces;
   function matchSurfaces(matches) {
      var surfaces = {};
      matches.forEach(function(match) {
         var surface = match.metadata.tournament.surface.toLowerCase();
         if (Object.keys(surfaces).indexOf(surface) < 0) { surfaces[surface] = { matches: 0, wins: 0 }; }

         surfaces[surface].matches += 1;
         if (match.won) { surfaces[surface].wins += 1; }
      });
      return surfaces;
   }

   pv.clear = function() {
      pv.hide(['pc_div']);

      pv.player.name = '';
      pv.player.puid = '';
      pv.codesFetched = false;

      pv.clearFilteredMatches();

      all_matches = [];
      selected_tournaments = [];
      display_tournaments = selected_tournaments;
      selected_matches = [];
      displayed_matches = selected_matches;
      charts.datePicker.data([undefined, undefined]).update();
      pv.displayLadder(selected_tournaments);
   }

   pv.filterSurface = filterSurface;
   function filterSurface(surface) {
      filter_view = false;
      if (surface && surface != 'all') {
         selected_tournaments = selected_tournaments.filter(function(tournament) { var ts = tournament.surface; return ts.toLowerCase() == surface.toLowerCase(); } );
         displayed_tournaments = selected_tournaments;
         selected_matches = selected_matches.filter(function(match) { var ts = match.data.metadata.tournament.surface; return ts.toLowerCase() == surface.toLowerCase(); });
         displayed_matches = selected_matches;

         pv.displayLadder(selected_tournaments);
      mv.hide();
      } else {
         pv.displayLadder(tournaments);
      }
   }

   function zoomByYear(d, years) {
      filter_view = false;
      var year = d.getFullYear();
      var start_year = new Date(year + '-01-01');
      // var start_year = new Date(`${year}-01-01`);
      var end_year = new Date((+year + 1) + '-01-01');
      // var end_year = new Date(`${(+year + 1)}-01-01`);
      console.log(start_year, end_year);
      end_year = end_year > pv.maxDate ? pv.maxDate : end_year;
      charts.datePicker.set(start_year, end_year);
   }

   pv.zoomByRange = zoomByRange;
   function zoomByRange(date_range) {
      var start_date = date_range[0];
      var end_date = date_range[1];
      filter_view = false;
      selected_tournaments = tournaments.filter(function(tournament) { 
         var date = tournament.date; 
         return date >= start_date && date <= end_date;
      });
      displayed_tournaments = selected_tournaments;

      selected_matches = all_matches.filter(function(match) { 
         var date = new Date(match.data.metadata.match.date);
         return date >= start_date && date <= end_date;
      });
      displayed_matches = selected_matches;

      pv.displayLadder(selected_tournaments);
   }

   function zoomByRound(d, i) {
      filter_view = true;
      highlightRung(d);
      var rung = ladder_rungs[d];
      if (rung == 'W') {
         selected_matches = displayed_matches.filter(function(match) { return match.round == 'F' && match.won; });
      } else if (rung == 'Q') {
         selected_matches = displayed_matches.filter(function(match) { return match.round.indexOf('Q') >= 0; });
      } else {
         selected_matches = displayed_matches.filter(function(match) { return match.round == rung; });
      }
      var ml = selected_matches.map(function(m) { return m.data; });

      var sc = pv.matchSurfaces(ml);
      pv.displayCounts(sc, '#surfaceFilters');
      pv.displayStats(selected_matches);
      pv.df();

      pv.hide(['horizon_group']);
      d3.select('#tName').text('');
      mv.hide();
   }

   function fullLadder() {
      filter_view = false;
      selected_tournaments = tournaments;
      displayed_tournaments = tournaments;
      selected_matches = all_matches;
      displayed_matches = all_matches;
      charts.datePicker.set(new Date(), new Date());
      pv.displayLadder();
   }

   function highlightRung(rung) {
      d3.selectAll('.itemDate')
         .style({
            'opacity': function(d) { 
               return d.rung == rung || rung == undefined ? .8 : .15 
            }
         })
      d3.selectAll('.itemConnector')
         .style({
            'stroke-opacity': function(d) { return rung ? .2 : .7 },
            'stroke-width': function(d) { return rung ? 2 : 1 }
         })
   }

   function tournamentMouseOver(d) {
      if (filter_view) return;

      var shapeColor = charts.ladderChart.exports().shapeColor;
      var root = charts.ladderChart.exports().root;

      root.selectAll('.itemDate')
         .style({
            fill: shapeColor,
            opacity: .7
         });
      root.select("[id='itemDate" + d.tidx + "']")
      // root.select(`[id='itemDate${d.tidx}']`)
         .style({
            fill: 'yellow',
            opacity: .7
         });
   }

   function tournamentMouseOut(d) {
      if (filter_view) return;

      var shapeColor = charts.ladderChart.exports().shapeColor;
      var root = charts.ladderChart.exports().root;

      if (d.tidx != selected_tournament) {
         root.select("[id='itemDate" + d.tidx + "']")
         // root.select(`[id='itemDate${d.tidx}']`)
            .style({
               fill: shapeColor,
               opacity: .7
            });
      }
   }

   function tournamentClick(d) {
      selected_tournament = d.tidx;
      if (typeof events.clickTournament == 'function') { events.clickTournament(d); }
      var year = d.date.getFullYear();

      // remove prior data
      pv.displayStats(d.matches);
      charts.pHorizonGroup.data([]).update();
      d3.select('#matchDate').text('');
      var tourney = d3.select('#tName');
      if (d && d.matches) {
         var year = d.date.getFullYear();
         tourney
            .text(d.tournament + ' ' + year)
            .on('click', function() { 
               console.log(d.tuid); 
            });
      } else {
         tourney.text('');
      }

      // fetch codes for tournament matches if necessary
      if (d.codesFetched) {
         tournamentMatches();
      } else {
         aip.getPlayerTourneyMatches(d.tuid, pv.player.puid, year, function(err, match_codes) {
            if (!err) {
               addCodes(match_codes);
               tournamentMatches();
            }
         });
      }

      function addCodes(match_codes) {
         d.codesFetched = true;
         match_codes.forEach(function(mcodes) {
            for (var m=0; m < d.matches.length; m++) {
               if (d.matches[m].muid == mcodes.muid) {
                  d.matches[m].data.codes = mcodes.codes;
                  if (d.matches[m].reversed) {
                     d.matches[m].data.codes.forEach(function(c) {
                        c.first_service = 1 - c.first_service;
                     });
                  }
               }
            }
         });
      }
      
      function tournamentMatches() {
         pv.updateCharts(d);
      }
   }

   pv.hide = function(include) { 
      changeView('none', undefined, include); displayState = 'none'; 
   }

   pv.show = function(exclude) { 
      changeView('inline', exclude); displayState = 'inline'; 
   }

   pv.displayState = function() { return display_state; }

   pv.tournaments = function(match_list) {
      filter_view = false;
      if (!arguments.length) return tournaments;

      all_matches = match_list;

      idx = {};
      all_matches.forEach(function(m, i) { idx[m.muid] = i; });

      tournaments = trny_list(match_list);

      var td = tournaments.map(function(tournament) { return tournament.date; });
      pv.maxDate= new Date(Math.max.apply(null,td));

      selected_tournaments = tournaments;
      displayed_tournaments = tournaments;
      selected_matches = all_matches;
      displayed_matches = all_matches;
   }

   pv.addStats = function(playerName, data) {
      orientStats(playerName, data);
      integrateStats(data);
      pv.displayStats(all_matches);
   }

   pv.displayStats = function(matches) {
      matches = matches || all_matches;
      var stats = pcStats(matches);
      if (stats.length) {
         pv.show();
         pv.charts().pCoords.data(stats).update();
      } else {
         pv.hide('pc_div');
      }
   }

   function integrateStats(data) {
      data.forEach(function(match) {
         if (all_matches[idx[match.muid]]) {
            all_matches[idx[match.muid]].data.stats = match.stats;
         }
      });
   }

   function pcStats(matches) {
      var statObjs = [];
      matches.forEach(function(match) {
         if (match.data.stats && match.data.stats[0].raw && match.data.stats[0].raw.length) {

            var meta = match.data.metadata;
            statObj = { _context_: match.data };
            statObj.surface = meta.tournament.surface;

            var dataObj = genDataObj(match.data.stats[0].raw);
            var Aces = dataObj['A'];
            var DF   = dataObj['DF'];
            var SP   = dataObj['SP'];
            var S1In = dataObj['S1In'];
            var S1PW = dataObj['S1PW'];
            var S2PW = dataObj['S2PW'];
            S1PW[0] = S1PW[0] || 0;
            S2PW[0] = S2PW[0] || 0;
            S1PW[1] = S1PW[1] || 0;
            S2PW[1] = S2PW[1] || 0;

            var SG   = dataObj['SG'];
            var bpS  = dataObj['bpS'];
            var bpF  = dataObj['bpF'];
            var tp   = SP.reduce(function(a, b) { return +a + +b; });

            var TPW = tp ? ((+S1PW[0] + +S2PW[0] + (SP[1] - +S1PW[1] - +S2PW[1])) / tp * 100).toFixed(1) : 0;
            var RPW = +SP[1] ? ((+SP[1] - +S1PW[1] - +S2PW[1]) / +SP[1] * 100).toFixed(1) : 0;
            var SPL = +SP[0] ? ((+SP[0] - +S1PW[0] - +S2PW[0]) / +SP[0] * 100).toFixed(1) : 0;
            var BPS  = +bpF[0] ? (+bpS[0] / +bpF[0] * 100).toFixed(1) : 0;
            var BPC  = +bpF[1] ? ((+bpF[1] - +bpS[1]) / +bpF[1] * 100).toFixed(1) : 0;
            var vAge = (meta.players[0].age && meta.players[1].age) ? meta.players[1].age - meta.players[0].age : 0;
            var W1st = +S1In[0] ? (+S1PW[0] / +S1In[0] * 100).toFixed(1) : 0;
            var W2nd = (+SP[0] - +S1In[0]) ? ((+S2PW[0] / (+SP[0] - +S1In[0])) * 100).toFixed(1) : 0;
            var v1st = +S1In[1] ? ((+S1In[1] - +S1PW[1]) / +S1In[1] * 100).toFixed(1) : 0;
            var v2nd = (+SP[1] - +S1In[1]) ? ((+SP[1] - +S1In[1] - +S2PW[1]) / (+SP[1] - +S1In[1]) * 100).toFixed(1) : 0;

            statObj['Date'] = new Date(meta.match.date);
            statObj['Won'] = match.won ? 1 : 0;
            statObj['vRank'] = meta.players[1].rank ? meta.players[1].rank : 0;
            statObj['aRank'] = meta.players[0].rank ? meta.players[0].rank : 0 ;
            statObj['vAge'] = vAge;
            statObj['aAge'] = meta.players[0].age ? meta.players[0].age : 18;
            statObj['TP'] = tp;
            statObj['DR'] = SPL > 0 ? (RPW / SPL).toFixed(1) : 0;
            statObj['Ace %'] = +SP[0] ? (+Aces[0] / +SP[0] * 100).toFixed(1) : 0;
            statObj['DF %'] = SP[0] ? (+DF[0] / +SP[0] * 100).toFixed(1) : 0;
            statObj['1st In'] = SP[0] ? (+S1In[0] / +SP[0] * 100).toFixed(1) : 0;
            statObj['1st W%'] = W1st;
            statObj['2nd W%'] = W2nd;
            statObj['TPW'] = TPW;
            statObj['RPW'] = RPW;
            statObj['v1st %'] = v1st;
            statObj['v2nd %'] = v2nd;
            statObj['vA %'] = +SP[1] ? (+Aces[1] / +SP[1] * 100).toFixed(1) : 0;
            statObj['BP'] = +bpF[1];
            statObj['BP Cnv'] = +bpF[1] - +bpS[1];
            statObj['BPC %'] = BPC;
            statObj['BP Svd'] = +bpS[0];
            statObj['BP Fcd'] = +bpF[0];
            statObj['BPS %'] = BPS;
            statObj['Time'] = meta.match.duration ? (meta.match.duration / 60).toFixed(2) : 0;
            statObjs.push(statObj);
         }
      });

            /*
            statObj['Avg Rally'] = match.stats[0].overview.avg_rally;
            var calcObj = genCalcObj(match.data.stats[0].overview.calcs);
            statObj['Aces'] = calcObj['Aces'] ? calcObj['Aces'].n[0] : 0;
            statObj['Double Faults'] = calcObj['Double Faults'] ? calcObj['Double Faults'].n[0] : 0;
            statObj['Sv Pts %'] = calcObj['Service Points Won'] ? calcObj['Service Points Won'].p[0] : 0;
            statObj['Rc Pts %'] = calcObj['Receiving Points Won'] ? calcObj['Receiving Points Won'].p[0] : 0;
            statObj['BP Won %'] = calcObj['Break Points Won'] ? calcObj['Break Points Won'].p[0] : 0;
            statObj['BP Saved %'] = calcObj['Break Points Saved'] ? calcObj['Break Points Saved'].p[0] : 0;
            statObj['Pts %'] = ptsPct(calcObj['Total Points Won']);
            */

      return statObjs;

      function ptsPct(tpw) {
         return ((tpw.n[0] / tpw.n.reduce(function(a, b) { return (a+b); })) * 100).toFixed(0);
      }

      function genDataObj(raw_data) {
         var dataObj = {};
         raw_data.forEach(function(stat) {
            var key = Object.keys(stat);
            var value = stat[key];
            dataObj[key] = Array.isArray(value) ? value : [value, value];
         });
         return dataObj;
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
            match.stats.forEach(function(s) { reverseStats(s); });
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
         stats.raw.forEach(function(stat) {
            var keys = Object.keys(stat);
            keys.forEach(function(key) {
               if (Array.isArray(stat[key])) { stat[key].reverse(); }
            });
         });
      }
   }

   pv.displayLadder = function(tourneys) {
      tourneys = tourneys || tournaments;
      // if (!tourneys.length) return;

      pv.displayStats(selected_matches);
      var sc = pv.surfaceCount(selected_tournaments);
      pv.displayCounts(sc, '#surfaceFilters');
      pv.df();

      pv.hide(['horizon_group']);
      d3.select('#tName').text('');
      d3.select('#matchDate').text('');
      mv.hide();

      selected_tournament = undefined; // reset so none are highlighted
      var s = { values: [] }
      tourneys.forEach(function(tournament, i) {
         var match = tournament.matches[0];
         var round = match.data.metadata.tournament.round;
         if (round == 'RR') {
            var rung = 4;
         } else {
            var rung = ladder_rungs.indexOf(round);
         }
         if (rung == ladder_rungs.length - 2 && match.won) rung = ladder_rungs.length - 1;
         // this object is very similar to the object built by trny_list
         // TODO: merge or reuse
         var rank_code = match.data.metadata.tournament.rank;
         var rank = rank_code ? tournament_ranks[rank_code] : 280;
         rank = rank || 400;
         var e = {
            tournament: tournament.tournament,
            codesFetched: pv.codesFetched,
            tuid: tournament.tuid,
            tidx: tournament.tidx,
            round:   round,
            category: tournament.tour || 'atp',
            surface: selectSurface(tournament.surface.toLowerCase()),
            rank:    rank,
            rung:    rung > 0 ? rung : 0,
            date:    new Date(match.data.metadata.match.date),
            matches: tournament.matches
         };
         s.values.push(e);
      });
      charts.ladderChart.options({ plot: { title: { text: pv.player.name }}});
      pv.charts().ladderChart.data(s).update();
   }

   pv.df = function() {
      var filters = [];

      var mcp_total = mcpCount(selected_matches);
      if (mcp_total) {
         filters.push({
            append: 'text',
            style: { 'cursor': 'pointer' },
            attr:  { 'transform': 'translate(25, 15)' },
            text:  'MCP: ' + mcp_total,
            click: pv.displayMCPmatches
            
         });
      }
      var pbp_total = pbpCount(selected_matches);
      if (pbp_total) {
         filters.push({
            append: 'text',
            style: { 'cursor': 'pointer' },
            attr:  { 'transform': 'translate(25, 15)' },
            text:  'PBP: ' + pbp_total,
            click: pv.displayPBPmatches
            
         });
      }
      var opponents = opponentNames(selected_matches);
      if (opponents) {
         var placeholder = opponents.length == 1 ? opponents[0] : 'Opponents: ' + opponents.length;
         filters.push({
            fx:    'displayOpponentMatches',
            attr:  {
               'id'         : 'selectedOpponents',
               'class'      : 'filter-input filter-opponent',
               'type'       : 'text',
               'placeholder': placeholder,
            },
            type: 'input'
         });
      }
      var tnames = tournamentNames(selected_tournaments);
      if (tnames) {
         var placeholder = tnames.length == 1 ? tnames[0] : 'Tournaments: ' + tnames.length;
         filters.push({
            fx:    'displayTournamentMatches',
            attr:  {
               'id'         : 'selectedTournaments',
               'class'      : 'filter-input filter-tournament',
               'type'       : 'text',
               'placeholder': placeholder,
            },
            type: 'input'
         });
      }
      pv.displayFilters(filters);

      var oN = document.getElementById('selectedOpponents');
      if (oN) {
         new Awesomplete(oN, { list: opponents });
         oN.onfocus = function() { this.setSelectionRange(0, this.value.length); }
         oN.addEventListener('keydown', catchTab , false);
         oN.addEventListener('keyup', submitOpponent, false);
         oN.addEventListener("awesomplete-selectcomplete", function(){ displayOpponentMatches(this.value); }, false);
      }

      var sT = document.getElementById('selectedTournaments');
      if (sT) {
         new Awesomplete(sT, { list: tnames });
         sT.onfocus = function() { this.setSelectionRange(0, this.value.length); }
         sT.addEventListener('keydown', catchTab , false);
         sT.addEventListener('keyup', submitTournament, false);
         sT.addEventListener("awesomplete-selectcomplete", function(){ displayTournamentMatches(this.value); }, false);
      }

   }

   function submitOpponent(event, that) {
      that = that || this;
      if (event.which == 13 || event.which == 9) { 
         var fx = that.parentElement.parentElement.getAttribute('fx');
         var element = that.parentElement.querySelector('li');
         if (element) {
            displayOpponentMatches(element.textContent);
         } else if (!that.value) {
            var placeholder = that.getAttribute('placeholder');
            if (placeholder.indexOf('Opponent') < 0) {
               displayOpponentMatches(placeholder);
            }
         }
      }
   }

   function submitTournament(event, that) {
      that = that || this;
      if (event.which == 13 || event.which == 9) {
         var element = that.parentElement.querySelector('li');
         if (element) {
            displayTournamentMatches(element.textContent);
         } else if (!that.value) {
            var placeholder = that.getAttribute('placeholder');
            if (placeholder.indexOf('Tournament') < 0) displayTournamentMatches(placeholder);
         }
      }
   }

   pv.displayFilters = function(filters) {

      var filter_div = d3.select('#otherFilters');
      filter_div.selectAll('.filter').remove();

      filters.forEach(function(filter, i) {
         var div = filter_div.append('div')
            .attr({
               'class': 'flex-filters filter',
               'id': 'filter' + i,
               'fx': filter.fx
            })
            .style({
               'height': '20px',
               'cursor': 'pointer'
            })
            .on('click', function(d) { clickedIt(this); })

         if (filter.type == 'input') {
            div
               .append('input')
               .attr(filter.attr)
         } else {
            // replace with supershapes
            var dSvg = div.append('svg')
               .attr({
                  'class': 'sSvg',
                  'height': '20px',
                  'width': '200px',
               })

            dSvg
               .append('text')
               .style(filter.style)
               .attr(filter.attr)
               .text(filter.text)
         }

         function clickedIt(that) {
            if (filter.click) filter.click();
         }

      });
   }

   pv.displayCounts = function(sc, div, click) {
      click = click == undefined ? true : click;

      var osc = Object.keys(sc).sort();
      var all = { tournaments: 0, matches: 0, wins: 0 }

      osc.forEach(function(surface) {
         if (sc[surface].tournaments) all.tournaments += sc[surface].tournaments;
         if (sc[surface].matches) all.matches += sc[surface].matches;
         if (sc[surface].wins) all.wins += sc[surface].wins;
      });

      sc['all'] = all;
      osc.unshift('all');

      var surface_div = d3.select(div);
      surface_div.selectAll('.sc').remove();

      osc.forEach(function(surface, i) {
         var stat = sc[surface].wins + '/' + sc[surface].matches;
         var pct = (sc[surface].matches) ? (sc[surface].wins / sc[surface].matches * 100).toFixed(1) + '%' : '';
         var div = surface_div.append('div')
            .attr({
               'class': 'flex-filters sc',
               'id': 'surface' + i,
               'surface': surface
            })
            .style({
               'cursor': function() { return click ? 'pointer' : 'default'; },
            })
            .on('click', function(d) { clickedIt(this); })

         var d_surface = surface[0].toUpperCase() + surface.substring(1);

         var dSvg = div.append('svg')
            .attr({
               'class': 'sSvg',
               'height': '20px',
               'width': '200px',
               'surface': surface
            })

         dSvg
            .append('circle')
            .style({
               'cursor': function() { return click ? 'pointer' : 'default'; },
               'stroke':       options.colors.surfaces[surface],
               'stroke-width': 1
            })
            .attr({
               transform:   'translate(10, 10)',
               fill:        options.colors.surfaces[surface],
               r:           6,
            })
            .on('click', function(d) { clickedIt(this); })

         dSvg
            .append('text')
            .style({
               'cursor': function() { return click ? 'pointer' : 'default'; },
            })
            .attr({
               transform:   'translate(25, 15)',
            })
            .text(function(d) { 
               var text = d_surface + ': ' + stat; 
               if (pct) text = text + ' (' + pct + ')'; 
               return text;   
            })

         function clickedIt(that) {
            if (click) {
               if (surface == 'all') {
                  fullLadder();
               } else {
                  var e = d3.select(that);
                  pv.filterSurface(e.attr('surface'));
               }
            }
         }

      });
   }

   function selectSurface(surface) {
      surface = surface.toLowerCase();
      if (surface.indexOf('grass') >= 0) return 'grass';
      if (surface.indexOf('hard') >= 0) return 'hard';
      if (surface.indexOf('acrylic') >= 0) return 'hard';
      if (surface.indexOf('clay') >= 0) return 'clay';
      if (surface.indexOf('carpet') >= 0) return 'carpet';
      return 'unknown';
   }

   pv.updateCharts = updateCharts;
   function updateCharts(tournament) {
      pv.show('pc_div')
      var horizons_data = [];

      if (!tournament) { 
         charts.pHorizonGroup.data([]);
         return; 
      }

      tournament.matches.forEach(function(match, i) {
         horizons_data.push(genHorizonData(match.data, i));
         match.umo = match.data.umo; // legacy necessary?
      });

      charts.pHorizonGroup.data(horizons_data);
      charts.pHorizonGroup.update();
   }

   function genHorizonData(match, i) {
      if (match.umo == undefined) {
         var md = mo.matchObject();
         md.options(match.opts);
         md.metadata(match.metadata);
         populateUMO(match, md);
         match.umo = md;
      }

      var pth = ptsHorizon()
         .data(match.umo)
         .colors([options.colors.players[0], options.colors.players[1]])
         .events({ 
            'chart': { 'click': clickMatch }
         });
      pth.options({
         id: 'hc' + i, 
         height: 50,
         display: { sizeToFit: true },
         elements: { brush: false }
      });
      pth.events({
         mouseover: null,
         mouseout: null
      });

      match.outcome = buildScore(match.score, match.metadata.players, match.metadata.tournament.round);

      return { score: match.outcome, umo: match.umo, won: match.won, horizon: pth };
   }

   pv.resize = function() {
      if (displayState == 'none') return;
      if (options.elements.mr_div && charts.matchRadar) {
         var mr_div = d3.select('#' + options.elements.mr_div);
         var width = mr_div.node().getBoundingClientRect().width;
         var height = mr_div.node().getBoundingClientRect().height;
         var size = Math.min(width, height);
         charts.matchRadar.width(size).height(size).update();
      }
      if (options.elements.horizon_group && charts.pHorizonGroup) {
         charts.pHorizonGroup.update();
      }
      if (options.elements.season_div && charts.ladderChart) {
         charts.ladderChart.update({ sizeToFit: true });
      }
      if (options.elements.pc_div) { charts.pCoords.update(); }
      if (options.elements.dp_div) { charts.datePicker.update(); }
   }

   pv.charts = function() { return charts; }

   pv.options = function(values) {
      if (!arguments.length) return options;
      keyWalk(values, options);
      return pv;
   }

   pv.events = function(functions) {
       if (!arguments.length) return events;
       keyWalk(functions, events);
       return pv;
   }

   function changeView(what, exclude, include) {
      var elements = options.elements;
      var keys = Object.keys(elements);

      if (exclude && exclude.length) keys = keys.filter(function(f) { return exclude.indexOf(f) < 0; });
      if (include && include.length) keys = keys.filter(function(f) { return include.indexOf(f) >= 0; });

      keys.forEach(function(e) {
         var element = document.getElementById(elements[e]);
         if (element) { element.style.display = what; }
      });
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

   function trny_list(mlist) {
      var tb = groupByDate(mlist);

      var tnylst = tb.map(function(t, i) { return genT(t, i); });
      return tnylst;

      function toArr(obj) { return Object.keys(obj).map(function(k) { return obj[k] }); }

      function genT(m, i) {
         if (!m) return;
         m = sortMatches(m);
         var meta = m[0].data.metadata;
         // var last_date = lastDate(m);
         var year = meta.match.year;
         var tournament = meta.tournament.name;
         var surface = selectSurface(trnyAttr(m, 'surface'));
         return {
            tournament: tournament,
            tidx: i,
            tuid: meta.tournament.tuid,
            tour: meta.tournament.tour,
            year: year,
            date: new Date(meta.match.date),
            surface: surface ? surface.toLowerCase() : '',
            matches: m,
            sources: tournamentSources(m)
         }
      }

      function tournamentSources(m_list) {
         var sources = [];
         m_list.forEach(function(match) {
            match.data.sources.forEach(function(source) {
               if (!sources.indexOf(source) >= 0) sources.push(source);
            });
         });
         return sources;
      }

      function groupByDate(mlist) {
         if (!mlist.length) return [];
         var tidx = 0;
         var tlist = [];
         var current = [];
         var c_tuid = mlist[0].tuid;
         var last_date = new Date(mlist[0].data.metadata.match.date);
         mlist.forEach(function(m) {
            var this_date = new Date(m.data.metadata.match.date);
            if (
                m.data.metadata.tournament.name.indexOf('Fed Cup') < 0
                && 
                m.data.metadata.tournament.name.indexOf('Davis Cup') < 0 
               ) {
                  if (m.tuid == c_tuid && daysBetween(this_date, last_date) < 20) {
                     m.data.tidx = tidx;
                     current.push(m)
                  } else {
                     tlist.push(current);
                     tidx += 1;
                     m.data.tidx = tidx;
                     current = [m];
                     last_date = this_date;
                     c_tuid = m.tuid;
                  }
               }
         });
         if (current.length) tlist.push(current);

         // filter out all 'tournaments' where not a single match has round info
         // these should be fixed by a 'maintenance' mode...
         tlist = tlist.filter(function(e) { return e.map(function(m) { return m.round }).join('').length; });

         return tlist;
      }

      function trnyAttr(m_arr, attr) {
         for (var m=0; m < m_arr.length; m++) {
            var s_attr = m_arr[m].data.metadata.tournament[attr];
            if (s_attr) { return s_attr; }
         }
         return '';
      }

      function lastDate(m_arr) {
         var ld = new Date('1900-01-01').valueOf();
         m_arr.forEach(function(m) { 
            var td = new Date(m.data.metadata.match.date).valueOf();
            if (td > ld) ld = td;
         });
         return ld;
      }

      function sortMatches(m_arr) {
         var sort_order = { 
            'F': 1, 'SF': 2, 'QF': 3, 'R16': 4, 'R32': 5, 'R64': 6, 'R128': 7, 
            'Q': 8, 'RR': 4,
            'Q3': 8, 'Q2': 9, 'Q1': 10,
         };
         var wr = m_arr.filter(function(f) { return Object.keys(sort_order).indexOf(f.round) >= 0; });
         var nr = m_arr.filter(function(f) { return Object.keys(sort_order).indexOf(f.round) < 0; });
         nr.sort(function(a, b) { return b.won & !a.won ? 0 : 1; });
         wr.sort(function(a, b) { return sort_order[a.round] < sort_order[b.round] ? 0 : 1; });
         return wr.concat(nr);
      }

   }

   function populateUMO(d, umo) {
      if (d.codes && d.codes.length) {
         umo.options(d.options);
         umo.metadata(d.metadata);

         if (d.codes.length > 1) {
            // console.log('merged match');
            // prioritize 'mcp' over 'pbp'
            // TODO: something more intelligent
            d.codes.sort(function(a, b) { return a.source < b.source ? 0 : 1; });
         }
         var first_service = d.codes[0].first_service;
         if (first_service != umo.options().match.first_service) {
            umo.options({ match: { first_service: first_service }});
         }
         d.codes[0].code.forEach(function(sequence) {
            umo.push(sequences.pointParser(sequence.split('|')));
         });
      }
   }

   function clickMatch(d, i, self) {
      var mDiv = document.getElementById('tournamentEnd');
      window.scrollTo(0, mDiv.offsetTop);

      if (d.umo || d.data.codes.length) {

         events.updateMatch(d.umo);
         var meta = d.umo.metadata();
         var report = (['Player Match:', meta.tournament.name, meta.match.date, d.umo.teams().join('-')].join(' ')).replace(/\ /g, '_');
         if (aip) aip.sendReport(report);

         var dt = new Date(d.umo.metadata().match.date);
         d3.select('#matchDate').text(dt.toDateString());

      } else {
         displayState('clear');
      }
   }

   function daysBetween(one, another) {
      return Math.round(Math.abs((+one) - (+another))/8.64e7);
   }

   function buildScore(score, players, round) {
      score_string = '';
      for (var s=0; s < score.length; s++) {
         if (score_string) { score_string += ', '; }

         score_string += score[s].player0 + '-' + score[s].player1;

         if (score[s].tiebreak != undefined) { 
               score_string += '(' + score[s].tiebreak + ')' 
         };
      }

      var ns = players[1].name.split(' ');
      score_string = round + ': ' + ns[ns.length - 1] + ' ' + score_string;
      return score_string;
   }

   function catchTab(event) { if (event.which == 9) { event.preventDefault(); } }

   return pv;
}

function matchView() {

   //container
   var mv = {};

   var umo;
   var charts = {};
   var displayState = 'none';

   var options = {
      elements: {
         tournament: undefined, matchOverview: undefined, 
         geoLocation: undefined, statPanel: undefined, 
         rt_div: undefined, gt_div: undefined,
         horizon_div: undefined, pts_div: undefined, 
         m_chart: undefined, gf_chart: undefined
      },
      colors: { players: { 0: '', 1: '' } }
   };

   var events = { };

   mv.init = function () {
      initializeCharts();
      chartInteractions();
   }

   function initializeCharts() {

      if (options.elements.matchOverview) {
         charts.ov = mOverview();
         charts.ov.options({ colors: options.colors });
         d3.select('#' + options.elements.matchOverview).call(charts.ov);
      }

      if (options.elements.statPanel) {
         charts.sv = statView();
         charts.sv.options({ colors: options.colors });
         d3.select('#' + options.elements.statPanel).call(charts.sv);
      } 

      if (options.elements.horizon_div) {
         charts.pHorizon = ptsHorizon();
         d3.select('#' + options.elements.horizon_div).call(charts.pHorizon);
         charts.pHorizon.width(600).height(70);
         charts.pHorizon.colors([options.colors.players[0], options.colors.players[1]]);
      } 

      if (options.elements.rt_div) {
         charts.rallyChart = rallyTree().width(150).height(150);
         function displayPct() {
            var display = rallyChart.displayPct();
            rallyChart.displayPct(!display);
         }
         charts.rallyChart.events({ 'statbar': { 'click': displayPct }})
         charts.rallyChart.options({
            data: { sort: true },
            points: { 
               colors: {
                  'Ace': 'green', 'Serve Winner': 'lightgreen', 'Winner': 'seagreen', 
                  'Forced Volley Error': 'red', 'Forced Error': 'orange',
                  'Forcing Error': 'green', 'Passing Shot': 'green', 'In': 'yellow', 
                  'Net Cord': 'yellow', 'Double Fault': 'red', 'Unforced Error': 'red', 
                  'Out': 'coral', 'Netted': 'red', 'Net': 'red', 'Out Long': 'red', 
                  'Out Passing Shot': 'red', 'OO': 'red'
               }
            }
         })
         d3.select('#' + options.elements.rt_div).call(charts.rallyChart);
      }

      if (options.elements.gt_div) {
         charts.gameTree = GameTree();
         var gt_opts = {
            lines: {
               points: { winners: "green", errors: "#BA1212", unknown: "#2ed2db" },
               colors: { underlines: "black" }
            },
            nodes: {
               colors: { 0: options.colors.players[0] , 1: options.colors.players[1], neutral: '#ecf0f1' }
            },
            points: {
               winners: ['Winner', 'Ace', 'Serve Winner', 'Passing Shot', 'Return Winner', 
                         'Forcing Error', 'Net Cord', 'In'],
               errors: ['Unforced Error', 'Unforced', 'Forced', 'Error', 'Forced Error',
                        'Out', 'Net', 'Netted Passing Shot', 'Long', 'Out Passing Shot']
            }
         }
         charts.gameTree.options(gt_opts);
         charts.gameTree.width(150).height(150).update();
         d3.select('#' + options.elements.gt_div).call(charts.gameTree);
      }

      if (options.elements.pts_div) {
         charts.pts_match = ptsMatch();
         var popt = { 
            resize: false,
            colors: options.colors
         };
         charts.pts_match.options(popt);
         charts.pts_match.duration(1000);
         charts.pts_match.width(500).height(70);
         d3.select('#' + options.elements.pts_div).call(charts.pts_match);
      }

      if (options.elements.gf_chart) {
         charts.gamefish = gameFish();
         charts.gamefish.options({ colors: options.colors });
         d3.select('#' + options.elements.gf_chart).call(charts.gamefish);
      }

      if (options.elements.pts_div) {
         charts.mc = momentumChart();
         charts.mc.options({ 
            display: { 
               continuous:       false,
               settingsImg:      '/images/gear2.png',
               orientation:      'horizontal',
               transition_time:  1000,
               service:          false,
               rally:            true,
               player:           false,
               grid:             false
            },
            colors: options.colors
         });
         d3.select('#' + options.elements.m_chart).call(charts.mc);

         function mcSettings() {
            var o = charts.mc.options().display.orientation;
            if (o == 'vertical') {
               charts.mc.options({ display: { orientation: 'horizontal' } })
            } else {
               charts.mc.options({ display: { orientation: 'vertical' } })
            }
            charts.mc.update();
         }
         charts.mc.events({ 'settings': { 'click': mcSettings } });
      }
   }

   function chartInteractions() {
      var view_select = charts.gameTree.exports().selectView;
      function serverSelect(d, i, self) {
         view_select(d, i, self);
         var selected = charts.gameTree.options().selectors.selected;
         var rallyServes = selected[0] ? 0 : selected[1] ? 1 : undefined;
         charts.rallyChart.pointsServed(rallyServes);
      }
      charts.gameTree.events({ 'label': { 'click': serverSelect }, 'selector': { 'click': serverSelect } });

      charts.pts_match.events({ 'point_bars': { click: displayGameFish }});
      charts.pHorizon.events({ 'brush': { 'end': displayPoints }});
   }

   mv.hide = function() { changeView('none'); displayState = 'none'; }
   mv.show = function() { changeView('inline'); displayState = 'inline'; }
   mv.displayState = function() { return display_state; }

   mv.umo = function(match_object) {
      if (!arguments.length) return umo;
      if (typeof match_object != 'function' || match_object.type != 'UMO') return;
      umo = match_object;
      updateCharts();
   }

   mv.options = function(values) {
      if (!arguments.length) return options;
      keyWalk(values, options);
      return mv;
   }

   mv.events = function(functions) {
       if (!arguments.length) return events;
       keyWalk(functions, events);
       return mv;
   }

   mv.charts = function() { return charts; }

   mv.resize = function() {
      if (displayState == 'none') return;
      if (options.elements.matchOverview && charts.ov) {
         charts.ov.update();
      }
      if (options.elements.statPanel && charts.sv) {
         charts.sv.update();
      }
      if (options.elements.pts_div && charts.pts_match) {
         var pts_div = d3.select('#' + options.elements.pts_div);
         var width = pts_div.node().getBoundingClientRect().width;
         charts.pts_match.width(width).update();
      }
      if (options.elements.gt_div && charts.gameTree) {
         var gt_div = d3.select('#' + options.elements.gt_div);
         var width = gt_div.node().getBoundingClientRect().width;
         var height = width * .9;
         charts.gameTree.width(width).height(height).update();
      }
      if (options.elements.rt_div && charts.rallyChart) {
         var rt_div = d3.select('#' + options.elements.rt_div);
         var width = rt_div.node().getBoundingClientRect().width;
         var height = width * .9;
         charts.rallyChart.width(width).height(height).update();
      }
      if (options.elements.horizon_div && charts.pHorizon) {
         var horizon_div = d3.select('#' + options.elements.horizon_div);
         var width = horizon_div.node().getBoundingClientRect().width;
         var orientation = charts.pHorizon.options().display.orientation;
         if (orientation == 'horizontal') { 
            charts.pHorizon.width(width).update(); 
         }
      }
      if (options.elements.m_chart && charts.mc) {
         var m_chart = d3.select('#' + options.elements.m_chart);
         var width = m_chart.node().getBoundingClientRect().width;
         charts.mc.options({ display: { orientation: width < 600 ? 'vertical' : 'horizontal' } });
         charts.mc.width(width).update();
      }

      if (options.elements.gf_chart && charts.gamefish && umo) {
         charts.gamefish.update({sizeToFit: true});
         displayGameFish(umo.points()[0]);
      }
   }

   function updateCharts() {
      if (displayState != 'inline') { 
         console.log('Cannot update charts when not displayed');
         return; 
      }

      charts.ov.data(umo);
      charts.ov.update();
      charts.sv.data(statistics.statObjects(umo.points()))
      charts.sv.update()
      charts.pHorizon.data(umo);

      var maxRally = d3.max(umo.points().map(function(p) { return p.rally ? p.rally.length : 0}));
      if (!maxRally) {
         d3.select('#rallytree').style('display', 'none');
      } else {
         charts.rallyChart.options({data: { sort: true }})
         charts.rallyChart.points(umo.points());
      }

      var max_points = Math.max.apply(null, umo.sets().map(function(m) { return m.points().length; }));
      var popt = { set: { average_points: max_points }, points: { max_width_points: max_points } };
      charts.pts_match.options(popt);
      charts.pts_match.data(umo);

      charts.mc.data(umo);

      var players = umo.teams();
      charts.gameTree.options({ 
         labels: { 
            Player: players[0], 
            Opponent: players[1]
         },
      });
      charts.gameTree.data(umo.points());
      charts.gameTree.update();

      mv.resize();
   }

   function displayPoints(d) {
      var start = Math.floor(d[0]);
      var end = Math.ceil(d[1]);
      var set_boundaries = umo.sets().map(function(set) { return set.points().length; }).reverse();
      set_boundaries.forEach(function(e) {
         if (end >= e) end -= 1;
         if (start >= e) start -= 1;
      });
      var points = umo.points();
      var point_range = points.slice(Math.floor(d[0]), Math.ceil(d[1]));
      if (point_range.length > 1) {
         charts.sv.data(statistics.statObjects(point_range)).update();
         charts.rallyChart.points(point_range).update();
         charts.gameTree.data(point_range).update();
      } else {
         charts.sv.data(statistics.statObjects(points)).update();
         charts.rallyChart.points(points).update();
         charts.gameTree.data(points).update();
      }
   }

   function displayGameFish(point) {
      var h = ptsHeight();
      charts.gamefish.height(h).update();
      gf(point.set, point.game, mv.charts().gamefish);

      function gf(set, game, which_fish) {
         gamescore = umo.sets()[set].games()[game].score;
         gamerange = umo.sets()[set].games()[game].range;
         gamepoints = umo.sets()[set].points().slice(gamerange[0], gamerange[1] + 1); 
         which_fish.options({ score: gamescore });
         which_fish.data(gamepoints);
      }
      charts.gamefish.update({sizeToFit: true});
   }

   function ptsHeight() {
      // nasty hack
      return parseInt(d3.select('.ptsMatchroot').style('height').replace( /[^\d\.]*/g, ''));
   }

   function changeView(what) {
      Object.keys(options.elements).forEach(function(e) {
         var element = document.getElementById(options.elements[e]);
         if (element) { element.style.display = what; }
      });
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

   return mv;
}

!function() {

   var search = {};
   var tP, sb;
   var initialized = false;

   var options = {
      domElement: undefined,
      searchForm: undefined,
      searchIcon: undefined
   };

   var events = {
      submit: undefined
   };

   search.init = function() {
      if (!options.domElement || !options.searchForm) {
         initialized = false;
         return false;
      }

      sb = document.getElementById(options.domElement);
      tP = document.getElementById(options.searchForm);
      if (!sb || !tP) {
         initialized = false;
         return false;
      }

      if (options.searchIcon) {
         var searchIcon = document.getElementById(options.searchIcon);
         if (searchIcon) searchIcon.onclick = function() { toggleSearch(); };
      }

      // hack to defocus after entry of player name
      var bb = document.createElement('input');
      tP.appendChild(bb);
      bb.setAttribute('id', 'blur');
      bb.setAttribute('type', 'text');
      bb.style.position = 'absolute';
      bb.style.opacity = '0'; 

      tP.addEventListener('keydown', catchTab , false);
      tP.addEventListener("keyup", function(event) {
         if (event.which == 13 || event.which == 9) { tPenter (); }
      });
      tP.addEventListener("awesomplete-selectcomplete", function(e){ tPsubmit (); }, false);

   }

   function tPenter() {
      var element = document.querySelector('#' + options.domElement + ' li');
      if (element) tP.value = element.textContent.split('[')[0].trim();
      tPsubmit();
   }

   function tPsubmit() {
      document.getElementById('blur').focus();
      if (typeof events.submit == 'function') { events.submit(tP.value); }
      toggleSearch();
   }

   search.toggleSearch = toggleSearch;
   function toggleSearch(state) { 
     if (sb) {
        var visible = sb.style['visibility'] || 'hidden';
        if (state == 'close') {
            sb.style['visibility'] = 'hidden';
        } else if (state == 'open') { 
            sb.style['visibility'] = 'visible';
            if (tP) tP.focus();
        } else {
           interact.toggleMenu('close');
           if (visible == 'hidden') {
               sb.style['visibility'] = 'visible';
               if (tP) tP.focus();
           } else {
               sb.style['visibility'] = 'hidden';
           }
        }
     }
     return;
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

   search.options = function(values) {
      if (!arguments.length) return options;
      keyWalk(values, options);
      return search;
   }

   search.events = function(functions) {
       if (!arguments.length) return events;
       keyWalk(functions, events);
       return search;
   }

   function catchTab(event) { if (event.which == 9) { event.preventDefault(); } }

   this.search = search;

}();
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
