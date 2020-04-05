function listData(data, range){
    onlySpeedsForAverage = [];
    data.reverse();
    for (i = 0; i < data.length; i++) {
        values = {};
        if (data[i].timestamp) {values.timestamp = data[i].timestamp.slice(0,16).replace("T", " ")};
        if (data[i].download) {
            values.speed = (Math.round((Number(data[i].download)) / 1000 / 1000))
            onlySpeedsForAverage.push(values.speed)};
        if (data[i].ping) {values.latency = Math.round(Number(data[i].ping))};
        appendToList(values);
    }
    printAverageSpeed(onlySpeedsForAverage);
}

function appendToList(values){
    if (values.speed) {
        d3.select("#data").append("p").text(values.timestamp + " | " + values.latency + " ms | " + values.speed + " Mbps");}
    else {
        d3.select("#data").append("p").text(values.timestamp + " | no data | no data");}
}

function printAverageSpeed(values){
    d3.select("h2").text("Average: " + Math.round(values.reduce((a,b) => a + b, 0) / values.length) + " Mbps");
}

function formatForGraph(data){
    for (i = 0; i < data.length; i++){ 
        data[i].download = Math.round((Number(data[i].download)) / 1000 / 1000);
        data[i].timestamp = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ")(data[i].timestamp);
    }
    return data;
} 

function graphData(data){

    // set dimensions of graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 660 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#chart")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
     // prep data 
    data = formatForGraph(data);

    // Add X axis --> it is a date format
     var x = d3.scaleTime()
       .domain(d3.extent(data, function(d) { return d.timestamp; }))
       .range([ 0, width ]);
     svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x));

     // Add Y axis
     var y = d3.scaleLinear()
       .domain([0, d3.max(data, function(d) { return +d.download; })])
       .range([ height, 0 ]);
     svg.append("g")
       .call(d3.axisLeft(y));

      // Add the line
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "whitesmoke")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .defined(function (d) { return d.download !== null; })
          .x(function(d) { return x(d.timestamp) })
          .y(function(d) { return y(d.download) })
          )
}

function displayData(jsonData, error){
    //listData(jsonData); 
    graphData(jsonData);
}

function fetchData(){
    d3.selectAll("p").remove();
    d3.selectAll("svg").remove();
    d3.json("data/data.json", displayData(error, data));
    setInterval(fetchData, 60000);
 }
