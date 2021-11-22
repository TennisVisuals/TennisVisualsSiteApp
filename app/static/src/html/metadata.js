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
