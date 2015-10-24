/** BLE plugin, is loaded asynchronously so the
	variable is redefined in the onDeviceReady handler. */
var ble = null;

// Application object.
var app = {};

app.isScanning = false;

app.sensors = [];

// Application Constructor
app.initialize = function()
{
	this.bindEvents();
};

// Bind Event Listeners
//
// Bind any events that are required on startup. Common events are:
// 'load', 'deviceready', 'offline', and 'online'.
app.bindEvents = function()
{
	document.addEventListener('deviceready', this.onDeviceReady, false);
};

// deviceready Event Handler
//
// The scope of 'this' is the event. In order to call the 'receivedEvent'
// function, we must explicity call 'app.receivedEvent(...);'
app.onDeviceReady = function()
{
	// The plugin was loaded asynchronously and can here be referenced.
	ble = evothings.ble;
	app.startLeScan();
};

app.startLeScan = function()
{
	app.stopLeScan();

	console.log('Starting scan...');
	app.isScanning = true;
	app.lastScanEvent = new Date();
	//app.runScanTimer();

	console.log('scanning');
	ble.startScan(function(r)
	{
		if(r.address == "CD:AB:CD:AB:CD:AB") {
			var sensor = app.sensortag.createInstance();

			sensor.connectToDevice(r.address);

			app.sensors.push(sensor);
			app.stopLeScan();
		}
		console.log(JSON.stringify(r));
	}, function(errorCode)
	{
		console.log('startScan error: ' + errorCode);
	});
};

app.stopLeScan = function()
{
	console.log('Stopping scan...');
	ble.stopScan();
	app.isScanning = false;
	clearTimeout(app.scanTimer);
};