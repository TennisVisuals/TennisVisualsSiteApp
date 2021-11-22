// 1. point editor - a way to insert missing points!
//
// 5. send to server & get unique URL for sharing
// 6. load with URL for file - means cache directory with MUID specifically for tracked matches
// 7. court view
//

!function() { 

   // module container
   var charting = {};

   var pts_match;
   var match_data;

   var pcolors = ["#a55194", "#6b6ecf"];

   charting.init = init;
   function init() {

      d3.select('#CHinstructions').html(docs);

      // not necessary 
      // if (interact) interact.events.showModal = metaEdit.hide;

      // start configuration of Spreadsheet
      // spreadsheet is not initialized until after all components have
      // registered callbacks
      mcps.colors = pcolors; 
      mcps.init();
      mcps.events({
            'pointDescription': pointText,
            'finishedLoad': toggleCharts
         })
      mcps.callback(displayUlDl);

      // create UMO instance
      match_data = mo.matchObject();

      // define UMO instance for support modules
      charting.match_data = match_data;

      var sv = statView();
      sv.options({ 
         colors: pcolors,
         display: { responsive: true }
      });
      d3.select('#CHstatPanel').call(sv);
      function updateStats() {
         sv.data(statistics.statObjects(match_data.points()))
         sv.update()
      }
      mcps.callback(updateStats);

      var ov = mOverview();
      d3.select('#CHmatchOverview').call(ov);
      ov.options({ 
         colors: pcolors, 
         display: { 
            highlight_winner: false,
            responsive: true
         } 
      });
      mcps.callback(ov.update);
      ov.data(match_data).update();

      // setup RallyTree
      var rt = rallyTree();
      rt.width(350).height(300);
      rt.options({
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
      });
      d3.select('#CHrallytree').call(rt);
      function updateRT() { if (rt) rt.points(match_data.points()).update(); }
      mcps.callback(updateRT);

      // set up momentum chart
      var mc = momentumChart();
      mc.width(820).height(300);
      mc.options({ 
         display: { 
            sizeToFit:        false,
            continuous:       false,
            orientation:      'horizontal',
            transition_time:  1000,
            service:          false,
            rally:            true,
            player:           false,
            grid:             false
         },
         colors: pcolors
      });
      mc.data(match_data);
      d3.select('#CHmomentum').call(mc);
      function updateMC() { if (mc) mc.update(); }
      mcps.callback(updateMC);

      // setup ptsMatch
      pts_match = ptsMatch();
      pts_match.width(820);
      pts_match.options({ 
         height: 60,
         resize: false,
         display: { 
            sizeToFit:        false,
         }
      });
      function scrollTo(point) { if (typeof mcps.scrollTo == 'function') { mcps.scrollTo(point); }}
      pts_match.events({ 'point_bars': { 'click': scrollTo } });
      pts_match.data(match_data);
      d3.select('#CHpts').call(pts_match);
      function updatePTS() { pts_match.update(); }
      mcps.callback(updatePTS);

      // setup MatchRadars
      mr = RadarChart().options({
         legend: { display: false }, 
         resize: false 
      });
      d3.select('#CHbasestats').call(mr);
      mr.width(400).height(400).levels(6).update();

      ss = RadarChart().options({
         legend: { display: false }, 
         resize: false 
      });
      d3.select('#CHservestats').call(ss);
      ss.width(400).height(400).levels(6).update();
      // need to add data source

      // setup GameTree
      var gt = GameTree();
      var options = {
         display: {
            sizeToFit: false
         },
         lines: {
            points: { winners: "green", errors: "#BA1212", unknown: "#2ed2db" },
            colors: { underlines: "black" }
         },
         nodes: {
            colors: { 0: pcolors[0] , 1: pcolors[1], neutral: '#ecf0f1' }
         },
         selectors: {
            enabled: true,
            selected: { 0: false, 1: false }
         }
      }
      gt.options(options);
      gt.width(350).height(350).update();
      d3.select('#CHgametree').call(gt);
      function updateGT() { 
         if (gt) {
            var players = match_data.teams();
            gt.options({ 
               labels: { 
                  Player: players[0], 
                  Opponent: players[1]
               },
            });
            gt.data(match_data.points()).update(); 
         }
      }
      mcps.callback(updateGT);

      function pointText(text) { 
         var pdElement = d3.select('#pointDescription');
         pdElement.html(text); 
      }

      if (readWrite) {
         readWrite.umo = match_data;
         readWrite.uponCompletion = uponCompletion;
      }

      function metaChange() {
         mcps.populateUMO();
         mcps.update();
      }

      function uponCompletion() {
         metaEdit.umo(match_data).init();
         metaEdit.colors(pcolors);
         metaEdit.onChange = metaChange;
         mcps.callback(metaEdit.update);
         mcps.umo(match_data);
         toggleCharts();
      }

      if (sources) {
         // provide module with functions
         sources.umo = match_data;
         sources.uponCompletion = uponCompletion;
      }

      if (parsers) {
         parsers.umo = match_data;
         parsers.uponCompletion = uponCompletion;
      }

      // set up mcp Spreadsheet
      // umo must be assigned after all callbacks registered
      mcps.umo(match_data, false);

      var okeys = Object.keys(aip.QueryString);
      if (okeys.indexOf('timeline') >= 0) {
         if (aip) aip.sendReport('TIMELINE....' + aip.QueryString['timeline']);
         if (sources) sources.timeline.fetch(aip.QueryString['timeline']);
      } else if (okeys.indexOf('tennis-math') >= 0) {
         if (aip) aip.sendReport('TENNIS-MATH....' + aip.QueryString['tennis-math']);
         var match_id = aip.QueryString['tennis-math'];
         if (sources) sources.tennisMath.process(match_id);
      } else if (okeys.indexOf('tsb') >= 0) {
         if (aip) aip.sendReport('Tennis Scoreboard....' + aip.QueryString['tsb']);
         var match_id = aip.QueryString['tsb'];
         if (sources) sources.tennisSB.process(match_id);
      } else if (parsers && parsers.loaders.length) {
         var able_to_process = parsers.loaders.filter(function(value) { 
            return okeys.indexOf(value.toLowerCase()) > -1 && parsers[value.toUpperCase()].file_format == 'text'; 
         });
         if (able_to_process.length > 0) {
            d3.text("/mailcache/" + able_to_process[0].toLowerCase() + "/" + aip.QueryString[able_to_process[0].toLowerCase()], function(err, data) {
               if (!err && data) {
                  mcps.reset();
                  parsers[able_to_process[0]].parse(data);
                  parsers.uponCompletion();
               } else if (err) {
                  mcps.reset();
                  interact.notFound();
               }
            });
         } else {
            uponCompletion();
         }
      } else {
         uponCompletion();
      }
   }

   charting.reset = reset;
   function reset() {
      mcps.reset();
      if (aip) aip.sendReport('RESET');
      toggleCharts(true);
   }

   function displayUlDl() {
      if (match_data.points().length) {
         d3.select('#download').style('display', 'inline');
         d3.select('#upload').style('display', 'none');
      } else {
         d3.select('#download').style('display', 'none');
         d3.select('#upload').style('display', 'inline');
         metaEdit.hide();
      }
   }

   charting.editInfo = editInfo;
   function editInfo() { if (!metaEdit.visible) { metaEdit.show(); } }

   charting.calcStats = calcStats;
   function calcStats() {
      var players = match_data.teams();
      var c = statistics.counters(match_data.points());

      var st = statistics.baseStats(c);
      var axes = Object.keys(st[0]).filter(function(f) { return f.search('Pct') == 0 });
      var v1 = axes.map(function(a) { return {axis: a, value: st[0][a] == undefined ? 0 : st[0][a] / 100 }; });
      var v2 = axes.map(function(a) { return {axis: a, value: st[1][a] == undefined ? 0 : st[1][a] / 100 }; });
      mr.data([{ key: players[0], values: v1 }, { key: players[1], values: v2 }]);
      mr.update();

      var st = statistics.serveStats(c);
      var axes = Object.keys(st[0]).filter(function(f) { return f.search('Pct') == 0 });
      var v1 = axes.map(function(a) { return {axis: a, value: st[0][a] == undefined ? 0 : st[0][a] / 100 }; });
      var v2 = axes.map(function(a) { return {axis: a, value: st[1][a] == undefined ? 0 : st[1][a] / 100 }; });
      ss.data([{ key: players[0], values: v1 }, { key: players[1], values: v2 }]);
      ss.update();
   }

   /*
   function updateRadarColors() {
      var custom_colors = {};
      var players = match_data.teams();
      custom_colors[players[0]] = pcolors[0];
      custom_colors[layers[1]] = pcolors[1];
      mr.colors(custom_colors);
      ss.colors(custom_colors);
   }
   */

   charting.toggleHelp = toggleHelp;
   function toggleHelp() {
      var h = document.querySelector('#help');
      if (h.style.display == 'none' || h.style.display == '') {
         d3.select('#help').style('display', 'inline');
         d3.select('#charticon').style('display', 'inline');
         d3.select('#chartselector').style('display', 'none');
         if (aip) aip.sendReport('HELP');
      } else {
         d3.select('#help').style('display', 'none');
         d3.select('#charticon').style('display', 'none');
         d3.select('#chartselector').style('display', 'inline');
      }
   }

   charting.toggleCharts = toggleCharts;
   function toggleCharts(hide) {
      var i = document.querySelector('#CHinstructions');
      if (!hide) i.style.display = 'none';

      var m = document.querySelector('#CHmomentum');
      var p = document.querySelector('#CHpts');
      var g = document.querySelector('#CHgametree');
      var r = document.querySelector('#CHrallytree');

      if (hide || !match_data.points().length) {
         g.style.display = 'none';
         r.style.display = 'none';
         m.style.display = 'none';
         p.style.display = 'none';
         i.style.display = 'inline';
      } else if (g.style.display == 'inline') {
         g.style.display = 'none';
         r.style.display = 'none';
         m.style.display = 'inline';
      } else if (m.style.display == 'inline') {
         m.style.display = 'none';
         p.style.display = 'inline';
      } else {
         p.style.display = 'none';
         g.style.display = 'inline';
         r.style.display = 'inline';
      }
   }

   charting.showCharts = showCharts;
   function showCharts() {
      d3.select('#charticon').style('display', 'none');

      pointHistory.style('display', 'inline');
   }

   // var rootURL = 'devel.html';
   var rootURL = '';
   var docs = '<p>If you\'re familiar with the <a target="_blank" href="http://www.tennisabstract.com/blog/2015/12/08/11-reasons-to-contribute-to-the-match-charting-project/"> The Match Charting Project</a>, you can begin charting immediately.  <p>Charts will appear once the first point is entered.  Use the chart icon <img src="/images/bar_chart_inline.png" height="20"> to toggle between charts.  To edit metadata about the match, including player names, click the <img src="/images/meta_inline.png" height="20"> icon.  If you don\'t know the shot-sequence codes, click <img src="/images/help_inline.png" height="20"> to display a cheat sheet.  Click the <img src="/images/dl_inline.png" height="20"> icon to save your work and <img src="/images/reset_inline.png" height="20"> to reset the spreadsheet.  </p> <p>You can find an overview of CourtHive (Version 1) functionality <a target="_blank" href="https://medium.com/@TennisVisuals/courthive-d0caca7c2899">here</a> and read more about why you should consider charting <a target="_blank" href="https://medium.com/the-tennis-notebook/how-to-chart-a-match-cb52ab9f62e5">here</a>.</p> <p>If you would like to see an example, click <a href="' + rootURL + '?mcp=1988_AO_SteffiGraf_ChrisEvert_MCP.csv">here</a> or <a href="' + rootURL + '?mcp=20151122-M-Tour_Finals-F-Roger_Federer-Novak_Djokovic.csv">here</a>. You can also load matches charted using <a href="http://tennis-math.com/" target="_blank">Tennis-Math</a> by following the example of <a href="' + rootURL + '?tennis-math=TTJRd09URXg">this URL</a> or <a href="' + rootURL + '?tennis-math=WmpsbE5UYz0">this URL</a>.'


   this.charting = charting;

}();
