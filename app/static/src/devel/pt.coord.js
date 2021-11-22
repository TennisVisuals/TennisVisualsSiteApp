pcoord_div = document.createElement("div");
main = document.getElementById('main').appendChild(pcoord_div);
pcoord_div.id = 'pcoord';
d3.select('#pcoord').attr('class', 'parcoords').style('display', 'none').attr('width', '900px').style('overflow', 'scroll')

matches_div = document.createElement("div");
main = document.getElementById('main').appendChild(matches_div);
matches_div.id = 'matches';
d3.select('#matches').attr('class', 'parcoords').style('display', 'none').attr('width', '900px').style('overflow', 'scroll')

function display_coord(target, coords) {
   var s_color = d3.scale.category10();

   var margin = {top: 60, right: 20, bottom: 50, left: 80},
       // width = screen.width - margin.left - margin.right,
       width = 900 - margin.left - margin.right,
       height = 350 - margin.top - margin.bottom;

   var coord_x = d3.scale.ordinal().rangePoints([0, width], 1),
       coord_y = {},
       pc_dragging = {};

   d3.select('#' + target).selectAll('svg').remove()

   var coord_svg = d3.select('#' + target).append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
     .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   // var pcoord_line = d3.svg.line().interpolate("cardinal"),
   var pcoord_line = d3.svg.line().interpolate("cardinal"),
       num_axis = d3.svg.axis().orient("left"),
       text_axis = d3.svg.axis().orient("left"),
       background,
       foreground;

  /*
  // original... 
  // Extract the list of dimensions and create a scale for each.
  dimensions = d3.keys(cars[0]).filter(function(d) {
    return d != "name" && (y[d] = d3.scale.linear()
        .domain(d3.extent(cars, function(p) { return +p[d]; }))
        .range([height, 0]));
  })
  */

  // Extract the list of dimensions and create a scale for each.
  pc_dimensions = d3.keys(coords[0]).filter(function(d) {
     if (coords[0][d].scale == 'none') {
        return false; 
     } else if (coords[0][d].scale == 'ordinal') {
        var dom = coords.map(function(p) { return p[d].value; })
        // if all dom elements are the same then return false = don't show dimension
        coord_y[d] = d3.scale.ordinal().domain(dom).rangePoints([0, height]); return true; 
     } else if (coords[0][d].scale == 'range') {
        coord_y[d] = d3.scale.linear().domain(coords[0][d].range).range([height, 0]); return true; 
     } else if (coords[0][d].scale == 'percent') {
        // var dom = coords[0][d].invert == true ? [100, 0] : [0, 100];
        var dom = coords[0][d].invert ? [100, 0] : [0, 100];
        coord_y[d] = d3.scale.linear().domain(dom).range([height, 0]); return true; 
     } else {
        var xtnt = d3.extent(coords, function(p) { return +p[d].value; });
        // axis will have no values if extent of domain is zero difference between high and low
        if (xtnt[0] == xtnt[1]) { xtnt[0]--; xtnt[1]++ }
        if (coords[0][d].invert) { xtnt = [xtnt[1], xtnt[0]] }
        coord_y[d] = d3.scale.linear().domain(xtnt).range([height, 0]); return true; 
     }
  })

  coord_x.domain(pc_dimensions);

  // Add grey background lines for context.
  background = coord_svg.append("g")
      .attr("class", "background")
      .attr("fill", "none")
      .attr("stroke", "#ddd")
      .attr("shape-rendering", "crispEdges")
    .selectAll("path")
      .data(coords)
    .enter().append("path")
      .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = coord_svg.append("g")
      .attr("class", "foreground")
      .attr("fill", "none")
    .selectAll("path")
      .data(coords)
    .enter().append("path")
      .attr("id", function(d, i) { return 'm' + d.Event.value.split(' ').join('') + 'idx' + i})
      // .attr("stroke", function(d) { return color(d['index']) })
      .attr("stroke", function(d, i) { return s_color(i) })
      .attr("stroke-width", 1.5)
      .attr("d", path)
      .on('click', function(d, i) { 
         // only applied to display of multiple matches
         // load_context(matches[d.Match.value]); 
      })
      .on('mouseover', function(d, i) { 
         var id_id = d.Event.value.split(' ').join(''); d3.select('#m' + id_id + 'idx' + i).style('stroke', 'yellow') 
         // ttip show players in match;
      })
      .on('mouseout', function(d, i)  { 
         var id_id = d.Event.value.split(' ').join(''); d3.select('#m' + id_id + 'idx' + i).style('stroke', s_color(i)) 
      });

  // Add a group element for each dimension.
  var g = coord_svg.selectAll(".dimension")
      .data(pc_dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + coord_x(d) + ")"; })
      .call(d3.behavior.drag()
        .origin(function(d) { return {x: coord_x(d)}; })
        .on("dragstart", function(d) {
          pc_dragging[d] = coord_x(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
          pc_dragging[d] = Math.min(width, Math.max(0, d3.event.x));
          foreground.attr("d", path);
          pc_dimensions.sort(function(a, b) { return position(a) - position(b); });
          coord_x.domain(pc_dimensions);
          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("dragend", function(d) {
          delete pc_dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + coord_x(d) + ")");
          transition(foreground).attr("d", path);
          background
              .attr("d", path)
            .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
        }));

  // Add an axis and title.
  g.append("g")
      .attr("class", "v axis")
      .each(function(d) { 
         if (d == 'Event') { d3.select(this).call(text_axis.scale(coord_y[d])) }
         else { d3.select(this).call(num_axis.scale(coord_y[d])); }
      })
    .append("text")
      .style("font-size", "10px") // vertical axes
      .style("text-anchor", "middle")
      // .attr("y", function(d, i) { return -30 + 17 * (Math.round(i/2) * 2 - i)  } )
      // .attr("x", function(d, i) { return -5 } )
      .attr("y", function(d, i) { return -25 } )
      .attr('transform', 'rotate(-20)')
      .on('click', function(d, i) { 
         // coords.map shows the values of the axis.  Could be used to graph
         // all values on an axis showing many matches, for instance
         // console.log(coords.map(function(p) { return p[d].value } )) 
      })
      .text(function(d) { return d; });

  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) {
        d3.select(this).call(coord_y[d].brush = d3.svg.brush().y(coord_y[d]).on("brushstart", brushstart).on("brush", brush));
      })
    .selectAll("rect")
      .attr("fill-opacity", ".3")
      .attr("stroke", "#fff")
      .attr("shape-rendering", "crispEdges")
      .attr("x", -8)
      .attr("width", 16);

   function position(d) {
     var v = pc_dragging[d];
     return v == null ? coord_x(d) : v;
   }

   function transition(g) {
     return g.transition().duration(500);
   }

   // Returns the path for a given data point.
   function path(d) {
     return pcoord_line(pc_dimensions.map(function(p) { return [position(p), coord_y[p](d[p].value)]; }));
   }

   function brushstart() {
     d3.event.sourceEvent.stopPropagation();
   }

   // Handles a brush event, toggling the display of foreground lines.
   function brush() {
     var actives = pc_dimensions.filter(function(p) { return !coord_y[p].brush.empty(); }),
         extents = actives.map(function(p) { return coord_y[p].brush.extent(); });
     foreground.style("display", function(d) {
       return actives.every(function(p, i) {
         return extents[i][0] <= d[p].value && d[p].value <= extents[i][1];
       }) ? null : "none";
     });
   }

   d3.select('div#pcoord').selectAll('.tick')
      .filter(function(d){ return typeof(d) != "string"; }) // use array of target values to filter !!
      .attr('font-size', '10px')

   d3.select('div#pcoord').selectAll('.tick')
      .filter(function(d){ return typeof(d) == "string"; }) // use array of target values to filter !!
      .attr('font-size', '20px')
      .on('click', function(d, i) { 
         if (i < 2 && match.players[0].indexOf(d) >= 0 || match.players[1].indexOf(d) >= 0) {
            display_pc(i)
         }
      });
}
