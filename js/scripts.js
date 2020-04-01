function fetchData(){
    var allData = new XMLHttpRequest();
    allData.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            showData(JSON.parse(allData.responseText));
        } 
    };
    allData.open("GET", "data.json", true);
    allData.send();
}

function showData(data){
    document.getElementById("dataList").innerHTML += "<br />" + data.timestamp + " - " + convertToMbps(data.download) + " Mbps";
}

function convertToMbps(bps){
    return (Number(bps) / 1000 / 1000).toFixed(2);
}
