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

