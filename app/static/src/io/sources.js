!function() {

   Date.prototype.yyyymmdd = function() {
      var yyyy = this.getFullYear().toString();
      var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
      var dd  = this.getDate().toString();
      return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
   };

   function formatDate(date) {
      var d = date.yyyymmdd();
      return parseDate(d);
   }

   function parseDate(textdate) {
      textdate = textdate.toString();
      var date_string = textdate.slice(0, 4) + '-' + textdate.slice(4, 6) + '-' + textdate.slice(6);
      return date_string;
   }

   function ajax(url, request, type, callback) {
      var type = type || "GET";
      if (['GET', 'POST'].indexOf(type) < 0) return false;
      if (typeof callback != 'function') return false;

      var remote = new XMLHttpRequest();
      remote.open(type, url, true);
      remote.setRequestHeader("Content-Type", "application/json");
      remote.onload = function() { callback(remote.responseText); }
      remote.send(request);
      return true;
   }

   // module container
   var sources = {};
   sources.reset = function() {
      sources.meta = { players: { 0: 'Player One', 1: 'Player Two' } };
      if (sources.umo) sources.umo.reset();
   }

   var timeline = {};
   sources.timeline = timeline;

   timeline.fetch = function (timeline_id) {
      sources.reset();
      var request = JSON.stringify( { type: "cache", cacheURL: '_timeline/Matches/mt' + timeline_id + '.json' });
      function responseHandler(response) {
         var result = JSON.parse(response);
         timeline.info(aip.QueryString['timeline'], result.data ? JSON.parse(result.data) : undefined );
      }
      ajax('/api/match/request', request, 'POST', responseHandler);
   }

   timeline.data = function(timeline_id, cached_data) {
      if (cached_data) {
         process_sr_data(cached_data, 0); 
      } else {
         var matchURL = 'http://ls.sportradar.com/ls/feeds/?/betfair/en/Europe:Berlin/gismo/match_timeline/' + timeline_id;
         d3.json(matchURL, function(data) { process_sr_data(data, 1); });
      }
   }

   function process_sr_data(data, save) {
      var mid = data.doc[0].data.match._id;

      if (save) {
         var request = JSON.stringify({ data: data, action: 'save', destination: 'timeline/Matches', filename: 'mt' + mid });
         function responseHandler(response) { console.log(response); }
         ajax('/api/match/push', request, 'POST', responseHandler);
      }

      // first_service cannot be determined in the info file
      var serving_first = data.doc[0].data.events.filter(function(f) { return f.type == "first_server"});
      serving_first = serving_first.length ? serving_first[0].team : 'home';
      var first_service = (serving_first == "home") ? 0 : 1;
      if (sources.umo) { 
         // sources.umo.options( { match: { sets: 5, first_service: first_service }} ); 
         sources.umo.options( { match: { first_service: first_service }} ); 
      }

      pts = [];
      var serve = 1;
      var start_timer;
      var end_timer;

      var events = data.doc[0].data.events;
      for (var e=0; e < events.length; e++) {
         var ev = events[e];
         if (['service_taken', 'match_started', 'periodstart'].indexOf(ev.type) >= 0) { 
            start_timer = ev.uts; 
         }
         if (ev.type == 'first_serve_fault') { serve = 2; }
         if (ev.type == 'score_change_tennis') { 
            end_timer = ev.uts;
            point_time = (start_timer && end_timer) ? end_timer - start_timer : 0;
            pts.push({ 
               'team': ev.team, 
               'service': serve, 
               'ace': (ev.pointtype == 1),
               'df': (ev.pointtype == 2),
               'time': point_time,
               'uts': ev.uts
            });
            serve = 1;
            start_timer = end_timer; // in case there is not a start event
         }
      }
      // point progression with decoration
      pts.forEach(function(p, i) {
         var player = (p.team == 'home') ? 0 : 1;

         var rz = sources.umo.push(player); 
         var points = sources.umo.points();
         var last_point = points[points.length - 1];

         // add check that last_point score is the same as p.score
         // and if not, make adjustments to umo to compensate
         // I think this is to handle situations where the score
         // does not match point progression (due to match delays?)

         // decorate points
         var decoration = { score: last_point.score };
         decoration.uts = p.uts;
         decoration.time = p.time;
         if (sources.umo.decoratePoint && p.service == '2') {
            var code = last_point.code;
            if (p.df) {
               code = '0e';
               decoration.result = "Double Fault";
               decoration.serves = ['0e'];
            } else if (p.ace) {
               code = '0*';
               decoration.result = "Ace";
               decoration.serves = ['0*'];
            }
            decoration.code = '0e|' + code;
            decoration.first_serve = { error: 'Error', serves: [ '0e'] };
         } else if (p.ace && sources.umo.decoratePoint && p.service == '1') {
            decoration.code = '0*';
            decoration.result = "Ace";
            decoration.serves = ['0*'];
         }
         sources.umo.decoratePoint(i, decoration);
      });

      if (sources.uponCompletion) sources.uponCompletion();
   }

   timeline.info = function(timeline_id, passed_data) {
      if (passed_data) {
         var request = JSON.stringify( { type: "cache", cacheURL: '_timeline/Matches/mi' + timeline_id + '.json' });
         function responseHandler(response) {
            var result = JSON.parse(response);
            if (result.data) { processInfo(JSON.parse(result.data)); }
         }
         ajax('/api/match/request', request, 'POST', responseHandler);

      } else {
         var matchInfo = 'http://ls.sportradar.com/ls/feeds/?/betfair/en/Europe:Berlin/gismo/match_info/' + timeline_id;
         d3.json(matchInfo, processInfo); 
      }

      function processInfo(info) { 
         if (!info) {
            if (sources.umo) { sources.umo.options( { match: { sets: 5 }} ); }
            timeline.data(aip.QueryString['timeline']);
            return;
         }
         if (!passed_data) {
            var request = JSON.stringify({ data: info, action: 'save', destination: 'timeline/Matches', filename: 'mi' + timeline_id });
            function responseHandler(response) { console.log(response); }
            ajax('/api/match/push', request, 'POST', responseHandler);
         }
         var data = info.doc[0].data;

         var dt = data.match._dt.uts;
         var d = new Date(0);
         d.setUTCSeconds(dt);
         sources.meta.matchdate = formatDate(d);

         // for player names check for .children to get doubles players names
         sources.meta.players = [];
         var teamone = data.match.teams.home;
         var teamtwo = data.match.teams.away;
         if (teamone.children) {
            sources.meta.players[0] = teamone.children[0].name.split(',').reverse().join(' ').trim();
            sources.meta.players[2] = teamone.children[1].name.split(',').reverse().join(' ').trim();
         } else {
            sources.meta.players.push(teamone.name.split(',').reverse().join(' ').trim());
         }
         if (teamtwo.children) {
            sources.meta.players[1] = teamtwo.children[0].name.split(',').reverse().join(' ').trim();
            sources.meta.players[3] = teamtwo.children[1].name.split(',').reverse().join(' ').trim();
         } else {
            sources.meta.players.push(teamtwo.name.split(',').reverse().join(' ').trim());
         }

         sources.meta.tiebreak = data.match.coverage.tiebreak ? true : false;
         sources.meta.final_set_tiebreak = data.match.coverage.tiebreak ? true : false;
         sources.meta.final_set_tiebreak_only = (+data.match.coverage.tiebreak == 10) ? true : false;
         sources.meta.final_set_tiebreak_to = (+data.match.coverage.tiebreak == 10) ? 10 : 7;
         sources.meta.advantage = data.match.coverage.advantage == 1 ? true : false;
         sources.meta.round = data.match.roundname.shortname || '';
         sources.meta.tournament = data.tournament.tennisinfo.name || data.tournament.name;
         sources.meta.category = data.tournament.tennisinfo.gender[0];
         sources.meta.bestof = data.tournament.tennisinfo.sets;
         sources.meta.court = data.stadium ? data.stadium.name : '';
         sources.meta.surface = data.tournament.ground.main;
         sources.meta.status = data.match.status.name;

         updateUMOmeta();

         timeline.data(aip.QueryString['timeline'], passed_data);
      }
   }

   // http://www.tennis-math.com
   var tennisMath = {};
   sources.tennisMath = tennisMath;

   tennisMath.process = function(match_id) {
      sources.reset();
      if (sources.umo) { sources.umo.options( {match: {sets: 5}} ); }

      tennisMath.info(match_id);
   }

   tennisMath.data = function(match_id) {
      var request = JSON.stringify( { type: "cache", cacheURL: '_tennismath/ml' + match_id + '.json' });
      function responseHandler(response) {
         var result = JSON.parse(response);
         if (result.data) {
            // tennisMath.processData(JSON.parse(JSON.parse(result.data)), match_id);
            var data = JSON.parse(result.data);
            if (typeof data != 'object') { data = JSON.parse(data); }
            tennisMath.processData(data, match_id);
         } else {
            var request = JSON.stringify( { matchURL: "http://app.tennis-math.com/matchlog/" + match_id + ".json" });
            function responseHandler(response) {
               var result = JSON.parse(response);
               var siteNotFound = /site\snot\sfound/;
               if (result.data && !siteNotFound.test(result.data)) { 
                  tennisMath.processData(JSON.parse(result.data), match_id); 
                  if (tennisMath.save) { tennisMath.save(match_id, result.data, 'tennismath', 'ml'); }
               } else {
                  // exit gracefully
                  if (sources.uponCompletion) sources.uponCompletion();
               }
            }
            ajax('/api/match/request', request, 'POST', responseHandler);
         }
      }
      ajax('/api/match/request', request, 'POST', responseHandler);
   }

   tennisMath.processData = function(data, match_id) {
      var first_service;
      var tiebreak;
      var sets = data.children;
      var whoserving = /(\w+)\sis\sserving/;
      var serve_indicator = String.fromCharCode(8226);
      var unique_player_names = sources.meta.p1fname != sources.meta.p2fname;
      for (var s=0; s < sets.length; s++) {
         tiebreak = false;
         var games = sets[s].children;
         for (var g=0; g < games.length; g++) {
            var desc = games[g].header;
            if (first_service == undefined && whoserving.test(desc) && unique_player_names) {
               var whoserves = whoserving.exec(desc)[1];
               first_service = (whoserves == sources.meta.p2fname) ? 1 : 0;
               if (sources.umo) { sources.umo.options( {match: {first_service: first_service }} ); }
            }
            if (desc.indexOf("TIE-BREAK") >= 0) { tiebreak = true; }
            var last_score = tiebreak ? ["0T", "0T"] : ["0", "0"];
            var game_points = games[g].children;
            for (var p=0; p < game_points.length; p++) {
               var point = {};
               point.serve = 1;
               var score = [];
               point.rally = [];
               var desc = game_points[p].header;
               var serves = desc.split('/font')[0];
               for (var i=which_serve=0; i < serves.length; which_serve +=+ (serve_indicator === serves[i++]));
               for (var i=q_serve=0; i < serves.length; q_serve +=+ ('?' === serves[i++]));
               if (which_serve == 2 || q_serve == 2) {
                  point.first_serve = { error: 'Unknown' };
                  point.serve = 2;
               }
               if (first_service == undefined && desc.indexOf("Serving sequence is changed") >= 0) {
                  if (sources.umo) { sources.umo.options( {match: {first_service: 1}} ); }
                  continue;
               }
               var server = sources.umo ? sources.umo.nextService() : undefined;
               desc = desc.split('(!)').join('');
               score = desc.split(':');

               // if there is no valid score, continue to next line
               if (score.length < 2) continue;

               score[0] = score[0].split(' ').reverse()[0];
               score[1] = score[1].split(' ')[0];
               var point_to = undefined;
               if (tiebreak) {
                  // tiebreak score progression has to be treated differently
                  if (last_score[0] != score[0] && last_score[1] == score[1]) {
                     point_to = server ? 'receiver' : 'server';
                  } else if (last_score[1] != score[1] && last_score[0] == score[0]) {
                     point_to = server ? 'server' : 'receiver';
                  }
               } else {
                  // point progression from 'A' to '40' indicates other player won the point
                  if (last_score[0] == 'A' || last_score[1] == 'A') {
                     if (score[0] == '+' || (last_score[1] == 'A' && score[1] == '40')) {
                        point_to = 'server';
                     } else if (score[1] == '+' || (last_score[0] == 'A' && score[0] == '40')) {
                        point_to = 'receiver';
                     }
                  } else {
                     // otherwise the point is won by the player whose score progressed
                     if (score[0] == '+' || (last_score[0] != score[0] && last_score[1] == score[1])) {
                        point_to = 'server';
                     } else if (score[1] == '+' || (last_score[1] != score[1] && last_score[0] == score[0])) {
                        point_to = 'receiver';
                     }
                  }
               }
               last_score = score;
               var volley = desc.indexOf('volley') >= 0 ? true : false;
               var smash = desc.indexOf('smash') >= 0 ? true : false;
               var dropshot = desc.indexOf('drop-shot') >= 0 ? true : false;
               var this_point = point_to == 'receiver' ? '' : 'q';
               var handed = 'q';
               if (desc.indexOf('FH') > 0) { 
                  if (volley) {
                     handed = 'v';
                  } else if (smash) {
                     handed = 'o';
                  } else if (dropshot) {
                     handed = 'u';
                  } else {
                     handed = 'f'; 
                  }
               }
               if (desc.indexOf('BH') > 0) { 
                  if (volley) {
                     handed = 'z';
                  } else if (smash) {
                     handed = 'p';
                  } else if (dropshot) {
                     handed = 'y';
                  } else {
                     handed = 'b'; 
                  }
               }
               if (desc.indexOf('double fault') > 0) {
                  point.code = '0e|0e';
               }
               if (desc.indexOf('ace') > 0) { 
                  point.code = point.serve == 1 ? '0*' : '0e|0*'; 
                  point.terminator = '*'; 
               }
               if (desc.indexOf('winner') > 0) { 
                  point.terminator = '*'; 
               }
               if (desc.indexOf('unforced error') > 0) {
                  this_point += 'q';
                  point.terminator = '@';
               }
               if (desc.indexOf(' forced error') > 0) {
                  this_point += 'q';
                  point.terminator = '#';
               }

               if (desc.indexOf('return error') > 0) { 
                  this_point = '';
                  point.terminator = '@'; 
               }

               if (!point.code) {
                  this_point += handed;
                  this_point += point.terminator;
                  point.code = point.serve == 1 ? '0' + this_point : '0e|0' + this_point;
               }

               var point = sequences.pointParser(point.code.split('|'));

               if (sources.umo) { var result = sources.umo.push(point); }
            }
         }
      }
      if (sources.uponCompletion) sources.uponCompletion();
   }

   tennisMath.save = function(match_id, data, destination, prefix) {
      var request = JSON.stringify({ data: data, action: 'save', destination: destination, filename: prefix + match_id, file_type: '.json' });
      function responseHandler(response) { console.log(response); }
      ajax('/api/match/push', request, 'POST', responseHandler);
   }

   tennisMath.info = function(match_id) {

      var request = JSON.stringify( { type: "cache", cacheURL: '_tennismath/mi' + match_id + '.json' });
      function responseHandler(response) {
         var result = JSON.parse(response);
         if (result.data) {
            // tennisMath.processInfo(JSON.parse(JSON.parse(result.data)));
            var data = JSON.parse(result.data);
            if (typeof data != 'object') { data = JSON.parse(data); }
            tennisMath.processInfo(match_id, data);
         } else {
            var request = JSON.stringify( { matchURL: "http://app.tennis-math.com/matchinfo/" + match_id + ".json" });
            function responseHandler(response) {
               var result = JSON.parse(response);
               if (tennisMath.save) { tennisMath.save(match_id, result.data, 'tennismath', 'mi'); }
               if (result.data) tennisMath.processInfo(match_id, JSON.parse(result.data));
            }
            ajax('/api/match/request', request, 'POST', responseHandler);
         }
      }
      ajax('/api/match/request', request, 'POST', responseHandler);
   }

   tennisMath.processInfo = function(match_id, data) {
      if (data.note) sources.meta.tournament = data.note;
      if (data.t1p1.playerSex) sources.meta.category = data.t1p1.playerSex[0];

      var p1 = data.t1p1 ? data.t1p1.firstName + ' ' + data.t1p1.lastName : '';
      var p2 = data.t2p1 ? data.t2p1.firstName + ' ' + data.t2p1.lastName : '';
      if (p1 || p2) sources.meta.players = [p1, p2];
      sources.meta.p1fname = data.t1p1.firstName;
      sources.meta.p2fname = data.t2p1.firstName;
      sources.meta.p1lname = data.t1p1.lastName;
      sources.meta.p2lname = data.t2p1.lastName;

      if (data.date) {
         var d = new Date(data.date);
         sources.meta.matchdate = formatDate(d);
      }
      if (data.t1p1.playerHanded) sources.meta.p1hand = data.t1p1.playerHanded[0];
      if (data.t2p1.playerHanded) sources.meta.p2hand = data.t2p1.playerHanded[0];
      if (data.surface) sources.meta.surface = data.surface; // must be converted

      sources.meta.advantage = data.rule.deuce == 'REGULAR' ? true : false;
      sources.meta.bestof = +data.rule.amountOfSets.split('_')[2];
      sources.meta.match_desc = data.rule.name;
      sources.meta.setgames = +data.rule.firstToGames.split('_')[2] * 2;

      sources.meta.tiebreak == 'NONE' ? false : true;
      sources.meta.tiebreak_to = +data.rule.tieBreakPoints.split('_')[1];
      sources.meta.tiebreak_at = +data.rule.tieBreak != 'TB_AT_FIRST_TO' ? sources.meta.tiebreak_to - 1 : sources.meta.tiebreak_to; 
      // tieBreakServeRotation ?? 'ODD'

      updateUMOmeta();
      tennisMath.data(match_id);
   }

   // Tennis Scoreboard http://ts.nik.space/games
   var tennisSB = {};
   sources.tennisSB = tennisSB;

   tennisSB.process = function(match_id) {
      sources.reset();
      function responseHandler(response) { 
         var match_types = JSON.parse(response);
         tennisSB.info(match_id, match_types); 
      }
      ajax('/lib/ex/tsbrules.json', '', 'GET', responseHandler);
   };

   tennisSB.data = function(match_id, infodata) {
      var request = JSON.stringify( { type: "cache", cacheURL: '_tsb/' + match_id + '_gamedetail.json' });
      function responseHandler(response) {
         var result = JSON.parse(response);
         if (result.data) {
            var data = JSON.parse(result.data);
            if (typeof data != 'object') { data = JSON.parse(data); }
            tennisSB.processData(data, match_id);
         } else {
            var request = JSON.stringify( { matchURL: "http://ts.nik.space/api/json?c=gamedetaillist&gamecode=" + match_id });
            function responseHandler(response) {
               var result = JSON.parse(response);
               var siteNotFound = /site\snot\sfound/;
               if (result.data && !siteNotFound.test(result.data)) { 
                  tennisSB.processData(JSON.parse(result.data), match_id); 
                  if (infodata.datajson.statusstr == 'MATCH POINT') { tennisSB.save(match_id, result.data, 'tsb', 'gamedetail'); }
               } else {
                  // exit gracefully
                  if (sources.uponCompletion) sources.uponCompletion();
               }
            }
            ajax('/api/match/request', request, 'POST', responseHandler);
         }
      }
      ajax('/api/match/request', request, 'POST', responseHandler);
   }

   tennisSB.processData = function(data, match_id) {
      data.reverse(); // because data returned LIFO

      var point = {};
      var whichserve = 1;
      var codes = { '1': '', '2': '', '3': '0e', '4': '0*', '5': 'q@', '6': 'q*' };

      data.forEach(function(e, i) {
         // players 1&3 are on 1st team and players 2&4 are on 2nd team
         var player = 1 - (e.jsondata.a.substr(1,1) % 2); // supports players 1 to 4
         var actioncode = e.jsondata.a.substr(2,1);
         var winner = e.jsondata.a.substr(4,1) - 1;
         var server = sources.umo.nextService();
         point.code = codes[actioncode];

         if (actioncode == '2') {
            whichserve = 2;
         } else if ('146'.indexOf(actioncode) >= 0) {
            point.winner = player;
            if (actioncode == '1') { point.code = (server == point.winner) ? 'S' : 'R'; }
            if (actioncode == '6') { point.code = ((server == point.winner) ? '0q' : '0') + point.code; }
            addPoint(point, i);
         } else if ('35'.indexOf(actioncode) >= 0) {
            point.winner = 1 - player;
            if (actioncode == '5') { point.code = ((server == point.winner) ? '0' : '0q') + point.code; }
            addPoint(point, i);
         }

      });

      function addPoint(point, i) {
         if (whichserve == 2) { point.code = "0e|" + point.code; }
         if (point.code) { point = sequences.pointParser(point.code.split('|')); }
         var result = sources.umo.push(point);
         // if (!result.result) console.log(i, point);
         whichserve = 1;
         point = {};
      };

      if (sources.uponCompletion) sources.uponCompletion();
   }

   tennisSB.save = function(match_id, data, destination, postfix) {
      var request = JSON.stringify({ data: data, action: 'save', destination: destination, filename: match_id + '_' + postfix, file_type: '.json' });
      function responseHandler(response) { console.log(response); }
      ajax('/api/match/push', request, 'POST', responseHandler);
   }

   tennisSB.info = function(match_id, match_types) {
      var request = JSON.stringify( { type: "cache", cacheURL: '_tsb/' + match_id + '_game.json' });
      function responseHandler(response) {
         var result = JSON.parse(response);
         if (result.data) {
            var data = JSON.parse(result.data);
            if (typeof data != 'object') { data = JSON.parse(data); }
            tennisSB.processInfo(data, match_id, match_types);
         } else {
            var request = JSON.stringify( { matchURL: "http://ts.nik.space/api/json?c=game&gamecode=" + match_id });
            function responseHandler(response) {
               var result = JSON.parse(response);
               if (result.data) {
                  var data = JSON.parse(result.data);
                  if (data.datajson.statusstr == 'MATCH POINT') { 
                     tennisSB.save(match_id, result.data, 'tsb', 'game'); 
                  }
                  tennisSB.processInfo(data, match_id, match_types);
               } else {
                  // exit gracefully
                  if (sources.uponCompletion) sources.uponCompletion();
               }
            }
            ajax('/api/match/request', request, 'POST', responseHandler);
         }
      }
      ajax('/api/match/request', request, 'POST', responseHandler);
   }

   tennisSB.processInfo = function(data, match_id, match_types) {

      // look for match rules
      var match_rules = match_types.filter(function(f) { return data.totalset == f.tid; })[0];

      // determine player who serves first
      if (sources.umo) {
         var first_service = data.isservechanged ? 1 : 0;
         sources.umo.options( { match: { first_service: first_service }} ); 

         // configure matchObject for match rules
         if (match_rules) {
            sources.meta.advantage = match_rules.advantagetype == 0 ? true : false;
            sources.meta.bestof = match_rules.bestofsets;
            sources.meta.match_desc = match_rules.desc;
            sources.meta.tiebreak = +match_rules.tiebreaktype > 0 ? true : false; 
            sources.meta.tiebreak_at = +match_rules.tiebreaktype == 2 ? +match_rules.gamesperset - 1 : +match_rules.gamesperset; 
            sources.meta.tiebreak_to = +match_rules.tiebreakpoint;
            sources.meta.setgames = match_rules.gamesperset * 2;
            if (match_rules.finalsettype == 2) {
               sources.meta.final_set_tiebreak_only = true;
               sources.meta.final_set_tiebreak_to = 10;
            }
            sources.umo.options({ set: { games:       match_rules.gamesperset * 2 } });
         }
      }

      if (data.address) sources.meta.tournament = data.address;
      var p1 = data.player1name;
      var p2 = data.player2name;
      if (p1 || p2) sources.meta.players = [p1, p2];

      if (data.wdate) {
         var d = new Date(data.wdate);
         sources.meta.matchdate = formatDate(d);
      }
      updateUMOmeta();
      tennisSB.data(match_id, data);
   }

   function updateUMOmeta() {
      if (!sources.umo) return;
      sources.umo.options({ 
         match: {
            desc: sources.meta.match_desc || '',
            sets: +sources.meta.bestof || 3,
            final_set_tiebreak: sources.meta.final_set_tiebreak == undefined ? true : sources.meta.final_set_tiebreak,
            final_set_tiebreak_only: sources.meta.final_set_tiebreak_only || false,
            final_set_tiebreak_to: sources.meta.final_set_tiebreak_to == undefined ? 7 : +sources.meta.final_set_tiebreak_to,
         },
         set: {
            games: sources.meta.setgames == undefined ? 12 : sources.meta.setgames,
            tiebreak: sources.meta.tiebreak == undefined ? true : sources.meta.tiebreak,
            tiebreak_at: sources.meta.tiebreak_at ? +sources.meta.tiebreak_at : sources.meta.setgames ? +sources.meta.setgames / 2 : 6,
            tiebreak_to: sources.meta.tiebreak_to == undefined ? 7 : +sources.meta.tiebreak_to,
            advantage: sources.meta.advantage == undefined ? true : sources.meta.advantage,
            lets: sources.meta.lets == false ? false : true,
         }
      });
      sources.umo.metadata({
         players: { 
            0: { name: sources.meta.players[0], fname: sources.meta.p1fname || '', lname: sources.meta.p1lname || '', fh: sources.meta.p1hand },
            1: { name: sources.meta.players[1], fname: sources.meta.p2fname || '', lname: sources.meta.p2lname || '', fh: sources.meta.p2hand },
            2: { name: sources.meta.players[2], fname: sources.meta.p3fname || '', lname: sources.meta.p3lname || '', fh: sources.meta.p3hand },
            3: { name: sources.meta.players[3], fname: sources.meta.p4fname || '', lname: sources.meta.p4lname || '', fh: sources.meta.p4hand }
         },
         tournament: {
            name: sources.meta.tournament,
            surface: sources.meta.surface,
            round: sources.meta.round, 
         },
         match: {
            date: sources.meta.matchdate,
            court: sources.meta.court,
            category: sources.meta.category,
            umpire: sources.meta.umpire
         },
         charter: sources.meta.charter 
      });
      sources.umo.update();
   }

   if (typeof define === "function" && define.amd) define(sources); else if (typeof module === "object" && module.exports) module.exports = sources;
   this.sources = sources;
 
}();
