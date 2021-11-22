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
