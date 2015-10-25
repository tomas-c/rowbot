var graph = {};

graph.totalPoints = 100;
graph.updateInterval = 100;
graph.mean_data = new Array(graph.totalPoints);
graph.acceleration_data_1 = new Array(graph.totalPoints); // Array of numbers
graph.acceleration_data = [
  { data: graph.acceleration_data_1, label: "Rower 1" }
  //, { data: graph.acceleration_data_2, label: "Rower 2" }
];

/*
function getTime(device) {
  // Grabs reading from device, returns timestamp
}

function getStartTimes(devices) {
  var startTimes = {};
  for (var device in devices) {
    startTimes[device] = getTime(device);
  }
  return startTimes;
}

var startTimes = getStartTimes();
*/

graph.acceleration_options = {
  series: {
    lines: {
      show: true,
      lineWidth: 1.2,
      fill: false
    },
    shadowSize: 0	// Drawing is faster without shadows
  },
  yaxis: {
    min: 0,
    max: 20
  },
  xaxis: {
    mode: "time",
    show: false,
    tickSize: [0.1, "second"],
    tickFormatter: function (v, axis) {
      var date = new Date(v);

      if (date.getSeconds() % 5 == 0) {
          var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
          var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

          return hours + ":" + minutes + ":" + seconds;
      } else {
          return "";
      }
    },
    axisLabel: "Time",
    axisLabelUseCanvas: true,
    axisLabelFontSizePixels: 12,
    axisLabelFontFamily: 'Verdana, Arial',
    axisLabelPadding: 10
  }
}

graph.takeReadings = function(newData) {//, dataSet) {
  /*
    newData: Array of datapoints, with attributes t, x, y, z
    dataSet: Array of [timeStamp, magnitude]
  */
  var dataSet = graph.acceleration_data_1;
  for (var i=0; i<newData.length; i++) {
    var data = newData[i];
    graph.pushValue(data.t,
                    graph.calculateMagnitude({ x: data.x, y: data.y, z: data.z }),
                    dataSet);
  }
}

graph.pushValue = function(x, y, dataSet) {
  //x = new Date().getTime();
  dataSet.push([x, y]);
  dataSet.shift();
}

graph.calculateMagnitude = function(v) {
  return Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
}
/*
graph.countPeaks = function(dataSet) {
  if (dataSet[0] == null) {
    return
  }
  var threshold = 13;
  var numPeaks = 0;
  var climbing = false;

  for (var i=0; i<dataSet.length; i++) {
    if (dataSet[i][1] > threshold && !climbing) {
      climbing = true;
      numPeaks += 1;
    }
    else if (dataSet[i][1] < threshold && climbing) {
        
      }
  }
}
*/
graph.lowPassFilter = function(data) {
  if (data[0] == null) {
    return [];
  }
  var x0 = 9.8;
  var alpha = 0.3;
  var smoothed = [];
  
  for (var i=0; i<data.length; i++) {
    smoothed.push([data[i][0], (alpha * data[i][1]) + (1.0 - alpha) * x0]);
    x0 = smoothed[i][1];
  }
  return smoothed;
}

graph.update = function() {
  $.plot($("#acceleration"), graph.acceleration_data, graph.acceleration_options);
  //graph.countPeaks(graph.acceleration_data_1);
  //graph.mean_data = graph.lowPassFilter(graph.acceleration_data_1);
  //$.plot($("#mean"), [graph.mean_data], graph.acceleration_options);
  setTimeout(graph.update, graph.updateInterval);
}
