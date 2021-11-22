!function() {

   var interact = {};
   interact.storage = getStorage();

   var playerlist;
   var fullyLoaded = false;
   var modal;

   interact.events = {
      showModal: null
   }

   if (location.origin.indexOf('localhost') < 0) {
     (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
     (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
     m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
     })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

     ga('create', 'UA-65756694-2', 'auto');
     ga('send', 'pageview');
  }

  document.addEventListener('DOMContentLoaded', initScript);

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

  function initAwesomeplete() {
     var tP = document.getElementById('thePlayer');
     if (tP) new Awesomplete(document.getElementById('thePlayer'), { list: playerlist });
     if (typeof playerlist == 'object' && playerlist.length) { 
        activateSearch(); 
     } else {
        interact.dbUpdate();
     }
  }

  function fetchPlayerDB() {
     var ajax = new XMLHttpRequest();
     ajax.open("GET", "/api/pldb/", true);
     ajax.onload = function() {
        playerlist = eval(ajax.responseText).map(function(m) { return { value: m[0], label: m[0] + ' <b>[' + m[1] + ']</b>' }});
        interact.storage['pldb'] = JSON.stringify(playerlist);
        initAwesomeplete();
     };
     ajax.send();

  }

  function initScript() {
     if (interact.storage['pldb']) {
        playerlist = JSON.parse(interact.storage['pldb']);
        initAwesomeplete();
     } else {
        fetchPlayerDB(); 
     }

     var panel = document.getElementById('panel');
     if (panel) panel.style.display = "inline";

     modal = document.getElementById('myModal');

     var modals = document.querySelectorAll(".modalInfo");
     var modals = document.getElementsByClassName("modalInfo");
     for (var i = 0; i < modals.length; i++) {
        modals[i].addEventListener('click', function() {
          var which = this.getAttribute('info');
          showModal(which);
        }, false);
     }

     var launchers = document.getElementsByClassName("launchSearch");
     for (var i = 0; i < launchers.length; i++) {
        launchers[i].addEventListener('click', launchSearch , false);
     }

     document.getElementById('closeModal').onclick = function() { interact.closeModal(); };
     if (readWrite) readWrite.loadTennisMath = hideModal;
     if (readWrite) readWrite.loadTennisScoreboard = hideModal;

     var menu = document.getElementById('menu');
     if (menu) menu.onclick = function() { interact.toggleMenu(); };

     window.addEventListener( 'resize', resizeMenu, false );

     function resizeMenu() { 
        var wwidth = window.innerWidth;
        var nm = document.getElementById('navmenu');
        if (nm) {
           var width = parseInt(nm.style['width'] || 250);
           if (wwidth <= 480) {
              width = wwidth;
           } else {
              width = 250;
           }
           nm.style['width'] = width + 'px';
           nm.style['margin-left'] = "-" + width + 'px';
        }
     }
  }

  interact.closeModal = function() {
     modal.style.display = "none";
  }

  window.addEventListener("load", pageFullyLoaded, false);

  function pageFullyLoaded() {
     fullyLoaded = true;
  }

  function activateSearch() {
     var search_btns = document.querySelectorAll(".fully-loaded");
     for (var i = 0; i < search_btns.length; i++) {
        search_btns[i].style.display = 'inline';
     }
  }

  interact.launchSearch = launchSearch;
  function launchSearch() {
     var modal = document.getElementById('myModal');
     modal.style.display = "none";
     if (search) search.toggleSearch('open');
     interact.toggleMenu('close');
  }

  interact.notFound = function() {
     showModal('notfound');
  }

  interact.dbUpdate = function() {
     showModal('dbupdate');
  }

  interact.showModal = showModal;
  function showModal(which, what) {
     var item = which.split(' ').length == 1 ? true : false;
     if (item && !modalText[which]) return;

     if (modal && which) {
        if (interact.events.showModal) interact.events.showModal();
        if (search && search.toggleSearch) search.toggleSearch('close');
        interact.toggleMenu('close');
        var mt = document.getElementById('modalText');
        mt.innerHTML = item ? modalText[which] : which;
        modal.style.display = "block";

        if (item) {
           var report_text = which;
        } else {
           var report_text = what || 'Undefined';
        }
        var report = ('Modal Display: ' + report_text).replace(/\ /g, '_');
        if (aip) aip.sendReport(report);
     }
  }

  function hideModal() {
     var modal = document.getElementById('myModal');
     modal.style.display = "none";
  }

  interact.toggleMenu = toggleMenu;
  function toggleMenu(state) {
     var wwidth = window.innerWidth;
     var nm = document.getElementById('navmenu');
     var margin = window.getComputedStyle(navmenu).getPropertyValue('margin-left').match(/\d/g).join('') * -1;
     // var margin = parseInt(nm.style['margin-left'] || -250);
     var width = parseInt(nm.style['width'] || 250);
     var width = (wwidth <= 480) ? wwidth : 250;
     nm.style['width'] = width + 'px';
     if (state == 'close') {
        nm.style['margin-left'] = "-" + width + 'px';
     } else if (state == 'open') {
        nm.style['margin-left'] = "0px"
        if (search) search.toggleSearch('close');
     } else {
        nm.style['margin-left'] = margin < 0 ? '0px' : '-' + width + 'px';
        if (search) search.toggleSearch('close');
     }
     return false;
  }

  /*
  // script added directly into .html to start carousel on load...
  // but perhaps the .html no longer needs it...
  // although it applies to the main page but not to CourtHive

  var box = document.querySelector('.carousel');
  if (box) {
     var items = box.querySelectorAll('.content li');
     var counter = 0;
     var paused = false;
     var amount = items.length;
     var current = items[0];
     box.classList.add('active');
     function navigate(counter) {
       current.classList.remove('current');
       current = items[counter];
       current.classList.add('current');
     }
     navigate(0);
     function Carousel() {
        if (paused) return;
        if (counter + 1 < amount) {
           counter += 1;
        } else {
           counter = 0;
        }
        navigate(counter);
     }
     setInterval(Carousel, 5000);
     var pause = document.getElementById("carousel");
     pause.addEventListener("mouseenter", function( event ) { 
           paused = true; 
           setTimeout(function() { paused = false; }, 10000);
        });
  }
  */

   var notice = ' <div><input type="image" src="/splash/Search Icon.png" onclick="interact.launchSearch()" width="20"> <b><i>For interactive charts, search for a player.</i></b> <input type="image" src="/splash/Search Icon.png" onclick="interact.launchSearch()" width="20"></div>';
   var notice = '';
   var modalText = {
     'PTS':
     '<h2>Points to Set</h2>' + notice + '<p>"Points-to-Set" presents a visual summary of a tennis match and attempts to capture something of the dynamics of Point Progression during play.</p><center><img class="img-responsive" style="max-width: 600px" src="/splash/pts-1.jpg" alt="Points To Set"> </center> <p> To win a standard Set in a tennis match a player must, at a minimum, win six games and be ahead by two games.  Four points must be won in each game; the minimum number of points necessary to win a standard set is therefore twenty-four.  </p> <p> We can think of the "Points to Set" number as the minimum distance from the current number of points won until the end of the Set; it always assumes the opponent wins no additional points. Any points won in a game that is lost don\'t count. If a set is tied at five-five, an additional game, at least four more points, must be won; at six-six, at least seven more points must be won in a tiebreak.  </p> <center> <img class="img-responsive" style="max-width: 600px" src="/splash/pts-2.jpg" alt="Points To Set"> </center> <p> "Points to Set" provides a clearer indication of where two players stand than the more traditional "Total Points Won". "Points to Set" charts make it easy to see that two 6-3 sets can be very different, or that a 6-3 set can contain as many points as a 7-5 set.</p><p>The "Point to Set" component is interactive.  Hovering on the first point of each set displays winners (green) and errors (red) as well as rally lengths, if available. Hovering over the last point of each set highlights which games were won by each player.</p> <p>Read more about <a href="http://tennisviz.blogspot.hr/2015/08/points-to-set.html" target="_blank">Points to Set</a> on the <a href="http://tennisviz.blogspot.hr/2015/08/points-to-set.html" target="_blank">TennisVisuals Blog</a>.</p>',

    'matchRadar':
    '<h2> Match Radar</h2>' + notice + '<p> The Match Radar is intended to provide a compact visual comparison of the key statistics for players of a tennis match, enabling a quick assessment of whether and how one player dominated another, whether a match was lob-sided, and where players differed on key statistics.  It is not intended as a tool for in-depth analysis.  </p> <p> The Match Radar <i>Reboot</i> introduces a new dynamic chart component.  In this example a layer depicting a player\'s average stats for a chosen time period has been added for comparision with player tournament and match performances.  </p><div class="flex-modal-parent"><div class="flex-modal-child"> <img class="img-responsive" style="max-width: 400px" src="/splash/MatchRadar.jpg" alt="Match Radar"></div></div> <p> View the published code for the <a target="_blank" href="http://bl.ocks.org/TennisVisuals/c591445c3e6773c6eb6f">Updating radarChart</a> at <a target="_blank" href="http://bl.ocks.org/TennisVisuals/">Bl.ocks.org</a> </p> <p> Read more about <a href="http://tennisviz.blogspot.hr/2015/08/match-radar.html" target="_blank">Match Radar</a> on the <a href="http://tennisviz.blogspot.hr" target="_blank">TennisVisuals Blog</a>.</p> ',

    'gameTree':
    '<h2> Game Tree </h2>' + notice + '<p> "Game Tree" is a depiction of Point Progression for a selection of games within a tennis match or across a series of tennis matches.  Games start at \'0-0\' and "progress" through the tree until a player wins the game.  On the left is a composite view of all games served by Federer in his Round Robin match against Djokovic in the 2015 Tour Finals. On the right is a composite view of all of Djokovic\'s service games. </p><p><center> <img class="img-responsive" border="0" style="max-width: 400px" src="/splash/GT1.jpg" alt="Game Tree"><img class="img-responsive" style="max-width: 400px" border="0" src="/splash/GT2.jpg" alt="Game Tree"></center></p> <p> The thickness of the lines connecting any two scores indicates the number of points which "progressed" between the two nodes.  The color of the lines indicates the Percentage of points which were won due to  <font style="color: green">Winners</font> and <font style="color: red">Errors</font>.  </p> <p> The player you have searched for is represented by the <b><font style="color: purple">Purple</font></b> circles.  The opponent is in <b><font style="color: blue">Blue</font></b>.  The initial view is games served by your player.  The two circles in the upper left corner are "Selectors" where you can decide which player\'s serves you would like to view.  Deselecting both shows all points, regardless of server.  </p> <p> Hovering over Point Lines displays the number of points which "progressed" between two nodes; hovering over a Point Node displays the % of Games Won for the Primary Player (your search).  Depending on which player you have selected (using the Selectors) you can tell the % of games "Held" and "Broken" from any Point Score during a match or collection of matches.  </p> <p> Read more about <a href="http://tennisviz.blogspot.hr/2015/10/game-tree.html" target="_blank">"Game Tree"</a> on the <a href="http://tennisviz.blogspot.hr/2015/10/game-tree.html" target="_blank">TennisVisuals Blog</a>.  </p> <div id="footer"> Original design <a href="http://gamesetmap.com">&copy; GameSetMap</a>. Reproduced and enhanced with permission.</div>',

    'rallyTree':
    '<h2> Rally Tree </h2>' + notice + ' <p> Tennis is an "intermittent" sport.  The level of intensity can vary greatly with the rally length of points and the time taken between points (among other factors including surface, ball type, sex and level of play).  When rallies are visualized they are typically depicted temporally from the first point to the last, which gives a jagged chart where it is difficult to discern any pattern at all.  "Rally Tree" is an attempt to bring a different perspective to the analysis of rallies.  </p> <p> "Rally Tree" depicts the distribution of points across various rally lengths, beginning at the top with rally lengths of Zero, which indicate either Aces, Serve Winners, or Double Faults. Color coding differentiates errors where balls were "netted" vs. hit long.  </p> <img class="img-responsive" border="0" src="/splash/RT1.jpg" alt="Rally Tree"> <p> There are several available views.  The default view displays all points for a single match or selection of matches. You can filter by player to display only points served by either player (or composite of opponents).  </p> <p> Additionally there is an overlay depicting the percentage chance that a point was won for any given rally length. The offset vertical lines represent 50% either side of center (0%).  For the "served points" views, this gives a graphic representation of the Persistence of Server Advantage, which varies greatly among players. Please note that this is <i><b>not</b></i> the same as percentage of points won for a given rally length.  </p> <img class="img-responsive" border="0" src="/splash/RT2.jpg" alt="Rally Tree"> <p>In the near future "Rally Tree" will be integrated with "Game Tree" and other TAVA components so that selections in one component can drive views in another.  For instance, a "Point Progression" from 0-0 to 0-15 can be selected in "Game Tree" to view the distribution of points in the "Rally Tree" or "Points-to-Set".  From this point it will be possible to explore whether there are certain points in a match when rally lengths increase...  </p> <p>When "Tournament Views" are introduced, it will be possible to filter "Game Trees" and "Rally Trees" by Surface type.  </p> <p> To read more about <a href="http://www.tennisabstract.com/blog/2011/08/17/how-long-does-the-servers-advantage-last/" target="_blank"> "Persistence of Server Advantage"</a> please follow the link to Jeff Sackmann\'s blog post on the topic.</p>',

    'ladderChart':
    '<h2> Ladder Chart </h2><p>The Ladder Chart provides a "roll-up" view of a player\'s tournament outcomes.  ATP and WTA Tournaments are represented as Circles, <b>colored</b> to indicate surface and <b>sized</b> to denote the rank of the tournament. Matches on the Challenger Tour are represented as Triangles, and Futures matches are represented as Square.</p><p>In the interactive views: <ol><li><b>View Matches</b> by clicking on a tournament</li><li><b>Zoom In</b> by clicking on Years on the lower Axis</li><li><b>Zoom Out</b> by clicking on the player name</li><li><b>Filter Rounds</b> by clicking on the left axis</li><li><b>Filter by Surface</b> by clicking Surface counters</li> <li><b>Filter by Opponent</b> click the Opponents counter and enter a name</li><li><b>Filter by Tournament</b> click the Tournament counter and enter a name</li> </ol> </p> <img class="img-responsive" border="0" src="/splash/ladderDemo.gif" alt="Ladder Chart"><p> </p> <p> Ladder Chart is based on a design by <a href="https://twitter.com/jburnmurdoch" target="_blank">John Burn-Murdoch</a> for <a href="https://ig.ft.com/sites/novak-djokovic-the-best-tennis-season-ever/" target="_blank"> The Financial Times </a>. The <a href="https://twitter.com/Renestance/status/668513083955027969" target="_blank">original design</a> was created by <a href="https://twitter.com/Renestance" target="_blank">René Denfeld</a> of <a href="http://www.insideout-tennis.de/" target="_blank">Inside-Out Tennis</a>.',

    'pCoords':
    '<h2> Parallel Coordinates </h2><p>Parallel Coordinates is a method of visualizing multi-dimensional data; it becomes truly powerful as an interactive tool where various axes may be \'brushed\' to filter data by desired ranges of values.</p><p>The <b>average values</b> for all selected matches appears in <font color="blue">blue</font> below each axis.</p><p>In the interactive views: <ol><li><b>Filter Matches</b> by clicking and dragging along an axis</li><li><b>Clear Filters</b> by clicking anywhere on the axis outside the filter</li><li><b>Slide Filters</b> by \'grabbing\' and dragging them up or down an axis</li><li><b>Rearrange Axes</b> by \'grabbing\' axis titles and dragging them left or right</li><li><b>Select Dimensions</b> by clicking the <img border="0" src="/images/gear.png" width="12"> \'Settings\' icon on the right of the chart</li></ol> </p> <img class="img-responsive" border="0" src="/splash/pCoords.jpg" alt="Rally Tree"> <p>Match Surfaces are indicated by color and the Win/Loss % for each surface is displayed below the chart. </p>',

    'horizon':
    '<h2> Horizon Graph </h2>' + notice + ' <p> "Horizon Graphs" provide a condensed representation of the Points-to-Set chart, showing the difference between the Points-to-Set number for each player in a match.  The darker a player\'s color, the futher ahead they are in the set. At a glance it is possible to tell when the momentum changed in a match.   </p> <center> <img class="img-responsive" border="0" src="/splash/horizon.gif" alt="Horizon"> </center> <p>In match views "brushing" can be used with the Horizon Graph to select ranges of points. </p> <p> "Horizon Graphs" can be used to quickly compare a series of sets or matches, with enough detail to easily differentiate a 6-0, 6-0 win that was a "cakewalk" from a 6-0, 6-0 win where every game went to deuce and beyond.  </p> <p> Read more about <a href="http://tennisviz.blogspot.hr/2015/08/points-to-set-horizon-corona.html" target="_blank">"Horizon Graphs"</a> on the <a href="http://tennisviz.blogspot.hr/2015/08/points-to-set-horizon-corona.html" target="_blank">TennisVisuals Blog</a>.  </p>',

    'coronaHorizon':
    '<h2>Corona Horizon</h2>The "Corona" is a Radial Horizon Graph intented to provide a compact, iconic representation of a match.<center> <div class="flex-modal-parent"> <div class="flex-modal-child"><img border="0" style="max-height: 180px" src="/splash/CH_Williams.jpg" alt="Corona"/></div> <div class="flex-modal-child"><img border="0" src="/splash/CH_Nadal.jpg" width="180" alt="Corona"/></div> <div class="flex-modal-child"><img border="0" src="/splash/CH_Halep.jpg" width="180" alt="Corona"/></div> </div></center> You can read about the origin of this graph on the <a href="http://tennisviz.blogspot.hr/2015/08/points-to-set-horizon-corona.html">TennisVisuals Blog</a> ',

    'gameFish':
    '<h2>GameFish: Point Progression, Key Shots, Rallies</h2>' + notice + '<p>The GameFish visualization provides a single-glance overview of one game from a tennis match.  It is an enhancement of the standard score-matrix for tennis matches.</p><div class="flex-modal-parent"><div class="flex-modal-child"><img height="180px" src="/splash/GF-v.jpg"></div><div class="fles-child"></div></div><p> The boxes on the edges the graphic indicate which player was serving.  Light Green dots represent Service Winners; Yellow dots represent Serves that were "In"; Red dots represent faults.</p><p> The Game Grid in the center of the graphic indicates the winner of the point by cell color as well as the final "Key Shot" which determined the point winner.</p><p> Rally lengths are depicted with bluish-grey bars which appear "behind" the GameFish.</p>',

    'sunburst':
    '<h2>Sunburst: Match at a Glance</h2>' + notice + '<p>The Sunburst was my very first experiment utilizing D3 to visualize a tennis match.  Eventually I will get around to re-writing it to fit in with the current trajectory of this site... but you can still read about it on the <a href="http://tennisviz.blogspot.hr/2015/07/sunburst-match-at-glance.html">TennisVisuals blog.</a> </p>',

    'sankey':
    '<h2>Shot Explorer: Parallel Sets</h2>' + notice + '<p>The Shot Explorer was one of the earliest components I developed for visualizaing and interactively exporing all of the shots captured by ProTracker Tennis. It is currently being re-written and will reappear soon.  You can read about its functionality on the <a href="http://tennisviz.blogspot.hr/2015/08/shot-explorer-parallel-sets.html">TennisVisuals blog.</a> </p>',

    'upload':
    ' <h2>Match Upload</h2><b>*</b> Uploading files from popular tracking applications is an experimental feature.  The "Court View" is not yet available.</p> <p> <div class="flex-modal-parent"> <div class="flex-modal-icon"><table><tr><td> <input type="image" class="trackers" src="/splash/ptf.jpg" title="upload" onclick="readWrite.uploadMatch()" tabindex="-1"/> </td><td valigh="top"></td></tr></table></div> <div class="flex-modal-icon"><table><tr><td> <input type="image" class="trackers" src="/splash/mcp.jpg" title="upload" onclick="readWrite.uploadMatch()" tabindex="-1"/> </td><td valigh="top"></td></tr></table></div> <div class="flex-modal-icon"><table><tr><td> <input type="image" class="trackers" src="/splash/ttm.jpg" title="upload" onclick="readWrite.uploadMatch()" tabindex="-1"/> </td><td valigh="top"></td></tr></table></div> <div class="flex-modal-icon"><table><tr><td> <input type="image" class="trackers" src="/splash/mts.jpg" title="upload" onclick="readWrite.uploadMatch()" tabindex="-1"/> </td><td valigh="top"></td></tr></table></div> <div class="flex-modal-icon"><table><tr><td> <input type="image" class="trackers" src="/splash/esc.jpg" title="upload" onclick="readWrite.uploadMatch()" tabindex="-1"/> </td><td valigh="top"></td></tr></table></div> <div class="flex-modal-icon"><table><tr><td> <input type="image" class="trackers" src="/splash/tss.jpg" title="upload" onclick="readWrite.uploadMatch()" tabindex="-1"/> </td><td valigh="top"></td></tr></table></div> <div class="flex-modal-icon"><table><tr><td> <input type="image" class="trackers" src="/splash/smt.jpg" title="upload" onclick="readWrite.uploadMatch()" tabindex="-1"/> </td><td valigh="top"></td></tr></table></div> <div class="flex-modal-icon"><table><tr><td> <input type="image" class="trackers" src="/splash/tst.jpg" title="upload" onclick="readWrite.uploadMatch()" tabindex="-1"/> </td><td valigh="top"></td></tr></table></div> <div class="flex-modal-icon"><table><tr><td> <input type="image" class="trackers" src="/splash/tsp.jpg" title="upload" onclick="readWrite.uploadMatch()" tabindex="-1"/> </td><td valigh="top"></td></tr></table></div> </div> <div class="flex-modal-parent"> <div class="flex-modal-icon"><table><tr><td> <input type="image" class="trackers" src="/splash/tmt.jpg" onclick="readWrite.fetchTennisMath()" tabindex="-1"/> </td><td valigh="top"><p>enter code:<br><input id="tmtCode" onkeyup="readWrite.submitTMTcode(event)"></p></td></tr></table></div> <div class="flex-modal-icon"><table><tr><td> <input type="image" class="trackers" src="/splash/tsb.jpg" onclick="readWrite.fetchTennisScoreboard()" tabindex="-1"/> </td><td valigh="top"><p>enter code:<br> <input id="tsbCode" onkeyup="readWrite.submitTSBcode(event)"></p></td></tr></table></div> </div> </p> <button id="upload_button" class="btn upload-btn" alt="Upload File" onclick="readWrite.uploadMatch()" tabindex="-1">Upload File</button> ',

    'tracking':
    ' <h2>Match Tracking</h2><p>TennisVisuals supports the import of matches tracked by popular mobile apps such as <a href="http://www.fieldtown.co.uk/">ProTracker Tennis</a>. To import a match, click <input type="image" src="/images/ul.png" height="25" alt="upload" onclick="interact.showModal(\'upload\')"> and select a match from your file system. You can also enter match codes for matches tracked using <a href="http://tennismath.com/">TennisMath</a> and <a href="http://ts.nik.space/games">Tennis Scoreboard</a>.</p><p>For more advanced match tracking, you can try <a href="/CourtHive">CourtHive</a>. Read more about the impetus for <a href="/CourtHive">CourtHive</a> in <a href="https://medium.com/the-tennis-notebook/how-to-chart-a-match-cb52ab9f62e5#.2tt7js98b">How To Chart a Match.</a></p><a href="https://medium.com/the-tennis-notebook/how-to-chart-a-match-cb52ab9f62e5#.2tt7js98b"><p><center><img class="img-responsive" border="0" src="/splash/htcm.jpg" alt="ladderChart"></center></p></a>',

    'faq':
    '<h2>Frequently Asked Questions</h2><ul> <li><h3><b>What is this?</b></h3>TennisVisuals is my playground.  I\'m learning D3.js (and a number of other related tools) while attempting to visualize data generated by tennis matches.</li> <li><h3><b>What\'s the Point?</b></h3>There is no commercial impetus to this endeavour. But there is a long-term vision which will radically reshape this project once I feel I have the chops to attempt it... </li> <li><h3><b>How do I use it?</b></h3>Start by searching for your favorite player.  If you don\'t know any player names, just start typing.  Names will be suggested. Matches appear organized by tournament on a timeline. Filter by selecting a surface, or entering an opponent or tournament name. Select a tournament to see a list of matches for your chosen player. <p><center> <img class="img-responsive" border="0" src="/splash/ladderDemo.gif" alt="ladderChart"> </center></p><p>When there are stats available for selected tournaments they are displayed below the tournament timeline in an interactive chart that enables further filtering.</p><p><center><img class="img-responsive" border="0" src="/splash/pCoords.jpg" alt="Rally Tree"></center></p> Horizon Charts for specific matches are presented after selecting a tournament in the tournament timeline or the stat browser. Click on a Horizon Chart for interactive visualizations of the match you want to explore.<p><center> <img class="img-responsive" border="0" src="/splash/tournamentHorizon.jpg" alt="tournamentHorizon"> </center></p> You can read about the other visualizations you will encounter in the Gallery on the TennisVisuals home page. Be sure to click around on the visualizations to interact with the data. The "Horizon Chart", for instance, is "brushable", meaning you can drag across it to select a range of points; other charts will update dynamically to reflect the points chosen.</p><p><center> <img class="img-responsive" border="0" src="/splash/interactive.gif" alt="Interactive Visualizations"> </center></p><p></li> <li><h3><b>Where does the data come from?</b></h3>At present the bulk of the data comes from the <a href="https://github.com/JeffSackmann/tennis_MatchChartingProject" target="_blank">Match Charting Project</a>.  When I get around to it I will add other data sources.  But you can chart your own matches using <a href="/CourtHive">CourtHive</a>, and matches exported from popular tracking applications such as ProTracker Tennis can be uploaded as well.</p><p><center><img class="img-responsive" border="0" src="/splash/trackers.jpg" alt="Tracking Applications"></center></p></li></ul>',

    'notfound':
    '<center><h2>Oops... Match File Not Found</h2><center>',

    'dbupdate':
    '<center><h2>Database Update in Progress... you can still upload files!</h2></center>'

   };

   this.interact = interact;

}();
