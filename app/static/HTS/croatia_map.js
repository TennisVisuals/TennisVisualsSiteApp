function croatiaMap() {
    var data;
    var dom_parent;
    var poi_layer;
    var projection;
    var update;

    var surfScale = d3.scale.ordinal()
       .range(["#235dba","#db3e3e","#7ea800","#a7a59b"])
       .domain(["hardcourt","clay","grass","unknown"]);

    var options = {
        width: 380,
	     height: 380,
        margins: {
           top:    25, bottom: 20, 
           left:   10, right:  10
        },
        display: {
           transition_time: 0,
           sizeToFit: true
        }
    }

    var events = {
       'update':  { 'begin': null, 'end': null },
       'item':    { 'mouseover': null, 'mouseout': null, 'click': null }
    };

    var region_colors = { 
       SD: '#ddc', DN: '#cdd', ZD: '#cdc', GZ: '#dcd', ME: '#cdd', KK: '#ddc', 
       VP: '#dcd', PS: '#cdd', OB: '#ddc', VS: '#dcd', SP: '#cdd', SM: '#ddc', 
       VA: '#dcd', KZ: '#cdd', LS: '#dcd', PG: '#ddc', IS: '#cdd', SB: '#ddc', 
       KA: '#dcd', BB: '#cdd', ZG: '#dcd'
    };

    function chart(selection) {
        selection.each(function () {
            dom_parent = d3.select(this);

            var root = dom_parent.append('svg')
                .attr("width", options.width)
                .attr("height", options.height)
                .attr('class', 'countryMap')
                .attr('id', 'croatiaroot');

            var croatia = root.append("g").attr("id", "croatiamap");

            var map_layer = croatia.append("g")
                .attr("width", options.width)
                .attr("height", options.height);

            poi_layer = croatia.append("g")
                .attr("width", options.width)
                .attr("height", options.height);

            var subunits = topojson.feature(data, data.objects.croatia);

            update = function(opts) {

               if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
                  var scale_width = Math.min(window.innerWidth, options.width) / options.width;
                  croatia.attr("transform", "scale(" + scale_width + "," + scale_width + ")");
               }

               projection = d3.geo.mercator()
                   .center([21.0, 44.1]) // x to left, y to bottom
                   .scale(3500)

               var path = d3.geo.path()
                   .projection(projection);  

               var mapOfCroatia = map_layer.selectAll(".subunit")
                  .data(subunits.features)

               mapOfCroatia.enter().append("path")
               mapOfCroatia.exit().remove();

               mapOfCroatia
                  .attr("class", function(d) { return "subunit " + d.properties.HASC_1.substr(3,2); }) //str.substr(start[, length])
                  .style('fill', function(d) { return region_colors[d.properties.HASC_1.substr(3,2)]; })
                  .attr("d", path)
                  .on("mouseover", function (d, i) {
                     d3.select(this).style("fill", "steelblue");
                  })
                  .on("mouseout", function (d, i) { 
                     d3.select(this).style('fill', function(d) { return region_colors[d.properties.HASC_1.substr(3,2)]; })
                  });

               map_layer.append("path")
                  .datum(subunits)
                  .attr("d", path)
                  .attr("class", "country");  
            }
        })
    }

    function displayCities(season) {
      poi_layer.selectAll("circle").remove();
      var tournaments = poi_layer.selectAll("circle").data(season);
      tournaments.enter()
        .append("circle")
        .style("stroke", "blue")
        .style("fill", "yellow")
 
      tournaments.exit().remove()
 
      tournaments
        .attr("id", function(d) { return 'venueMap' + d.context; })
        .attr("class", 'venueMap')
        .attr("cx", function(d) { if (d.long && d.lat) return projection([d.long, d.lat])[0]; })
        .attr("cy", function(d) { if (d.long && d.lat) return projection([d.long, d.lat])[1]; })
        .attr("r", "6px")
        .on('mouseover', function(d) {
           d3.select(this)
              .style({
                 'fill': function(d) { return d.surface ? surfScale(d.surface) : "#a7a59b"; },
                 'opacity': .7
              });
        })
        .on('mouseout', function(d) {
           d3.select(this).style({ 'fill': 'yellow', 'opacity': 1 });
        });
    }
 
    function displayClubs(clubs) {
      if (!clubs.length) return;
      club_loc = poi_layer.selectAll(".club").data(clubs);
 
      club_loc.enter()
        .append("circle")
        .attr('class', 'club')
        .style("stroke", "green")
        .style("fill", "green")
 
      club_loc.exit().remove()
 
      club_loc
        .attr("cx", function(d) { return projection([d.long, d.lat])[0]; })
        .attr("cy", function(d) { return projection([d.long, d.lat])[1]; })
        .attr("r", "4px")
        .style("opacity", 1)
    }

    function hideClubs() {
        poi_layer.selectAll(".link").remove();
        poi_layer.selectAll(".club").attr('opacity', 0);
    }

    function displayLinks(d, shapeColor) {
        poi_layer.selectAll(".link").remove();
        poi_layer.selectAll('.venueMap')
           .style({
              'fill': 'yellow',
              'opacity': 1
           })
           .attr('r', '6px');
        var source = poi_layer.select("[id='venueMap" + d.context + "']")
           .style({
              'fill': shapeColor ? shapeColor : 'blue',
              'opacity': .7
           })
           .attr('r', '12px');

        var source_xy = { x: + source.attr('cx'), y: + source.attr('cy') };

        var links = [];
        d.clubs.forEach(function(c, i) {
           var x = projection([c.long, c.lat])[0];
           var y = projection([c.long, c.lat])[1];
           if (x != source_xy.x || y != source_xy.y) {
              links.push({
                 source: source_xy,
                 target: { x: x, y: y }
              });
           }
        });

        var diagonal = d3.svg.diagonal()
           .projection(function(d) { return [d.x, d.y]; });

        var link_layer = poi_layer.selectAll(".link")
          .data(links)

        link_layer
          .enter().append("path")
  
        link_layer .exit().remove();

        link_layer
          .attr("d", diagonal)
          .attr('class', 'link')
          .style({
             'fill':         'none',
             'stroke':       '#74736c',
             'stroke-width': '1.5px',
          })
    }

    chart.exports = function() {
       return { displayCities: displayCities, displayClubs: displayClubs, 
                displayLinks: displayLinks, hideClubs: hideClubs }
    }

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

    return chart;
}
