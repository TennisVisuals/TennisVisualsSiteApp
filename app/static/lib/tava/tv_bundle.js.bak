!function() {
   var aip = {
      desc: 'Tennis AiP Cors Library',
      server: 'http://tennisvisuals.com',
      version: '0.4',
      nolog: false,
      message: '',
      match: {},
      playerRecord: {}
   }

   // MAIN
   // override default setting for local execution
   aip.server = location.origin;
   if (location.hostname == 'localhost' || !location.hostname) {
      console.log("Using Local Server", location.origin);
   } else {
      console.log("setting aip.server to", location.origin);
      aip.server = location.origin;
   }

   // http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-url-parameter
   var QueryString = function () {
     // This function is anonymous, is executed immediately and 
     // the return value is assigned to QueryString!
     var qs = {};
     var query = window.location.search.substring(1);
     var vars = query.split("&");
     for (var i=0;i<vars.length;i++) {
       var pair = vars[i].split("=");
       if (typeof qs[pair[0]] === "undefined") {
         qs[pair[0]] = pair[1];
       } else if (typeof qs[pair[0]] === "string") {
         var arr = [ qs[pair[0]], pair[1] ];
         qs[pair[0]] = arr;
       } else {
         qs[pair[0]].push(pair[1]);
       }
     } 
     return qs;
   } ();
   aip.QueryString = QueryString;

   var okeys = Object.keys(QueryString);
   aip.okeys = okeys;

   if (okeys.length && okeys.indexOf('nolog') >= 0) {
      aip.nolog = true;
   }

   aip.report = function(what, callback) { urlRequest(location.origin + '/report/' + what, callback); }

   aip.shareFile = function(data, destination, filename, filetype, callback) {
      var request = JSON.stringify({ data: data, action: 'save', destination: destination, filename: filename, filetype: filetype });
      ajax('/api/match/share', request, 'POST', callback);
   }

   aip.requestUrl = function(url, callback) {
      var request = JSON.stringify({ url: url, });
      ajax('/api/match/request', request, 'POST', callback);
   }

   function ajax(url, request, type, callback) {
      var type = type || "GET";
      if (['GET', 'POST'].indexOf(type) < 0) return false;
      if (typeof callback != 'function') return false;

      var remote = new XMLHttpRequest();
      remote.open(type, url, true);
      remote.setRequestHeader("Content-Type", "application/json");
      remote.onload = function() { callback(remote.responseText); }
      remote.onerror = function() { callback('{"error":"connection error"}'); }
      remote.send(request);
      return true;
   }

   aip.sendReport = sendReport;
   function sendReport(what) {
      if (aip.nolog) return;
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", location.origin + '/report/' + what, true);
      xhttp.send();
   }

   aip.playerBio = playerBio;
   function playerBio(playerName, callback) {
      if (!callback || typeof callback != 'function') return;
      aip.message = "Making CORS Request";
      var url = aip.server + '/api/player/bio/' + playerName;
      makeCorsRequest(url, function(json) {
          if (callback) callback(null, json);
      });
   }

   /*
   aip.findPlayerMatchesFingerprints = findPlayerMatchesFingerprints;
   function findPlayerMatchesFingerprints(playerName, year, callback) {
      if (!callback || typeof callback != 'function') return;
      if (year != '') {
         aip.message = "Making CORS Request";
         var url = aip.server + '/api/matches/fingerprints/player/' + playerName + '/' + year;
         makeCorsRequest(url, function(json) {
             if (callback) callback(null, json);
         });
      } else {
         callCORS(playerName, '/api/matches/fingerprints/player/', function(err, data) {
             if (!err) callback(null, data);
         });
      }
   }
   */

   aip.findOrgStats = findOrgStats;
   function findOrgStats(org, year, callback) {
      if (!callback || typeof callback != 'function') return;
      if (year != '') {
         aip.message = "Making CORS Request";
         var url = aip.server + '/api/matches/stats/org/' + org + '/' + year;
         makeCorsRequest(url, function(json) {
             if (callback) callback(null, json);
         });
      } else {
         callCORS(org, '/api/matches/stats/org/', function(err, data) {
             if (!err) callback(null, data);
         });
      }
   }

   aip.playerStatsPointsToSet = playerStatsPointsToSet;
   function playerStatsPointsToSet(player, year, callback) {
      if (!callback || typeof callback != 'function') return;
      if (year != '') {
         aip.message = "Making CORS Request";
         var url = aip.server + '/api/player/stats/points_to_set/' + player + '/' + year;
         makeCorsRequest(url, function(json) {
             if (callback) callback(null, json);
         });
      } else {
         callCORS(player, '/api/player/stats/points_to_set/', function(err, data) {
             if (!err) callback(null, data);
         });
      }
   }

   aip.playerStatsOverview = playerStatsOverview;
   function playerStatsOverview(player, year, callback) {
      if (!callback || typeof callback != 'function') return;
      if (year != '') {
         aip.message = "Making CORS Request";
         var url = aip.server + '/api/player/stats/overview/' + player + '/' + year;
         makeCorsRequest(url, function(json) {
             if (callback) callback(null, json);
         });
      } else {
         callCORS(player, '/api/player/stats/overview/', function(err, data) {
             if (!err) callback(null, data);
         });
      }
   }

   aip.playerStatsShots = playerStatsShots;
   function playerStatsShots(player, year, callback) {
      if (!callback || typeof callback != 'function') return;
      if (year != '') {
         aip.message = "Making CORS Request";
         var url = aip.server + '/api/player/stats/shots/' + player + '/' + year;
         makeCorsRequest(url, function(json) {
             if (callback) callback(null, json);
         });
      } else {
         callCORS(player, '/api/player/stats/shots/', function(err, data) {
             if (!err) callback(null, data);
         });
      }
   }

   // CORS 
   function callCORS(single_variable, query_path, callback) {
      // recognize whether there was no muid passed into function
      if (typeof single_variable == 'function') {
         callback = single_variable;
         single_variable = undefined;
      }
      if (typeof single_variable != 'string') single_variable = undefined;
      if (typeof callback != 'function') callback = undefined;

      if (!single_variable) {
         return;
         /*
         var okeys = Object.keys(QueryString);
         if (okeys.length && okeys.indexOf('player') >= 0) {
            single_variable = QueryString['player'];
         } else {
            aip.message = "query variable not found in query string";
            if (callback) callback('not found', '');
            return;
         }
         */
      }
      aip.message = "Making CORS Request";
      var url = aip.server + query_path + single_variable;
      makeCorsRequest(url, function(json) {
          if (callback) callback(null, json);
      });
   }

   // CORS getPlayerStats()
   aip.getPlayerStats = getPlayerStats
   function getPlayerStats(playerName, callback) {
      var url = aip.server + '/api/matches/stats/player/' + playerName;
      makeCorsRequest(url, function(json) {
          if (callback) callback(null, json);
      });
   }

   // CORS getPlayerTourneyMatches()
   aip.getPlayerTourneyMatches = getPlayerTourneyMatches
   function getPlayerTourneyMatches(tuid, puid, year, callback) {
      var url = aip.server + '/api/codes/' + tuid + '/' + puid + '/' + year;
      makeCorsRequest(url, function(json) {
          if (callback) callback(null, json);
      });
   }

   // CORS findPlayerMatches()
   aip.findPlayerMatches = findPlayerMatches
   function findPlayerMatches(playerName, year, callback) {
      var url = aip.server + '/api/matches/' + playerName;
      makeCorsRequest(url, function(json) {
          aip.playerRecord = json;
          if (callback) callback(null, aip.playerRecord);
      });
   }

   // CORS findPlayerCodes()
   aip.findPlayerCodes = findPlayerCodes
   function findPlayerCodes(playerName, year, callback) {
      var url = aip.server + '/api/matches/codes/' + playerName;
      makeCorsRequest(url, function(json) {
          aip.playerRecord = json;
          if (callback) callback(null, aip.playerRecord);
      });
   }

   // CORS findPlayerCodes()
   aip.limitPlayerCodes = limitPlayerCodes
   function limitPlayerCodes(playerName, limit, callback) {
      var url = aip.server + '/api/matches/codes/limit/' + playerName + '/' + limit;
      makeCorsRequest(url, function(json) {
          aip.playerRecord = json;
          if (callback) callback(null, aip.playerRecord);
      });
   }

   // CORS matchStats()
   // returns stats for a single match
   aip.matchStats = matchStats;
   function matchStats(muid, callback) {
      // recognize whether there was no muid passed into function
      if (typeof muid == 'function') {
         callback = muid;
         muid = undefined;
      }
      if (typeof muid != 'string') muid = undefined;
      if (typeof callback != 'function') callback = undefined;

      if (!muid) {
         return;
         /*
         var okeys = Object.keys(QueryString);
         if (okeys.length && okeys.indexOf('muid') >= 0) {
            muid = QueryString['muid'];
         } else {
            aip.message = "player not found in query string";
            if (callback) callback('no player found', '');
            return;
         }
         */
      }
      aip.message = "Making CORS Request";
      var url = aip.server + '/api/match/stats/' + muid;
      makeCorsRequest(url, function(json) {
          aip.matches = json;
          if (callback) callback(null, aip.matches);
      });
   }

   // CORS playerStats()
   // returns an array of all match stats for a given player
   aip.playerStats = playerStats;
   function playerStats(playerName, callback) {
      // recognize whether there was no muid passed into function
      if (typeof playerName == 'function') {
         callback = playerName;
         playerName = undefined;
      }
      if (typeof playerName != 'string') playerName = undefined;
      if (typeof callback != 'function') callback = undefined;

      if (!playerName) {
         return;
         /*
         var okeys = Object.keys(QueryString);
         if (okeys.length && okeys.indexOf('player') >= 0) {
            playerName = QueryString['player'];
         } else {
            aip.message = "player not found in query string";
            if (callback) callback('no player found', '');
            return;
         }
         */
      }
      aip.message = "Making CORS Request";
      var url = aip.server + '/api/player/stats/' + playerName;
      makeCorsRequest(url, function(json) {
          aip.matches = json;
          if (callback) callback(null, aip.matches);
      });
   }

   // CORS loadMatch()
   aip.loadMatch = loadMatch;
   function loadMatch(context, callback) {
      var response = { data: null, context: context, error: null };
      aip.message = "Making CORS Request";
      var url = aip.server + '/api/match/' + context.type + '/' + context.identifier;
      makeCorsRequest(url, function(json) {
          if (!json.error) {
             response.data = json.data;
          } else {
             response.error = json.error;
          }
          if (callback) callback(response);
      });
   }

   aip.loadStats = loadStats;
   function loadStats(muid, callback) {
      // recognize whether there was no muid passed into function
      if (typeof muid == 'function') {
         callback = muid;
         muid = undefined;
      }
      if (typeof muid != 'string') muid = undefined;
      if (typeof callback != 'function') callback = undefined;

      if (!muid) {
         return;
         /*
         var okeys = Object.keys(QueryString);
         if (okeys.length && okeys.indexOf('muid') >= 0) {
            muid = QueryString['muid'];
         } else {
            aip.message = "muid not found in query string";
            if (callback) callback('no muid found', data);
            return;
         }
         */
      }
      aip.message = "Making CORS Request";
      var url = aip.server + '/api/match/stats/' + muid;
      makeCorsRequest(url, function(json) {
          aip.stats = json;
          if (callback) callback(null, aip.stats);
      });
   }

   aip.saveFile = saveFile;
   function saveFile(someFile, callback) {
      // recognize whether there was no muid passed into function
      if (typeof callback != 'function') callback = undefined;

      var url = aip.server + '/api/match/save/' + someFile;
      makePostRequest(url, function(json) {
          aip.result = json;
          if (callback) callback(null, aip.result);
      });
   }

   // http://www.html5rocks.com/en/tutorials/cors/
   // Create the XHR object.
   function createCORSRequest(method, url) {
     var xhr = new XMLHttpRequest();
     if ("withCredentials" in xhr) {
       xhr.open(method, url, true);
     } else if (typeof XDomainRequest != "undefined") {
       xhr = new XDomainRequest();
       xhr.open(method, url);
     } else {
       xhr = null;
     }
     return xhr;
   }

   // POST Attempt
   function makePostRequest(url, callback) {
     var xhr = createCORSRequest('POST', url);
     if (!xhr) {
       aip.message = "CORS not supported";
       return;
     }

     xhr.onload = function() {
       var data = xhr.responseText;
       var json = JSON.parse(data);
       aip.message = "JSON Received";
       if (callback) callback(json);
     };

     xhr.onerror = function() {
       aip.message = "Request Unsuccessful";
     };

     xhr.send();
   }

   // Make the actual CORS request.
   function makeCorsRequest(url, callback) {
     var xhr = createCORSRequest('GET', url);
     if (!xhr) {
       aip.message = "CORS not supported";
       return;
     }

     xhr.onload = function() {
       var data = xhr.responseText;
       var json = JSON.parse(data);
       aip.message = "JSON Received";
       if (callback) callback(json);
     };

     xhr.onerror = function() {
       aip.message = "Request Unsuccessful";
     };

     xhr.send();
   }

  if (typeof define === "function" && define.amd) define(aip); else if (typeof module === "object" && module.exports) module.exports = aip;
  this.aip = aip;
}();
// TODO
// Add setpoint and matchpoint attributes to checkBreakpoint

!function() {
   var mo = {};

   // clients can register callbacks for notification when data updates
   var callbacks = [];

   mo.matchObject = matchObject;
   function matchObject() {


      var options;
      resetOptions();

      var metadata;
      resetMetadata();

      // programmatic
      var undo_list = [];
      var set_objects = [];

      // prepare sets
      for (var s=0; s < 5; s++) {
         var so = setObject();
         so.options({ id: s })
         set_objects.push(so);
      }
      set_objects[0].options( { set: {first_service: options.match.first_service }} );

      // empty match object
      function match() { };

      // ACCESSORS

      match.type = 'UMO';

      match.metadata = function(values) {
         if (!arguments.length) return metadata;
         keyWalk(values, metadata);
         set_objects.forEach(function(s) {
            s.options({ players: [metadata.players[0].name, metadata.players[1].name, metadata.players[2].name, metadata.players[3].name] });
         });
         return match;
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

      match.options = function(values) {
          if (!arguments.length) return options;
          keyWalk(values, options);

          // if the number of games is not even, set to default
          if (options.set.games % 2 != 0) options.set.games = 12;

          // if the first server has changed, modify all set objects
          if (options.match.first_service != set_objects[0].options().set.first_service) {
             set_objects.forEach(function(s) {
                var fs = s.options().set.first_service;
                s.options({ set: { first_service: 1 - fs }});
             });
          }

          set_objects.forEach(function(s, i) {
             s.options({ set: options.set, points: options.points });

             // FINAL SET
             // if this set's number is same as options.match.sets and if it is odd
             if (i + 1 == options.match.sets && ((i + 1) % 2)) {
                var opts = { set: { 
                   tiebreak: options.match.final_set_tiebreak,
                   tiebreak_to: options.match.final_set_tiebreak_to,
                   tiebreak_only: options.match.final_set_tiebreak_only
                } };
                s.options(opts);
             } else {
                var opts = { set: { 
                   tiebreak: options.set.tiebreak,
                   tiebreak_to: options.set.tiebreak_to,
                   tiebreak_only: false
                  
                } };
                s.options(opts);
             }
          });
          return match;
      }

      match.points = function(values) {
         if (!arguments.length) { 
            var points = [];
            for (var s=0; s < options.match.sets; s++) {
              points = points.concat(set_objects[s].points());
            }
            return points; 
         }

         // add an array of values to the match
         var previous_set_games = 0;
         var previous_set_first_service = options.match.first_service;
         // iterate through sets
         for (var s=0; s < 5; s++) {
            if (values.length) {

               // set first_service for this set based on the first_service and
               // number of games in the previous set
               var opts = { set: { first_service: (previous_set_first_service + previous_set_games) % 2 } };
               set_objects[s].options(opts);

               // add values to the current set
               var result = set_objects[s].points(values);

               var previous_set_first_service = set_objects[s].options().set.first_service;
               var previous_set_games = set_objects[s].games();
               previous_set_games = previous_set_games ? previous_set_games.length : 0;

               if (result.result) {
                  // if there are additional (extra) values, discard them.
                  values = [];

               } else if (result.remnant) {
                  // there were extra values and the match is not complete
                  values = result.remnant;
               }

            } else {
               // if there are no (more) values, reset the current set
               set_objects[s].reset()
            }
         }
         match.update();
      }

       match.winProgression = function() {
          var points = match.points();
          var wp = '';
          points.forEach(function(p) { wp += p.winner });
          return wp;
       }

       match.gameProgression = function() {
          var points = match.points();
          var gp = '';
          points.forEach(function(p) {
             if (p.score.indexOf('G') >= 0) gp += p.winner;
             if (p.score.indexOf('T')) {
                var tb_scores = p.score.split('T').join('').split('-');

                // check for last point of tiebreak
                if ((Math.abs(tb_scores[0] - tb_scores[0]) >= 2) &&
                    (tb_scores[0] >= options.set.tiebreak_to || tb_scores[1] >= options.set.tiebreak_to)) {
                       gp += p.winner;
                }
             }
          });
          return gp;
       }

       match.push = function(values) {
          var previous_set_games = 0;
          var previous_set_first_service = options.match.first_service;

          // iterate through all sets
          for (var s=0; s < options.match.sets; s++) {
             // add values to set, if possible
             var result = set_objects[s].push(values);

             // if there is an error, return
             if (result.error) return result;

             // if there was a final result; call update function, if present
             if (result.result) {
                match.update();
                break;

             // if there are additional values, continue
             } else if (result.remnant) {
                values = result.remnant;
             }

             // check for end of match, one player has more than half fo the number of sets
             if (match.score().winner) { break; }

             // if the end of current set was reached
             if (result.status == 'eos') {
                previous_set_first_service = set_objects[s].options().set.first_service;
                previous_set_games = set_objects[s].games();
                previous_set_games = previous_set_games ? previous_set_games.length : 0;

                // update first_service of next set based on number of games played this set
                var opts = { set: { first_service: (previous_set_first_service + previous_set_games) % 2 } };
                if (set_objects[s + 1]) set_objects[s + 1].options(opts);

             }
          }
          // match.update();
          return result;
       }

       match.pop = function() {
          var point = undefined;
          for (var s = options.match.sets - 1; s >= 0; s--) {
             point = set_objects[s].pop();
             if (point != undefined) {
                undo_list.push(point);
                break;
             }
          }
          match.update();
          return point;
       }

       match.redo = function() {
          if (!undo_list.length) return false;
          var point = undo_list.pop();
          var result = match.push(point);
          return result;
       }

       match.reset = function() {
          undo_list = [];
          set_objects.forEach(function(e) { e.reset(); });
          resetOptions();
          resetMetadata();
          match.update();
       }

       match.update = function() {
          if (!callbacks.length) return;
          callbacks.forEach(function(c) {
             if (typeof c == 'function') c();
          });
       }

       match.callback = function(callback) {
          if (!arguments.length) return callbacks;
          if (typeof callback == 'function') {
             callbacks.push(callback);
          } else if (typeof callback == 'array') {
             callback.foreach(c) (function(c) {
                if (typeof c == 'function') callbacks.push(c);
             });
          }
       }

       match.teams = function() {
          var teams = [];
          var plyrs = [0,1,2,3].map(function(m) { return metadata.players[m].name }).filter(function(f) { return f ? f.length : 0 });
          if (plyrs.length > 2) {
             teams.push(lastElement(plyrs[0].split(' ')) + ' / ' + lastElement(plyrs[2].split(' ')));
             teams.push(lastElement(plyrs[1].split(' ')) + ' / ' + lastElement(plyrs[3].split(' ')));
          } else {
             teams = [plyrs[0], plyrs[1]];
          }
          return teams;
       }

       // match.players() should be replaced with match\.teams() for player
       // names that will be displayed
       // match.players() should only return a list of player names
       
       match.players = function(a, b, c, d) {
          if (!arguments.length) return [metadata.players[0].name, metadata.players[1].name];

          if (typeof a == 'string') { metadata.players[0].name = a; }
          if (typeof b == 'string') { metadata.players[1].name = b; }
          if (typeof c == 'string') { metadata.players[2].name = b; }
          if (typeof d == 'string') { metadata.players[3].name = b; }

          // TODO: set objects should have function to grab names from match object
          if (typeof a == 'string' && typeof b == 'string') {
             set_objects.forEach(function(s) { s.players(a, b) });
          }
          match.update();
          return match;
       }

       match.score = function() {
          var scoreboards = [];
          var sets_won = [0, 0];
          for (var s=0; s < 5; s++) {
             var score = set_objects[s].score();
             if (score) {
                scoreboards.push(score);
                if (score.complete) sets_won[score.leader] += 1;
             }
          }

          var match_score = '';
          var match_winner = '';
          var match_loser = '';

          // check if there is a match winner
          // winner has won more than half of the sets for match format
          if (sets_won[0] > (options.match.sets / 2) || sets_won[1] > (options.match.sets / 2)) {
             var winner = sets_won[0] > sets_won[1] ? 0 : 1;

             match_winner = metadata.players[winner].name;
             match_loser = metadata.players[1 - winner].name;

          }
          // build match score string
          for (var s=0; s < scoreboards.length; s++) {
             match_score += scoreboards[s].game_score;
             if (s < scoreboards.length - 1) match_score += ', ';
          }
          var point_score = scoreboards.length ? scoreboards[scoreboards.length - 1].point_score : '';
          return { 
             sets: scoreboards, 
             match_score: match_score, 
             winner: match_winner, 
             loser: match_loser, 
             score: sets_won,
             point_score: point_score
          };
       }

       match.sets = function() {
          return set_objects.slice(0,options.match.sets);
       }

       // simulate rallies for dev purposes
       match.rr = function() {
          var points = match.points();
          var results = ['Ace', 'Winner', 'Serve Winner', 'Forced Error', 'Unforced Error', 'Double Fault', 'Penalty'];

          points.forEach(function(p) {
             var rr = Math.floor(Math.random() * 25) + 1;
             p.rally = new Array(rr);
             var rre = Math.floor(Math.random() * 7) + 1;
             p.result = results[rre - 1];
          });
       }

       match.rallies = function() {
          return match.points()
                      .map(function(m) { if (m.rally && m.rally.length) { return m.rally.length; } })
                      .filter(function(f) { return f; });
       }

       match.nextService = function() {
          var sets = match.score().sets.length;
          if (sets == 0) {
             return options.match.first_service;
          } else {
             return set_objects[sets - 1].nextService();
          }
       }

       var valid_points = [
          '0-15', '0-30', '0-40', '0-G', '15-0', '15-15', '15-30', '15-40', '15-G', '30-0', '30-15', '30-30', '30-40', '30-G',
          '40-0', 'G-0', '40-15', 'G-15', '40-30', 'G-30', '40-40', '40-A', '40-G', 'A-40', 'G-40'
       ]

       function validPoint(score) {
          return ((valid_points.indexOf(score) >= 0) ||
                  (score.split('-').filter(function(f) { return f.indexOf('T') >= 0; }).length == 2));
       }

       match.decoratePoint = function(index, decoration) {
          if (!decoration || typeof decoration !== 'object' || !Object.keys(decoration).length) return false;
          for (var s=0; s < set_objects.length; s++) {
             var num_set_points = set_objects[s].points().length;
             if (index + 1 > num_set_points) {
                index -= num_set_points;
             } else {
                break;
             }
          }
          if (s == set_objects.length) return false;
          return set_objects[s].decoratePoint(index, decoration);
       }

       match.pointIndex = function(set, game, score) {
          if (set < 0 || set > options.match.sets || game < 0) {
                 return false;
              }
          var set_points = match.points().map(function(p) { return p.set == set ? p : undefined });
          var game_points = set_points.map(function(p) { return p && p.game == game ? p : undefined });

          if (score && validPoint(score)) {
             var points = game_points.map(function(p) { return p && p.score == score ? p : undefined });
             for (var p=0; p < points.length; p++) {
                if (points[p] != undefined) return p;
             }
          }

          if (!score) {
             for (var p=0; p < game_points.length; p++) {
                if (game_points[p] != undefined) return p;
             }
          }
          return false;
       }

       // lazy means to look for point score regardless of orientation
       match.findPoint = function(set, game, score, lazy) {
          if (set < 0 || set > options.match.sets ||
              game < 0 || !score || !validPoint(score)) {
                 return false;
              }
          var game_points = set_objects[set].points().filter(function(m) { return m.game == game });;

          var point = game_points.filter(function(p) { return p.score == score });
          if (!point.length && lazy) {
             point = game_points.filter(function(p) { return p.score == score.split('-').reverse().join('-') });
          }
          if (point.length) {
             return point[0]
          } else {
             return false;
          }
       }

      return match;

      function setObject() {

          // options which should be accessible via ACCESSORS
          var points = [];             // representation of every point in set
          var player_data = [[], []];  // player specific data
          var game_data = [];          // game specific data

          var options;
          resetSetOptions();

          // define empty container
          // function set() { };
          var set = {};

          // REUSABLE functions
          // ------------------

          function getScore(point_number) {
            if (!points[point_number]) return;

            var tiebreak;
            var point_score = points[point_number].score;
            var teams = match.teams();

            if (points[point_number].score.indexOf('T') >= 0) {
               var tscore = points[point_number].score.split('-').map(function(m) { return parseInt(m.replace('T', '')); });
               if (Math.max.apply(null, tscore) >= +options.set.tiebreak_to && Math.abs(tscore[0] - tscore[1]) > 1) {
                  var game = game_data[points[point_number].game];
                  point_score = '';
                  tiebreak = Number(Math.min.apply(null, tscore));

               } else {
                  var game = game_data[points[point_number].game - 1];
               }
            } else {
               if (points[point_number].score.indexOf('G') >= 0) {
                  var game = game_data[points[point_number].game];
                  point_score = '';
               } else {
                  var game = game_data[points[point_number].game - 1];
               }
            }
            var leader = game == undefined ? undefined : 
                         game.score[0] > game.score[1] ? 0 :
                         game.score[1] > game.score[0] ? 1 : undefined;
            var game_score  = game == undefined ? '0-0' :
                         game.score[0] + '-' + game.score[1];
            var legend = leader == undefined ? lastElement(metadata.players[0].name.split(' ')) + '/' + 
                                               lastElement(metadata.players[1].name.split(' ')) :
                                               teams[leader];

            if (tiebreak != undefined) game_score = game_score + '(' + tiebreak + ')';

            var complete = false;
            if (game) {
               var gtw = options.set.games / 2; // games to win
               if (options.set.tiebreak) {
                  // if one player has more than half of the games for set, i.e. 12/2 = 6 and 7 is greater than 6
                  if (game.score[0] == gtw + 1 || game.score[1] == gtw + 1) complete = true;

                  // if one player has half the games of set (i.e. 6 out of 12) and the other players score is less than, i.e. 6 - 1
                  if (game.score[0] == gtw && game.score[1] < gtw - 1) complete = true;
                  if (game.score[1] == gtw && game.score[0] < gtw - 1) complete = true;
               } else {
                  // Long Set -- SET NOT OVER UNTIL: one score is >= i.e. 6 and is 2 greater than other score
                  if ( (game.score[0] >= gtw || game.score[1] >= gtw) && (Math.abs(game.score[0] - game.score[1]) >= 2) ) complete = true;
               }
            } else {
               game = { score: [0, 0] };
            }

            // TODO: this needs to be beefed up to recognize end of supertiebreak set
            if (options.set.tiebreak_only) {
               game.score = tscore;
            }

            return { point_score: point_score, game_score: game_score, legend: legend, leader: leader, games: game.score, tiebreak: tiebreak, complete: complete };
          }

          var get_key = function(d) { return d && d.key; };

          function add_index(d, i) {
             for (var v=0; v<d.length; v++) { d[v]['_i'] = i; }
             return d;
          }

          function tiebreakGame() {
             var score = getScore(points.length - 1);
             var tiebreak = score ? options.set.tiebreak && score.games[0] == (options.set.games / 2) && score.games[1] == (options.set.games / 2) : false;
             return tiebreak ? true : false;
          }

          function determineWinner(score) {
             var last_score = points.length ? points[points.length - 1].score : '0-0';
             last_score = last_score.indexOf('G') >= 0 ? '0-0' : last_score;
             if (score.indexOf('T') >= 0) {
                var ctv = validTiebreakScoreValue(score);
                // winner is the score that equals 1
                if (ctv && last_score == '0-0') return ctv[0] == 1 ? 0 : 1;
                var last_ctv = validTiebreakScoreValue(last_score);
                // winner is whichever score has changed
                return ctv[0] != last_ctv[0] ? 0 : 1;
             } else {
                if (!options.set.advantage && last_score == '40-40') {
                   return noADprogression[last_score].indexOf(score);
                } else {
                   return progression[last_score].indexOf(score);
                }
             }
          }

          // determine the point score based on previous score and point winner
          function determineScore(winner) {
             var last_score = points.length ? points[points.length - 1].score : '0-0';
             last_score = last_score.indexOf('G') >= 0 ? '0-0' : last_score;
             var games = points.length ? points.map(function(m) { return m.score.indexOf('G') >= 0 ? 1 : 0; }).reduce(function(a, b){return a+b;}) : 0;

             if (options.set.tiebreak_only) { return tiebreakScore(); }
             if (games < options.set.games || !options.set.tiebreak) { 
                return scoreProgression(last_score, winner); 
             } else {
                return tiebreakScore();
             }

             function tiebreakScore() {
                if (last_score == '0-0') last_score = '0T-0T';
                var score = last_score.split('-');
                score[winner] = (parseInt(score[winner].replace('T','')) + 1) + 'T';
                return score.join('-');
             }
          }

          function scoreProgression(last_score, winner) {
             if (!options.set.advantage && last_score == '40-40') {
                return noADprogression[last_score][winner];
             } else {
                return progression[last_score][winner];
             }
          }

          function pushRow(value) {
             if (player_data[0].length && (lastElement(player_data[0]).pts == 0 || lastElement(player_data[1]).pts == 0)) {
                return { result: false, status: 'eos' }; // set has been completed
             }

             var player;
             var server = nextService();
             var rallyLength = function() {
                var serve_winner = this.serves && this.serves[0] ? (this.serves[0].indexOf('#') > 0 || this.serves[0].indexOf('*') > 0) : 0;
                var rl = this.rally ? this.rally.length : 0;
                rl += (rl > 0 || serve_winner) ? 1 : 0;
                return rl;
             }
             var point = { set: options.id, rallyLength: rallyLength };

             if ('01SAQDRP'.split('').indexOf(String(value)) >= 0 ) {

                player = value;
                if (['S', 'A', 'Q'].indexOf(value) >= 0) { player = server; }
                if (['D', 'R', 'P'].indexOf(value) >= 0) { player = 1 - server; }
                if (['Q', 'P'].indexOf(value) >= 0) { point.result = 'Penalty'; }
                if (value == 'A') point.result = 'Ace';
                if (value == 'D') point.result = 'Double Fault';

                point.score = determineScore(player);
                point.winner = parseInt(player);

                // was this ever necessary?
                if ('01'.indexOf(value) >= 0) {
                   point.code = (server == point.winner) ? 'S' : 'R';
                } else {
                   point.code = value;
                }

                points.push(point);
                return { result: true, point: point };
             }

             if (typeof value == 'object' && (value.score || '01SAQDRP'.split('').indexOf(String(value.winner)) >= 0)) {
                if (value.score) {
                   var sequence_score = checkSequence(value.score);
                   if (!sequence_score) return { result: false, error: 'sequence', score: value.score };
                   var winner = determineWinner(sequence_score);
                   if (value.winner && value.winner != winner) return { result: false, error: 'winner mismatch' };
                   value.winner = winner;
                   value.score = sequence_score;
                } else {
                   if (['S', 'A', 'Q'].indexOf(value.winner) >= 0) { value.winner = server; }
                   if (['D', 'R', 'P'].indexOf(value.winner) >= 0) { value.winner = 1 - server; }
                   if (['Q', 'P'].indexOf(value.winner) >= 0) { point.result = 'Penalty'; }
                   if (value.winner == 'A') point.result = 'Ace';
                   if (value.winner == 'D') point.result = 'Double Fault';
                   value.score = determineScore(value.winner);
                   value.winner = parseInt(value.winner);

                   // was this ever necessary?
                   if (value.code == undefined) {
                      if ('01'.indexOf(value.winner) >= 0) {
                          value.code = server == value.winner ? 'S' : 'R';
                      } else if ('SAQDRP'.indexOf(value.winner) >= 0) {
                          value.code = value.winner;
                      }
                   }
                }
                value.set = options.id;
                value.rallyLength = rallyLength;
                points.push(value);
                return { result: true, point: value };
             }

             var sequence_score = checkSequence(value);
             if (sequence_score) {
                point.winner = determineWinner(sequence_score), 
                point.score = sequence_score;
                points.push(point);
                return { result: true, point: point };
             } 
            
             return { result: false, error: 'invalid point', value: value };
          }

          function checkSequence(score) {
             if (typeof score == 'object') return false;
             score = score.replace(':', '-').split('-').map(function(m) { return m.trim(); }).join('-');
             var last_row = points.length ? points[points.length - 1] : { score: '0-0' };
             var last_score = typeof last_row == 'object' ? last_row.score : last_row;
             last_score = last_score.indexOf('G') >= 0 ? '0-0' : last_score;

             var tiebreak_game = tiebreakGame();
             var valid_point = (progression[last_score] && progression[last_score].indexOf(score) >= 0);

             if (score.indexOf('T') >= 0 && options.set.tiebreak && set.games().length >= options.set.games) {
                return checkTiebreak(score) ? score : false;
             }

             // need to handle tiebreak_game && valid_point && final_set no tiebreak
             if (tiebreak_game && !valid_point) {
                // point score doesn't include 'T', but should be a tiebreak
                if (score.indexOf('G') >= 0) {
                   var scores = score.split('-');
                   var winner = scores.indexOf('G');
                   var last_value = last_score.split('-')[winner].replace('T', '');
                   scores[winner] = parseInt(last_value) + 1;
                   score = scores.join('-');
                }
                // var tb_point = score.split('-').map(m => m + 'T').join('-');
                var tb_point = score.split('-').map(function(m) { return m + 'T' }).join('-');

                return checkTiebreak(tb_point) ? tb_point : false;
             }

             if ( last_score == undefined || last_score.indexOf('G') >= 0 || last_score.indexOf('T') >= 0) { last_score = '0-0'; }
             if (valid_point) { return score; }
             return false;

             function checkTiebreak(tb_point) {
                if (last_score == '0-0' && ['1T-0T', '0T-1T'].indexOf(tb_point) >= 0) { return true; }
                var ctv = validTiebreakScoreValue(tb_point);
                var last_ctv = validTiebreakScoreValue(last_score);
                // insure the total of the new tiebreak score is one more than previous total

                if (!ctv || !last_ctv) {
                   return false;
                }

                var valid_score = (ctv.reduce(function(a, b){return a+b}) == last_ctv.reduce(function(a, b){return a+b}) + 1);
                // insure that at least one of the tiebreak scores hasn't changed
                return valid_score && (ctv[0] == last_ctv[0] || ctv[1] == last_ctv[1]);
             }
          }

          function validTiebreakScoreValue(score) {
             var tees = score.split('-').map(function(m) { return m[m.length - 1] == 'T' ? 1 : 0 }).reduce(function(a, b){return a+b;});
             if (tees == 2) return score.split('T').join('').split('-').map(function(m) { return parseInt(m); });
             return false;
          }

          // calculate games within a single set
          function dataCalcs() {
             game_data = [];
             if (!points.length) return;

             var points_to_set = (options.set.games / 2) * 4;
             var line0 = [{pts: points_to_set }];
             var line1 = [{pts: points_to_set }];
             var pw = undefined;                  // point winner
             var lpw = undefined;                 // last point winner

             var pc  = [0, 0];                    // points counted towards pts
             var gp  = [0, 0];                    // game points accumulated
             var gpc = [0, 0];                    // game points counted toward game win

             var game_number = 0;
             var match_game_number = 0;
             var game_first_point = 0;            // index number in all points
             var game_count = [0, 0];

             var min_points_for_game = options.set.tiebreak_only ? +options.set.tiebreak_to : 4;
             var tiebreak_game = options.set.tiebreak_only;

             for (var i=0; i < points.length; i++) {
                // set point winner
                var pw = (typeof points[i] == 'object') ? String(points[i].winner) : String(points[i]);
                // if point winner is not a recognized type ignore and continue
                if (pw == '' || '01SAQDRP'.split('').indexOf(pw) < 0) { continue; }

                // points which will be added to points_to_set calculation (because of advantages)
                var addpts = {0: 0, 1: 0};

                if (checkNewGame()) {
                   // whomever won the last point won the last game, increment their total
                   if (lpw) { 
                      game_count[lpw] += 1; 
                      pc[lpw] += min_points_for_game;
                   }

                   // add the latest game to game_data
                   game_data.push({range: [game_first_point, i - 1], winner: lpw, score: game_count.slice(), tiebreak: tiebreak_game });

                   // initialize the next game
                   game_first_point = i;
                   game_number += 1;

                   // game scores are even
                   if (game_count[0] == game_count[1]) {
                      // checks for e.g. 5-5 and decrements points counted towards pts
                      // to reflect the fact that the end of the set is now further away
                    
                      // ATTEMPT TO IMPLEMENT TIEBREAK_AT games - 1
                      // if (options.set.tiebreak) {
                      //    if (game_count[0] == options.set.tiebreak_at) {
                      //       tiebreak_game = true;
                      //       min_points_for_game = +options.set.tiebreak_to;
                      //       pc[0] -= 3;
                      //       pc[1] -= 3;
                      //    } else if (options.set.tiebreak_at == (options.set.games / 2)) {
                      //       pc[0] -= min_points_for_game;
                      //       pc[1] -= min_points_for_game;
                      //    }
                      // } else {
                      //    tiebreak_game = false;
                      // }

                      if (game_count[0] == ((options.set.games - 2) / 2)) { 
                         pc[0] -= min_points_for_game;
                         pc[1] -= min_points_for_game;
                      } else if (game_count[0] == (options.set.games / 2) && options.set.tiebreak) {
                         tiebreak_game = true;
                         min_points_for_game = +options.set.tiebreak_to;
                         pc[0] -= 3;
                         pc[1] -= 3;
                      } else {
                         tiebreak_game = false;
                      }
                   }

                   // final set no tiebreak
                   if (game_count[0] + game_count[1] >= options.set.games && !options.set.tiebreak) { 
                      if (game_count[0] == game_count[1]) { 
                         pc[0] -= min_points_for_game;
                         pc[1] -= min_points_for_game;
                      }
                   }
                   gp  = [0, 0]; 
                   gpc = [0, 0]; 
                }

                var server = (parseInt(options.set.first_service) + game_number) % 2;
                if (tiebreak_game) {
                   var tiebreak_point = i - game_first_point;
                   var server = ((tiebreak_point + 1) % 4) < 2 ? server : 1 - server;
                }

                // transform pw to 0/1 notation
                if (['S', 'A', 'Q'].indexOf(pw) >= 0) { pw = server; }
                if (['D', 'R', 'P'].indexOf(pw) >= 0) { pw = 1 - server; }

                lpw = pw;
                gp[pw] += 1;

                if (options.set.advantage) {
                   if (Math.abs(gp[0] + gp[1] < (min_points_for_game * 2 - 2))) {
                      gpc[0] = (gp[1] == min_points_for_game) ? 0 : gp[0];
                      gpc[1] = (gp[0] == min_points_for_game) ? 0 : gp[1];

                      if (gp[0] == min_points_for_game - 1) {
                         addpts[1] = 1;
                      } else if (gp[0] == min_points_for_game - 1) {
                         addpts[0] = 1;
                      }

                   } else {
                      // e.g. deuce or beyond
                      if (gp[0] == gp[1]) {
                         // scores are equal
                         gpc[0] = min_points_for_game - 2;
                         gpc[1] = min_points_for_game - 2;
                      } else if (gp[0] > gp[1]) {
                         if (gp[0] == gp[1] + 2) {
                            gpc[0] = min_points_for_game;
                            gpc[1] = 0;
                         } else {
                            gpc[0] = min_points_for_game - 1;
                            gpc[1] = min_points_for_game - 3;
                         }
                      } else {
                         if (gp[1] == gp[0] + 2) {
                            gpc[1] = min_points_for_game;
                            gpc[0] = 0;
                         } else {
                            gpc[1] = min_points_for_game - 1;
                            gpc[0] = min_points_for_game - 3;
                         }
                      }
                   }
                } else {
                   gpc[0] = (gp[1] == min_points_for_game) ? 0 : gp[0];
                   gpc[1] = (gp[0] == min_points_for_game) ? 0 : gp[1];
                }

                var pts0 = points_to_set - (pc[0] + gpc[0]);
                var pts1 = points_to_set - (pc[1] + gpc[1]);

                line0.push( { pts: pts0 + addpts[0] });
                line1.push( { pts: pts1 + addpts[1] });

                points[i].server = server;
                checkBreakpoint(i);
                points[i].game = game_number;
             }
             if (checkNewGame()) { game_count[pw] += 1; }
             game_data.push({range: [game_first_point, i - 1], winner: pw, score: game_count.slice(), tiebreak: tiebreak_game });
             player_data = [line0, line1];

             function checkNewGame() {
                if (options.set.advantage) {
                   return new_game = Math.abs(gpc[0] - gpc[1]) == min_points_for_game;
                } else {
                   return new_game = gp[0] == min_points_for_game || gp[1] == min_points_for_game;
                }
             }
          }

          // add setpoint and matchpoint attributes
          function checkBreakpoint(point_number) {
             var score = points[point_number].score;
             var server = points[point_number].server;
             if (progression[score]) {
                if (progression[score][0].indexOf('G') >= 0) {
                   if (server == 1) { 
                      points[point_number].breakpoint = 0; 
                   } else {
                      points[point_number].gamepoint = 0;
                   }
                } else if (progression[score][1].indexOf('G') >= 0) {
                   if (server == 0) { 
                      points[point_number].breakpoint = 1; 
                   } else {
                      points[point_number].gamepoint = 1;
                   }
                }
             }
          }

          function checkOptions() {
             if (options.set.games % 2 != 0) options.set.games = 12;
          }

          // ACCESSORS

          // allows updating individual options and suboptions
          // while preserving state of other options
          set.options = function(values) {
              if (!arguments.length) return options;
              var vKeys = Object.keys(values);
              var oKeys = Object.keys(options);
              for (var k=0; k < vKeys.length; k++) {
                 if (oKeys.indexOf(vKeys[k]) >= 0) {
                    if (typeof(options[vKeys[k]]) == 'object') {
                       var sKeys = Object.keys(values[vKeys[k]]);
                       var osKeys = Object.keys(options[vKeys[k]]);
                       for (var sk=0; sk < sKeys.length; sk++) {
                          if (osKeys.indexOf(sKeys[sk]) >= 0) {
                             options[vKeys[k]][sKeys[sk]] = values[vKeys[k]][sKeys[sk]];
                          }
                       }
                    } else {
                       options[vKeys[k]] = values[vKeys[k]];
                    }
                 }
              }
              checkOptions();
              return set;
          }

          set.nextService = nextService;
          function nextService() {
             var last_point = lastElement(set.points());

             // if no points yet in set, return first_service value
             if (!last_point) {
                if (!options.set.tiebreak_only) {
                   return options.set.first_service;
                } else {
                   last_point = { game: 0, score: '0T-0T' };
                   var game_number = 0;
                }
             } else {
                // determine which game of the set
                var game_number = last_point.game;
                if (last_point.score.indexOf('G') >= 0) game_number += 1;
             }

             // check if last point was played in a tiebreak
             var tiebreak_game = (options.set.tiebreak_only || last_point.score.indexOf('T') >= 0) ? true : false;

             var server = (parseInt(options.set.first_service) + game_number) % 2;

             if (tiebreak_game) {
                var tb_scores = last_point.score.split('T').join('').split('-');
                var tiebreak_point = tb_scores.reduce(function(a, b) { return parseInt(a) + parseInt(b) });;
                var server = ((tiebreak_point + 1) % 4) < 2 ? server : 1 - server;

                // check for last point of tiebreak
                if (Math.abs(tb_scores[0] - tb_scores[1]) >= 2 
                    && (tb_scores[0] >= +options.set.tiebreak_to || tb_scores[1] >= +options.set.tiebreak_to)) {
                       game_number = last_point.game + 1;
                       server = (parseInt(options.set.first_service) + game_number) % 2;
                }
             }
             return server;
          }

         set.events = function(functions) {
              if (!arguments.length) return events;
              var fKeys = Object.keys(functions);
              var eKeys = Object.keys(events);
              for (var k=0; k < fKeys.length; k++) {
                 if (eKeys.indexOf(fKeys[k]) >= 0) events[fKeys[k]] = functions[fKeys[k]];
              }
              return set;
         }

          set.points = function(value) {
             if (!arguments.length) return points;
             points = [];
             player_data = [[],[]];
             game_data = [];
             return set.push(value);
          };

          set.score = function(point_number) {
             if (!arguments.length) {
                return getScore(points.length - 1);
             } else if (point_number < points.length) {
                return getScore(point_number);
             } else {
                return false;
             }
          }

          set.games = function() {
             return game_data;
          }

          set.player_data = function() {
             return player_data;
          }

          // add a point or array of points
          set.push = function(values) {

             if (!arguments.length) {
                console.log('no argument given');
                return false;
             }
             var _values = JSON.parse(JSON.stringify(values));

             if ( _values.constructor === Array ) {

                for (var i=0; i < _values.length; i++) {
                   var result = pushRow(_values[i]);
                   dataCalcs();
                   if (!result.result) { 
                      result.remnant = _values.slice(i);
                      break; 
                   }
                }
                
             } else {
                var result = pushRow(_values);
                dataCalcs();
             }
             return result;
          }

          set.pop = function() {
            var row = points.pop();
            if (!points.length) {
               set.reset()
            } else {
               dataCalcs();
            }
            return row;
          };

          set.reset = function() {
             points = [];
             player_data = [[], []];
             game_data = [];
             dataCalcs();
          }

          set.players = function(a, b) {
              if (!arguments.length) return [metadata.players[0].name, metadata.players[1].name];
              if (typeof a == 'string') metadata.players[0].name = a;
              if (typeof b == 'string') metadata.players[1].name = b;
              return set;
          }

          set.decoratePoint = function(index, decoration) {
             var decorations = 0;
             if (decoration.score && points[index].score && decoration.score != points[index].score) return false;
             var oKeys = Object.keys(decoration);
             for (var k=0; k < oKeys.length; k++) {
                // check for validity?
                points[index][oKeys[k]] = decoration[oKeys[k]];
                decorations += 1;
             }
             return decorations;
          }

          // END ACCESSORS

          function resetSetOptions() {
             options = {

               id: 0,
               players: { 0: 'Player One', 1: 'Player Two'},

               set: {
                  games: 12,
                  advantage: true,
                  tiebreak: true,
                  tiebreak_at: 6,
                  tiebreak_to: 7,
                  tiebreak_only: false,
                  first_service: undefined
               },
             }
          }

          
          // DATA
          var progression = { 
             '0-0'  : ['15-0',  '0-15'], '0-15' : ['15-15', '0-30'], '0-30' : ['15-30', '0-40'], '0-40' : ['15-40', '0-G'], 
             '15-0' : ['30-0',  '15-15'], '15-15': ['30-15', '15-30'], '15-30': ['30-30', '15-40'], '15-40': ['30-40', '15-G'], 
             '30-0' : ['40-0',  '30-15'], '30-15': ['40-15', '30-30'], '30-30': ['40-30', '30-40'], '30-40': ['40-40', '30-G'], 
             '40-0' : ['G-0',   '40-15'], '40-15': ['G-15',  '40-30'], '40-30': ['G-30',  '40-40'], '40-40': ['A-40',  '40-A'], 
             'A-40' : ['G-40',  '40-40'], '40-A' : ['40-40', '40-G']
          };

          var noADprogression = { '40-40' : ['G-40', '40-G'] };

          return set;

      } // set object

      function resetMetadata() {
         metadata = {
            players: { 
               0: { name: 'Player One', puid: '', fh: '', seed: '', rank: '', age: '', entry: '', ioc: '' },
               1: { name: 'Player Two', puid: '', fh: '', seed: '', rank: '', age: '', entry: '', ioc: '' },
               // names must be blank for getScore() to work properly
               2: { name: '', puid: '', fh: '', seed: '', rank: '', age: '', entry: '', ioc: '' },
               3: { name: '', puid: '', fh: '', seed: '', rank: '', age: '', entry: '', ioc: '' }
            },
            tournament: {
               tuid: '',
               name: '',
               tour: '',
               rank: '',
               surface: '',
               draw: '',
               round: '', 
            },
            match: {
               date: '',
               year: '',
               category: '',
               court: '',
               start_time: '',
               end_time: '',
               duration: '',
               status: '',      // e.g. retired, walk off W/O
               winner: '',      // when there is a status
               in_out: '',
               umpire: ''
            },
            charter: ''
         };
      }

      function resetOptions() {
         options = {
       
             id: 0, // to differentiate between multiple match objects
       
             match: {
                sets:                     3,
                description:              undefined,
                final_set_tiebreak:       true,
                final_set_tiebreak_to:    7,
                final_set_tiebreak_only:  false,
                first_service:            0
             },
       
             set: {
                games:                    12,
                advantage:                true,
                lets:                     true,
                tiebreak:                 true,
                tiebreak_at:              6,
                tiebreak_to:              7
             },
          }
      }

   }  // match object

   mo.validGames = validGames;
   function validGames(game) {
      if (Array.isArray(game)) game = game.join('');
      if (game.indexOf(',') > 0) game = game.split(',').join('');
      if (game.indexOf(';') > 0) game = game.split(';').join('');
      var match = matchObject();
      match.options({set: {first_service: 0}});
      match.points(game.split(''));
      if (lastElement(match.points()).score.indexOf('G') >= 0) {
         return { wp: match.winProgression(), gp: match.gameProgression(), score: match.score().match_score };
      } else {
         return false;
      }
   }

   mo.validSet = validSet;
   function validSet(set) {
      var errors = [];
      if (set.indexOf('.') >= 0) {
         errors.push('More than one set submitted');
         return false;
      }
      var outcome = true;
      if (set.indexOf(';') > 0) {
         var games = set.split(';');
         for (var g=0; g < games.length; g++) {
            if (games[g].indexOf('/') < 0) {
               if (!validGames(games[g])) {
                  outcome = false;
                  errors.push('Game ' + g + ' is invalid: ' + games[g]);
               }
            } else {
               if (!validTiebreak(games[g])) {
                  outcome = false;
                  errors.push('Game ' + g + ' is an invalid tiebreak: ' + games[g]);
               }
            }
         }
      } 

      // remove all expected separators
      set = set.split('/').join('');
      set = set.split(';').join('');
      set = set.split(',').join('');

      try {
         var match = matchObject();
         match.options({set: {first_service: 0}});
         match.points(set.split(''));
         var score = match.score();
         if (score.sets.length != 1 || !score.sets[0].complete) outcome = false;
      }

      catch (err) {
         console.log('invalid characters in set string');
         outcome = false;
      }

      if (outcome) {
         return { wp: match.winProgression(), gp: match.gameProgression(), score: match.score().match_score };
      } else {
         return { errors: errors };
      }
   }

   mo.validTiebreak = validTiebreak;
   function validTiebreak(tiebreak) {
      var match = matchObject();
      match.options({set: {first_service: 0}});
      match.push('000011110000111100001111000011110000111100001111'.split(''));
      tiebreak = tiebreak.split('/').join('');
      tiebreak = tiebreak.split(',').join('');
      match.push(tiebreak.split(''));
      var score = match.score();
      if (score.sets.length == 1 && score.sets[0].complete) return true;
      return false;
   }

   function lastElement(arr) { return arr[arr.length - 1]; }

   if (typeof define === "function" && define.amd) define(mo); else if (typeof module === "object" && module.exports) module.exports = mo;
   this.mo = mo;
 
}();
   
!function() { 

   // module container
   var sequences = {};

   sequences.stripNonMCP = function(value) {
      if (!value) { return ''; }
      // first remove all bracketed segments
      value = value.replace(/ *\([^)]*\) */g, ""); 
      value = value.replace(/ *\[[^]]*\] */g, ""); 
      value = value.replace(/ *\{[^}]*\} */g, ""); 
      return value;
   }

   sequences.pointParser = pointParser;
   function pointParser(serves) {
      var lets = [0, 0];

      // TODO: situation where there is a blank first serve should be handled by mcpP2.js
      if (serves.length > 1 && !serves[0]) serves = [serves[1]];

      if (serves[0]) {
         while(serves[0][0] == 'c') {
            lets[0] += 1;
            serves[0] = serves[0].slice(1)
         }
      }
      if (serves[1]) {
         while(serves[1][0] == 'c') {
            lets[1] += 1;
            serves[1] = serves[1].slice(1)
         }
      }
      var code = serves.join('|');
      // parse first serve in case it ends the point
      // sometimes there is erroneous 2nd serve data
      var s1result = shotParser(serves[0], 1);
      if (lets[0]) s1result.lets = s1result.lets ? s1result.lets + lets[0] : lets[0];

      if (s1result.winner == 'S' || !serves[1] ) {
         s1result.serve = 1;
         s1result.code = genPointCode(serves, s1result);
         return s1result;
      }

      s2result = shotParser(serves[1], 2);
      if (lets[1]) s2result.lets = s2result.lets ? s2result.lets + lets[1] : lets[1];
      s2result.serve = 2;
      s2result.first_serve = { serves: s1result.serves, }
      if (s1result.lets) s2result.first_serve.lets = s1result.lets;
      if (s1result.error) s2result.first_serve.error = s1result.error;
      if (s1result.parse_notes) s2result.first_serve.parse_notes = s1result.parse_notes;

      s2result.code = genPointCode(serves, s2result);
      return s2result;
   }

   function genPointCode(serves, p) {
      var code = p.first_serve ? p.first_serve.serves.join('') + '|' : '';
      code += (p.serves && p.serves.length) ? p.serves.join('') : p.winner ? p.winner : '';
      if (p.rally && p.rally.length) { code += p.rally.join(''); }
      return code;
   }

   sequences.shotParser = shotParser;
   function shotParser(shot_sequence, which_serve) {

      var point;
      var parsed_shots = analyzeSequence(shot_sequence);
      if (!parsed_shots) return '';

      var rallyLength = function() {
         var serve_winner = this.serves && this.serves[0] ? (this.serves[0].indexOf('#') > 0 || this.serves[0].indexOf('*') > 0) : 0;
         var rl = this.rally ? this.rally.length : 0;
         rl += (rl > 0 || serve_winner) ? 1 : 0;
         return rl;
      }
      parsed_shots.rallyLength = rallyLength;

      if (['A', 'Q', 'S'].indexOf(parsed_shots.result) >= 0) {
         parsed_shots.winner = 'S';
         return parsed_shots;
      }

      if (['D', 'P', 'R'].indexOf(parsed_shots.result) >= 0) {
         parsed_shots.winner = 'R';
         return parsed_shots;
      }

      // if there is not a terminator for second serve Receiver is always the winner
      if (!parsed_shots.terminator) {
         if (!shotFault(parsed_shots.serves[0]) && parsed_shots.serves.length > 2) {
            parsed_shots.winner = 'R'; 
            return parsed_shots;
         }
      }

      // even number of shots implies Receiver made final shot
      // var last_player = (parsed_shots.serves.length + parsed_shots.rally.length) % 2 == 0 ? 'R' : 'S';
      // var last_player = (parsed_shots.serves.length - parsed_shots.lets + parsed_shots.rally.length) % 2 == 0 ? 'R' : 'S';
      var last_player = (parsed_shots.serves.length + parsed_shots.rally.length) < 1 ? '' :
         (parsed_shots.serves.length - parsed_shots.lets + parsed_shots.rally.length) % 2 == 0 ? 'R' : 'S';
      var final_shot = parsed_shots.rally.length ? parsed_shots.rally[parsed_shots.rally.length - 1] : parsed_shots.serves[parsed_shots.serves.length - 1];

      // if there is no shot in the sequence, continue to next shot_sequence
      if (!final_shot) { 
         return { continue: true, lets: parsed_shots.lets };
      }

      // if there is no rally
      if (!parsed_shots.rally.length) {
         if (parsed_shots.terminator == '*') { 
            parsed_shots.result = 'Ace'; 
            parsed_shots.winner = 'S';
         } else if (parsed_shots.terminator == '#') { 
            parsed_shots.result = 'Serve Winner'; 
            parsed_shots.winner = 'S';
         } else if (shotFault(parsed_shots.serves[0])) {
            parsed_shots.error = assignError(parsed_shots.serves[0]);
            if (which_serve == 2) {
               parsed_shots.result = 'Double Fault';
               parsed_shots.winner = 'R';
            }
         } else {
            parsed_shots.parse_notes = 'treated as a fault';
            if (which_serve == 2) {
               parsed_shots.result = 'Double Fault';
               parsed_shots.winner = 'R';
            }
         }
         return parsed_shots;
      }

      if (final_shot.indexOf('#') >= 0) {
         parsed_shots.result = 'Forced Error';
         parsed_shots.error = assignError(final_shot);
         if (!shotFault(parsed_shots.serves[0])) {
            parsed_shots.winner = (last_player == 'R') ? 'S' : 'R';
         } else {
            // doesn't make sense, but this is how the spreadsheet does it...
            parsed_shots.winner = 'S';
         }
      } else if (final_shot.indexOf('*') >= 0) {
         parsed_shots.result = 'Winner';
         parsed_shots.winner = last_player;
      } else if (final_shot.indexOf('@') >= 0) {
         parsed_shots.result = 'Unforced Error';
         parsed_shots.error = assignError(final_shot);
         if (!shotFault(parsed_shots.serves[0])) {
            parsed_shots.winner = (last_player == 'R') ? 'S' : 'R';
         } else {
            // doesn't make sense, but this is how the spreadsheet does it...
            parsed_shots.winner = 'R';
         }
      } else if (!shotFault(parsed_shots.serves[0])) {
         if (parsed_shots.serves.length && parsed_shots.rally.length) {
            parsed_shots.parse_notes = 'no terminator: receiver wins point';
            parsed_shots.result = 'Unknown';
            parsed_shots.winner = 'R';
         } else if (parsed_shots.rally.length == 1 && shotFault(final_shot)) {
            parsed_shots.error = assignError(final_shot);
            parsed_shots.winner = (last_player == 'R') ? 'S' : 'R';
         }
      } else if (parsed_shots.rally.length == 1 && shotFault(final_shot)) {
         parsed_shots.error = assignError(final_shot);
         parsed_shots.winner = (last_player == 'R') ? 'S' : 'R';
      }

      return parsed_shots;
   }

   function assignError(shot) {
      var errors = {'n': 'Net', 'w': 'Out Wide', 'd': 'Out Long', 'x': 'Out Wide and Long', 'g': 'Foot Fault', 'e': 'Unknown', '!': 'Shank' };
      var error = shotFault(shot);
      if (error) return errors[error];
   }

   sequences.analyzeSequence = analyzeSequence;
   function analyzeSequence(shot_sequence) {
      if (!shot_sequence) { return; }
      var result;
      var terminator;
      var ignored_shots;

      // count lets
      var lets = shot_sequence.split('c').length - 1;
      // remove all lets
      shot_sequence = shot_sequence.split('c').join('');

      var shots = shotSplitter(shot_sequence);
      var trimmed_shots = shots;

      // eliminate any sequence data following terminator
      for (var s = shots.length - 1; s>=0; s--) {
         terminator = containsTerminator(shots[s]);
         if (terminator) {
            trimmed_shots = shots.slice(0, s + 1);
            ignored_shots = shots.slice(s + 1);
            result = shots[s];
            break;
         }
      }
      var serves = findServes(trimmed_shots);
      var rally = serves.length ? trimmed_shots.slice(serves.length) : trimmed_shots;

      if (!terminator && !serves.length && rally.length == 1 && ['A', 'D', 'S', 'P', 'Q', 'R'].indexOf(rally[0]) >= 0) {
         result = rally[0];
         rally = [];
      }
      var analysis = { serves: serves, rally: rally };
      analysis.lets = lets || 0;
      if (terminator) analysis.terminator = terminator;
      if (result) { 
         if (result == 'A') {
            analysis.result = 'Ace';
            analysis.terminator = '*';
            analysis.serves = ['0*'];
            analysis.winner = 'S';
         } else if (result == 'D') {
            analysis.result = 'Double Fault';
            analysis.first_serve = { serves: ['0e'], lets: 0 }
            analysis.serves = ['0e'];
            analysis.winner = 'R';
         } else {
            analysis.result = result; 
         }
      }
      if (ignored_shots && ignored_shots.length) analysis.ignored = ignored_shots;

      return analysis;
   }

   sequences.describePoint = describePoint;
   function describePoint(point) {
      if (!point) {
         return false; 
      } else if (!point.serves || !point.rally) {
         if (point.code) {
            var sequence = point.code.split('|').join('');;
         } else {
            return false;
         }
      } else if (point.code) {
         var sequence = point.code.split('|').join('');
      } else if (point.serves.length || point.rally.length) {
         var sequence = point.serves.join('') + point.rally.join('');
      }
      return describeSequence(sequence, point.score);
   }

   sequences.describeOutcome = describeOutcome;
   function describeOutcome(point, players) {
     var winners = ['Ace', 'Winner', 'Serve Winner'];
     var errors = ['Forced Error', 'Unforced Error', 'Double Fault', 'Penalty'];
     var message = '';
     if (players != undefined && point.result) {
        if (winners.indexOf(point.result) >= 0) {
           var article = point.result == 'Ace' ? 'an' : 'a';
           message += players[point.winner] + ' won the point with ' + article + ' ' + point.result;
        } else if (errors.indexOf(point.result) >= 0) {
           message += players[1 - point.winner] + ' lost the point with a ' + point.result;
        } else if (point.parse_notes) {
           message += 'Point assigned to ' + players[point.winner] + ' (' + point.parse_notes + ')';
        }
        if (typeof point.rallyLength == 'function') {
           message += '. Rally: ' + point.rallyLength();
        }
        return message;
     } else if (point.winner != undefined) {
           message += players[point.winner] + ' won the point';
           return message;
     } else if (point.code) {
        return sequences.describePoint(point);
     }
     return "&nbsp;";
   }

   sequences.describeSequence = describeSequence;
   function describeSequence(sequence, point) {
      var description = [];;
      var shots = shotSplitter(sequence);
      var origin = 0;
      var incoming_direction = 0;
      if (point) {
         if (deuce_court_points.indexOf(point) >= 0) {
            origin = 1;
            incoming_direction = 1;
         } else if (ad_court_points.indexOf(point) >= 0) {
            origin = 3;
            incoming_direction = 3;
         }
      }
      shots.forEach(function(shot) {
         var analysis = decipherShot(shot, point, incoming_direction, origin);
         description.push(analysis.sequence);
         incoming_direction = analysis.direction;
      });
      return description;
   }

   sequences.decipherSequence = decipherSequence;
   function decipherSequence(sequence, point) {
      var attributes = [];;
      var shots = shotSplitter(sequence);
      var origin = 0;
      var incoming_direction = 0;
      if (point) {
         if (deuce_court_points.indexOf(point) >= 0) {
            origin = 1;
            incoming_direction = 1;
         } else if (ad_court_points.indexOf(point) >= 0) {
            origin = 3;
            incoming_direction = 3;
         }
      }
      shots.forEach(function(shot) {
         var analysis = decipherShot(shot, point, incoming_direction, origin);
         attributes.push(analysis.attributes);
         incoming_direction = analysis.direction;
      });
      return attributes;
   }

   sequences.decipherShot = decipherShot;
   function decipherShot(shot, point, incoming_direction, origin) {
      // point is needed to determine side from which serve originated
      // incoming_direction is the direction of the previous shot
      // need to add player position from previous shot
      // so that inside-in and inside-out can be properly calculated
     
      var assignments = {
         'S': 'Server won the point',
         'P': 'Penalty against Server',
         'Q': 'Penalty against Receiver',
         'R': 'Receiver won the point',
         'A': 'Server won the point with an Ace',
         'D': 'Server lost the point with a Double Fault'
      };
      var errors = {
         'n': 'Netted',
         'w': 'Out Wide',
         'd': 'Out Long',
         'x': 'Out Wide and Long',
         'g': 'Foot Fault',
         'e': 'Unknown Error',
         '!': 'Shank' 
      };
      var serves = {
         '0':  'Unknown Serve',
         '4':  'Wide Serve',
         '5':  'Body Serve',
         '6':  'T Serve'
      };
      var forehand = {
         'f':  'Forehand',
         'r':  'Forehand Slice',
         'v':  'Forehand Volley',
         'o':  'Overhead Smash',
         'u':  'Forehand Drop Shot',
         'l':  'Forehand Lob',
         'h':  'Forehand Half-volley',
         'j':  'Forehand Drive Volley'
      };
      var backhand = {
         'b':  'Backhand',
         's':  'Backhand Slice',
         'z':  'Backhand Volley',
         'p':  'Backhand Overhead Smash',
         'y':  'Backhand Drop Shot',
         'm':  'Backhand Lob',
         'i':  'Backhand Half-volley',
         'k':  'Backhand Drive Volley'
      };
      var other = {
         't':  'Trick Shot',
         'q':  'Unknown Shot'
      };
      var directions = {
         '1':  'to Right Hander Forehand',
         '2':  'Down the Middle',
         '3':  'to Right Hander Backhand'
      };
      var depths = {
         '7':  '(shallow)',
         '8':  '(deep)',
         '9':  '(very deep)'
      };
      var terminators = {
         '*':  'Winner',
         '#':  'Forced Error',
         '@':  'Unforced Error'
      };
      var positions = {
         '+': 'approach shot',
         '-': 'at the Net',
         '=': 'at the Baseline'
      };

      var incidentals = {
         ';': '(net cord)',
         'c': '(Let)'
      }

      var strokes = {};
      Object.keys(forehand).forEach(function(e) { strokes[e] = forehand[e] });
      Object.keys(backhand).forEach(function(e) { strokes[e] = backhand[e] });
      Object.keys(other).forEach(function(e) { strokes[e] = other[e] });

      // create aggregate object
      var babel = {};
      Object.keys(errors).forEach(function(e) { babel[e] = errors[e] });
      Object.keys(serves).forEach(function(e) { babel[e] = serves[e] });
      Object.keys(strokes).forEach(function(e) { babel[e] = strokes[e] });
      Object.keys(directions).forEach(function(e) { babel[e] = directions[e] });
      Object.keys(depths).forEach(function(e) { babel[e] = depths[e] });
      Object.keys(terminators).forEach(function(e) { babel[e] = terminators[e] });
      Object.keys(positions).forEach(function(e) { babel[e] = positions[e] });
      Object.keys(incidentals).forEach(function(e) { babel[e] = incidentals[e] });

      // create sequence string from shot as entered by coder
      var full_sequence = shot.split('').map(function(m) {
         return babel[m] ? babel[m] + ', ' : ''
      }).join('');
      full_sequence = full_sequence.length > 2 ? full_sequence.slice(0, full_sequence.length - 2) : '';

      // break shot down into descriptive elements
      var sequence;
      var direction;
      var stroke = shot[0];
      var attributes = {
         'Stroke': 'Unknown',
         'Stroke Type': 'Unknown',
         'End Point': 'In',
         'Result': 'In',
         'Trajectory': 'Unknown'
      };
      if (assignments[stroke]) {
         sequence = assignments[stroke];
      } else if (serves[stroke]) {
         attributes['Stroke'] = 'Serve';
         sequence = serves[stroke];
         if (shot.indexOf('+') > 0) sequence += '; net approach';
         var fault = shotFault(shot);
         if (fault) {
            attributes['Result'] = errors[fault];
            sequence += '; ' + errors[fault];
         }
         var terminator = containsTerminator(shot);
         if (terminator) {
            if (terminator == '*') {
               attributes['Result'] = 'Ace';
               sequence += '; Ace';
            }
            if (terminator == '#') {
               attributes['Result'] = 'Serve Winner';
               sequence += '; Serve Winner';
            }
         }
         if (point) {
            if (stroke == 6) {
               attributes['Trajectory'] = 'Centerline';
               direction = 2;
            } else if (deuce_court_points.indexOf(point) >= 0) {
               attributes['Trajectory'] = 'Left';
               direction = 1;
            } else if (ad_court_points.indexOf(point) >= 0) {
               attributes['Trajectory'] = 'Right';
               direction = 3;
            }
         } else {
            direction = 0;
         }
      // need to add position information as well as incoming direction
      } else if (strokes[stroke]) {
         var hand;
         if (forehand[stroke]) { 
            attributes['Stroke'] = 'Forehand';
            var stroke_type = forehand[stroke].replace('Forehand', '').trim();
            attributes['Stroke Type'] = stroke_type || "Drive";
            hand = 'forehand'; 
         }
         if (backhand[stroke]) { 
            attributes['Stroke'] = 'Backhand';
            var stroke_type = backhand[stroke].replace('Backhand', '').trim();
            attributes['Stroke Type'] = stroke_type || "Drive";
            hand = 'backhand'; 
         }
         sequence = strokes[stroke];
         var position = shotPosition(shot);
         if (position) sequence += ' ' + positions[position];
         var incidental = shotIncidental(shot);
         if (incidental) sequence += ' ' + incidentals[incidental];
         var direction = shotDirection(shot);
         if (direction) {
            if (direction == 1 && incoming_direction == 1 || direction == 3 && incoming_direction == 3) {
               attributes['Trajectory'] = 'Crosscourt';
               sequence += ' crosscourt';
            } else if (direction == 3 && incoming_direction == 1 || direction == 1 && incoming_direction == 3) {
               attributes['Trajectory'] = 'Line';
               sequence += ' down the line';
            } else if (direction == 2 && incoming_direction == 2) {
               attributes['Trajectory'] = 'Centerline';
               sequence += ' down the middle';
            } else if (direction == 2) {
               attributes['Trajectory'] = 'Middle';
               sequence += ' to the middle';
            } else if (direction == 3) {
               attributes['Trajectory'] = 'Right';
               sequence += ' to the right side';
            } else if (direction == 1) {
               attributes['Trajectory'] = 'Left';
               sequence += ' to the left side';
            }
         }
         var depth = shotDepth(shot);
         var shot_depth = depth ? depths[depth] : '';
         if (shot_depth) {
            attributes['End Point'] = shot_depth;
            sequence += '; ' + shot_depth;
         }

         var fault = shotFault(shot);
         if (fault) {
            attributes['End Point'] = errors[fault];
            sequence += '; ' + errors[fault];
         }
         var terminator = containsTerminator(shot);
         if (terminator) {
            attributes['Result'] = terminators[terminator];
            sequence += '; ' + terminators[terminator];
         }
      } else {
         var fault = shotFault(shot);
         if (fault) sequence = errors[fault];
      }

      return { sequence: sequence, full_sequence: full_sequence, direction: direction, attributes: attributes };
   }

   function shotIncidental(shot) {
      if (!shot) return false;
      var incidentals = ';'.split('');
      for (var d=0; d < incidentals.length; d++) {
         if (shot.indexOf(incidentals[d]) >= 0) return incidentals[d];
      }
      return false;
   }

   function shotPosition(shot) {
      if (!shot) return false;
      var positions = '+-='.split('');
      for (var d=0; d < positions.length; d++) {
         if (shot.indexOf(positions[d]) >= 0) return positions[d];
      }
      return false;
   }

   function shotDepth(shot) {
      if (!shot) return false;
      var depths = '789'.split('');
      for (var d=0; d < depths.length; d++) {
         if (shot.indexOf(depths[d]) >= 0) return depths[d];
      }
      return false;
   }

   function shotDirection(shot) {
      if (!shot) return false;
      var directions = '123'.split('');
      for (var d=0; d < directions.length; d++) {
         if (shot.indexOf(directions[d]) >= 0) return directions[d];
      }
      return false;
   }

   sequences.shotFault = shotFault;
   function shotFault(shot) {
      if (!shot) return false;
      var faults = 'nwdxge!'.split('');
      for (var f=0; f < faults.length; f++) {
         if (shot.indexOf(faults[f]) >= 0) return faults[f];
      }
      return false;
   }

   function shotType(shot) {
      if (!shot) return false;
      var shot_types = '0456fbrsvzopuylmhijktq'.split('');
      for (var f=0; f < shot_types.length; f++) {
         if (shot.indexOf(shot_types[f]) >= 0) return shot_types[f];
      }
      return false;
   }

   sequences.containsTerminator = containsTerminator;
   function containsTerminator(shot, terminators) {
      if (!shot) return false;
      var terminators = terminators || ['c', '#', '@', '*'];
      for (var t=0; t < terminators.length; t++) {
         if (shot.indexOf(terminators[t]) >= 0) return terminators[t];
      }
      return false;
   }

   sequences.findServes = findServes;
   function findServes(shots) {
      if (!shots) return [];
      var serves = [];
      var rally = [];
      var serve_codes = '0456cg'.split('');
      for (var s=0; s < shots.length; s++) {
         if (shots[s].length && serve_codes.indexOf(shots[s][0]) >= 0) {
            serves.push(shots[s]);
         }
      }
      return serves;
   }

   sequences.shotSplitter = shotSplitter;
   function shotSplitter(point) {
      // var strokes = 'SPQR0456fbrsvzopuylmhijktq';
      var strokes = 'ADSPQRfbrsvzopuylmhijktq';
      var stroke_array = strokes.split('');
      var shots = [];

      // IS THIS NECESSARY?  ALL POINTS SHOULD START WITH SERVE..
      // remove any leading characters that are not considered strokes
      var leading_characters = true;
      while(leading_characters) { 
         if (point && '+-='.indexOf(point[0]) >= 0) {
            point = point.slice(1); 
         } else {
            leading_characters = false;
         }
      }

      var fodder = point.slice();
      var nextfodder;
      var in_brackets = false;
      while(fodder.length) {
         for (var l=1; l < fodder.length; l++) {
            if ('([{'.indexOf(fodder[l]) >= 0) { in_brackets = true; }
            if (')]}'.indexOf(fodder[l]) >= 0) { in_brackets = false; }
            if (!in_brackets && stroke_array.indexOf(fodder[l]) >= 0) { 
               shots.push(fodder.slice(0,l)); 
               nextfodder = fodder.slice(l); 
               break;
            }
         }
         if (l == fodder.length) {
            shots.push(fodder.slice(0,l)); 
            nextfodder = fodder.slice(l); 
         }
         fodder = nextfodder;
      }
      return shots;
   }

   var deuce_court_points = ['0-15', '15-0', '15-30', '30-15', '30-40', '40-30', '15-G', 'G-15'];
   var ad_court_points = ['15-15', '0-30', '30-30', '40-40', '15-40', '40-15', 'A-40', '40-A'];

   // shot pattern is an array of shots
   sequences.findShotPattern = findShotPattern;
   function findShotPattern(points, shot_pattern, reverse) {
      var matched_points = [];
      for (var p=0; p < points.length; p++) {
         var point = points[p];
         var point_shots = [];

         // take only the last shot in case mulptiple were coded
         if (point.serves) point_shots.push(point.serves[point.serves.length - 1]);
         // if (point.rally && point.rally.length) point.rally.forEach(e => point_shots.push(e));
         if (point.rally && point.rally.length) point.rally.forEach(function(e) { point_shots.push(e) });

         // saearch pattern is greater than # of shots in point
         if (shot_pattern.length > point_shots.length) continue;

         var fail = false;
         for (var s=0; s < shot_pattern.length; s++) {
            var shot_index = reverse ? point_shots.length - 1 - s : s;
            var pattern_index = reverse ? shot_pattern.length - 1 - s : s;
            var shot = point_shots[shot_index];
            var pattern = shot_pattern[pattern_index];
            if (!equalShots(shot, pattern)) fail = true;
         }
         if (!fail) matched_points.push(point);
      }
      return matched_points;

      function equalShots(shot, pattern) {
         var equal = true;
         if (shotType(pattern) && shotType(shot) != shotType(pattern)) equal = false;
         if (containsTerminator(pattern) && containsTerminator(shot) != containsTerminator(pattern)) equal = false;
         if (shotDirection(pattern) && shotDirection(shot) != shotDirection(pattern)) equal = false;
         if (shotDepth(pattern) && shotDepth(shot) != shotDepth(pattern)) equal = false;
         if (shotPosition(pattern) && shotPosition(shot) != shotPosition(pattern)) equal = false;
         if (shotFault(pattern) && shotFault(shot) != shotFault(pattern)) equal = false;
         return equal;
      }
   }

   // SEQUENCE VALIDATION ----------

   sequences.validator = validator;
   function validator(sequence) {
      if (!sequence) return { valid: true, complete: true, message: '' };
      var analysis = completeService(sequence);

      if (!validCharacters(sequence)) {
         return { valid: false, complete: analysis.complete, message: 'Invalid Characters' };
      }
      if (analysis.shots.length && containsDuplicates(analysis.shots)) {
         return { valid: false, complete: analysis.complete, message: 'Duplicate Characters' };
      }
      if (analysis.shots.length && !checkService(analysis.shots, analysis.lets)) {
         return { valid: false, complete: analysis.complete, message: 'Invalid Service' };
      }
      if (analysis.shots.length && misplacedError(analysis.shots)) {
         return { valid: false, complete: analysis.complete, message: 'Terminator Misplaced' };
      }
      if (analysis.shots.length && mismatchedError(analysis.shots)) {
         return { valid: false, complete: analysis.complete, message: 'Contradictory Terminator' };
      }

      return { valid: true, complete: analysis.complete, lets: analysis.lets, fault: analysis.fault, message: analysis.message };
   }

   function unique(string) {
      if (!string || typeof string != 'string') return;
      return string.split('').filter(function(item, i, self) { return self.lastIndexOf(item) == i; }).join('');
   }

   function isLet(shot) {
      if (!shot) return false;
      var lets = shot ? (shot.match(/c/g)||[]).length : 0;
      if (shot.indexOf('c') >= 0) return lets;
      return false;
   }

   function completeService(value) {

      var lets = 0;
      var shots = sequences.shotSplitter(value);

      while(unique(shots[0]) == 'c') { 
         lets += shots[0].length;
         shots = shots.slice(1) 
      }

      while(isLet(shots[0])) { 
         lets += 1;
         shots = shots.slice(1) 
      }

      if (shots.length > 1 && !containsTerminator(value, ['c', '@', '#', '*'])) {
         return { shots: shots, lets: lets, complete: false, message: 'No Terminator' };
      } else if (shots.length == 1 && shots[0].length == 1 && ['A', 'D', 'S', 'P', 'Q', 'R'].indexOf(shots[0]) >= 0) {
         return { shots: shots, lets: lets, complete: true, message: '' };
      } else if ( containsTerminator(value, ['#', '*']) ) {
         return { shots: shots, lets: lets, complete: true, message: '' };
      } else if ( shots.length > 1 && containsTerminator(value, ['@']) ) {
         return { shots: shots, lets: lets, complete: true, message: '' };
      } else if ( shots.length == 1 && !containsTerminator(value, ['#', '*']) ) {
         return { shots: shots, lets: lets, complete: true, fault: true, message: 'Service Fault' };
      }
      return { shots: shots, lets: lets, complete: false, message: '' };
   }

   function validCharacters(service) {
      var valid_chars = "cADSPQRnwdxge!0456frvoulhjbszpymiktq123789*#@+-=;";
      var chars = service.split('');
      for (var c=0; c < chars.length; c++) {
         if (valid_chars.indexOf(chars[c]) < 0) return false;
      }
      return true;
   }

   function checkService(shots, lets) {
      var serve = shots[0];

      // check that service exists in first shot
      if ("ADSPQR".indexOf(serve) >= 0 && serve.length == 1 && shots.length == 1) return true;
      if (!sequences.findServes(serve).length && !lets) return false;
      for (var c=1; c < serve.length; c++) { if ("123789".indexOf(serve[c]) >= 0) return false; }

      // check for service (or let) in subsequent shots
      for (var s=1; s < shots.length; s++) {
         if (sequences.findServes(shots[s]).length) return false;
         if (shots[s].indexOf('c') >= 0) return false;
      }
      return true;
   }

   function mismatchedError(shots) {
      var last_shot = shots[shots.length - 1];
      if ((last_shot.indexOf('*') >= 0) && sequences.shotFault(last_shot)) return true;
      if ((last_shot.indexOf('c') >= 0) && sequences.shotFault(last_shot)) return true;
      return false;
   }

   function misplacedError(shots) {
      if (shots.length < 2) return false;
      for (var s=0; s < shots.length - 1; s++) {
         if (sequences.shotFault(shots[s])) return true;
         if (sequences.containsTerminator(shots[s])) return true;
      }
      return false;
   }

   function containsDuplicates(shots) {
      for (var s=0; s < shots.length; s++) {
         // ignore duplicate lets
         var tshot = shots[s].split('c').join('');
         if (hasDuplicates(tshot)) return true;
      }
      return false;
   }

   function hasDuplicates(array) {
      return (new Set(array)).size !== array.length;
   }

   // SEQUENCE VALIDATION ---------- END
   
   if (typeof define === "function" && define.amd) define(sequences); else if (typeof module === "object" && module.exports) module.exports = sequences;
   this.sequences = sequences;
 
}();
// TODO: make counters into point accumulators

!function() {

   // module container
   var statistics = {};

   statistics.selectPoints = selectPoints;
   function selectPoints(points, selection) {
      if (!selection) return points;
      var selected_points = [];

      var score_groupings = {};
      score_groupings['Deuce Court'] = ['0-15', '15-0', '15-30', '30-15', '30-40', '40-30', '15-G', 'G-15'];
      score_groupings['Ad Court']    = ['15-15', '0-30', '30-30', '40-40', '15-40', '40-15', 'A-40', '40-A'];

      // overload score_selection to accept either arrays of scores or predefined named array of scores
      if (selection.scores) {
         if (typeof selection.scores == 'string' && Object.keys(score_groupings).indexOf(selection.scores) >= 0) {
            var score_selection = score_groupings[selection.scores];
         } else {
            var score_selection = selection.scores;
         }
      }

      var selection_keys = (typeof selection == 'object') ? Object.keys(selection) : undefined;

      for (var p=0; p < points.length; p++) {
         var point = points[p];

         if (score_selection && score_selection.indexOf(point.score) < 0) continue;

         if (selection.server != undefined     && point.server != selection.server) continue;
         if (selection.breakpoint != undefined && point.breakpoint != selection.breakpoint) continue;
         if (selection.gamepoint != undefined  && point.gamepoint != selection.gamepoint) continue;
         if (selection.game != undefined       && point.game != selection.game) continue;
         if (selection.set != undefined        && point.set != selection.set) continue;
         if (selection.winner != undefined     && point.winner != selection.winner) continue;
         if (selection.result != undefined     && point.result != selection.result) continue;
         if (selection.error != undefined      && point.error != selection.error) continue;
         if (selection.score != undefined      && point.score != selection.score) continue;

         selected_points.push(points[p]);
      }
      return selected_points;
   }

   statistics.counters = counters;
   function counters(points) {
      var stat_obj = { 
         'TotalPoints': points.length,
         'Breakpoints' : [0, 0],
         'BreakpointsConverted' : [0, 0],
         'ServesAce' : [0, 0],
         'ServesWinners' : [0, 0],
         'DoubleFaults' : [0, 0],
         'ServedPoints' : [0, 0],
         'Serves2nd' : [0, 0],
         'ServedGames' : [0, 0],
         'GamepointsConverted' : [0, 0],
         'ReceivedPoints' : [0, 0],
         'ReceivedPoints1st' : [0, 0],
         'ReceivedPoints2nd' : [0, 0],
         'PointsWonReturn' : [0, 0],
         'PointsWonReturn1st' : [0, 0],
         'PointsWonReturn2nd' : [0, 0],
         'MaxPointsInRow': [0, 0],
         'MaxGamesInRow': [0, 0],
         'MaxPointsInRow': [0, 0],
         'MaxShotsInRally': [0, 0],
         'NetPoints': [0, 0],
         'NetPointsWon': [0, 0]
      };

      var stat_points = {
         'NetPoints': [[], []],
      }

      var max_rally = 0;
      var last_point_winner;
      var pir = 0;
      var last_game_winner;
      var gir = 0;

      for (var p=0; p < points.length; p++) {
         var point = points[p];
         var hand  = finalShotHand(point);
         var serve_directions = serveDirections(point);
         var serve_outcomes = serveOutcomes(point);

         increment('ServedPoints', point.server);
         increment('ReceivedPoints', 1 - point.server);
         if (point.first_serve) {
            increment('Serves2nd', point.server);
            increment('ReceivedPoints2nd', 1 - point.server);
         } else {
            increment('ReceivedPoints1st', 1 - point.server);
         }

         increment('PointsWon', point.winner);
         if (point.server == point.winner) increment('PointsWonServes', point.server);
         if (point.server == point.winner && !point.first_serve) increment('PointsWonServes1st', point.server);
         if (point.server == point.winner &&  point.first_serve) increment('PointsWonServes2nd', point.server);

         if (point.server == point.winner && (!point.rally || (point.rally && point.rally.length <= 2))) increment('PointsWonServe3Rally', point.server);

         if (point.server != point.winner) increment('PointsWonReturn', 1 - point.server);
         if (point.server != point.winner && !point.first_serve) increment('PointsWonReturn1st', 1 - point.server);
         if (point.server != point.winner &&  point.first_serve) increment('PointsWonReturn2nd', 1 - point.server);

         if (point.result == 'Ace') increment('ServesAce', point.server);
         if (point.result == 'Serve Winner') increment('ServeWinners', point.server);
         if (point.result == 'Double Fault') increment('DoubleFaults', point.server);

         if (point.result == 'Forced Error' && point.rally && point.rally.length == 1) increment('ServeForcedErrors', point.server);

         if (point.result == 'Winner') increment('Winners', point.winner);
         if (point.result == 'Winner' && hand == 'Forehand') increment('WinnersForehand', point.winner);
         if (point.result == 'Winner' && hand == 'Backhand') increment('WinnersBackhand', point.winner);

         if (point.result == 'Forced Error') increment('ForcedErrors', 1 - point.winner);
         if (point.result == 'Forced Error' && hand == 'Forehand')   increment('ForcedErrorsForehand', 1 - point.winner);
         if (point.result == 'Forced Error' && hand == 'Backhand')   increment('ForcedErrorsBackhand', 1 - point.winner);

         if (point.result == 'Unforced Error') increment('UnforcedErrors', 1 - point.winner);
         if (point.result == 'Unforced Error' && hand == 'Forehand') increment('UnforcedErrorsForehand', 1 - point.winner);
         if (point.result == 'Unforced Error' && hand == 'Backhand') increment('UnforcedErrorsBackhand', 1 - point.winner);

         if (!point.first_serve) {
            if (serve_directions.first  == 'Wide') increment('ServesWide1st',  point.server);
            if (serve_directions.first  == 'Body') increment('ServesBody1st',  point.server);
            if (serve_directions.first  == 'T')    increment('ServesT1st',     point.server);

            if (point.result == 'Ace') increment('ServesAce1st', point.server);
            if (point.result == 'Serve Winner') increment('ServeWinners1st', point.server);
            if (point.result == 'Forced Error' && point.rally && point.rally.length == 1) increment('ServeForcedErrors1st', point.server);
            if (point.server == point.winner && (!point.rally || (point.rally && point.rally.length <= 2))) increment('PointsWonServe3Rally1st', point.server);

         } else {
            if (serve_directions.second == 'Wide') increment('ServesWide2nd', point.server);
            if (serve_directions.second == 'Body') increment('ServesBody2nd', point.server);
            if (serve_directions.second == 'T')    increment('ServesT2nd',    point.server);

            if (point.result == 'Ace') increment('ServesAce2nd', point.server);
            if (point.result == 'Serve Winner') increment('ServeWinners2nd', point.server);
            if (point.result == 'Forced Error' && point.rally && point.rally.length == 1) increment('ServeForcedErrors2nd', point.server);
            if (point.server == point.winner && (!point.rally || (point.rally && point.rally.length <= 2))) increment('PointsWonServe3Rally2nd', point.server);
         }

         if ( point.rally && point.rally.length && 
               ((point.rally.length == 1 && 
                 point.result != 'Unforced Error' && 
                 point.result != 'Forced Error') ||
                (point.rally.length > 1)) ) {
                   increment('ReturnsInPlay', 1 - point.server);
                   if (point.first_serve) {
                      increment('ReturnsInPlay2nd', 1 - point.server);
                   } else {
                      increment('ReturnsInPlay1st', 1 - point.server);
                   }
         }

         if (point.breakpoint != undefined) increment('Breakpoints', point.breakpoint);
         if (point.gamepoint != undefined)  increment('Gamepoints', point.gamepoint);
         if (point.score.indexOf('G') >= 0 && point.winner != point.server) increment('BreakpointsConverted', 1 - point.server);
         if (point.score.indexOf('G') >= 0 && point.winner == point.server) increment('GamepointsConverted', point.server);
         if (point.score.indexOf('G') >= 0) increment('Games', point.winner);
         if (point.score.indexOf('G') >= 0) increment('ServedGames', point.server);
         if (point.score.indexOf('G') >= 0) {
            if (point.winner == last_game_winner || last_game_winner == undefined) {
               gir += 1;
               if (gir > stat_obj.MaxGamesInRow[point.winner]) {
                  stat_obj.MaxGamesInRow[point.winner] = gir;
               }
            } else {
               gir = 1;
               if (gir > stat_obj.MaxGamesInRow[point.winner]) {
                  stat_obj.MaxGamesInRow[point.winner] = gir;
               }
            }
            last_game_winner = point.winner;
         }
         if (point.winner == last_point_winner || last_point_winner == undefined) {
            pir += 1;
            if (pir > stat_obj.MaxPointsInRow[point.winner]) {
               stat_obj.MaxPointsInRow[point.winner] = pir;
            }
         } else {
            pir = 1;
            if (pir > stat_obj.MaxPointsInRow[point.winner]) {
               stat_obj.MaxPointsInRow[point.winner] = pir;
            }
         }
         last_point_winner = point.winner;
         if (point.rally && point.rally.length && point.rally.length > max_rally) {
            max_rally = point.rally.length;
            stat_obj.MaxShotsInRally[0] = max_rally;
            stat_obj.MaxShotsInRally[1] = max_rally;
         }

         var np = isNetPoint(point);
         if (np.server) {
            stat_obj.NetPoints[point.server] += 1;
            stat_points.NetPoints[point.server].push(point);
         }
         if (np.receiver) {
            stat_obj.NetPoints[1 - point.server] += 1;
            stat_points.NetPoints[1 - point.server].push(point);
         }
         if (np.server && point.winner == point.server) stat_obj.NetPointsWon[point.server] += 1;
         if (np.receiver && point.winner != point.server) stat_obj.NetPointsWon[1 - point.server] += 1;
      }

      return stat_obj;

      function increment(what, who) {
         if (stat_obj[what]) {
            if (stat_obj[what][who]) {
               stat_obj[what][who] += 1;
            } else {
               stat_obj[what][who] = 1;
            }
         } else {
            stat_obj[what] = [];
            stat_obj[what][who] = 1;
         }
      }
   }

   statistics.baseStats = baseStats;
   function baseStats(c) {
      var ps = { 0: {}, 1: {} };
      for (var p=0; p < 2; p++) {

         var total_service          = validValue(c.ServedPoints, p);
         var second_serves          = validValue(c.Serves2nd, p);
         var first_serves_in        = total_service - second_serves;

         var opp_total_service      = validValue(c.ServedPoints, 1 - p);
         var opp_2nd_serves         = validValue(c.Serves2nd, 1 - p);

         var combined_total_service = total_service + opp_total_service;

         ps[p].CombinedServiceTotal = combined_total_service;
         ps[p].PctPointsWon         = cpct(validValue(c.PointsWon, p), combined_total_service);
         ps[p].PctPointsWonService  = cpct(validValue(c.PointsWonServes, p), validValue(c.ServedPoints, p));
         ps[p].PctPointsWonReturn   = validPct(c.PointsWonReturn, c.ReceivedPoints, p);

         ps[p].FirstServesIn        = first_serves_in;
         ps[p].PctServe1stIn        = cpct(first_serves_in, total_service);
         ps[p].PctPointsWon1st      = cpct(validValue(c.PointsWonServes1st, p), first_serves_in);

         ps[p].PctPointsWonReturn1st= validPct(c.PointsWonReturn1st, c.ReceivedPoints1st, p);

         ps[p].PctAces              = validPct(c.ServesAce, c.ServedPoints, p);
         ps[p].PctDoubleFaults      = validPct(c.DoubleFaults, c.ServedPoints, p);
         ps[p].PctPointsWon2nd      = validPct(c.PointsWonServes2nd, c.Serves2nd, p);
         ps[p].PctPointsWonReturn2nd= validPct(c.PointsWonReturn2nd, c.ReceivedPoints2nd, p);

         var opp_breakpoints        = validValue(c.Breakpoints, 1 - p);
         var opp_bpt_conv           = validValue(c.BreakpointsConverted, 1 - p);
         ps[p].BreakpointsSaved     = opp_breakpoints - opp_bpt_conv;
         ps[p].BreakpointsFaced     = opp_breakpoints;
         ps[p].PctBreakpointsSaved  = cpct(opp_breakpoints - opp_bpt_conv, opp_breakpoints);

         var breakpoints            = validValue(c.Breakpoints, p);
         var breakpoints_converted  = validValue(c.BreakpointsConverted, p);
         ps[p].Breakpoints          = breakpoints;
         ps[p].BreakpointsConverted = breakpoints_converted;
         ps[p].PctBreakpointsConverted = cpct(breakpoints_converted, breakpoints);

         var winners                = validValue(c.Winners, p);
         var aces                   = validValue(c.ServesAce, p);
         var serve_winners          = validValue(c.ServeWinners, p);
         // ps[p].Winners              = winners + aces + serve_winners;
         ps[p].Winners              = winners;      // MCP excludes aces and serve_winners from 'winners'

         var unforced_errors        = validValue(c.UnforcedErrors, p);
         var double_faults          = validValue(c.DoubleFaults, p);
         var second_serves_in       = second_serves - double_faults;
         ps[p].SecondServesIn       = second_serves_in;
         ps[p].PctServe2ndIn        = cpct(second_serves_in, second_serves);
         ps[p].UnforcedErrors       = unforced_errors + double_faults;

         var rip_1st                = validValue(c.ReturnsInPlay1st, p);
         var rip_2nd                = validValue(c.ReturnsInPlay2nd, p);
         var opp_double_faults      = validValue(c.DoubleFaults, 1 - p);
         var opp_2nd_serves_in      = opp_2nd_serves - opp_double_faults;
         var opp_1st_serves_in      = opp_total_service - opp_2nd_serves;
         ps[p].PctReturnsInPlay     = cpct(rip_1st + rip_2nd, opp_1st_serves_in + opp_2nd_serves_in);
         ps[p].PctReturnsInPlay1st  = cpct(rip_1st, opp_1st_serves_in);
         ps[p].PctReturnsInPlay2nd  = cpct(rip_2nd, opp_2nd_serves_in);

         var forcing_errors         = validValue(c.ForcedErrors, 1 - p);
         var aggressive_margin      = (aces + serve_winners + winners + forcing_errors) - (double_faults + unforced_errors);
         var aggressive_margin_pct  = cpct(aggressive_margin, c.TotalPoints);
         ps[p].AggressiveMargin     = aggressive_margin;
         ps[p].PctAggressiveMargin  = aggressive_margin_pct;
      }
      return ps;
   }

   statistics.serveStats = serveStats;
   function serveStats(c) {
      var ps = { 0: {}, 1: {} };
      for (var p=0; p < 2; p++) {

         // Serve Basics
         ps[p].PctServePointsWon    = validPct(c.PointsWonServes, c.ServedPoints, p);

         var total_service          = validValue(c.ServedPoints, p);
         var second_serves          = validValue(c.Serves2nd, p);
         var first_serves_in        = total_service - second_serves;

         ps[p].PctServeAce          = cpct(validValue(c.ServesAce, p),    total_service);
         ps[p].PctServeAce1st       = cpct(validValue(c.ServesAce1st, p), first_serves_in);
         ps[p].PctServeAce2nd       = cpct(validValue(c.ServesAce2nd, p), second_serves);

         ps[p].PctServeWinners      = cpct(validValue(c.ServeWinners, p), total_service);
         ps[p].PctServeWinners1st   = cpct(validValue(c.ServeWinners1st, p), first_serves_in);
         ps[p].PctServeWinners2nd   = cpct(validValue(c.ServeWinners2nd, p), second_serves);

         ps[p].PctServeForcedErrors    = cpct(validValue(c.ServeForcedErrors, p), total_service);
         ps[p].PctServeForcedErrors1st = cpct(validValue(c.ServeForcedErrors1st, p), first_serves_in);
         ps[p].PctServeForcedErrors2nd = cpct(validValue(c.ServeForcedErrors2nd, p), second_serves);

         ps[p].PctServeWon3Rally    = cpct(validValue(c.PointsWonServe3Rally, p), total_service);
         ps[p].PctServeWon3Rally1st = cpct(validValue(c.PointsWonServe3Rally1st, p), first_serves_in);
         ps[p].PctServeWon3Rally2nd = cpct(validValue(c.PointsWonServe3Rally2nd, p), second_serves);

         var serves_wide_1st        = validValue(c.ServesWide1st, p);
         var serves_wide_2nd        = validValue(c.ServesWide2nd, p);
         var serves_wide            = serves_wide_1st + serves_wide_2nd;

         ps[p].PctServeWide         = cpct(serves_wide, total_service);
         ps[p].PctServeWide1st      = cpct(serves_wide_1st, first_serves_in);
         ps[p].PctServeWide2nd      = cpct(serves_wide_2nd, second_serves);

         var serves_body_1st        = validValue(c.ServesBody1st, p);
         var serves_body_2nd        = validValue(c.ServesBody2nd, p);
         var serves_body            = serves_body_1st + serves_body_2nd;

         ps[p].PctServeBody         = cpct(serves_body, total_service);
         ps[p].PctServeBody1st      = cpct(serves_body_1st, first_serves_in);
         ps[p].PctServeBody2nd      = cpct(serves_body_2nd, second_serves);

         var serves_t_1st           = validValue(c.ServesT1st, p);
         var serves_t_2nd           = validValue(c.ServesT2nd, p);
         var serves_t               = serves_t_1st + serves_t_2nd;

         ps[p].PctServeT            = cpct(serves_t, total_service);
         ps[p].PctServeT1st         = cpct(serves_t_1st, first_serves_in);
         ps[p].PctServeT2nd         = cpct(serves_t_2nd, second_serves);

         // Direction
         

      }
      return ps;
   }

   function validValue(value, player) { 
      return value ? value[player] ? value[player] : 0 : 0; 
   }

   function validPct(value1, value2, player1, player2) {
      return (value1 && value2) ? 
             cpct(value1[player1], value2[player2 != undefined ? player2 : player1]) : 
             undefined;
   }

   function cpct(count, total) { 
      if (!total || !count) return 0;
      return parseFloat((count / total * 100).toFixed(2)); 
   }

   // temporary workaround until universal method contrived
   function finalShotHand(point) {
      if (!point) return undefined;
      if (!point.rally) return 'Serve';

      return findShot(point.rally[point.rally.length - 1]);

      function findShot(shot) {
         if (!shot) return false;
         var forehands = 'frvoulhj'.split('');
         var backhands = 'bszpymik'.split('');
         for (var d=0; d < forehands.length; d++) {
            if (shot.indexOf(forehands[d]) >= 0) return 'Forehand';
         }
         for (var d=0; d < backhands.length; d++) {
            if (shot.indexOf(backhands[d]) >= 0) return 'Backhand';
         }
         return 'Unknown';
      }
   }

   function serveDirections(point) {
      if (!point) return false;
      var first_serve_direction = 'Unknown';
      var second_serve_direction;
      var directions = { 0: 'Unknown', 4: 'Wide', 5: 'Body', 6: 'T' };
      if (point.serves && point.serves.length) {
         var direction = serveDirection(point.serves[point.serves.length - 1]);
         if (direction && !point.first_serve) {
            first_serve_direction = directions[direction];
         } else {
            second_serve_direction = directions[direction];
         }
      }

      if (point.first_serve && point.first_serve.serves && point.first_serve.serves.length) {
         var direction = serveDirection(point.first_serve.serves[point.first_serve.serves.length - 1]);
         if (direction) first_serve_direction = directions[direction];
      }

      var serve_directions = { first: first_serve_direction };
      if (second_serve_direction) serve_directions.second = second_serve_direction;

      return serve_directions;

      function serveDirection(shot) {
         if (!shot) return false;
         var directions = '0456'.split('');
         for (var d=0; d < directions.length; d++) {
            if (shot.indexOf(directions[d]) >= 0) return directions[d];
         }
         return 0;
      }
   }

   function serveOutcomes(point) {
   }

   statistics.raw = raw;
   function raw(points) {
      var c = statistics.counters(points);
      var st = statistics.baseStats(c);

      return [
         { 'M': '' },
         { 'A': c.ServesAce },
         { 'DF': c.DoubleFaults },
         { 'SP': c.ServedPoints },
         { 'S1In': [c.ServedPoints[0] - c.Serves2nd[0], c.ServedPoints[1] - c.Serves2nd[1]] },
         { 'S1PW': c.PointsWonServes1st },
         { 'S2PW': c.PointsWonServes2nd },
         { 'SG': c.ServedGames },
         { 'bpS': [st[0].BreakpointsSaved, st[1].BreakpointsSaved] },
         { 'bpF' : [st[0].BreakpointsFaced, st[1].BreakpointsFaced] },
      ];
   }

   statistics.statObjects = statObjects;
   function statObjects(points) {
      var so = [];
      var c = statistics.counters(points);
      var st = statistics.baseStats(c);

      so.push({
         name:          'Aces',
         numerator:     c.ServesAce,
//         denominator:   c.ServedPoints,
//         pct:           [st[0].PctAces, st[1].PctAces],
         default:       'numerator'
      });

      so.push({
         name:          'Double Faults',
         numerator:     c.DoubleFaults,
//         denominator:   c.ServedPoints,
//         pct:           [st[0].PctDoubleFaults, st[1].PctDoubleFaults],
         default:       'numerator'
      });

      // Don't display first serve statistics if the same as total serve statistics
      if (c.PointsWonServes && c.PointsWonServes1st && c.PointsWonServes.toString() != c.PointsWonServes1st.toString()) {
         so.push({
            name:          '1st Serve In',
            numerator:     [st[0].FirstServesIn, st[1].FirstServesIn],
            denominator:   c.ServedPoints,
            pct:           [st[0].PctServe1stIn, st[1].PctServe1stIn]
         });

         so.push({
            name:          '1st Serve Points Won',
            numerator:     c.PointsWonServes1st,
            denominator:   [c.ServedPoints[0] - c.Serves2nd[0], c.ServedPoints[1] - c.Serves2nd[1]],
            pct:           [st[0].PctPointsWon1st, st[1].PctPointsWon1st]
         });

         so.push({
            name:          '2nd Serve In',
            numerator:     [st[0].SecondServesIn, st[1].SecondServesIn],
            denominator:   c.Serves2nd,
            pct:           [st[0].PctServe2ndIn, st[1].PctServe2ndIn]
         });

         so.push({
            name:          '2nd Serve Points Won',
            numerator:     c.PointsWonServes2nd,
            denominator:   c.Serves2nd,
            pct:           [st[0].PctPointsWon2nd, st[1].PctPointsWon2nd]
         });
      }

      so.push({
         name:          'Total Points Won',
         numerator:     c.PointsWon,
//         denominator:   [st[0].CombinedServiceTotal, st[1].CombinedServiceTotal],
         default:       'numerator'
      });

      so.push({
         name:          'Returns In Play',
         numerator:     c.ReturnsInPlay,
         denominator:   [c.ServedPoints[1], c.ServedPoints[0]],
         pct:           [st[0].PctReturnsInPlay, st[1].PctReturnsInPlay]
      });

      so.push({
         name:          'Receiving Points Won',
         numerator:     c.PointsWonReturn,
         denominator:   [c.ServedPoints[1], c.ServedPoints[0]],
         pct:           [st[0].PctPointsWonReturn, st[1].PctPointsWonReturn]
      });

      if (c.PointsWonReturn && c.PointsWonReturn1st && c.PointsWonReturn.toString() != c.PointsWonReturn1st.toString()) {
         so.push({
            name:          'Receiving Points Won 1st',
            numerator:     c.PointsWonReturn1st,
            denominator:   c.ReceivedPoints1st,
            pct:           [st[0].PctPointsWonReturn1st, st[1].PctPointsWonReturn1st]
         });

         so.push({
            name:          'Receiving Points Won 2nd',
            numerator:     c.PointsWonReturn2nd,
            denominator:   c.ReceivedPoints2nd,
            pct:           [st[0].PctPointsWonReturn2nd, st[1].PctPointsWonReturn2nd]
         });
      }

      so.push({
         name:          'Break Points Won',
         numerator:     c.BreakpointsConverted,
         denominator:   c.Breakpoints,
         pct:           [st[0].PctBreakpointsConverted, st[1].PctBreakpointsConverted]
      });

      so.push({
         name:          'Break Points Saved',
         numerator:     [st[0].BreakpointsSaved, st[1].BreakpointsSaved],
         denominator:   [st[0].BreakpointsFaced, st[1].BreakpointsFaced],
         pct:           [st[0].PctBreakpointsSaved, st[1].PctBreakpointsSaved]
      });

//      if (st[0].Winners != c.ServesAce[0] && st[1].Winners != c.ServesAce[1]) {
         so.push({
            name:          'Winners',
            numerator:     [st[0].Winners, st[1].Winners],
            default:       'numerator'
         });
//      }

      so.push({
         name:          'Unforced Errors',
         numerator:     c.UnforcedErrors,
         default:       'numerator'
      });

      so.push({
         name:          'Forced Errors',
         numerator:     c.ForcedErrors,
         default:       'numerator'
      });

      so.push({
         name:          'Aggressive Margin',
         numerator:     [st[0].AggressiveMargin, st[1].AggressiveMargin],
         denominator:   [st[0].CombinedServiceTotal, st[1].CombinedServiceTotal],
         pct:           [st[0].PctAggressiveMargin, st[1].PctAggressiveMargin]
      });

      so.push({
         name:          'Service Games Won',
         numerator:     c.GamepointsConverted,
         denominator:   c.ServedGames
      });

      so.push({
         name:          'Service Points Won',
         numerator:     c.PointsWonServes,
         denominator:   c.ServedPoints,
         pct:           [st[0].PctPointsWonService, st[1].PctPointsWonService]
      });

      so.push({
         name:          'Games Won',
         numerator:     c.Games,
      });

      so.push({
         name:          'Most Consecutive Points Won',
         numerator:     c.MaxPointsInRow,
      });

      so.push({
         name:          'Most Consecutive Games Won',
         numerator:     c.MaxGamesInRow,
      });

      so.push({
         name:          'Longest Rally',
         numerator:     c.MaxShotsInRally,
      });

      so.push({
         name:          'Net Points Won',
         numerator:     c.NetPointsWon,
         denominator:   c.NetPoints,
         // ADD PERCENTAGE!!
      });

      return so;
   }

   statistics.isNetPoint = isNetPoint;
   function isNetPoint(point) {
      serverNet = 0;
      receiverNet = 0;

      // check for serve/volley
      var serves = point.serves;
      if (serves && serves.length) {
         if (serves[serves.length - 1].indexOf('+') >= 0) {
            serverNet = 1;
         }
      }

      if (!point.rally || !point.rally.length) {
         return { server: serverNet, receiver: receiverNet };
      }

      var rallyString = point.rally.join('');

      var extraneous = ["c", ";", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "d", "x", "n", "w"];
      var netShots = ["o", "p", "v", "z", "j", "k", "h", "i"];
      var baseShots = ["f", "b", "r", "s", "l", "m", "t", "q"];
      var dropShots = ["u", "y"];

      extraneous.forEach(function(e) {
         rallyString = rallyString.replace(new RegExp(e, 'g'), '');
      });

      netShots.forEach(function(e) {
         rallyString = rallyString.replace(new RegExp(e + '=', 'g'), 'B');
         rallyString = rallyString.replace(new RegExp(e, 'g'), 'N');
      });

      baseShots.forEach(function(e) {
         rallyString = rallyString.replace(new RegExp(e + '-', 'g'), 'N');
         rallyString = rallyString.replace(new RegExp(e + '\\+', 'g'), 'A');
         rallyString = rallyString.replace(new RegExp(e, 'g'), 'B');
      });

      dropShots.forEach(function(e) {
         rallyString = rallyString.replace(new RegExp(e + '-', 'g'), 'E');
         rallyString = rallyString.replace(new RegExp(e, 'g'), 'D');
      });

      var serverShots = [];
      var receiverShots = [];

      rallyString.split('').forEach(function(s, i) {
         if (['*', '#', '@'].indexOf(s) < 0) {
            if (i % 2) { serverShots.push(s); } else { receiverShots.push(s); }
         }
      });

      // net shot: automatic net point
      // drop shot hit from net area: auto net point
      if (serverShots.indexOf('N') >=0 || serverShots.indexOf('E') >=0) serverNet = 1;
      if (receiverShots.indexOf('N') >=0 || receiverShots.indexOf('E') >= 0) receiverNet = 1;

      var rl = rallyString.length;
      // opponent hit drop shot -- but not if ended the point w/ forced error or winner
      if (inFinalShots(serverShots, 'D')) receiverNet = 1;
      if (inFinalShots(receiverShots, 'D')) serverNet = 1;
      // player hit approach shot -- but not if approach was winner, error, or caused forced error
      if (inFinalShots(serverShots, 'A')) serverNet = 1;
      if (inFinalShots(receiverShots, 'A')) receiverNet = 1;
      function inFinalShots(shots, shot) {
         if (shots.indexOf(shot) >= 0) {
            if (rallyString.indexOf('*') >= 0 || rallyString.indexOf('@') >= 0) {
               var approachString = rallyString.slice(rl - 2);
            }
            if (rallyString.indexOf('#') >= 0) {
               var approachString = rallyString.slice(rl - 3);
            }
            if (approachString && approachString.indexOf(shot) >= 0) return true; 
         }
      }

      return { server: serverNet, receiver: receiverNet };
   }

   if (typeof define === "function" && define.amd) define(statistics); else if (typeof module === "object" && module.exports) module.exports = statistics;
   this.statistics = statistics;
 
}();
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
      // data.points.forEach(function(point) { addPoint(point.code.toUpperCase()); });
      data.points.forEach(function(point) { addPoint(point.winner); });
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
!function() { 

   // module container
   var readWrite = { 
      uponCompletion: null,
      loadTennisMath: null,
      loadTennisScoreboard: null
   };

   // perhaps some externally set events such as "reset"

   readWrite.umo = mo.matchObject();

   function addPoint(p) {
      var result = readWrite.umo.push(p);
      return result;
   }

   readWrite.uploadMatch = uploadMatch;
   function uploadMatch() {
      var alpha_numeric = /^([0-9]|[a-z])+([0-9a-z]+)$/i;
      var tmtCode = document.querySelector('#tmtCode');
      if (tmtCode && alpha_numeric.test(tmtCode.value) && tmtCode.value.length > 9 && tmtCode.value.length < 13) {
         fetchTennisMath();
      } else if (tsbCode.value.length > 0) {
         fetchTennisScoreboard();
      } else {
         document.getElementById('upload_file').click();
      }
   }

   readWrite.submitTMTcode = submitTMTcode;
   function submitTMTcode(event) {
      if (event.which == 13) {
         fetchTennisMath();
      }
   }

   readWrite.submitTSBcode = submitTSBcode;
   function submitTSBcode(event) {
      if (event.which == 13) {
         fetchTennisScoreboard();
      }
   }

   readWrite.fetchTennisMath = fetchTennisMath;
   function fetchTennisMath() {
      var tmtCode = document.querySelector('#tmtCode');
      if (tmtCode.value.length < 10) return false;
      if (readWrite.loadTennisMath) readWrite.loadTennisMath();
      if (sources) sources.tennisMath.process(tmtCode.value);
   }

   readWrite.fetchTennisScoreboard = fetchTennisScoreboard;
   function fetchTennisScoreboard() {
      var tsbCode = document.querySelector('#tsbCode');
      if (tsbCode.value.length < 3) return false;
      if (readWrite.loadTennisScoreboard) readWrite.loadTennisScoreboard();
      if (sources) sources.tennisSB.process(tsbCode.value);
   }

   function validExtension(file_name) {
      var _validFileExtensions = [".csv"];    
      if (parsers && parsers.loaders.length) {
         parsers.loaders.forEach(function(e) {
            _validFileExtensions.push('.' + e.toLowerCase());
         });
      }
      if (file_name.length > 0) {
          var valid_type = false;
          for (var e = 0; e < _validFileExtensions.length; e++) {
              var file_type = _validFileExtensions[e];
              if (file_name.substr(file_name.length - file_type.length, file_type.length).toLowerCase() == file_type.toLowerCase()) {
                  valid_type = file_type;
                  break;
              }
          }
          if (!valid_type) { return false; }
      }
      return file_type.split('.').join('');
   }

   upload_file.onchange = function(evt) {
      if (!window.FileReader) return; // Browser is not compatible

      readWrite.umo.points([]);

      if (parsers) { parsers.umo = readWrite.umo; }

      var reader = new FileReader();
      var file_type;
      var match_meta = {};
      var meta = [];

      var file = evt.target.files[0];
      var file_split = upload_file.value.split('\\');
      var file_name = file_split[file_split.length - 1];

      reader.onload = function(evt) {
         if (evt.target.error) {
            alert('Error while reading file');
            return;
         }
         var file_content = evt.target.result;
         if (parsers && parsers.loaders.length && parsers.loaders.indexOf(file_type.toUpperCase()) >= 0) {
            var report = file_type + ' LOADER....';
            if (aip) aip.sendReport(report);
            parsers[file_type.toUpperCase()].parse(file_content);
         }

         if (reader.readyState == 2) {
            if (readWrite.uponCompletion) readWrite.uponCompletion();
            var modal = document.getElementById('myModal');
            modal.style.display = "none";
         }
         var report = 'UPLOAD.....' + file_split.join('');
         if (aip) aip.sendReport(report);
      };

      // also check that file size is not too large!
      file_type = validExtension(file_name);
      if (!file_type) {
         console.log('not a valid file type');
         // set state for failure to laod
         return;
      } else if (parsers && parsers.loaders.length && parsers.loaders.indexOf(file_type.toUpperCase()) >= 0) {
         var format = parsers[file_type.toUpperCase()].file_format;
         if (format == 'text') {
            reader.readAsText(evt.target.files[0]);
         } else if (format == 'binary') {
            reader.readAsBinaryString(evt.target.files[0]);
         }
      }
      upload_file.value = '';
   };

   if (typeof define === "function" && define.amd) define(readWrite); else if (typeof module === "object" && module.exports) module.exports = readWrite;
   this.readWrite = readWrite;

}();
!function() { 

   // module container
   var saveMCP = {};

   function saveCSV(textToWrite, fileNameToSaveAs) {
      fileNameToSaveAs = fileNameToSaveAs || 'data.txt';
       var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
       var downloadLink = document.createElement("a");
       downloadLink.download = fileNameToSaveAs;
       downloadLink.innerHTML = "Download File";
       if (window.URL != null) { 
          downloadLink.href = window.URL.createObjectURL(textFileAsBlob); 
       } else {
           downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
           downloadLink.onclick = destroyClickedElement;
           downloadLink.style.display = "none";
           document.body.appendChild(downloadLink);
       }
       downloadLink.click();
   }

   function populateCSV() {

      var meta = [];
      var md = saveMCP.match_data;
      var metadata = md.metadata();

      // reverse player names if first service == 1
      var rp = md.options().match.first_service;

      // always put the player who serves first as the first player for MCP
      meta.push(metadata.players[rp].name || '');
      meta.push(metadata.players[1 - rp].name || '');
      meta.push(metadata.players[rp].hand || '');
      meta.push(metadata.players[1 - rp].hand || '');
      meta.push(metadata.match.category || '');
      meta.push(metadata.match.date ? prepareDate(metadata.match.date) : '');
      meta.push("\"" + metadata.tournament.name + "\"" || ''); // need to wrap in quotes before export
      meta.push(metadata.tournament.round || '');
      meta.push(metadata.tournament.time || '');
      meta.push(metadata.match.court || '');
      meta.push(metadata.tournament.surface || '');
      meta.push(metadata.match.umpire || '');
      meta.push(metadata.charter || '');

      meta.push(md.options().match.sets || '');
      meta.push(md.options().match.final_set_tiebreak || '');

      var rows = 'meta,1st,2nd\r\n';
      var points = [];
      md.points().map(function(m) { if (m.code) return m.code.split('|'); })
                 .filter(function(f) { return f; })
                 .forEach(function(point) { points.push(point.join(',')); } );
      var range = meta.length > points.length ? meta.length : points.length;
      for (r=0; r < range; r++) {
         rows += meta[r] || '';
         rows += ',' + (points[r] || '') + '\r\n';
      }
      return rows;
   }

   function prepareDate(textdate) {
      return textdate.split('-').join('');
   }

   saveMCP.downloadMatch = downloadMatch;
   function downloadMatch(charting) {
      saveMCP.match_data = md = charting.match_data;
      if (!md.points().length) return;
      var file_name = new Date().toDateString().split(' ').join('-') + '_';
      var p = md.metadata().players;
      [p[0], p[1]].forEach(function(e) { file_name += e.name.split(' ').join('') + '_'; })
      file_name += 'MCP.csv';
      var rows = populateCSV();
      saveCSV(rows, file_name);
      var report = 'DOWNLOAD.....' + file_name;
      if (aip) aip.sendReport(report);
   }

   this.saveMCP = saveMCP;

}();
function mOverview() {

    var data;
    var update;

    var fsf = 1.5; // font scaling factor

    var options = {
        width: window.innerWidth,
        height: window.innerHeight,
        margins: {
           top:    30, bottom: 20, 
           left:   10, right:  10
        },
        display: {
           sizeToFit: true,
           responsive: false,
           highlight_winner: true
        },
        colors: {
           players: { 0: "#a55194", 1: "#6b6ecf" }
        }
    };

    var events = {
       'update':  { 'begin': null, 'end': null }
    };

    function chart(selection) {
      var root = selection.append('svg')
          .attr('class', 'ov');

      var chartHolder = root.append('g')
         .attr({
            'class': 'chartHolder',
            'transform': 'translate(0,0)'
         });

      update = function(opts) {

         if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
            var dims = selection.node().getBoundingClientRect();
            options.width = Math.max(dims.width, 300);
            options.height = options.width / 4;
         }

         root
            .attr({
               'width':    options.width,
               'height':   options.height
            });

         var frame = chartHolder.selectAll('.frame')
            .data([0])

         frame.enter()
            .append('rect')
            .attr({ 'class':  'frame' })

         frame.exit().remove()

         frame
            .attr({
               'height': options.height,
               'width' : options.width,
               'fill'  : 'white',
               'stroke': 'blue',
               'opacity': 0
            })

         var divider = chartHolder.selectAll('.divider')
            .data([0])

         divider.enter()
            .append('line')
            .attr({ 'class': 'divider' })

         divider.exit().remove()

         divider
            .attr({
               'stroke':   'black',
               'x1': options.width * .05,
               'x2': options.width * .95,
               'y1': options.height / 2,
               'y2': options.height / 2
            })

         var font_size = options.width * .05;
         var max_length =0;

         var players = chartHolder.selectAll('.player')
            .data(data.teams())

         players.enter()
            .append('text')
            .attr({ 'class': 'player' })

         players.exit().remove()

         players
            .text(function(d) { return d })
            .style({
               'font-size':   font_size + 'px',
               'fill': function(d) { 
                  if (options.display.highlight_winner) {
                     return d == data.score().winner ? (options.colors.players[data.teams().indexOf(d)]) : 'black' 
                  } else {
                     return options.colors.players[data.teams().indexOf(d)];
                  }
               },
               'font-weight': function(d) { return d == data.score().winner ? 'bold' : 'normal' }
            })
            .attr({
               'length': function() { 
                  var length = this.getComputedTextLength(); 
                  if (length > max_length) max_length = length;
               }
            })
            .translate(function(d, i) { return [options.width * .045, options.height * .38 + (i * options.height * .4)] })

         var game_scores = data.score().sets
         .map(function(m) { 
            var this_set = m.games.map(function(f, i) { 
               return [i, f, m.tiebreak]; 
            });
            if (this_set[0][1] > this_set[1][1]) {
               // flag to bold and color leading player score
               this_set[0][3] = 'leads';
            } else if (this_set[0][1] < this_set[1][1]) {
               // flag to bold and color leading player score
               this_set[1][3] = 'leads';
            }
            return this_set;
         })

         game_scores = game_scores.length ? game_scores 
         .reduce(function(a, b) { return a.concat(b); })
         .reverse() : [[0,0], [1,0]];

         if (data.score().point_score) {
            var ps = data.score().point_score.split('-');
            game_scores.unshift([0, ps[0], undefined, 'points']);
            game_scores.unshift([1, ps[1], undefined, 'points']);
         }

         var points_divider = chartHolder.selectAll('.pointsDivider')
            .data(data.score().point_score ? [0] : [])

         points_divider.enter()
            .append('line')
            .attr({ 'class': 'pointsDivider' })

         points_divider.exit().remove()

         points_divider
            .attr({
               'stroke': 'gray',
               'x1': options.width * .9 - (.25 * font_size * fsf),
               'x2': options.width * .9 - (.25 * font_size * fsf),
               'y1': options.height * .25,
               'y2': options.height * .75
            })

         var scores = chartHolder.selectAll('.gamescore')
            .data(game_scores)

         scores.enter()
            .append('text')
            .attr({ 'class': 'gamescore' })

         scores.exit().remove()

         scores
            .text(function(d) { return d[1]; })
            .style({ 
               'font-size': font_size + 'px', 
               'fill': function(d) { return d[3] == 'leads' ? (options.colors.players[d[0]]) : d[3] == 'points' ? 'red' : 'black' },
               'font-weight': function(d) { return d[3] == 'leads' ? 'bold' : 'normal' }
            })
            .translate(function(d, i) { 
               return [options.width * .9 - (Math.floor(i / 2) * font_size * fsf), options.height * .38 + (d[0] * options.height * .4)] 
            })

         var sScript = scores.selectAll('.super')
            .data(function(d) { return [d]; })

         sScript.enter()
            .append('tspan')
            .attr('class', 'super')
            .attr('baseline-shift', "super")

         sScript.exit().remove()

         sScript
            .style({ 'font-size':   (font_size * .8) + 'px', })
            .text(function(d) { if (d[2] != undefined && d[1] == 6) return d[2]; })

      }
    }

    // ACCESSORS

    chart.exports = function() {
       return {}
    }

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
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

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return options.width;
        options.width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        return chart;
    };

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        return chart;
    };

    chart.update = function(opts) {
      if (events.update.begin) events.update.begin(); 
      if (typeof update === 'function' && data) update(opts);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
    }

    chart.colors = function(color3s) {
        if (!arguments.length) return colors;
        if (typeof color3s !== 'object') return false;
        var keys = Object.keys(color3s);        
        if (!keys.length) return false;
        // remove all properties that are not colors
        keys.forEach(function(f) { if (! /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color3s[f])) delete color3s[f]; })
        if (Object.keys(color3s).length) {
           colors = color3s;
        } else {
           colors = JSON.parse(JSON.stringify(default_colors));
        }
        return chart;
    }

    window.addEventListener( 'resize', scaleChart, false );

    function scaleChart() {
       if (!options.display.responsive) return;
       chart.update();
    }

   return chart;
}

d3.selection.prototype.translate = function(xy) {
     return this.attr('transform', function(d,i) {
         return 'translate('+[typeof xy == 'function' ? xy.call(this, d,i) : xy]+')';
     });
};

d3.selection.prototype.tspans = function(lines, lh) {
     return this.selectAll('tspan')
         .data(lines)
         .enter()
         .append('tspan')
         .attr('class', 'sb-text')
         .text(function(d) { return d; })
         .attr('x', 0)
         .attr('dy', function(d,i) { return i ? lh || 15 : 0; });
}; 

function statView() {

    var data = [];
    var update;
    var dom_parent;
    var transition_time = 1000;

    var options = {
        id: 'sv',
        fullWidth: window.innerWidth,
        // fullHeight: window.innerHeight,
        fullHeight: 300,
        fullRowHeight: 30,
        margins: {
           top:    2, bottom: 2, 
           left:   10, right:  10
        },
       display: {
          sizeToFit: { width: true, height: false },
          responsive: false
       },
       colors: {
          players: { 0: "#a55194", 1: "#6b6ecf" }
       }
    }

    function width() { return options.fullWidth - options.margins.left - options.margins.right }
    function height() { return options.fullHeight - options.margins.top - options.margins.bottom }
    function rowHeight() { return options.fullRowHeight - options.margins.top - options.margins.bottom }
    function svgTranslate(vector) { return "translate(" + vector[0] + "," + vector[1] + ")" }

    var events = {
       'update':  { 'begin': null, 'end': null }
    }

    function chart(selection) {
      selection.each(function () {
         dom_parent = d3.select(this);

         var root = dom_parent.append('div').attr('id', options.id)

         update = function(opts) {

            var Fdata = data.filter(function(f) { return f.numerator && (f.numerator[0] || f.numerator[1]) })

            var dims = selection.node().getBoundingClientRect()
            if (options.display.sizeToFit.width || (opts && opts.sizeToFit && opts.sizeToFit.width)) {
               options.fullWidth = Math.max(dims.width, 100)
            }
            if (options.display.sizeToFit.height || (opts && opts.sizeToFit && opts.sizeToFit.height)) {
               options.fullHeight = Math.max(dims.height, 100)
            }

            options.width = width()
            options.height = height()
            options.rowHeight = rowHeight()
            options.marginTranslate = [options.margins.left, options.margins.top]

            var font_size = options.rowHeight * .5;
            // var middle = options.fullWidth / 2;
            // var itemCount = Fdata.length;
            var itemContainer = root.selectAll("svg")
               .data(Fdata)

            itemContainer.enter()
               .append("svg")
               .attr('id', function(d, i) { return options.id + 'i' + i })

            itemContainer.exit().remove()

            itemContainer
               .attr("width", function(s) { return options.fullWidth })
               .attr("height", function(s) { return options.fullRowHeight })

            var item = itemContainer.selectAll('g')
               .data(function(d) { return [d] })

            item.enter()
               .append("g")

            item.exit().remove()

            item
               .attr("width", function(s) { return options.fullWidth })
               .attr("height", function(s) { return options.rowHeight })
               .attr("transform", function(s) {
                   return svgTranslate(options.marginTranslate)
               });

            var textElements = item.selectAll('text')
               .data(function(d) {
                  var elements = []
                  var player0 = (d.numerator != undefined && d.denominator != undefined) ? 
                                d.numerator[0] + '/' + d.denominator[0] : 
                                (d.numerator != undefined) ? d.numerator[0] : ''
                  var player1 = (d.numerator != undefined && d.denominator != undefined) ? 
                                d.numerator[1] + '/' + d.denominator[1] : 
                                (d.numerator != undefined) ? d.numerator[1] : ''

                  if (d.pct != undefined) {
                     if (options.width > 400) {
                        player0 = Math.round(d.pct[0]) + '% (' + player0 + ')'
                        player1 = Math.round(d.pct[1]) + '% (' + player1 + ')'
                     } else {
                        player0 = Math.round(d.pct[0]) + '%'
                        player1 = Math.round(d.pct[1]) + '%'
                     }
                  }
                  elements.push({
                     text: d.name,
                     anchor: 'middle',
                     translate: [options.fullWidth / 2, options.rowHeight / 4]
                  });
                  elements.push({
                     text: player0,
                     anchor: 'start',
                     translate: [0, options.rowHeight / 4]
                  });
                  elements.push({
                     text: player1,
                     anchor: 'end',
                     translate: [options.width, options.rowHeight / 4]
                  });
                  return elements;
               })

            textElements.enter().append('text')

            textElements.exit().remove()

            textElements
               .text(function(d) { return d.text })
               .style({
                  'text-anchor': function(d) { return d.anchor },
                  'alignment-baseline': 'middle',
                  'font-size':   font_size + 'px',
                  'fill': 'black',
                  'font-weight': function(d) { return false ? 'bold' : 'normal' }
               })
               .attr("transform", function(d) {
                   return svgTranslate(d.translate);
               });

            var barScale = d3.scale.linear().domain([ 0, 100 ]).range([0, options.width])

            var bar = item.selectAll('rect')
               .data(calcBarData);

            bar.enter()
               .append('rect')
               .attr({
                  'width': barWidth,
                  'height': barHeight,
                  "fill": function(d, i) { return options.colors.players[i] },
                  "transform": barTransform
               })

            bar.exit().remove()

            bar
               .transition().duration(transition_time)
               .attr({
                  'width': barWidth,
                  'height': barHeight,
                  "fill": function(d, i) { return options.colors.players[i] },
                  "transform": barTransform
               })

            function barWidth(d) {
               var s = !isNaN(d) ? barScale(d) : 0; 
               var w = s < 0 || isNaN(s) ? 0 : s; 
               return w;
            }

            function barHeight(d) { return options.rowHeight / 2; };

            function barTransform(d, i) {
               var xoffset = i ? options.width - barScale(d) : 0
               return svgTranslate([!isNaN(xoffset) ? xoffset : 0, options.rowHeight / 2])
            }

            function calcBarData(d) {
               if (d.numerator != undefined) {
                  var total = d.numerator.reduce(function(a, b) { return a + b });
                  if (total != 0) {
                     var pct1 = (d.numerator[0] / total).toFixed(1) * 100
                     pct1 = pct1 > 100 ? 100 : pct1;
                     var pct2 = 100 - (!isNaN(pct1) ? pct1 : 0);
                     if (d.numerator[0] < 0 && d.numerator[1] < 0) { 
                        return [pct2, pct1]; 
                     } else {
                        return [pct1, pct2]
                     }
                  } else if (d.numerator[0] > d.numerator[1]) {
                     return [100, 0];
                  } else if (d.numerator[1] > d.numerator[0]) {
                     return [0, 100];
                  }
               }
               return [];
            }
         }

      })
    }

    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
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

    chart.update = function(opts) {
      if (events.update.begin) events.update.begin()
      if (typeof update === 'function' && data) update(opts)
       setTimeout(function() { 
         if (events.update.end) events.update.end()
       }, options.display.transition_time)
    }

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        return chart;
    };

    window.addEventListener( 'resize', scaleChart, false );

    function scaleChart() {
       if (!options.display.responsive) return;
       chart.update();
    }

    return chart
}
// TODO:
// when hover over *last* point display the color boxes for all games
// when hover over the *first* point display all orientation bars

function ptsMatch() {

   var match_data;

   var options = {

      id: 0,
      class: 'ptsMatch',

      resize: true,
      width: window.innerWidth,
	   height: 80,

      margins: {
         top: 5, 
         right: 15, 
         bottom: 5, 
         left: 5
      },

      set: {
         average_points: 56
      },

      lines: {
         width: 2,
         interpolation: 'linear'
      },

      points: {
         max_width_points: 100
      },

      score: {
         font: 'Arial',
         font_size: '12px',
         font_weight: 'bold',
         reverse: true
      },

      header: {
         font: 'Arial',
         font_size: '14px',
         font_weight: 'bold'
      },

      display: {
         sizeToFit: true,
         transition_time: 0,
         point_highlighting: true,
         point_opacity: .4,
         win_err_highlight: true,
         game_highlighting: true,
         game_opacity: .2,
         game_boundaries: true,
         gamepoints: false,
         score: true,
         points: true,
         winner: true
      },

      colors: {
         orientation: 'yellow',
         gamepoints: 'black',
         players: { 0: "#a55194", 1: "#6b6ecf" }
      }
   }

   // functions which should be accessible via ACCESSORS
   var update;

   // programmatic
   var pts_sets = [];
   var dom_parent;

   // prepare charts
   pts_charts = [];
   for (var s=0; s < 5; s++) {
      pts_charts.push(ptsChart());
   }

   // DEFINABLE EVENTS
   // Define with ACCESSOR function chart.events()
   var events = {
       'update': { begin: null, end: null},
       'set_box': { 'mouseover': null, 'mouseout': null },
       'update': { 'begin': null, 'end': null },
       'point_bars': { 'mouseover': null, 'mouseout': null, 'click': null }
   };

   function chart(selection) {
        dom_parent = selection;

        // append svg
        var root = dom_parent.append('div')
            .attr('class', options.class + 'root')
            .style('width', options.width + 'px')
            .style('height', options.height + 'px' );

        for (var s=0; s < 5; s++) {
           pts_sets[s] = root.append("div").attr("class", "pts").style('display', 'none')
           pts_sets[s]
              .call(pts_charts[s]);
        }

        update = function() {
           var sets = match_data.sets();

           var true_height = 0;
           for (var s=0; s < pts_charts.length; s++) {
              if (sets[s] && sets[s].points().length) {
                 pts_sets[s].style('display', 'inline')
                 pts_charts[s].update();
                 true_height += +options.height + 5;
              } else {
                 pts_sets[s].style('display', 'none')
              }
           }

           // height needs to be adjusted to (# sets) * height of individuals charts + margins
           root
             .style('width', options.width + 'px')
             .style('height', true_height + 'px');
     
        }
   }

    // ACCESSORS

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
    }

    function keyWalk(valuesObject, optionsObject) {
        if (!valuesObject || !optionsObject) return;
        var vKeys = Object.keys(valuesObject);
        var oKeys = Object.keys(optionsObject);
        for (var k=0; k < vKeys.length; k++) {
           if (oKeys.indexOf(vKeys[k]) >= 0) {
              var oo = optionsObject[vKeys[k]];
              var vo = valuesObject[vKeys[k]];
              if (typeof oo == 'object' && typeof vo !== 'function' && oo && oo.constructor !== Array) {
                 keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
              } else {
                 optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
              }
           }
        }
    }

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.colors = function(colores) {
        if (!arguments.length) return options.colors;
        options.colors.players = colores;
        return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return options.width;
        options.width = value;
        if (typeof update === 'function') update(true);
        pts_charts.forEach(function(e) { e.width(value) });
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        if (typeof update === 'function') update(true);
        pts_charts.forEach(function(e) { e.height(value) });
        return chart;
    };

    chart.duration = function(value) {
        if (!arguments.length) return options.display.transition_time;
       options.display.transition_time = value;
       return chart;
    }

    chart.update = function(resize) {
       resize = resize ? resize : options.resize;
       if (events.update.begin) events.update.begin(); 
       var sets = match_data.sets();
       sets.forEach(function(e, i) {
          pts_charts[i].data(sets[i]);
          pts_charts[i].options({ id: i, resize: resize });
          pts_charts[i].options({ lines: options.lines, points: options.points, score: options.score, header: options.header});
          pts_charts[i].options({ set: options.set, display: options.display, colors: options.colors});
          pts_charts[i].events(events);
          pts_charts[i].width(options.width).height(options.height).update();
       })
       if (typeof update === 'function') update(resize);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
       return true;
    }

    chart.data = function(matchObject) {
       if (!arguments.length) { return match_data; }
       if (typeof matchObject != 'function' || matchObject.type != 'UMO') return false;
       match_data = matchObject;
       chart.update();
    }

   function lastElement(arr) { return arr[arr.length - 1]; }

   return chart;
}

function ptsChart() {

    var set_data;

    var game_data;
    var player_data;

    var winners = ['Ace', 'Winner', 'Serve Winner'];
    var errors = ['Forced Error', 'Unforced Error', 'Double Fault', 'Penalty', 'Out', 'Net'];

    var options = {
      id: 0,
      class: 'ptsChart',

      resize: true,
      width: window.innerWidth,
	   height: 80,

      margins: {
         top: 5, 
         right: 15, 
         bottom: 5, 
         left: 5
      },

      set: {
         average_points: 56
      },

      lines: {
         width: 2,
         interpolation: 'linear'
      },

      points: {
         max_width_points: 100
      },

      score: {
         font: 'Arial',
         font_size: '12px',
         font_weight: 'bold',
         reverse: true
      },

      header: {
         font: 'Arial',
         font_size: '14px',
         font_weight: 'bold'
      },

      display: {
         transition_time: 0,
         point_highlighting: true,
         point_opacity: .4,
         win_err_highlight: true,
         game_highlighting: true,
         game_opacity: .2,
         game_boundaries: false,
         gamepoints: false,
         score: true,
         points: true,
         winner: true
      },

      colors: {
         orientation: 'yellow',
         gamepoints: 'black',
         players: { 0: "blue" , 1: "purple" }
      }

    }

    // functions which should be accessible via ACCESSORS
    var update;

    // programmatic
    var dom_parent;

    // DEFINABLE EVENTS
    // Define with ACCESSOR function chart.events()
    var events = {
       'set_box': { 'mouseover': null, 'mouseout': null },
       'update': { 'begin': null, 'end': null },
       'point_bars': { 'mouseover': null, 'mouseout': null, 'click': null }
    };

    function chart(selection) {
        selection.each(function () {

            dom_parent = d3.select(this);

            // append svg
            var root = dom_parent.append('svg')
                .attr('class', options.class + 'root')
                .style('width', options.width + 'px' )
                .style('height', options.height + 'px' );

            // append children g
            var pts = root.append('g').attr('class', options.class + 'pts')
                          .attr('transform', 'translate(5, 5)')

            // For Point Bars which must always be on top
            var ptsHover = root.append('g').attr('class', options.class + 'pts')
                          .attr('transform', 'translate(5, 5)')

            // append labels
            var set_winner = pts.append('text')
                    .attr('class', options.class + 'Header')
                    .attr('opacity', 0)
                    .attr('font-size', options.header.font_size)
                    .attr('font-weight', options.header.font_weight)
                    .attr('x', function(d, i) { return (options.margins.left) + 'px'})
                    .attr('y', function(d, i) { return (options.margins.top + 8) + 'px' })

            var set_score = pts.append('text')
                    .attr('class', options.class + 'Score')
                    .attr('opacity', 0)
                    .attr('font-size', options.score.font_size)
                    .attr('font-weight', options.score.font_weight)
                    .attr('x', function(d, i) { return (options.margins.left) + 'px'})
                    .attr('y', function(d, i) { return (options.margins.top + 20) + 'px' })

            var set_points = pts.append('text')
                    .attr('class', options.class + 'Points')
                    .attr('opacity', 0)
                    .attr('font-size', options.score.font_size)
                    .attr('font-weight', options.score.font_weight)
                    .attr('x', function(d, i) { return (options.margins.left + 40) + 'px'})
                    .attr('y', function(d, i) { return (options.margins.top + 20) + 'px' })

            // resize used to disable transitions during resize operation
            update = function(resize) {
               if (!set_data) { return false; }


               root
                .transition().duration(resize ? 0 : options.display.transition_time)
                .style('width', options.width + 'px')
                .style('height', options.height + 'px');
        
               var points = set_data.points();
               var set_options = set_data.options();
               game_data = set_data.games();
               player_data = set_data.player_data();

               var games4set = (set_options.set.games / 2) * 4;
               var longest_rally = Math.max.apply(null, points.map(function(m) { return m.rally ? m.rally.length : 0 })) + 2;

               displayScore(resize);

               var xScale = d3.scale.linear()
                    .domain([0, calcWidth()])
                    .range([0, options.width - (options.margins.left + options.margins.right)]);

               var yScale = d3.scale.linear()
                    .range([options.height - (options.margins.top + options.margins.bottom), options.margins.bottom])
                    .domain([-2, games4set - 1]);

               // Set Box
               var set_box = pts.selectAll("." + options.class + "SetBox")
                   .data([options.id]) // # of list elements only used for index, data not important

               set_box.enter()
                   .append("rect")
                   .attr("class", options.class + "SetBox")
                   .style("position", "relative")
                   .attr("height", function() { return options.height - (options.margins.top + options.margins.bottom) } )
                   .attr("width", function() { return xScale(boxWidth() + 1); })
                   .attr('stroke', 'black')
                   .attr('stroke-width', 1)
                   .attr('fill', 'none')
                   .on('mouseover', function(d, i) { if (events.set_box.mouseover) events.set_box.mouseover(d, i); })
                   .on('mouseout', function(d, i) { if (events.set_box.mouseout) events.set_box.mouseout(d, i); })

                set_box.exit()
                   .transition().duration(resize ? 0 : options.display.transition_time)
                   .style('opacity', 0)
                   .remove()

                set_box
                   .transition().duration(resize ? 0 : options.display.transition_time)
                   .attr("height", function() { return options.height - (options.margins.top + options.margins.bottom) } )
                   .attr("width", function() { return xScale(boxWidth() + 1); })

                // Game Boundaries
                var game_boundaries = pts.selectAll("." + options.class + "GameBoundary")
                   .data(game_data)

                game_boundaries.enter()
                   .append('rect')
                   .attr("class", options.class + "GameBoundary")

                game_boundaries.exit()
                   .remove()

                game_boundaries
                   .attr("id", function(d, i) { return options.class + options.id + 'boundary' + i; })
                   .transition().duration(resize ? 0 : options.display.transition_time)
                   .attr('opacity', function() { return options.display.game_boundaries ? .02 : 0 })
                   .attr("transform", function(d, i) { return "translate(" + xScale(d.range[0]) + ", 0)"; })
                   .attr("height", yScale(-2))
                   .attr('width', function(d) { return xScale(d.range[1] + 1) - xScale(d.range[0]); })
                   .attr('stroke', 'black')
                   .attr('stroke-width', 1)
                   .attr('fill', 'none')

                // Game Boxes
                var game_boxes = pts.selectAll("." + options.class + "Game")
                   .data(game_data)

                game_boxes.enter()
                   .append('rect')
                   .attr("class", options.class + "Game")

                game_boxes.exit()
                   .remove()

                game_boxes
                   .attr("id", function(d, i) { return options.class + options.id + 'game' + i; })
                   .transition().duration(resize ? 0 : options.display.transition_time)
                   .attr('opacity', function() { return options.display.game_boundaries ? .02 : 0 })
                   .attr("transform", function(d, i) { return "translate(" + xScale(d.range[0]) + ", 0)"; })
                   .attr("height", yScale(-2))
                   .attr('width', function(d) { return xScale(d.range[1] + 1) - xScale(d.range[0]); })
                   .attr('stroke', function(d) { return options.colors.players[d.winner]; })
                   .attr('stroke-width', 1)
                   .attr('fill', function(d) { return options.colors.players[d.winner]; })

                // Player PTS Lines
                var lineGen = d3.svg.line()
                   .x(function(d, i) { return xScale(i); })
                   .y(function(d) { return yScale(games4set - d.pts); })

                var pts_lines = pts.selectAll("." + options.class + "Line")
                   .data([0, 1])

                pts_lines.enter()
                   .append('path')
                   .attr('class', options.class + 'Line')
                   .attr('id', function(d) { return options.class + options.id + 'player' + d + 'Line'; })
                   .attr('fill', 'none')

                pts_lines.exit()
                   .remove()

                pts_lines
                   .transition().duration(resize ? 0 : options.display.transition_time / 2)
                   .style('opacity', .1)
                   .transition().duration(resize ? 0 : options.display.transition_time / 2)
                   .style('opacity', 1)
                   .attr('stroke', function(d) { return options.colors.players[d]; })
                   .attr('stroke-width', function(d) { return options.lines.width; })
                   .attr('d', function(d) { return lineGen(player_data[d]) })

                var bp_wrappers = pts.selectAll('.' + options.class + 'BPWrapper')
                   .data(player_data) 

                bp_wrappers.enter()
                   .append('g')
                   .attr('class', options.class + 'BPWrapper');

                /*
                bp_wrappers.exit()

                bp_wrappers
                */

                var breakpoints = bp_wrappers.selectAll('.' + options.class + 'Breakpoint')
                   .data(function(d, i) { return add_index(d, i); })

                breakpoints.enter()
                   .append('circle')
                   .attr('class', options.class + 'Breakpoint')
                   .attr('opacity', '0')

                breakpoints.exit()
                   .attr('opacity', '0')
                   .remove()

                breakpoints
                   .transition().duration(resize ? 0 : options.display.transition_time / 2)
                   .style('opacity', 0)
                   .transition().duration(resize ? 0 : options.display.transition_time / 2)
                   .attr('fill', function(d, i) { 
                      if (points[i - 1] && points[i - 1].breakpoint != undefined) {
                         return options.colors.players[d._i]; 
                      } else if (points[i - 1] && points[i - 1].gamepoint != undefined) {
                         return options.colors.gamepoints;
                      }
                   })
                   .style('opacity', function(d, i) { 
                      if (points[i - 1]) {
                         if (points[i - 1].breakpoint != undefined) {
                            return points[i - 1].breakpoint == d._i ? 1 : 0
                         } else if (points[i - 1].gamepoint != undefined && options.display.gamepoints) {
                            return points[i - 1].gamepoint == d._i ? 1 : 0
                         }
                      }
                   })
                   .attr("cx", function(d, i) { return xScale(i); })
                   // .attr("cy", function(d) { return yScale(((set_options.set.games / 2) * 4) - d.pts); })
                   .attr("cy", function(d) { return yScale(games4set - d.pts); })
                   .attr("r", 2)


                var points_index = d3.range(points.length);
                var barsX = d3.scale.ordinal()
                   .domain(points_index)
                   .rangeBands([0, xScale(points.length)], 0, 0)

                var bX = d3.scale.linear()
                   .domain([0, points.length])
                   .range([0, xScale(points.length)])


                // gradients cause hover errors when data is replaced
                pts.selectAll('.gradient' + options.id).remove();

                var gradients = pts.selectAll('.gradient' + options.id)
                     .data(d3.range(points.length)) // data not important, only length of array

                gradients.enter()
                     .append('linearGradient')
                     .attr("id", function(d, i) { return 'gradient' + options.id + i; })
                     .attr("class", function() { return "gradient" + options.id })
                     .attr("gradientUnits", "userSpaceOnUse")
                     .attr("x1", function(d) { return barsX.rangeBand() / 2; })
                     .attr("y1", function(d) { return 0 })
                     .attr("x2", function(d) { return barsX.rangeBand() / 2; })
                     .attr("y2", function(d) { return yScale(-2) })

                gradients.exit()
                     .remove();

                gradients
                     .attr("transform", function(d, i) { return "translate(" + bX(i) + ", 0)"; })
   
                var point_stops = gradients.selectAll(".points_stop")
                     .data(function(d, i) { return calcStops(points[d], i); })
    
                point_stops.enter()
                     .append("stop")
                     .attr("class", "points_stop")
                     .attr("offset", function(d) { return d.offset; })
                     .attr("stop-color", function(d) { return d.color; });
                
                point_stops.exit()
                     .remove();

                point_stops
                     .attr("offset", function(d) { return d.offset; })

                var point_bars = ptsHover.selectAll("." + options.class + "Bar")
                   .data(d3.range(points.length)) // data not important, only length of array

                point_bars.enter()
                   .append("line")
                   .attr("class", options.class + "Bar")
                   .attr('opacity', '0')

                point_bars.exit()
                   .transition().duration(resize ? 0 : options.display.transition_time)
                   .attr('opacity', '0')
                   .remove()

                point_bars
                   .attr('opacity', '0')
                   .attr("transform", function(d, i) { return "translate(" + bX(i) + ", 0)"; })
                   .attr("x1", function(d) { return barsX.rangeBand() / 2; })
                   .attr("y1", function(d) { return 0 })
                   .attr("x2", function(d) { return barsX.rangeBand() / 2; })
                   .attr("y2", function(d) { return yScale(-2) })
                   .attr("stroke-width", function() { return barsX.rangeBand(); })
                   .attr("stroke", function(d, i) { return 'url(#gradient' + options.id + i + ')' })
                   .attr("uid", function(d, i) { return 'point' + i; })
                   .on("mousemove", function(d, i) { 
                      if (options.display.point_highlighting) { d3.select(this).attr("opacity", options.display.point_opacity); }
                      if (options.display.game_highlighting && points[i]) {
                         d3.select('[id="' + options.class + options.id + 'game' + points[i].game + '"]').attr("opacity", options.display.game_opacity);
                      }
                      if (events.point_bars.mouseover) { events.point_bars.mouseover(points[d], i); };
                      if (d==0) {
                         ptsHover.selectAll('.' + options.class + 'Bar').attr("opacity", options.display.point_opacity);
                      }
                      highlightScore(d, i);
                   })
                   .on("mouseout", function(d, i) { 
                      ptsHover.selectAll('.' + options.class + 'Bar').attr("opacity", 0);
                      pts.selectAll('.' + options.class + 'Game').attr("opacity", "0");
                      if (events.point_bars.mouseout) { events.point_bars.mouseout(points[d], i); }; 
                      displayScore();
                   })
                   .on("click", function(d, i) {
                      if (events.point_bars.click) { events.point_bars.click(points[d], i, this); }; 
                   })

               function displayScore(resize) {
                  var legend = '';
                  var scoreboard = set_data.score();
                  if (scoreboard && scoreboard.legend) { legend = scoreboard.legend; }

                  set_winner
                    .transition().duration(resize ? 0 : options.display.transition_time)
                    .attr('opacity', 1)
                    .attr('fill', options.colors.players[scoreboard ? scoreboard.leader : ''])
                    .text(legend);

                  if (player_data[0].length && (lastElement(player_data[0]).pts == 0 || lastElement(player_data[1]).pts == 0)) {

                     // var game = points[points.length - 1].game;
                     var winner = points[points.length - 1].winner;

                     var game_score = scoreboard.game_score;
                     if (winner) {
                        // reverse set score if winner == 1
                        var score_split = game_score.split(' ');
                        var tbscore = score_split[0].split('(');
                        if (tbscore) {
                           game_score = tbscore[0].split('-').reverse().join('-');
                        } else {
                           game_score = score_split[0].split('-').reverse().join('-');
                        }
                        if (tbscore[1]) game_score += '(' + tbscore[1];
                        if (score_split[1]) game_score += score_split[1];
                     }

                     set_score
                       .transition().duration(resize ? 0 : options.display.transition_time)
                       .attr('opacity', 1)
                       .attr('fill', options.colors.players[winner])
                       .text(game_score);

                     set_points
                       .transition().duration(resize ? 0 : options.display.transition_time)
                       .attr('opacity', 0)

                  } else {
                     if (points.length) {
                        highlightScore(points.length - 1);
                     } else {
                        set_winner
                          .transition().duration(resize ? 0 : options.display.transition_time)
                          .attr('opacity', 0)

                        set_score
                          .transition().duration(resize ? 0 : options.display.transition_time)
                          .attr('opacity', 0)

                        set_points
                          .transition().duration(resize ? 0 : options.display.transition_time)
                          .attr('opacity', 0)
                     }
                  }
               }

               function highlightScore(d) {
                  if (!points[d]) return;
                  var scoreboard = set_data.score(d);
                  var point_score = scoreboard.point_score;
                  if (options.score.reverse && points[d].server) point_score = point_score.split('-').reverse().join('-');

                  // check for hover over end of set
                  if (player_data[0][d + 1] && (player_data[0][d + 1].pts == 0 || player_data[1][d + 1].pts == 0)) {
                     pts.selectAll('.' + options.class + 'Game').attr("opacity", options.display.game_opacity);
                  }

                  set_winner
                    .transition().duration(100) // necessary
                    .attr('opacity', 1)
                    .attr('fill', function() { return scoreboard.leader != undefined ? options.colors.players[scoreboard.leader] : 'black'; })
                    .text(scoreboard.legend);

                  set_score
                    .transition().duration(100) // necessary
                    .attr('opacity', 1)
                    .attr('fill', function() { return scoreboard.leader != undefined ? options.colors.players[scoreboard.leader] : 'black'; })
                    .text(scoreboard.game_score);

                  set_points
                    .transition().duration(100) // necessary
                    .attr('opacity', 1)
                    .attr('fill', function() { return scoreboard.leader != undefined ? options.colors.players[scoreboard.leader] : 'black'; })
                    .text(point_score);
               }

               function calcStops(point, i) {
                  var win_pct = 0;
                  var err_pct = 0;
                  var u_pct = 0;

                  if (options.display.win_err_highlight) {
                     var rally = point.rally;
                     var result = point.result;
                     var rally_pct = rally ? 100 - Math.floor(rally.length / longest_rally * 100) : 100;
                     if (winners.indexOf(result) >= 0) {
                        win_pct = rally_pct;
                     } else if (errors.indexOf(result) >= 0) {
                        err_pct = rally_pct;
                     } else {
                        u_pct = rally_pct;
                     }
                  }

                  return [ {offset: "0%", color: 'blue' }, 
                           {offset: u_pct + "%", color: 'blue' }, 
                           {offset: u_pct + "%", color: 'green' }, 
                           {offset: u_pct + win_pct + "%", color: 'green' }, 
                           {offset: u_pct + win_pct + "%", color: 'red' }, 
                           {offset: u_pct + win_pct + err_pct + "%", color: 'red' }, 
                           {offset: u_pct + win_pct + err_pct + "%", color: options.colors.orientation }, 
                           {offset: "100%", color: options.colors.orientation } ] 
               }

            }
        });
    }

    // REUSABLE functions
    // ------------------

    function add_index(d, i) {
       for (var v=0; v<d.length; v++) { d[v]['_i'] = i; }
       return d;
    }

    function boxWidth() {
       var dl = set_data.points().length - 1;
       var player_data = set_data.player_data();
       var pw = dl < options.set.average_points ? options.set.average_points : player_data[0].length - 1;
       if (player_data[0].length && (lastElement(player_data[0]).pts == 0 || lastElement(player_data[1]).pts == 0)) pw = dl;
       return pw;
    }

    function calcWidth() {
       var dl = set_data.points().length - 1;
       var mw = Math.max(dl, options.points.max_width_points, options.set.average_points);
       return mw;
    }

    // ACCESSORS

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        var vKeys = Object.keys(values);
        var oKeys = Object.keys(options);
        for (var k=0; k < vKeys.length; k++) {
           if (oKeys.indexOf(vKeys[k]) >= 0) {
              if (typeof(options[vKeys[k]]) == 'object') {
                 var sKeys = Object.keys(values[vKeys[k]]);
                 var osKeys = Object.keys(options[vKeys[k]]);
                 for (var sk=0; sk < sKeys.length; sk++) {
                    if (osKeys.indexOf(sKeys[sk]) >= 0) {
                       options[vKeys[k]][sKeys[sk]] = values[vKeys[k]][sKeys[sk]];
                    }
                 }
              } else {
                 options[vKeys[k]] = values[vKeys[k]];
              }
           }
        }
        return chart;
    }

    chart.data = function(set_object) {
      if (!arguments.length) return set_data;
      set_data = set_object;
    }

   chart.events = function(functions) {
        if (!arguments.length) return events;
        var fKeys = Object.keys(functions);
        var eKeys = Object.keys(events);
        for (var k=0; k < fKeys.length; k++) {
           if (eKeys.indexOf(fKeys[k]) >= 0) events[fKeys[k]] = functions[fKeys[k]];
        }
        return chart;
   }

    chart.colors = function(colores) {
        if (!arguments.length) return options.colors;
        options.colors.players = colores;
        return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return options.width;
        options.width = value;
        // scaleChart();
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        // scaleChart();
        return chart;
    };

    chart.update = function(resize) {
       if (events.update.begin) events.update.begin(); 
       if (typeof update === 'function') update(resize);
        setTimeout(function() { 
          if (events.update.end) events.update.end(); 
        }, options.display.transition_time);
       return true;
    }

    chart.duration = function(value) {
        if (!arguments.length) return options.display.transition_time;
       options.display.transition_time = value;
       return chart;
    }

    function lastElement(arr) { return arr[arr.length - 1]; }

    // RESIZING
    // ---------

    window.addEventListener( 'resize', scaleChart, false );

    function scaleChart() {
       if (!options.display.responsive) return;
       /*
       var height_offset = dom_parent.node().getBoundingClientRect().top;
       var height = Math.min(options.heightMax, document.documentElement.clientHeight - height_offset);
       if (height < options.margins.top + options.margins.bottom) { height = options.margins.top + options.margins.bottom; }
       options.height = height;

       var width_offset = dom_parent.node().getBoundingClientRect().left;
       var width = Math.min(options.widthMax, document.documentElement.clientWidth - width_offset);
       if (width < options.margins.left + options.margins.right) { width = options.margins.left + options.margins.right; }
       options.width = width;
       */
       chart.update();
    }

    return chart;
}
// TODO: color the gamescore in the momentum chart

function momentumChart() {

    var data;
    var update;
    var fish_school = [];

    var options = {
        id: 'm1',
        fullWidth: window.innerWidth,
        fullHeight: window.innerHeight,
        margins: {
           top:    1, bottom: 1,  // Chrome bug can't be 0
           left:   3, right:  3   // Chrome bug can't be 0
        },
        fish: {
           gridcells: ['0', '15', '30', '40', 'G'],
           tailcells: ['D', 'A', 'G'],
           cell_size: undefined,
           min_cell_size: 5,
           max_cell_size: 10
        },
        display: {
           continuous:  false,
           orientation: 'vertical',
           settingsImg: false,
           transition_time: 0,
           sizeToFit:   true,
           service:     true,
           player:      true,
           rally:       true,
           score:       false,
           momentum_score: true,
           grid:        true
        },
        colors: {
           players: { 0: 'red', 1: 'black' },
           results: { 'Out': 'red', 'Net': 'coral', 'Unforced Error': 'red', 'Forced': 'orange', 
                      'Ace': 'lightgreen', 'Serve Winner': 'lightgreen', 'Winner': 'lightgreen', 
                      'Forced Volley Error': 'orange', 'Forced Error': 'orange', 'In': 'yellow', 
                      'Passing Shot': 'lightgreen', 'Out Passing Shot': 'red', 'Net Cord': 'yellow', 
                      'Out Wide': 'red', 'Out Long': 'red', 'Double Fault': 'red', 'Unknown': 'blue',
                      'Error': 'red'
           }
        }
    };

    function width() { return options.fullWidth - options.margins.left - options.margins.right }
    function height() { return options.fullHeight - options.margins.top - options.margins.bottom }

    options.height = height();
    options.width = width();

    var default_colors = { default: "#235dba" };
    var colors = JSON.parse(JSON.stringify(default_colors));

    var events = {
       'settings': { 'click': null },
       'update':  { 'begin': null, 'end': null },
       'point':    { 'mouseover': null, 'mouseout': null, 'click': null }
    };

    function chart(selection) {
      selection.each(function () {
         dom_parent = d3.select(this);

       var root = dom_parent.append('div')
           .attr('class', 'momentumRoot')
           .attr('transform', "translate(0, 0)")

       var momentumFrame = root.append('svg')
          .attr({ 
             'class':'momentumFrame', 
//             'xmlns': "http://www.w3.org/2000/svg",
//             'xmlns:xlink': "http://www.w3.org/1999/xlink"
          });

       momentumFrame.node().setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
       momentumFrame.node().setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

       var bars = momentumFrame.append('g').attr('id', 'momentumBars');
       var fish = momentumFrame.append('g').attr('id', 'momentumFish');
       var game = momentumFrame.append('g').attr('id', 'momentumGame');
 
       update = function(opts) {

          if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
             var dims = selection.node().getBoundingClientRect();
             if (options.display.orientation == 'vertical') {
                options.fullWidth = Math.max(dims.width, 100);
                options.fullHeight = Math.max(dims.height, 100);
             } else {
                options.fullHeight = cellSize() * maxDiff() * 2;
             }
          }

          options.height = height();
          options.width = width();

          var vert = options.display.orientation == 'vertical' ? 1 : 0;
          var fish_offset = vert ? options.width : options.height;
          var fish_length = vert ? options.height : options.width;
          var midpoint = fish_offset / 2;

          // extract all games from UMO
          var max_rally = 0;
          var all_games = [];
          var sets = data.sets();
          sets.forEach(function(s) {
             var games = s.games();
             games.forEach(function(g, i) {
                var points = s.points().slice(g.range[0], g.range[1] + 1);
                points.forEach(function(p) {
                   if (p.rally != undefined && p.rally.length > max_rally) max_rally = p.rally.length;
                })
                all_games.push({ points: points, score: g.score, last_game: games.length == i + 1 });
             });
          })

          var cell_size = cellSize();

          // remove extraneous fish instances
          var old_fish = fish_school.slice(all_games.length);
          old_fish.forEach(function(f) {
              d3.selectAll('.c' + f.options().id).remove();
          });
          // trim school based on length of data
          fish_school = fish_school.slice(0, all_games.length);

          var radius;
          var coords = [0, 0];
          var score_lines = [];
          all_games.forEach(function(g, i) {
             // add fish where necessary
             if (!fish_school[i]) { 
                fish_school.push(gameFish()); 
                momentumFrame.call(fish_school[i]);
                fish_school[i].g({ 
                   bars: bars.append('g').attr('class', 'cGF' + i), 
                   fish: fish.append('g').attr('class', 'cGF' + i), 
                   game: game.append('g').attr('class', 'cGF' + i) 
                });
                fish_school[i].options({id: 'GF' + i, display: { score: false, point_score: false }});
             }
             fish_school[i].width(fish_offset).height(fish_offset);
             fish_school[i].options({ 
                score: g.score, 
                fish: { cell_size: cell_size, max_rally: max_rally },
                display: { 
                   orientation: options.display.orientation,
                   service: options.display.service,
                   rally: options.display.rally,
                   player: options.display.player,
                   grid: options.display.grid
                },
                colors: { players: { 0: options.colors.players[0], 1: options.colors.players[1] }}
             });
             fish_school[i].data(g.points);
             fish_school[i].coords(coords).update();
             var new_coords = fish_school[i].coords();
             coords[0] += vert ? new_coords[0] : new_coords[1] - (new_coords[2] / 2);
             coords[1] += vert ? new_coords[1] : new_coords[0] + (new_coords[2] / 2);
             score_lines.push({ 
                score: g.score, 
                l: coords[1] + (new_coords[2] * 1.75),
                o: coords[0] + (new_coords[2] * 1.75),
                set_end: g.last_game
             });
             if (g.last_game && !options.display.continuous) { coords[vert ? 0 : 1] = 0; }
             radius = new_coords[2] / 2;
          });

          // This resize *must* take place after the fishshcool has been generated!
          // ---------------------------------------------------------------------
          root
             .attr({
                'width':    options.width + 'px',
                'height':   (vert ? (100 + coords[1]) : options.height) + 'px'
             })
             .on('mouseover', showSettings)
             .on('mouseout', hideSettings);

          momentumFrame
             .attr({
                'width':    options.width + 'px',
                'height':   (vert ? (100 + coords[1])  : options.height) + 'px'
             });
          // ---------------------------------------------------------------------

          var midline = fish.selectAll('.midline' + options.id)
             .data([0])

          midline.enter()
            .append('line')
            .attr({
               "class":          "midline" + options.id,
               "x1":             vert ? midpoint : radius,
               "x2":             vert ? midpoint : coords[0] + (5 * (radius || 0)),
               "y1":             vert ? radius : midpoint,
               "y2":             vert ? coords[1] + (5 * radius) : midpoint,
               "stroke-width":   lineWidth,
               "stroke":         "#ccccdd"
            })

          midline.exit().remove()

          midline
            .transition().duration(options.display.transition_time)
            .attr({
               "x1":             vert ? midpoint : radius,
               "x2":             vert ? midpoint : coords[0] + (5 * (radius || 0)),
               "y1":             vert ? radius : midpoint,
               "y2":             vert ? coords[1] + (5 * radius) : midpoint,
               "stroke-width":   lineWidth,
               "stroke":         "#ccccdd"
            })

          var scoreLines = fish.selectAll('.score_line' + options.id)
             .data(score_lines)

          scoreLines.enter()
            .append('line')
            .attr({
               "class":          "score_line" + options.id,
               "x1":             function(d) { return vert ? cell_size * 2 : d.o },
               "x2":             function(d) { return vert ? fish_offset - cell_size * 2 : d.o },
               "y1":             function(d) { return vert ? d.l : cell_size * 3 },
               "y2":             function(d) { return vert ? d.l : fish_offset - cell_size * 3 },
               "stroke-width":   lineWidth,
               "stroke-dasharray": function(d) { return d.set_end ? "0" : "5,5"; },
               "stroke":         function(d) { return d.set_end ? "#000000" : "#ccccdd"; }
            })
 
          scoreLines.exit().remove()
 
          scoreLines
            .transition().duration(options.display.transition_time)
            .attr({
               "x1":             function(d) { return vert ? cell_size * 2 : d.o },
               "x2":             function(d) { return vert ? fish_offset - cell_size * 2 : d.o },
               "y1":             function(d) { return vert ? d.l : cell_size * 3 },
               "y2":             function(d) { return vert ? d.l : fish_offset - cell_size * 3 },
               "stroke-width":   lineWidth,
               "stroke-dasharray": function(d) { return d.set_end ? "0" : "5,5"; },
               "stroke":         function(d) { return d.set_end ? "#000000" : "#ccccdd"; }
            })

          if (options.display.momentum_score) {
             var score_text = fish.selectAll(".score_text" + options.id)
                .data(score_lines)

             score_text.enter()
                .append('g')
                .attr("class", "score_text" + options.id)

             score_text.exit().remove()

             score_text
                .attr({ 'transform':  scoreText })

             var scores = score_text.selectAll(".score" + options.id)
                .data(function(d) { return d.score; })

             scores.enter()
                .append('text')
                .attr({
                   'class':          'score' + options.id,
                   'transform':      scoreT,
                   'font-size':       radius * 4.0 + 'px',
                   'opacity':         .1,
                   'text-anchor':    'middle'
                })

             scores.exit().remove()

             scores
                .transition().duration(options.display.transition_time)
                .attr({
                   'transform':      scoreT,
                   'font-size':      radius * 4.0 + 'px',
                   'opacity':        .1,
                   'text-anchor':    'middle'
                })
                .text(function(d) { return d } )
          } else {
             fish.selectAll(".score_text" + options.id).remove();
          }

          function scoreText(d) { return translate(0, (vert ? d.l : d.o - radius), 0); }
          function scoreT(d, i) {
             var offset = vert ? fish_offset / 3 : options.height / 3;
             var o = i ? midpoint + offset : midpoint - offset + radius * 3;
             var l = -1 * radius * (vert ? .25 : .5);
             return translate(o, l, 0);
          }

          function translate(o, l, rotate) {
             var x = vert ? o : l;
             var y = vert ? l : o;
             return "translate(" + x + "," + y + ") rotate(" + rotate + ")" 
          }

          function lineWidth(d, i) { return radius > 20 ? 2 : 1; }

          function cellSize() {
             var cell_size;

             if (options.display.orientation == 'vertical') {
                // if the display is vertical use the width divided by maxDiff
                cell_size = options.width / 2 / (maxDiff() + 1);
             } else {
                // if the display is horizontal use the width divided by # points
                var radius = options.width / (data.points().length + 4);
                var cell_size = Math.sqrt(2 * radius * radius);
             }
            return Math.min(options.fish.max_cell_size, cell_size);
          }

          function maxDiff() {
             var max_diff = 0;
             var cumulative = [0, 0];
             var pp = data.winProgression().split('');
             pp.forEach(function(p) {
                cumulative[p] += 1;
                var diff = Math.abs(cumulative[0] - cumulative[1]);
                if (diff > max_diff) max_diff = diff;
             });
             return max_diff;
          }

          if (options.display.settingsImg) {
             var settings = momentumFrame.selectAll('image')
                .data([0])

             settings.enter()
               .append('image')
                .attr({
                   'xlink:href': options.display.settingsImg,
                   'x': 0, 'y': 0,
                   'height': '20px',
                   'width':  '20px',
                   'opacity': 0
                })
               .on('click', function() { if (events.settings.click) events.settings.click(); }) 

             settings.exit().remove();
          } else {
             momentumFrame.selectAll('image').remove();
          }

          function showSettings() {
             if (options.display.settingsImg) settings.attr('opacity', 1);
          }

          function hideSettings() {
             if (options.display.settingsImg) settings.attr('opacity', 0);
          }

       }
      });
    }

    // ACCESSORS

    chart.exports = function() {
       return { function1: function1, function1: function1 }
    }

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
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

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return options.fullWidth;
        options.fullWidth = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.fullHeight;
        options.fullHeight = value;
        return chart;
    };

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        return chart;
    };

    chart.update = function(opts) {
      if (events.update.begin) events.update.begin(); 
      if (typeof update === 'function' && data) update(opts);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
    }

    chart.colors = function(color3s) {
        if (!arguments.length) return colors;
        if (typeof color3s !== 'object') return false;
        var keys = Object.keys(color3s);        
        if (!keys.length) return false;
        // remove all properties that are not colors
        keys.forEach(function(f) { if (! /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color3s[f])) delete color3s[f]; })
        if (Object.keys(color3s).length) {
           colors = color3s;
        } else {
           colors = JSON.parse(JSON.stringify(default_colors));
        }
        return chart;
    }

   return chart;
}

function gameFish() {

    var data;
    var fish_width;
    var fish_height;
    var coords = [0, 0];
    var last_coords;
    var update;

    var options = {
        id: 'gf1',
        score: [0, 0],
        width: window.innerWidth,
        height: window.innerHeight,
        margins: {
           top:    10, bottom: 10, 
           left:   10, right:  10
        },
        fish: {
           gridcells: ['0', '15', '30', '40', 'G'],
           tailcells: ['D', 'A', 'G'],
           max_rally: undefined,
           cell_size: undefined,
           min_cell_size: 5,
           max_cell_size: 20
        },
        set: {
           tiebreak_to: 7
        },
        display: {
           orientation: 'vertical',
           transition_time: 1000,
           sizeToFit: false,

           point_score: true,
           service: true,
           player: true,
           rally: true,
           score: true,
           grid: true
        },
        colors: {
           players: { 0: 'red', 1: 'black' },
           results: { 'Out': 'red', 'Net': 'coral', 'Unforced Error': 'red', 'Forced': 'orange', 
                      'Ace': 'lightgreen', 'Serve Winner': 'lightgreen', 'Winner': 'lightgreen', 
                      'Forced Volley Error': 'orange', 'Forced Error': 'orange', 'In': 'yellow', 
                      'Passing Shot': 'lightgreen', 'Out Passing Shot': 'red', 'Net Cord': 'yellow', 
                      'Out Wide': 'red', 'Out Long': 'red', 'Double Fault': 'red', 'Unknown': 'blue',
                      'Error': 'red'
           }
        }
    };

    var default_colors = { default: "#235dba" };
    var colors = JSON.parse(JSON.stringify(default_colors));

    var events = {
       'update':  { 'begin': null, 'end': null },
       'point':    { 'mouseover': null, 'mouseout': null, 'click': null }
    };

    var root;
    var bars;
    var fish;
    var game;

    function chart(selection) {
      var parent_type = selection[0][0].tagName.toLowerCase();

      if (parent_type != 'svg') {
         root = selection.append('div')
             .attr('class', 'fishRoot');

         var fishFrame = root.append('svg')
            .attr({ 
               'id':    'gameFish' + options.id,
               'class': 'fishFrame' 
            });

         bars = fishFrame.append('g');
         fish = fishFrame.append('g');
         game = fishFrame.append('g');

      }

      update = function(opts) {

         if (bars == undefined || fish == undefined || game == undefined) return;

         if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
            var dims = selection.node().getBoundingClientRect();
            options.width = Math.max(dims.width, 100);
            options.height = Math.max(dims.height, 100);
         }

         var tiebreak = false;
         var max_rally = 0;
         data.forEach(function(e) { 
            if (e.rally && e.rally.length > max_rally) max_rally = e.rally.length;
            if (e.score.indexOf('T') > 0) tiebreak = true; 
         });

         if (options.fish.max_rally && options.fish.max_rally > max_rally) max_rally = options.fish.max_rally;

         fish_width  = options.width  - (options.margins.left + options.margins.right);
         fish_height = options.height - (options.margins.top + options.margins.bottom);
         var vert = options.display.orientation == 'vertical' ? 1 : 0;
         var fish_offset = vert ? fish_width : fish_height;
         var fish_length = vert ? fish_height : fish_width;
         var midpoint = (vert ? options.margins.left : options.margins.top) + fish_offset / 2;
         var sw = 1;    // service box % offset
         var rw = .9;   // rally_width % offset

         bars.attr('transform', 'translate(' + (vert ? 0 : coords[0]) + ',' + (vert ? coords[1] : 0) + ')');
         fish.attr('transform', 'translate(' + coords[0] + ',' + coords[1] + ')');
         game.attr('transform', 'translate(' + coords[0] + ',' + coords[1] + ')');

         if (options.fish.cell_size) {
            var cell_size = options.fish.cell_size;
         } else {
            var offset_divisor = tiebreak ? options.set.tiebreak_to + 4 : options.fish.gridcells.length + 2;
            var cell_offset = fish_offset / (options.fish.gridcells.length + (options.display.service ? offset_divisor : 0));
            var cell_length = fish_length / (data.length + 2);
            var cell_size = Math.min(cell_offset, cell_length);
            var cell_size = Math.max(options.fish.min_cell_size, cell_size);
            var cell_size = Math.min(options.fish.max_cell_size, cell_size);
         }

         var diag = Math.sqrt(2 * Math.pow(cell_size, 2));
         var radius = diag / 2;

         grid_data = [];
         grid_labels = [];
         var grid_side = tiebreak ? options.set.tiebreak_to : options.fish.gridcells.length - 1;
         for (var g=0; g < grid_side; g++) {
            var label = tiebreak ? g : options.fish.gridcells[g];
            // l = length, o = offset
            grid_labels.push({ label: label, l: (g + (vert ? 1.25 : .75)) * radius, o: (g + (vert ? .75 : 1.25)) * radius, rotate: 45 });
            grid_labels.push({ label: label, l: (g + 1.25) * radius, o: -1 * (g + .75) * radius, rotate: -45 });
            for (var c=0; c < grid_side; c++) {
               grid_data.push([g, c]);
            }
         }

         var score_offset = options.display.score ? cell_size : 0;

         // check if this is a standalone SVG or part of larger SVG
         if (root) {
            root
               .attr({
                  'width':    options.width  + 'px',
                  'height':   options.height + 'px'
               });

            fishFrame
               .attr({
                  'width':    options.width  + 'px',
                  'height':   options.height + 'px'
               });
         }

         if (options.display.point_score) {
            var game_score = fish.selectAll('.game_score' + options.id)
               .data(grid_labels)
               
            game_score.enter()
               .append('text')
               .attr({
                  "font-size":   radius * .8 + "px",
                  "transform":   gscoreT,
                  "text-anchor": "middle"
               })

            game_score.exit()
               .remove()

            game_score
               .transition().duration(options.display.transition_time)
               .attr({
                  "class": "game_score" + options.id,
                  "font-size":   radius * .8 + 'px',
                  "transform":   gscoreT,
                  "text-anchor": "middle"
               })
               .text(function(d) { return d.label })
         } else {
            fish.selectAll('.game_score' + options.id).remove();
         }

         if (options.display.grid) {
            var gridcells = fish.selectAll('.gridcell' + options.id)
               .data(grid_data);

            gridcells.enter()
               .append('rect')
               .attr({
                  "class":          "gridcell" + options.id,
                  "stroke":         "#ccccdd",
                  "stroke-width":   lineWidth,
                  "width":          cell_size,
                  "height":         cell_size,
                  "transform":      gridCT,
                  "fill-opacity":   0
               })

            gridcells.exit()
               .remove()

            gridcells
               .transition().duration(options.display.transition_time)
               .attr({
                  "class":          "gridcell" + options.id,
                  "stroke-width":   lineWidth,
                  "width":          cell_size,
                  "height":         cell_size,
                  "transform":      gridCT,
                  "fill-opacity":   0
               })
         } else {
            fish.selectAll('.gridcell' + options.id).remove();
         }

         var gamecells = game.selectAll('.gamecell' + options.id)
              .data(data);

         gamecells.enter()
            .append('rect')
            .attr({
               "class":          "gamecell" + options.id,
               "transform":      gameCT,
               "stroke":         "#ccccdd",
               "stroke-width":   lineWidth,
               "opacity":     0
            })
            .style("fill", function(d) { return options.colors.players[d.winner]; })

         gamecells.exit()
            .remove()

         gamecells
            .attr("id", function(d, i) { return options.id + 'Gs' + d.set + 'g' + d.game + 'p' + i })
            .transition().duration(options.display.transition_time)
            .attr({
               "class":          "gamecell" + options.id,
               "width":          cell_size,
               "height":         cell_size,
               "transform":      gameCT,
               "stroke":         "#ccccdd",
               "stroke-width":   lineWidth,
               "opacity":        options.display.player ? 1 : 0
            })
            .style("fill", function(d) { return options.colors.players[d.winner]; })

         var results = game.selectAll('.result' + options.id)
            .data(data)
            
         results.enter()
            .append('circle')
            .attr({
               'class':    'result' + options.id,
               'opacity':  0,
               "cx":       zX,
               "cy":       zY,
               "r":        circleRadius
            })
            .style("fill", function(d) { return options.colors.results[d.result]; })

         results.exit()
            .remove()

         results
            .attr("id", function(d, i) { return options.id + 'Rs' + d.set + 'g' + d.game + 'p' + i })
            .transition().duration(options.display.transition_time)
            .attr({
               'opacity':        1,
               'stroke':         'black',
               "stroke-width":   lineWidth,
               "cx":             zX,
               "cy":             zY,
               "r":              circleRadius
            })
            .style("fill", function(d) { return options.colors.results[d.result]; })

         // offset Scale
         var oScale = d3.scale.linear()
            .range([0, fish_offset * rw])
            .domain([0, max_rally])

         // lengthScale
         var lScale = d3.scale.ordinal()
            .domain(d3.range(data.length))
            .rangeRoundBands([0, (data.length) * radius])

         if (options.display.rally) {
            var rally_bars = bars.selectAll(".rally_bar" + options.id)
               .data(data)

            rally_bars.enter()
               .append("rect")
               .attr({
                  "class":          "rally_bar" + options.id,
                  "opacity":        0,
                  "stroke":         "white",
                  "stroke-width":   lineWidth,
                  "fill":           "#eeeeff",
                  "transform":      rallyTstart,
                  "height":         vert ? lScale.rangeBand() : 0,
                  "width":          vert ? 0 : lScale.rangeBand()
               })

            rally_bars.exit()
               .remove()

            rally_bars
               .on("mouseover", function(d) { d3.select(this).attr('fill', 'yellow'); })
               .on("mouseout", function(d) { d3.select(this).attr('fill', '#eeeeff'); })
               .transition().duration(options.display.transition_time)
               .attr("id", function(d, i) { return options.id + 'Bs' + d.set + 'g' + d.game + 'p' + i })
               .attr({
                  "opacity":        1,
                  "stroke":         "white",
                  "stroke-width":   lineWidth,
                  "fill":           "#eeeeff",
                  "transform":      rallyT,
                  "height":         vert ? lScale.rangeBand() : rallyCalc,
                  "width":          vert ? rallyCalc : lScale.rangeBand()
               })
         } else {
            bars.selectAll(".rally_bar" + options.id).remove();
         }

         if (options.display.score) {
            var set_score = bars.selectAll(".set_score" + options.id)
               .data(options.score)

            set_score.enter()
               .append('text')
               .attr("class", "set_score" + options.id)

            set_score.exit().remove()

            set_score
               .attr({
                  'transform':      sscoreT,
                  'font-size':      radius * .8 + 'px',
                  'text-anchor':    'middle',
               })
               .text(function(d) { return d } )

            var ssb = bars.selectAll(".ssb" + options.id)
               .data(options.score)

            ssb.enter()
               .append('rect')
               .attr("class", "ssb" + options.id)

            ssb.exit().remove()

            ssb
               .attr({
                  'transform':      ssbT,
                  'stroke':         'black',
                  'stroke-width':   lineWidth,
                  'fill-opacity':   0,
                  'height':         radius + 'px',
                  'width':          radius + 'px'
               })

         } else {
            bars.selectAll(".set_score" + options.id).remove();
            bars.selectAll(".ssb" + options.id).remove();
         }

         if (options.display.service) {
            var serves = [];
            data.forEach(function(s, i) {
               var first_serve = false;
               var serve_outcomes = ['Ace', 'Serve Winner', 'Double Fault'];
               if (s.first_serve) {
                  first_serve = true;
                  serves.push({ point: i, serve: 'first', server: s.server, result: s.first_serve.error });
               }

               serves.push({ 
                  point: i, 
                  serve: first_serve ? 'second' : 'first', 
                  server: s.server,
                  result: serve_outcomes.indexOf(s.result) >= 0 ? s.result : 'In' 
               });
            });

            var service = bars.selectAll(".serve" + options.id)
               .data(serves)

            service.enter() .append("circle")
            service.exit()  .remove()

            service
               .attr({
                  "class":          "serve" + options.id,
                  "cx":             sX,
                  "cy":             sY,
                  "r":              circleRadius,
                  "stroke":         colorShot,
                  "stroke-width":   lineWidth,
                  "fill":           colorShot
               })

            var service_box = bars.selectAll(".sbox" + options.id)
               .data(data)

            service_box.enter()
               .append("rect")
               .attr({
                  "transform":      sBoxT,
                  "stroke":         "#ccccdd",
                  "stroke-width":   lineWidth,
                  "fill-opacity":   0,
                  "height":         vert ? lScale.rangeBand() : 1.5 * radius,
                  "width":          vert ? 1.5 * radius : lScale.rangeBand()
               })

            service_box.exit().remove()

            service_box
               .attr({
                  "transform":      sBoxT,
                  "class":          "sbox" + options.id,
                  "stroke-width":   lineWidth,
                  "height":         vert ? lScale.rangeBand() : 1.5 * radius,
                  "width":          vert ? 1.5 * radius : lScale.rangeBand()
               })

            var returns = bars.selectAll(".return" + options.id)
               .data(data)

            returns.enter()
               .append("circle")
               .attr({
                  "class":          "return" + options.id,
                  "cx":             rX,
                  "cy":             rY,
                  "r":              circleRadius,
                  "stroke":         colorReturn,
                  "stroke-width":   lineWidth,
                  "fill":           colorReturn
               })

            returns.exit()
               .remove()

            returns
               .attr({
                  "class":          "return" + options.id,
                  "cx":             rX,
                  "cy":             rY,
                  "r":              circleRadius,
                  "stroke":         colorReturn,
                  "stroke-width":   lineWidth,
                  "fill":           colorReturn
               })

         } else {
            bars.selectAll(".sbox" + options.id).remove();
            bars.selectAll(".return" + options.id).remove();
            bars.selectAll(".serve" + options.id).remove();
         }

         // ancillary functions for update()
         function circleRadius(d, i) { 
            return (options.display.player || options.display.service) ? radius / 4 : radius / 2; 
         }
         function lineWidth(d, i) { return radius > 20 ? 1 : .5; }
         function colorShot(d, i) { return options.colors.results[d.result]; }
         function colorReturn(d, i) { 
            if (d.rally == undefined) return "white";
            if (d.rally.length > 1) return 'yellow';
            if (d.rally.length == 1) return options.colors.results[d.result]; 
            return "white";
         }

         function rallyCalc(d, i) { return d.rally ? oScale(d.rally.length) : 0; }

         function sscoreT(d, i) {
            var o = i ? midpoint + radius * .5 : midpoint - radius * .5;
            var o = vert ? o : o + radius * .3;
            var l = radius * (vert ? .8 : .5);
            return translate(o, l, 0);
         }

         function ssbT(d, i) {
            var o = i ? midpoint : midpoint - radius;
            var l = 0;
            return translate(o, l, 0);
         }

         function gscoreT(d, i) {
            var o = +midpoint + d.o;
            var l = radius + d.l;
            return translate(o, l, d.rotate);
         }

         function gridCT(d, i) {
            var o = midpoint + ((d[1] - d[0] + vert - 1) * radius);
            var l = (d[0] + d[1] + 3 - vert ) * radius;
            return translate(o, l, 45);
         }

         function gameCT(d, i) {
            var o = midpoint + (findOffset(d.fish_score) + vert - 1) * radius;
            var l = (i + 4 - vert) * radius;
            last_coords = [o - midpoint, l - diag, diag];
            return translate(o, l, 45);
         }

         function sBoxT(d, i) {
            var o = d.server == 0 ? midpoint - (fish_offset / 2 * sw) : midpoint + (fish_offset / 2 * sw) - (1.5 * radius);
            var l = radius + cL(d, i);
            return translate(o, l, 0); 
         }

         function rallyTstart(d, i) {
            var o = midpoint;
            var l = radius + cL(d, i);
            return translate(o, l, 0);
         }

         function rallyT(d, i) {
            var o = d.rally ? (midpoint - (oScale(d.rally.length) / 2)) : 0;
            var l = radius + cL(d, i);
            return translate(o, l, 0);
         }

         function translate(o, l, rotate) {
            var x = vert ? o : l;
            var y = vert ? l : o;
            return "translate(" + x + "," + y + ") rotate(" + rotate + ")" 
         }

         function cL(d, i) { return (i + 2.5) * radius; }

         function rX(d, i) { return vert ? rO(d, i) : rL(d, i); }
         function rY(d, i) { return vert ? rL(d, i) : rO(d, i); }
         function rL(d, i) { return radius + (i + 3) * radius; }
         function rO(d, i) {
            return d.server == 0 ? midpoint + (fish_offset / 2 * sw) - (.75 * radius) : midpoint - (fish_offset / 2 * sw) + (.75 * radius);
         }

         function sX(d, i) { return vert ? sO(d, i) : sL(d, i); }
         function sY(d, i) { return vert ? sL(d, i) : sO(d, i); }
         function sL(d, i) { return radius + (d.point + 3) * radius; }
         function sO(d) {
            var offset = ((d.serve == 'first' && d.server == 0) || (d.serve == 'second' && d.server == 1)) ? .4 : 1.1;
            return d.server == 0 ? midpoint - (fish_offset / 2 * sw) + (offset * radius) : midpoint + (fish_offset / 2 * sw) - (offset * radius);
         }

         function zX(d, i) { return vert ? zO(d, i) : zL(d, i); }
         function zY(d, i) { return vert ? zL(d, i) : zO(d, i); }
         function zL(d, i) { return radius + (i + 3) * radius; }
         function zO(d, i) { return +midpoint + findOffset(d.fish_score) * radius; }
      }

      function findOffset(score) {
         var scores = score.split('-').map(function(m) { return m.replace('T', ''); });
         var p0 = scores[0];
         var p1 = scores[1];

         if (score.indexOf('T') > 0) {
            if (p0 >= options.set.tiebreak_to && p1 >= options.set.tiebreak_to) {
               p0 = p0 - options.set.tiebreak_to;
               p1 = p1 - options.set.tiebreak_to;
            }
            return p1 - p0;
         } else {
            if (options.fish.gridcells.indexOf(p0) >=0 && options.fish.gridcells.indexOf(p1) >=0) {
               return options.fish.gridcells.indexOf(p1) - options.fish.gridcells.indexOf(p0);
            } else if (options.fish.tailcells.indexOf(p0) >=0 && options.fish.tailcells.indexOf(p1) >=0) {
               return options.fish.tailcells.indexOf(p1) - options.fish.tailcells.indexOf(p0);
            } else {
               return;
            }
         }
      }
    }

    // ACCESSORS

    chart.g = function(values) {
        if (!arguments.length) return chart;
        if (typeof values != 'object' || values.constructor == Array) return;
        if (values.bars) bars = values.bars;
        if (values.fish) fish = values.fish;
        if (values.game) game = values.game;
    }

    chart.exports = function() {
       return { function1: function1, function1: function1 }
    }

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
    }

    function keyWalk(valuesObject, optionsObject) {
        if (!valuesObject || !optionsObject) return;
        var vKeys = Object.keys(valuesObject);
        var oKeys = Object.keys(optionsObject);
        for (var k=0; k < vKeys.length; k++) {
           if (oKeys.indexOf(vKeys[k]) >= 0) {
              var oo = optionsObject[vKeys[k]];
              var vo = valuesObject[vKeys[k]];
              if (typeof oo == 'object' && typeof vo !== 'function' && oo && oo.constructor !== Array) {
                 keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
              } else {
                 optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
              }
           }
        }
    }

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return options.width;
        options.width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        return chart;
    };

    chart.coords = function(value) {
        if (!arguments.length) return last_coords;
        coords = value;
       return chart;
    }

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = JSON.parse(JSON.stringify(value));
        massageData(data);
        return chart;
    };

    chart.update = function(opts) {
      if (events.update.begin) events.update.begin(); 
      if (typeof update === 'function' && data) update(opts);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
    }

    chart.colors = function(color3s) {
        if (!arguments.length) return colors;
        if (typeof color3s !== 'object') return false;
        var keys = Object.keys(color3s);        
        if (!keys.length) return false;
        // remove all properties that are not colors
        keys.forEach(function(f) { if (! /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color3s[f])) delete color3s[f]; })
        if (Object.keys(color3s).length) {
           colors = color3s;
        } else {
           colors = JSON.parse(JSON.stringify(default_colors));
        }
        return chart;
    }

   return chart;

   // ancillary functions

   function massageData(data) {
      var first_deuce = false;
      data.forEach(function(point) {
         var scores = point.score.split('-');
         if (scores[0] == '40' && scores[1] == '40' && !first_deuce) {
            first_deuce = true;
            point.fish_score = point.score;
         } else if (!first_deuce) {
            point.fish_score = point.score;
         } else {
            if (scores[0] == '40') scores[0] = 'D';
            if (scores[1] == '40') scores[1] = 'D';
            point.fish_score = scores.join('-');
         }
      });
   }
}
function GameTree() {

   // TODO
   // change the gradient direction in lines across width
   // which means changing line so that it is short and wide
   // rather than long and thick
   //
   // bar chart showing win % for each player or primary/opponents
   // for each point position

   function applyMax(arr) { return Math.max.apply(null, arr); }
   function applyMin(arr) { return Math.min.apply(null, arr); }

   // All options that should be accessible to caller
   var data = [];
   var options = {
      width: 150,
	   height: 150,
      min_max: 20,                  // scaling factor for line widths

      // Margins for the SVG
      margins: {
         top: 0, 
         right: 0, 
         bottom: 0, 
         left: 0
      },

      display: {
         sizeToFit: true,
         showEmpty: false   // display even if no data
      },

      lines: {
         easing: false, // 'bounce'
         duration: 600,
         points: { winners: "#2ed2db", errors: "#2ed2db", unknown: "#2ed2db" },
         colors: { underlines: "#2ed2db" }
      },

      nodes: {
         colors: { 0: "black" , 1: "red", neutral: '#ecf0f1' }
      },

      points: {
         winners: [
            'Winner', 'Ace', 'Serve Winner', 'Passing Shot', 'Return Winner', 
            'Forcing Error', 'Forcing Volley Error', 'Net Cord', 'In'
            ],
         errors: [
            'Unforced Error', 'Unforced', 'Forced Error', 'Error', 'Out', 'Net', 
            'Netted Passing Shot', 'L', 'Overhead Passing Shot', 'Double Fault'
            ],
         highlight: [] // opposite of filter; filter unhighlighted...
      },

      selectors: {
         enabled: true, 
         selected: { 0: false, 1: false }
      },

      labels: { 'Game': 'GAME', 'Player': 'Player', 'Opponent': 'Opponent' },

   };

   // functions which should be accessible via ACCESSORS
   var update;

   // PROGRAMMATIC
   // ------------
   var canvas;
   var radius;
   var transition_time = 0;
   var point_connector = 'x';
   var counters = { w: {}, e: {}, p: {}, o: {}, n: {} };

   // DEFINABLE EVENTS
   // Define with ACCESSOR function chart.events()
   var events = {
      'update': { 'begin': null, 'end': null },
      'point': { 'mousemove': null, 'mouseout': null },
      'node': { 'mousemove': null, 'mouseout': null },
      'score': { 'mousemove': null, 'mouseout': null },
      'label': { 'mousemove': null, 'mouseout': null, 'click': selectView },
      'selector': { 'mousemove': null, 'mouseout': null, 'click': selectView }
   };

   function chart(selection) {
       var root = selection.append('div')
           .attr('class', 'gametreeRoot')

         var tree_width  = options.width  - (options.margins.left + options.margins.right);
         var tree_height = options.width * .9;
         canvas = root.append('svg')
              
         update = function(opts) {

             if (!data.length && !options.display.showEmpty) {
                canvas.selectAll('*').remove();
                return;
             }

             counterCalcs();

             if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
                var dims = selection.node().getBoundingClientRect();
                options.width = Math.max(dims.width, 100);
                options.height = Math.max(dims.height, 100);
             }

             var tree_width  = options.width  - (options.margins.left + options.margins.right);
             var tree_height = options.width * .9;
             radius = (tree_height + tree_width) / 2 * .03;

             var keys = point_lines.map(function(m) { return m.id; });

             var point_min = applyMin( keys.map(function(k) { return isNaN(counters.p[k]) ? 0 : counters.p[k] }) );
             var point_max = applyMax( [applyMax(keys.map(function(k) { return isNaN(counters.p[k]) ? 0 : counters.p[k] } )), options.min_max] );

             var scale = d3.scale.linear().domain([ point_min, point_max ]) .range([0, radius * 2])
             canvas.transition().duration(transition_time).attr('width', tree_width).attr('height', tree_height);

             var gradients = canvas.selectAll('.gradient')
                  .data(point_lines, get_id)

             gradients.enter()
                  .append('linearGradient')
                  .attr("id", function(d) { return 'gradient' + d.id; })
                  .attr("class", "gradient")
                  .attr("gradientUnits", "userSpaceOnUse")
                  .attr("x1", function(d) { return d.start.x * tree_width })
                  .attr("y1", function(d) { return d.start.y * tree_height })
                  .attr("x2", function(d) { return d.end.x  * tree_width })
                  .attr("y2", function(d) { return d.end.y  * tree_height })
 
             gradients.exit()
                  .remove();

             gradients
                  .attr("x1", function(d) { return d.start.x * tree_width })
                  .attr("y1", function(d) { return d.start.y * tree_height })
                  .attr("x2", function(d) { return d.end.x  * tree_width })
                  .attr("y2", function(d) { return d.end.y  * tree_height })
 
             var point_stops = gradients.selectAll(".points_stop")
                  .data(function(d, i) { return calcStops(d, i); })
 
             point_stops.enter()
                  .append("stop")
                  .attr("class", "points_stop")
                  .attr("offset", function(d) { return d.offset; })
                  .attr("stop-color", function(d) { return d.color; });
             
             point_stops.exit()
                  .remove();

             point_stops
                  .attr("offset", function(d) { return d.offset; })

             var lines = canvas.selectAll('.line')
                  .data(point_lines)

             lines.enter()
                  .append('line')
                  .attr("class", "line")
                  .attr("id", function(d) { return d.id })
                  .attr("x1", function(d) { return d.start.x * tree_width })
                  .attr("y1", function(d) { return d.start.y * tree_height })
                  .attr("x2", function(d) { return d.end.x  * tree_width })
                  .attr("y2", function(d) { return d.end.y  * tree_height })
                  .attr("stroke-width", function(d) { return d.width ? d.width : 0 })
                  .attr("stroke", function(d) { return 'url(#gradient' + d.id + ')' })
                  .on("mousemove", function(d, i) { if (events.point.mousemove) events.point.mousemove(d, i); })
                  .on("mouseout", function(d, i) { if (events.point.mouseout) events.point.mouseout(d, i); })
                  .on("click", function(d, i) { if (events.point.click) events.point.click(d, i); });

             lines.exit()
                  .remove()

             lines
                  .transition()
                     .duration((options.lines.easing || (opts && opts.easing)) ? options.lines.duration : 0)
                     .ease(options.lines.easing || (opts && opts.easing) || 'none')
                  .attr("x1", function(d) { return d.start.x * tree_width })
                  .attr("y1", function(d) { return d.start.y * tree_height })
                  .attr("x2", function(d) { return d.end.x  * tree_width })
                  .attr("y2", function(d) { return d.end.y  * tree_height })
                  .attr("stroke-width", function(d) { return (counters.p[d.id]) ? scale(counters.p[d.id]) : 0; })

             var ulines = canvas.selectAll('.uline')
                  .data(under_lines)

             ulines.enter()
                  .append('line')
                  .attr("class", "uline")
                  .attr("id", function(d) { return d.id })
                  .attr("x1", function(d) { return d.start.x * tree_width })
                  .attr("y1", function(d) { return d.start.y * tree_height })
                  .attr("x2", function(d) { return d.end.x  * tree_width })
                  .attr("y2", function(d) { return d.end.y  * tree_height })
                  .attr("stroke-width", function(d) { return d.width ? d.width : 0 } )
                  .attr("stroke", function(d) { return options.lines.colors.underlines })

             ulines.exit()
                   .remove()

             ulines
                  .transition().duration(transition_time)
                  .attr("id", function(d) { return d.id })
                  .attr("x1", function(d) { return d.start.x * tree_width })
                  .attr("y1", function(d) { return d.start.y * tree_height })
                  .attr("x2", function(d) { return d.end.x  * tree_width })
                  .attr("y2", function(d) { return d.end.y  * tree_height })
                  .attr("stroke-width", function(d) { return d.width ? d.width : 0 } )

             var nodes = canvas.selectAll('.node')
                  .data(point_circles)

             nodes.enter()
                  .append('circle')
                  .attr("class", "node")
                  .attr("cx", function(d) { return d.pos.x * tree_width })
                  .attr("cy", function(d) { return d.pos.y * tree_height })
                  .attr("r", function(d) { return radius })
                  .attr("stroke", function(d) { 
                     return (d.color_pct != undefined) 
                            ? colorShade( getHexColor(options.nodes.colors[d.player]) , d.color_pct)
                            : options.nodes.colors.neutral; 
                  })
                  .attr("fill", function(d) { 
                     return (d.color_pct != undefined) 
                            ? colorShade( getHexColor(options.nodes.colors[d.player]) , d.color_pct)
                            : options.nodes.colors.neutral; 
                  })
                  .on("mousemove", function(d, i) { if (events.score.mousemove) events.score.mousemove(d, i); })
                  .on("mouseout", function(d, i) { if (events.node.mouseout) events.node.mouseout(d, i); })
                  .on("click", function(d, i) { if (events.node.click) events.node.click(d, i); });

             nodes.exit()
                  .remove()

             nodes
                  .transition().duration(transition_time)
                  .attr("cx", function(d) { return d.pos.x * tree_width })
                  .attr("cy", function(d) { return d.pos.y * tree_height })
                  .attr("r",  function(d) { return radius })

             var scores = canvas.selectAll('.score')
                  .data(point_text)

             scores.enter()
                  .append('text')
                  .attr("class", "score")
                  .attr("x", function(d) { return d.pos.x * tree_width })
                  .attr("y", function(d) { return d.pos.y * tree_height })
                  .attr("font-size", function(d) { return radius * d.fontsize + 'px' })
                  .attr("font-family", "Lato, Arial, sans-serif")
                  .attr("text-anchor", "middle")
                  .attr("alignment-baseline", "central")
                  .attr("stroke", function(d) { return d.stroke })
                  .attr("fill", function(d) { return d.fill })
                  .text(function(d) { if (radius * d.fontsize > 7) return d.text })
                  .on("mousemove", function(d, i) { if (events.score.mousemove) events.score.mousemove(d, i); })
                  .on("mouseout", function(d, i) { if (events.score.mouseout) events.score.mouseout(d, i); })
                  .on("click", function(d, i) { if (events.score.click) events.score.click(d, i); });

             scores.exit()
                   .remove()

             scores
                  .transition().duration(transition_time)
                  .attr("x", function(d) { return d.pos.x * tree_width })
                  .attr("y", function(d) { return d.pos.y * tree_height })
                  .attr("font-size", function(d) { return radius * d.fontsize + 'px' })
                  .text(function(d) { if (radius * d.fontsize > 5) return d.text })

             var labels = canvas.selectAll('.gt_label')
                  .data(label_text)

             labels.enter()
                  .append('text')
                  .attr("class", "gt_label")
                  .attr("x", function(d) { return d.pos.x * tree_width })
                  .attr("y", function(d) { return d.pos.y * tree_height })
                  .attr("alignment-baseline", function(d) { return d.baseline ? d.baseline : undefined })
                  .attr("font-size", function(d) { return radius * d.fontsize + 'px' })
                  .attr("text-anchor", function(d) { return d.anchor ? d.anchor : undefined })
                  .attr("font-family", "Lato, Arial, sans-serif")
                  .attr("stroke", function(d) { return d.stroke })
                  .attr("fill", function(d) { return d.fill })
                  .text(function(d) { if (radius * d.fontsize > 5) return d.id })
                  .attr('selector', function(d) { return d.id })
                  .on("click", function(d, i) { if (events.label.click) events.label.click(d, i, this); });

             labels.exit()
                   .remove()

             labels
                  .transition().duration(transition_time)
                  .attr("x", function(d) { return d.pos.x * tree_width })
                  .attr("y", function(d) { return d.pos.y * tree_height })
                  .attr("font-size", function(d) { return radius * d.fontsize + 'px' })
                  .text(function(d) { if (radius * d.fontsize > 5) return options.labels[d.id] })

             var select = canvas.selectAll('.selector')
                  .data(selectors)

             select.enter()
                  .append('circle')
                  .attr('class', 'selector')
                  .attr('status', function(d) { return d.status })
                  .attr('id', function(d) { return d.id })
                  .attr('selector', function(d) { return d.id })
                  .attr("cx", function(d) { return d.pos.x * tree_width })
                  .attr("cy", function(d) { return d.pos.y * tree_height + 4 })
                  .attr("r", function(d) { return radius * d.r_pct; })
                  .attr("stroke", function(d, i) { return options.nodes.colors[i]; })
                  .attr("stroke-width", function(d) { return radius * .25; })
                  .attr("fill", function(d, i) { 
                     return (!options.selectors.enabled || (options.selectors.enabled && options.selectors.selected[i])) 
                            ? options.nodes.colors[i] 
                            : options.nodes.colors.neutral; 
                  })
                  .attr("opacity", function(d) { return d.opacity })
                  .on("mousemove", function(d, i) { if (events.selector.mousemove) events.selector.mousemove(d, i); })
                  .on("mouseout", function(d, i) { if (events.selector.mouseout) events.selector.mouseout(d, i); })
                  .on("click", function(d, i) { if (events.selector.click) events.selector.click(d, i, this); });

             select.exit()

             select
                  .transition().duration(transition_time)
                  .attr("cx", function(d) { return d.pos.x * tree_width })
                  .attr("cy", function(d) { return d.pos.y * tree_height + 4 })
                  .attr("r", function(d) { return radius * d.r_pct })
                  .attr("stroke-width", function(d) { return radius * .25; })
                  .attr("fill", function(d, i) { 
                     return (!options.selectors.enabled || (options.selectors.enabled && options.selectors.selected[i])) 
                            ? options.nodes.colors[i] 
                            : options.nodes.colors.neutral; 
                  })
         };
   }

   // ACCESSORS

    chart.exports = function() {
       return { selectView: selectView }
    }

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
    }

    function keyWalk(valuesObject, optionsObject) {
        if (!valuesObject || !optionsObject) return;
        var vKeys = Object.keys(valuesObject);
        var oKeys = Object.keys(optionsObject);
        for (var k=0; k < vKeys.length; k++) {
           if (oKeys.indexOf(vKeys[k]) >= 0) {
              var oo = optionsObject[vKeys[k]];
              var vo = valuesObject[vKeys[k]];
              if (typeof oo == 'object' && typeof vo !== 'function' && oo && oo.constructor !== Array) {
                 keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
              } else {
                 optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
              }
           }
        }
    }

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

   chart.reset = function(clear_active) {
      data = [];
      clearView();
      counters = { w: {}, e: {}, p: {}, o: {}, n: {} };
      return chart;
   }

   chart.width = function(value) {
       if (!arguments.length) return options.width;
       options.width = value;
       return chart;
   };

   chart.height = function(value) {
       if (!arguments.length) return options.height;
       options.height = value;
       return chart;
   };

   chart.data = function(values) {
      if (!arguments.length) return data;
      if ( values.constructor === Array ) {
         chart.reset();
         data = values;
      }
      return chart;
   }

   chart.counters = function() {
      counterCalcs();
      return counters;
   }

   chart.update = function(opts) {
     if (events.update.begin) events.update.begin(); 
     if (typeof update === 'function') update(opts);
      setTimeout(function() { 
        if (events.update.end) events.update.end(); 
      }, transition_time);
   }

   // END ACCESSORS

   // REUSABLE FUNCTIONS
   // ------------------

   function counterCalcs() {
      counters = { w: {}, e: {}, p: {}, o: {}, n: {} };
      if (options.selectors.selected[0] || options.selectors.selected[1]) {
         var selected = options.selectors.selected[0] ? 0 : 1;
         var _data = data.filter(function(f) { return f.server == selected; });
      } else {
         var _data = data;
      }
      for (var d=0; d < _data.length; d++) {
         var previous = d == 0 ? '0-0' : _data[d - 1].score;
         if (previous.indexOf('G') >= 0) previous = '0-0';
         var progression = 'L' + previous + point_connector + _data[d].score;
         if (options.points.highlight.length && options.points.highlight.indexOf(d) < 0) { continue; }
         counters.n[previous] = counters.n[previous] ? counters.n[previous] + 1 : 1;
         counters.o[previous] = _data[d].outcome ? (counters.o[previous] ? counters.o[previous] + 1 : 1) : counters.o[previous];
         counters.p[progression] = counters.p[progression] ? counters.p[progression] + 1 : 1;

         if (options.points.winners.indexOf(_data[d].result) >= 0) {
            counters.w[progression] = counters.w[progression] ? counters.w[progression] + 1 : 1;
         } else if (options.points.errors.indexOf(_data[d].result) >= 0) {
            counters.e[progression] = counters.e[progression] ? counters.e[progression] + 1 : 1;
         } else {
            // console.log(_data[d].result);
         }
      }
   }

   function get_id(d) { return d && d.id; }

   function isEven(n) {
      return n == parseFloat(n)? !(n%2) : void 0;
   }

   function clearView() {
      d3.select('[id=Player]').attr('opacity', .4).attr('status', 'none').attr('fill', options.nodes.colors.neutral);
      d3.select('[id=Opponent]').attr('opacity', .4).attr('status', 'none').attr('fill', options.nodes.colors.neutral);
      options.selectors.selected[1] = false;
      options.selectors.selected[0] = false;
   }

   function selectView(d, i, self) {
     if (!options.selectors.enabled) return;
     var selector = d3.select(self).attr('selector');
     if (d3.select('[id=' + selector + ']').attr('status') == 'none') {
         if (d3.select(self).attr('selector') == "Opponent") {
            d3.select('[id=Player]').attr('opacity', .4).attr('status', 'none').attr('fill', options.nodes.colors.neutral);
            d3.select('[id=Opponent]').attr('opacity', 1).attr('status', 'selected').attr('fill', options.nodes.colors[i]);
            options.selectors.selected[1] = true;
            options.selectors.selected[0] = false;
         } else {
            d3.select('[id=Opponent]').attr('opacity', .4).attr('status', 'none').attr('fill', options.nodes.colors.neutral);
            d3.select('[id=Player]').attr('opacity', 1).attr('status', 'selected').attr('fill', options.nodes.colors[i]);
            options.selectors.selected[0] = true;
            options.selectors.selected[1] = false;
         }
     } else {
         d3.select('[id=' + selector + ']').attr('opacity', .4).attr('status', 'none').attr('fill', options.nodes.colors.neutral);;
         if (d3.select(self).attr('selector') == "Opponent") {
            options.selectors.selected[1] = false;
         } else {
            options.selectors.selected[0] = false;
         }
     }
     update();
   }

   function calcStops(d, i) {
      if (!counters.p[d.id]) return [];
      var total_points = counters.p[d.id] == undefined ? 1 : counters.p[d.id];
      var winners = counters.w[d.id] ? counters.w[d.id] : 0;
      var errors = counters.e[d.id] ? counters.e[d.id] : 0;
      var winner_pct = winners / total_points * 100;
      var error_pct =  errors / total_points * 100;
      var u_pct = (total_points - (winners + errors)) / total_points * 100;
      return [ {offset: "0%", color: options.lines.points.unknown }, 
               {offset: u_pct + "%", color: options.lines.points.unknown }, 
               {offset: u_pct + "%", color: options.lines.points.winners }, 
               {offset: (u_pct + winner_pct) + "%", color: options.lines.points.winners }, 
               {offset: (u_pct + winner_pct) + "%", color: options.lines.points.errors }, 
               {offset: "100%", color: options.lines.points.errors } ] 
   }

   // DATA
   // --------------
  
   var valid_points = [
      '0-15', '0-30', '0-40', '0-G', '15-0', '15-15', '15-30', '15-40', '15-G', '30-0', '30-15', '30-30', '30-40', '30-G',
      '40-0', 'G-0', '40-15', 'G-15', '40-30', 'G-30', '40-40', '40-A', '40-G', 'A-40', 'G-40'
   ]

   var progression = { 
      '0-0'  : ['15-0',  '0-15'], '0-15' : ['15-15', '0-30'], '0-30' : ['15-30', '0-40'], '0-40' : ['15-40', '0-G'], 
      '15-0' : ['30-0',  '15-15'], '15-15': ['30-15', '15-30'], '15-30': ['30-30', '15-40'], '15-40': ['30-40', '15-G'], 
      '30-0' : ['40-0',  '30-15'], '30-15': ['30-30', '40-15'], '30-30': ['40-30', '30-40'], '30-40': ['40-40', '30-G'], 
      '40-0' : ['G-0',   '40-15'], '40-15': ['G-15',  '40-30'], '40-30': ['G-30',  '40-40'], '40-40': ['A-40',  '40-A'], 
      'A-40' : ['G-40',  '40-40'], '40-A' : ['40-40', '40-G']
   };

   var c_start = .07;
   var c_dist  = .125;

   var r_start = .05;
   var r_dist  = .20;

   var f = { col1: c_start, col2: c_start + c_dist, col3: c_start + (2 * c_dist),  col4: c_start + (3 * c_dist),  
             col5: c_start + (4 * c_dist),  col6: c_start + (5 * c_dist),  col7: c_start + (6 * c_dist),

             row1: r_start, row2: r_start + r_dist, row3: r_start + (2 * r_dist), row4: r_start + (3 * r_dist), 
             row5: r_start + (4 * r_dist), foot: r_start + (4.1 * r_dist),

             adr1: r_start + (3.5 * r_dist), adc1: c_start + (c_dist * 2.5),  adc2: c_start + (c_dist * 3.5),

             selc: c_start * .8, tslc: c_start, sl1r: r_start / 2, sl2r: r_start * 1.5,
             plr1: c_start * .8, plr2: c_start + (4 * c_dist), plrs: r_start + (4.25 * r_dist)
   };

   var pos = {
      "p0-0"  : { x: f.col4, y: f.row1 }, "p15-15": { x: f.col4, y: f.row2 }, 
      "p30-30": { x: f.col4, y: f.row3 }, "p40-40": { x: f.col4, y: f.row4 }, 
      "p15-0" : { x: f.col3, y: f.row2 }, "p0-15" : { x: f.col5, y: f.row2 },
      "p30-15": { x: f.col3, y: f.row3 }, "p15-30": { x: f.col5, y: f.row3 }, 
      "p30-0" : { x: f.col2, y: f.row3 }, "p0-30" : { x: f.col6, y: f.row3 }, 
      "p40-30": { x: f.col3, y: f.row4 }, "p30-40": { x: f.col5, y: f.row4 },
      "p40-15": { x: f.col2, y: f.row4 }, "p15-40": { x: f.col6, y: f.row4 }, 
      "p40-0" : { x: f.col1, y: f.row4 }, "p0-40" : { x: f.col7, y: f.row4 }, 
      "p40-Ad": { x: f.adc1, y: f.adr1 }, "pAd-40": { x: f.adc2, y: f.adr1 },
      "pG-D"  : { x: f.adc2, y: f.row5 }, "pD-G"  : { x: f.adc1, y: f.row5 }, 
      "pG-15" : { x: f.col2, y: f.row5 }, "p15-G" : { x: f.col6, y: f.row5 }, 
      "pG-30" : { x: f.col3, y: f.row5 }, "p30-G" : { x: f.col5, y: f.row5 },
      "pG-40" : { x: f.col4, y: f.row5 }, "p40-G" : { x: f.col4, y: f.row5 }, 
      "pG-0"  : { x: f.col1, y: f.row5 }, "p0-G"  : { x: f.col7, y: f.row5 }, 

      "sPlyr" : { x: f.adc1, y: f.plrs }, "tPlyr" : { x: f.col2, y: f.plrs },
      "sOpp"  : { x: f.adc2, y: f.plrs }, "tOpp"  : { x: f.col6, y: f.plrs },

      "GAME"  : { x: f.col4, y: f.foot }, 
      "L1s"   : { x: f.col1, y: f.foot }, "L1e"   : { x: f.adc1, y: f.foot }, 
      "L2s"   : { x: f.adc2, y: f.foot }, "L2e"   : { x: f.col7, y: f.foot } 
   }
 
   var point_circles = [
      { name: "0-0",   pos: pos["p0-0"],   player: 0 },
      { name: "15-15", pos: pos["p15-15"], player: 0 },
      { name: "30-30", pos: pos["p30-30"], player: 0 },
      { name: "40-40", pos: pos["p40-40"], player: 0 },

      { name: "0-15",  pos: pos["p0-15"],  color_pct: .4, player: 1 },
      { name: "15-30", pos: pos["p15-30"], color_pct: .4, player: 1 },
      { name: "0-30",  pos: pos["p0-30"],  color_pct: .2, player: 1 },
      { name: "30-40", pos: pos["p30-40"], color_pct: .4, player: 1 },
      { name: "15-40", pos: pos["p15-40"], color_pct: .2, player: 1 },
      { name: "0-40",  pos: pos["p0-40"],  color_pct: 0,  player: 1 },
      { name: "40-A",  pos: pos["pAd-40"], color_pct: .5, player: 1 },

      { name: "15-0",  pos: pos["p15-0"],  color_pct: .4, player: 0 },
      { name: "30-15", pos: pos["p30-15"], color_pct: .4, player: 0 },
      { name: "30-0",  pos: pos["p30-0"],  color_pct: .2, player: 0 },
      { name: "40-30", pos: pos["p40-30"], color_pct: .4, player: 0 },
      { name: "40-15", pos: pos["p40-15"], color_pct: .2, player: 0 },
      { name: "40-0",  pos: pos["p40-0"],  color_pct: 0,  player: 0 },
      { name: "A-40",  pos: pos["p40-Ad"], color_pct: .5, player: 0 } 
   ]

   var point_lines = [
      { id: "L0-0x0-15",    start: pos["p0-0"],   end: pos["p0-15"] },
      { id: "L0-0x15-0",    start: pos["p0-0"],   end: pos["p15-0"] },
      { id: "L0-15x0-30",   start: pos["p0-15"],  end: pos["p0-30"] },
      { id: "L0-15x15-15",  start: pos["p0-15"],  end: pos["p15-15"] },
      { id: "L15-0x30-0",   start: pos["p15-0"],  end: pos["p30-0"] },
      { id: "L15-0x15-15",  start: pos["p15-0"],  end: pos["p15-15"] },
      { id: "L15-15x15-30", start: pos["p15-15"], end: pos["p15-30"] },
      { id: "L15-15x30-15", start: pos["p15-15"], end: pos["p30-15"] },
      { id: "L30-0x30-15",  start: pos["p30-0"],  end: pos["p30-15"] },
      { id: "L30-0x40-0",   start: pos["p30-0"],  end: pos["p40-0"] },
      { id: "L30-15x30-30", start: pos["p30-15"], end: pos["p30-30"] },
      { id: "L30-15x40-15", start: pos["p30-15"], end: pos["p40-15"] },
      { id: "L30-30x30-40", start: pos["p30-30"], end: pos["p30-40"] },
      { id: "L30-30x40-30", start: pos["p30-30"], end: pos["p40-30"] },
      { id: "L0-30x0-40",   start: pos["p0-30"],  end: pos["p0-40"] },
      { id: "L0-30x15-30",  start: pos["p0-30"],  end: pos["p15-30"] },
      { id: "L0-40x0-G",    start: pos["p0-40"],  end: pos["p0-G"] },
      { id: "L0-40x15-40",  start: pos["p0-40"],  end: pos["p15-40"] },
      { id: "L15-30x30-30", start: pos["p15-30"], end: pos["p30-30"] },
      { id: "L15-30x15-40", start: pos["p15-30"], end: pos["p15-40"] },
      { id: "L15-40x30-40", start: pos["p15-40"], end: pos["p30-40"] },
      { id: "L15-40x15-G",  start: pos["p15-40"], end: pos["p15-G"] },
      { id: "L30-40x40-40", start: pos["p30-40"], end: pos["p40-40"] },
      { id: "L30-40x30-G",  start: pos["p30-40"], end: pos["p30-G"] },
      { id: "L40-40x40-A",  start: pos["p40-40"], end: pos["pAd-40"] },
      { id: "L40-40xA-40",  start: pos["p40-40"], end: pos["p40-Ad"] },
      { id: "L40-40xG-40",  start: pos["p40-40"], end: pos["pG-40"] },
      { id: "L40-40x40-G",  start: pos["p40-40"], end: pos["p40-G"] },
      { id: "L40-30x40-40", start: pos["p40-30"], end: pos["p40-40"] },
      { id: "L40-30xG-30",  start: pos["p40-30"], end: pos["pG-30"] },
      { id: "L40-15x40-30", start: pos["p40-15"], end: pos["p40-30"] },
      { id: "L40-15xG-15",  start: pos["p40-15"], end: pos["pG-15"] },
      { id: "L40-0x40-15",  start: pos["p40-0"],  end: pos["p40-15"] },
      { id: "L40-0xG-0",    start: pos["p40-0"],  end: pos["pG-0"] },
      { id: "L40-Ax40-G",   start: pos["pAd-40"], end: pos["pG-D"] },
      { id: "LA-40xG-40",   start: pos["p40-Ad"], end: pos["pD-G"] },
   ]

   var under_lines = [
      { stroke: "blue", start: pos["L1s"], end: pos["L1e"], width: 2 },
      { stroke: "blue", start: pos["L2s"], end: pos["L2e"], width: 2 }
   ]

   var point_text = [
      { pos: pos["p0-0"],   fill: 'black',   fontsize: .7, text: "0-0" },
      { pos: pos["p15-15"], fill: 'black',   fontsize: .7, text: "15-15" },
      { pos: pos["p30-30"], fill: 'black',   fontsize: .7, text: "30-30" },
      { pos: pos["p40-40"], fill: 'black',   fontsize: .7, text: "40-40" },

      { pos: pos["p0-15"],  fill: 'white',   fontsize: .7, text: "0-15" },
      { pos: pos["p15-30"], fill: 'white',   fontsize: .7, text: "15-30" },
      { pos: pos["p0-30"],  fill: 'white',   fontsize: .7, text: "0-30" },
      { pos: pos["p30-40"], fill: 'white',   fontsize: .7, text: "30-40" },
      { pos: pos["p15-40"], fill: 'white',   fontsize: .7, text: "15-40" },
      { pos: pos["p0-40"],  fill: 'white',   fontsize: .7, text: "0-40" },
      { pos: pos["pAd-40"], fill: 'white',   fontsize: .7, text: "40-A" },

      { pos: pos["p15-0"],  fill: 'white',   fontsize: .7, text: "15-0" },
      { pos: pos["p30-15"], fill: 'white',   fontsize: .7, text: "30-15" },
      { pos: pos["p30-0"],  fill: 'white',   fontsize: .7, text: "30-0" },
      { pos: pos["p40-30"], fill: 'white',   fontsize: .7, text: "40-30" },
      { pos: pos["p40-15"], fill: 'white',   fontsize: .7, text: "40-15" },
      { pos: pos["p40-0"],  fill: 'white',   fontsize: .7, text: "40-0" },
      { pos: pos["p40-Ad"], fill: 'white',   fontsize: .7, text: "A-40" },
   ];

   var label_text = [
      { pos: pos["tPlyr"],  fill: 'black',   fontsize: .9, id: "Player", anchor: "middle", baseline: "hanging" },
      { pos: pos["tOpp"],   fill: 'black',   fontsize: .9, id: "Opponent", anchor: "middle", baseline: "hanging" },
      { pos: pos["GAME"],   fill: "#555555", fontsize: .9, id: "Game", anchor: "middle", baseline: "central" }
   ];

   var selectors = [
      { id: "Player",   pos: pos["sPlyr"], r_pct: .4, opacity: 1, status: 'none' },
      { id: "Opponent", pos: pos["sOpp"], r_pct: .4, opacity: .4, status: 'none' }
   ]

	// Helper Functions
   // ----------------

   // http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors 
   function shadeColor2(color, percent) {   
       var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
       return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
   }

   function blendColors(c0, c1, p) {
       var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
       return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
   }

   function shadeRGBColor(color, percent) {
      var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
      return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
   }

   function blendRGBColors(c0, c1, p) {
       var f=c0.split(","),t=c1.split(","),R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
       return "rgb("+(Math.round((parseInt(t[0].slice(4))-R)*p)+R)+","+(Math.round((parseInt(t[1])-G)*p)+G)+","+(Math.round((parseInt(t[2])-B)*p)+B)+")";
   }

   function colorShade(color, percent){
      if (color.length > 7 ) return shadeRGBColor(color,percent);
      else return shadeColor2(color,percent);
   }

   function colorBlend(color1, color2, percent){
       if (color1.length > 7) return blendRGBColors(color1,color2,percent);
       else return blendColors(color1,color2,percent);
   }

   // http://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
   function getHexColor(colorStr) {
      var a = document.createElement('div');
      a.style.color = colorStr;
      var colors = window.getComputedStyle( document.body.appendChild(a) ).color.match(/\d+/g).map(function(a){ return parseInt(a,10); });
      document.body.removeChild(a);
      return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : false;
   }

   return chart;
}
function rallyTree() {

   // TODO:
   //
   // RallyTree currently injects .rl and .i into points... 
   // this should only be a LOCAL behavious
   //
   // fix setting of colors for point types.  use chart.colors instead of
   // options... see below
   //
   // invisible bars overlaying each rally length for each side
   // hover over invisible bars highlights circle on pctarea
   // indicating the win % / rally length
   //
   // integrate margins

    var points = [];

    var options = {
      width: 100,
	   height: 100,

      // Margins for the SVG
      margins: {
         top: 0, 
         right: 0, 
         bottom: 0, 
         left: 0
      },

      display: {
         sizeToFit: false
      },

      orientation: 'horizontal',

      data: {
         sort: false
      },

      areas: {
         colors: { 0: "blue" , 1: "purple" },
         interpolation: 'linear'
      },

      points: {
         colors: { } // points will be sorted according to order of colors
      }

    }
   // functions which should be accessible via ACCESSORS
    var update;
    var maxRally;

    // programmatic
    var transition_time = 1000;
    var displayPct = true;
    var serveAdvantage = undefined;
    var barPadding = 0;
    var cellPadding = 0;

    // DEFINABLE EVENTS
    // Define with ACCESSOR function chart.events()
    var events = {
       'pointbar': { 'mouseover': null, 'mouseout': null, 'click': null },
       'statbar': { 'click': null },
       'pctarea': { 'mouseover': null, 'mouseout': null },
       'update': { 'begin': null, 'end': null },
       'rallies' : { 'none': undefined, 'display': undefined }
    };

    function chart(selection) {
       var root = selection.append('div')
           .attr('class', 'rallyRoot')

      var rtroot = root.append('svg')
          .attr('class', 'rallyTree')
          .attr('height', (options.orientation == 'horizontal') ? options.height : options.width )
          .attr('width', (options.orientation == 'horizontal') ? options.width : options.height )

      var rttree = rtroot.append('g').attr('class', 'rttree')
      var rtarea = rtroot.append('g').attr('class', 'rtarea');

      update = function(opts) {

          // don't display if maximum rally length less than 3
          maxRally = d3.max(points, function(point) { if (point.rally) return point.rallyLength() });
          if (maxRally < 3) {
             rtroot.selectAll('rect').remove();
             rtarea.selectAll('path').remove();
             rtarea.selectAll('line').remove();
             if (events.rallies.none == 'function') events.rallies.none();
             return;
          } else {
             if (events.rallies.display == 'function') events.rallies.display();
          }

          if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
             var dims = selection.node().getBoundingClientRect();
             options.width = Math.max(dims.width, 100);
             options.height = Math.max(dims.height, 100);
          }

          if (points.length > 500) {
             var barPadding = 0;
             var cellPadding = 0;
          } else {
             var barPadding = 1;
             var cellPadding = 1;
          }

          ryl = [[], []];
          points.forEach(function(e, i) {
              e.i = i;
              if (ryl[e.winner][e.rallyLength()]) {
                 ryl[e.winner][e.rallyLength()] += 1;
              } else {
                 ryl[e.winner][e.rallyLength()] = 1;
              }
              e.rl = [ryl[0][e.rallyLength()], ryl[1][e.rallyLength()]];
          });

          if (options.data.sort) { orderPoints('result'); }

          rtroot.transition().duration(transition_time).attr('width', options.width).attr('height', options.height);

          max0 = points.length ? points.length == 1 ? points[0].rl[0] : d3.max(points, function(point) { return point.rl[0]; }) : 0;
          max1 = points.length ? points.length == 1 ? points[0].rl[1] : d3.max(points, function(point) { return point.rl[1]; }) : 0;
          max0 = max0 ? max0 : 0;
          max1 = max1 ? max1 : 0;
          maxLimb = max0 + max1 + 1;
          widthScale = ((options.orientation == 'horizontal') ? options.width : options.height) / maxLimb;
          barSpacing = ((options.orientation == 'horizontal') ? options.height : options.width) / (maxRally + 1);
          barHeight = barSpacing - barPadding;

          var point_bars = rttree.selectAll('rect.point-bar')
              .data(points);

          point_bars.enter()
              .append('rect')
              .attr('id', function(d, i) { return 'cell' + i; })
              .attr('class', 'point-bar')
              .attr('x', function(d) { return Math.random() * options.width })
              .attr('y', function(d) { return Math.random() * options.height })
              .attr('fill', function(d) { return options.points.colors[d.result]; })
              .attr('width', function (d, i) { return (options.orientation == 'horizontal') ? widthScale - cellPadding : barHeight; })
              .attr('height', function(d, i) { return (options.orientation == 'horizontal') ? barHeight : widthScale - cellPadding; })
              .on('mouseover', events.pointbar.mouseover)
              .on('mouseout', events.pointbar.mouseout)
              .on('click', events.pointbar.click)
              .transition().duration(transition_time)
              .style('opacity', 1)
              .attr('x', function(d, i) { return calcX(d, widthScale, barSpacing, max0, max1); })
              .attr('y', function(d, i) { return calcY(d, widthScale, barSpacing, max0, max1); })

          point_bars.exit()
              .transition().duration(transition_time * .5)
              .delay(function(d, i) { return (points.length - i) * 20; })
              .style('opacity', 0)
              .attr('x', function(d) { return Math.random() * options.width })
              .attr('y', function(d) { return Math.random() * options.height })
              .remove();

          point_bars
              .transition().duration(transition_time)
              .attr('fill', function(d) { return options.points.colors[d.result]; })
              .style('opacity', function(d) { return d.hide ? 0 : 1; })
              .attr('x', function(d, i) { return calcX(d, widthScale, barSpacing, max0, max1); })
              .attr('y', function(d, i) { return calcY(d, widthScale, barSpacing, max0, max1); })
              .attr('width', function (d, i) { return (options.orientation == 'horizontal') ? widthScale - cellPadding : barHeight; })
              .attr('height', function(d, i) { return (options.orientation == 'horizontal') ? barHeight : widthScale - cellPadding; })

          var areas = rtarea.selectAll('.pct-area')
              .data([0, 1])

          areas.enter()
              .append("path")
              .attr('id', function(d) { return 'player' + d + 'pctarea'; })
              .attr("class", "pct-area")
              .attr('opacity', 0);

          areas.exit()
              .remove()

          areas
              .attr("fill", function(d) { return options.areas.colors[d]; })
              .attr('display', function() { if (displayPct) return 'inline'; })
              .transition().delay(transition_time)
              .attr('display', function() { if (!displayPct) return 'none'; })
              .attr('gen', function(d) { return aP(d); } )

          function aP(player) {
             d3.select('#player' + player + 'pctarea')
                 .datum(rallyWinPct(player))
                 .on('mouseover', function(d, i) { 
                    if (events.pctarea.mouseover) events.pctarea.mouseover(player, i);
                    if (displayPct) d3.select(this).attr("opacity", 1); 
                 })
                 .on('mouseout', function(d, i) { 
                    if (events.pctarea.mouseout) events.pctarea.mouseout(player, i);
                    if (displayPct) d3.select(this).attr("opacity", .2); 
                 })
                 .transition().duration(transition_time)
                 .attr("opacity", function() { return displayPct ? .1 : 0 })
                 .attr("d", calcArea(player, widthScale, max0, max1))
            return player;
          }

          var fifty = rtarea.selectAll('.pct-fifty')
               .data([0, 1]);

          fifty.enter()
               .append("line")
               .attr('id', function(d) { return 'player' + d + 'fifty' })
               .attr('class', 'pct-fifty')
               .attr('stroke', 'black')
               .attr('opacity', 0)
               .attr('x1', 0) .attr('x2', 0)
               .attr('y1', 0) .attr('y2', 0)

          fifty.exit()
               .remove()

          fifty
              .attr('display', function() { if (displayPct) return 'inline' })
              .transition().duration(transition_time)
              .attr("opacity", function() { return displayPct ? 1 : 0 })
              .attr('y1', function(d) { return fiftyY(d, 1); })
              .attr('y2', function(d) { return fiftyY(d, 2); })
              .attr('x1', function(d) { return fiftyX(d, 1); })
              .attr('x2', function(d) { return fiftyX(d, 2); })
              .transition().delay(transition_time)
              .attr('display', function() { if (!displayPct) return 'none'; })

          var center = rtarea.selectAll('rect.stat-bar')
              .data([0])

          center.enter()
              .append('rect')
              .attr('class', 'stat-bar')
              .style('opacity', .2)
              .attr('y', function(d, i) { return statbarY(widthScale, barSpacing, max0, max1); })
              .attr('width', function(d, i) { return statbarWidth(widthScale, barSpacing, max0, max1); })
              .attr('height', function(d, i) { return statbarHeight(widthScale, barSpacing, max0, max1); })
              .attr('x', function(d, i) { return statbarX(widthScale, barSpacing, max0, max1); })
              .attr('fill', 'blue');

          center.exit()
              .transition().duration(transition_time * .3)
              .delay(function(d, i) { return (points.length - i) * 20; })
              .style('opacity', 0)
              .remove()

          center
              .on('click', events.statbar.click)
              .transition().duration(transition_time)
              .style('opacity', .2)
              .attr('y', function(d, i) { return statbarY(widthScale, barSpacing, max0, max1); })
              .attr('width', function(d, i) { return statbarWidth(widthScale, barSpacing, max0, max1); })
              .attr('height', function(d, i) { return statbarHeight(widthScale, barSpacing, max0, max1); })
              .attr('x', function(d, i) { return statbarX(widthScale, barSpacing, max0, max1); })
              .attr('fill', 'blue');

       }
    }

    function fiftyX(d, which) {
       if (options.orientation == 'horizontal') {
          return d == 0 ? (max0 ? max0 * widthScale / 2 : 0) : (max1 ? options.width - (max1 * widthScale / 2) : 0);
       } else {
          return which == 1 ? 0 : options.width;
       }
    }

    function fiftyY(d, which) {
       if (options.orientation == 'horizontal') {
          return which == 1 ? 0 : options.height;
       } else {
          return d == 0 ? (max0 ? max0 * widthScale / 2 : 0) : (max1 ? options.height - (max1 * widthScale / 2) : 0);
       }
    }

    function calcArea(player, widthScale, max0, max1) {
       if (options.orientation == 'horizontal') {
          var xScale = d3.scale.linear()
                                .range(player == 0 ? [max0 * widthScale, 0] : [(max0 + 1) * widthScale, options.width])
                                .domain([0, 100]);

          var yScale = d3.scale.linear()
                               .range([0, options.height])
                               .domain([0, rallyWinPct(player).length - 1]);

          var area = d3.svg.area()
                       .interpolate(options.areas.interpolation)
                       .x1(function(d, i) { return xScale(d) })
                       .x0( (player == 0) ? max0 * widthScale : (max0 + 1) * widthScale )
                       .y(function(d, i)  { return yScale(i) });
       } else {
          var yScale = d3.scale.linear()
                                .range(player == 0 ? [max0 * widthScale, 0] : [(max0) * widthScale, options.height])
                                .domain([0, 100]);

          var xScale = d3.scale.linear()
                               .range([0, options.width])
                               .domain([0, rallyWinPct(player).length - 1]);
          var area = d3.svg.area()
                       .interpolate(options.areas.interpolation)
                       .y1(function(d, i) { return yScale(d) })
                       .y0( (player == 0) ? max0 * widthScale : (max0) * widthScale )
                       .x(function(d, i)  { return xScale(i) });
       }
       return area;
    }

    function calcX(d, widthScale, barSpacing, max0, max1) {
        if (d.winner == 0) {
           return (options.orientation == 'horizontal') ? 
                  (max0 * widthScale) - (d.rl[0]) * widthScale 
                  : d.rallyLength() * barSpacing;
        } else {
           return (options.orientation == 'horizontal') ? 
                  (max0 * widthScale) + (d.rl[1]) * widthScale 
                  : d.rallyLength() * barSpacing;
        }
    }

    function calcY(d, widthScale, barSpacing, max0, max1) {
        if (d.winner == 0) {
           return (options.orientation == 'horizontal') ? 
              d.rallyLength() * barSpacing 
              : (max0 * widthScale) - (d.rl[0]) * widthScale;  
        } else {
           return (options.orientation == 'horizontal') ? 
              d.rallyLength() * barSpacing 
              : (max0 * widthScale) + (d.rl[1]) * widthScale;
        }
    }

    function statbarX(widthScale, barSpacing, max0, max1) {
       if (options.orientation == 'horizontal') {
        return isNaN(widthScale) ? undefined : max0 * widthScale;
       } else {
        return 0;
       }
    }

    function statbarY(widthScale, barSpacing, max0, max1) {
       if (options.orientation == 'horizontal') {
        return 0;
       } else {
        return isNaN(widthScale) ? undefined : max0 * widthScale;
       }
    }

    function statbarWidth(widthScale, barSpacing, max0, max1) {
       if (options.orientation == 'horizontal') {
        return isNaN(widthScale) ? undefined : widthScale - cellPadding;
       } else {
        return options.width;
       }
    }

    function statbarHeight(widthScale, barSpacing, max0, max1) {
       if (options.orientation == 'horizontal') {
        return options.height;
       } else {
        return isNaN(widthScale) ? undefined : widthScale - cellPadding;
       }
    }

    // ACCESSORS

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        var vKeys = Object.keys(values);
        var oKeys = Object.keys(options);
        for (var k=0; k < vKeys.length; k++) {
           if (oKeys.indexOf(vKeys[k]) >= 0) {
              if (typeof(options[vKeys[k]]) == 'object') {
                 var sKeys = Object.keys(values[vKeys[k]]);
                 var osKeys = Object.keys(options[vKeys[k]]);
                 for (var sk=0; sk < sKeys.length; sk++) {
                    if (osKeys.indexOf(sKeys[sk]) >= 0) {
                       options[vKeys[k]][sKeys[sk]] = values[vKeys[k]][sKeys[sk]];
                    }
                 }
              } else {
                 options[vKeys[k]] = values[vKeys[k]];
              }
           }
        }
        return chart;
    }

    /* OLD ONE
    chart.events = function(functions) {
        if (!arguments.length) return events;
        var fKeys = Object.keys(functions);
        var eKeys = Object.keys(events);
        for (var k=0; k < fKeys.length; k++) {
           if (eKeys.indexOf(fKeys[k]) >= 0) events[fKeys[k]] = functions[fKeys[k]];
        }
        return chart;
    }
    */

    /* NEW ONE
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
    }
    */

    function keyWalk(valuesObject, optionsObject) {
        if (!valuesObject || !optionsObject) return;
        var vKeys = Object.keys(valuesObject);
        var oKeys = Object.keys(optionsObject);
        for (var k=0; k < vKeys.length; k++) {
           if (oKeys.indexOf(vKeys[k]) >= 0) {
              var oo = optionsObject[vKeys[k]];
              var vo = valuesObject[vKeys[k]];
              if (typeof oo == 'object' && typeof vo !== 'function' && oo && oo.constructor !== Array) {
                 keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
              } else {
                 optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
              }
           }
        }
    }

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    /* this needs to become the way to set colors for RallyTree rather than
     * options as the NEW options function doesn't allow adding attributes not
     * already present in options.
    chart.colors = function(colores) {
        if (!arguments.length) return colors;
        colors = colores;
        return chart;
    }
    */

    chart.width = function(value) {
        if (!arguments.length) return options.width;
        options.width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        return chart;
    };

    chart.duration = function(value) {
        if (!arguments.length) return transition_time;
       transition_time = value;
       return chart;
    }

    chart.orientation = function(value) {
        if (!arguments.length) return options.orientation;
        if (['horizontal', 'vertical'].indexOf(value) >= 0) { options.orientation = value; }
        return chart;
    };

    chart.update = function() {
        if (events.update.begin) events.update.begin(data); 
        if (typeof update === 'function') update();
         setTimeout(function() { 
           if (events.update.end) events.update.end(data); 
         }, transition_time);
    }

   chart.reset = function(clear_active) {
      points = [];
      if (typeof update === 'function') update();
   }

    chart.points = function(values) {
       if (!arguments.length) return points;
       if ( values.constructor === Array ) {
          points = values;
       }
       return chart;
    }

    chart.pointsServed = function(player) {
       if (!arguments.length || !maxRally) return serveAdvantage;
       serveAdvantage = player;
       for (var i=0; i < points.length; i++) { 
          points[i].hide = (player == undefined || points[i].server == player) ? false : true;
       }
       orderPoints('result');
       if (typeof update === 'function') update();
    }

    chart.displayPct = function(display) {
       if (!arguments.length) return displayPct;
       displayPct = display;
       update();
       return chart;
    }

    // END ACCESSORS

    function orderPoints(option) {
       option = option ? option : 'result';
       shuffle(0, option);
       shuffle(1, option);
    }

    function shuffle(player, option) {
       var order = Object.keys(chart.options().points.colors);
       order.push('Z');
       var maxRally = d3.max(points, function(point) { return point.rallyLength() });
       for (y=0; y <= maxRally; y++) {
          var rally_group = [];
          for (var i=0; i < points.length; i++) { 
             if (points[i].rallyLength() == y && points[i].winner == player) { rally_group.push(points[i]); }
          }
          rally_group.sort(function(a, b) { 
             return (order.indexOf(a.hide ? 'Z' : a[option]) < order.indexOf(b.hide ? 'Z' : b[option])) 
                     ? -1 
                     : (order.indexOf(a.hide ? 'Z' : a[option]) > order.indexOf(b.hide ? 'Z' : b[option])) ? 1 : 0; 
          });
          rally_group.forEach(function(point, i) { point.rl[player] = i + 1; })
          for (var r=0; r < rally_group.length; r++) { points[rally_group[r].i] = rally_group[r]; }
       }
    }

    // calculate rally length win percentages
    rallyWinPct = function(player) {
      // points played
      var pprl = {}; // points played per rally length
      var pwrl = {}; // points won

      // points served
      var psrl = {}; // points served per rally length
      var pwsrl = {}; // points won serving per rally length

      // points received
      var prrl = {}; // points received per rally length
      var pwrrl = {}; // points received per rally length

      for (var p=0; p < points.length; p++) {
         var rl = points[p].rallyLength();
         pprl[rl] = (rl in pprl) ? (pprl[rl] + 1) : 1;
         var served = (points[p].server == player) ? 1 : 0;

         if (served) {
            psrl[rl] = (rl in psrl) ? (psrl[rl] + 1) : 1;
         } else {
            prrl[rl] = (rl in prrl) ? (prrl[rl] + 1) : 1;
         }

         if (points[p].winner == player) { 
            pwrl[rl] = (rl in pwrl) ? (pwrl[rl] + 1) : 1; 

            if (served) {
               pwsrl[rl] = (rl in pwsrl) ? (pwsrl[rl] + 1) : 1; 
            } else {
               pwrrl[rl] = (rl in pwrrl) ? (pwrrl[rl] + 1) : 1; 
            }
         }
      }

      // keys for points played (per rally length)
      pp_keys = Object.keys(pprl);
      // create empty arrays for all rally lengths
      var cpp = [].slice.apply(new Uint8Array(parseInt(lastElement(pp_keys)) + 1))
      var csp = [].slice.apply(new Uint8Array(parseInt(lastElement(pp_keys)) + 1))
      var crp = [].slice.apply(new Uint8Array(parseInt(lastElement(pp_keys)) + 1))

      var cpw = [].slice.apply(new Uint8Array(parseInt(lastElement(pp_keys)) + 1))
      var csw = [].slice.apply(new Uint8Array(parseInt(lastElement(pp_keys)) + 1))
      var crw = [].slice.apply(new Uint8Array(parseInt(lastElement(pp_keys)) + 1))
      
      var rppw = [].slice.apply(new Uint8Array(parseInt(lastElement(pp_keys)) + 1))
      var srppw = [].slice.apply(new Uint8Array(parseInt(lastElement(pp_keys)) + 1))
      var rrppw = [].slice.apply(new Uint8Array(parseInt(lastElement(pp_keys)) + 1))

      var rally_collection = [].slice.apply(new Uint8Array(parseInt(lastElement(pp_keys)) + 1))

      // iterate through all rally lengths by keys
      for (var rally_length=0; rally_length < cpp.length; rally_length++) {
         var cpp_total = 0; // cumulative points played
         var csp_total = 0; // cumulative served points played
         var crp_total = 0; // cumulative received points played

         var cpw_total = 0; // cumulative points won
         var csw_total = 0; // cumulative served points won
         var crw_total = 0; // cumulative received points won

         // create array of rally lengths greater than current rally
         remaining_rally_lengths = pp_keys.filter(function(rl) { return rl >= rally_length });

         // itreate through rally lengths from current till last
         for (var kv=0; kv < remaining_rally_lengths.length; kv++) {
            // if there are points played for this rally lenghth, add them
            if (pprl[remaining_rally_lengths[kv]] !== undefined) { 
               cpp_total += pprl[remaining_rally_lengths[kv]]; 
            }
            // if there are points served for this rally lenghth, add them
            if (psrl[remaining_rally_lengths[kv]] !== undefined) { 
               csp_total += psrl[remaining_rally_lengths[kv]]; 
            }
            // if there are points received for this rally lenghth, add them
            if (prrl[remaining_rally_lengths[kv]] !== undefined) { 
               crp_total += prrl[remaining_rally_lengths[kv]]; 
            }

            // if there are points won for this rally lenghth, add them
            if (pwrl[remaining_rally_lengths[kv]] !== undefined) { 
               cpw_total += pwrl[remaining_rally_lengths[kv]]; 
            }
            // if there are served points won for this rally lenghth, add them
            if (pwsrl[remaining_rally_lengths[kv]] !== undefined) { 
               csw_total += pwsrl[remaining_rally_lengths[kv]]; 
            }
            // if there are received points won for this rally lenghth, add them
            if (pwrrl[remaining_rally_lengths[kv]] !== undefined) { 
               crw_total += pwrrl[remaining_rally_lengths[kv]]; 
            }
         }
         cpp[rally_length] = cpp_total;
         csp[rally_length] = csp_total;
         crp[rally_length] = crp_total;

         cpw[rally_length] = cpw_total;
         csw[rally_length] = csw_total;
         crw[rally_length] = crw_total;

         // calculate percentage of points won for each rally length
         rppw[rally_length] = Math.round(cpw[rally_length] / cpp[rally_length] * 100);
         srppw[rally_length] = csp[rally_length] ? Math.round(csw[rally_length] / csp[rally_length] * 100) : 0;
         rrppw[rally_length] = crp[rally_length] ? Math.round(crw[rally_length] / crp[rally_length] * 100) : 0;

         rally_collection[rally_length] = { 
            pct_won: rppw[rally_length],
            sv_pct_won: srppw[rally_length],
            rc_pct_won: rrppw[rally_length],
            points_played: cpp[rally_length], 
            points_won: cpw[rally_length]
         };
      }

      var cases = { 0: [srppw, rrppw], 1: [rrppw, srppw] }
      return cases[serveAdvantage] ? cases[serveAdvantage][player] : rppw;

      /*
      switch(serveAdvantage) {
         case  0: 
            return player == 0 ? srppw : rrppw; 
         case  1: 
            return player == 0 ? rrppw : srppw; 
         default: 
            return player == 0 ? rppw : rppw;
      }
      */
    }

    function lastElement(arr) { return arr[arr.length - 1]; }

    return chart;
}
function RadarChart() {

   var uuid = UUID.generate();

   // TODO:
   // wrapWidth should probably be calculated rather than an option
   // slider to change maxValue on the fly
   // filter update make sure there is an element with URL
   //
   // show axis tics/legend when hover over axis label or data point
   // add abstract axis legend hover area... 'eyebrows' or 'dots'
   //
   // popup div/panel for selecting axes to display and ranges and whether to invert
   
   // options which should be accessible via ACCESSORS
   var data = [];
   var options = {
      filter: 'rcGlow' + uuid,            // define your own filter; false = no filter;
      filter_id: 'rcGlow' + uuid,         // assign unique name for default filter

      resize: false,

      width: window.innerWidth,
      widthMax: window.innerWidth,

	   height: window.innerHeight,
      heightMax: window.innerHeight,

      minRadius: 80,

      // Margins for the SVG
      margins: {
         top: 100, 
         right: 100, 
         bottom: 100, 
         left: 100
      },

      circles: { 
         levels: 8, 
         maxValue: 0, 
         labelFactor: 1.25, 
         opacity: 0.1, 
         fill: "#CDCDCD", 
         color: "#CDCDCD"
      },

      areas: {
         colors: {},            // color lookup by key
         opacity: 0.35,
         borderWidth: 2,
         rounded: true,
         dotRadius: 4,
         sort: true,          // sort layers by approximation of size, smallest on top
         filter: []
      },

      axes: {
         display: true,
         threshold: 90,    // radius threshold for hiding
         lineColor: "white",
         lineWidth: "2px",
         fontWidth: "11px",
         fontColor: "black",
         wrapWidth: 60,	      // The number of pixels after which a label needs to be given a new line
         filter: [],
         invert: [],
         ranges: {}           // { axisname: [min, max], axisname: [min, max]  }
      },

      legend: {
         display: false,
         symbol: 'cross', // 'circle', 'cross', 'diamond', 'triangle-up', 'triangle-down'
         toggle: 'circle',
         position: { x: 25, y: 25 }
      },

      class: "rc",

      color: d3.scale.category10()	   //Color function
   }

   // nodes layered such that radarInvisibleCircles always on top of radarAreas
   // and tooltip layer is at topmost layer 
   var chart_node;           // parent node for this instance of radarChart
   var hover_node;           // parent node for invisibleRadarCircles
   var tooltip_node;         // parent node for tooltip, to keep on top
   var legend_node;          // parent node for tooltip, to keep on top

   // DEFINABLE EVENTS
   // Define with ACCESSOR function chart.events()
   var events = {
      'update': { 'begin': null, 'end': null },
      'gridCircle': { 'mouseover': null, 'mouseout': null, 'mouseclick': null },
      'axisLabel': { 'mouseover': null, 'mouseout': null, 'mouseclick': null },
      'line': { 'mouseover': null, 'mouseout': null, 'mouseclick': null },
      'legend': { 'mouseover': legendMouseover, 'mouseout': areaMouseout, 'mouseclick': legendClick },
      'axisLegend': { 'mouseover': null, 'mouseout': null, 'mouseclick': null },
      'radarArea': { 'mouseover': areaMouseover, 'mouseout': areaMouseout, 'mouseclick': null },
      'radarInvisibleCircle': { 'mouseover': tooltip_show, 'mouseout': tooltip_hide, 'mouseclick': null }
   };

   // functions which should be accessible via ACCESSORS
   var update;

   // helper functions
   var tooltip;

   // programmatic
   var _data = [];
   var legend_toggles = [];
   var radial_calcs = {};
   var Format = d3.format('%'); // Percentage formatting
   var transition_time = 1000;
   var delay = 0;
   var keys;
   var keyScale;
   var colorScale;
   var dom_parent;

   function chart(selection) {
        selection.each(function () {

            dataCalcs();
            radialCalcs();

            dom_parent = d3.select(this);
            scaleChart();

            //////////// Create the container SVG and children g /////////////
            var svg = dom_parent.append('svg')
                .attr('width', options.width)
                .attr('height', options.height);

            // append parent g for chart
            chart_node = svg.append('g').attr('class', options.class + 'RadarNode');
            hover_node = svg.append('g').attr('class', options.class + 'HoverNode');
            tooltip_node = svg.append('g').attr('class', options.class + 'TooltipNode');
            legend_node = svg.append("g").attr("class", options.class + "Legend");

            // Wrapper for the grid & axes
            var axisGrid = chart_node.append("g").attr("class", options.class + "AxisWrapper");

            ////////// Glow filter for some extra pizzazz ///////////
            var filter = chart_node.append('defs').append('filter').attr('id', options.filter_id),
               feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
               feMerge = filter.append('feMerge'),
               feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
               feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

            // Set up the small tooltip for when you hover over a circle
            tooltip = tooltip_node.append("text")
               .attr("class", options.class + 'Tooltip')
               .style("opacity", 0);
           
            // update
            update = function() {

                var duration = transition_time;

                dataCalcs();
                radialCalcs();

                keys = _data.map(function(m) { return m.key; });
                keyScale = d3.scale.ordinal()
                             .domain(_data.map(function(m) { return m._i; }))
                             .range(_data.map(function(m) { return m.key; }));
                colorScale = d3.scale.ordinal()
                                .domain(_data.map(function(m) { 
                                   return options.areas.colors[keyScale(m._i)] ? 
                                          keyScale(m._i) 
                                          : m._i.toString(); 
                                }))
                                .range(_data.map(function(m) { return setColor(m); }));
 
                svg.transition().delay(delay).duration(duration)
                    .attr('width', options.width)
                    .attr('height', options.height)

                chart_node.transition().delay(delay).duration(duration)
                     .attr('width', options.width)
                     .attr('height', options.height)
                     .attr("transform", 
                           "translate(" + ((options.width - (options.margins.left + options.margins.right)) / 2 + options.margins.left) + "," 
                                        + ((options.height - (options.margins.top + options.margins.bottom)) / 2 + options.margins.top) + ")")
                hover_node.transition().delay(delay).duration(duration)
                     .attr('width', options.width)
                     .attr('height', options.height)
                     .attr("transform", 
                           "translate(" + ((options.width - (options.margins.left + options.margins.right)) / 2 + options.margins.left) + "," 
                                        + ((options.height - (options.margins.top + options.margins.bottom)) / 2 + options.margins.top) + ")")
                tooltip_node.transition().delay(delay).duration(duration)
                     .attr('width', options.width)
                     .attr('height', options.height)
                     .attr("transform", 
                           "translate(" + ((options.width - (options.margins.left + options.margins.right)) / 2 + options.margins.left) + "," 
                                        + ((options.height - (options.margins.top + options.margins.bottom)) / 2 + options.margins.top) + ")")

                legend_node
                     .attr("transform", "translate(" + options.legend.position.x + "," + options.legend.position.y + ")");

                var update_gridCircles = axisGrid.selectAll("." + options.class + "GridCircle")
                     .data(d3.range(1, (options.circles.levels + 1)).reverse())

                update_gridCircles
                    .transition().duration(duration)
                    .attr("r", function(d, i) { return radial_calcs.radius / options.circles.levels * d; })
                     .style("fill", options.circles.fill)
                    .style("fill-opacity", options.circles.opacity)
                    .style("stroke", options.circles.color)
                    .style("filter" , function() { if (options.filter) return "url(#" + options.filter + ")" });

                update_gridCircles.enter()
                    .append("circle")
                    .attr("class", options.class + "GridCircle")
                    .attr("r", function(d, i) { return radial_calcs.radius / options.circles.levels * d; })
                    .on('mouseover', function(d, i) { if (events.gridCircle.mouseover) events.gridCircle.mouseover(d, i); })
                    .on('mouseout', function(d, i) { if (events.gridCircle.mouseout) events.gridCircle.mouseout(d, i); })
                    .on('click', function(d, i) { if (events.gridCircle.mouseclick) events.gridCircle.mouseclick(d, i); })
                    .style("fill", options.circles.fill)
                    .style("fill-opacity", options.circles.opacity)
                    .style("stroke", options.circles.color)
                    .style("filter" , function() { if (options.filter) return "url(#" + options.filter + ")" });

                update_gridCircles.exit()
                    .transition().duration(duration * .5)
                    .delay(function(d, i) { return 0; })
                    .remove();

                var update_axisLabels = axisGrid.selectAll("." + options.class + "AxisLabel")
                    .data(d3.range(1, (options.circles.levels + 1)).reverse())

                update_axisLabels.enter()
                    .append("text")
                    .attr("class", options.class + "AxisLabel")
                    .attr("x", 4)
                    .attr("y", function(d) { return -d * radial_calcs.radius / options.circles.levels; })
                    .attr("dy", "0.4em")
                    .style("font-size", "10px")
                    .attr("fill", "#737373")
                    .on('mouseover', function(d, i) { if (events.axisLabel.mouseover) events.axisLabel.mouseover(d, i); })
                    .on('mouseout', function(d, i) { if (events.axisLabel.mouseout) events.axisLabel.mouseout(d, i); })
                    .text(function(d, i) { if (radial_calcs.maxValue) return Format(radial_calcs.maxValue * d / options.circles.levels); });

                update_axisLabels.exit()
                    .transition().duration(duration * .5)
                    .remove();

                update_axisLabels
                    .transition().duration(duration / 2)
                    .style('opacity', 1) // don't change to 0 if there has been no change in dimensions! possible??
                    .transition().duration(duration / 2)
                    .style('opacity', 1)
                    .attr("y", function(d) { return -d * radial_calcs.radius / options.circles.levels; })
                    .text(function(d, i) { if (radial_calcs.maxValue) return Format(radial_calcs.maxValue * d / options.circles.levels); })

                var update_axes = axisGrid.selectAll("." + options.class + "Axis")
                    .data(radial_calcs.axes, get_axis)

                update_axes
                   .enter().append("g")
                   .attr("class", options.class + "Axis")
                   .attr("key", function(d) { return d.axis; });

                update_axes.exit()
                   .transition().duration(duration)
                   .style('opacity', 0)
                   .remove()

                var update_lines = update_axes.selectAll("." + options.class + "Line")
                    .data(function(d) { return [d]; }, get_axis)

                update_lines.enter()
                    .append("line")
                    .attr("class", options.class + "Line")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", function(d, i, j) { return calcX(null, 1.1, j); })
                    .attr("y2", function(d, i, j) { return calcY(null, 1.1, j); })
                    .on('mouseover', function(d, i, j) { if (events.line.mouseover) events.line.mouseover(d, j); })
                    .on('mouseout', function(d, i, j) { if (events.line.mouseout) events.line.mouseout(d, j); })
                    .style("stroke", options.axes.lineColor)
                    .style("stroke-width", "2px")

                update_lines.exit()
                    .transition().duration(duration * .5)
                    .delay(function(d, i) { return 0; })
                    .remove();

                update_lines
                    .transition().duration(duration)
                    .style("stroke", options.axes.lineColor)
                    .style("stroke-width", options.axes.lineWidth)
                    .attr("x2", function(d, i, j) { return calcX(null, 1.1, j); })
                    .attr("y2", function(d, i, j) { return calcY(null, 1.1, j); })

                var update_axis_legends = update_axes.selectAll("." + options.class + "AxisLegend")
                    .data(function(d) { return [d]; }, get_axis)

                update_axis_legends.enter()
                    .append("text")
                    .attr("class", options.class + "AxisLegend")
                    .style("font-size", options.axes.fontWidth)
                    .attr("text-anchor", "middle")
                    .attr("dy", "0.35em")
                    .attr("x", function(d, i, j) { return calcX(null, options.circles.labelFactor, j); })
                    .attr("y", function(d, i, j) { return calcY(null, options.circles.labelFactor, j); })
                    .style('opacity', function(d, i) { return options.axes.display ? 1 : 0})
                    .on('mouseover', function(d, i, j) { if (events.axisLegend.mouseover) events.axisLegend.mouseover(d, i, j); })
                    .on('mouseout', function(d, i, j) { if (events.axisLegend.mouseout) events.axisLegend.mouseout(d, i, j); })
                    .call(wrap, options.axes.wrapWidth)

                update_axis_legends.exit()
                    .transition().duration(duration * .5)
                    .delay(function(d, i) { return 0; })
                    .remove();

                update_axis_legends
                    .transition().duration(duration)
                    .style('opacity', function(d, i) { 
                       return options.axes.display && radial_calcs.radius > options.axes.threshold ? 1 : 0
                    })
                    .attr("x", function(d, i, j) { return calcX(null, options.circles.labelFactor, j); })
                    .attr("y", function(d, i, j) { return calcY(null, options.circles.labelFactor, j); })
                    .selectAll('tspan')
                    .attr("x", function(d, i, j) { return calcX(null, options.circles.labelFactor, j); })
                    .attr("y", function(d, i, j) { return calcY(null, options.circles.labelFactor, j); })

                var radarLine = d3.svg.line.radial()
                   .interpolate( options.areas.rounded ? 
                                 "cardinal-closed" : 
                                 "linear-closed" )
                   .radius(function(d) { return radial_calcs.rScale(d.value); })
                   .angle(function(d,i) {	return i * radial_calcs.angleSlice; });

                var update_blobWrapper = chart_node.selectAll("." + options.class + "RadarWrapper")
                   .data(_data, get_key)

                update_blobWrapper.enter()
                   .append("g")
                   .attr("class", options.class + "RadarWrapper")
                   .attr("key", function(d) { return d.key; });

                update_blobWrapper.exit()
                   .transition().duration(duration)
                   .style('opacity', 0)
                   .remove()

                update_blobWrapper
                   .style("fill-opacity", function(d, i) { 
                      return options.areas.filter.indexOf(d.key) >= 0 ? 0 : options.areas.opacity;
                   })

                var update_radarArea = update_blobWrapper.selectAll('.' + options.class + 'RadarArea')
                   .data(function(d) { return [d]; }, get_key);

                update_radarArea.enter()
                   .append("path")
                   .attr("class", function(d) { return options.class + "RadarArea " + d.key.replace(/\s+/g, '') })
                   .attr("d", function(d, i) { return radarLine(d.values); })
                   .style("fill", function(d, i, j) { return setColor(d); })
                   .style("fill-opacity", 0)
                   .on('mouseover', function(d, i) { if (events.radarArea.mouseover) events.radarArea.mouseover(d, i, this); })
                   .on('mouseout', function(d, i) { if (events.radarArea.mouseout) events.radarArea.mouseout(d, i, this); })

                update_radarArea.exit().remove()

                update_radarArea
                   .transition().duration(duration)
                   .style("fill", function(d, i, j) { return setColor(d); })
                   .attr("d", function(d, i) { return radarLine(d.values); })
                   .style("fill-opacity", function(d, i) { 
                      return options.areas.filter.indexOf(d.key) >= 0 ? 0 : options.areas.opacity;
                   })

                var update_radarStroke = update_blobWrapper.selectAll('.' + options.class + 'RadarStroke')
                   .data(function(d) { return [d]; }, get_key);

                update_radarStroke.enter()
                   .append("path")
                   .attr("class", options.class + "RadarStroke")
                   .attr("d", function(d, i) { return radarLine(d.values); })
                   .style("opacity", 0)
                   .style("stroke-width", options.areas.borderWidth + "px")
                   .style("stroke", function(d, i, j) { return setColor(d); })
                   .style("fill", "none")
                   .style("filter" , function() { if (options.filter) return "url(#" + options.filter + ")" });
            
                update_radarStroke.exit().remove();

                update_radarStroke
                   .transition().duration(duration)
                   .style("stroke", function(d, i, j) { return setColor(d); })
                   .attr("d", function(d, i) { return radarLine(d.values); })
                   .style("filter" , function() { if (options.filter) return "url(#" + options.filter + ")" })
                   .style("opacity", function(d, i) {
                      return options.areas.filter.indexOf(d.key) >= 0 ? 0 : 1;
                   });

                update_radarCircle = update_blobWrapper.selectAll('.' + options.class + 'RadarCircle')
                   .data(function(d, i) { return add_index(d._i, d.key, d.values) });

                update_radarCircle.enter()
                   .append("circle")
                   .attr("class", options.class + "RadarCircle")
                   .attr("r", options.areas.dotRadius)
                   .attr("cx", function(d, i, j){ return calcX(0, 0, i); })
                   .attr("cy", function(d, i, j){ return calcY(0, 0, i); })
                   .style("fill", function(d, i, j) { return setColor(d, d._i, _data[j].key); })
                   .style("fill-opacity", function(d, i) { return 0; })
                   .transition().duration(duration)
                   .attr("cx", function(d, i, j){ return calcX(d.value, 0, i); })
                   .attr("cy", function(d, i, j){ return calcY(d.value, 0, i); })

                update_radarCircle.exit().remove();

                update_radarCircle
                   .transition().duration(duration)
                   .style("fill", function(d, i, j) { return setColor(d, d._i, _data[j].key); })
                   .style("fill-opacity", function(d, i, j) { 
                      var key = _data.map(function(m) {return m.key})[j];
                      return options.areas.filter.indexOf(key) >= 0 ? 0 : 0.8; 
                   })
                   .attr("r", options.areas.dotRadius)
                   .attr("cx", function(d, i){ return calcX(d.value, 0, i); })
                   .attr("cy", function(d, i){ return calcY(d.value, 0, i); })
 
                var update_blobCircleWrapper = hover_node.selectAll("." + options.class + "RadarCircleWrapper")
                   .data(_data, get_key)

                update_blobCircleWrapper.enter()
                   .append("g")
                   .attr("class", options.class + "RadarCircleWrapper")
                   .attr("key", function(d) { return d.key; });

                update_blobCircleWrapper.exit()
                   .transition().duration(duration)
                   .style('opacity', 0)
                   .remove()

                update_radarInvisibleCircle = update_blobCircleWrapper.selectAll("." + options.class + "RadarInvisibleCircle")
                   .data(function(d, i) { return add_index(d._i, d.key, d.values); });

                update_radarInvisibleCircle.enter()
                   .append("circle")
                   .attr("class", options.class + "RadarInvisibleCircle")
                   .attr("r", options.areas.dotRadius * 1.5)
                   .attr("cx", function(d, i){ return calcX(d.value, 0, i); })
                   .attr("cy", function(d, i){ return calcY(d.value, 0, i); })
                   .style("fill", "none")
                   .style("pointer-events", "all")
                   .on('mouseover', function(d, i) { 
                      if (events.radarInvisibleCircle.mouseover) events.radarInvisibleCircle.mouseover(d, i, this); 
                   })
                   .on("mouseout", function(d, i) {
                      if (events.radarInvisibleCircle.mouseout) events.radarInvisibleCircle.mouseout(d, i, this); 
                   })

                update_radarInvisibleCircle.exit().remove();

                update_radarInvisibleCircle
                   .attr("cx", function(d, i){ return calcX(d.value, 0, i); })
                   .attr("cy", function(d, i){ return calcY(d.value, 0, i); })

                if (options.legend.display) {
                   var shape = d3.svg.symbol().type(options.legend.symbol).size(150)();
                   var colorScale = d3.scale.ordinal()
                      .domain(_data.map(function(m) { return m._i; }))
                      .range(_data.map(function(m) { return setColor(m); }));

                   if (d3.legend) {
                      var legendOrdinal = d3.legend.color()
                         .shape("path", shape)
                         .shapePadding(10)
                         .scale(colorScale)
                         .labels(colorScale.domain().map(function(m) { return keyScale(m); } ))
                         .on("cellclick", function(d, i) { 
                            if (events.legend.mouseclick) events.legend.mouseclick(d, i, this); 
                         })
                         .on("cellover", function(d, i) { 
                            if (events.legend.mouseover) events.legend.mouseover(d, i, this); 
                         })
                         .on("cellout", function(d, i) { 
                            if (events.legend.mouseout) events.legend.mouseout(d, i, this); 
                         });
    
                      legend_node
                        .call(legendOrdinal);

                      legend_node.selectAll('.cell')
                        .attr('gen', function(d, i) { 
                           if (legend_toggles[d] == true) {
                              var shape = d3.svg.symbol().type(options.legend.toggle).size(150)()
                           } else {
                              var shape = d3.svg.symbol().type(options.legend.symbol).size(150)()
                           }
                           d3.select(this).select('path').attr('d', function() { return shape; });
                           return legend_toggles[d];
                        });

                   }
               }

            }
        });
   }

   // REUSABLE FUNCTIONS
   // ------------------
   // calculate average for sorting, add unique indices for color
   // accounts for data updates and assigns unique colors when possible
   function dataCalcs() {

       // this deep copy method has limitations which should not be encountered
       // in this context
       _data = JSON.parse(JSON.stringify(data));

       var axes = getAxisLabels(_data);
       var ranges = {};

       // determine min/max range for each axis
       _data.forEach( function(e) { e.values.forEach (function(d, i) { 
          var range = ranges[axes[i]] ?                        // already started?
                      ranges[axes[i]] 
                      : options.axes.ranges[axes[i]] ?         // rande defined in options?
                        options.axes.ranges[axes[i]].slice()
                        : [0, 1];                              // default
          var max = d.value > range[1] ? d.value : range[1];
          var min = d.value < range[0] ? d.value : range[0];
          ranges[axes[i]] = [min, max];                        // update
       }) });

       // convert all axes to range [0,1] (procrustean)
       _data.forEach( function(e) { e.values.forEach (function(d, i) { 
          if (ranges[axes[i]][0] != 0 && ranges[axes[i]][1] != 1) {
             var range = ranges[axes[i]];
             d.original_value = Number(d.value);
             d.value = (d.value - range[0]) / (range[1] - range[0]);
          }
          if (options.axes.invert.indexOf(axes[i]) >= 0) {  d.value = 1 - d.value; }
       }) })

       _data.forEach( function(d) { d['_avg'] = d3.mean(d.values, function(e){ return e.value }); })

       _data = options.areas.sort ? 
               _data.sort( function(a, b) {
                  var a = a['_avg'];
                  var b = b['_avg'];
                  return b - a;
               })
               : _data;

       // filter out axes
       var d_indices = axes.map(function(m, i) { return (options.axes.filter.indexOf(axes[i]) >= 0) ? i : undefined; }).reverse();
       _data.forEach( function(e) { 
          d_indices.forEach(function(i) { if (i >= 0) e.values.splice(i, 1); });
       });

       var color_indices = (function(a,b){while(a--)b[a]=a;return b})(10,[]);
       var indices = _data.map(function (i) { return i._i });
       var unassigned = color_indices.filter(function(x) { return indices.indexOf(x) < 0; }).reverse();

       _data = _data.map(function(d, i) { 
          if (d['_i'] >= 0) {
             return d;
          } else {
             d['_i'] = unassigned.length ? unassigned.pop() : i; 
             return d;
          }
       });
   }

   function getAxisLabels(dataArray) {
       return dataArray.length ? 
              dataArray[0].values.map(function(i, j) { return i.axis;})
              : [];
   }

   function radialCalcs() {
      var axes  = _data.length ? 
                  _data[0].values.map(function(i, j) { return i;})
                  : [];
      var axisLabels = getAxisLabels(_data);

      radial_calcs = {
         // Radius of the outermost circle
         radius: Math.min((options.width - (options.margins.left + options.margins.right)) / 2, 
                          (options.height - (options.margins.bottom + options.margins.top)) / 2),
         axes: axes,
         axisLabels: axisLabels,

         // If the supplied maxValue is smaller than the actual one, replace by the max in the data
         maxValue: Math.max(options.circles.maxValue, d3.max(_data, function(i) { 
            return d3.max(i.values.map( function(o) { return o.value; })) 
         }))
      }
      radial_calcs.radius = Math.max(radial_calcs.radius, options.minRadius);
      radial_calcs.total = radial_calcs.axes.length;

      // The width in radians of each "slice"
      radial_calcs.angleSlice = radial_calcs.total > 0 ? 
                                Math.PI * 2 / radial_calcs.total 
                                : 1;

      //Scale for the radius
      radial_calcs.rScale = d3.scale.linear()
                              .range([0, radial_calcs.radius])
                              .domain([0, radial_calcs.maxValue])
   }

   function modifyList(list, values, valid_list) {

      if ( values.constructor === Array ) {
         values.forEach(function(e) { checkType(e); });
      } else if (typeof values != "object") {
         checkType(values);
      } else {
         return chart;
      }

      function checkType(v) {
         if (!isNaN(v) && (function(x) { return (x | 0) === x; })(parseFloat(v))) {
            checkValue(parseInt(v));
         } else if (typeof v == "string") {
            checkValue(v);
         }
      }

      function checkValue(val) {
         if ( valid_list.indexOf(val) >= 0 ) {
            modify(val);
         } else if ( val >= 0 && val < valid_list.length ) {
            modify(valid_list[val]);
         }
      }

      function modify(index) {
         if (list.indexOf(index) >= 0) {
            remove(list, index);
         } else {
            list.push(index);
         }
      }

      function remove(arr, item) {
        for (var i = arr.length; i--;) { if (arr[i] === item) { arr.splice(i, 1); } }
      }
   }

   function calcX(value, scale, index) { 
      return radial_calcs.rScale(value ? 
                                 value 
                                 : radial_calcs.maxValue * scale) * Math.cos(radial_calcs.angleSlice * index - Math.PI/2); 
   }

   function calcY(value, scale, index) { 
      return radial_calcs.rScale(value ? 
                                 value 
                                 : radial_calcs.maxValue * scale) * Math.sin(radial_calcs.angleSlice * index - Math.PI/2);
   }

   function setColor(d, index, key) {
      index = index ? index : d._i;
      key = key ? key : d.key;
      return options.areas.colors[key] ? options.areas.colors[key] : options.color(index);
   }
   // END REUSABLE FUNCTIONS

   // ACCESSORS
   // ---------
   chart.nodes = function() {
      return { svg: svg, chart: chart_node, hover: hover_node, tooltip: tooltip_node, legend: legend_node };
   }

    chart.width = function(value) {
        if (!arguments.length) return options.width;
        if (options.resize) {
           options.widthMax = value;
        } else {
           options.width = value;
        }
        scaleChart();
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        if (options.resize) {
           options.heightMax = value;
        } else {
           options.height = value;
        }
        scaleChart();
        return chart;
    };

    chart.duration = function(value) {
        if (!arguments.length) return transition_time;
       transition_time = value;
       return chart;
    }

    chart.update = function() {
        if (events.update.begin) events.update.begin(_data); 
        if (typeof update === 'function') update();
         setTimeout(function() { 
           if (events.update.end) events.update.end(_data); 
         }, transition_time);
    }

    chart.data = function(value) {
        if (!arguments.length) return data;
        if (legend_toggles.length) {
           var keys = _data.map(function(m) {return m.key});
           legend_toggles.forEach(function (e, i) { chart.filterAreas(keys[i]); })
        }
        legend_toggles = [];
        data = value;
        return chart;
    };

    chart.pop = function() {
        var row = data.pop()
        if (typeof update === 'function') update();
        return row;
    };

    chart.push = function(row) {
        if ( row && row.constructor === Array ) {
           for (var i=0; i < row.length; i++) {
              check_key(row[i]);
           }
        } else {
           check_key(row);
        }

        function check_key(one_row) {
           if (one_row && one_row.key && data.map(function(m) { return m.key }).indexOf(one_row.key) < 0) {
              data.push(one_row);
           }
        }

        return chart;
    };

    chart.shift = function() {
        var row = data.shift();
        if (typeof update === 'function') update();
        return row;
    };

    chart.unshift = function(row) {
        if ( row && row.constructor === Array ) {
           for (var i=0; i < row.length; i++) {
              check_key(row[i]);
           }
        } else {
           check_key(row);
        }

        function check_key(one_row) {
           if (one_row.key && data.map(function(m) { return m.key }).indexOf(one_row.key) < 0) {
              data.unshift(one_row);
           }
        }

        return chart;
    };

    chart.slice = function(begin, end) {
        return data.slice(begin, end);
    };

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
    }

    function keyWalk(valuesObject, optionsObject) {
        if (!valuesObject || !optionsObject) return;
        var vKeys = Object.keys(valuesObject);
        var oKeys = Object.keys(optionsObject);
        for (var k=0; k < vKeys.length; k++) {
           if (oKeys.indexOf(vKeys[k]) >= 0) {
              var oo = optionsObject[vKeys[k]];
              var vo = valuesObject[vKeys[k]];
              if (typeof oo == 'object' && typeof vo !== 'function' && oo && oo.constructor !== Array) {
                 keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
              } else {
                 optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
              }
           }
        }
    }

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.margins = function(value) {
        if (!arguments.length) return options.margins;
        var vKeys = Object.keys(values);
        var mKeys = Object.keys(options.margins);
        for (var k=0; k < vKeys.length; k++) {
           if (mKeys.indexOf(vKeys[k]) >= 0) options.margins[vKeys[k]] = values[vKeys[k]];
        }
        return chart;
    }

    chart.levels = function(value) {
        if (!arguments.length) return options.circles.levels;
        options.circles.levels = value;
        return chart;
    }

    chart.maxValue = function(value) {
        if (!arguments.length) return options.circles.maxValue;
        options.circles.maxValue = value;
        return chart;
    }

    chart.opacity = function(value) {
        if (!arguments.length) return options.areas.opacity;
        options.areas.opacity = value;
        return chart;
    }

    chart.borderWidth = function(value) {
        if (!arguments.length) return options.areas.borderWidth;
        options.areas.borderWidth = value;
        return chart;
    }

    chart.rounded = function(value) {
        if (!arguments.length) return options.areas.rounded;
        options.areas.rounded = value;
        return chart;
    }

    // range of colors to set color based on index
    chart.color = function(value) {
        if (!arguments.length) return options.color;
        options.color = value;
        return chart;
    }

    // colors set according to data keys
    chart.colors = function(colores) {
        if (!arguments.length) return options.areas.colors;
        options.areas.colors = colores;
        return chart;
    }

    chart.keys = function() {
       return data.map(function(m) {return m.key});
    }

    chart.axes = function() {
       return getAxisLabels(data);
    }

    // add or remove keys (or key indices) to filter axes
    chart.filterAxes = function(values) {
       if (!arguments.length) return options.axes.filter;
       var axes = getAxisLabels(data);
       modifyList(options.axes.filter, values, axes);
       return chart;
    }

    // add or remove keys (or key indices) to filter areas
    chart.filterAreas = function(values) {
       if (!arguments.length) return options.areas.filter;
       var keys = data.map(function(m) {return m.key});
       modifyList(options.areas.filter, values, keys);
       return chart;
    }

    // add or remove keys (or key indices) to invert
    chart.invert = function(values) {
       if (!arguments.length) return options.axes.invert;
       var axes = getAxisLabels(data);
       modifyList(options.axes.invert, values, axes);
       return chart;
    }

    // add or remove ranges for keys
    chart.ranges = function(values) {
       if (!arguments.length) return options.axes.ranges;
       if (typeof values == "string") return chart;

       var axes = getAxisLabels(data);

       if ( values && values.constructor === Array ) {
          values.forEach(function(e) { checkRange(e); } );
       } else {
          checkRange(values);
       }

       function checkRange(range_declarations) {
          var keys = Object.keys(range_declarations);
          for (var k=0; k < keys.length; k++) {
             if ( axes.indexOf(keys[k]) >= 0       // is valid axis
                  && range_declarations[keys[k]]    // range array not undefined
                  && range_declarations[keys[k]].constructor === Array
                  && checkValues(keys[k], range_declarations[keys[k]]) ) {
                     options.axes.ranges[keys[k]] = range_declarations[keys[k]];
             }
          }
       }

       function checkValues(key, range) {
          if (range.length == 2 && !isNaN(range[0]) && !isNaN(range[1])) { 
             return true;
          } else if (range.length == 0) {
             delete options.axes.ranges[key];
          }
          return false;
       }

       return chart;
    }
    // END ACCESSORS

   // DEFAULT EVENTS
   // --------------
   function areaMouseover(d, i, self) {
      if (legend_toggles[d._i]) return;
      //Dim all blobs
      chart_node.selectAll("." + options.class + "RadarArea")
         .transition().duration(200)
			.style("fill-opacity", function(d, i, j) {
            return options.areas.filter.indexOf(d.key) >= 0 ? 0 : 0.1;
          }) 
      //Bring back the hovered over blob
      d3.select(self)
         .transition().duration(200)
			.style("fill-opacity", function(d, i, j) {
            return options.areas.filter.indexOf(d.key) >= 0 ? 0 : 0.7;
         });	
   }

   function areaMouseout(d, i, self) {
      //Bring back all blobs
      chart_node.selectAll("." + options.class + "RadarArea")
         .transition().duration(200)
         .style("fill-opacity", function(d, i, j) {
            return options.areas.filter.indexOf(d.key) >= 0 ? 0 : options.areas.opacity;
         });
   }

   // on mouseover for the legend symbol
	function legendMouseover(d, i, self) {
         if (legend_toggles[d]) return;
         var area = keys.indexOf(d) >= 0 ? d : keyScale(d); 

			//Dim all blobs
			chart_node.selectAll("." + options.class + "RadarArea")
				.transition().duration(200)
				.style("fill-opacity", function(d, i, j) {
               return options.areas.filter.indexOf(d.key) >= 0 ? 0 : 0.1;
            }); 
			//Bring back the hovered over blob
         chart_node.selectAll("." + options.class + "RadarArea." + area.replace(/\s+/g, ''))
				.transition().duration(200)
				.style("fill-opacity", function(d, i, j) {
               return options.areas.filter.indexOf(d.key) >= 0 ? 0 : 0.7;
            });	
	}

   function legendClick(d, i, self) {
         var keys = _data.map(function(m) {return m.key});
         modifyList(options.areas.filter, keys[d], keys);
         legend_toggles[d] = legend_toggles[d] ? false : true;
         update();
   }

   function tooltip_show(d, i, self) {
         if (legend_toggles[d._i]) return;
         var labels = getAxisLabels(_data);
         chart_node.select('[key="'+d.axis+'"]').select('text').style('opacity', 1);
         var value = d.original_value ? d.original_value : Format(d.value);
         newX =  parseFloat(d3.select(self).attr('cx')) - 10;
         newY =  parseFloat(d3.select(self).attr('cy')) - 10;
            
         tooltip
          .attr('x', newX)
          .attr('y', newY)
          .text(value)
          .transition().duration(200)
          .style('opacity', 1);
   }

   function tooltip_hide(d, i, self) {
         chart_node.select('[key="'+d.axis+'"]').select('text')
             .style('opacity', options.axes.display && radial_calcs.radius > options.axes.threshold ? 1 : 0);
         tooltip
          .transition().duration(200)
          .style("opacity", 0);
   }

	// Helper Functions
   // ----------------

   function add_index(index, key, values) {
      for (var v=0; v<values.length; v++) {
         values[v]['_i'] = index;
         values[v]['key'] = key;
      }
      return values;
   }

   var get_key = function(d) { return d && d.key; };
   var get_axis = function(d) { return d && d.axis; };

	// Wraps SVG text	
	// modification of: http://bl.ocks.org/mbostock/7555321
	function wrap(text, width) {
	  text.each(function(d, i, j) {
		var text = d3.select(this);
		var words = d.axis.split(/\s+/).reverse();
		var word;
		var line = [];
		var lineNumber = 0;
		var lineHeight = 1.4; // ems
      var x = calcX(null, options.circles.labelFactor, j);
      var y = calcY(null, options.circles.labelFactor, j);
	   var dy = parseFloat(text.attr("dy"));
		var tspan = text.text(null).append("tspan").attr("dy", dy + "em");

		while (word = words.pop()) {
		   line.push(word);
		   tspan.text(line.join(" "));
		   if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		   }
		}
	  });
	}

   window.addEventListener( 'resize', scaleChart, false );

   function scaleChart() {
      if (!options.resize || !dom_parent) return;
      var width_offset = dom_parent.node().getBoundingClientRect().left;
      var height_offset = dom_parent.node().getBoundingClientRect().top;
      var width = Math.min(options.widthMax, document.documentElement.clientWidth - width_offset);
      var height = Math.min(options.heightMax, document.documentElement.clientHeight - height_offset);
      options.height = height;
      options.width = width;
      chart.update();
   }

   return chart;

}

var UUID = (function() {
  var self = {};
  var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
  self.generate = function() {
    var d0 = Math.random()*0xffffffff|0;
    var d1 = Math.random()*0xffffffff|0;
    var d2 = Math.random()*0xffffffff|0;
    var d3 = Math.random()*0xffffffff|0;
    return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
      lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
      lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
      lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
  }
  return self;
})();
(function() {

  horizonChart = function() {

     var update;
     var data;
     var sdata = [];
     var options = {
         id:         0,
         width:      960,     
         height:     100,
         position: { x: 0, y: 0 },
         elements: { brush: false },
         display:  {
            ppp:              undefined,     // pixels per point
            bands:            1,
            mode:             'mirror',
            orientation:      'horizontal',
            transition_time:  0,
            interpolate:      'basis',
        },
        bounds: { vRangeMax: undefined }
     }

    var color = d3.scale.linear()
        .domain([-options.display.bands, 0, 0, options.display.bands])
        .range(["#08519c", "#bdd7e7", "#bae4b3", "#006d2c"]);

    var events = {
       'update':  { 'begin': null, 'end': null },
       'chart':   { 'click': null },
       'path':    { 'mouseover': null, 'mouseout': null },
       'xlink':   { 'click': null },
       'brush' :  { 'update': null }
    };

    function chart(selection) {
       selection.each(function() {
          var root = d3.select(this).append('svg:g') 
            .attr('class', 'hcc')
            .append("a")

          update = function() {
             var horizontal = options.display.orientation == 'horizontal' ? true : false;
             var band_range = horizontal ? options.height : options.width;
             var ppp = options.display.ppp ? options.display.ppp : band_range / sdata.length;
             var zwidth  = horizontal ? ppp * sdata.length : options.width;
             var zheight = horizontal ? options.height : ppp * sdata.length;

             root
                .attr("xlink:href", events.xlink.click)
                .attr('width', zwidth)
                .attr('height', zheight)
                .attr("transform", "translate(" + +options.position.x + "," + +options.position.y + ")")
                .on('click', function() { if (events.chart.click) events.chart.click(data); })

             var xExtent = d3.extent(sdata.map(function(d) { return d[0]; }));
             var yExtent = d3.extent(sdata.map(function(d) { return d[1]; }));

             var x = d3.scale.linear()
                .domain(xExtent)
                .range([0, ppp * sdata.length]);

             var y = d3.scale.linear()
                .domain([0, options.bounds.vRangeMax ? options.bounds.vRangeMax : yExtent[1]])
                .range([0, band_range * options.display.bands]);

             if (horizontal) {
                var transform = (options.display.mode == "offset")
                     ? function(d) { return "translate(0, " + (d + (d < 0) - options.display.bands) * band_range + ")"; }
                     : function(d) { return (d < 0 ? "scale(1,-1)" : "") + "translate(0, " + (d - options.display.bands) * band_range + ")"; };
             } else {
                var transform = (options.display.mode == "offset")
                     ? function(d) { return "translate(" + (d + (d < 0) - options.display.bands) * band_range + ", 0)"; }
                     : function(d) { return (d < 0 ? "scale(-1,1)" : "") + "translate(" + (d - options.display.bands) * band_range + ", 0)"; };
             }

             var defs = root.selectAll("defs")
                .data([null]);

             defs.enter()
               .append("defs")
               .append("clipPath")
               .attr("id", "horizon_clip" + options.id)
               .append("rect")
               .attr("width", zwidth)
               .attr("height", zheight);

             defs.select("rect")
               .transition().duration(options.display.transition_time)
               .attr("width", zwidth)
               .attr("height", zheight);

             root.selectAll("g")
                .data([null])
               .enter().append("g")
                .attr("clip-path", "url(#horizon_clip" + options.id + ")");

             var path = root.select("g").selectAll("path")
                   .data(d3.range(-1, -options.display.bands - 1, -1).concat(d3.range(1, options.display.bands + 1)), Number);

             if (horizontal) {
                var horizonArea = d3.svg.area()
                   .interpolate(options.display.interpolate)
                   .x(function(d) { return x(d[0]); })
                   .y0(band_range * options.display.bands)
                   .y1(function(d) { return band_range * options.display.bands - y(d[1]); })
                   (sdata);
             } else {
                var horizonArea = d3.svg.area()
                   .interpolate(options.display.interpolate)
                   .y(function(d) { return x(d[0]); })
                   .x0(band_range * options.display.bands)
                   .x1(function(d) { return band_range * options.display.bands - y(d[1]); })
                   (sdata);
             }

             path.enter().append("path")
                .style("fill", color)
                .attr("transform", transform)
                .attr("d", horizonArea);

             path.exit().remove()

             path
                // .on('mouseover', function(d, i) { if (events.path.mouseover) events.path.mouseover(d, i, this); } )
                .on('mouseover', function() { if (events.path.mouseover) events.path.mouseover(data); } )
                .on('mouseout', function(d, i) { if (events.path.mouseout) events.path.mouseout(d, i, this); } )
                .transition().duration(options.display.transition_time)
                .style("fill", color)
                .attr("transform", transform)
                .attr("d", horizonArea)
    
             if (options.elements.brush) {
                var x1 = d3.scale.linear() 
                   .domain(xExtent)
                   .range([0, zwidth])
                var x2 = d3.scale.linear() 
                   .domain(x1.domain())
                   .range([0, zwidth])
    
                var brush = d3.svg.brush().x(x2).on("brush", brushed);
    
                root.append("g")
                    .attr("class", "brush" + options.id)
                    .style({
                       'stroke':            '#fff',
                       'fill-opacity':      .125,
                       'shape-rendering':   'crispEdges'
                    })
                    .call(brush)
                  .selectAll("rect")
                    .attr("y", -6)
                    .attr("height", options.height + 7);
        
                function brushed() {
                   x1.domain(brush.empty() ? x2.domain() : brush.extent());
                   var extent = brush.extent();
                }
             } else {
                root.select('.brush' + options.id).remove();
             }
          }
       });
    }

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
    }

    function keyWalk(valuesObject, optionsObject) {
        if (!valuesObject || !optionsObject) return;
        var vKeys = Object.keys(valuesObject);
        var oKeys = Object.keys(optionsObject);
        for (var k=0; k < vKeys.length; k++) {
           if (oKeys.indexOf(vKeys[k]) >= 0) {
              var oo = optionsObject[vKeys[k]];
              var vo = valuesObject[vKeys[k]];
              if (typeof oo == 'object' && typeof vo !== 'function' && oo && oo.constructor !== Array) {
                 keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
              } else {
                 optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
              }
           }
        }
    }

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return options.width;
        options.width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        return chart;
    };
 
    chart.data = function(values) {
       if (!arguments.length) return data;
       if ( values.constructor === Function ) { data = values; }
       return chart;
    }

    chart.sdata = function(values) {
       if (!arguments.length) return sdata;
       if ( values.constructor === Array ) { sdata = values; }
       return chart;
    }

    chart.update = function(opts) {
      if (events.update.begin) events.update.begin(); 
      if (typeof update === 'function') update(opts);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
    }

    chart.bands = function(bands) {
      if (!arguments.length) return options.display.bands;
      options.display.bands = +bands;
      color.domain([-options.display.bands, 0, 0, options.display.bands]);
      return chart;
    };

    chart.mode = function(mode) {
      if (!arguments.length) return options.display.mode;
      options.display.mode = mode + "";
      return chart;
    };

    chart.duration = function(transition_time) {
      if (!arguments.length) return options.display.transition_time;
      options.display.transition_time = +transition_time;
      return chart;
    };

    chart.orientation = function(orientation) {
      if (!arguments.length) return options.display.orientation;
      options.display.orientation = orientation + "";
      return chart;
    };

    chart.colors = function(color_range) {
      if (!arguments.length) return color.range();
      color.domain([-options.display.bands, 0, 0, options.display.bands]);
      color.range(color_range);
      return chart;
    };

    return chart;
  };

})();
(function() {

   ptsHorizonGroup = function() {
      var data = [];
      var update;

      var options = {
          id:         0,
          width:      900,     
          height:     80,
          margins:  { spacing: 10 },
          display:  {
             ppp:             undefined,     // pixels per point
             bands:           3,
             mode:            'mirror',
             orientation:     'horizontal',
             transition_time: 1000,
             interpolate:     'basis',
             sizeToFit:       false
         },
         bounds: { vRangeMax: 24 },
         color: {
            range: ["#6b6ecf", "#f0f0f0", "#f0f0f0", "#a55194"]
         }
      }

      var events = {
         'update':  { 'begin': null, 'end': null }
      };

      function chart(selection) {
       selection.each(function() {

         var root = selection.append('div').attr('id', 'ptsHorizonGroup' + options.id)

         update = function(opts) {
            selection.each(function() {

               if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
                  var dims = selection.node().getBoundingClientRect();
                  if (horizontal) {
                     options.width = Math.max(dims.width, 100);
                  } else {
                     options.height = Math.max(dims.height, 80);
                  }
               }

               root.selectAll('.hz' + options.id).remove();

               data.forEach(function(d, i) {
                  var container = root
                     .append('div')
                     .attr('class', 'flex-chart-group hz' + options.id)
                     .attr('id', 'hz' + options.id + 'x' + i);

                  var score = d.horizon.data().score();
                  var legend = score.winner + ' d. ' + score.loser;
                  var meta = d.horizon.data().metadata();
                  var match_score = d.horizon.data().score().match_score;
                  var display = meta.tournament.round + ': ' + match_score;
              
                  container
                     .append('div')
                     .attr('class', 'flex-h-score')
                     .append('p')
                     .text(d.score)
                     .style("color", function() { return d.won ? 'green' : 'red'; })
                     .on('click', function() { 
                        // console.log(d.umo); 
                        // TODO: events.click to invoke clickMatch
                     })

                  container
                     .append('div')
                     .attr('class', 'flex-h-pts')
                     .call(d.horizon);

                  d.horizon.update();
               });
            });
         }
       });
      }

     // allows updating individual options and suboptions
     // while preserving state of other options
     chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
     }

     chart.events = function(functions) {
        if (!arguments.length) return events;
        keyWalk(functions, events);
        return chart;
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

     chart.data = function(dataset) {
       if (!arguments.length) return data;
       data = dataset;
       return chart;
     }

     chart.update = function(opts) {
       if (events.update.begin) events.update.begin(); 

       update(opts);

        setTimeout(function() { 
          if (events.update.end) events.update.end(); 
        }, options.display.transition_time);
     }

     // TODO: calculate the middle range colors
     chart.colors = function(colors) {
      if (!arguments.length) return [options.color.range[0], options.color.range[3]];
         options.color.range = [colors[0], '#f0f0f0', '#f0f0f0', colors[1]];
         // set colors for each chart in the group
         data.forEach(function(pHc) { pHc.colors(colors); });
         return chart;
      };

    return chart;
  };

  ptsHorizon = function() {
      var data;
      var update;
      var horizon_sets = [];

      var options = {
          id:         0,
          width:      900,     
          height:     80,
          margins:  { spacing: 10 },
          position: { x: 0, y: 0 },
          elements: { brush: true },
          display:  {
             ppp:             undefined,     // pixels per point
             bands:           3,
             mode:            'mirror',
             orientation:     'horizontal',
             transition_time: 1000,
             interpolate:     'basis',
             sizeToFit:       false
         },
         bounds: { vRangeMax: 24 },
         color: {
            range: ["#6b6ecf", "#f0f0fa", "#f6edf4", "#a55194"]
         }
      }

      var events = {
         update    : { 'begin': null, 'end': null },
         brush     : { 'brushing': null, 'start': null, 'end': null },
         chart     : { 'click': null },
         mouseover : undefined,
         mouseout  : undefined
      };

      function showMatch(d) {
         if (events.chart.click) { 
            events.chart.click({umo: d});   
         }
      }

      // prepare charts
      var horizon_charts = [];
      for (var s=0; s < 5; s++) {
         horizon_charts.push(horizonChart());
      }

      function chart(selection) {
       selection.each(function() {

         var dom_parent = d3.select(this);
         var root = dom_parent.append('svg').attr('id', 'ptsHorizon' + options.id)

         for (var s=0; s < 5; s++) {
            horizon_sets[s] = root.append("g").attr("id", "horizon" + options.id + s).style('display', 'none')
            horizon_sets[s]
               .call(horizon_charts[s]);
         }

         update = function(opts) {

            if (options.elements.brush) options.margins.spacing = 0;

            var horizontal = options.display.orientation == 'horizontal' ? true : false;

            if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
               var dims = dom_parent.node().getBoundingClientRect();
               if (horizontal) {
                  options.width = Math.max(dims.width, 100);
               } else {
                  options.height = Math.max(dims.height, 80);
               }
            }

            var set_map = setMap(data);

            // calculate pixels per point
            var num = set_map.map(function(m) { return m.length; }).reduce(function(a, b) { return a + b; });
            var ppp_range = horizontal ? options.width : options.height;
            var ppp = (ppp_range - (set_map.length * options.margins.spacing)) / num;

            root
               .attr('id', 'ptsHorizon' + options.id)
               .attr('width', options.width)
               .attr('height', options.height)

            var xadd = 0;
            var yadd = 0;
            for (var s=0; s < horizon_charts.length; s++) {
               if (set_map[s]) {
                  var sdata = set_map[s].map(function(m, i) { return [i + 1, m]; });
                  if (!sdata.length) continue;

                  horizon_charts[s]
                     .height(options.height)
                     .width(options.width)
                     .options({ 
                        id: options.id + 'c' + s, 
                        display: { ppp: ppp, bands: options.display.bands, orientation: options.display.orientation },
                        position: { 
                           x: options.position.x + xadd, 
                           y: options.position.y + yadd
                        },
                        bounds: { vRangeMax: options.bounds.vRangeMax }
                     })
                     .events({
                        chart: { click: showMatch }, 
                        path: { 
                           mouseover: options.elements.brush ? undefined : events.mouseover, 
                           mouseout: options.elements.brush ? undefined : events.mouseout 
                        }
                     })
                     .duration(options.display.transition_time)
                     .colors(options.color.range)
                     .mode(options.display.mode)
                     .data(data)
                     .sdata(sdata)
                     .update()

                  if (options.display.orientation == 'horizontal') {
                     xadd += ppp * set_map[s].length + options.margins.spacing;
                  } else {
                     yadd += ppp * set_map[s].length + options.margins.spacing;
                  }

                  horizon_sets[s].style('display', 'inline')

               } else {
                  horizon_sets[s].style('display', 'none')
               }
            }

            if (options.elements.brush) {
               var x1 = d3.scale.linear() 
                  .domain([0, num])
                  .range([0, options.width])
               var x2 = d3.scale.linear() 
                  .domain(x1.domain())
                  .range([0, options.width])
   
               var brush = d3.svg.brush().x(x2)
                  .on("brush", brushing)
                  .on("brushstart", brushStart)
                  .on("brushend", brushEnd)
  
               var brushes = root.selectAll('.brush' + options.id)
               brushes.remove();

               root.append("g")
                   .attr("class", "brush" + options.id)
                   .style({
                      'stroke':            '#fff',
                      'fill-opacity':      .125,
                      'shape-rendering':   'crispEdges'
                   })
                   .call(brush)
                 .selectAll("rect")
                   .attr("y", -6)
                   .attr("height", options.height + 7);
       
               function brushing() {
                  x1.domain(brush.empty() ? x2.domain() : brush.extent());
                  if (events.brush.brushing) events.brush.brushing(brush.extent());
               }
               function brushStart() {
                  x1.domain(brush.empty() ? x2.domain() : brush.extent());
                  if (events.brush.start) events.brush.start(brush.extent());
               }
               function brushEnd() {
                  x1.domain(brush.empty() ? x2.domain() : brush.extent());
                  if (events.brush.end) events.brush.end(brush.extent());
               }
            } else {
               root.select('.brush' + options.id).remove();
            }
         }

         function setMap(md) {
            var z1 = [];
            var z2 = [];

            var sets = md.sets();
            for (var s=0; s < sets.length; s++) {
               z1 = z1.concat(sets[s].player_data()[0].map(function(m) { return m.pts }));
               z2 = z2.concat(sets[s].player_data()[1].map(function(m) { return m.pts }));
            }
            gai = function(arr, val) { 
               return arr.reduce(function(a, e, i) { if (e === val) a.push(i); return a; }, []); 
            }
            var set_ends = gai(z1, 0).concat(gai(z2, 0));
            set_ends.sort(function(a, b){return a-b});

            // fix for sets that end early
            if (set_ends.indexOf(z1.length - 1) < 0) set_ends.push(z1.length - 1);

            var diff = z1.map(function(m, i) { return m - z2[i]; });
            var sm = set_ends.map(function(m, i) {
               return diff.slice(i == 0 ? 0 : set_ends[i - 1] + 1, m + 1);
            });

            return sm;
         }
       });
      }

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
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

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return options.width;
        options.width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        return chart;
    };
 
    chart.data = function(umo) {
       if (!arguments.length) return data;
       data = umo;
       return chart;
    }

    chart.update = function(opts) {
      if (events.update.begin) events.update.begin(); 
      if (typeof update === 'function') update(opts);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
    }

    chart.bands = function(bands) {
      if (!arguments.length) return options.display.bands;
      options.display.bands = +bands;
      return chart;
    };

    chart.mode = function(mode) {
      if (!arguments.length) return options.display.mode;
      options.display.mode = mode + "";
      return chart;
    };

    chart.duration = function(transition_time) {
      if (!arguments.length) return options.display.transition_time;
      options.display.transition_time = +transition_time;
      return chart;
    };

    chart.orientation = function(orientation) {
      if (!arguments.length) return options.display.orientation;
      options.display.orientation = orientation + "";
      return chart;
    };

    chart.colors = function(colors) {
      if (!arguments.length) return [options.color.range[0], options.color.range[3]];
      options.color.range = [colors[0], '#f0f0f0', '#f0f0f0', colors[1]];
      return chart;
    };

    return chart;
  };

  /*
  // ttip element needs to be exist in HTML and scoped variable defined
  function ttip_hide() { 
      ttip.transition().duration(500).style("opacity", 0) 
   }

   function ttip_show(d) {
      var x_offset = 30;
      var y_offset = 60;
      ttip.style('font', '12px sans-serif');
      ttip.style('width', '230px');
      var score = d.score().match_score; 
      var players = d.players();
      if (score) {
         ttip.transition() .duration(200).style("opacity", .7);    
         ttip.html( players[0] + ' v. ' + players[1] + '<br>' + score )     
            .style("left", (d3.event.pageX - x_offset) + "px")             
            .style("top", (d3.event.pageY - y_offset) + "px");
      }
   }
   */

})();
function ladderChart() {

    var data;
    var dom_parent;
    var plot_width;
    var plot_height;
    var update;

    var options = {
        id: 'ladderChart',
        width: window.innerWidth,
        height: window.innerHeight,
        margins: {
           top:    30, bottom: 10, 
           left:   15, right:  10
        },
        data: {
           contextAttribute:  undefined,
           calculateDomain:   true,
           oneYearMinimum:    false,
           fullYearsOnly:     false
        },
        plot: {
           title: {
              x:        40,
              y:        15,
              fill:     '#74736c', 
              fontSize: 26,
              text:     undefined
           },
           source: {
              text:     undefined,
           },
           footnote: {
              fill:     '#74736c', 
              fontSize: 20,
              text:     undefined
           },
           margins: {
              top:     0, bottom: 12, 
              left:   25, right:  10
           },
           dateDomain: {
              start:  new Date(new Date().getFullYear(), 0, 1),
              end:    new Date(new Date().getFullYear(), 11, 31)
           },
           content: {
              rows: []
           },
           color: {
              default: '#b3b3cc'
           },
           yAxis: {
              fontSize:    18,
           },
           xAxis: {
              maxTicks:    10,
              fontSize:    24,
              fontWeight:  400
           },
           connector: {
              fill:     'none',
              stroke:   '#a7a59b',
              opacity:  0.6,
              width:    2
           },
           shape: {
              opacity:        0.7,
              dateKey:        'date',
              rungKey:        'rung',

              colorKey:       undefined, // value attribute to determine color
              sizeKey:        undefined, // value attribute to determine shape size
              shapeSizeBase:  undefined, // divisor for value given by sizeKey attribute

              typeKey:        undefined, // values attribute to determine shape type
              typeRange:      [],
              typeDomain:     []
           }
        },
       display: {
          transition_time: 0,
          settingsImg: false,
          helpImg:     false,
          sizeToFit:   true
       },
    };

    var superShapes = [
       "asterisk","bean","butterfly","circle","clover", "cloverFour",
       "cross","diamond","drop","ellipse", "gear","heart","heptagon",
       "hexagon","malteseCross", "pentagon","rectangle","roundedStar",
       "square","star","triangle"
    ];
 
    var default_colors = { default: "#b3b3cc" };
    var colors = JSON.parse(JSON.stringify(default_colors));

    var events = {
       'settings': { 'click': null },
       'help':    { 'click': null },
       'update':  { 'begin': null, 'end': null },
       'item':    { 'mouseover': null, 'mouseout': null, 'click': null },
       'axis':    { 'x': { 'click': null }, 'y': {'click': null } },
       'title':   { 'click': null }
    };

    function chart(selection) {
        selection.each(function () {
            dom_parent = d3.select(this);

            var root = dom_parent.append('svg')
                .attr('class', 'itemCalendar')

            var frame = root.append('rect');
            var chartHolder = root.append('g')
               .attr({
                  'class':'chartHolder',
                  'transform':'translate(0,0)'
               });

            var help;
            var settings;

            var hoverFrame = root.append('svg').attr('class','hoverFrame');

            var calendarPlot = chartHolder.append("g")
                  .attr("class", "calendarPlot");
            var connector = calendarPlot.append('path.connector');

            var xAxis = calendarPlot.append('g.axis.x');
            var yAxis = calendarPlot.append('g.axis.y');
            var xLine = calendarPlot.append("line")
            var yLine = calendarPlot.append("line")
            var legends = chartHolder.append('g.legends');
            var title = legends.append('text.title');
            var footnote = legends.append('text.footnote');

            update = function(opts) {

               var nodata = (!data.values.length);

               root
                  .on('mouseover', showImgs)
                  .on('mouseout', hideImgs);

               if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
                  var dims = dom_parent.node().getBoundingClientRect();
                  options.width = Math.max(dims.width, 300);
                  options.height = Math.min(Math.max(options.width / 3, 100), 200);
               }

               if (nodata || !options.data.calculateDomain) {
                  var dateDomain = [options.plot.dateDomain.start, options.plot.dateDomain.end];
               } else {
                  var dateDomain = d3.extent(data.values.map(function(m) { return m[options.plot.shape.dateKey]; }));
                  var total_days = daysBetween(dateDomain[0], dateDomain[1]);
                  var new_start = new Date(dateDomain[0].getFullYear(), 0, 1);
                  var new_end   = new Date(dateDomain[1].getFullYear(), 11, 31);
                  if (options.data.fullYearsOnly) {
                     dateDomain = [new_start, new_end];
                  } else if (options.data.oneYearMinimum && total_days < 365) {
                     var start_distance = daysBetween(new_start, dateDomain[0]);
                     var end_distance   = daysBetween(dateDomain[1], new_end);
                     if (start_distance < end_distance && total_days + start_distance >= 365) {
                        dateDomain = [new_start, dateDomain[1]];
                     } else if (total_days + end_distance >= 365) {
                        dateDomain = [dateDomain[0], new_end];
                     } else {
                        dateDomain = [new_start, new_end];
                     }
                  }
               }

               // if greater than a year, only use year ticks, otherwise months
               var yearSpan = yearsBetween(dateDomain[0], dateDomain[1]);
               var xTicks = yearSpan > 1 ? '%Y' : '%b';

               var numTicks;
               if (yearSpan <= 1) {
                  numTicks = options.plot.xAxis.maxTicks;
               } else if (yearSpan > 2) {
                  numTicks = Math.min(yearSpan, options.plot.xAxis.maxTicks);
               } else {
                  numTicks = 2;
               }

               plot_width  = options.width  - (options.margins.left + options.margins.right);
               plot_height = options.height - (options.margins.top + options.margins.bottom);

               var ladderScale = d3.scale.ordinal()
                  .range(options.plot.content.rows)
                  .domain(d3.range(0, options.plot.content.rows.length, 1));

               var xScale = d3.time.scale()
                    .range([options.plot.margins.left, plot_width - options.plot.margins.right])
                    .domain(dateDomain);

               var axisX = d3.svg.axis()
                   .orient("bottom")
                   .ticks(numTicks)
                   .tickSize(-plot_height)
                   .tickFormat(d3.time.format(xTicks))
                   .scale(xScale);

               var yScale = d3.scale.linear()
                   .range([plot_height - options.plot.margins.bottom, options.plot.margins.top])
                   .domain([0,options.plot.content.rows.length - 1]);

               var axisY = d3.svg.axis()
                   .orient("left")
                   .ticks(options.plot.content.rows.length)
                   .tickSize(-plot_width, 0, 0)
                   .tickFormat(ladderScale)
                   .scale(yScale);

               root
                  .attr({
                     'width':    options.width  + 'px',
                     'height':   options.height + 'px'
                  });

               frame
                  .attr({
                      'class': 'frame',
                      x:      options.margins.left,
                      y:      0,
                      width:  options.width - (options.margins.left + options.margins.right) + 'px',
                      height: options.height + 'px'
                  })
                  .style({ fill: 'white' });

               footnote
                  .style({ 
                     'fill':        options.plot.footnote.fill, 
                     'font-size':   scaleFont(options.plot.footnote.fontSize, plot_width) + 'px'
                  })
                  .html(function() { if (options.plot.source.text) return 'Source: ' + options.plot.source.text; })
                  .attr({
                     'class': 'footnote',
                     'x':     function() {
                                 // TODO: figure out why this isn't working in this context
                                 // does it have something to do with Bootstrap?
                                 // return options.width - options.margins.right - this.getComputedTextLength();
                                 return options.width - options.margins.right - 80;
                              },
                     'y':     options.height
                  })

               calendarPlot
                  .attr({
                      "transform":  'translate(' + options.margins.left + ',' + options.margins.top + ')'
                  });

               xAxis
                   .translate([0, plot_height - options.plot.margins.bottom])
                   .call(axisX);

               xLine
                   .attr('stroke', 'black')
                   .attr('x1', 0)
                   .attr('x2', plot_width)
                   .attr('y1', plot_height - options.plot.margins.bottom)
                   .attr('y2', plot_height - options.plot.margins.bottom)

               yAxis
                   .translate([options.plot.margins.left, 0])
                   .call(axisY);

               yLine
                   .attr('stroke', 'black')
                   .attr('x1', options.plot.margins.left)
                   .attr('x2', options.plot.margins.left)
                   .attr('y1', plot_height - options.plot.margins.bottom)
                   .attr('y2', options.plot.margins.top)

               calendarPlot.selectAll('.axis.y .tick line')
                  .attr({ dy:'-2' })
                  .style({ 
                     stroke: '#cec6b9',
                     'stroke-dasharray': '2 2'
                  });

               calendarPlot.selectAll('.axis.y .tick text')
                  .attr({ dy:'-2' })
                  .style({ 
                     'fill':        '#74736c',
                  })
                  .on('click', function(d, i) { 
                     if (events.axis.y.click) {
                        events.axis.y.click(d, i);
                        // function to unhighlight if clicked twice
                        // and to return each time a list of all highlighted ticks
                        // d3.select(this).attr('font-weight', 'bold');
                     }
                  });

               calendarPlot.selectAll('.axis.x .tick line')
                   .style({
                       stroke: '#cec6b9',
                       'stroke-dasharray': '2 2'
                   })

               calendarPlot.selectAll('.axis.x .tick text')
                  .attr({ dx:'1' })
                  .style({
                     'font-weight': options.plot.xAxis.fontWeight,
                     'fill':        '#74736c'
                  })
                  .on('click', function(d, i) { 
                     var years = dateDomain[1].getFullYear() - dateDomain[0].getFullYear();
                     if (events.axis.x.click) events.axis.x.click(d, years);
                  });

               calendarPlot.selectAll('.axis.y .tick line')
                  .translate([-(options.plot.margins.left), 0]);
               calendarPlot.selectAll('.axis.x .tick line')
                  .translate([0, options.plot.margins.right]);

               calendarPlot.selectAll('g.axis path.domain')
                  .style('display', 'none');

               title
                  .attr({ 
                     x: options.plot.title.x, 
                     y: options.plot.title.y
                  })
                  .style({ 
                     'fill':        options.plot.title.fill, 
                     'font-size':   scaleFont(options.plot.title.fontSize, plot_width) + 'px'
                  })
                  .on('click', function() { 
                     if (events.title.click) events.title.click();
                  })
                  .html(function(d) { 
                     var years = [dateDomain[0].getFullYear(), dateDomain[1].getFullYear()]
                        .filter(function(item, i, self) { return self.lastIndexOf(item) == i; })
                        .join(' - ');
                     if (options.plot.title.text) return options.plot.title.text + ' ' + years;
                  });

               var line = d3.svg.line()
                  .interpolate("step-after")
                  .x(function(d) { return xScale(d[options.plot.shape.dateKey]); })
                  .y(function(d) { return yScale(d[options.plot.shape.rungKey]); });

               connector
                  .transition().duration(options.display.transition_time)
                  .attr({ 
                     'class': 'itemConnector',
                     d: line(data.values) 
                  })
                  .style({
                    fill:              options.plot.connector.fill,
                    stroke:            options.plot.connector.stroke,
                    'stroke-opacity':  options.plot.connector.opacity,
                    'stroke-width':    options.plot.connector.width
                  });

               if (d3.superformula) {
                  var shapeSelector = d3.scale.ordinal()
                     .range(options.plot.shape.typeRange)
                     .domain(options.plot.shape.typeDomain);

                  var shape = d3.superformula()
                     .type(function(d) { 
                        var item_shape = shapeSelector(d[options.plot.shape.typeKey]); 
                        return item_shape && superShapes.indexOf(item_shape) >= 0 ? item_shape : 'circle';
                     })
                     .size(shapeSize)
                     .segments(360);
               }

               var item_shapes = calendarPlot.selectAll('.itemDate')
                  .data(data.values);

               item_shapes.enter()
                  .append(shape ? 'path' : 'circle')
                  .translate(function(d) { return [xScale(d[options.plot.shape.dateKey]), yScale(d[options.plot.shape.rungKey])]; })
                  .style({
                    'opacity':      0,
                    'fill-opacity': 0,
                    'stroke':       shapeColor,
                    'stroke-width': 1
                  })
                  .attr({
                    fill:  shapeColor,
                    class: 'itemDate',
                    r:     circleRadius,
                    d:     shape
                  })

               item_shapes.exit()
                  .transition().duration(options.display.transition_time)
                  .style({
                     'opacity': 0,
                     'fill-opacity': 0
                  })
                  .remove();

               item_shapes
                  // transition not working for some reason !?!
                  // .transition().duration(options.display.transition_time)
                  .translate(function(d) { return [xScale(d[options.plot.shape.dateKey]), yScale(d[options.plot.shape.rungKey])]; })
                  .attr({
                    id:    function(d) { 
                       var id = options.data.contextAttribute ? d[options.data.contextAttribute] : '';
                       return 'itemDate' + id 
                    },
                    r:     circleRadius,
                    d:     shape
                  })
                  .style({
                    'fill':         shapeColor,
                    'opacity':      options.plot.shape.opacity,
                    'fill-opacity': options.plot.shape.opacity,
                    'stroke':       shapeColor,
                    'stroke-width': 1
                  })
                  .on('mouseover', events.item.mouseover)
                  .on('mouseout', events.item.mouseout)
                  .on('click', events.item.click);

               calendarPlot.select('.axis.y').selectAll('text')
                  .style( { 'font-size':   scaleFont(options.plot.yAxis.fontSize, plot_width) + 'px', })

               calendarPlot.select('.axis.x').selectAll('text')
                  .style( { 'font-size':   scaleFont(options.plot.xAxis.fontSize, plot_width) + 'px', })

               if (options.display.helpImg) {
                  help = hoverFrame.selectAll('image')
                     .data([0])

                  help.enter()
                    .append('image')
                    .attr('class', 'help')
                    .on('click', function() { if (events.help.click) events.help.click(options.id); }) 

                  help.exit().remove();

                  help
                     .attr({
                        'xlink:href': options.display.helpImg,
                        'x': plot_width - 10, 
                        'y': 0,
                        'height': '20px',
                        'width':  '20px',
                        'opacity': 0
                     })

               } else {
                  hoverFrame.selectAll('image.help').remove();
               }

               function showImgs() {
                  if (options.display.helpImg) help.attr('opacity', 1);
               }

               function hideImgs() {
                  if (options.display.helpImg) help.attr('opacity', 0);
               }
            }

        });
    }

    function circleRadius(d) {
       var sizeFactor = d[options.plot.shape.sizeKey];
       var sizeBase = options.plot.shape.shapeSizeBase * 2;
       return sizeFactor && sizeBase ? Math.sqrt(sizeFactor * plot_width / sizeBase) : 10;
    }

    function shapeSize(d) {
       var sizeFactor = d[options.plot.shape.sizeKey];
       var sizeBase = options.plot.shape.shapeSizeBase;
       return sizeFactor && sizeBase ? sizeFactor * plot_width / sizeBase : plot_width / 3;
    }

    function shapeColor(d) {
       var color = d[options.plot.shape.colorKey];
       return color && colors[color] ? colors[color] : options.plot.color.default;
    }

    // ACCESSORS

    chart.exports = function() {
       return { circleRadius: circleRadius, shapeSize: shapeSize, shapeColor: shapeColor, root: dom_parent }
    }

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
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

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return options.width;
        options.width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        return chart;
    };

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        return chart;
    };

    chart.update = function(opts) {
      if (events.update.begin) events.update.begin(); 
      if (typeof update === 'function' && data) update(opts);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
    }

    chart.colors = function(color3s) {
        if (!arguments.length) return colors;
        if (typeof color3s !== 'object') return false;
        var keys = Object.keys(color3s);        
        if (!keys.length) return false;
        // remove all properties that are not colors
        keys.forEach(function(f) { if (! /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color3s[f])) delete color3s[f]; })
        if (Object.keys(color3s).length) {
           colors = color3s;
        } else {
           colors = JSON.parse(JSON.stringify(default_colors));
        }
        return chart;
    }

    function daysBetween(one, another) {
       return Math.round(Math.abs((+one) - (+another))/8.64e7);
    }

    function yearsBetween(one, another) {
       return Math.round(Math.abs((+one) - (+another))/(365 * 8.64e7));
    }

    function scaleFont(font_size, width) {
       var fontScale = d3.scale.linear();
       fontScale.domain([0, 2000]).range([5, font_size]);
       return fontScale(width);
    }

   return chart;
}
// NOTES:
// '_context_' is a reserved data attribute for passing object related to data origins

function pCoords() {

    var data = [];
    var dom_parent;
    var plot_width;
    var plot_height;
    var update;

    var s_color = d3.scale.category10();
    var color_scale = d3.scale.quantize()
       .range([ "#33cccc", "#66CD00", "#db3e3e", "#235dba", ]);

    var drag_data = {};

    var options = {
        id: 'pCoords',
        width: window.innerWidth,
        height: window.innerHeight,
        margins: {
           top:    30, bottom: 30, 
           left:   10, right:  10
        },
        data: {
           hide: [],
           scales: {}
        },
        plot: {
           lines: {
              opacity:  0.5,
              colorKey: undefined
           },
           color: {
              default: '#b3b3cc'
           },
           xAxis: {
              rotate:      0,
              fontSize:    20,
              fontWeight:  400
           },
        },
       display: {
          transition_time: 0,
          settingsImg: false,
          helpImg:     false,
          sizeToFit:   true
       },
    };

    var default_colors = { default: "#b3b3cc" };
    var colors = JSON.parse(JSON.stringify(default_colors));

    var events = {
       'settings': { 'click': null },
       'help':    { 'click': null },
       'update':  { 'begin': null, 'end': null },
       'lines':   { 'click': null, 'mouseover': null, 'mouseout': null },
       'item':    { 'mouseover': null, 'mouseout': null, 'click': null },
       'brush':   { 'start': null, 'brushed': null, 'end': null, 'clear': null },
       'axis':    { 'x': { 'click': null }, 'y': {'click': null } },
    };

    var root;
    var lines;
    var axis_brushes;
    var axesX;
    var axesY;
    var click_check;
    var sorted_dimensions;
    var dimensions;

    function chart(selection) {
        selection.each(function () {
            dom_parent = d3.select(this);

            root = dom_parent.append('svg')
                .attr('class', 'pCoords')

            var chartHolder = root.append('g')
               .attr({
                  'class':'chartHolder',
                  'transform':'translate(0,0)'
               });

            var help;
            var settings;

            var hoverFrame = root.append('svg')
                .attr({ 'class':'hoverFrame', });

            var coordsPlot = chartHolder.append("g")
                  .attr("class", "coordsPlot");

            var background = coordsPlot.append("g")
            var foreground = coordsPlot.append("g")

            update = function(opts) {

               if (!data.length) { return; }

               color_scale
                  .domain([0, data.length])

               root
                  .on('mouseover', showImgs)
                  .on('mouseout', hideImgs);

               if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
                  var dims = dom_parent.node().getBoundingClientRect();
                  options.width = Math.max(dims.width, 300);
                  options.height = Math.min(Math.max(options.width / 3, 100), 250);
               }

               plot_width  = options.width  - (options.margins.left + options.margins.right);
               plot_height = options.height - (options.margins.top + options.margins.bottom);

               root
                  .attr({
                     'width':    options.width  + 'px',
                     'height':   options.height + 'px'
                  });

               chartHolder
                  .attr({
                     'width':    plot_width  + 'px',
                     'height':   plot_height + 'px',
                      "transform":  'translate(' + options.margins.left + ',' + options.margins.top + ')'
                  });

               coordsPlot
                  .attr({
                     'width':    plot_width  + 'px',
                     'height':   plot_height + 'px',
                  });

               axesX = d3.scale.ordinal().rangePoints([0, plot_width], 1);
               dimensions = getDimensions();

               if (sorted_dimensions) {
                  var ordered_dimensions = [];

                  // deal with situation where dimensions may have been hidden or unhidden
                  sorted_dimensions.forEach(function(dimension) {
                     // first add all sorted dimensions that are present in dimensions.x
                     if (dimensions.x.indexOf(dimension) >= 0) ordered_dimensions.push(dimension);
                  });
                  dimensions.x.forEach(function(dimension) {
                     // now add all dimensions from dimensions.x that weren't present in dimensions.x
                     if (ordered_dimensions.indexOf(dimension) < 0) ordered_dimensions.push(dimension);
                  });
                  dimensions.x = ordered_dimensions;
               }

               axesY = dimensions.y;
               axesX.domain(dimensions.x);

               var pcoord_line = d3.svg.line().interpolate("cardinal");
               var num_axis = d3.svg.axis().orient("left");
               var text_axis = d3.svg.axis().orient("left");

              // Add grey background lines for context.
               var o_lines = background.selectAll("path")
                  .data(data)

               o_lines.enter()
                  .append("path")
                  .attr("class", "o_line")

               o_lines.exit()
                  .remove();

               o_lines
                  .attr({
                     "fill": "none",
                     "stroke": "#ddd",
                     "stroke-opacity": .3,
                     "stroke-width": 1.5,
                     "d": path,
                  })
                  .style({
                     "shape-rendering": "crispEdges",
                  });


               // Add lines.
               lines = foreground.selectAll("path")
                  .data(data)
               lines.enter()
                  .append("path")
                  .attr('class', 'pc_line')
               lines.exit()
                  .remove();
               lines
                  .attr({
                     "id": function(d, i) { return 'm' + 'idx' + i},
                     "d": path,
                  })
                  .style({
                     "fill": "none",
                     "stroke-opacity": options.plot.lines.opacity, 
                     "stroke": function(d, i) { return line_color(d, i) },
                     "stroke-width": 1.5,
                  })
                  .on('click', function(d, i) { 
                     if (events.lines.click) events.lines.click({ d: d, i: i });
                  })
                  .on('mouseover', function(d, i) { 
                     if (events.lines.mouseover) { events.lines.mouseover({ d: d, i: i }); }
                     d3.select(this).style('stroke', 'yellow');
                  })
                  .on('mouseout', function(d, i)  { 
                     if (events.lines.mouseout) events.lines.mouseout({ d: d, i: i });
                     d3.select(this).style('stroke', line_color(d, i)) 
                  });

               // Add a group element for each dimension.
               var dmz = coordsPlot.selectAll(".cpDimension")
                    .data(dimensions.x);

               dmz.enter().append("g")
                  .attr("class", "cpDimension")
               dmz.exit()
                  .remove();
               dmz
                  .attr("transform", function(d) { return "translate(" + axesX(d) + ")"; })
                  .call(d3.behavior.drag()
                    .origin(function(d) { return {x: axesX(d)}; })
                    .on("dragstart", function(d) {
                       drag_data[d] = axesX(d);
                       o_lines.attr("visibility", "hidden");
                    })
                    .on("drag", function(d) {
                       drag_data[d] = Math.min(plot_width, Math.max(0, d3.event.x));
                       lines.attr("d", path);
                       dimensions.x.sort(function(a, b) { return position(a) - position(b); });
                       axesX.domain(dimensions.x);
                       dmz.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
                    })
                    .on("dragend", function(d) {
                       sorted_dimensions = dimensions.x.slice();
                       delete drag_data[d];
                       transition(d3.select(this)).attr("transform", "translate(" + axesX(d) + ")");
                       transition(lines).attr("d", path);

                       o_lines
                         .attr("d", path)
                         .transition()
                         .attr("visibility", null);

                    }));

               dmz.exit()
                  .remove();

               // TODO: fontScale can also have something to do with the # of dimensions
               var fontScale = d3.scale.linear();
               fontScale.domain([0, 2000]).range([0, options.plot.xAxis.fontSize]);

               axis_scale = dmz.selectAll('.pc_axis')
                  .data(function(d) { return [d]; }, get_key);

               axis_scale.enter()
                   .append("g")
                   .attr({
                      "class": "pc_axis",
                      "shape-rendering": "crispEdges",
                   })

               axis_scale.exit().remove();

               axis_scale
                   .each(function(d) { d3.select(this).call(text_axis.scale(axesY[d])); })


               axis_text = dmz.selectAll('.pc_axis_text')
                  .data(function(d) { return [d]; }, get_key);

               axis_text.enter()
                  .append("text")
                  .attr({
                     "class": "pc_axis_text"
                  })

               axis_text
                  .style({
                     "font-size": fontScale(plot_width) + "px",
                     "text-anchor": "middle",
                     "cursor": "move",
                     "shape-rendering": "crispEdges"
                  })
                  .attr("y", -9)
                  .attr('transform', 'rotate(' + options.plot.xAxis.rotate + ')')
                  .text(function(d) { return d; })

               axis_text.exit().remove();

               chartHolder.selectAll('.pc_axis text')
                  .style({
                      "font-size": fontScale(plot_width) + "px",
                      "text-shadow": "0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff",
                      "cursor": "move"
                  });
 
               chartHolder.selectAll('.pc_axis path')
                  .style({
                     "fill": "none",
                     "stroke": "#000",
                     "shape-rendering": "crispEdges"
                  });
 
               axis_brushes = dmz.selectAll('.brush')
                  .data(function(d) { return [d]; }, get_key);

               axis_brushes.enter()
                  .append('g')
                  .attr('class', 'brush')
               axis_brushes.exit().remove();

               axis_brushes
                  .each(function(d, i) {
                     d3.select(this)
                        .call(
                           axesY[d].brush = d3.svg.brush()
                             .y(axesY[d])
                             .on("brushstart", brushstart)
                             .on("brushend", brushend)
                             .on("brush", brush)
                       );
                  })
                  .selectAll("rect")
                     .attr("fill-opacity", ".3")
                     .attr("stroke", "#fff")
                     .attr("shape-rendering", "crispEdges")
                     .attr("x", -8)
                     .attr("width", 16)


               displayAverages();

               function displayAverages() {
                  averages = calcAverages();
                  
                  axis_avgs = dmz.selectAll('.pc_axis_avg')
                     .data(function(d) { return [d]; }, get_key);

                  axis_avgs.enter()
                     .append("text")
                     .attr({
                        "class": "pc_axis_avg"
                     })

                  axis_avgs
                     .style({
                        "font-size": fontScale(plot_width) + "px",
                        "text-anchor": "end",
                        "fill": "blue",
                        "cursor": "move",
                        "shape-rendering": "crispEdges"
                     })
                     .attr("y", plot_height + 25)
                     .text(function(d) { return averages[d]; })
                     .on('mousedown', function() { click_check = sorted_dimensions; })
                     .on('click', function(d, i) {
                        if (!idArrs(sorted_dimensions, click_check)) return;
    
                        var extents = axesY[d].brush.extent();
                        var axis_values = data.map(function(v) { return v[d]; } );
    
                        if (extents[0] != extents[1]) {
                           var filtered_data = data
                                 .filter(function(f) { return f[d] >= extents[0] && f[d] <= extents[1]; })
                           var context = filtered_data.map(function(m) { return m._context_; });
                        }
    
                        var item_values = data.map(function(m) {
                           var c = {};
                           dimensions.x.forEach(function(dim) { c[dim] = m[dim]; });
                           return c;
                        })
                        .filter(function(f) {
                           return (extents[0] == extents[1]) ? true : f[d] >= extents[0] && f[d] <= extents[1];
                        });
    
                        if (events.axis.y.click) {
                           events.axis.y.click( { d: d, i: i, axis_values: axis_values, extents: extents, item_values: item_values, context: context });
                        }
                     });
               }

               // hover event to show settings/help icons
               if (options.display.settingsImg) {
                  settings = hoverFrame.selectAll('image.settings')
                     .data([0])

                  settings.enter()
                    .append('image')
                    .attr('class', 'settings')
                    .on('click', function() { if (events.settings.click) events.settings.click(options.id + 'Settings'); }) 

                  settings.exit().remove();

                  settings
                     .attr({
                        'xlink:href': options.display.settingsImg,
                        'x': plot_width - 10, 
                        'y': plot_height / 2 + 30,
                        'height': '20px',
                        'width':  '20px',
                        'opacity': 0
                     })

               } else {
                  hoverFrame.selectAll('image.settings').remove();
               }

               if (options.display.helpImg) {
                  help = hoverFrame.selectAll('image.help')
                     .data([0])

                  help.enter()
                    .append('image')
                    .attr('class', 'help')
                    .on('click', function() { if (events.help.click) events.help.click(options.id); }) 

                  help.exit().remove();

                  help
                     .attr({
                        'xlink:href': options.display.helpImg,
                        'x': plot_width - 10, 
                        'y': plot_height / 2,
                        'height': '20px',
                        'width':  '20px',
                        'opacity': 0
                     })

               } else {
                  hoverFrame.selectAll('image.help').remove();
               }

               function showImgs() {
                  if (options.display.helpImg) help.attr('opacity', 1);
                  if (options.display.settingsImg) settings.attr('opacity', 1);
               }

               function hideImgs() {
                  if (options.display.helpImg) help.attr('opacity', 0);
                  if (options.display.settingsImg) settings.attr('opacity', 0);
               }

               // Returns the path for a given data point.
               function path(d) {
                 return pcoord_line(dimensions.x.map(function(p) { 
                    return [position(p), axesY[p](d[p])]; 
                 }));
               }

               function transition(g) {
                  return g.transition().duration(500);
               }

               function position(d) {
                  var v = drag_data[d];
                  return v == null ? axesX(d) : v;
               }

               function brushstart() {
                  d3.event.sourceEvent.stopPropagation();
                  if (events.brush.start) events.brush.start();
               }

               function brushend() {
                  if (events.brush.end) events.brush.end();
               }

               // Handles a brush event, toggling the display of foreground lines.
               // doesn't handle ordinal scales...
               function brush() {
                  displayAverages();
                  if (events.brush.brushed) events.brush.brushed();
                  var actives = dimensions.x.filter(function(p) { return !axesY[p].brush.empty(); });
                  var extents = actives.map(function(p) { return axesY[p].brush.extent(); });
                  lines.style("display", function(d) {
                    return actives.every(function(p, i) {
                      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                    }) ? null : "none";
                  });
               }

               /* Ordinal Scale brushing
                // http://bl.ocks.org/chrisbrich/4173587
                var brushed = function(){
                   var selected =  yScale.domain().filter(function(d) {
                        return (brush.extent()[0] <= yScale(d)) && (yScale(d) <= brush.extent()[1])
                  });                     
               */

               // Extract the list of dimensions and create a scale for each.
               function getDimensions() {
                  var scales = options.data.scales;
                  var scale_keys = Object.keys(scales);

                  var y = axesY || {};

                  var x = d3.keys(data[0]).filter(function(d) {
                     if (options.data.hide.indexOf(d) >= 0) return false;
                     if (d == '_context_') return false;

                     if (scale_keys.indexOf(d) >= 0) {

                        y[d] = y[d] || scales[d].scale;

                        y[d]
                           .domain(scales[d].domain)
                           .range([plot_height, 0]);

                        // TODO: make this work...
                        if (scales[d].type == 'date') {
                           y[d].tickFormat(d3.time.format("%Y-%m-%d"))
                        }

                     } else {
                        y[d] = y[d] || d3.scale.linear();

                        var extent = d3.extent(data, function(p) { return +p[d]; });
                        if (data.length == 1) {
                           extent = [Math.min(0, extent[0]), Math.max(extent[1], 100)];
                        }

                        y[d]
                           .domain(extent)
                           .range([plot_height, 0]);
                     }

                     return true;
                  });

                  return { x: x, y: y };
               }

            }

        });
    }

    var get_key = function(d) { return d && d.key; };

    function line_color(d, i) {
       if (options.plot.lines.colorKey) {
          if (d[options.plot.lines.colorKey] && colors[d[options.plot.lines.colorKey]]) {
             var color = colors[d[options.plot.lines.colorKey]];
             return color;
          } else {
             return '#ddd';
          }
       }
       return color_scale(i);
    }

    // ACCESSORS

    chart.exports = function() {
       return {};
    }

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
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

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return options.width;
        options.width = value;
        chart.update();
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        chart.update();
        return chart;
    };

    chart.data = function(value) {
        if (!arguments.length) return data;
        if (lines) lines.style('display', null);
        if (events.brush.clear) events.brush.clear();
        chart.clearBrushes();
        data = value;
        if (sorted_dimensions == undefined) {
           sorted_dimensions = Object.keys(data[0]).filter(function(d) {
              if (options.data.hide.indexOf(d) > 0) return false;
              if (d == '_context_') return false;
              return true;
           });
        }
        return chart;
    };

    chart.filteredData = filteredData;
    function filteredData() {
       var f_lines = [];
       lines.each(function(d) { if (d3.select(this).style('display') == 'inline') f_lines.push(d); })
       return f_lines;
    }

    chart.activeBrushes = function() {
       var active = [];
       if (axesY) {
          Object.keys(axesY).forEach(function(e) { 
             if (!axesY[e].brush.empty()) active.push(e);
          });
       }
       return active;
    }

    chart.clearBrushes = function() {
       var active = chart.activeBrushes();
       if (active.length) d3.selectAll('.brush rect.extent').attr('height', 0) // Dirty Hack
       active.forEach(function(e) {
          axesY[e].brush.clear(); // Not sufficient, perhaps v4.0 will solve
       });
       if (lines) lines.each(function(d) { d3.select(this).style('display', 'inline'); })
    }

    chart.activeAxes = function(dims) {
       if (!arguments.length) return sorted_dimensions || Object.keys(axesY);
       sorted_dimensions = dims;
    }

    chart.hide = function(columns) {
       if (!arguments.length) return options.data.hide;
       if (columns.constructor !== Array) columns = [columns];
       options.data.hide = columns;
       return chart;
    }

    chart.scales = function(scales) {
       if (!arguments.length) return options.data.scales;
       options.data.scales = scales;
       return chart;
    }

    chart.update = function(opts) {
      if (events.update.begin) events.update.begin(); 
      if (typeof update === 'function' && data) update(opts);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
    }

    chart.colors = function(color3s) {
        if (!arguments.length) return colors;
        if (typeof color3s !== 'object') return false;
        var keys = Object.keys(color3s);        
        if (!keys.length) return false;
        // remove all properties that are not colors
        keys.forEach(function(f) { if (! /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color3s[f])) delete color3s[f]; })
        if (Object.keys(color3s).length) {
           colors = color3s;
        } else {
           colors = JSON.parse(JSON.stringify(default_colors));
        }
        return chart;
    }

    function idArrs(a, b) {
        if (!Array.isArray(a) || !Array.isArray(b)) return false;
        if (a.length != b.length) return false;
        for (var i=0; i < a.length; i++) {
           if (a[i] != b[i]) return false;
        }
        return true;
    }

    function calcAverages() {
       // these are averages, not weighted averages...
       var averages = {};
       sorted_dimensions.forEach(function(dim) { averages[dim] = 0; });
       var fd = filteredData();
       fd.forEach(function(row) {
          sorted_dimensions.forEach(function(dim) {
             averages[dim] += +row[dim];
          });
       });
       sorted_dimensions.forEach(function(dim) { averages[dim] = fd.length ? (averages[dim] / fd.length).toFixed(2) : '' });
       return averages;
    };

   return chart;
}
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
function datePicker() {

   var current_year = new Date().getFullYear();
   var options = {

      width: 890,
      height: 30,

      start_date: new Date(current_year + '-01-01'),
      end_date: new Date(),
      dateformat: d3.time.format('%m-%Y'),
    
      dateString: { 
         // weekday : 'long', 
         year    : 'numeric', 
         month   : 'long', 
         // day     : 'numeric' 
      },

      display: {
         transition_time: 0,
         sizeToFit: true,
      },

      margin: {top: 0, right: 30, bottom: 0, left: 30},
   }
    
    var events = {
       'update':  { 'begin': null, 'end': null },
       'brush':   { 'start': null, 'move': null, 'end': null, 'clear': null },
    };

   var dom_parent;
   var selected_range;
   var update;
   var brush;
   var brushg;

   function chart(selection) {
      selection.each(function () {

         dom_parent = d3.select(this);

         var root = dom_parent.append('svg')
            .attr({
               'class'     : 'datePicker',
               'width'     : options.width,
               'height'    : options.height
            })

         var picker = root.append("g").attr('class', 'picker');

         update = function(opts) {
            if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
               var dims = dom_parent.node().getBoundingClientRect();
               options.width = Math.max(dims.width, 300);
            }

            root
               .attr({
                  'width'     : options.width,
                  'height'    : options.height
               })

            var plot_width = options.width - options.margin.left - options.margin.right;

            picker
               .attr({
                  "transform": "translate("+options.margin.left+","+options.margin.top+")"
               });
              
            var rangeLine = picker.selectAll('.rangeLine')
               .data([0])

            rangeLine.enter()
               .append("line");

            rangeLine.exit().remove();

            rangeLine
               .attr({ 
                  "class"           : "rangeLine",
                  "shape-rendering" : "crispEdges",
                  "stroke"          : "#777",
                  "stroke-dasharray": "2,2",
                  "x2"              : plot_width,
                  "y1"              : options.height / 2,
                  "y2"              : options.height / 2,
               })

            var tb = picker.selectAll('.dateAnchor')
               .data([options.start_date, options.end_date])

            tb.enter()
               .append('text')   
               .attr({
                  "class"        : "dateAnchor",
                  "id"           : function(d, i) { return "dA" + i; },
                  "text-anchor"  : function(d, i) { return i < 1 ? "start" : "end"},
                  "alignment-baseline": "middle"
               })

            tb.exit().remove()

            tb
               .attr({ "transform"    : transl, })
               .text(function(d) { return d.toLocaleDateString("en-US", options.dateString); })
               .each(function(d, i) { bkgnd(d3.select(this), i); });

            function bkgnd(txtElement, i) {
               var bbox = txtElement.node().getBBox();
               var padding = 6;

               var bk = picker.selectAll('#bkgnd' + i)
                  .data([0])

               bk.enter()
                  .insert("rect", "text")
                  .attr({ "id"        : "bkgnd" + i, })
                  .style("fill", "white");

               bk.exit().remove();

               bk
                  .attr({
                     "transform" : transl(null, i),
                     "x"         : bbox.x - padding,
                     "y"         : bbox.y - padding,
                     "width"     : bbox.width + (padding*2),
                     "height"    : bbox.height + (padding*2),
                  })
            }

            function transl(d, i) {
               var t = "translate(";
               t = t + (i < 1 ? 0 : plot_width); 
               t = t + ","+ (options.height - options.margin.bottom) / 2 + ")";
               return t;
            }

            // Selection brush
            var x = d3.time.scale();
            var y = d3.scale.linear();
            x.domain([options.start_date, options.end_date]).rangeRound([0, plot_width]);
            y.domain([0,1]).rangeRound([0, options.height]);

            // Selection caption
            picker.selectAll('.selection_caption').remove();

            var selection_caption = picker.append('g')
              .attr({
                 'class'         : 'selection_caption',
                 'display'       : 'none'
              })
             
            selection_caption.append('rect')
               .attr({
                  'height'       : 14,
                  'width'        : 90,
                  'fill'         : "#fff",
                  'rx'           : 4,
                  'ry'           : 4,
               })
               .style({
                  'stroke'       : 'black',
                  'opacity'      : 0.8,
                  'stroke-width' : 0.3,
               })
              
            selection_caption.append('text')
               .attr({
                  'x'            : 2,
                  'y'            : 11,
               })
               .style({
                  'font-size'    : 10,
                  'font-family'  : 'sans-serif',
               })

            picker.selectAll('.brush').remove();

            brush = d3.svg.brush()
                .x(x)
                .on("brushstart", brushstart)
                .on("brush", brushmove)
                .on("brushend", brushend)
                
            brushg = picker.append("g")
                .attr({
                   "class"       : "brush",  
                   "stroke"      : "rgb(108, 122, 168)",
                   "fill"        : "rgb(68, 104, 168)",
                   "fill-opacity": .10,
                   "shape-rendering": "crispEdges",
                })
                .call(brush)
                
            brushg.selectAll("rect")
                .attr({
                   "height"      : options.height
                });
                
            brushg.selectAll(".resize")
               .append("path")
               .attr({
                 "fill"          : "#eee",
                 "stroke"        : "#666",
                 "d"             : resizePath,
               })

            function brushstart() {
               picker.selectAll('.selection_caption').style('opacity', .8);
               if (typeof events.brush.start == 'function') { events.brush.start(); }
            }
             
            function brushmove() {
              var g = d3.select(this.parentNode);
              brushUpdate();

              /*
              var extent = brush.extent();
              var start = d3.time.day.round(extent[0]);
              var end = d3.time.day.round(extent[1]);
              if (start.getTime() > end || start.valueOf() == end.valueOf()) {
                 selection = null;  
              } else {
                 end.setHours(23,59,59,999); // make sure set for end of day
                 selection = [start, end];
              }
              extent = extent.map(d3.time.day.round);
              console.log(extent);

              brushg
                  .call(brush.extent(extent.map(d3.time.day.round)))
                .selectAll(".resize")
                  .style("display", selection && start.getTime() <= end.getTime() ? null : 'none');
              */
              updateSelectionCaption();

              if (typeof events.brush.move == 'function' && selected_range) {
                 var range = selected_range ? selected_range : [options.start_date, options.end_date];
                 events.brush.move({ range: range });
              }
            }
             
            function brushend() {
               picker.selectAll('.selection_caption').style('opacity', 0);
               if (typeof events.brush.end == 'function') {
                  var range = selected_range ? selected_range : [options.start_date, options.end_date];
                  events.brush.end({ range: range });
               }
            }
             
            function updateSelectionCaption() {
              selection_caption
                  .attr('display', function() { return selected_range && selected_range[0].getTime() <= selected_range[1].getTime() ? null : 'none'} )
                  .attr('transform', function() { return selected_range && 'translate('+(x(selected_range[0]))+','+(0)+')'} )
                .select('text')
                  .text(selected_range && options.dateformat(selected_range[0]) + " \u25b8 " + options.dateformat(selected_range[1]))
            }    
         }           
      })
   }
     
   function resizePath(d) {
     var e = +(d == "e"),
         x = e ? 1 : -1,
         h = options.height * 2/3,
         y = (options.height - h) / 2;

     return "M" + (.5 * x) + "," + y
         + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
         + "V" + (y + h - 6)
      + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (y + h)
      + "Z"
      + "M" + (2.5 * x) + "," + (y + 8)
      + "V" + (y + h - 8)
      + "M" + (4.5 * x) + "," + (y + 8)
      + "V" + (y + h - 8);
   }

   function brushUpdate() {
        var extent = brush.extent();
        var start = d3.time.day.round(extent[0]);
        var end = d3.time.day.round(extent[1]);
        if (start.getTime() > end || start.valueOf() == end.valueOf()) {
           selected_range = null;  
        } else {
           end.setHours(23,59,59,999); // make sure set for end of day
           selected_range = [start, end];
        }
        extent = extent.map(d3.time.day.round);

        brushg
            .call(brush.extent(extent.map(d3.time.day.round)))
          .selectAll(".resize")
            .style("display", selected_range && start.getTime() <= end.getTime() ? null : 'none');
        // updateSelectionCaption();
   }

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
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

    chart.update = function(opts) {
      if (events.update.begin) events.update.begin(); 
      if (typeof update === 'function') update(opts);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
    }

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.data = function(value) {
        if (!arguments.length) return [options.start_date, options.end_date];
        if (!Array.isArray(value)) return;
        if (value[0] && value[1] && value[0].valueOf() > value[1].valueOf()) {
           value.reverse();
        }
        options.start_date = value[0] ? value[0] : new Date(current_year + '-01-01');
        options.end_date = value[1] ? value[1] : new Date();
        return chart;
    };

   chart.set = function(start_date, end_date) {
      brush.extent([start_date, end_date])
      brush(d3.select(".brush").transition());
      brush.event(d3.select(".brush"));
      brushUpdate();
   }
   return chart;
}

