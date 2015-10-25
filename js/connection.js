// JavaScript code for the mbed ble scan app

// Short name for EasyBLE library.
var easyble = evothings.easyble;

// Name of device to connect to
var MyDeviceName = "rowbot2";

// Object that holds application data and functions.
var connection = {};

// Device of type evothings.easyble.EasyBLEDevice
var GDevice;

// The default UUID suffix when we use short UUIDs in C mbed
defaultCharUUIDSuffix = "-0000-1000-8000-00805f9b34fb";

// The client characteristic descriptor as defined in the BLE spec
clientCharDescriptorUUID = "00002902-"+defaultCharUUIDSuffix;

// Characteristic UUIDs
var charUUIDs = {
	"acceleration": "0000a001" + defaultCharUUIDSuffix,
	"angvelocity": "0000a002" + defaultCharUUIDSuffix,
	"time": "0000a004" + defaultCharUUIDSuffix
};

connection.notificationCallback = function () {};

/*
 * Takes in a callback function that is called whenever we get new data from sensro.
 * function([{x: float, y: float, z: float, t: int32}])
*/
connection.setCallback = function(callback) {
	connection.notificationCallback = callback;
}

/*
 * Initialise the application.
*/
connection.initialize = function()
{
	document.addEventListener(
		'deviceready',
		function() { evothings.scriptsLoaded(connection.onDeviceReady) },
		false);
};

/*
 * when low level initialization complete, 
 * this function is called
*/
connection.onDeviceReady = function()
{
	// report status
	connection.showInfo('Device Ready!');
	
	// call stop before you start, just in case something else is running
	easyble.stopScan();
	easyble.closeConnectedDevices();
	
	// only report devices once
	easyble.reportDeviceOnce(true);
	connection.startScan();
	connection.showInfo('Status: Scanning...');
};


/*
 * print debug info to console and application
*/
connection.showInfo = function(info)
{
	if (document.getElementById('info')) {
		document.getElementById('info').innerHTML = info;
	}
	console.log(info);
};

/*
 * Scan all devices and report
*/
connection.startScan = function() {
	easyble.startScan(
		function(device)
		{
			// do not show un-named beacons
			if(!device.name){
				return 0;}
			
			// print "name : mac address" for every device found
			console.log(device.name.toString() +" : "+device.address.toString().split(":").join(''))

			// If my device is found connect to it
			if (device.name == MyDeviceName)
			{
				connection.showInfo('Status: Device found: ' + device.name + '.');
				easyble.stopScan();
				connection.connectToDevice(device);
			}
		},
		function(errorCode)
		{
			connection.showInfo('Error: startScan: ' + errorCode + '.');
			//app.reset();
		});
};

/*
 * Read services for a device.
*/
connection.connectToDevice = function(device)
{
	console.log("Starting ConnectToDevice")
	connection.showInfo('Connecting...');
	device.connect(
		function(device)
		{
			GDevice = device;
			connection.showInfo('Status: Connected');
			connection.readServices(GDevice);
			// For some reason the characteristic doesn't exist, probably due to readServices interaction
			setTimeout(connection.enableNotification,1000);
		},
		function(errorCode)
		{
			connection.showInfo('Error: Connection failed: ' + errorCode + '.');
			evothings.ble.reset();
			// This can cause an infinite loop...
			//app.connectToDevice(device);
		});
};

/*
 * Dump all information on named device to the console
*/ 
connection.readServices = function(device)
{
	//read all services
	device.readServices(
		null,
		// Function that prints out service data.
		function(winCode)
		{
			console.log("ReadServices Success");
		},
		function(errorCode)
		{
			console.log('Error: Failed to read services: ' + errorCode + '.');
		});
};

/*
 * convert base64 to array to hex.
*/ 
connection.getHexData = function(data)
{
	if(data){ // sanity check
		return evothings.util.typedArrayToHexString(evothings.util.base64DecToArr(data))	
	}
}

/*
 * Read characteristics
 */
connection.enableNotification = function() {
	hyper.log("Enabling notifications..")

	GDevice.writeDescriptor(charUUIDs["acceleration"], 
                        "00002902"+defaultCharUUIDSuffix, 
                        new Uint8Array([1,0]),
                        function () {
                            hyper.log("enabled notifications")
                        },
                        function (err) {
                            hyper.log(err);
                            hyper.log("failed to write descriptor")
                        });
	GDevice.enableNotification(charUUIDs["acceleration"],
		function(data) {
			var accelData = [];
			var accelDatum = {};
			var i = 0;
		//	hyper.log("acceleration notification received")
			var dataView = new DataView(data);
	//		hyper.log("Received acceleration ArrayBuffer length: " + data.byteLength);
			while (i<data.byteLength) {
				accelDatum = {};

				// Every 1st to 3rd value are float data
				// set true for little-endian
				accelDatum.x = dataView.getFloat32(i, true);
				i += 4;
				accelDatum.y = dataView.getFloat32(i, true);
				i += 4;
				accelDatum.z = dataView.getFloat32(i, true);
				i += 4;
				// Every 4th value is a timestamp
				accelDatum.t = dataView.getUint32(i, true);
				i += 4;
				
				accelData.push(accelDatum);
			}

			connection.notificationCallback(accelData);
		}, function(err) {
			hyper.log(err)
		});
};


// Initialize the app.
connection.initialize();
