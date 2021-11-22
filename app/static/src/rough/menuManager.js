function menuManager() {

   var mnu = {};

   // probably obsolete
   function tournamentTree(tlist) {
       var uid = 0;
       function uuid() {
          uid += 1;
          return uid;
       }

       // TODO: this should be integrated with a MENU component
       // and not call the 'resultMenu' by name but use configurable option
       var tournament_tree = d3.select("#resultMenu");
       tournament_tree.selectAll('li').remove();

       var tournaments = tournament_tree.selectAll('.tournament')
          .data(tlist, function(d, i) { return d.sort; })

       tournaments.enter()
            .append('li')
            .attr('class', 'dropdown tournament')
            .append('a')
            .attr({
               href:    "#", 
               'data-toggle' : "dropdown"
            })
            .attr('class', function(d) {
               var name = d.tournament == '' ? 'Unknown' : 'z' + d.tournament.split(' ').join('_') + 'z';
               return "dropdown-toggle selection " + name;
            })
            .style('color', '#2d3e4f')
            .html(function(d) { return '<h4>' + d.sort + '</h4><b class="caret"></b>'; })
            .on('click', function(d, i) { 
               tournamentClick(d);
               d3.select('#view_selectors').style('display', 'inline');
               d3.selectAll('.server').style('background', 'white').attr('selected', 0); 
               d3.select('#player1serves').text('Opp. Serves');;
               d3.selectAll('.selection')
                 .style('color', function(f) {
                    var tourney = (d.tournament) ? 'z' + d.tournament.split(' ').join('_') + 'z' : 'Unknown';
                    if (d3.select(this).attr('class').indexOf(tourney) >= 0) { return '#2ed2db'; }
                    return '#2d3e4f';
               });
            })
  
       tournaments.exit().remove();

       var tournament_dropdowns = tournaments.selectAll(".dropdown-menu")
            .data(function(d) { return [d]});
  
       tournament_dropdowns.enter()
            .append('ul')
            .attr('class', 'dropdown-menu')

       tournament_dropdowns.exit().remove();

       var tournament_matches = tournament_dropdowns.selectAll(".matchtext")
            .data(function(d) { return d.matches}, function(d,i) { return d.match; });

       tournament_matches.enter().append("li")
            .attr({
               "class": function(d) {
                  if (d.tournament) {
                     return 'z' + d.tournament.split(' ').join('_') + 'z';
                  } else {
                     return "match " + 'z' + 'undefined' + 'z';
                  }
               }
            })
            .append("a")
            .attr("target", "match")
            .append('text')
            .attr("class", "matchtext")
            .attr("uid", function() { return "m" + uuid(); })
            .style("color", function(d) { return d.won ? 'green' : 'red'; })
            .text(function(d, i) { return d.match; })
            .on('click', function(d, i) { 
               clickMatch(d);
               // TODO: what is this for?
               // var self = this;
               // var muid = d3.select(self).attr('uid');
            });
   }


   return mnu;
}
