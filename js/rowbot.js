VelocityPlotter = function() {
	this.t = 0;
	this.v = {x:0,y:0,z:0};

	this.plot = function(x, y) {
		console.log('Please implement this.');
	}

	this.update = function(acc, dt) {
		// May need to add angular velocity
		this.t += dt;

		// numerical integration
		//this.v += acc*dt;
		this.v.x += acc.x*dt;
		this.v.y += acc.y*dt;
		this.v.z += acc.z*dt;

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

	this.update = function(acc, ang, dt) {
		this.t += dt;

		// numerical integration
		//this.v += acc*dt;
		this.v.x += acc.x*dt;
		this.v.y += acc.y*dt;
		this.v.z += acc.z*dt;

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