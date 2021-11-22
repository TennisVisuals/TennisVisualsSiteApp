!function() {

   // module container
   var spFx = {};

   var sp = scatterPlot();
   sp.width(650).height(400);

   var container = d3.select('#scatterPlot');
   var legend = d3.select('#scatterPlot_legend');

   var vizcontrol = d3.select('#controls');
   var viztable = vizcontrol.append('table');

   var row1 = viztable.append('tr').append('td').attr('align', 'left');
   row1.append('input').attr('name', 'dataset').attr('id', 'perSet').attr('type', 'radio').attr('value', 'perSet').attr('checked', 'checked');
   row1.append('label').html('&nbsp; per Set Totals').attr('id', 'perSet_label');
   document.getElementById("perSet").addEventListener("change", function() { 
      displayPerSet(sp);
      sp.update();
   });

   var row2 = viztable.append('tr').append('td').attr('align', 'left');
   row2.append('input').attr('name', 'dataset').attr('id', 'perGame').attr('type', 'radio').attr('value', 'perGame');
   row2.append('label').html('&nbsp; per Game Avgerages').attr('id', 'perGame_label');
   document.getElementById("perGame").addEventListener("change", function() { 
      displayPerGame(sp);
      sp.update();
   });

   var row3 = viztable.append('tr').append('td').attr('align', 'left');
   row3.append('input').attr('name', 'dataset').attr('id', 'ppsSPP').attr('type', 'radio').attr('value', 'perGame');
   row3.append('label').html('&nbsp; pts/Game Shots/pt').attr('id', 'ppsSPP_label');
   document.getElementById("ppsSPP").addEventListener("change", function() { 
      console.log('spp')
      displaySPP(sp);
      sp.update();
   });

   viztable.append('input').attr('autocomplete', 'off').attr('name', 'highlight')
         .attr('class', 'valid').attr('type', 'text').attr('value', '')
         .attr('id', 'highlight').attr('placeholder', 'Player Name').attr('tabindex', '3')
         .attr('spellcheck', 'false')
         .attr('autofocus');

   highlight.addEventListener("keyup", function(event) {
      if (!highlight.value) sp.highlight(undefined);
      if (event.keyCode == 13) {
         sp.highlight(highlight.value);
      }
   });

   spFx.init = init;
   function init(plot) {
      plot.options({
         id    : 'first',

         data: {
            identifier:    'h2h',
            abbreviation:  'Set Score',
            group:         'Set Score',
            sub_group:     'gid',
            r_scale:       'PPG',
            x:             'Total Shots',
            y:             'Total Points'
         },

         axes  : {
            x: { label:   'Shots per Set' },
            y: { label:   'Points per Set' } 
         },

         datapoints: {
            radius: {
               default: [2, 3],
               mobile:  [1, 1]
            }
         },

      });

      plot.colors({
         "7-6":      "#2074A0",
         "7-5":      "#66489F",
         "6-4":      "#991C71", 
         "6-3":      "#C20049", 
         "6-2":      "#E01A25", 
         "6-1":      "#E58903", 
         "6-0":      "#EFB605"
      });

      plot.duration(1000);
   }

   spFx.displayPerSet = displayPerSet;
   function displayPerSet(plot) {
      plot.options({
         data: {
            x:             'Total Shots',
            y:             'Total Points'
         },
         axes  : {
            x: { label:   'Shots per Set' },
            y: { label:   'Points per Set' } 
         }
      })
   }

   spFx.displayPerGame = displayPerGame;
   function displayPerGame(plot) {
      plot.options({
         data: {
            x:             'SPG',
            y:             'PPG'
         },

         axes  : {
            x: { label:   'Average Shots per Game' },
            y: { label:   'Average Points per Game' } 
         }
      });
   }

   spFx.displaySPP = displaySPP;
   function displaySPP(plot) {
      plot.options({
         data: {
            x:             'SPP',
            y:             'PPG'
         },

         axes  : {
            x: { label:   'Average Shots per Point' },
            y: { label:   'Average Points per Game' } 
         }
      });
   }

   spFx.displayDefault = displayDefault;
   function displayDefault() {
      sp.events({
         'element': { 'click': highlightMatch }
      });

      sp.options({
         legend: { 
            dom_element: legend,
            title:   'SET SCORE',
            text:    'Click Legend to select group<br> Click Legend title to reset',
            },
         display: {
            reset:         '#scatterPlot_legend',
            zoom:          true,
            bubble_legend: false,
            highlight: {
               radius:     12,
               fill:       undefined
            }
         }
      });

      init(sp);
      d3.json('./atp_wta.dat', function(err, data) {

         // PPG: "5.67"
         // SPG: "26.17"
         // Set Score: "6-0"
         // Total Points: 34
         // Total Shots: 157
         // Tournament: "Maui"
         // h2h: "Michael Mmoh v. Kyle Edmund"
         // gid: 'MichaelMmohKyleEdmundMaui2016'

         sp.data(data.data);
         container.call(sp);
         sp.update();
      })
   }

   function highlightMatch(d) {
      sp.highlight(d.gid);
   }

   if (typeof define === "function" && define.amd) define(spFx); else if (typeof module === "object" && module.exports) module.exports = spFx;
   this.spFx = spFx;

}();
