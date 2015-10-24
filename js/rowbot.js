var grav = {x: 0, y:0, z: 0};

function exclude_gravity(accel) {
	var alpha = 0.8;
	var new_accel = {x: 0, y: 0, z: 0};

	// alpha is calculated as t / (t + dT)
	// with t is low-pass filter's time-constant
	// and dT, the event delivery rate
	grav.x = alpha*grav.x + (1-alpha)*accel.x;
	grav.y = alpha*grav.y + (1-alpha)*accel.y;
	grav.z = alpha*grav.z + (1-alpha)*accel.z;

	new_accel.x = accel.x - grav.x;
	new_accel.y = accel.y - grav.y;
	new_accel.z = accel.z - grav.z;

	return new_accel;
}

VelocityPlotter = function() {
	this.t = 0;
	this.v = {x:0,y:0,z:0};

	this.plot = function(x, y) {
		console.log('Please implement this.');
	}

	this.update = function(acc, dt) {
		// May need to add angular velocity
		var new_acc = exclude_gravity(acc);
		this.t += dt;

		// numerical integration
		//this.v += acc*dt;
		this.v.x += new_acc.x*dt;
		this.v.y += new_acc.y*dt;
		this.v.z += new_acc.z*dt;

		// magnitude
		// magnitude = Math.sqrt(Math.pow(this.v.x, 2) + Math.pow(this.v.y, 2) + Math.pow(this.v.z, 2));
		// this.plot(this.t, magnitude);
	}

	return this;
}

PositionPlotter = function() {
	this.t = 0;
	this.v = {x:0,y:0,z:0};
	this.p = {x:0,y:0,z:0};

	this.plot = function(x, y) {
		console.log('Please implement this.');
	}

	this.update = function(acc, dt) {
		var new_acc = exclude_gravity(acc);
		this.t += dt;

		// numerical integration
		//this.v += acc*dt;
		this.v.x += new_acc.x*dt;
		this.v.y += new_acc.y*dt;
		this.v.z += new_acc.z*dt;

		// this.p += this.v*dt;
		this.p.x += this.v.x*dt;
		this.p.y += this.v.y*dt;
		this.p.z += this.v.z*dt;


		//this.plot(this.t, this.p);
		// magnitude
		// magnitude = Math.sqrt(Math.pow(this.p.x, 2) + Math.pow(this.p.y, 2) + Math.pow(this.p.z, 2));
		// this.plot(this.t, magnitude);
	}

	return this;
}

calculateMagnitude = function(v) {
  return Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
}
// -------------------------------- //
// MEDIAN FILTER //

// function median_filter (arr, wl) {
//     function median(arr) {
//         var s = arr.slice().sort(function(a,b){
//             return a - b;
//         });
//         return s[Math.floor((s.length - 1) / 2)];
//     }

//     wl = wl || 3;

//     if (arr.length < wl) {
//         return arr;
//     }

//     var f = [];
//     var w = [];
//     var i;

//     w.push(arr[0]);
//     for (i = 0; i < arr.length; i++) 
//     {
//         if (arr.length - 1 >= i + Math.floor(wl / 2))
//             w.push(arr[i + Math.floor(wl / 2)]);
//         f.push(median(w));
//         if (i >= Math.floor(wl / 2))
//             w.shift();
//     }

//     return f;
// };