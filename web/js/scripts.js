var view;
var today;
var span;
var tickIncrement;
var tickLabel;

function changeView(length){
    view = length;
    today = new Date();
    today.setHours(today.getHours() + 4);
    span = new Date();
    span.setDate(span.getDate() - view);
    if (view <= 2) {
        tickIncrement = 3;
        tickLabel = '%H00';
    }
    else if (view <=7) {
        tickIncrement = 24
        tickLabel = '%d';
    }
    else {
        tickIncrement = 72;
        tickLabel = '%d';
    }
    main();
}

function printAverageSpeed(dataset){
    d3.select("#avg").text("Average Speed: " + Math.round(dataset.reduce((a, b) => a + b, 0)/dataset.length) + " Mbps");
}

//------------------------1. PREPARATION-------------------------//
//-----------------------------SVG-------------------------------//
const width = 840;
const height = 500;
const margin = 25;
const padding = 5;
const adj = 50;
const svg = d3.select("#chart").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-"
          + adj + " -"
          + adj + " "
          + (width + adj *3) + " "
          + (height + adj*3))
    .style("padding", padding)
    .style("margin", margin)
    .classed("svg-content", true);

//-----------------------------DATA------------------------------//
function filterByDate(data){
    return data.timestamp > span;
}

async function main(){
    let speedOnly = [];
    dataset = await d3.json("data/data.json");
    dataset.forEach(function(item){
        item.download = Math.round(Number(item.download) / 1000 / 1000);
        item.timestamp = d3.timeParse("%Y-%m-%dT%H:%M")(item.timestamp.slice(0,16));
        speedOnly.push(item.download);
    })
    dataset = dataset.filter(filterByDate);
    dataset.forEach(function(item){
        speedOnly.push(item.download);
    });
    prepScales(dataset);
    drawGraph(dataset);
    printAverageSpeed(speedOnly);
}

//----------------------------SCALES-----------------------------//
var xScale;
var yScale;
var yaxis;
var xaxis;
var line;

function prepScales(dataset){
    xScale = d3.scaleUtc().range([0,width]).domain([span, today]).nice();
    yScale = d3.scaleLinear().rangeRound([height, 0]).domain([(0), d3.max(dataset, function(d) {
                return d.download + 10; })
            ]);

//-----------------------------AXES------------------------------//
    yaxis = d3.axisLeft().scale(yScale); 
    xaxis = d3.axisBottom()
    .ticks(d3.utcHour.every(tickIncrement))
    .tickFormat(d3.timeFormat(tickLabel))
    .scale(xScale);
}

//-------------------------2. DRAWING----------------------------//
function drawGraph(dataset){
    d3.selectAll("g").remove();
    d3.selectAll("path").remove();
//-----------------------------AXES------------------------------//
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis);
       
    svg.append("g")
        .attr("class", "axis")
        .call(yaxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", ".75em")
        .attr("y", 6)
        .style("text-anchor", "end")
        .text("Mbps");

//----------------------------LINES------------------------------//
    svg.append("path")
        .datum(dataset)
        .attr("fill", "none")
        .attr("stroke", "#BF9A78")
        .attr("stroke-width", 3.5)
        .attr("stroke-miterlimit", 1)
        .attr("stroke-linejoin", "round")
        .attr("d", d3.line()
          .x(function(d) { return xScale(d.timestamp) })
          .y(function(d) { return yScale(d.download) }))
}
