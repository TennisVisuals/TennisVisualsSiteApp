!function() {

   var search = {};
   var tP, sb;
   var initialized = false;

   var options = {
      domElement: undefined,
      searchForm: undefined,
      searchIcon: undefined
   };

   var events = {
      submit: undefined
   };

   search.init = function() {
      if (!options.domElement || !options.searchForm) {
         initialized = false;
         return false;
      }

      sb = document.getElementById(options.domElement);
      tP = document.getElementById(options.searchForm);
      if (!sb || !tP) {
         initialized = false;
         return false;
      }

      if (options.searchIcon) {
         var searchIcon = document.getElementById(options.searchIcon);
         if (searchIcon) searchIcon.onclick = function() { toggleSearch(); };
      }

      // hack to defocus after entry of player name
      var bb = document.createElement('input');
      tP.appendChild(bb);
      bb.setAttribute('id', 'blur');
      bb.setAttribute('type', 'text');
      bb.style.position = 'absolute';
      bb.style.opacity = '0'; 

      tP.addEventListener('keydown', catchTab , false);
      tP.addEventListener("keyup", function(event) {
         if (event.which == 13 || event.which == 9) { tPenter (); }
      });
      tP.addEventListener("awesomplete-selectcomplete", function(e){ tPsubmit (); }, false);

   }

   function tPenter() {
      var element = document.querySelector('#' + options.domElement + ' li');
      if (element) tP.value = element.textContent.split('[')[0].trim();
      tPsubmit();
   }

   function tPsubmit() {
      document.getElementById('blur').focus();
      if (typeof events.submit == 'function') { events.submit(tP.value); }
      toggleSearch();
   }

   search.toggleSearch = toggleSearch;
   function toggleSearch(state) { 
     if (sb) {
        var visible = sb.style['visibility'] || 'hidden';
        if (state == 'close') {
            sb.style['visibility'] = 'hidden';
        } else if (state == 'open') { 
            sb.style['visibility'] = 'visible';
            if (tP) tP.focus();
        } else {
           interact.toggleMenu('close');
           if (visible == 'hidden') {
               sb.style['visibility'] = 'visible';
               if (tP) tP.focus();
           } else {
               sb.style['visibility'] = 'hidden';
           }
        }
     }
     return;
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

   search.options = function(values) {
      if (!arguments.length) return options;
      keyWalk(values, options);
      return search;
   }

   search.events = function(functions) {
       if (!arguments.length) return events;
       keyWalk(functions, events);
       return search;
   }

   function catchTab(event) { if (event.which == 9) { event.preventDefault(); } }

   this.search = search;

}();
