'use strict';

var letterAnimationMap = {
    'a': function() {cluster()},
    'b': function() {bundle()},
    'c': function() {circleGrid()},
    'd': function() {chord()},
    'e': function() {explode()},
    'f': function() {force()},
    'g': function() {smile()},
    'h': function() {hexBurst()},
    'i': function() {implode()},
    'j': function() {partition()},
    'k': function() {spiral()},
    'l': function() {flash()},
    'm': function() {wink()},
    'n': function() {stripes()},
    'o': function() {rainbow()},
    'p': function() {pack()},
    'q': function() {suckedIn()},
    'r': function() {raindrop()},
    's': function() {stipple()},
    't': function() {takeOff()},
    'u': function() {tree()},
    'v': function() {treemap()},
    'w': function() {wiggle()},
    'x': function() {stack()},
    'y': function() {pie()},
    'z': function() {zigzag()}
}

var svgContainer = d3.select("svg");
var svgHeight;
var svgWidth;
resetSVGDims();

function getRandomInt(min, max) {
    var min = Math.ceil(min);
    var max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function chooseRandomDim(max, offset) {
    var offset = offset || 0;
    var random = getRandomInt(0, max);

    if (offset !== 0) {
        random += offset;
    }

    return random;
}

function chooseRandomSizeMultiple() {
    return getRandomInt(1, 50);
}

function chooseRandomSizeOne() {
    return getRandomInt(25, 300);
}

function chooseRandomColor() {
    var colors = getThemeColors(currentTheme);
    var index = getRandomInt(0, colors.length);

    return colors[index];
}


function makeMoreChildren(maxDepth, currentDepth) {
    var random = getRandomInt(0, 5);
    var children = [];
    currentDepth++;

    for (var i = 0; i < random; i++) {
        var shouldMakeChild = getRandomInt(0, 2);

        if (shouldMakeChild === 1) {
            var child = makeTreeData(maxDepth, currentDepth);

            if (child) {
                children.push(child);
            }
        }
    }

    currentDepth--;
    return children;
}

function makeTreeData(maxDepth, currentDepth) {
    var data = {'name': chooseRandomColor()};

    if (currentDepth < maxDepth) {
        data.children = makeMoreChildren(maxDepth, currentDepth);
    }

    return data;
}

function cluster() {
    var radius = 15;
    var treeData = makeTreeData(6, 0);
    var chart = svgContainer.append("svg:g");

    var layout = d3.layout.cluster().size([(svgHeight-(radius*2)),(svgWidth-(radius*2))]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var nodes = layout.nodes(treeData);
    var links = layout.links(nodes);

    var link = chart.selectAll("pathlink")
                    .data(links)
                    .enter().append("svg:path")
                    .attr("class", "link")
                    .attr("d", diagonal);

    var node = chart.selectAll("g.node")
                    .data(nodes)
                    .enter().append("svg:g")
                    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
                    .attr("fill", function(d) { return d.name; });

    node.append("svg:circle")
        .attr("r", radius);

    setTimeout(function() {
        chart.attr('class', 'magictime puffOut');
    }, 1000);

}

function bundle() {

}


function makeCircle(radius, x, y) {
    var circle = svgContainer.append("circle")
        .attr("cy", y)
        .attr("cx", x)
        .attr("r", radius);

    return circle;
}

function makeCircleWithVanish(radius, x, y) {
    var fill = chooseRandomColor();
    var circle = makeCircle(radius, x, y);
    circle.attr("fill", fill);

    var randomTimeout = getRandomInt(1, 1500);
    setTimeout(function() {
        circle.attr('class', 'magictime vanishOut');
    }, randomTimeout);
}

function circleGrid() {
    var numCircles = 6;
    var radius = chooseRandomSizeMultiple();

    var offset = radius * numCircles * -1;
    var x = chooseRandomDim(svgWidth, offset);
    var y = chooseRandomDim(svgHeight, offset);
    var original_y = y;

    for (var i = 0; i < numCircles; i++) {
        y = original_y;

        for (var j = 0; j < numCircles; j++) {
            makeCircleWithVanish(radius, x, y);
            y += (radius*2) + 2;
        }

        x += (radius*2) + 2;
    }
}


function chord() {

}


function explode() {

}


function force() {

}


function smile() {

}


function makeHexagon(radius, x, y, fill) {
    var h = (Math.sqrt(3)/2),
        hexagonData = [
          { "x":  radius+x,   "y": y}, 
          { "x":  radius/2+x, "y": radius*h+y},
          { "x": -radius/2+x, "y": radius*h+y},
          { "x": -radius+x,   "y": y},
          { "x": -radius/2+x, "y": -radius*h+y},
          { "x":  radius/2+x, "y": -radius*h+y}
        ];

    var drawHexagon = 
        d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate("cardinal-closed")
            .tension("1");

    var enterElements = svgContainer.append("path")
                                    .attr("d", drawHexagon(hexagonData))
                                    .attr("fill", fill)
                                    .attr('class', 'magictime puffOut');
}

function hexBurst() {
    for (var i = 0; i < 15; i++){
        var x = chooseRandomDim(svgWidth);
        var y = chooseRandomDim(svgHeight);
        var radius = chooseRandomSizeMultiple();
        var fill = chooseRandomColor();

        makeHexagon(radius, x, y, fill);
    }
}


function implode() {

}


function partition() {

}


function spiral() {

}


function flash() {
    var flashColor = chooseRandomColor();

    $('body').css("background-color", flashColor);
    setTimeout(function() {
        updateBgColor(currentTheme);
    }, 400);
}


function wink() {

}


function stripes() {

}


function rainbow() {

}


function pack() {

}


function suckedIn() {
    var x = svgWidth/2;
    var y = svgHeight/2;
    var radius = chooseRandomSizeOne();
    var stroke = chooseRandomColor();

    var circle = makeCircle(radius, x, y);
    circle.attr('fill', 'transparent')
          .attr("stroke", stroke)
          .attr("stroke-width", 10)
          .attr("stroke-dasharray","20,5");

    setTimeout(function() {
        circle.attr('class', 'magictime spaceOutUp');
    }, 1000);
}


function raindrop() {

}


function stipple() {

}


function takeOff() {
    var x = chooseRandomDim(svgWidth);
    var y = chooseRandomDim(svgHeight);
    var radius = chooseRandomSizeOne();
    var fill = chooseRandomColor();

    var circle = makeCircle(radius, x, y);
    circle.attr('fill', fill);

    setTimeout(function() {
        circle.attr('class', 'magictime tinRightOut');
    }, 1000);
}


function tree() {

}


function treemap() {

}


function wiggle() {

}


function stack() {

}


function pie(){

}


function zigzag() {

}



function resetSVGDims(evt){
    svgWidth = svgContainer[0][0]['clientWidth'];
    svgHeight = svgContainer[0][0]['clientHeight'];
}

$(window).resize(resetSVGDims);