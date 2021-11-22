/*
CSV (TEXT) = MCP CSV Files and CourtHive exports
ESC (TEXT) = e-Scorer
MTS (HTML) = MyTennisStats
TSS (TEXT) = Tennis Stats, Android
TST (HTML) = Tennis Score Tracker ('Tennis Track'), iOS
TSP (TEXT) = Tennis Stats Pro, Android
TTM (JSON) = Tennis Tracker, iOS
CH  (JSON) = CourtHive, Android/iOS/Web
SMT (XML ) = StatMyTennis, iOS, Android
PTF (TEXT) = ProTracker Tennis, iOS
XLS (XLSM) = MCP XLS Spreadsheed
*/

!function() { 

   // module container
   var parsers = {};

   function resetMeta() {
      parsers.meta = { bestof: 3 };
      parsers.meta.players = { 0: 'Player One', 1: 'Player Two', 2: '', 3: '' };
   }

   function formatDate(date) {
      var d = date.yyyymmdd();
      return parseDate(d);
   }

   function parseDate(textdate) {
      textdate = textdate.toString();
      var date_string = textdate.slice(0, 4) + '-' + textdate.slice(4, 6) + '-' + textdate.slice(6);
      return date_string;
   }

   function updateUMOmeta() {
      if (!parsers.umo) return;

      parsers.umo.options({ 
         match: {
             desc: parsers.meta.match_desc || '',
             sets: +parsers.meta.bestof || 3,
             final_set_tiebreak: parsers.meta.final_set_tiebreak == undefined ? true : parsers.meta.final_set_tiebreak,
             final_set_tiebreak_only: parsers.meta.final_set_tiebreak_only || false,
             final_set_tiebreak_to: +parsers.meta.final_set_tiebreak_to || 7,
             first_service: parsers.meta.first_service || 0,
         },
         set: { 
            games: parsers.meta.setgames == undefined ? 12 : +parsers.meta.setgames,
            tiebreak: parsers.meta.tiebreak == undefined ? true : parsers.meta.tiebreak,
            tiebreak_at: parsers.meta.tiebreak_at ? +parsers.meta.tiebreak_at : parsers.meta.setgames ? +parsers.meta.setgames / 2 : 6,
            tiebreak_to: +parsers.meta.tiebreak_to || 7,
            advantage: parsers.meta.advantages == false ? false : true,
            lets: parsers.meta.lets == false ? false : true,
         } 
      });

      parsers.umo.metadata({
         players: { 
            0: { name: parsers.meta.players[0] || '', fname: '', lname: '', fh: parsers.meta.p1hand || '' },
            1: { name: parsers.meta.players[1] || '', fname: '', lname: '', fh: parsers.meta.p2hand || '' },
            2: { name: parsers.meta.players[2] || '', fname: '', lname: '', fh: parsers.meta.p3hand || '' },
            3: { name: parsers.meta.players[3] || '', fname: '', lname: '', fh: parsers.meta.p4hand || '' }
         },
         tournament: {
            name: parsers.meta.tournament || '',
            surface: parsers.meta.surface || '',
            round: parsers.meta.round || '', 
         },
         match: {
            date: parsers.meta.matchdate ? parsers.meta.matchdate : '',
            category: parsers.meta.category || '',
            court: parsers.meta.court || '',
            umpire: parsers.meta.umpire || ''
         },
         charter: parsers.meta.charter || ''
      })
   }

   function addPoint(p) { 
      return parsers.umo.push(p); 
   }

   var CSV = {};
   CSV.file_format = 'text';
   parsers.CSV = CSV;

   CSV.parse = function(file_content) {
      resetMeta();
      // test for type of CSV
      return MCP.parse(file_content);
   }

   var HTML = {};
   HTML.file_format = 'text';
   parsers.HTML = HTML;

   var TXT = {};
   TXT.file_format = 'text';
   parsers.TXT = TXT;

   HTML.parse = TXT.parse = function(file_content) {

      // Tennis Stats
      var game_log = /Game Log/;
      var to_serve = /to serve/; 
      var won_game = /won the game/;

      // e-Scorer
      var esc = /e-Scorer Match Record/;
      var players = /PLAYERS/;
      var format = /FORMAT/;

      // Tennis Score Tracker
      var point_history = /Point History/;
      var tst = /Tennis Score Tracker/;

      // Tennis Stats Pro
      var grupo = /GrupoXCell/;
      var tsp = /The TSP team/;

      // My Tennis Stats App
      var mts = /MyTennisStatsApp/;

      if (game_log.test(file_content) && to_serve.test(file_content) && won_game.test(file_content)) {
         return TSS.parse(file_content);
      } else if (esc.test(file_content) && players.test(file_content) && format.test(file_content)) {
         return ESC.parse(file_content);
      } else if (point_history.test(file_content) && tst.test(file_content)) {
         return TST.parse(file_content);
      } else if (grupo.test(file_content) && tsp.test(file_content)) {
         return TSP.parse(file_content);
      } else if (mts.test(file_content)) {
         return MTS.parse(file_content);
      }
   }

   // Tennis Stats Pro
   var MTS = {};
   MTS.file_format = 'text';
   parsers.MTS = MTS;

   MTS.parse = function(file_content) {
      resetMeta();

      d3.select('body').append('div').attr('id', 'parser').style('display', 'none');
      d3.select('#parser').html(file_content);
      var mts_file = document.querySelector('#parser');
      var mts_sections = mts_file.getElementsByTagName('a');
      var mts_keys = Object.keys(mts_sections);
      var game_keys = mts_keys.filter(function(f) { return f.indexOf('game') >= 0; });
      var mts_header = mts_sections['top'];
      var header_rows = mts_header.children[0].children[0].children;
      var description = header_rows[1].textContent;
      if (description.indexOf('Event:') >= 0) {
         parsers.meta.match_desc = description.split('Event:')[1].trim();
         parsers.meta.tournament = parsers.meta.match_desc;
      }
      var date = header_rows[2].textContent;
      if (date.indexOf('Date:') >= 0) {
         parsers.meta.matchdate = formatDate(new Date(date.split('Date:')[1].trim()));
      }
      var team1 = header_rows[3].children[0].textContent.trim().split('/');
      var team2 = header_rows[4].children[0].textContent.trim().split('/');
      var player1 = team1[0].trim();
      var player2 = team2[0].trim();
      var player3 = team1.length > 1 ? team1[1].trim() : '';
      var player4 = team2.length > 1 ? team2[1].trim() : '';
      var players = [player1, player2, player3, player4];
      parsers.meta.players = players;

      var points = [];
      var first_service;
      var max_game_score = 4;
      var high_game_score;
      var in_tiebreak = false;
      var tiebreak_score = [0, 0];
      var normal_tiebreak = 7;
      var final_set_tiebreak = 7;
      var game_in_set = 0;
      var last_games_score = [0, 0];
      parsers.meta.advantages = false;
      parsers.meta.tiebreak = false;
      var parenthetical = /\(([^)]+)\)/;
      game_keys.forEach(function(game) {
         var game_data = mts_sections[game].children[0].children[0].children;
         for (var p=0; p < game_data.length; p++) {
            var point = {};
            var point_to;
            var scoreline = game_data[p].children[0];
            // accumulate end-of-game scores to deduce match format
            if (scoreline.textContent.indexOf('in Set') >= 0) { 
               // use this to determin whether first game is tiebreak
               game_in_set = 0;
               continue;
            }
            if (scoreline.textContent.indexOf('Game Winner') >= 0) { 
               if (in_tiebreak) {
                  if (Math.max.apply(null, tiebreak_score) > 9) {
                     if (game_in_set == 0) { parsers.meta.final_set_tiebreak_to = 10; }
                  }
               }
               in_tiebreak = false;
               game_in_set += 1;
               var match_score = parenthetical.exec(scoreline.textContent);
               if (match_score.length > 1) { 
                  var gs = match_score[1].split('-').map(function(m) { return +m; });; 

                  // if a score declined then we found high game score
                  if (gs[0] < last_games_score[0] || gs[1] < last_games_score[1]) {
                     if (last_games_score[0] > last_games_score[1] + 1) { 
                        high_game_score = last_games_score[0]; 
                     } else if (last_games_score[1] > last_games_score[0] + 1) { 
                        high_game_score = last_games_score[1];
                     } else {
                        high_game_score = Math.max(last_games_score[0], last_games_score[1]);
                     }
                  } else if (gs[0] > last_games_score[0] || gs[1] > last_games_score[1]) {
                     if (gs[0] > max_game_score) { max_game_score = gs[0]; }
                     if (gs[1] > max_game_score) { max_game_score = gs[1]; }
                  }
                  last_games_score = gs;
               }
               continue; 
            }
            if (scoreline.attributes.length) { continue; }
            if (scoreline.textContent == 'Score') { continue; }
            point.score = scoreline.textContent.trim();
            if (point.score.split('-').indexOf('1') >= 0) { 
               in_tiebreak = true;
               parsers.meta.tiebreak = true; 
               if (game_in_set == 0) {
                  parsers.meta.final_set_tiebreak_only = true;
               }
            }
            if (in_tiebreak) {
               tiebreak_score = point.score.split('-').map(function(f) { return +f; });
            }
            if (point.score.indexOf('A') >= 0) { parsers.meta.advantages = true; }
            var server = game_data[p].children[1].textContent.trim();
            var player = game_data[p].children[6].textContent.trim();
            // AT THIS POINT...
            // must account for team that is serving, not individual player
            point.server = players.indexOf(server) % 2;
            if (first_service == undefined) { first_service = point.server; }
            // AT THIS POINT...
            // must account for team that is serving, not individual player
            point.player = players.indexOf(player) % 2;
            point.result = game_data[p].children[7].textContent.trim();
            point.stroke = game_data[p].children[10].textContent.trim();
            point.stroke_type = game_data[p].children[9].textContent.trim();
            if (game_data[p].children.length > 12) {
               point.rally = game_data[p].children[12].textContent.trim();
            }
            if (['Winner', 'Ace', 'Service Winner', 'Won Point', 'Forced Error'].indexOf(point.result) >= 0) {
               point_to = (point.server == point.player) ? 'S' : 'R';
               point.winner = (point.server == point.player) ? 'S' : 'R';
            } else if (['Double Fault', 'Unforced Error', 'No Return'].indexOf(point.result) >= 0) {
               point_to = (point.server == point.player) ? 'R' : 'S';
               point.winner = (point.server == point.player) ? 'R' : 'S';
            } else {
               console.log('Point Assignment Error');
            }
            var first_serve_in = +game_data[p].children[2].textContent;
            var first_serve_out = +game_data[p].children[3].textContent;
            var second_serve_in = +game_data[p].children[4].textContent;
            var second_serve_out = +game_data[p].children[5].textContent;
            var second_serve = second_serve_in || second_serve_out ? 2 : 1;
            points.push(point);
         }
      });

      if (!high_game_score) { high_game_score = max_game_score; }
      parsers.meta.setgames = high_game_score * 2;
      parsers.meta.tiebrek_to = normal_tiebreak;
      parsers.meta.final_sset_tiebreak_to = final_set_tiebreak;

      parsers.meta.first_service = first_service;
      parsers.umo.options( { match: { first_service: first_service }} ); 
      updateUMOmeta();

      points.forEach(function(point) {
         addPoint(point.winner);
      });
   }

   // Tennis Stats Pro
   var TSP = {};
   TSP.file_format = 'text';
   parsers.TSP = TSP;

   TSP.parse = function(file_content) {
      resetMeta();
      var point = {};
      var matchAttr = {
         start_time: undefined,
         surface: undefined,
         date: undefined
      };
      var ptAttr = {};
      var serving;
      var first_service;
      var rows = file_content.split("\n");

      var whichPlayers = /([\w\s]+)\svs\s([\w\s]+)/;
      var parsePoint = /Point\s\#\s\d+\sTime\:\s(.*)\sWinner\:\s([\w\s]+)/;
      var whichServer = /Winner\:([\w\s]+)\sService\:\s([\w\s]+)\s/;
      var whichService = /Service\:\s([\w\s]+)\sService/;
      var doubleFault = /Service\:\sDouble\sFault/;
      var whichShotType = /\s+Type\:\s([\w\s]+)/;
      var whichShotEffect = /\s+Effect\:\s([\w\s]+)/;
      var whichShotDirection = /\s+Direction\:\s([\w\s]+)/;
      var whichShot = /\s+Shot\:\s([\w\s]+)/;
      var whichZoneFrom = /\s+Zone\sfrom\:\s([\w\s]+)/;
      var whichZoneTo = /\s+Zone\sto\:\s([\w\s]+)/;
      var surfaceDate = /\-\s(.*)\s\-\s(\d\d-\d\d-\d\d\d\d)/;

      // set options to default
      parsers.umo.options( {match: {first_service: 0, sets: 3 }} ); 

      rows.forEach(function(r) {
         if (whichPlayers.test(r)) {
            var pnames = whichPlayers.exec(r);
            parsers.meta.players = [pnames[1], pnames[2]];
         } else if (whichServer.test(r)) {
            var which_server = whichServer.exec(r)[2];
            serving = parsers.meta.players.indexOf(which_server);
            if (first_service == undefined) { 
               parsers.meta.first_service = first_service;
               first_service = serving; 
            };
            parsers.umo.options( {match: {first_service: first_service, sets: 5}} ); 
         } else if (surfaceDate.test(r)) {
            var match_attributes = surfaceDate.exec(r);
            matchAttr.surface = match_attributes[1];
            matchAttr.date = match_attributes[2];
         } else if (parsePoint.test(r)) {
            var parsed_point = parsePoint.exec(r);
            var time = parsed_point[1];
            if (matchAttr.start_time == undefined) matchAttr.start_time = time;
            var winner = parsed_point[2];

            if (point.winner != undefined) {
               decorateAndAdd();

               point = {};
               ptAttr = {};
            }

            point.server = serving;
            point.winner = parsers.meta.players.indexOf(winner);

         } else if (whichService.test(r)) {
            ptAttr.service = whichService.exec(r)[1];
         } else if (doubleFault.test(r)) {
            ptAttr.service = 'Double Fault';
         } else if (whichShotType.test(r)) {
            ptAttr.shotType = whichShotType.exec(r)[1];
         } else if (whichShot.test(r)) {
            ptAttr.shot = whichShot.exec(r)[1];
         } else if (whichShotDirection.test(r)) {
            ptAttr.shotDirection = whichShotDirection.exec(r)[1];
         } else if (whichShotEffect.test(r)) {
            ptAttr.shotEffect = whichShotEffect.exec(r)[1];
         } else if (whichZoneFrom.test(r)) {
            ptAttr.zoneFrom = whichZoneFrom.exec(r)[1];
         } else if (whichZoneTo.test(r)) {
            ptAttr.zoneTo = whichZoneTo.exec(r)[1];
         }
      });


      if (point.winner != undefined) { decorateAndAdd(); }

      addMatchAttributes();
      updateUMOmeta();

      function addMatchAttributes() {
         if (matchAttr.surface) { parsers.meta.surface = matchAttr.surface; }
         if (matchAttr.date) { 
            var md = matchAttr.date.split('-');
            parsers.meta.matchdate = md[2] + md[0] + md[1]; 
         }
      }

      function decorateAndAdd() {
         if (ptAttr.service) {
            if (ptAttr.service == 'Double Fault') {
               point.code = '0e|0e';
            } else {
               if (ptAttr.service.indexOf('2nd') >= 0) {
                  point.code = '0e|';
               } else {
                  point.code = '';
               }
               var final_shot = finalShot();
               if (final_shot) {
                  var sequence = '0';
                  if (point.server == point.winner) { sequence += 'q'; }
                  sequence += final_shot;
               } else {
                  var sequence = (point.server == point.winner) ? 'S' : 'R';
               }
               point.code += sequence;
            }
         }
         addPoint(point);
      }

      function finalShot() {
         var shotcode;
         if (ptAttr.shot == 'Forehand') {
            shotcode = 'f*';
            if (ptAttr.shotType == 'Unforced Error') {
               shotcode = 'qf@';
            } else if (ptAttr.shotType == 'Slice') {
               shotcode = 'r*';
            } else if (ptAttr.shotType == 'Lob') {
               shotcode = 'l*';
            } else if (ptAttr.shotType == 'Smash') {
               shotcode = 'o*';
            } else if (ptAttr.shotType == 'Drop') {
               shotcode = 'u*';
            } else if (ptAttr.shotType == 'Volley') {
               shotcode = 'v*';
            }
         } else if (ptAttr.shot == 'Backhand') {
            shotcode = 'b*';
            if (ptAttr.shotType == 'Unforced Error') {
               shotcode = 'qb@';
            } else if (ptAttr.shotType == 'Slice') {
               shotcode = 's*';
            } else if (ptAttr.shotType == 'Lob') {
               shotcode = 'm*';
            } else if (ptAttr.shotType == 'Smash') {
               shotcode = 'p*';
            } else if (ptAttr.shotType == 'Drop') {
               shotcode = 'y*';
            } else if (ptAttr.shotType == 'Volley') {
               shotcode = 'z*';
            }
         }

         return shotcode;
      }
   }
   
   // Stat My Tennis
   var SMT = {};
   SMT.file_format = 'text';
   parsers.SMT = SMT;

   SMT.parse = function(file_content) {
      resetMeta();
      xmlc = parseXML(file_content);
      var info = xmlc.getElementsByTagName('info')[0];
      parsers.meta.players = [info.getAttribute('player1'), info.getAttribute('player2')];
      parsers.meta.p1hand = info.getAttribute('lefty1') == 'false' ? 'R' : 'L';
      parsers.meta.p2hand = info.getAttribute('lefty2') == 'false' ? 'R' : 'L';

      var date = info.getAttribute('date');
      var match_date = new Date(date);
      var year = match_date.getFullYear().toString();
      var day = padToTwo(match_date.getDate()).toString();
      var month = padToTwo(match_date.getMonth() + 1).toString();
      parsers.meta.matchdate = parseDate(year + month + day);
      updateUMOmeta();

      RETURN_SHOT = "1000000000000000000000000000000"; // 0x40000000
      PLAYER      = "0100000000000000000000000000000"; // 0x20000000
      BACKHAND    = "0010000000000000000000000000000"; // 0x10000000
      SHOT_STYLES = "0001111000000000000000000000000";
      SHOT_TYPE   = "0000000111100000000000000000000";
      UNKNOWN     = "0000000000011000000000000000000"; // 0xc0000;
      SHOT_MODE   = "0000000000000110000000000000000";
      SHOT_SCORE  = "0000000000000000111000000000000";
      AREA        = "0000000000000000000110111111111";

      COURT = { SIZE_X: 78, SIZE_Y: 36, START_X: 0, MID_X: 18, SERV_X: 26, END_X: 39,
                START_Y_DOUBLES: 0, START_Y: 4.5, SERV1_Y: 11.25, CENTER1_Y: 13.5,
                MID_Y: 18, CENTER2_Y: 22.5, SERV2_Y: 24.75, END_Y: 31.5, END_Y_DOUBLES: 36 };

      games = [];
      var shots = [];
      var nodes = xmlc.getElementsByTagName('Match')[0].children;
      for (var s=0; s < nodes.length; s++) {
         if (nodes[s].tagName == 'score') {
            var current_set = 0;
            var scores = {'15': 1, '30': 2, '40': 3, 'A': 4};
            var match_score = parsers.umo.score();

            var target_sets_score    = [nodes[s].getAttribute('sets1'),  nodes[s].getAttribute('sets2')];
            var current_sets_score   = match_score.score;
            if (current_sets_score[0] != target_sets_score[0]) rectify_sets(0, current_sets_score[0], target_sets_score[0]);
            if (current_sets_score[1] != target_sets_score[1]) rectify_sets(1, current_sets_score[1], target_sets_score[1]);

            var target_games_score   = [nodes[s].getAttribute('games1'), nodes[s].getAttribute('game2')];
            rectify_games(0, target_games_score[0]);
            rectify_games(1, target_games_score[1]);

            var target_points_score  = [nodes[s].getAttribute('pts1'),   nodes[s].getAttribute('pts2')];
            var current_points = parsers.umo.points();
            if (current_points.length) {
               current_set = current_points[current_points.length - 1].set;
               var current_point = current_points[current_points.length - 1].score.split('-');
               var current_points_score = [scores[current_point[0]], scores[current_point[1]]];
            } else {
               var current_points_score = [0, 0];
            }
            if (current_points_score[0] != target_points_score[0]) rectify_points(0, current_points_score[0], target_points_score[0]);
            if (current_points_score[1] != target_points_score[1]) rectify_points(1, current_points_score[1], target_points_score[1]);
         }
         if (nodes[s].tagName == 'game' && shots.length) {
            games.push({ shots: shots });
            shots = [];
         }
         if (nodes[s].tagName == 'shot') {
            var shot = nodes[s].getAttribute('fromType');
            var toType = nodes[s].getAttribute('toType');
            var x1 = nodes[s].getAttribute('x1');
            var y1 = nodes[s].getAttribute('y1');
            var x2 = nodes[s].getAttribute('x2');
            var y2 = nodes[s].getAttribute('y3');
            var time = nodes[s].getAttribute('time');
            var type = determineShotType(shot);
            var outcome = determineOutcome(shot);
            var result = determineResult(shot);
            var style = determineShotStyle(shot);
            var player = determinePlayer(shot);
            if (outcome == 'Let') continue;
            var winner = ((player == 0 && outcome == 'Won') || (player == 1 && outcome == 'Lost')) ? 0 : 1;
            addPoint(winner);
            shots.push({ 
               player: player,
               type: type, outcome: outcome, 
               result: result, style: style,
               x1: x1, y1: y1, x2: x2, y2: y2 
            });
         }
      }

      function rectify_sets(player, current, target) {
         console.log('sets change for player:', player);
      }

      function rectify_games(player, target) {
         var match_sets = parsers.umo.sets();
         if (match_sets.length && match_sets[current_set].score()) {
            var current_games_score  = match_sets[current_set].score().games;
         } else {
            var current_games_score  = [0, 0];
         };
         if (target > current_games_score[player]) {
            // console.log('games change for player:', player);
            addPoint(player);
            rectify_games(0, target);
         }
      }

      function rectify_points(player, current, target) {
         console.log('points change for player:', player);
      }

      function determinePlayer(shot) {
         var PLAYER_MASK = 0x20000000;
         return (shot & PLAYER_MASK) ? 1 : 0;
      }

      function backhand(shot) {
         var BACKHAND = 0x10000000;
         return (shot & BACKHAND) ? 1 : 0;
      }

      //CORT AREA
      AREA_LEFT 			 = 0x00000001;
      AREA_CENTER 		 = 0x00000002;
      AREA_RIGHT 			 = 0x00000004;
      AREA_BASE 			 = 0x00000008;
      AREA_VOLLEY 		 = 0x00000010;
      AREA_WIDE 			 = 0x00000020;
      AREA_LONG 			 = 0x00000040;
      AREA_SERV1			 = 0x00000080;
      AREA_SERV2			 = 0x00000100;
      AREA_QUAD			 = 0x00000400;
      AREA_ISLE          = 0x00000800;
      AREA_MASK 	    	 = 0x00000DFF;
      AREA_SIDE2 	    	 = 0x00000200;

      function determineShotType(shot) {
         var SHOT_TYPE_MASK  =  0x00F00000;
         var shot_types = [
            0x00100000, 0x00200000, 0x00300000, 0x00400000, 
            0x00500000, 0x00600000, 0x00700000, 0x00800000
            ];
         var shot_names = [
            "Serve", "Drive", "Volley", "Lob", 
            "Overhead", "Drop Shot", "Passing Shot", "Approach Shot"
            ];
         var type = (shot & SHOT_TYPE_MASK);
         var type_index = shot_types.indexOf(type);
         if (type_index >= 0) return shot_names[type_index];
         return false;
      }

      function determineOutcome(shot) {
         var SHOT_SCORE_MASK = 0x00007000;
         var shot_outcomes = [ 0x00001000, 0x00002000, 0x00003000 ];
         var outcome_names = [ "Lost", "Won", "Let" ];
         var outcome = (shot & SHOT_SCORE_MASK);
         var outcome_index = shot_outcomes.indexOf(outcome);
         if (outcome_index >= 0) return outcome_names[outcome_index];
         return false;
      }

      function determineResult(shot) {
         var SHOT_MODE_MASK = 0x00030000;
         var shot_results = [ 0x00010000, 0x00020000, 0x00030000 ];
         var result_names = [ 'Winner', 'Forced Error', 'Unforced Error' ];
         var result = (shot & SHOT_MODE_MASK);
         var result_index = shot_results.indexOf(result);
         if (result_index >= 0) return result_names[result_index];
         return false;
      }

      function determineShotStyle(shot) {
         var SHOT_STYLES_MASK = 0x0F000000;
         var shot_styles = [ 0x01000000, 0x02000000, 0x03000000, 0x04000000, 0x05000000 ];
         var style_names = [ 'top spin', 'slice', 'flat', 'kick', 'twist' ];
         var style = (shot & SHOT_STYLES_MASK);
         var style_index = shot_styles.indexOf(style);
         if (style_index >= 0) return style_names[style_index];
         return false;
      }

      FORMAT_NO_SCORING       = 0x0000;
      FORMAT_2_OF_3           = 0x0001;
      FORMAT_2_OF_3_8         = 0x0002;
      FORMAT_2_OF_3_10        = 0x0003;
      FORMAT_3_OF_5           = 0x0004;
      FORMAT_8_GAMES          = 0x0005;
      FORMAT_10_GAMES         = 0x0006;
      FORMAT_POINTS_ONLY      = 0x0007;

      FORMAT_SETS_MASK        = 0x00FF;
      FORMAT_NO_AD            = 0x0100;
      
   }

   // Tennis Score Tracker
   var TST = {};
   TST.file_format = 'text';
   parsers.TST = TST;

   TST.parse = function(file_content) {
      resetMeta();

      // strip out offending tags
      file_content = file_content.replace(/<base/i, '<foo'); 
      file_content = file_content.replace(/<meta/i, '<foo'); 
      file_content = file_content.replace(/<body/i, '<foo'); 
      file_content = file_content.replace(/<style/i, '<foo'); 

      d3.select('body').append('div').attr('id', 'parser').style('display', 'none');
      d3.select('#parser').html(file_content);
      var tst_file = document.querySelector('#parser');
      parsers.meta.players = [tst_file.querySelector('#team_one_background').textContent, tst_file.querySelector('#team_two_background').textContent];

      var date = tst_file.querySelector('#date').textContent;
      var match_date = new Date(date.replace('at', ''));
      var year = match_date.getFullYear().toString();
      var day = padToTwo(match_date.getDate()).toString();
      var month = padToTwo(match_date.getMonth() + 1).toString();
      parsers.meta.matchdate = parseDate(year + month + day);

      var nodes = tst_file.querySelector('#container').childNodes;

      // accumulate games scores to analyze match format
      var point_to;
      var point = {};
      var points = [];
      var score = [];
      var tiebreaks = false;
      var advantages = false;
      var last_score = ['0', '0'];
      var parenthetical = /\(([^)]+)\)/;

      var max_game_score = 4;
      var high_game_score;
      var last_games_score = [0, 0];
      for (n=0; n < nodes.length; n++) {
         var element = nodes[n].getAttribute('class');
         if (element == 'event') {
            // first push any accumulated point
            if (point.winner != undefined) { 
               points.push(point); 
               point = {};
            }

            var text_content = nodes[n].querySelector('.event_score').textContent;
            var gs = text_content.split('(')[0].trim().split('-').map(function(m) { return +m; });

            // if a score declined then we found high game score
            if (gs[0] < last_games_score[0] || gs[1] < last_games_score[1]) {
               if (last_games_score[0] > last_games_score[1] + 1) { 
                  high_game_score = last_games_score[0]; 
               } else if (last_games_score[1] > last_games_score[0] + 1) { 
                  high_game_score = last_games_score[1];
               } else {
                  high_game_score = Math.max(last_games_score[0], last_games_score[1]);
               }
            } else if (gs[0] > last_games_score[0] || gs[1] > last_games_score[1]) {
               if (gs[0] > max_game_score) { max_game_score = gs[0]; }
               if (gs[1] > max_game_score) { max_game_score = gs[1]; }
            }
            last_games_score = gs;

            var match_score = parenthetical.exec(text_content)[1];
            if (match_score.indexOf('---') == 0) { match_score = '40-' + match_score.slice(3); }
            if (match_score.indexOf('---') > 0) { match_score = match_score.split('-')[0] + '-40'; }
            if (match_score.indexOf('AD') >= 0) { advantages = true; }
            var score = match_score.split('-');

            if (score[0] == '1' || score[1] == '1') {
               tiebreak = tiebreaks = true;
            }
            if (score[0] == '0' && score[1] == '0') {
               if (last_score[0] == 'AD' || last_score[1] == 'AD') {
                  point_to = (last_score[0] == 'AD') ? 0 : 1;
               } else {
                  point_to = (+last_score[0] > +last_score[1]) ? 0 : 1;
               }
            } else if (last_score[0] == 'AD' || last_score[1] == 'AD') {
               if (last_score[1] == 'AD' && score[1] == '40') {
                  point_to = 0;
               } else if (last_score[0] == 'AD' && score[0] == '40') {
                  point_to = 1;
               }
            } else {
               // otherwise the point is won by the player whose score progressed
               if (last_score[0] != score[0] && last_score[1] == score[1]) {
                  point_to = 0;
               } else if (last_score[1] != score[1] && last_score[0] == score[0]) {
                  point_to = 1;
               }
            }
            last_score = score;
            if (point_to != undefined) {
               point.winner = point_to;
               point_to = undefined;
            }
         }
         /*
         if (element == 'detail') {
            var details = nodes[n].querySelector('.detail_text').childNodes;
            var serve_result = details[0].textContent;
            var serve_type   = details[1].textContent;
            var player       = details[2].textContent;
            var result       = details[3].textContent;
            primatives.push(serve_result, serve_type, player, result);
            console.log(serve_result);
            if (['Ace', 'Result', 'Double Fault', 'Serve In'].indexOf(serve_result) >= 0) {
               intermediates.push(primatives);
               primatives = [];
            }
         }
         */
      }
      if (!high_game_score) { high_game_score = max_game_score; }
      if (point.winner != undefined) { 
         points.push(point); 
         point = {};
      }

      // analyze match format
      parsers.meta.setgames = high_game_score * 2;
      parsers.meta.advantages = advantages;
      updateUMOmeta();

      points.forEach(function(point) { addPoint(point); });
   }

   // Tennis Tracker
   var TTM = {};
   TTM.file_format = 'text';
   parsers.TTM = TTM;

   TTM.parse = function(file_content) {
      resetMeta();
      var first_service;
      var points = [];
      var data = JSON.parse(file_content);
      var outcomes = {
         'WINNER': 'Winner', 'UNFORCED_ERROR': 'Unforced Error',
         'FORCED_ERROR': 'Forced Error', 'ACE': 'Ace', 'DOUBLE': 'Double Fault'
      }
      var shots = {
         'FOREHAND': 'f', 'BACKHAND': 'b', 'VOLLEY_FH': 'v', 'VOLLEY_BH': 'z',
         'SMASH': 'o', 'UNKNOWN': 'q'
      }
      parsers.meta.players = [data.player1, data.player2];
      updateUMOmeta();

      data.sets.forEach(function(s) {
         s.games.forEach(function(g) {
            var server = g.defaultServer == 'PLAYER1' ? 0 : 1;
            g.rallies.forEach(function(r) {
               var p = {};
               if (first_service == undefined) { 
                  first_service = server;
                  parsers.meta.first_service = first_service;
                  parsers.umo.options( {match: {first_service: server}} ); 
               }
               var decider = r.player1action == 'UNKNOWN' ? 1 : 0;
               if (r.player1action == 'UNKNOWN' && r.player2action == 'UNKNOWN') {
                  decider = undefined;
               }
               var result = decider == 0 ? outcomes[r.player1action] : outcomes[r.player2action];
               var shot_type = shots[r.shotType];
               if (r.service == 'SECOND') { 
                  p.first_serve = {
                     error: 'Unknown', 
                     serves: ['0e']
                  }
               }
               if (result == 'Ace') {
                  p.serves = ['0*'];
               } else if (result == 'Double Fault') {
                  p.first_serve = {
                     error: 'Unknown', 
                     serves: ['0e']
                  }
                  p.serves = ['0e'];
               } else {
                  p.serves = ['0'];
               }
               if (result == 'Winner') {
                  p.rally = (server == decider) ? ['q', 'q*'] : ['q*'];
               } else if (result == 'Forced Error') {
                  p.rally = (server == decider) ? ['q', 'q#'] : ['q#'];
               } else if (result == 'Unforced Error') {
                  p.rally = (server == decider) ? ['q', 'q@'] : ['q@'];
               }
               if (p.first_serve) {
                  var serve2 = p.rally ? p.serves.join('') + p.rally.join('') : p.serves.join('');
                  var point = sequences.pointParser([p.first_serve.serves[0], serve2]);
               } else {
                  var serve = p.rally ? p.serves.join('') + p.rally.join('') : p.serves.join('');
                  var point = sequences.pointParser([serve]);
               }
               if (decider != undefined) points.push(point);
            });
         });
      });

      points.forEach(function(point) { addPoint(point); });
   }

   // e-Scorer
   var ESC = {};
   ESC.file_format = 'text';
   parsers.ESC = ESC;

   ESC.parse = function(file_content) {
      resetMeta();
      var points = [];
      var codes = 'O.SRrBbNnd'.split('');
      var first_service;
      var service;

      var game = /GAME\#/i;
      var format = /FORMAT/;
      var noadvantages = /NO\ Advantage/;
      var semiadvantages = /SEMI\ Advantage/;
      var serve = /s\>([\w\s]*)/;
      var results = /[AB]\s([\w\.\s]+)/;
      var p1 = /A\:\s([\w\s]+)/;
      var p2 = /B\:\s([\w\s]+)/;

      var rows = file_content.split("\n").reverse();
      while (rows.length) {
         var row = rows.pop();
         if (game.test(row)) {
            parseGame(rows.pop(), rows.pop(), rows.pop());
         } else if (format.test(row)) {
            parseFormat(rows.pop(), rows.pop())
         }
      }

      parsers.meta.players = [p1.exec(file_content)[1], p2.exec(file_content)[1]];
      if (noadvantages.test(file_content)) parsers.meta.advantages = false;
      if (semiadvantages.test(file_content)) parsers.meta.advantages = true;

      updateUMOmeta();

      points.forEach(function(point) { var result = addPoint(point); });

      function parseFormat(bestof, games_for_set) {
         if (bestof.indexOf('Tie Break') >= 0) {
            parsers.meta.bestof = 1;
            parsers.meta.final_set_tiebreak = true;
            parsers.meta.final_set_tiebreak_only = true; 
            parsers.meta.final_set_tiebreak_to = +bestof.trim().split(' ')[0] || 7;
         } else {
            parsers.meta.bestof = +bestof.trim().split(' ')[0] || 3;
         }
         parsers.meta.setgames = +games_for_set.trim().split(' ')[0] * 2 || 12;
         parsers.meta.tiebreak = games_for_set.indexOf('Tie Break') >= 0 ? true : false;
         if (games_for_set.indexOf('/') > 0) {
            parsers.meta.tiebreak_at = +games_for_set.split('-')[1][0];
         }
      }

      function parseGame(r1, r2, r3) {
         if (serve.test(r1)) {
            service = 0;
            if (first_service == undefined) { 
               first_service = 0;
               parsers.meta.first_service = first_service;
               parsers.umo.options( {match: {first_service: 0, sets: 5}} ); 
            }
            var serve_results = serve.exec(r1);
            var server_results = results.exec(r2);
            var receiver_results = results.exec(r3);
         } else {
            service = 1;
            if (first_service == undefined) { 
               first_service = 1;
               parsers.meta.first_service = first_service;
               parsers.umo.options( {match: {first_service: 1, sets: 5}} ); 
            }
            var serve_results = serve.exec(r3);
            var server_results = results.exec(r2);
            var receiver_results = results.exec(r1);
         }
         serve_results = serve_results ? serve_results[1] : '';
         server_results = server_results ? server_results[1] : '';
         receiver_results = receiver_results ? receiver_results[1] : '';
         var max = Math.max(serve_results.length, server_results.length, receiver_results.length);
         for (var m=0; m < max; m++) {
            if (codes.indexOf(serve_results[m]) >= 0 || codes.indexOf(server_results[m]) >= 0 || codes.indexOf(receiver_results[m]) >= 0) {
               buildPoint(serve_results[m], server_results[m], receiver_results[m]);
            }
         }
      }

      function buildPoint(serve, server, receiver) {
         // O = point won, . = point lost, S = Ace, R = Return Winner, d = Double Fault
         // r = return UFE, B = Baseline Winner, b = baseline UFE, N = Net Winner, n = net UFE
         if (parsers.umo.nextService() != service) {
            var temp = server;
            server = receiver;
            receiver = temp;
         }
         var p = {};
         if (serve == 'f') { 
            p.first_serve = {
               error: 'Unknown', 
               serves: ['0e']
            }
         }
         if (server == 'S' || receiver == 'S') {
            p.serves = ['0*'];
         } else if (server == 'd' || receiver == 'd') {
            p.first_serve = {
               error: 'Unknown', 
               serves: ['0e']
            }
            p.serves = ['0e'];
         } else {
            p.serves = ['0'];
         }
         if (server == 'B') p.rally = ['q', 'q*'];
         if (receiver == 'B') p.rally = ['q', 'q', 'q*'];
         if (server == 'N') p.rally = ['q', 'q-*'];
         if (receiver == 'N') p.rally = ['q', 'q', 'q-*'];
         if (receiver == 'R') p.rally = ['q*'];

         if (server == 'R') {
            // must be a tiebreak
            p.rally = ['q*'];
         }

         if (server == 'b') p.rally = ['q', 'q@'];
         if (receiver == 'b') p.rally = ['q', 'q', 'q@'];
         if (server == 'n') p.rally = ['q', 'q-@'];
         if (receiver == 'n') p.rally = ['q', 'q', 'q-@'];
         if (receiver == 'r') p.rally = ['q@'];

         if (server == 'r') {
            // must be a tiebreak
            p.rally = ['q@'];
         }

         if (server == 'O' && receiver == '.') { p.serves = ['S']; }
         if (server == '.' && receiver == 'O') { p.serves = ['R']; }

         if (p.first_serve) {
            var serve2 = p.rally ? p.serves.join('') + p.rally.join('') : p.serves.join('');
            var point = sequences.pointParser([p.first_serve.serves[0], serve2]);
         } else {
            var serve = p.rally ? p.serves.join('') + p.rally.join('') : p.serves.join('');
            var point = sequences.pointParser([serve]);
         }
         points.push(point);
      }
   }

   // Tennis Stats
   var TSS = {};
   TSS.file_format = 'text';
   parsers.TSS = TSS;

   TSS.parse = function(file_content) {
      resetMeta();
      var points = [];
      var flip_score;
      var first_service;
      var in_tiebreak;

      file_content = file_content.replace(/\*/g, '');
      var rows = file_content.split("\n");
      var best_of = /Best of (\d)/;
      var to_serve = /to serve/;
      var score = /([\d\w]+)-([\d\w]+):/;
      var done = /Done:/;
      var game_over = /has won the game/;
      var tiebreaker = /Tiebreaker/;

      rows.forEach(function(r) {
         var point = {};
         if (r.indexOf('vs.') > 0) { 
            parsers.meta.players = r.split(' vs. '); 
            p1 = new RegExp(parsers.meta.players[0]);
            p2 = new RegExp(parsers.meta.players[1]);
            updateUMOmeta();
         }
         if (best_of.test(r)) { 
            parsers.meta.bestof = best_of.exec(r)[1]; 
            parsers.umo.options({ match: { sets: parsers.meta.bestof || 5 } });
         }
         if (to_serve.test(r)) { 
            if (p1 && p1.test(r)) { 
               flip_score = false;
               if (first_service == undefined) { 
                  first_service = 0;
                  parsers.meta.first_service = first_service;
                  parsers.umo.options( {match: {first_service: 0}} ); 
               }
            }
            if (p2 && p2.test(r)) { 
               flip_score = true;
               if (first_service == undefined) { 
                  first_service = 1;
                  parsers.meta.first_service = first_service;
                  parsers.umo.options( {match: {first_service: 1}} ); 
               }
            }
         } else if (done.test(r)) {
            var decider = p1.test(r) ? 0 : 1;
            point.result = determineOutcome(r);
            point.winner  = (['Winner', 'Serve Winner', 'Ace'].indexOf(point.result) >= 0) ? decider : 1 - decider;
            decoratePoint(point);
         } else if (score.test(r)) {
            var scores = score.exec(r);
            if (scores[1] == 'AD') scores[1] = 'A';
            if (scores[2] == 'AD') scores[2] = 'A';
            point.score = flip_score ? scores[2] + '-' + scores[1] : scores[1] + '-' + scores[2];
            if (in_tiebreak) point.score = point.score.split('-').map(function(m) { return m + 'T'; }).join('-');
            var decider = p1.test(r) ? 0 : 1;
            point.result = determineOutcome(r);
            decoratePoint(point);
         } else if (tiebreaker.test(r)) {
            in_tiebreak = true;
         } else if (game_over.test(r)) {
            in_tiebreak = false;
         }

         function decoratePoint(point) {
            var result = addPoint(point);
            var index = parsers.umo.points().length;

            var code = result.point.winner == result.point.server ? 'S' : 'R';
            var result = parsers.umo.decoratePoint(index - 1, { code: code });
         }
      });

      function determineOutcome(r) {
         var ufe = /an unforced error/;
         var fe = /a forced error/;
         var winner = /a winner/;
         var serve_winner = /a service winner/;
         var ace = /an ace/;
         var double_fault = /a double fault/;
         if (ufe.test(r)) return "Unforced Error";
         if (fe.test(r)) return "Forced Error";
         if (winner.test(r)) return "Winner";
         if (serve_winner.test(r)) return "Serve Winner";
         if (ace.test(r)) return "Ace";
         if (double_fault.test(r)) return "Double Fault";
      }
   }

   var MCP = {};
   MCP.file_format = 'text';
   parsers.MCP = MCP;

   MCP.parse = function(file_content) {
      resetMeta();
      var meta = [];
      var points = [];
      var counter = 0;
      d3.csv.parse(file_content, function(row) {
         if (row['meta']) { meta[counter] = row['meta']; }

         if (row['match_id']) parsers.match_details = row['match_id'];

         if (row['1st']) {
            var p = sequences.pointParser([row['1st'], row['2nd']]);
            points.push(p);
         }
         counter += 1; 
      });

      /*
      if (meta[0]) parsers.meta.players[0] = meta[0];
      if (meta[1]) parsers.meta.players[1] = meta[1];
      if (meta[2]) parsers.meta.p1hand = meta[2];
      if (meta[3]) parsers.meta.p2hand = meta[3];
      if (meta[4]) parsers.meta.category = meta[4];
      if (meta[5]) parsers.meta.matchdate = parseDate(meta[5]);
      if (meta[6]) parsers.meta.tournament = meta[6];
      if (meta[7]) parsers.meta.round = meta[7];
      if (meta[8]) parsers.meta.time = meta[8];
      if (meta[9]) parsers.meta.court = meta[9];
      if (meta[10]) parsers.meta.surface = meta[10];
      if (meta[12]) parsers.meta.umpire = meta[12];
      if (meta[13]) parsers.meta.bestof = meta[13];
      if (meta[14]) parsers.meta.final_set_tiebreak = meta[14];
      if (meta[15]) parsers.meta.charter = meta[15];
      */

      // object destructuring!
      [ parsers.meta.players[0], parsers.meta.players[1], parsers.meta.p1hand,
      parsers.meta.p2hand, parsers.meta.category, parsers.meta.matchdate,
      parsers.meta.tournament, parsers.meta.round, parsers.meta.time,
      parsers.meta.court, parsers.meta.surface, foo, parsers.meta.umpire,
      parsers.meta.bestof, parsers.meta.final_set_tiebreak, parsers.meta.charter ] = meta;

      updateUMOmeta();
      points.forEach(function(point) { addPoint(point); });
   }

   var XLS = {};
   XLS.file_format = 'binary';
   parsers.XLS = XLS;
   parsers.XLSM = XLS;
   parsers.XLSX = XLS;
   XLS.workbook = undefined;

   XLS.parse = function(file_content) {
      resetMeta();
      if (!XLSX || !file_content) return;
      var points = [];
      var workbook = XLSX.read(file_content, {type: 'binary'});

      if (workbook.Sheets.STATS) {
         // process SBA Workbook
         var match = sbaProcess(workbook.Sheets.STATS); 

         parsers.meta.players[0] = match.players[0].name;
         parsers.meta.players[1] = match.players[1].name;

         parsers.meta.matchdate = match.tournament.date;
         parsers.meta.surface = match.tournament.surface ? match.tournament.surface[0] : '';

         updateUMOmeta();

         match.points.forEach(function(point) { addPoint(point.winner); });

         return;

      } else if (workbook.Sheets.MATCH) {
         // process MCP Workbook
         if (workbook.Sheets.MATCH['B1']) { parsers.meta.players[0] = workbook.Sheets.MATCH['B1'].v; }
         if (workbook.Sheets.MATCH['B2']) { parsers.meta.players[1] = workbook.Sheets.MATCH['B2'].v; }
         if (workbook.Sheets.MATCH['B3']) { parsers.meta.p1hand = workbook.Sheets.MATCH['B3'].v; }
         if (workbook.Sheets.MATCH['B4']) { parsers.meta.p2hand = workbook.Sheets.MATCH['B4'].v; }
         if (workbook.Sheets.MATCH['B5']) { parsers.meta.category = workbook.Sheets.MATCH['B5'].v; }
         if (workbook.Sheets.MATCH['B6']) { parsers.meta.matchdate = parseDate(workbook.Sheets.MATCH['B6'].v); }
         if (workbook.Sheets.MATCH['B7']) { parsers.meta.tournament = workbook.Sheets.MATCH['B7'].v; }
         if (workbook.Sheets.MATCH['B8']) { parsers.meta.round = workbook.Sheets.MATCH['B8'].v; }
         if (workbook.Sheets.MATCH['B9']) { parsers.meta.time = workbook.Sheets.MATCH['B9'].v; }
         if (workbook.Sheets.MATCH['B10']) { parsers.meta.court = workbook.Sheets.MATCH['B10'].v; }
         if (workbook.Sheets.MATCH['B11']) { parsers.meta.surface = workbook.Sheets.MATCH['B11'].v; }
         if (workbook.Sheets.MATCH['B12']) { parsers.meta.umpire = workbook.Sheets.MATCH['B12'].v; }
         if (workbook.Sheets.MATCH['B13']) { parsers.meta.bestof = workbook.Sheets.MATCH['B13'].v; }
         if (workbook.Sheets.MATCH['B14']) { parsers.meta.final_set_tiebreak = workbook.Sheets.MATCH['B14'].v; }
         if (workbook.Sheets.MATCH['B15']) { parsers.meta.charter = workbook.Sheets.MATCH['B15'].v; }

         updateUMOmeta();

         for (var i=18; i < 500; i++) { 
            var fs = workbook.Sheets.MATCH['N' + i]; 
            if (fs) {
               var ss = workbook.Sheets.MATCH['O' + i]; 
               var first_serve = fs.v;
               var second_serve = ss ? ss.v : '';
               var p = sequences.pointParser([first_serve, second_serve]);
               points.push(p);
            } else {
               break;
            }
         }
      }
      XLS.workbook = workbook;
      points.forEach(function(point) { addPoint(point); });
   }

   function sbaProcess(point_sheet) {
      var points = parsePoints(point_sheet);

      // debugging
      foo = points;

      var players = parsePlayers(point_sheet);
      var tournament = parseTournament(point_sheet);
      return { players: players, tournament: tournament, points: points }

      function parsePlayers(point_sheet) {
         var players = {};
         var p0 = point_sheet['A7'].v.trim().split('(');
         var p1 = point_sheet['F7'].v.trim().split('(');

         var r0 = p0.length > 1 ? +p0[1].split(')')[0] : '';
         var r1 = p1.length > 1 ? +p1[1].split(')')[0] : '';

         players[0] = { name: normalizeName(p0[0]), rank: r0 };
         players[1] = { name: normalizeName(p1[0]), rank: r1 };

         return players;
      }

      function parseTournament(point_sheet) {
         var tournament = {};
         var name = point_sheet['B5'].v.trim().split(':');
         var date = point_sheet['N4'].v.trim().split(':');
         var surface = point_sheet['N5'].v.trim().split(':');

         tournament.name = name.length > 1 ? name[1].trim(): name;
         tournament.surface = surface.length > 1 ? surface[1].trim(): name;

         var dt = date.length > 1 ? date[1].trim() : date.trim();
         var fdate = dt.substr(6) + '-' + dt.substr(3,2) + '-' + dt.slice(0,2);

         if (isDateCorrect(fdate)) tournament.date = fdate;

         return tournament;
      }

      function parsePoints(point_sheet) {
         var points = [];
         var keys = Object.keys(point_sheet)
         var filter = /^[A-Z]/;
         var number_column = /^Y/;
         var cells = keys.filter(function(f) { return filter.test(f) });
         var rows = cells.filter(function(f) { return number_column.test(f) }).map(function(m) { return m.substring(1) });
         
         rows.forEach(function(row_number) {
            var rowFilter = new RegExp('^[A-Z]' + row_number + '$');
            var columns = cells.filter(function(f) { return rowFilter.test(f) });
            var point = parsePoint(columns);
            points.push(point);
         });
         return points;

         function parsePoint(columns) {
            var point = {};

            columns_keys = { 
               'A': 'first_serve', 'B': 'second_serve', 
               'I': 'second_serve', 'J': 'first_serve', 
               'K': 'progression', 'L': 'rally', 'N': 'set_score',

               'C': 'Winner',          // player 1
               'D': 'Provoked',        // player 1
               'E': 'Error',           // player 2

               'F': 'Error',           // player 1
               'G': 'Provoked',        // player 2
               'H': 'Winner',          // player 2

               'O': 'Return', 
               'P': 'ThirdShot', 
               'Q': 'Rally1st', 
               'R': 'Rally2nd', 
               'S': 'Rally3rd',

               'T': 'Return', 
               'U': 'ThirdShot', 
               'V': 'Rally1st', 
               'W': 'Rally2nd', 
               'X': 'Rally3rd'
            }

            // O / T
            //  -> 1 = Deuce Court, 2 = Ad Court
            //  -> S = Slice
            //  -> Leading 'C' or 'H' = Forehand
            //  -> Leading 'R' or 'G' = Backhand
            //  -> E = Centre (Centre is default)
            //  -> DL = Inside In
            //  -> DC = Inside Out
            //  -> Trailing 'C' is Cross

            // PQRS / UVWX 
            //  -> P = Passing Shot
            //  -> C = Forehand, D = Forehand Inside; R = Backhand
            //  -> L = Line, E = Centre, C = Cross

            var cols = columns.map(function(m) { return m[0] });
            point.server = (cols.indexOf('A') >= 0) ? 0 : 1;

            var code = {};
            code.p0 = {};
            code.p1 = {};
            code.n0 = {};
            code.n1 = {};
            code.c0 = {};
            code.c1 = {};

            columns.forEach(function(column) {
               var elem = columns_keys[column[0]];
               if ('CDF'.split('').indexOf(column[0]) >= 0) {
                  code.p0[elem] = point_sheet[column].v;
                  code.c0 = simplifyOutcomeCode(code.p0[elem], point.server, 0, elem);
                  cl(code.c0);
               } else if ('OPQRS'.split('').indexOf(column[0]) >= 0) {
                  code.n0[elem] = point_sheet[column].v; 
               } else if ('EGH'.split('').indexOf(column[0]) >= 0) {
                  code.p1[elem] = point_sheet[column].v;
                  code.c1 = simplifyOutcomeCode(code.p1[elem], point.server, 1, elem);
                  cl(code.c1);
               } else if ('TUVWX'.split('').indexOf(column[0]) >= 0) {
                  code.n1[elem] = point_sheet[column].v; 
               } else if (elem) {
                  code[elem] = point_sheet[column].v; 
               }
            });

            function cl(obj) {
               var keys = Object.keys(obj);
               var output = '';
               keys.forEach(function(k) {
                  if (obj[k] && obj[k].length) output = output + k + ': ' + obj[k] + ' / ';
               });
               if (output.length) console.log(output);
            }

            // convert rally to an array
            if (code.rally) { code.rally = new Array(code.rally); }

            sw = code.c0.sw || code.c1.sw;
            if (sw) console.log('SERVE WINNER');
            ace = code.c0.ace || code.c1.ace;
            if (ace) console.log('ACE');
            df = code.c0.df || code.c1.df;
            if (df) console.log('DOUBLE FAULT');

            // Service Notations:  Power, Touch, Accuracy, Nice
            var sn = [];
            var serve_attributes = [];
            if (code.c0.serve_attributes) code.c0.serve_attributes.forEach(function(e) { serve_attributes.push(e); });
            if (code.c1.serve_attributes) code.c1.serve_attributes.forEach(function(e) { serve_attributes.push(e); });
            serve_attributes.forEach(function(e) {
               if (e == 'Power') sn.push('p');
               if (e == 'Accuracy') sn.push('a');
               if (e == 'Touch') sn.push('t');
               if (e == 'Nice') sn.push('n');
            });

            code.first_serve = convertServe(code.first_serve);
            code.second_serve = convertServe(code.second_serve);
            if (code.second_serve) {
               code.first_serve = code.first_serve + 'e';
               if (ace) code.second_serve = code.second_serve + '*';
               if (sw)  code.second_serve = code.second_serve + '#';
               if (df)  code.second_serve = code.second_serve + 'e';
               code.second_serve += sn;
            } else {
               if (ace) code.first_serve = code.first_serve + '*';
               if (sw)  code.first_serve = code.first_serve + '#';
               code.first_serve += sn;
            }

            function convertServe(serve) {
               if (!serve) return;
               var wide_serves = [1, 6];
               var body_serves = [2, 5];
               var t_serves = [3, 4];
               var serve = (serve + '').replace(/\D/g, '').substr(-1);

               if ([1, 2, 3].indexOf(+serve) >= 0) {
                  code.service_court = 'deuce';
               } else {
                  code.service_court = 'ad';
               }
               if (wide_serves.indexOf(+serve) >= 0) {
                  serve = 4; 
               } else if (body_serves.indexOf(+serve) >= 0) {
                  serve = 5;
               } else if (t_serves.indexOf(+serve) >= 0) {
                  serve = 6;
               } else {
                  serve = 0;
               }
               return serve;
            }

            // Determine Point Winner
            var s0 = [code.p0.Provoked, code.p0.Winner].filter(function(f) { return f; }).join(',');
            var s1 = [code.p1.Provoked, code.p1.Winner].filter(function(f) { return f; }).join(',');

            if (s0.length || s1.length) {
               point.winner = s0.length ? 0 : 1;
            } else if (code.p0.Error && code.p1.Error) {
               point.winner = (code.p0.Error.indexOf('V') >= 0) ? 0 : 1;
            } else if (code.p0.Error || code.p1.Error) {
               point.winner = code.p0.Error ? 1 : 0
            } else {
               console.log('ERROR: Winner cannot be determined', code);
            }
         
            function simplifyOutcomeCode(icode, server, player, outcome) {
               icode = icode + '';
               var ocode = icode;
               var hand;
               var type;
               var rally_range;
               var rally_ranges = { '2': '3-4', '3': '5-8', '4': '>8' };
               var down_the_line;
               var trajectory = [];
               var shot_attributes = [];
               var serve_attributes = [];

               // first test for Serve and Volley
               // indicates a net approach on the 3rd shot of the rally
               var svtest = /SV/;
               var serve_volley = (svtest.test(ocode));

               var leadingS = /^S/;    // redundant; remove so that other parsing works
               ocode = ocode.replace(leadingS, '');

               var trailingT2 = /^T2/;
               if (trailingT2.test(ocode)) {
                  ocode = ocode.replace(trailingT2, '');
                  serve_attributes.push('Twice');  // redundant because obvious in Point Progression
               }

               // now trim off Rally related information
               var rallyRange = /[DVSRN](\d)$/;
               if (rallyRange.test(ocode)) {
                  var rally_range = rally_ranges[rallyRange.exec(ocode)[1]];
                  ocode = ocode.replace(rallyRange, '');
               }

               // Service Winners
               var sa = /^\d[VPTMD]/;
               var sw = ( server == player && 
                          ['Provoked', 'Winner'].indexOf(outcome) >= 0 && 
                          sa.test(ocode)
                        );

               if (sa.test(ocode)) {
                  if (ocode[1] == 'V') { serve_attributes.push('Accuracy'); }
                  if (ocode[1] == 'P') { serve_attributes.push('Power'); }
                  if (ocode[1] == 'T') { serve_attributes.push('Touch'); }
                  if (ocode[1] == 'M') { serve_attributes.push('Nice'); }
                  if (ocode[1] == 'D') { serve_attributes.push('Twice'); }
                  ocode = '';
               }

               // ACES
               var numstart = /^\d/;
               var ace = ( !sw && server == player && 
                           ['Provoked', 'Winner'].indexOf(outcome) >= 0 && 
                           (numstart.test(ocode) || ocode[0] == 'A')
                         );

               // Double Faults
               var numonly = /^\d$/;
               var df = ( server == player && outcome == 'Error' && numonly.test(ocode));

               // Now trim all serve related information
               var leadingDigits = /^\d+/;
               if (leadingDigits.test(ocode)) {
                  rally_range = 3; // 1-2 punch is always won on third shot of rally
                  var ocode = ocode.replace(leadingDigits, '');
               }

               var trailingDigits = /(\d+)$/;
               ocode = ocode.replace(trailingDigits, '');

               // convert old codes to new codes
               var rrv = /RRV/;
               var rcd = /RCD/;
               ocode = ocode.replace(rrv, 'G');
               ocode = ocode.replace(rcd, 'H');

               if (['V', 'VS', 'VR'].indexOf(ocode) >= 0) {
                  shot_attributes.push('approach');
                  ocode = ''; // no more information
               } else if (ocode[0] == 'V') {
                  type = 'volley';
                  ocode = ocode.substr(1); // now remove leading 'V' so rest of parsing works
               }

               // test for approach and remove trailing V
               var trailingV = /V$/;
               if (trailingV.test(ocode)) {
                  shot_attributes.push('approach');
                  ocode = ocode.replace(trailingV, '');
               }

               // again check for rally range
               var rallyRange = /[DVSRN](\d)$/;
               if (rallyRange.test(ocode)) {
                  var rally_range = rally_ranges[rallyRange.exec(ocode)[1]];
                  ocode = ocode.replace(rallyRange, '');
               }

               // E indicates approach shots, except in some cases = center
               var trailingE = /E$/;
               if (trailingE.test(ocode)) {
                  if (['RE', 'DE', 'CE', 'RPE', 'CPE'].indexOf(ocode) < 0) {
                     shot_attributes.push('approach');
                  } else {
                     trajectory.push('center');
                  }
                  ocode = ocode.replace(trailingE, '');
               }

               // identify down the line; all 'L' except for 'TL'
               if (ocode.indexOf('L') >= 0 && ocode.indexOf('TL') < 0) {
                  trajectory.push('down the line');
                  down_the_line = true;
               }

               // identify 'toudh'; all 'T' except for 'TL'
               if (ocode.indexOf('TL') >= 0) { 
                  type = 'lob'; 
               } else if (ocode.indexOf('T') >= 0) {
                  shot_attributes.push('touch');
               }

               if (ocode == 'DL') {
                  trajectory.push('inside in');
                  ocode = 'C';
               }

               if (ocode.substr(1).indexOf('D') >= 0 || ocode == 'DC') {
                  trajectory.push('inside out');
                  if (ocode == 'DC') ocode = 'D';
               }

               var sb1 = /CCC/;
               var sb2 = /CCL/;
               if (sb1.test(ocode) || sb2.test(ocode)) {
                  shot_attributes.push('short ball');
                  ocode = ocode.replace(sb1, 'CC');
                  ocode = ocode.replace(sb2, 'CL');
               }

               if (ocode.substr(1).indexOf('C') >=0 && !down_the_line) {
                  trajectory.push('cross court');
               }

               if (['VRP', 'VCP'].indexOf(ocode) >= 0) { type = 'drive volley'; }

               if (ocode.indexOf('A') >= 0) { type = 'drop'; }

               if (ocode == 'SM') {
                  hand = 'forehand';
                  type = 'smash';
               }

               var halfVolley = /D$/;
               if (halfVolley.test(ocode)) type = 'half-volley';

               // some coups joue start with P
               var leadingP = /^P/;
               if (leadingP.test(ocode)) {
                  shot_attributes.push('passing');
                  ocode.replace(leadingP, '');
               }

               var returnHand = /^[GH]/;
               var shotHand = /^[CDR]/;
               var internalP = /P/;
               if (internalP.test(ocode)) {
                  if (shotHand.test(ocode)) {
                     shot_attributes.push('passing');
                  } else if (returnHand.test(ocode)) {
                     trajectory.push('inside in');
                  }
               }

               var forehands = /^[HCD]/;
               var backhands = /^[GR]/;
               if (forehands.test(ocode)) {
                  hand = 'forehand';
               } else if (backhands.test(ocode)) {
                  hand = 'backhand';
               }

               var shot_code = ocode.length || shot_attributes.length ? shotCode(hand, type) : '';

               console.log('----------------');
               console.log(icode, ocode);
               return {
                  shot_code: shot_code, 
                  serve_volley: serve_volley,
                  serve_attributes: serve_attributes,
                  shot_attributes: shot_attributes,
                  trajectory: trajectory,
                  rally_range: rally_range, 
                  ace: ace, 
                  sw: sw, 
                  df: df 
               };
            }

            function shotCode(hand, type) {
               if (hand == 'backhand') {
                  if (type == 'volley') return 'z';
                  if (type == 'half-volley') return 'i';
                  if (type == 'smash') return 'p'; // never happens in SBA
                  if (type == 'lob') return 'm';
                  if (type == 'drive volley') return 'k';
                  if (type == 'drop') return 'y';
                  return 'b';
               } else {
                  if (type == 'volley') return 'v';
                  if (type == 'half-volley') return 'h';
                  if (type == 'smash') return 'o';
                  if (type == 'lob') return 'l';
                  if (type == 'drive volley') return 'j';
                  if (type == 'drop') return 'u';
                  return hand ? 'f' : 'q';
               }
            }
            
            point.code = code;
            return point;
         }
      }

   }

   // this function is probably outdated and doesn't yet use the UMO metadata
   XLS.populate = function(points) {
      if (!XLSX || !XLS.workbook) return;
      // push points and metadata into spreadsheet
      var worksheet = XLS.workbook.Sheets.MATCH;
      var empty_cell = { v: '', t: 's' };
      worksheet['B1'] = (parsers.meta.players[0]) ? { v: parsers.meta.players[0], t: 's' } : empty_cell;
      worksheet['B2'] = (parsers.meta.players[1]) ? { v: parsers.meta.players[1], t: 's' } : empty_cell;
      worksheet['B3'] = (parsers.meta.p1hand) ? { v: parsers.meta.p1hand, t: 's' } : empty_cell;
      worksheet['B4'] = (parsers.meta.p2hand) ? { v: parsers.meta.p2hand, t: 's' } : empty_cell;
      worksheet['B5'] = (parsers.meta.category) ? { v: parsers.meta.category, t: 's' } : empty_cell;
      worksheet['B6'] = (parsers.meta.matchdate) ? 
                        { 
                           v: parsers.prepareDate ? parsers.prepareDate(parsers.meta.matchdate) : '', 
                           t: 's' 
                        } :
                        empty_cell;
      worksheet['B7'] = (parsers.meta.tournament) ? { v: parsers.meta.tournament, t: 's' } : empty_cell;
      worksheet['B8'] = (parsers.meta.round) ? { v: parsers.meta.round, t: 's' } : empty_cell;
      worksheet['B9'] = (parsers.meta.time) ? { v: parsers.meta.time, t: 's' } : empty_cell;
      worksheet['B10'] = (parsers.meta.court) ? { v: parsers.meta.court, t: 's' } : empty_cell;
      worksheet['B11'] = (parsers.meta.surface) ? { v: parsers.meta.surface, t: 's' } : empty_cell;
      worksheet['B12'] = (parsers.meta.umpire) ? { v: parsers.meta.umpire, t: 's' } : empty_cell;
      worksheet['B13'] = (parsers.meta.bestof) ? { v: parsers.meta.bestof, t: 's' } : empty_cell;
      worksheet['B14'] = (parsers.meta.final_set_tiebreak) ? { v: parsers.meta.final_set_tiebreak, t: 's' } : empty_cell;
      worksheet['B15'] = (parsers.meta.charter) ? { v: parsers.meta.charter, t: 's' } : empty_cell;

      points.forEach(function(point, i) {
         if (worksheet['M' + (18 + i)]) worksheet['M' + (18 + i)].f = 'IF(A80="","",IF(K80=1,I$1,I$2))';
         worksheet['N' + (18 + i)] = { t: 's', v: point[0] };
         worksheet['O' + (18 + i)] = { t: 's', v: point[1] };
      });
   }

   XLS.save = function(fileNameToSaveAs) {
      if (!XLSX || !XLS.workbook) return;
      var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
      var wbout = XLSX.write(XLS.workbook,wopts);
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
      fileNameToSaveAs = fileNameToSaveAs ? fileNameToSaveAs + 'MCP.xlsx' : 'match_export.xlsx';
      var worksheetAsBlob = new Blob([s2ab(wbout)],{type:""});
      var downloadLink = document.createElement("a");
      downloadLink.download = fileNameToSaveAs;
      downloadLink.innerHTML = "Download File";
      if (window.URL != null) { 
         downloadLink.href = window.URL.createObjectURL(worksheetAsBlob); 
      } else {
         downloadLink.href = window.URL.createObjectURL(worksheetAsBlob);
         downloadLink.onclick = destroyClickedElement;
         downloadLink.style.display = "none";
         document.body.appendChild(downloadLink);
      }
      downloadLink.click();
   }

   /* CourtHive parsing */
   var CH = {};
   CH.file_format = 'text';
   parsers.CH = CH;

   CH.parse = function(file_content) {
      resetMeta();
      var data = JSON.parse(file_content);
      console.log(data);
      parsers.meta.players = [data.players[0].name, data.players[1].name];
      parsers.meta.first_service = data.first_service;
      parsers.meta.advantages = data.format.code.indexOf('n') > 0 ? false : true;
      updateUMOmeta();
      /*
      // DOESN'T WORK.  OLD UMO DOESN'T RETAIN ATTRIBUTES.
      data.points.forEach(function(point) { 
         point.code = point.code.toUpperCase(); 
         addPoint(point);
      });
      */
      console.log('boo');
      data.points.forEach(function(point) { addPoint(point.code.toUpperCase()); });
      // data.points.forEach(function(point) { addPoint(point.winner); });
   }

   /* END CourtHive parsing */

   var PTF = {};
   PTF.file_format = 'text';
   parsers.PTF = PTF;

   PTF.parse = function(file_content) {
      resetMeta();
      var points = [];
      var point = initializePoint();

      var cases = {
         "Header":          parseHeader,
         "Server":          parseServer,
         "Match Details":   parseMatchDetails,
         "Format":          parseFormat,
         "Start Time":      parseTime,
         "Shot":            parseShot,
         "Point":           parsePoint,
         "Match":           completeParsing,
      }

      d3.csv.parseRows(file_content, function(row, i) {
         if (typeof cases[row[0]] == 'function') cases[row[0]](row, i);
      });

      points.forEach(function(point) { var result = addPoint(point); });

      // supporting functions
      function parseHeader(row) { parsers.meta.charter = row[6]; };
      function parseServer(row) { 
         parsers.meta.first_service = row[1] == 'T' ? 0 : 1; 
      };
      function parseTime(row) { parsers.meta.start_time = row[1]; };
      function parseMatchDetails(row) {
         parsers.meta.players[0] = row[1];  // server side remove diacritics
         parsers.meta.players[1] = row[2];  // server side remove diacritics
         parsers.meta.matchdate = formatDate(new Date(row[3]));
         var tournament_name = row[4]; // server side remove diacritics
         parsers.meta.tournament = tournament_name ? tournament_name : 'undefined';
         parsers.meta.surface = row[5];
         parsers.meta.round   = row[7];
         parsers.meta.in_out  = row[6];
      };

      function parseFormat(line) {
         parsers.meta.bestof = +line[1];
         parsers.meta.setgames = +line[2] * 2;

         // current format (mid-2016)
         if (line.length == 7) {
            parsers.meta.advantages = line[5] == 'Ad' ? true : false;
            parsers.meta.lets = line[6] == 'Let' ? true : false;
            parsers.meta.tiebreak = line[3].indexOf('First') >= 0 ? false : true;
            parsers.meta.tiebreak_at = line[3].indexOf('Tiebreak at') >= 0 ? +line[3].split('-')[2] : parsers.meta.setgames / 2;
            parsers.meta.tiebreak_to = +line[3].split('-')[0];
            parsers.meta.final_settiebreak = line[4].indexOf('First') >= 0 ? false : true;
            parsers.meta.final_set_tiebreak_at = line[4].indexOf('Tiebreak at') >= 0 ? +line[4].split('-')[2] : parsers.meta.setgames / 2;
            parsers.meta.final_set_tiebreak_to = +line[4].split('-')[0];
            parsers.meta.final_set_tiebreak_only = line[4].indexOf('Only') > 0 ? true : false;

         } else if (line.length == 6) {
            // this may have been an old format
            console.log('Old Format');
            parsers.meta.advantages = line[4] == 'Ad' ? true : false;
            parsers.meta.setgames = +line[5] * 2;

            if (line[3].indexOf('Point Tie-Break Only') >= 0) {
               parsers.meta.tiebreak_to = 7;
               parsers.meta.final_set_tiebreak_to = 10;
               parsers.meta.final_set_tiebreak_only = true;
            }

         } else if (line.length == 5) {
            parsers.meta.advantages = line[4] == 'Ad' ? true : false;
            parsers.meta.tiebreak_to = 7;
            parsers.meta.final_set_tiebreak_to = 10;
            parsers.meta.final_set_tiebreak_only = true;
         }
      };

      function parseShot(row) {
         var shot_string = '';
         var player = row[1];
         point.last_shot = player == 'T' ? 0 : 1;

         var shot = {};
         shot.stroke = row[2];
         shot.stroke_type = row[3];
         shot.x1 = row[4];
         shot.y1 = row[5];
         shot.name = shot.result;
         shot.x2 = row[7];
         shot.y2 = row[8];
         shot.path = getPath(shot.x1, shot.y1, shot.x2, shot.y2)
         shot.trajectory = shot.path.trajectory
         shot.end_point = shot.path.mark.location
         shot.time = row[10];
         shot.placement = servePlacement(shot);

         shot.result = row[6];
         point.shots.push(shot);
         point.result = shot.result;

         if (['Passing Shot', 'Net Cord'].indexOf(shot.result) >= 0) { 
            point.result = 'Winner';
            point.terminator = ';*'; 
         }
         if (['Ace', 'Winner'].indexOf(shot.result) >= 0) { point.terminator = '*'; }
         if (['Serve Winner'].indexOf(shot.result) >= 0) { 
            point.terminator = '#'; 
            point.result = 'Winner';
         }
         if (shot.stroke_type == 'Second Serve') point.serve = 2;
         if (["Out", "Out Off-Net", "Out Passing Shot"].indexOf(shot.result) >= 0) {
            point.result = "Unforced Error";
            point.terminator = '@';
            if (shot.end_point == "Long") { 
               shot.error = 'd'; 
            } else {
               shot.error = 'w'; 
            }
         }
         if (shot.end_point == "Net") {
            point.result = 'Unforced Error';
            point.terminator = '@';
            shot.error = 'n';
         }

         if (shot.stroke == 'Missed'){
            point.server = player == 'T' ? 0 : 1;
         } else if (shot.stroke.indexOf('Serve') >= 0) {
            var serve_directions = { 'Wide': 4, 'Body': 5, 'T': 6, 'O': 0 };
            point.server = player == 'T' ? 0 : 1;
            shot_string += serve_directions[shot.placement];
            if (shot.stroke_type.indexOf('Second') >= 0) {
               point.first_serve = {
                  error: 'Unknown',       // this needs to be resolved to English
                  serves: shot_string ? [shot_string + (shot.error || 'e')] : ['0e']
               }
               if (shot.error) point.result = "Double Fault";
            }
            point.serves = [shot_string];
         } else if (shot.stroke.indexOf('Return') >= 0) {
            shot_string += 'q';
            if (shot.error) shot_string += shot.error;
            if (point.rally) { point.rally.push(shot_string); } else { point.rally = [shot_string]; };

            if (shot.result == 'Forcing Error') { 
               point.result = 'Forced Error';
               if (point.rally) { point.rally.push('q#'); } else { point.rally = ['q#']; };
            }

         } else {
            // ugh.  needs to determin 1, 2, 3 based on previous position.  
            var shot_directions = { 'Crosscourt': 4, 'Short Angle': 5, 'Center': 2, 'Line': 3 };
            if (shot.stroke == 'Forehand') {
               if (shot.stroke_type == 'Drive') shot_string += 'f';
               if (shot.stroke_type == 'Drop Shot') shot_string += 'u';
               if (shot.stroke_type == 'Volley') shot_string += 'v';
               if (shot.stroke_type == 'Slice') shot_string += 'r';
               if (shot.stroke_type == 'Overhead') shot_string += 'o';
               if (shot.stroke_type == 'Lob') shot_string += 'l';
               if (shot.stroke_type == 'Other') shot_string += 'q';
            } else if (shot.stroke == 'Backhand') {
               if (shot.stroke_type == 'Drive') shot_string += 'b';
               if (shot.stroke_type == 'Drop Shot') shot_string += 'y';
               if (shot.stroke_type == 'Volley') shot_string += 'z';
               if (shot.stroke_type == 'Slice') shot_string += 's';
               if (shot.stroke_type == 'Overhead') shot_string += 'p';
               if (shot.stroke_type == 'Lob') shot_string += 'm';
               if (shot.stroke_type == 'Other') shot_string += 'q';
            }

            if (shot.error) shot_string += shot.error;

            if (point.rally) { point.rally.push(shot_string); } else { point.rally = [shot_string]; };
            if (shot.result == 'Forcing Error') { 
               point.result = 'Forced Error';
               if (point.rally) { point.rally.push('#'); } else { point.rally = ['q#']; };
            }
         }

         function servePlacement(shot) {
            var service_locations = {
               'Near Deuce': {'court': 'Near Court', 'x': [120, 180], 'placements': {'Wide': [45, 65], 'Body': [65, 78], 'T': [78, 90], 'O': [90, 180]}},
               'Near Ad': {'court': 'Near Court', 'x': [60, 120], 'placements': {'Wide': [115, 135], 'Body': [102, 115], 'T': [90, 102], 'O': [45, 90]}},
               'Far Deuce': {'court': 'Far Court', 'x': [60, 120], 'placements': {'Wide': [115, 135], 'Body': [102, 115], 'T': [90, 102], 'O': [45, 90]}},
               'Far Ad': {'court': 'Far Court', 'x': [120, 180], 'placements': {'Wide': [45, 65], 'Body': [65, 78], 'T': [78, 90], 'O': [90, 180]}}
            };

            var location_keys = Object.keys(service_locations);
            for (var k=0; k < location_keys.length; k++) {
               var service_location = service_locations[location_keys[k]];
               if (service_location['court'] == shot.path.impact.court && service_location['x'][0] < shot.path.impact.x && shot.path.impact.x < service_location['x'][1]) {
                  var placement_keys = Object.keys(service_location['placements']);
                  for (var p=0; p < placement_keys.length; p++) {
                     var angles = service_location['placements'][placement_keys[p]];
                     if (angles[0] < Math.abs(shot.path.angle) && Math.abs(shot.path.angle) < angles[1]) {
                        return placement_keys[p];
                     }
                  }
               }
            }
         }

         function getPath(x1, y1, x2, y2) {
            var singles_min_x = 37;
            var singles_max_x = 203;
            var centerline_x = 120;
            var out_long_far_y = 16;
            var out_long_near_y = 304;
            var service_line_near_y = 90;
            var service_line_far_y = 230;
            var baseline_zone_far_y = out_long_far_y + 20;
            var baseline_zone_near_y = out_long_near_y - 20;
            var no_mans_zone_far_y = baseline_zone_far_y + 30;
            var no_mans_zone_near_y = baseline_zone_near_y - 30;

            var boundaries = {
                  centerline: 120, net: 160,
                  singles: { width: { min: 37, max: 203 }},
                  doubles: { width: { min: 18, max: 230 }},
                  baseline: { far: 16, near: 304 },
                  serviceline: { far: 90, near: 230 }
            }
            var constants = {
               "singles_competitors" : ['T', 'O'], "doubles_competitors" : ['T1', 'T2', 'O1', 'O2'],
               "centerline_x" : centerline_x, "net_y" : 160,
               "doubles_wide_x" : [18, 230],
                "singles_wide_x" : [singles_min_x, singles_max_x],
                "out_long_y" : [out_long_far_y, out_long_near_y],
                "service_line_y" : [service_line_near_y, service_line_far_y],
                "svc_left_x" : [singles_min_x, centerline_x + 3], "svc_right_x" : [centerline_x - 3, singles_max_x],
                "approach_y" : [service_line_near_y, service_line_far_y],
                "baseline_zone_y" : [baseline_zone_far_y, baseline_zone_near_y],
                "no_mans_zone_y" : [no_mans_zone_far_y, no_mans_zone_near_y]
            }

            Math.degrees = function(rad) { return rad*(180 / Math.PI); }
            Math.radians = function(deg) { return deg * (Math.PI / 180); }
            var self = { "impact": defineCoordinate(x1, y1, 'impact'), "mark": defineCoordinate(x2, y2, 'mark') }
            self.trajectory = ""; 
            if (!(self.impact.x || self.impact.y || self.mark.x || self.mark.y)) { return self; }

            if ((self.impact.x <= constants.centerline_x && self.mark.x > constants.centerline_x)
               || (self.impact.x > constants.centerline_x && self.mark.x <= constants.centerline_x)) {
                if (self.mark.y > constants.service_line_near_y && self.mark.y < constants.service_line_far_y) {
                    self.trajectory = "Short Angle"
                }
                else { self.trajectory = "Cross Court" }
               } 
            else if (self.mark.x > constants.centerline_x - 40 && self.mark.x < constants.centerline_x + 40) {
                self.trajectory = "Center"
            } else { self.trajectory = "Line" }

            delta_x = self.impact.x - self.mark.x;
            delta_y = self.impact.y - self.mark.y;
            self.angle = Math.degrees(Math.atan2(delta_y, delta_x))
            self.distance = Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2))

            return self;

            function defineCoordinate(x, y, c_type) {
               var self = { "x": x, "y": y }

               self.court = (y == constants.net_y) ? "Net" : (y < constants.net_y ? "Far Court" : "Near Court");
               self.in_doubles = (between(constants.doubles_wide_x, x) && between(constants.out_long_y, y) && !(y == constants.net_y)) ? 1 : 0;
               self.in_singles = (between(constants.singles_wide_x, x) && between(constants.out_long_y, y) && !(y == constants.net_y)) ? 1 : 0;
               self.volley_zone = (between(constants.service_line_y, y) && !(self.court == "Net")) ? 1 : 0;
               self.right_service_box = (between(constants.service_line_y, y) && 
                                               ((between(constants.svc_left_x, x) && self.court == "Far Court") ||
                                                (between(constants.svc_right_x, x) && self.court == "Near Court"))) ? 1 : 0;
               self.left_service_box = (between(constants.service_line_y, y) && 
                                              ((between(constants.svc_right_x, x) && self.court == "Far Court") ||
                                               (between(constants.svc_left_x, x) && self.court == "Near Court"))) ? 1 : 0;
               self.service_boxes = (self.left_service_box || self.right_service_box) ? 1 : 0;
               self.service_line = (between(constants.no_mans_zone_y, y) && !self.service_boxes && self.court !== "Net") ? 1 : 0;
               self.no_mans_land = (between(constants.baseline_zone_y, y) && !(self.service_boxes || self.service_line) && self.court !== "Net") ? 1 : 0;
               self.baseline = (between(constants.out_long_y, y) && !(self.service_boxes || self.service_line || self.no_mans_land) && self.court !== "Net") ? 1 : 0;
               self.doubles_alley = (self.in_doubles && !self.in_singles) ? 1 : 0;
               self.location = self.left_service_box ? "Ad Service Box" :
                                (self.right_service_box ? "Deuce Service Box" :
                                 (self.service_line ? "Service Line" :
                                  (self.volley_zone ? "Volley Zone" :
                                   (self.no_mans_land ? "No Mans" :
                                    (self.baseline ? "Baseline" :
                                     (self.court == "Net" ? "Net" :
                                      (c_type == "mark" ? "Long" : "Defensive")))))))

               return self

               function between(coordinate_pair, z) { return (z >= coordinate_pair[0] && z <= coordinate_pair[1]) ? 1 : 0 }
            }
         }
      };

      function parsePoint(row, i) {
         var rally_length = +row[5];
         point.winner = row[1] == 'T' ? 0 : 1;

         if ((point.server != point.last_shot && rally_length % 2) || 
             (point.server == point.last_shot && !(rally_length % 2))) {
            rally_length += 1;
         }

         var add_rally_shots = rally_length - (point.rally.length + 1);
         if (add_rally_shots > 0) {
            point.rally = new Array(add_rally_shots).fill('q').concat(point.rally);
         }

         if (point.rally.length == 0 && point.serves.length == 0) {
            point.serves = (point.server == point.winner) ? ['S'] : ['R'];
         }

         if (point.terminator) {
            if (point.rally.length) {
               point.rally[point.rally.length - 1] += point.terminator;
            } else if (point.serves.length) {
               point.serves[point.serves.length - 1] += point.terminator;
            }
         }

         postProcessShots();
         point.code = genPointCode(point);
         points.push(point);
         point = initializePoint();
      };

      function initializePoint() { return { serve: 1, serves: [], rally: [], shots: [] }; }
      function completeParsing() { updateUMOmeta(); };

      // add shot coordinates to serves and rallies
      function postProcessShots() {
         var first_serves = [];
         var second_serves = [];
         var rally_shots = [];
         point.shots.forEach(function(e) {
            if (e.stroke != 'Serve' && e.stroke != 'Missed') {
               rally_shots.push(e);
            } else if (e.stroke_type == 'First Serve') {
               first_serves.push(e);
            } else {
               second_serves.push(e);
            }
         });
         if (rally_shots.length) {
            var s = rally_shots[0];
            point.rally[0] += genCoords(s);
         }
         if (rally_shots.length == 2) {
            var s = rally_shots[1];
            var l = point.rally.length - 1;
            point.rally[l] += genCoords(s);;
         }
         if (first_serves.length) {
            // ignoring lets for the moment
            // var s = first_serves.last();
            var s = lastElement(first_serves);
            // need to know whether there is a second serve to know where to put the first
            if (second_serves.length) {
               var l = point.first_serve.serves.length - 1;
               point.first_serve.serves[l] += genCoords(s);
            } else {
               var l = point.serves.length - 1;
               point.serves[l] += genCoords(s);
            }
         }
         if (second_serves.length) {
            // ignoring lets for the moment
            // var s = second_serves.last();
            var s = lastElement(second_serves);
            var l = point.serves.length - 1;
            point.serves[l] += genCoords(s);
         }

         function genCoords(shot) {
            return (s.x1 && s.x2 && s.y1 && s.y2) ? '(' + [s.x1, s.y1, s.x2, s.y2].join(',') + ')' : '';
         }
      }

      function genPointCode(p) {
         var code = p.first_serve ? p.first_serve.serves.join('') + '|' : '';
         code += p.serves.join('');
         code += p.rally.join('');
         return code;
      }
   }

   function padToTwo(number) {
     if (number<=9) { number = ("0"+number).slice(-2); }
     return number;
   }

   function padTo30(number) {
     return ("0000000000000000000"+number).slice(-30); 
   }

   var parseXML;

   if (typeof window.DOMParser != "undefined") {
       parseXML = function(xmlStr) {
           return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
       };
   } else if (typeof window.ActiveXObject != "undefined" &&
          new window.ActiveXObject("Microsoft.XMLDOM")) {
       parseXML = function(xmlStr) {
           var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
           xmlDoc.async = "false";
           xmlDoc.loadXML(xmlStr);
           return xmlDoc;
       };
   } else {
       throw new Error("No XML parser found");
   }

   var particles = ['del', 'de', 'di', 'du', 'van', 'von', 'ten']; 
   function parseName(name) {

      if (!name.trim()) { return; }             // empty
      name = name.replace(/\s+/g,' ').trim();   // remove extra whitespace
      var name = normalizeName(name);

      var s_name = name.split(' ');
      var fi = s_name[0][0];
      var fname = s_name[0].split('.')[0];      // insure first name is not initial + '.'

      if (s_name.length > 2 && particles.indexOf(s_name[s_name.length - 2].toLowerCase()) >= 0) {
         s_name[s_name.length - 2] = s_name[s_name.length - 2].toLowerCase();
         var lname = s_name[s_name.length - 2] + ' ' + s_name[s_name.length - 1];
      } else {
         var lname = s_name[s_name.length - 1];
      }
      return { name: s_name.join(' '), fname: fname, lname: lname, fi: fi }

   }

   function normalizeName(name) {
      //  add handling of 'd
      if (!name) { return; }
      // name = removeDiacritics(name.trim());  // ONLY IN SERVER ENVIRONMENT
      var nNames = name.trim().split(' ')
         .map(function(m) { return m.toLowerCase() })
         .map(function(m) { return m[0].toUpperCase() + m.substr(1) });

      // particles cannoot appear first or last
      var nName = nNames.map(function(m, i) { 
         if (i == 0 || i == nNames.length - 1 || particles.indexOf(m) < 0) m = m[0].toUpperCase() + m.slice(1); 
         return m; 
      }).join(' ');

      return nName;
   }

   function zeroPad(date_string) {
      var dt = date_string.split('-');
      return dt[0] + '-' + (dt[1][1]?dt[1]:"0"+dt[1][0]) + '-' + (dt[2][1]?dt[2]:"0"+dt[2][0]);
   }

   function yyyymmdd(date) {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
      var dd  = date.getDate().toString();
      return zeroPad([yyyy, mm, dd].join('-'));
   };

   function isDateCorrect(in_string) {
      if (!matchesDatePattern(in_string)) return false;
      in_string = zeroPad(in_string);
      try {
         var idate = new Date(in_string);
         var out_string = yyyymmdd(idate);
         return in_string == out_string;
      } catch(err) {
         return false;
      }

      function matchesDatePattern(date_string) {
         var dateFormat = /[0-9]+-[0-9]+-[0-9]+/;
         return dateFormat.test(date_string); 
      }
   }

   function lastElement(arr) { return arr[arr.length - 1]; }

   parsers.loaders = Object.keys(parsers).filter(function(f) { return parsers[f].file_format; });

   if (typeof define === "function" && define.amd) define(parsers); else if (typeof module === "object" && module.exports) module.exports = parsers;
   this.parsers = parsers;
 
}();
