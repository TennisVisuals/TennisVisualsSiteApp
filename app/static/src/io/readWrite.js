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
