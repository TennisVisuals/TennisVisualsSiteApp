!function() {
   var aip = {
      desc: 'Tennis AiP Cors Library',
      server: 'http://tennisvisuals.com',
      version: '0.3',
      message: '',
      match: {},
      playerRecord: {}
   }

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
         var okeys = Object.keys(QueryString);
         if (okeys.length && okeys.indexOf('player') >= 0) {
            single_variable = QueryString['player'];
         } else {
            aip.message = "query variable not found in query string";
            if (callback) callback('not found', '');
            return;
         }
      }
      aip.message = "Making CORS Request";
      var url = aip.server + query_path + single_variable;
      makeCorsRequest(url, function(json) {
          if (callback) callback(null, json);
      });
   }

   // CORS findPlayerMatches()
   aip.findPlayerMatches = findPlayerMatches
   function findPlayerMatches(playerName, year, callback) {
      // recognize whether there was no muid passed into function
      if (typeof playerName == 'function') {
         callback = playerName;
         playerName = undefined;
      }
      if (typeof playerName != 'string') playerName = undefined;
      if (typeof callback != 'function') callback = undefined;

      if (!playerName) {
         var okeys = Object.keys(QueryString);
         if (okeys.length && okeys.indexOf('player') >= 0) {
            playerName = QueryString['player'];
         } else {
            aip.message = "player not found in query string";
            if (callback) callback('no player found', '');
            return;
         }
      }
      aip.message = "Making CORS Request";
      if (year != '') {
         var url = aip.server + '/api/matches/player/' + playerName + '/' + year;
         makeCorsRequest(url, function(json) {
             if (callback) callback(null, json);
         });
      } else {
         var url = aip.server + '/api/matches/player/' + playerName;
         makeCorsRequest(url, function(json) {
             aip.playerRecord = json;
             if (callback) callback(null, aip.playerRecord);
         });
      }
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
         var okeys = Object.keys(QueryString);
         if (okeys.length && okeys.indexOf('muid') >= 0) {
            muid = QueryString['muid'];
         } else {
            aip.message = "player not found in query string";
            if (callback) callback('no player found', '');
            return;
         }
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
         var okeys = Object.keys(QueryString);
         if (okeys.length && okeys.indexOf('player') >= 0) {
            playerName = QueryString['player'];
         } else {
            aip.message = "player not found in query string";
            if (callback) callback('no player found', '');
            return;
         }
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
         var okeys = Object.keys(QueryString);
         if (okeys.length && okeys.indexOf('muid') >= 0) {
            muid = QueryString['muid'];
         } else {
            aip.message = "muid not found in query string";
            if (callback) callback('no muid found', data);
            return;
         }
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

   // build an array of child objects which match
   // var gaemes_in_match = child_seek('games', match);
   aip.select_attrs = select_attrs;
   function select_attrs(array, attrs) {
      result = [];
      keys = Object.keys(attrs);
      for (var i = 0; i < array.length; i++) {
         if (!array[i]) { continue; }
         for (var k = 0; k < keys.length; k++) {
            if (attrs[keys[k]].indexOf(array[i][keys[k]]) < 0) { break; }
            if (k + 1 == keys.length) { result.push(array[i]); }
         }
      }
      return result
   }

   // filter an array of objects with object of attribute/value pairs
   // var games_received = filter_out(games_in_match, { "server": player_name });
   aip.filter_out = filter_out;
   function filter_out(array, attrs) {
      result = [];
      keys = Object.keys(attrs)
      for (var i = 0; i < array.length; i++) {
         if (!array[i]) { continue; }
         for (var k = 0; k < keys.length; k++) {
            if (array[i][keys[k]] == attrs[keys[k]]) { break; }
            if (k + 1 == keys.length) { result.push(array[i]); }
         }
      }
      return result
   }

   // aggregate object descendants with attribute maching value
   // all_match_points = seek('points', match)
   // set_one_shots = seek('shots', match.sets[0])
   aip.seek = seek;
   function seek(value, obj) {
      var child_tree = { "Match": "sets", "Set": "games", "Game": "points", "Point": "shots" }
      var tree_hierarchy = ["Matches", "Match", "Set", "Game", "Point", "Shot"]
      var accumulator = []

      index = obj_values(child_tree).indexOf(value)
      key = Object.keys(child_tree)[index]

      object_index = tree_hierarchy.indexOf(obj.identity)
      target_index = tree_hierarchy.indexOf(key)

      if (target_index > object_index) {
         for (var c = 0; c < obj[child_tree[obj.identity]].length; c++) {
            accumulator = accumulator.concat(seek(value, obj[child_tree[obj.identity]][c]))
         }
      } else if (target_index == object_index) {
         accumulator = accumulator.concat(obj[child_tree[key]])
      } else if (object_index = target_index + 1) {
         accumulator.push(obj)
      }

      function obj_values(obj) {
         values = []
         for (var key in obj) {
             if (obj.hasOwnProperty(key)) { values.push(obj[key]); }
         }
         return values;
      }

      return accumulator
   }

   aip.addChildren = addChildren;
   function addChildren(obj) {
      if (!obj) return;
      obj.children = obj.sets;
      for (var s=0; s < obj.sets.length; s++) {
         obj.sets[s].children = obj.sets[s].games;
         for (var g=0; g < obj.sets[s].games.length; g++) {
            obj.sets[s].games[g].children = obj.sets[s].games[g].points;
            for (var p=0; p < obj.sets[s].games[g].points.length; p++) {
               // add code so that children are only shots where (shot.sequence || shot.key_shot)
               var children = [];
               for (var t=0; t < obj.sets[s].games[g].points[p].shots.length; t++) {
                  var shot = obj.sets[s].games[g].points[p].shots[t];
                  if (shot.sequence || shot.key_shot) {
                     children.push(shot);
                  }
               }
               // obj.sets[s].games[g].points[p].children = obj.sets[s].games[g].points[p].shots;
               obj.sets[s].games[g].points[p].children = children;
            }
         }
      }
   }

   aip.addParents = addParents;
   function addParents(obj) {
      if (!obj) return;
      if ("children" in obj) {
         for (var c=0; c < obj.children.length; c++) {
            obj.children[c].parent = obj;
            addParents(obj.children[c]);
         }
      }
   }

   aip.stripParents = stripParents;
   function stripParents(obj) {
      if (!obj) return;
      if ("children" in obj) {
         for (var c=0; c < obj.children.length; c++) {
            delete obj.children[c].parent;
            stripParents(obj.children[c]);
         }
      }
   }

   if (!Array.prototype.last){
       Array.prototype.last = function(){ return this[this.length - 1]; };
   };

   if (!Array.prototype.contains){
      Array.prototype.contains = function(element){ return this.indexOf(element) > -1; };
   };

  if (typeof define === "function" && define.amd) define(aip); else if (typeof module === "object" && module.exports) module.exports = aip;
  this.aip = aip;
}();
