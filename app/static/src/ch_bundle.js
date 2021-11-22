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
// add match start/finish times
// add Indoor/Outdoor

!function() {

   // module container
   var metaEdit = { onChange: undefined };
   metaEdit.visible = false;
   metaEdit.storage = getStorage();

   // Storage Alternative
   function getStorage() {
       var whichStorage;
       try { 
           localStorage.setItem("storage", ""); 
           localStorage.removeItem("storage");
           whichStorage = window.localStorage;
       }
       catch (err) { 
           whichStorage = new LocalStorageAlternative();
       }
       return whichStorage;
   }

   function LocalStorageAlternative() {
       var storage = {};
       this.setItem = function (key, value) { storage[key] = value; }
       this.getItem = function (key) {
           return (typeof storage[key] != 'undefined') ? storage[key] : null;
       }
       this.removeItem = function (key) { storage[key] = undefined; }
   }
   // END Storage Alternative

   var umo; // reference to the UMO in use
   var metaHTML = ' <div class="flex-meta-parent"> <div class="flex-meta-child"> <h2 class="metaHeading" >Players</h2> </div> <div class="flex-meta-child"> <input type="checkbox" id="choosedoubles" name="choosedoubles" value="doubles" onClick="metaEdit.doublesClick(this)">Doubles </div> </div> <div class="flex-meta-parent"> <div id="p1div" class="flex-meta-child"> <input name="playerone" id="playerone" class="MDplayerentry teamone" type="text" spellcheck="false" placeholder="Player One" tabindex="1" onfocus="this.setSelectionRange(0, this.value.length)" autocomplete="off" aria-autocomplete="list"> <select class="MDselection" name="p1hand" id="p1hand" tabindex="2"> <option value="R">R</option> <option value="L">L</option> </select> </div> <div id="p2div" class="flex-meta-child"> <input name="playertwo" id="playertwo" class="MDplayerentry teamtwo" type="text" spellcheck="false" placeholder="Player Two" tabindex="3" onfocus="this.setSelectionRange(0, this.value.length)" autocomplete="off" aria-autocomplete="list"> <select class="MDselection" name="p2hand" id="p2hand" tabindex="4"> <option value="R">R</option> <option value="L">L</option> </select> </div> </div> <div class="flex-meta-parent"> <div id="p3div" class="flex-meta-child"> <input name="player3" id="player3" class="MDplayerentry teamone" type="text" spellcheck="false" placeholder="2nd Player Team One" tabindex="5" onfocus="this.setSelectionRange(0, this.value.length)" autocomplete="off" aria-autocomplete="list"> <select class="MDselection" name="p3hand" id="p3hand" tabindex="6"> <option value="R">R</option> <option value="L">L</option> </select> </div> <div id="p4div" class="flex-meta-child"> <input name="player4" id="player4" class="MDplayerentry teamtwo" type="text" spellcheck="false" placeholder="2nd Player Team Two" tabindex="7" onfocus="this.setSelectionRange(0, this.value.length)" autocomplete="off" aria-autocomplete="list"> <select class="MDselection" name="p4hand" id="p4hand" tabindex="8"> <option value="R">R</option> <option value="L">L</option> </select> </div> </div> <div class="flex-meta-parent"> <div class="flex-meta-child"> <h2 class="metaHeading" >Match</h2> </div> </div> <div class="flex-meta-parent"> <div class="flex-meta-child"> <label name="firstservice_label" id="firstservice_label"> First Service <select class="MDselection" name="firstservice" id="firstservice" tabindex="9"> <option value="0">1</option> <option value="1">2</option> </select> </label> </div> <div class="flex-meta-child"> <label name="advantage_label" id="advantage_label"> Advantages <select class="MDwideselection" name="advantages" id="advantages" tabindex="10"> <option value="true">Normal</option> <option value="false">No Advantage</option> </select> </label> </div> <div class="flex-meta-child"> <label name="lets_label" id="lets_label"> Lets <select class="MDwideselection" name="lets" id="lets" tabindex="11"> <option value="true">Normal</option> <option value="false">No Lets</option> </select> </label> </div> </div> <div class="flex-meta-parent"> <div class="flex-meta-child"> <label name="bestof_label" id="bestof_label"> Best of <select name="bestof" id="bestof" class="MDselection" tabindex="12"> <option value="1">1</option> <option value="3" selected="selected">3</option> <option value="5">5</option> </select> </label> </div> <div class="flex-meta-child"> <label name="setsto_label" id="setsto_label"> Sets to <select name="setsto" id="setsto" class="MDselection" tabindex="13"> <option value="8">4</option> <option value="12" selected="selected">6</option> <option value="14">7</option> <option value="16">8</option> <option value="18">9</option> <option value="20">10</option> </select> </label> </div> <div class="flex-meta-child"> <label name="tiebreakat" id="tiebreakat_label"> Tie-break at <select name="tiebreakat" id="tiebreakat" class="MDselection" tabindex="24"> <option value="5">5</option> <option value="6" selected="selected">6</option> <option value="false">-</option> </select> </label> </div> <div class="flex-meta-child"> <label name="tiebreakto_label" id="tiebreakto_label"> Tie-break to <select name="tiebreakto" id="tiebreakto" class="MDselection" tabindex="14"> <option value="7" selected="selected">7</option><option value="12">12</option> <option value="false">-</option> </select> </label> </div> <div class="flex-meta-child"> <label name="finalset_label" id="finalset_label"> Final Set <select name="finalset" id="finalset" class="MDwideselection" tabindex="15"> <option value="normal" selected="selected">Normal</option> <option value="supertiebreak">Super Tie-break</option> <option value="longset">Long Set</option> </select> </label> </div> </div> <div class="flex-meta-parent"> <div class="flex-meta-child"> <label name="round_label" id="round_label"> Round <select class="MDround" name="round" id="round" tabindex="17"> <option value="">-</option> <option value="F">F</option> <option value="SF">SF</option> <option value="QF">QF</option> <option value="R16">R16</option> <option value="R32">R32</option> <option value="R64">R64</option> <option value="R128">R128</option> <option value="Q1">Q1</option> <option value="Q2">Q2</option> </select> </label> </div> <div class="flex-meta-child"> <label name="surface_label" id="surface_label"> Surface <select class="MDround" name="surface" id="surface" tabindex="18"> <option value="">-</option> <option value="H">Hard</option> <option value="C">Clay</option> <option value="G">Grass</option> <option value="T">HarTru</option> </select> </label> </div> <div class="flex-meta-child"> <label name="category_label" id="category_label"> Gender <select name="category" id="category" class="MDselection" tabindex="19"> <option value="">-</option> <option value="M">M</option> <option value="W">W</option> </select> </label> </div> </div> <div class="flex-meta-parent"> <div class="flex-meta-child"> <label id="court_label" name="court_label"> Court <input autocomplete="off" name="court" class="MDcourt" type="text" value="" id="court" placeholder="Court" tabindex="20"> </label> </div> <div class="flex-meta-child"> <label id="umpire_label" name="umpire_label"> Umpire <input autocomplete="off" name="umpire" class="MDumpire" type="text" value="" id="umpire" placeholder="Umpire" tabindex="21"> </label> </div> </div> <div class="flex-meta-parent"> <div class="flex-meta-child"> <label id="date_label"> Date <input autocomplete="off" name="matchdate" class="MDvaliddate" type="text" value="" id="matchdate" placeholder="YYYY-MM-DD" tabindex="22"> </label> </div> <div class="flex-meta-child"> <label id="chartedby_label"> Charted by <input autocomplete="off" name="charter" class="MDcharter" type="text" value="" id="charter" placeholder="" tabindex="23"> </label> </div> </div> <div class="flex-meta-parent"> <div class="flex-meta-child"> <h2 class="metaHeading" >Tournament</h2> </div> </div> <div class="flex-meta-parent"> <div class="flex-meta-child"> <input autocomplete="off" name="tournament" class="MDtournament" type="text" value="" id="tournament" placeholder="Tournament Name" tabindex="16"> </div> </div> <p> <div class="flex-meta-parent flex-center"> <div class="flex-meta-child"> <button id="metaSubmit" class="btn meta-btn meta-submit" alt="Submit Metadata" onclick="metaEdit.submitMeta()" tabindex="-1">Submit</button> <button id="metaCancel" class="btn meta-btn meta-cancel" alt="Cancel Metadata" onclick="metaEdit.cancelMeta()" tabindex="-1">Cancel</button> </div> </div> ';

   var meta = d3.select('body').append('div').attr('id', 'meta').style('display', 'none');
   document.getElementById('meta').innerHTML = metaHTML;

   var playerone = document.getElementById('playerone');
   var playertwo = document.getElementById('playertwo');
   var player3 = document.getElementById('player3');
   var player4 = document.getElementById('player4');
   var tournament = document.getElementById('tournament');
   var court = document.getElementById('court');
   var umpire = document.getElementById('umpire');
   var matchdate = document.getElementById('matchdate');
   var charter = document.getElementById('charter');
   var p1hand = document.getElementById('p1hand');
   var p2hand = document.getElementById('p2hand');
   var p3hand = document.getElementById('p3hand');
   var p4hand = document.getElementById('p4hand');
   var category = document.getElementById('category');
   var round = document.getElementById('round');
   var surface = document.getElementById('surface');
   var bestof = document.getElementById('bestof');
   var finalset = document.getElementById('finalset');
   var firstservice = document.getElementById('firstservice');
   var setsto = document.getElementById('setsto');
   var tiebreakat = document.getElementById('tiebreakat');
   var tiebreakto = document.getElementById('tiebreakto');
   var advantages = document.getElementById('advantages');
   var lets = document.getElementById('lets');

   function catchTab(event) { if (event.which == 9) { event.preventDefault(); } }

   metaEdit.disable = function(tf) {
      tf = tf == undefined ? false : true;
      playerone.disabled = tf;
      playertwo.disabled = tf;
      player3.disabled = tf;
      player4.disabled = tf;
      tournament.disabled = tf;
      court.disabled = tf;
      umpire.disabled = tf;
      matchdate.disabled = tf;
      charter.disabled = tf;
      p1hand.disabled = tf;
      p2hand.disabled = tf;
      p3hand.disabled = tf;
      p4hand.disabled = tf;
      category.disabled = tf;
      round.disabled = tf;
      surface.disabled = tf;
      bestof.disabled = tf;
      finalset.disabled = tf;
      firstservice.disabled = tf;
      setsto.disabled = tf;
      tiebreakat.disabled = tf;
      tiebreakto.disabled = tf;
      advantages.disabled = tf;
      lets.disabled = tf;
   }

   metaEdit.doublesClick = function(checkbox) {
      if (checkbox.checked) {
         d3.select('#p3div').style('display', 'inline')
         d3.select('#p4div').style('display', 'inline')
      } else {
         d3.select('#p3div').style('display', 'none')
         d3.select('#p4div').style('display', 'none')
      }
   }

   metaEdit.submitMeta = function() {
      updateUMOmeta();
      metaEdit.hide();
      if (metaEdit.onChange) metaEdit.onChange();
   }

   metaEdit.cancelMeta = function() {
      metaEdit.update();
      metaEdit.hide();
   }

   // update the metadata panel from the contents of the UMO
   metaEdit.update = function() {
      if (!umo) return;
      var metadata = umo.metadata();
      var ss = metaEdit.storage;
      playerone.value      = ss.MEplayerone   = metadata.players[0].name || 'Player One';
      playertwo.value      = ss.MEplayertwo   = metadata.players[1].name || 'Player Two';
      player3.value        = ss.MEplayer3     = metadata.players[2].name || '';
      player4.value        = ss.MEplayer4     = metadata.players[3].name || '';
      tournament.value     = ss.MEtournament  = metadata.tournament.name || '';
      p1hand.value         = ss.MEp1hand      = metadata.players[0].fh || 'R';
      p2hand.value         = ss.MEp2hand      = metadata.players[1].fh || 'R';
      category.value       = ss.MEcategory    = metadata.match.category || '';
      round.value          = ss.MEround       = metadata.tournament.round || '';
      matchdate.value      = ss.MEmatchdate   = metadata.match.date || '';
      court.value          = ss.MEcourt       = metadata.match.court || '';
      surface.value        = ss.MEsurface     = metadata.tournament.surface ? metadata.tournament.surface.slice(0,1) : '';
      umpire.value         = ss.MEumpire      = metadata.match.umpire || '';
      charter.value        = ss.MEcharter     = metadata.charter || '';
      bestof.value         = ss.MEbestof      = umo.options().match.sets || '3';
      firstservice.value   = ss.MEfirstservice = umo.options().match.first_service || 0;
      setsto.value         = ss.MEsetsto      = umo.options().set.games || 12;

      configureTiebreakAt(setsto.value / 2);
      if (umo.options().set.tiebreak_at) {
         tiebreakat.value  = ss.MEtiebreakat  = umo.options().set.tiebreak_at || 6;
      } else {
         tiebreakat.value  = ss.MEtiebreakat  = 'false';
      }

      if (umo.options().set.tiebreak) {
         tiebreakto.value  = ss.MEtiebreakto  = umo.options().set.tiebreak_to || 7;
      } else {
         tiebreakto.value  = ss.MEtiebreakto  = 'false';
      }
      if (umo.options().set.advantage) {
         advantages.value  = ss.MEadvantages  = 'true';
      } else {
         advantages.value  = ss.MEadvantages  = 'false';
      }
      if (umo.options().set.lets) {
         lets.value  = ss.MElets  = 'true';
      } else {
         lets.value  = ss.MElets  = 'false';
      }
      if (umo.options().match.final_set_tiebreak_only) {
         finalset.value    = ss.MEfinalset    = 'supertiebreak';
      } else {
         if (umo.options().match.final_set_tiebreak) {
            finalset.value    = ss.MEfinalset    = 'normal';
         } else {
            finalset.value    = ss.MEfinalset    = 'longset';
         }
      }
   }

   metaEdit.colors = function(pcolors) {
      d3.select('#playerone').style('border', '2px solid' + pcolors[0]);
      d3.select('#playertwo').style('border', '2px solid' + pcolors[1]);
      d3.select('#player3').style('border', '2px solid' + pcolors[0]);
      d3.select('#player4').style('border', '2px solid' + pcolors[1]);
   }

   metaEdit.show = function() {
      // if there are more than two players, show entry fields
      if (player3.value || player4.value) {
         var d = document.getElementById('choosedoubles')
         d.checked = true;
         metaEdit.doublesClick(d);
      }
      meta.style('display', 'inline');
      metaEdit.visible = true;
      playerone.focus();
   }

   metaEdit.hide = function() {
      meta.style('display', 'none');
      metaEdit.visible = false;
   }

   metaEdit.umo = function(matchObject) {
      if (!arguments.length) { return umo; }
      if (typeof matchObject != 'function' || matchObject.type != 'UMO') return false;
      umo = matchObject;
      return metaEdit;
   }

   metaEdit.init = function() {

      var ajax = new XMLHttpRequest();
      // ajax.open("GET", "/api/players/", true);
      ajax.open("GET", "/api/pldb/", true);
      ajax.onload = function() {
         // var playerlist = eval(ajax.responseText);
         var playerlist = eval(ajax.responseText).map(function(m) { return { value: m[0], label: m[0] + ' <b>[' + m[1] + ']</b>' }});
         new Awesomplete(playerone, { list: playerlist });
         new Awesomplete(playertwo, { list: playerlist });
         new Awesomplete(player3, { list: playerlist });
         new Awesomplete(player4, { list: playerlist });
      };
      ajax.send();

      function p1enter() {
         var element = document.querySelector('#p1div li');
         if (element) playerone.value = element.textContent;
         p1Submit();
      }
      function p1Submit() { playertwo.focus(); }

      function p2enter() {
         var element = document.querySelector('#p2div li');
         if (element) playertwo.value = element.textContent;
         p2Submit();
      }
      function p2Submit() {
         if (d3.select('#p3div').style('display') != 'none') {
            player3.focus();
         } else {
            tournament.focus(); 
         }
      }

      function p3enter() {
         var element = document.querySelector('#p3div li');
         if (element) player3.value = element.textContent;
         p3Submit();
      }
      function p3Submit() { player4.focus(); }

      function p4enter() {
         var element = document.querySelector('#p4div li');
         if (element) player4.value = element.textContent;
         p2Submit();
      }
      function p4Submit() { tournament.focus(); }

      playerone.addEventListener('keydown', catchTab , false);
      playerone.addEventListener("keyup", function(event) {
         if (event.which == 13 || event.which == 9) { p1enter(); }
      });
      playerone.addEventListener("awesomplete-selectcomplete", function(e){ p1Submit(); }, false);

      playertwo.addEventListener('keydown', catchTab , false);
      playertwo.addEventListener("keyup", function(event) {
         if (event.which == 13 || event.which == 9) { p2enter(); }
      });
      playertwo.addEventListener("awesomplete-selectcomplete", function(e){ p2Submit(); }, false);

      player3.addEventListener('keydown', catchTab , false);
      player3.addEventListener("keyup", function(event) {
         if (event.which == 13 || event.which == 9) { p3enter(); }
      });
      player3.addEventListener("awesomplete-selectcomplete", function(e){ p3Submit(); }, false);

      player4.addEventListener('keydown', catchTab , false);
      player4.addEventListener("keyup", function(event) {
         if (event.which == 13 || event.which == 9) { p4enter(); }
      });
      player4.addEventListener("awesomplete-selectcomplete", function(e){ p4Submit(); }, false);

      matchdate.addEventListener("keyup", function() { 
         var validity = validateDate(matchdate.value);
         matchdate.className = validity;
      });

      setsto.addEventListener("change", function() { configureTiebreakAt(setsto.value / 2); });

      if (umo.points().length) {
         metaEdit.update();
      } else {
         setUMOmeta();
         updateUMOmeta();
      }
   }

   function configureTiebreakAt(sets_to) {
      tiebreakat.getElementsByTagName('option')[0].text = sets_to - 1;
      tiebreakat.getElementsByTagName('option')[0].value = sets_to - 1;
      tiebreakat.getElementsByTagName('option')[1].text = sets_to;
      tiebreakat.getElementsByTagName('option')[1].value = sets_to;
      tiebreakat.value = sets_to;
   }

   function validateDate(datestring) {
      if (!datestring) return 'MDvaliddate';
      if ( isNaN(datestring.split('-').join('')) ) {
         return 'MDinvaliddate';
      }
      if ( datestring.split('-').length != 3 || datestring.length != 10) {
         return 'MDincompletedate';
      }
      return 'MDvaliddate';
   }

   function setUMOmeta() {
      var ss = metaEdit.storage;
      playerone.value      = ss.MEplayerone || 'Player One';
      playertwo.value      = ss.MEplayertwo || 'Player Two';
      player3.value        = ss.MEplayer3 || '';
      player4.value        = ss.MEplayer4 || '';
      tournament.value     = ss.MEtournament || '';
      p1hand.value         = ss.MEp1hand || '';
      p2hand.value         = ss.MEp2hand || '';
      category.value       = ss.MEcategory || '';
      round.value          = ss.MEround || '';
      matchdate.value      = ss.MEmatchdate || '';
      court.value          = ss.MEcourt || '';
      surface.value        = ss.MEsurface || '';
      umpire.value         = ss.MEumpire || '';
      charter.value        = ss.MEcharter || '';
      bestof.value         = ss.MEbestof || '';
      finalset.value       = ss.MEfinalset || 'normal';
      firstservice.value   = ss.MEfirstservice || 0;
      setsto.value         = ss.MEsetsto || 12;

      configureTiebreakAt(setsto.value / 2);
      tiebreakat.value     = ss.MEtiebreakat || 6;

      tiebreakto.value     = ss.MEtiebreakto || 7;
      advantages.value     = ss.MEadvantages || 'true';
      lets.value           = ss.MElets || 'true';
   }

   function resetMeta() {
      var ss = metaEdit.storage;
      ss.MEplayerone = 'Player One';
      ss.MEplayertwo = 'Player Two';
      ss.MEplayer3 = '';
      ss.MEplayer4 = '';
      ss.MEtournament = '';
      ss.MEp1hand = '';
      ss.MEp2hand = '';
      ss.MEcategory = '';
      ss.MEround = '';
      ss.MEmatchdate = '';
      ss.MEcourt = '';
      ss.MEsurface = '';
      ss.MEumpire = '';
      ss.MEcharter = '';
      ss.MEbestof = '';
      ss.MEfinalset = 'normal';
      ss.MEfirstservice = 0;
      ss.MEsetsto = 12;
      ss.MEtiebreakat = 6;
      ss.MEtiebreakto = 7;
      ss.MEadvantages = 'true';
      ss.MElets = 'true';
   }

   function updateUMOmeta() {
      if (!umo) return;

      var dateValidity = validateDate(matchdate.value);

      umo.options({ 
         match: {
             first_service: +firstservice.value,
             sets: +bestof.value,
             final_set_tiebreak: (finalset.value == 'normal' || finalset.value == 'supertiebreak') ? true : false,
             final_set_tiebreak_to: finalset.value == 'supertiebreak' ? 10 : 7,
             final_set_tiebreak_only: finalset.value == 'supertiebreak' ? true : false
         },
         set: { 
            games: +setsto.value || 12,
            tiebreak: tiebreakto.value == 'false' ? false : true,
            tiebreak_at: tiebreakat.value == 'false' ? false : +tiebreakat.value,
            tiebreak_to: tiebreakto.value == 'false' ? 7 : +tiebreakto.value,
            advantage: advantages.value == 'false' ? false : true,
            lets: lets.value == 'false' ? false : true,
         } 
      });

      umo.metadata({
         players: { 
            0: { name: playerone.value, fname: '', lname: '', fh: p1hand.value },
            1: { name: playertwo.value, fname: '', lname: '', fh: p2hand.value },
            2: { name: player3.value, fname: '', lname: '', fh: p1hand.value },
            3: { name: player4.value, fname: '', lname: '', fh: p2hand.value }
         },
         tournament: {
            name: tournament.value,
            surface: surface.value,
            round: round.value, 
         },
         match: {
            date: dateValidity == 'MDvaliddate' ? matchdate.value : '',
            court: court.value,
            category: category.value,
            umpire: umpire.value
         },
         charter: charter.value
      });

      umo.update();
   }

   this.metaEdit = metaEdit;

}();
!function() {

   // requires CSS styles "valid", "invalid", "incomplete"

   // module container
   var mcps = {};
   mcps.storage = getStorage();

   var umo;
   var rows = 600;
   var data;
   var INPUTS;

   var colrally = 'H';
   var col1st   = 'I';
   var col2nd   = 'J';
   var colnotes = 'K';

   // clients can register callbacks for notification when data updates
   var callbacks = [];
   var events = {
      'pointDescription': null,
      'finishedLoad': null
   };

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

   // Storage Alternative
   function getStorage() {
       var whichStorage;
       try { 
           localStorage.setItem("storage", ""); 
           localStorage.removeItem("storage");
           whichStorage = window.localStorage;
       }
       catch (err) { 
           whichStorage = new LocalStorageAlternative();
       }
       return whichStorage;
   }

   function LocalStorageAlternative() {
       var storage = {};
       this.setItem = function (key, value) { storage[key] = value; }
       this.getItem = function (key) {
           return (typeof storage[key] != 'undefined') ? storage[key] : null;
       }
       this.removeItem = function (key) { storage[key] = undefined; }
   }
   // END Storage Alternative

   mcps.events = function(functions) {
      if (!arguments.length) return events;
      keyWalk(functions, events);
      return mcps;
   }

   mcps.init = function() {
      var headings = ['pt #', 'S1', 'S2', 'G1', 'G2', 'Pts', 'G#', 'Srv', 'R', '1st', '2nd', 'Notes'];
      var row = document.querySelector("#mcpHeader").insertRow(-1);
      for (var j=0; j<12; j++) {
         var cell = row.insertCell(-1);
         var cellClass = "cell" + j;
         if (j == 11) cellClass += " notes";
         cell.innerHTML = headings[j];
         cell.className = cellClass;
      }

      for (var i=0; i<rows; i++) {
          var row = document.querySelector("#mcpPoints").insertRow(-1);
          for (var j=0; j<12; j++) {
              var spellCheck = '';
              var letter = j > 0 ? String.fromCharCode("A".charCodeAt(0)+j-1) : '';
              var cellType = (j < 9) ? 'span' : 'input';
              var tabIndex = " tabIndex = -1";
              var cellClass = "cell cell" + j;
              var focus = (j == 10) ? " onfocus='this.setSelectionRange(0, this.value.length)'" : "";
              if (j < 9) cellClass += " mcpInfo";
              if (j == 9 || j == 10) {
                 cellClass += " font14 service cache";
                 spellCheck = " spellcheck='false'";
              }
              if (j == 11) cellClass += " notes cache";
              row.insertCell(-1).innerHTML = i&&j ? "<" + cellType + tabIndex + spellCheck + focus + " class='" + cellClass + "' id='"+ letter+i +"'/>" : i||'';
          }
      }

      clearRow();

      data = {};
      INPUTS = [].slice.call(document.querySelectorAll(".cache"));
      INPUTS.forEach(function(elm) {
          elm.onfocus = function(e) {
              if (elm.classList.contains('notes')) {
                  e.target.value = mcps.storage[e.target.id] || "";
                  d3.select('#statPanel').style('display', 'none');
                  mcps.sizeNotes(350); 
              }
              if (elm.classList.contains('service')) {
                  e.target.value = stripNonMCP(mcps.storage[e.target.id]);
              }
          };
          elm.onblur = function(e) {
             var cell_is_note = elm.classList.contains('notes');
             if (cell_is_note) {
                mcps.storage[e.target.id] = e.target.value;
                d3.select('#statPanel').style('display', 'inline');
                mcps.sizeNotes(40); 
             } else  {
                var MCP_value_changed = e.target.value != stripNonMCP(mcps.storage[e.target.id]);
                if (MCP_value_changed) {
                   // of course this WON'T work when coordinates are involved...
                   // need to think about how to integrate oints into shot codes..
                   mcps.storage[e.target.id] = e.target.value;
                   computeAll();
                }
             }
          };
          var getter = function() { return stripNonMCP(mcps.storage[elm.id]); };
          Object.defineProperty(data, elm.id, { get:getter });
          Object.defineProperty(data, elm.id.toLowerCase(), { get:getter });
      });

      (window.computeAll = function() {
          INPUTS.forEach(function(elm) { 
             try { 
                if (data[elm.id]) elm.value = data[elm.id]; 
                if (elm.classList.contains('service')) {
                   var validity = sequences.validator(elm.value);
                   var state = validity.valid ? 'cellvalid' : 'cellinvalid';
                   if (state == 'cellvalid' && !validity.complete) state = 'cellincomplete';
                   if (!elm.classList.contains(state)) { cellState(elm, state); }
                }
             } 
             
             catch(e) {} 
          });
      })();

      var entryfields = document.querySelectorAll(".service");
      for (var i = 0; i < entryfields.length; i++) {
         entryfields[i].addEventListener('keydown', catchTab , false);
         entryfields[i].addEventListener('keyup', validateCell , false);
      }

      var notefields = document.querySelectorAll(".notes");
      for (var i = 0; i < notefields.length; i++) {
         notefields[i].addEventListener('keydown', catchTab , false);
         notefields[i].addEventListener('keyup', leaveNotes, false);
      }

   }

   mcps.reset = function() {
      umo.reset();

      clearInfoFields();
      clearRow();
      clearCacheStorage();

      // probably also need to clear metadata
      mcps.update();

      if (events.pointDescription) events.pointDescription('');

      history.pushState({ foo: "" }, "", "?"); // clears the URL location
   }

   // if an empty UMO is passed, update it with spreadsheet values
   mcps.umo = function(matchObject, populate) {
      if (!arguments.length) { return umo; }
      if (typeof matchObject != 'function' || matchObject.type != 'UMO') return false;
      umo = matchObject;

      if (populate == false) { return mcps; }

      if (!umo.points().length) {
         var first_row_focus = true;
         mcps.populateUMO(first_row_focus);
         if (umo.points().length && events.finishedLoad) {
            events.finishedLoad();
         }
      } else {
         // UMO has existing values, so populate spreadsheet
         mcps.populateSS();
      }
      return mcps;
   }

   mcps.update = function() {
      if (!callbacks.length) return;
      callbacks.forEach(function(c) {
         if (typeof c == 'function') c();
      });
   }

   mcps.callback = function(callback) {
      if (!arguments.length) return callbacks;
      if (typeof callback == 'function') {
         callbacks.push(callback);
      } else if (typeof callback == 'array') {
         callback.foreach(c) (function(c) {
            if (typeof c == 'function') callbacks.push(c);
         });
      }
   }

   // empty stored values and populate with UMO points
   mcps.populateSS = function() {
      clearInfoFields();
      clearRow();
      clearCacheStorage();
      umo.points().forEach(function(p, i) {

         if (p.code) {
            var serves = p.code.split('|');

            var first_serve = col1st + (+i + 1);
            mcps.storage[first_serve] = serves[0];
            var this_cell = document.querySelector("#" + first_serve);
            this_cell.value = stripNonMCP(serves[0]);

            if (serves[1]) {
               var second_serve = col2nd + (+i + 1);
               if (serves[1]) mcps.storage[second_serve] = serves[1];
               var this_cell = document.querySelector("#" + second_serve);
               this_cell.value = stripNonMCP(serves[1]);
            }

            // inside if (p.code) so notes aren't stored if there is not coded point
            if (p.note) {
               var thisnote = colnotes + (+i + 1);
               mcps.storage[thisnote] = p.note;
               var this_cell = document.querySelector("#" + thisnote);
               this_cell.value = p.note;
            }
         }
      });

      mcps.populateUMO();
   }

   // add spreadsheet values into UMO as points
   // and update InfoFields with results;
   mcps.populateUMO = function(initial) {
      if (umo.nextService() == undefined) return;
      umo.points([]);

      // needs to be replaced with umo.teams()
      // ALSO, the server initials need to be generated considering doubles teams
      var players = umo.players();
      for (var r=1; r < rows; r++) {
         var next_server = umo.nextService();
         var server_initials = players[next_server].split(' ').map(function(m) { return m[0]; }).join('');
         setText('G' + r, server_initials);
         if (mcps.colors) { setColor('G' + r, mcps.colors[next_server]); }

         var service_1st = getText(col1st + r);
         var service_2nd = getText(col2nd + r);

         var point_note = getText(colnotes + r);
         scaleText(col1st + r, service_1st);
         scaleText(col2nd + r, service_2nd);

         // retrieve the full sequence including parentheticals
         var full_service_1st = mcps.storage[col1st + r];
         var full_service_2nd = mcps.storage[col2nd + r];

         // speed improvement by exiting loop when encounter empty cells
         if (full_service_1st == '' && full_service_2nd == '') { break; }

         var p = sequences.pointParser([full_service_1st, full_service_2nd]);
         if (!p.result) { break; }
         if (point_note.length) { p.note = point_note; }

         // COORDINATES FROM STORAGE NEED TO BE RE-INJECTED HERE
         
         var result = umo.push(p);
         if (!result.result) { break; }

         var point_score = next_server ? result.point.score.split('-').reverse().join('-') : result.point.score;
         setText('E' + (r + 1), point_score.indexOf('G') >= 0 ? '0-0' : point_score);
         var scoreboard = umo.score();
         var setscores = scoreboard.score;
         setText('A' + (r + 1), setscores[0]);
         setText('B' + (r + 1), setscores[1]);
         var setnum = umo.score().match_score.split(',').length;
         var gamescores = umo.sets()[setnum - 1].score().games;
         setText('C' + (r + 1), gamescores[0]);
         setText('D' + (r + 1), gamescores[1]);
         var gamenumber = umo.sets().map(function(s) { return s.games().length }).reduce(function(a, b) { return a + b; });
         gamenumber = point_score.indexOf('G') >= 0 ? gamenumber +1 : gamenumber;
         setText('F' + (r + 1), gamenumber);
         setText(colrally + (r), result.point.rallyLength());
      }
      // why is this here?  It seems to clear just after fiedls have been populated !!
      // clearInfoFields(r);

      if (initial) {
         var element = document.getElementById(col1st + 1);
         element.focus();
      }

      // invoke all callbacks
      mcps.update();
   }

   mcps.scrollTo = function(point) {
      var index = umo.pointIndex(point.set, point.game, point.score);
      var element = document.getElementById(col1st + (+index + 1));
      element.focus();
   }

   function clearCacheStorage() {
      var cells = document.getElementsByClassName("cache");
      var cellKeys = Object.keys(cells);
      try { cellKeys.forEach(function(e) { if (!isNaN(e)) mcps.storage[cells[e].id] = ""; }); }
      catch(e) {}

      INPUTS.forEach(function(elm) { 
         // firefox throws security error if cookies disabled
         try { 
            elm.value = data[elm.id]; 
            cellState(elm, '');
         } 
         
         catch(e) {
            elm.value = ''; 
            cellState(elm, '');
         } 
      });
   }

   // generated data on left of spreadsheet
   function clearInfoFields(start) {
      start = start || 0;
      var infofields = document.querySelectorAll(".mcpInfo");
      for (var i = 0; i < infofields.length; i++) {
         var row = infofields[i].id.match(/\d/g).join('');
         if (row > start) { infofields[i].innerHTML = ''; }
      }
   }

   function stripNonMCP(value) { 
      if (typeof sequences.stripNonMCP == 'function') {
         return sequences.stripNonMCP(value);
      } else {
         return value;
      }
   }

   function validateCell(event, that) {
      that = that || this;

      scaleText(null, that.value, that);

      var celltext = stripNonMCP(that.value);
      var validity = sequences.validator(celltext);
      var state = validity.valid ? 'cellvalid' : 'cellinvalid';
      var next_cell;

      if (event.which == 9 && event.shiftKey) {
         next_cell = previousCell(that);
      } else if (event.which == 37) { // left
      } else if (event.which == 38) { // up
         next_cell = moveV(that, true);
      } else if (event.which == 39) { // right
      } else if (event.which == 40) { // down
         next_cell = moveV(that);
      } else if (event.which == 13 || event.which == 9) {
         if (validity.valid && validity.complete) {
            next_cell = nextCell(that, validity.fault);
            mcps.populateUMO();
         } else if (validity.valid && !validity.complete) {
            cellState(that, 'cellincomplete');
         }
         if (validity.message && events.pointDescription) events.pointDescription(validity.message);
      }

      // if next_cell and next_cell is empty, display describeOutcome
      // otherwise, if next_cell is "service" and not empty, display description of its contents

         var p = sequences.pointParser([celltext]);

         var row = that.id.match(/\d+/g).join('');
         if (typeof p.rallyLength == 'function') setText(colrally + row, p.rallyLength());

         var desc = sequences.describePoint(p);
         if (desc && events.pointDescription) { events.pointDescription(desc.join('; ')); }

         if (!that.classList.contains(state)) { cellState(that, state); }
      
      if (celltext == '' && events.pointDescription) events.pointDescription('');
   }

   function cellState(cell, state) {
      cell.classList.remove('cellincomplete');
      cell.classList.remove('cellvalid');
      cell.classList.remove('cellinvalid');
      cell.classList.remove('cellempty');
      if (state) cell.classList.add(state);
   }

   function catchTab(event) { if (event.which == 9) { event.preventDefault(); } }

   function leaveNotes(event) {
      if (event.which == 9 && event.shiftKey) {
         previousCell(this);
      } else if (event.which == 9 || event.which == 13) {
         nextRow(this);
      }
   }

   /*
   // unused thusfar ...
   function moveH(cell, a, b, c) {
      var col = cell.id.match(/[A-Za-z]/g).join('');
      var row = cell.id.match(/\d/g).join('');
      var next_col = col == a ? b : c;
      var next_cell = document.querySelector("#" + next_col + row);
      next_cell.focus();
      return next_cell;
   }
   */

   function moveV(cell, up) {
      var col = cell.id.match(/[A-Za-z]/g).join('');
      var row = cell.id.match(/\d/g).join('');
      var next_row = up && row > 1 ? +row - 1 : !up && row < (rows - 1) ? +row + 1 : row;
      var next_cell = document.querySelector("#" + col + next_row);
      next_cell.focus();
      return next_cell;
   }

   function nextCell(cell, fault) {
      var col = cell.id.match(/[A-Za-z]/g).join('');
      var row = cell.id.match(/\d/g).join('');
      var next_row = col == col2nd || !fault ? +row + 1 : row;
      var next_col = col == col1st && fault ? col2nd : col1st;
      var next_cell = document.querySelector("#" + next_col + next_row);
      next_cell.focus();
      return next_cell;
   }

   function nextRow(cell, fault) {
      var row = cell.id.match(/\d/g).join('');
      var next_row = row < (rows - 1) ? +row + 1 : row;
      var next_col = col1st;
      var next_cell = document.querySelector("#" + next_col + next_row);
      next_cell.focus();
      return next_cell;
   }

   function previousCell(cell, fault) {
      var col = cell.id.match(/[A-Za-z]/g).join('');
      var row = cell.id.match(/\d/g).join('');
      var next_row = col == col1st ? +row - 1 : row;
      var next_col = col == col2nd ? col1st : col1st;
      var next_cell = document.querySelector("#" + next_col + next_row);
      next_cell.focus();
      return next_cell;
   }

   function setText(id, text) {
      var element = document.getElementById(id);
      element.innerHTML = text;
   }

   function setColor(id, color) {
      var element = document.getElementById(id);
      element.style.color = color;
   }

   function getText(id) {
      var element = document.getElementById(id);
      return element.value;
   }

   function scaleText(id, text, element) {
      element = element || document.getElementById(id);
      var fontclass = element.className.split(' ').filter(function(f) { return f.indexOf('font') >= 0; }).join(' ');
      var fontsize = +fontclass.split('font')[1];
      var textWidth = getWidthOfText(text, element.className);

      if (textWidth > 255 && fontsize > 9) {
         element.classList.remove(fontclass);
         element.classList.add('font' + (fontsize - 1));
      } else if (textWidth < 230 && fontsize < 14) {
         element.classList.remove(fontclass);
         element.classList.add('font' + (fontsize + 1));
      }
   }

   function getWidthOfText(text, className){
      var e = document.querySelector('#textWidth');
      var classes = className.split(' ').filter(function(f) { return f.indexOf('cell') < 0 }).join(' ');
      e.className = classes;
      e.innerHTML = text;
      return e.clientWidth;
   }

   // clears specified row; default is to reset first row
   function clearRow(row) {
      row = row || 1;
      setText('A' + row, row == 1 ? '0' : '');
      setText('B' + row, row == 1 ? '0' : '');
      setText('C' + row, row == 1 ? '0' : '');
      setText('D' + row, row == 1 ? '0' : '');
      setText('E' + row, row == 1 ? '0-0' : '');
      setText('F' + row, row == 1 ? '1' : '');
      if (row == 1) {
         var element = document.getElementById(col1st + '1');
         element.focus();
      }
   }

   mcps.sizeNotes = sizeNotes;
   function sizeNotes(size) {
      var notes = document.querySelectorAll('.notes');
      for (var i = 0; i < notes.length; i++) {
         notes[i].style.width = size + 'px'; 
      }
   }

   this.mcps = mcps;

}();
var help = '<table id="helpTable"> <tr> <td class="helpCol" valign="top"> <b>Serves</b> <table class="mcpKeys"> <tr><td>4</td><td>&nbsp;&nbsp;</td><td>Wide</td><td></td><td></td></tr> <tr><td>5</td><td>&nbsp;&nbsp;</td><td>Body</td><td></td><td></td></tr> <tr><td>6</td><td>&nbsp;&nbsp;</td><td>T</td><td></td><td></td></tr> <tr><td>0</td><td>&nbsp;&nbsp;</td><td>Unknown</td><td></td><td></td></tr> <tr><td></td><td>&nbsp;&nbsp;</td><td></td><td></td><td></td></tr> </table> <b>Shot Direction</b> <table class="mcpKeys"> <tr><td>1</td><td>&nbsp;&nbsp;</td><td>Left</td><td></td><td></td></tr> <tr><td>2</td><td>&nbsp;&nbsp;</td><td>Center</td><td></td><td></td></tr> <tr><td>3</td><td>&nbsp;&nbsp;</td><td>Right</td><td></td><td></td></tr> <tr><td></td><td>&nbsp;&nbsp;</td><td></td><td></td><td></td></tr> </table> </td> <td class="helpCol" valign="top"> <b>Rally Shots</b> <table class="mcpKeys"> <tr><td>f</td><td>&nbsp;&nbsp;</td><td><center>Hand         </center></td><td>&nbsp;&nbsp;</td><td>b</td></tr> <tr><td>r</td><td>&nbsp;&nbsp;</td><td><center>Slice        </center></td><td>&nbsp;&nbsp;</td><td>s</td></tr> <tr><td>l</td><td>&nbsp;&nbsp;</td><td><center>Lob          </center></td><td>&nbsp;&nbsp;</td><td>m</td></tr> <tr><td>v</td><td>&nbsp;&nbsp;</td><td><center>Volley       </center></td><td>&nbsp;&nbsp;</td><td>z</td></tr> <tr><td>o</td><td>&nbsp;&nbsp;</td><td><center>Smash        </center></td><td>&nbsp;&nbsp;</td><td>p</td></tr> <tr><td>u</td><td>&nbsp;&nbsp;</td><td><center>Drop Shot    </center></td><td>&nbsp;&nbsp;</td><td>y</td></tr> <tr><td>h</td><td>&nbsp;&nbsp;</td><td><center>Half Volley  </center></td><td>&nbsp;&nbsp;</td><td>i</td></tr> <tr><td>j</td><td>&nbsp;&nbsp;</td><td><center>Drive Volley </center></td><td>&nbsp;&nbsp;</td><td>k</td></tr> <tr><td>t</td><td>&nbsp;&nbsp;</td><td><center>Trick Shot   </center></td><td>&nbsp;&nbsp;</td><td>t</td></tr> <tr><td>q</td><td>&nbsp;&nbsp;</td><td><center>Unknown      </center></td><td>&nbsp;&nbsp;</td><td>q</td></tr> </table> </td> <td class="helpCol" valign="top"> <b>Errors</b> <table class="mcpKeys"> <tr><td>n</td><td>&nbsp;&nbsp;</td><td>Netted</td><td></td><td></td></tr> <tr><td>w</td><td>&nbsp;&nbsp;</td><td>Out Wide</td><td></td><td></td></tr> <tr><td>d</td><td>&nbsp;&nbsp;</td><td>Out Long</td><td></td><td></td></tr> <tr><td>x</td><td>&nbsp;&nbsp;</td><td>Wide and Long</td><td></td><td></td></tr> <tr><td>e</td><td>&nbsp;&nbsp;</td><td>Unknown Error</td><td></td><td></td></tr> <tr><td>g</td><td>&nbsp;&nbsp;</td><td>Foot Fault</td><td></td><td></td></tr> <tr><td>!</td><td>&nbsp;&nbsp;</td><td>Shank</td><td></td><td></td></tr> <tr><td></td><td>&nbsp;&nbsp;</td><td></td><td></td><td></td></tr> </table> </td> <td class="helpCol" valign="top"> <b>Shot Depth</b> <table class="mcpKeys"> <tr><td>7</td><td>&nbsp;&nbsp;</td><td>Shallow</td><td></td><td></td></tr> <tr><td>8</td><td>&nbsp;&nbsp;</td><td>Deep</td><td></td><td></td></tr> <tr><td>9</td><td>&nbsp;&nbsp;</td><td>Near Baseline</td><td></td><td></td></tr> <tr><td></td><td>&nbsp;&nbsp;</td><td></td><td></td><td></td></tr> </table> <b>Point Terminators</b> <table class="mcpKeys"> <tr><td>*</td><td>&nbsp;&nbsp;</td><td>Winner</td><td></td><td></td></tr> <tr><td>#</td><td>&nbsp;&nbsp;</td><td>Forced Error</td><td></td><td></td></tr> <tr><td>@</td><td>&nbsp;&nbsp;</td><td>Unforced Error</td><td></td><td></td></tr> <tr><td></td><td>&nbsp;&nbsp;</td><td></td><td></td><td></td></tr> </table> </td> <td class="helpCol" valign="top"> <b>Incidentals</b> <table class="mcpKeys"> <tr><td>;</td><td>&nbsp;&nbsp;</td><td>Net Cord</td><td></td><td></td></tr> <tr><td>c</td><td>&nbsp;&nbsp;</td><td>Let</td><td></td><td></td></tr> <tr><td></td><td>&nbsp;&nbsp;</td><td></td><td></td><td></td></tr> </table> <b>Position</b> <table class="mcpKeys"> <tr><td>+</td><td>&nbsp;&nbsp;</td><td>Approach</td><td></td><td></td></tr> <tr><td>-</td><td>&nbsp;&nbsp;</td><td>at the Net</td><td></td><td></td></tr> <tr><td>=</td><td>&nbsp;&nbsp;</td><td>Baseline</td><td></td><td></td></tr> </table> </td> <td class="helpCol" valign="top"> <b>Point Assignment</b> <table class="mcpKeys"> <tr><td>S</td><td>&nbsp;&nbsp;</td><td>Server Point</td><td></td><td></td></tr> <tr><td>P</td><td>&nbsp;&nbsp;</td><td>Server Penalty</td><td></td><td></td></tr> <tr><td>R</td><td>&nbsp;&nbsp;</td><td>Receiver Point</td><td></td><td></td></tr> <tr><td>Q</td><td>&nbsp;&nbsp;</td><td>Receiver Penalty</td><td></td><td></td></tr> </table> </td> </tr> </table>';
var hlp = document.getElementById('help');
hlp.innerHTML = help;

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
