;(function()
{
	var sensortag = {};
	app.sensortag = sensortag;

	sensortag.services = []

	sensortag.createInstance = function()
	{
		var instance = {};

		instance.deviceHandle = null;

		instance.connectToDevice = function(address, callback)
		{
			ble.connect(address, function(r)
			{
				instance.deviceHandle = r.deviceHandle;
				console.log('connect '+r.deviceHandle+' state '+r.state);
				if (r.state == 2)  { // connected
					instance.onConnect();
				}
			}, function(errorCode)
			{
				console.log('connect error: ' + errorCode);
			});
		}

		instance.onConnect = function() {
			console.log('connected to '+instance.deviceHandle);
			instance.readServices();
		}

		instance.readServices = function() {
			ble.services(instance.deviceHandle, function(services)
			{
				instance.services = services;
				for (var i = 0; i < services.length; i++)
				{
					var service = services[i];
					console.log('BLE service: ');
					console.log('  ' + service.handle);
					console.log('  ' + service.uuid);
					console.log('  ' + service.serviceType);
				}
			},
			function(errorCode)
			{
				console.log('BLE services error: ' + errorCode);
			});
		}

		// Finally, return the SensorTag instance object.
		return instance;
	}
})()