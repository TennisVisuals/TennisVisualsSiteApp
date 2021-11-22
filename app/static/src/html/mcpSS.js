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
