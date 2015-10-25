var graph = {};

graph.totalPoints = 100;
graph.updateInterval = 100;


graph.stroke_impulse_data_1 = new Array(graph.totalPoints);
graph.smooth_data_1 = new Array(graph.totalPoints);
graph.acceleration_data_1 = new Array(graph.totalPoints);

graph.stroke_impulse_data_2 = new Array(graph.totalPoints);
graph.smooth_data_2 = new Array(graph.totalPoints);
graph.acceleration_data_2 = new Array(graph.totalPoints);

graph.deviceToDataArray = { "rowbot2": graph.acceleration_data_1,
                            "rowbot3": graph.acceleration_data_2 };
graph.acceleration_data = [
  { data: graph.acceleration_data_1, color: "#00CCFF", xaxis: 1 },
  { data: graph.acceleration_data_2, xaxis: 2 }
];

graph.smooth_data = [
  { data: graph.smooth_data_1, color: "#00CCFF" },
  { data: graph.smooth_data_2 }
];

graph.stroke_impulse_data = [
  { data: graph.stroke_impulse_data_1, color: "#00CCFF" },
  { data: graph.stroke_impulse_data_2 }
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
time_options = {
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
};
graph.acceleration_options = {
  grid: {
    borderWidth: 0,
    backgroundColor: "#5F5F5F"
  },
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
    max: 20,
    tickLength: 0,
    show: false
  },
  xaxes: [time_options, time_options],
  hooks: {
    draw: function(plot, canvasctx) {
      canvasctx.font = "100 25px roboto";
      canvasctx.fillStyle = "white";
      canvasctx.fillText("rowers", 20, 40);
    }
  }
}

graph.takeReadings = function(newData, deviceName) {//, dataSet) {
  /*
    newData: Array of datapoints, with attributes t, x, y, z
    dataSet: Array of [timeStamp, magnitude]
  */
  var dataSet = graph.deviceToDataArray[deviceName];
  
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

graph.dipsPerMinute = function(accelerationData, strokeData) {
  if (accelerationData[0] == null) {
    return
  }
  var timePeriod = accelerationData[accelerationData.length-1][0] - accelerationData[0][0];
  var threshold = 7.9;
  var numDips = 0;
  var climbing = false;

  for (var i=0; i<accelerationData.length; i++) {
    strokeData[i] = [accelerationData[i][0], 0];
    if (accelerationData[i][1] < threshold && !climbing) {
      climbing = true;
      numDips += 1;
      strokeData[i][1] = 10;
    }
    else if (accelerationData[i][1] > threshold && climbing) {
        climbing = false;
    }
  }
  
  return numDips/timePeriod * 1000 * 60;
}

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
  
  graph.smooth_data_1 = graph.lowPassFilter(graph.acceleration_data_1);
  graph.smooth_data_2 = graph.lowPassFilter(graph.acceleration_data_2);
  $.plot($("#smooth"), graph.smooth_data, graph.acceleration_options);

 // hyper.log(graph.dipsPerMinute(graph.smooth_data));
  $('#spm').text("" + (Math.round(graph.dipsPerMinute(graph.smooth_data_2, graph.stroke_impulse_data_2)) || 0) + " strokes per minute");
  $('#spm').text("" + (Math.round(graph.dipsPerMinute(graph.smooth_data_1, graph.stroke_impulse_data_1)) || 0) + " strokes per minute");
  $.plot($("#mean"), graph.stroke_impulse_data, graph.acceleration_options);
  setTimeout(graph.update, graph.updateInterval);
}
