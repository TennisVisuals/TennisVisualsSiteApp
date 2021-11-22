(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-scale')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-scale'], factory) :
    (factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3));
}(this, (function (exports,d3Selection,d3Scale) { 'use strict';

function pulseCircle () {

    var width;  // in pixels
    var height; // in pixels
    var radius = 50;
    var duration = 1000;
    var stroke = 'black';
    var pulse_circles = 5;
    var stroke_width = 10;
    var delay_multiplier = 150;
    var color_range = ['white', 'blue'];
    var margins = { top: 0, right: 0, bottom: 0, left: 0 };

    function pulseCircle(selection) {

        var dims = selection.node().getBoundingClientRect();
        if (!height || !width) {
           radius = Math.min(width || dims.width, dims.width, height || dims.height, dims.height) * .45;
           stroke_width = radius / 3;
        }
        width = width || dims.width;
        height = height || dims.height;

        if (!height || !width) return;

        var color = d3.scaleLinear()
            .domain([100, 0])
            .range(color_range)
            .interpolate(d3.interpolateHcl);

        var colorFill = function(d) { return color(Math.abs(d % 20 - 10)); }

        var y = d3.scalePoint()
            .domain(d3.range(pulse_circles))
            .range([0, height]);

        var z = d3.scaleLinear()
            .domain([10, 0])
            .range(["hsl(240, 90%, 100%)", "hsl(240,90%,40%)"])
            .interpolate(d3.interpolateHcl);

        var svg = selection.append('svg')
            .attr('width', width)
            .attr('height', height);

        var g = svg.append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        g.selectAll("circle")
           .data(y.domain())
           .enter().append("circle")
             .attr("fill", "#000")
             .attr("stroke", stroke)
             .attr("stroke-width", stroke_width + "px")
             .attr("r", 0)
             .attr("cx", width/2)
             .attr("cy", height/2)
             .style("fill", colorFill)
           .transition()
             .duration(duration)
             .delay(function(d) { return d * delay_multiplier; })
             .on("start", function repeat() {
                 d3.active(this)
                     .attr("r", radius)
                     .attr('stroke-width', "0px")
                   .transition()
                     .attr("r", 0)
                     .attr('stroke-width', stroke_width + "px")
                   .transition()
                     .on("start", repeat);
             });

    }

    pulseCircle.height = function (_) { return arguments.length ? (height = _, pulseCircle) : height; };
    pulseCircle.width = function (_) { return arguments.length ? (width = _, pulseCircle) : width; };
    pulseCircle.duration = function (_) { return arguments.length ? (duration = _, pulseCircle) : duration; };
    pulseCircle.pulse_circles = function (_) { return arguments.length ? (pulse_circles = _, pulseCircle) : pulse_circles; };
    pulseCircle.radius = function (_) { return arguments.length ? (radius = _, pulseCircle) : radius; };
    pulseCircle.delay_multiplier = function (_) { return arguments.length ? (delay_multiplier = _, pulseCircle) : delay_multiplier; };
    pulseCircle.stroke_width = function (_) { return arguments.length ? (stroke_width = _, pulseCircle) : stroke_width; };
    pulseCircle.color_range = function (_) { return arguments.length ? (color_range = _, pulseCircle) : color_range; };

    return pulseCircle;
}

exports.pulseCircle = pulseCircle;

Object.defineProperty(exports, '__esModule', { value: true });

})));
