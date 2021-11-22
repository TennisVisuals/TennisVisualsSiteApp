!function() {
   var aip = {
      desc: 'AIP API Wrappers',
      version: '0.1',
      server: location.origin,
      message: 'No Message',
   }

   aip.QueryString = function () {
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

   aip.okeys = Object.keys(aip.QueryString);
   aip.report = function(what, callback) { urlRequest(location.origin + '/report/' + what, callback); }

   aip.shareFile = function(data, destination, filename, filetype, callback) {
      var request = JSON.stringify({ data: data, action: 'save', destination: destination, filename: filename, filetype: filetype });
      ajax('/api/match/share', request, 'POST', callback);
   }

   aip.requestFile = function(source, filename, callback) {
      var request = JSON.stringify({ source: source, action: 'readfile', filename: filename, });
      ajax('/api/match/request', request, 'POST', callback);
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

   function urlRequest(url, callback) {
     var xhr = xhrRequest('GET', url);
     if (!xhr) {
       aip.message = "XHR not supported";
       return;
     }

     xhr.onload = function() {
       var data = xhr.responseText;
       var json = data ? JSON.parse(data) : {};
       aip.message = "JSON Received";
       if (callback) callback(json);
     };

     xhr.onerror = function() {
       aip.message = "Request Unsuccessful";
     };

     xhr.send();
   }

   // http://www.html5rocks.com/en/tutorials/cors/
   function xhrRequest(method, url) {
     var xhr = new XMLHttpRequest();
     if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
     } else {
        xhr = null;
     }
     return xhr;
   }

   function postRequest(url, callback) {
     var xhr = xhrRequest('POST', url);
     if (!xhr) {
        aip.message = "XHR not supported";
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
