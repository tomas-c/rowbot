var totalPoints = 100;
var updateInterval = 100;
var acceleration_data_1 = new Array(totalPoints);
var data = [
  { data: acceleration_data_1, label: "Rower 1" }
  //, { data: acceleration_data_2, label: "Rower 2" }
]

/* // TODO?
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

var peaks = new Array(totalPoints);

var options = {
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

function pushValue(x, y, dataSet) {
  //x = new Date().getTime();
  dataSet.push([x, y]);
  dataSet.shift();
}

function updateGraph() {
  $.plot($("#acceleration"), data, options);
  $.plot($("#peaks"), [peaks], options);
  setTimeout(updateGraph, updateInterval);
}
