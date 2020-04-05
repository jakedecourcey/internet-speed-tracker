var view = 3;
var today = new Date();
today.setHours(today.getHours() + 4);
var span = new Date();
span.setDate(span.getDate() - view);
//------------------------1. PREPARATION-------------------------//
//-----------------------------SVG-------------------------------//
const width = 840;
const height = 500;
const margin = 25;
const padding = 5;
const adj = 50;
// we are appending SVG first
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
    return data.timestamp < span;
}

async function main(){
    dataset = await d3.json("data/data.json");
    console.log(dataset);
    dataset.forEach(function(item){
        item.download = Math.round(Number(item.download) / 1000 / 1000);
        item.timestamp = d3.timeParse("%Y-%m-%dT%H:%M")(item.timestamp.slice(0,16));
    })
    dataset.filter(filterByDate);
    prepScales(dataset);
    drawGraph(dataset);
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
                return d.download + 20; })
            ]);

//-----------------------------AXES------------------------------//
    yaxis = d3.axisLeft().scale(yScale); 
    xaxis = d3.axisBottom()
    .ticks(d3.timeDay.every(view/7))
    .tickFormat(d3.timeFormat('%m-%d'))
    .scale(xScale);
}

//----------------------------LINES------------------------------//
   

//-------------------------2. DRAWING----------------------------//
function drawGraph(dataset){
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
      .attr("fill", "whitesmoke")
      .attr("stroke", "whitesmoke")
      .attr("stroke-width", 1.5)
      .attr("stroke-miterlimit", 1)
      .attr("d", d3.area()
        .x(function(d) { return xScale(d.timestamp) })
        .y0(yScale(0))
        .y1(function(d) { return yScale(d.download) }))
}
