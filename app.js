var vertexShaderText =
		[
			'precision mediump float;',
			'',
			'attribute vec3 vertPosition;',
			'attribute vec2 textCoord;',
			'varying vec2 fragTextCoord;',
			'uniform mat4 worldMatrix;',
			'uniform mat4 lockmatrix;',
			'uniform mat4 viewMatrix;',
			'uniform mat4 projMatrix;',
			'uniform mat4 rotateMatrix;',
			'uniform mat4 flipMatrix;',
			'uniform mat4 orientationMatrix;',
			'uniform mat4 shakingMatrix;',
			'',
			'void main()',
			'{',
			'  fragTextCoord = textCoord;',
			'  gl_Position = projMatrix*shakingMatrix*orientationMatrix*viewMatrix*flipMatrix*lockmatrix*worldMatrix*rotateMatrix*vec4(vertPosition, 1.0);',
			'}'
		].join('\n');
var fragmentShaderText =
		[
			'precision mediump float;',
			'',
			'varying vec2 fragTextCoord;',
			'uniform sampler2D sampler;',
			'void main()',
			'{',
			'  gl_FragColor = texture2D(sampler,fragTextCoord);',
			'}'
		].join('\n');
var initGl = function(){
	var donothing = function(){}
	var navigator = document.getElementById('mainTitle');
	//var myspan = document.getElementById('myspan0');
	//myspan.innerHTML = "nodata";
	var gyroDevice = false;
	console.log('function implemented');
	var mainCanvas = document.getElementById('mainCanvas');
	var mainContext = mainCanvas.getContext("webgl")||mainCanvas.getContext("experimantal-webgl")||mainCanvas.getContext("moz-webgl")||mainCanvas.getContext("webkit-3d");
	if(mainContext){console.log('contex is created');}
	mainContext.clearColor(0,0,0,1.0);
	mainContext.clear(mainContext.COLOR_BUFFER_BIT);
	//create shders
	var vertexShader = mainContext.createShader(mainContext.VERTEX_SHADER);
	var fragmentShader = mainContext.createShader(mainContext.FRAGMENT_SHADER);
	mainContext.shaderSource(vertexShader,vertexShaderText);
	mainContext.shaderSource(fragmentShader,fragmentShaderText);
	mainContext.compileShader(vertexShader);
	mainContext.compileShader(fragmentShader);
	var mainProgram = mainContext.createProgram();
	mainContext.attachShader(mainProgram,vertexShader);
	mainContext.attachShader(mainProgram,fragmentShader);
	mainContext.linkProgram(mainProgram);
	mainContext.enable(mainContext.DEPTH_TEST);
	//mainContext.enable(mainContext.CULL_FACE);
	//mainContext.frontFace(mainContext.CCW);
	//mainContext.cullFace(mainContext.FRONT);
	var cubeVertices =
			[ // X, Y, Z          S, T
				-1,-1,-1,  0,1/3,
				1,-1,-1,   1/2,1/3,
				1,-1,1,    1/2,0,
				-1,-1,1,   0,0,
				-1,-1,-1,  1,1/3,
				-1,1,-1,   1,0,
				1,1,-1,    1/2,0,
				1,-1,-1,   1/2,1/3,
				-1,-1,1,   0,2/3,
				1,-1,1,    1/2,2/3,
				1,1,1,     1/2,1/3,
				-1,1,1,    0,1/3,
				-1,-1,-1,   1/2,2/3,
				-1,-1,1,    1,2/3,
				-1,1,1,     1,1/3,
				-1,1,-1,    1/2,1/3,
				1,-1,-1,     1/2,1,
				1,1,-1,      1/2,2/3,
				1,1,1,       0/2,2/3,
				1,-1,1,      0,1,
				-1,1,-1,     1/2,2/3,
				-1,1,1,      1/2,1,
				1,1,1,       1,1,
				1,1,-1,      1,2/3
			];
	var cubeVerticesIndices = [
		0,1,2,
		2,3,0,
		4,5,6,
		6,7,4,
		8,9,10,
		10,11,8,
		12,13,14,
		14,15,12,
		16,17,18,
		18,19,16,
		20,21,22,
		22,23,20
	]
	var cubeVertexBuffer = mainContext.createBuffer();
	mainContext.bindBuffer(mainContext.ARRAY_BUFFER,cubeVertexBuffer);
	mainContext.bufferData(mainContext.ARRAY_BUFFER,new Float32Array(cubeVertices),mainContext.STATIC_DRAW);
	var cubeVerticesIndicesBuffer = mainContext.createBuffer();
	mainContext.bindBuffer(mainContext.ELEMENT_ARRAY_BUFFER,cubeVerticesIndicesBuffer);
	console.log("indices buffer created");
	mainContext.bufferData(mainContext.ELEMENT_ARRAY_BUFFER,new Uint16Array(cubeVerticesIndices),mainContext.STATIC_DRAW);
	var positionPointer = mainContext.getAttribLocation(mainProgram,'vertPosition');
	mainContext.vertexAttribPointer(
		positionPointer,
		3,
		mainContext.FLOAT,
		mainContext.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT,
		0
	);
	var textureCoordPointer = mainContext.getAttribLocation(mainProgram,'textCoord');
	mainContext.vertexAttribPointer(
		textureCoordPointer,
		2,
		mainContext.FLOAT,
		mainContext.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT,
		3*Float32Array.BYTES_PER_ELEMENT
	);
	var boxTexture = mainContext.createTexture();
	mainContext.bindTexture(mainContext.TEXTURE_2D,boxTexture);
	mainContext.texParameteri(mainContext.TEXTURE_2D,mainContext.TEXTURE_WRAP_S,mainContext.CLAMP_TO_EDGE);
	mainContext.texParameteri(mainContext.TEXTURE_2D,mainContext.TEXTURE_WRAP_T,mainContext.CLAMP_TO_EDGE);
	mainContext.texParameteri(mainContext.TEXTURE_2D,mainContext.TEXTURE_MAG_FILTER,mainContext.LINEAR);
	mainContext.texParameteri(mainContext.TEXTURE_2D,mainContext.TEXTURE_MIN_FILTER,mainContext.LINEAR);
	mainContext.texImage2D(mainContext.TEXTURE_2D,0,mainContext.RGBA,mainContext.RGBA,mainContext.UNSIGNED_BYTE,document.getElementById('textureImagefile'));
	mainContext.useProgram(mainProgram);
	var worldMatrixLocation = mainContext.getUniformLocation(mainProgram,'worldMatrix');
	var lockMatrixLocation = mainContext.getUniformLocation(mainProgram,'lockmatrix');
	var viewMatrixLocation = mainContext.getUniformLocation(mainProgram,'viewMatrix');
	var projMatrixLocation = mainContext.getUniformLocation(mainProgram,'projMatrix');
	var rotateMatrixLocation = mainContext.getUniformLocation(mainProgram,'rotateMatrix');
	var flipMatrixLocation = mainContext.getUniformLocation(mainProgram,'flipMatrix');
	var orientationMatrixLocation = mainContext.getUniformLocation(mainProgram,"orientationMatrix");
	var shakingMatrixLocation = mainContext.getUniformLocation(mainProgram,"shakingMatrix");
	var world = new Float32Array(16);
	var view = new Float32Array(16);
	var proj = new Float32Array(16);
	var rotating = new Float32Array(16);
	var flip = new Float32Array(16);
	var orient = new Float32Array(16);
	var shaking = new Float32Array(16);
	var lock = new Float32Array(16);
	flip = [-1,0,0,0,
					0,1,0,0,
					0,0,1,0,
					0,0,0,1];
	mat4.identity(world);
	mat4.identity(shaking);
	mat4.lookAt(view,[0,0,0],[0,-1,0],[0,0,1]);
	mat4.perspective(proj,glMatrix.toRadian(90),mainCanvas.width/mainCanvas.height,0.1,1000);
	mat4.identity(rotating);
	mat4.identity(orient);
	mat4.identity(lock);
	mainContext.uniformMatrix4fv(worldMatrixLocation,mainContext.FALSE,world);
	mainContext.uniformMatrix4fv(viewMatrixLocation,mainContext.FALSE,view);
	mainContext.uniformMatrix4fv(projMatrixLocation,mainContext.FALSE,proj);
	mainContext.uniformMatrix4fv(rotateMatrixLocation,mainContext.FALSE,rotating);
	mainContext.uniformMatrix4fv(flipMatrixLocation,mainContext.FALSE,flip);
	mainContext.uniformMatrix4fv(orientationMatrixLocation,mainContext.FALSE,orient);
	mainContext.uniformMatrix4fv(shakingMatrixLocation,mainContext.FALSE,shaking);
	mainContext.uniformMatrix4fv(lockMatrixLocation,mainContext.FALSE,lock);
	mainContext.enableVertexAttribArray(positionPointer);
	mainContext.enableVertexAttribArray(textureCoordPointer);
	//
	//
	//Variant global in Whole context
	var idmat = new Float32Array(16);
	var m_device = new Float32Array(16);
	mat4.identity(m_device);
	mat4.identity(idmat);
	var coord2D = function (){
		this.x = 0.0;
		this.y = 0.0;
	}
	var coord3D = function (){
		this.x = 0.0;
		this.y = 0.0;
		this.z = 0.0;
	}
	var angle = function (){
		if(lockStatus == viewLockStatus.unlocked||lockStatus == viewLockStatus.unlocking){
			var deviceRotatedX = [0,0];
			var _angle = 0;
			switch (initOrient){
				case dOrient.portrait:
					_angle = vec2.angle([takeDirect()[1],takeDirect()[9]],[0,-1])*Math.sign(takeDirect()[1]);
					break;
				case dOrient.left:
					_angle = -vec2.angle([takeDirect()[1],takeDirect()[9]],[-1,0])*Math.sign(takeDirect()[9]);
					break;
				case dOrient.right:
					_angle = vec2.angle([takeDirect()[1],takeDirect()[9]],[1,0])*Math.sign(takeDirect()[9]);
					break;
			}
		}
		else {
			_angle = 0;
		}
		return _angle;
	}
	var android_device = false;
	var todo_time = 0;
	var todo_function = donothing;
	var waiting = false;
	var dOrient = {"portrait":1,"left":2,"right":3};
	var initOrient = dOrient.portrait;
	var caliberated = false;
	var passingTime = 2000;
	var unlockRate = 0;
	var keyPos = new coord3D;
	var viewLockStatus = {"unlocked":1,"locking":2,"locked":3,"unlocking":4}
	var keyTime = 0;
	var lockStatus = viewLockStatus.locked;
	var passing = false;
	var origenCoord = new coord3D();
	origenCoord.x = 163;
	var coord_0 = new coord2D();
	var coord_rotating = new coord2D();
	var coord_final = new coord3D();
	var coord_world = new coord3D();
	var coord_device = new coord3D();
	var coord_set = new coord2D();
	var coord_release = new coord2D();
	var coord_moving = new coord3D();
	var coord_buffering = new coord2D();
	var speed = new coord2D();
	var bufferTarget = new coord2D();
	var bufferTime = 0;
	var spdabs = 0;
	var spdvctr = new coord2D;
	var inmove = false;
	var pressed = false;
	var currentCoord = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
	var buffering = false;
	var time_released = 0;
	var time_set = 0;
	var dcrsrt = 1/150;
	var springEnabled = {"vertical":1,"horizontal":2,"all":3,"none":4};
	var shakingEnabled = true;
	var spring = springEnabled.none;
	var gyroOffset = 0;
	var landscapeOffset = 0;
	var moving = function(targetPos,totalTime,startTime,startPos){
		var _this = this;
		this.endwith = donothing;
		this.moving = false;
		this.targetPos = targetPos;
		this.x = startPos.x;
		this.y = startPos.y;
		this.z = startPos.z;
		this.totalTime = totalTime;
		this.startTime = startTime;
		this.startPos = startPos;
		this.to_move=new coord3D;
		this.refresh_to_move = function(){
			this.to_move.x = (this.targetPos.x - this.startPos.x)%(1000*Math.PI);
			if(this.to_move.x > 500*Math.PI){
				this.to_move.x = this.to_move.x-1000*Math.PI;
			}else if(this.to_move.x < -500*Math.PI){
				this.to_move.x = this.to_move.x+1000*Math.PI;
			}
			this.to_move.y = (this.targetPos.y - this.startPos.y)%(1000*Math.PI);
			if(this.to_move.y > 500*Math.PI){
				this.to_move.y = this.to_move.y-1000*Math.PI;
			}else if(this.to_move.y < -500*Math.PI){
				this.to_move.y = this.to_move.y+1000*Math.PI;
			}
			this.to_move.z = (this.targetPos.z - this.startPos.z)%(1000*Math.PI);
			if(this.to_move.z > 500*Math.PI){
				this.to_move.z = this.to_move.z-1000*Math.PI;
			}else if(this.to_move.z < -500*Math.PI){
				this.to_move.z = this.to_move.z+1000*Math.PI;
			}
		}
		this.vector = new coord2D();
		this.refreshData = function(){
			this.x = findPosition(_this.startPos.x,_this.targetPos.x,totalTime,_this.startTime);
			this.y = findPosition(_this.startPos.y,_this.targetPos.y,totalTime,_this.startTime);
			this.z = findPosition(_this.startPos.z,_this.targetPos.z,totalTime,_this.startTime);
			if(performance.now()<_this.startTime+_this.totalTime){_this.moving = true;}
			else{_this.moving = false;}
		}
	}
	var mvmnt = new moving(new coord3D,0,0,new coord3D);
	mvmnt.totalTime = 1000;
	//
	//
	//functions used in Positioning the Matrices
	//
	//
	//Find Position in a Move Behavor
	var findPosition = function (startPos,endPos,totalTime,startTime)
	{
		var currentTime = performance.now();
		var acceleration = 4*(endPos - startPos)/(totalTime*totalTime);
		var time_passed = currentTime - startTime;
		var pos_current = 0;
		if(time_passed<totalTime/2){
			pos_current = startPos + acceleration*time_passed*time_passed/2;
		}
		else if(time_passed<totalTime){
			pos_current = endPos - acceleration*(totalTime-time_passed)*(totalTime-time_passed)/2;
		}
		else{
			pos_current = endPos;
		}
		return pos_current;
	}
	//
	//
	//Move a curtain Dom Element to a certain Positong.
	var moveElementTo = function(element,targetPos,totalTime){
		var _this = this;
		this.startPos = new coord2D();
		this.startPos.x = parseFloat(element.style.left);
		this.startPos.y = parseFloat(element.style.top);
		this.element = element;
		this.targetPos = targetPos;
		this.totalTime = totalTime;
		this.mov= new moving(_this.targetPos,_this.totalTime,performance.now(),_this.startPos);
		this.refreshFrame = function(){
			_this.mov.refreshData();
			element.style.left = parseInt(_this.mov.x);
			element.style.top = parseInt(_this.mov.y);
		}
		this.refreshFrame();
	}
	function refreshMoving(){
		var to_move = mvmnt.to_move;
		//console.log("coord_final.z:");
		//console.log(coord_final.z);
		coord_moving.x = findPosition(0,to_move.x,mvmnt.totalTime,mvmnt.startTime);
		coord_moving.y = findPosition(0,to_move.y,mvmnt.totalTime,mvmnt.startTime);
		coord_moving.z = findPosition(0,to_move.z,mvmnt.totalTime,mvmnt.startTime);
		//console.log(coord_moving.z);
		if(performance.now() > (mvmnt.startTime + mvmnt.totalTime)||pressed){
			console.log('moving ended');
			coord_final.x = coord_final.x + coord_moving.x;
			coord_final.y = coord_final.y + coord_moving.y;
			coord_final.z = coord_final.z + coord_moving.z;
			console.log(coord_final.z);
			inmove = false;
			mvmnt.endwith();
		}
	}
	function set_coord_touch(event){
		if(pressed){
			let time_now = performance.now();
			let dt = time_now-time_set;
			let dist_x = coord_rotating.x - coord_set.x;
			let dist_y = coord_rotating.y - coord_set.y;
			if(dt){
				speed.x = dist_x/dt;
				speed.y = dist_y/dt;
			}
			spdabs = Math.sqrt(speed.x*speed.x+speed.y*speed.y);
			time_set = time_now;
			coord_set.x = coord_rotating.x;
			coord_set.y = coord_rotating.y;
			coord_rotating.x = event.touches[0].clientX-coord_0.x;
			coord_rotating.y = event.touches[0].clientY-coord_0.y;
		}
	}
	function take_coord_touch(event){
		speed.x = 0;
		speed.y = 0;
		time_set = performance.now();
		coord_set.x = 0;
		coord_set.y = 0;
		coord_0.x = event.touches[0].clientX;
		coord_0.y = event.touches[0].clientY;
		pressed = true;
	}
	function set_coord(event){
		if(shakingEnabled){
			handleShaking(event);
		}
		if(pressed){
			let time_now = performance.now()
			let dt =time_now - time_set;
			let dist_x = coord_rotating.x - coord_set.x;
			let dist_y = coord_rotating.y - coord_set.y;
			if(dt){
				speed.x = dist_x/dt;
				speed.y = dist_y/dt;
			}
			spdabs = Math.sqrt(speed.x*speed.x+speed.y*speed.y);
			time_set = time_now;
			coord_set.x = coord_rotating.x;
			coord_set.y = coord_rotating.y;
			coord_rotating.x = event.clientX-coord_0.x;
			coord_rotating.y = event.clientY-coord_0.y;
		}
	}
	function take_coord(event){
		//console.log("------------------------------------------------------");
		//console.log("take_coord called at:");
		//console.log(coord_final.x);
		speed.x = 0;
		speed.y = 0;
		time_pressed = performance.now();
		coord_set.x = 0;
		coord_set.y = 0;
		coord_0.x = event.clientX;
		coord_0.y = event.clientY;
		pressed = true;
		//console.log("take_coord ends with:");
		//console.log(coord_final.x);
	}
	function add_coord(){
		//console.log("add coord called at:");
		//console.log(coord_final.x);
		time_released = performance.now();
		coord_final.x = coord_final.x + coord_rotating.x;
		coord_final.y = coord_final.y + coord_rotating.y;
		coord_rotating.x = 0;
		coord_rotating.y = 0;
		if(spdabs){
			spdvctr.x = speed.x/spdabs;
			spdvctr.y = speed.y/spdabs;
		}
		else{
			spdvctr.x = 0;
			spdvctr.y = 0;
		}
		spdabs = Math.min(spdabs,10);
		bufferTarget.x = spdvctr.x*spdabs*spdabs/(2*dcrsrt);
		bufferTarget.y = spdvctr.y*spdabs*spdabs/(2*dcrsrt);
		bufferTime = spdabs/dcrsrt;
		coord_rotating.x = 0;
		coord_rotating.y = 0;
		pressed = false;
		buffering = true;
		switch(spring){
			case springEnabled.all: moveTo(origenCoord,Math.max(bufferTime,1000),donothing);
				break;
			case springEnabled.vertical: {
				var horizontalTarget = new coord3D();
				horizontalTarget.x = coord_final.x + bufferTarget.x;
				moveTo(horizontalTarget,1000,donothing);
				break;
			}
			default: break;
		}
		//console.log("buffer started");
		//console.log("add_coord ends with:++++++++++++++++++++++++++");
		//console.log(coord_final.x);
	}
	function refreshBuffering(){
		let dt = performance.now() - time_released;
		if(!pressed){
			coord_buffering.x = spdvctr.x*(spdabs*dt-dcrsrt*dt*dt/2);
			coord_buffering.y = spdvctr.y*(spdabs*dt-dcrsrt*dt*dt/2);
		}
		if ((dt>(spdabs/dcrsrt))||pressed==true){
			//console.log("refreshBuffering will end:");
			//console.log(coord_final.x);
			//console.log("buffer stoped");
			//console.log("coord_buffering:");
			//console.log(coord_buffering.x);
			//console.log(coord_buffering.y);
			//console.log("coord_buffering vktr:");
			console.log(spdvctr);
			coord_final.x = coord_final.x + coord_buffering.x;
			coord_final.y = coord_final.y + coord_buffering.y;
			bufferTarget.x = 0;
			bufferTarget.y = 0;
			buffering = false;
			//console.log("refreshBuffering ends with:++++++++++++++++++++++++");
			//console.log(coord_final.x);
		}
	}
	document.onmousemove = set_coord;
	document.ontouchmove = set_coord_touch;
	document.onmousedown = take_coord;
	document.ontouchstart = take_coord_touch;
	document.onmouseup = add_coord;
	document.ontouchend = add_coord;
	console.log(view);
	//
	//
	//vtake current device direction
	var takeDirect = function(){
		var deviceRotataingMatrix = new Float32Array(16);
		mat4.rotate(deviceRotataingMatrix,idmat,coord_device.z*2*Math.PI/360,[0,0,1]);
		mat4.rotate(deviceRotataingMatrix,deviceRotataingMatrix,coord_device.x*2*Math.PI/360,[1,0,0]);
		mat4.rotate(deviceRotataingMatrix,deviceRotataingMatrix,coord_device.y*2*Math.PI/360,[0,1,0]);
		return deviceRotataingMatrix;
	}
	//
	//
	//caliberate the gyrometer offset
	var checkOffset = function(){
		var cpntDiff = Math.abs(takeDirect()[9])-Math.abs(takeDirect()[1]);
		switch (initOrient) {
			case dOrient.portrait:
				if (lockStatus == viewLockStatus.unlocked || lockStatus == viewLockStatus.unlocking){
					gyroOffset = 0;
				}else {
					gyroOffset = 0;
				}
				break;
			case dOrient.left:
				if (lockStatus == viewLockStatus.unlocked || lockStatus == viewLockStatus.unlocking){
					gyroOffset = Math.PI/2;
				}else {
					gyroOffset = 0;
				}
				break;
			case dOrient.right:
				if (lockStatus == viewLockStatus.unlocked || lockStatus == viewLockStatus.unlocking){
					gyroOffset = -Math.PI/2;
				}else {
					gyroOffset = 0;
				}
				break;
		}
	}
	/*var caliberate = function (){
    var cpntDiff = Math.abs(takeDirect()[9])-Math.abs(takeDirect()[1]);
    if (cpntDiff>=0){
    initOrient = dOrient.portrait;
    //_angle = vec2.angle(var cpntDiff = Math.abs(takeDirect()[9])-Math.abs(takeDirect()[1]);
    if (cpntDiff>=0){[takeDirect()[1],takeDirect()[9]],[0,-1])*Math.sign(takeDirect()[1]);
  }
  else {
  if (takeDirect()[1]<0) {
  initOrient = dOrient.left;
  //_angle = vec2.angle([takeDirect()[1],takeDirect()[9]],[1,0])*Math.sign(takeDirect()[9]);
}
else {
initOrient = dOrient.right;
//_angle = vec2.angle([takeDirect()[1],takeDirect()[9]],[-1,0])*Math.sign(takeDirect()[9]);
}
}
checkOffset();
}*/
	var caliberate = function(){
		switch (window.orientation) {
			case 0: initOrient = dOrient.portrait;
				var cpntDiff = Math.abs(takeDirect()[9])-Math.abs(takeDirect()[1]);
				if (cpntDiff<0){
					console.log("Oh No! Android!");
					android_device = true;
				}
				break;
			case 90: initOrient = dOrient.left;
				if(takeDirect()[1]>0){
					console.log("Oh No! Android!");
					android_device = true;
				}
				break;
			case -90: initOrient = dOrient.right;
				if(takeDirect()[1]<0){
					console.log("Oh No! Android! even brocken!!!");
					android_device = true;
				}
		}
	}
	//
	//
	//handle shaking
	var handleShaking = function(event){
		mat4.rotate(shaking,idmat,-event.clientX/100000,[0,1,0]);
		mat4.rotate(shaking,shaking,-event.clientY/100000,[1,0,0]);
		mainContext.uniformMatrix4fv(shakingMatrixLocation,mainContext.FALSE,shaking);
	}
	//
	//
	//do once checkCaliberation
	var checkCaliberation = function (){
		if (!caliberated) {
			caliberate();
			caliberated = true;
		}
	}
	//
	var startGyroscope = function(){
		if (Math.abs(coord_device.x)+Math.abs(coord_device.y)+Math.abs(coord_device.z)>0.01){
			//myspan.innerHTML = "gyrodataFetched";
			checkCaliberation();
			initial_function();
			unlockView();
			triggerGyroscope = donothing;
		}
	}
	//
	var triggerGyroscope = function(){
		startGyroscope();
	}
	//
	//handle device rotation
	var useGyroscope = function(){
		if(window.DeviceOrientationEvent){
			window.addEventListener("deviceorientation", function(event) {
				coord_device.y=event.alpha;
				coord_device.z=event.gamma;
				coord_device.x=event.beta;
				triggerGyroscope();
			});
			gyroDevice = true;
			shakingEnabled = false;
			spring = springEnabled.all;
		}
	}
	var request_for_permission = function(){
		window.DeviceOrientationEvent.requestPermission().then(
			permissionState =>{
				if(permissionState === 'granted'){
					useGyroscope();
					navigator.style.display = "none";
					mainCanvas.onclick = donothing;
				}
				else{
					spring = springEnabled.none;
					navigator.style.display = "none";
				}
			}
		)
	}
	var checkGyroscope = function(){
		if(window.DeviceOrientationEvent != null){
			if(typeof window.DeviceOrientationEvent.requestPermission === 'function'){
				//case iOS13 device
				console.log("this is an iOS13 device");
				//myspan.innerHTML = "iOS13 device";
	            navigator.style.display = "block";
				document.body.addEventListener('click',request_for_permission);
			}
			else{
				//case non iOS13 device
				console.log("this is not an iOS13 device");
				navigator.style.display = "none";
				//myspan.innerHTML = "non-iOS13";
				useGyroscope();
			}
		} else {
			//is maybe a desktop device
			navigator.style.display = "none";
			spring = springEnabled.none;
		}
	}
	//
	//
	//Move view Point to a certain Point
	var moveTo = function(targetPositon,totalTime,endwith){
		mvmnt.targetPos.x = targetPositon.x-bufferTarget.x;
		mvmnt.targetPos.y = targetPositon.y-bufferTarget.y;
		mvmnt.targetPos.z = targetPositon.z;
		mvmnt.startTime = performance.now();
		mvmnt.totalTime = totalTime;
		mvmnt.startPos.x = coord_final.x;
		mvmnt.startPos.y = coord_final.y;
		mvmnt.startPos.z = coord_final.z;
		console.log(mvmnt.startPos.x);
		console.log(mvmnt.startTime);
		console.log(mvmnt.targetPos.x);
		console.log(mvmnt.targetPos.y);
		mvmnt.refresh_to_move();
		mvmnt.endwith = endwith;
		inmove = true;
	}
	//
	//
	//take consider of moving, rotating and buffering finally callulate the coordinate for the render
	function form_coord(){
		coord_world.x = coord_final.x;
		coord_world.y = coord_final.y;
		coord_world.z = coord_final.z;
		if(pressed){
			coord_world.x = coord_final.x + coord_rotating.x;
			coord_world.y = coord_final.y + coord_rotating.y;
		}
		if(buffering){
			refreshBuffering();
			coord_world.x = coord_world.x + coord_buffering.x;
			coord_world.y = coord_world.y + coord_buffering.y;
		}
		if(inmove){
			refreshMoving();
			coord_world.x = coord_world.x + coord_moving.x;
			coord_world.y = coord_world.y + coord_moving.y;
			coord_world.z = coord_world.z + coord_moving.z;
		}
		coord_final.x = coord_final.x%(1000*Math.PI);
		coord_final.y = coord_final.y%(1000*Math.PI);
		coord_final.z = coord_final.z%(1000*Math.PI);
	}
	//
	//
	//Rotataing Mtrices with Device
	var rotateWithDevice = function (){
		mat4.rotate(world,idmat,coord_device.z*2*Math.PI/360,[0,0,1]);
		mat4.rotate(world,world,coord_device.x*2*Math.PI/360,[1,0,0]);
		mat4.rotate(world,world,coord_device.y*2*Math.PI/360,[0,1,0]);
		mainContext.uniformMatrix4fv(worldMatrixLocation,mainContext.FALSE,world);
	}
	//
	//
	//handling orientation
	var handleOrientation = function (){
		if(lockStatus == viewLockStatus.unlocked || lockStatus == viewLockStatus.unlocking){
			switch(window.orientation){
				case 0: mat4.identity(orient);
					break;
				case 90: orient= [
					0,1,0,0,
					-1,0,0,0,
					0,0,1,0,
					0,0,0,1
				];
					break;checkOffset
					case -90: orient= [
						0,-1,0,0,
						1,0,0,0,
						0,0,1,0,
						0,0,0,1
					];
			}
		}
		else {
			mat4.identity(orient);
		}
		//if(lockStatus == viewLockStatus.locked){
		//mat4.identity(orient);
		//}
		mainContext.uniformMatrix4fv(orientationMatrixLocation,mainContext.FALSE,orient);
	}
	//
	//
	//rotate with mouse and program
	var handleDrag = function (){
		mat4.rotate(currentCoord,idmat,angle()+coord_world.x/500,[0,1,0]);
		mat4.rotate(rotating,idmat,gyroOffset+coord_world.x/500,[0,1,0]);
		mat4.rotate(rotating,rotating,coord_world.y/500,[currentCoord[0],currentCoord[4],currentCoord[8]]);
		mat4.rotate(currentCoord,currentCoord,-coord_world.y/500,[currentCoord[0],currentCoord[4],currentCoord[8]]);
		mat4.rotate(rotating,rotating,coord_world.z/500,[currentCoord[1],currentCoord[5],currentCoord[9]]);
		mainContext.uniformMatrix4fv(rotateMatrixLocation,mainContext.FALSE,rotating);
	}
	//
	//
	//draw frame content
	var drawFrameContent = function(){
		mainContext.clearColor(0.0,0.0,0.0,0.0);
		mainContext.clear(mainContext.COLOR_BUFFER_BIT);
		mainContext.drawElements(mainContext.TRIANGLES,cubeVerticesIndices.length,mainContext.UNSIGNED_SHORT,0);
	}
	//
	//
	//refresh lock matrix with given unlockRate
	var refreshLock = function(){
		unlockRate = findPosition(1,0,passingTime,keyTime);
		mat4.rotate(lock,idmat,unlockRate*keyPos.z,[0,0,1]);
		mat4.rotate(lock,lock,unlockRate*keyPos.x,[1,0,0]);
		mat4.rotate(lock,lock,unlockRate*keyPos.y,[0,1,0]);
	}
	//
	//
	//handle device rotation
	var handleDeviceRotation = function(){
		switch(lockStatus){
			case viewLockStatus.unlocked:
				unlockRate = 0;
				rotateWithDevice();
				mat4.identity(lock);
				mainContext.uniformMatrix4fv(lockMatrixLocation,mainContext.FALSE,lock);
				spring = springEnabled.vertical;
				break;
			case viewLockStatus.locking:
				mat4.identity(world);
				mainContext.uniformMatrix4fv(worldMatrixLocation,mainContext.FALSE,world);
				refreshLock();
				if(unlockRate == 0){lockStatus = viewLockStatus.locked;}
				mainContext.uniformMatrix4fv(lockMatrixLocation,mainContext.FALSE,lock);
				break;
			case viewLockStatus.locked:
				unlockRate = 0;
				mat4.identity(world);
				mat4.identity(lock);
				mainContext.uniformMatrix4fv(worldMatrixLocation,mainContext.FALSE,world);
				mainContext.uniformMatrix4fv(lockMatrixLocation,mainContext.FALSE,lock);
				break;
			case viewLockStatus.unlocking:
				rotateWithDevice();
				refreshLock();
				mat4.invert(lock,lock);
				mainContext.uniformMatrix4fv(lockMatrixLocation,mainContext.FALSE,lock);
				if(unlockRate == 0){lockStatus = viewLockStatus.unlocked;}
				break;
		}
	}
	//
	//
	//handle view lock
	var lockView = function(){
		unlockRate = 1;
		keyTime = performance.now()
		keyPos.x = coord_device.x*Math.PI/180;
		keyPos.y = coord_device.y*Math.PI/180;
		keyPos.z = coord_device.z*Math.PI/180;
		/*if (Math.abs(keyPos.x)>Math.PI){
    keyPos.x = Math.sign(keyPos.x)*2*Math.PI-keyPos.x;
  }*/
		if (keyPos.y>Math.PI){
			keyPos.y = -2*Math.PI+keyPos.y;
		}
		/*if (Math.abs(keyPos.z)>Math.PI){
  keyPos.z = Math.sign(keyPos.z)*2*Math.PI-keyPos.z;
}*/
		lockStaus = viewLockStatus.locking;
	}
	var unlockView = function(){
		unlockRate = 1;
		console.log('unlock trigered');
		console.log(unlockRate);
		keyTime = performance.now();
		keyPos.x = coord_device.x*Math.PI/180;
		keyPos.y = coord_device.y*Math.PI/180;
		keyPos.z = coord_device.z*Math.PI/180;
		/*if (Math.abs(keyPos.x)>Math.PI){
  keyPos.x = Math.sign(keyPos.x)*2*Math.PI-keyPos.x;
}*/
		if (keyPos.y>Math.PI){
			keyPos.y = -2*Math.PI+keyPos.y;
		}
		/*if (Math.abs(keyPos.z)>Math.PI){
keyPos.z = Math.sign(keyPos.z)*2*Math.PI-keyPos.z;
}*/
		lockStatus = viewLockStatus.unlocking;
	}
	//
	//
	//wait functions
	var setToDo = function(wait_time,_function){
		todo_time = performance.now()+wait_time;
		todo_function = _function;
		waiting = true;
	}
	var checkTodo = function(){
		if(waiting){
			if(performance.now()>todo_time){
				todo_function();
				todo_function = donothing;
				waiting = false;
			}
		}
	}
	//
	var initial_function = function(){
						if(android_device&&initOrient==dOrient.portrait){
			origenCoord.x=origenCoord.x-250*Math.PI;
			moveTo(origenCoord,passingTime,donothing);
		}else if (android_device&&initOrient == dOrient.left) {
			origenCoord.x=origenCoord.x+500*Math.PI;
			moveTo(origenCoord,passingTime,donothing);
		}else if (android_device&&initOrient == dOrient.right) {
			//origenCoord.x=origenCoord.x+500*Math.PI;
			//moveTo(origenCoord,passingTime,donothing);
		}
	}
	//
	//after opening animation
	var initall = function (){
		checkGyroscope();
	}
	//animation start
	handleOrientation();
	//landscapeOffset = -vec2.angle([world[1],world[9]],[1,0])*Math.sign(world[9])*500;
	origenCoord.x = 163;
	coord_final.y = Math.PI*250;
	coord_final.x = 163;
	coord_final.z = 0;
	moveTo(origenCoord,2000,initall);
	navigator.style.top = parseInt(parseFloat(window.innerHeight)*1.5);
	navigator.style.zIndex = 4;
	navigator_Pos = new coord2D();
	navigator_Pos.x = parseFloat(navigator.style.left);
	navigator_Pos.y = parseFloat(parseFloat(window.innerHeight)/2);
	mvnvgt = new moveElementTo(navigator,navigator_Pos,2000);
	var loop = function(){
		//myspan2.innerHTML = coord_final.x;
		//myspan.innerHTML = coord_final.y;
		//myspan3.innerHTML = coord_final.z;
		mvnvgt.refreshFrame();
		navigator_Pos.y = parseInt(parseFloat(window.innerHeight/2));
		checkTodo();
		form_coord();
		handleOrientation();
		handleDeviceRotation();
		checkOffset();
		handleDrag();
		drawFrameContent();
		requestAnimationFrame(loop);
		//myspan0.innerHTML = unlockRate;
	}
	requestAnimationFrame(loop);
}
