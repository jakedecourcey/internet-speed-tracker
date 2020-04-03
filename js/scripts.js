
function filterDataByTime(data, range){
    speedValues = [];
    jsonData.reverse();
    for (i = 0; i < data.length; i++) {
        timestamp = jsonData[i].timestamp.slice(0,-11).replace("T", " ");
        speed = (Math.round((Number(data[i].download)) / 1000 / 1000));
        latency = Math.round(Number(data[i].ping));
        speedValues.push(speed);
        appendToList(timestamp, latency, speed);
    }
    printAverageSpeed(speedValues);

    //for listing in data, delete if older than today - range
}

function appendToList(timestamp, latency, speed){
    d3.select("#data").append("p").text(timestamp + " | " + latency + " ms | " + speed + " Mbps");
}

function printAverageSpeed(values){
    d3.select("h2").text("Average: " + Math.round(values.reduce((a,b) => a + b, 0) / values.length) + " Mbps");
}

function main(){
    setInterval(fetchData(), 60000);
}

function fetchData(time){
    var allData = new XMLHttpRequest();
    allData.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            jsonData = JSON.parse(allData.responseText.slice(0,-2).concat("]"));
            timeFilteredData = filterDataByTime(jsonData, time) 
            //list data for now
            //visualize later
        } 
    }
    allData.open("GET", "data/data.json", true);
    allData.send();
}
