var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec2 textCoord;',
'varying vec2 fragTextCoord;',
'uniform mat4 worldMatrix;',
'uniform mat4 viewMatrix;',
'uniform mat4 projMatrix;',
'uniform mat4 rotateMatrix;',
'uniform mat4 flipMatrix;',
'',
'void main()',
'{',
'  fragTextCoord = textCoord;',
'  gl_Position = projMatrix*viewMatrix*flipMatrix*worldMatrix*rotateMatrix*vec4(vertPosition, 1.0);',
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
    
    //var myspan = document.getElementById('myspan');
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
    
    var worldMatrixLocataion = mainContext.getUniformLocation(mainProgram,'worldMatrix');
    var viewMatrixLocataion = mainContext.getUniformLocation(mainProgram,'viewMatrix');
    var projMatrixLocation = mainContext.getUniformLocation(mainProgram,'projMatrix');
    var rotateMatrixLocation = mainContext.getUniformLocation(mainProgram,'rotateMatrix');
    var flipMatrixLocation = mainContext.getUniformLocation(mainProgram,'flipMatrix');
    
    var world = new Float32Array(16);
    var view = new Float32Array(16);
    var proj = new Float32Array(16);
    var rotating = new Float32Array(16);
    var flip = new Float32Array(16);
    flip = [-1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1];
    mat4.identity(world);
    mat4.lookAt(view,[0,0,0],[0,-1,0],[0,0,1]);
    mat4.perspective(proj,glMatrix.toRadian(90),mainCanvas.width/mainCanvas.height,0.1,1000);
    mat4.identity(rotating);
    
    mainContext.uniformMatrix4fv(worldMatrixLocataion,mainContext.FALSE,world);
    mainContext.uniformMatrix4fv(viewMatrixLocataion,mainContext.FALSE,view);
    mainContext.uniformMatrix4fv(projMatrixLocation,mainContext.FALSE,proj);
    mainContext.uniformMatrix4fv(rotateMatrixLocation,mainContext.FALSE,rotating);
    mainContext.uniformMatrix4fv(flipMatrixLocation,mainContext.FALSE,flip);
    
    
    mainContext.enableVertexAttribArray(positionPointer);
    mainContext.enableVertexAttribArray(textureCoordPointer);
    
    var idmat = new Float32Array(16);
    mat4.identity(idmat);
    
    var pressed = false;
    
    var coord2D = function (){
        this.x = 0.0;
        this.y = 0.0;
    } 
    var coord3D = function (){
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
    }
    
    var coord_0 = new coord2D();
    var coord_1 = new coord2D();
    var coord_temp = new coord2D();
    var coord_final = new coord2D();
    var coord_rotating = new coord2D();
    var coord_device = new coord3D();
    var coord_set = new coord2D();
    var speed = new coord2D();
    var spdabs = 0;
    
    
    var current_x = [1,0,0];
    var current_y = [0,1,0];
    var buffering = false;
    var time_released = 0;
    var time_set = 0;
    var dcrsrt = 1/150;
    
    function set_coord_touch(event){
        if(pressed){
            let time_now = performance.now();
            let dt = time_now-time_set;
            let dist_x = coord_1.x - coord_set.x;
            let dist_y = coord_1.y - coord_set.y;
            speed.x = dist_x/dt;
            speed.y = dist_y/dt;
            spdabs = Math.sqrt(speed.x*speed.x+speed.y*speed.y);
            time_set = time_now;
            coord_set.x = coord_1.x;
            coord_set.y = coord_1.y;
        }
        coord_1.x = event.touches[0].clientX-coord_0.x;
        coord_1.y = event.touches[0].clientY-coord_0.y;
        coord_temp.x = coord_final.x + coord_1.x;
        coord_temp.y = coord_final.y + coord_1.y;
    }
    
    function take_coord_touch(event){
        buffering = false;
        pressed = true;
        speed.x = 0;   
        speed.y = 0;   
        time_set = performance.now();
        coord_set.x = 0;
        coord_set.y = 0;
        coord_0.x = event.touches[0].clientX;
        coord_0.y = event.touches[0].clientY;
        coord_1.x = event.touches[0].clientX-coord_0.x;
        coord_1.y = event.touches[0].clientY-coord_0.y;
        coord_temp.x = coord_final.x + coord_1.x;
        coord_temp.y = coord_final.y + coord_1.y;
    }    function set_coord(event){
        if(pressed){
            let time_now = performance.now()
            let dt =time_now - time_set;
            let dist_x = coord_1.x - coord_set.x;
            let dist_y = coord_1.y - coord_set.y;
            speed.x = dist_x/dt;
            speed.y = dist_y/dt;
            spdabs = Math.sqrt(speed.x*speed.x+speed.y*speed.y);
            time_set = time_now;
            coord_set.x = coord_1.x;
            coord_set.y = coord_1.y;
        }
        coord_1.x = event.clientX-coord_0.x;
        coord_1.y = event.clientY-coord_0.y;
        coord_temp.x = coord_final.x + coord_1.x;
        coord_temp.y = coord_final.y + coord_1.y;
    }
    
    function take_coord(event){
        buffering = false;
        pressed = true;
        speed.x = 0;   
        speed.y = 0;   
        time_pressed = performance.now();
        coord_set.x = 0;
        coord_set.y = 0;
        coord_0.x = event.clientX;
        coord_0.y = event.clientY;
        coord_1.x = event.clientX-coord_0.x;
        coord_1.y = event.clientY-coord_0.y;
        coord_temp.x = coord_final.x + coord_1.x;
        coord_temp.y = coord_final.y + coord_1.y;
    }
    function form_coord(){
        var coord_world_0 = new coord3D();
        if(pressed){
            coord_rotating = coord_temp;
    }else{
        coord_rotating = coord_final;
    }
    }
    function add_coord(){
        buffering = true;
        time_released = performance.now();
        pressed = false;
        coord_final.x = coord_final.x + coord_1.x;
        coord_final.y = coord_final.y + coord_1.y;
    }
    
    
    document.onmousemove = set_coord;
    document.ontouchmove = set_coord_touch;
    document.onmousedown = take_coord;
    document.ontouchstart = take_coord_touch;
    document.onmouseup = add_coord;
    document.ontouchend = add_coord;
    
    console.log(view);
    
        if(window.DeviceOrientationEvent){
        window.addEventListener("deviceorientation", function(event) {
            alpha_cur = event.alpha;
            coord_device.y=event.alpha;
            coord_device.z=event.gamma;
            coord_device.x=event.beta;
            gyroDevice = true;
        });}
    document.addEventListener("orientationchange", function(event){      
    });
    
    var loop = function(){
        //myspan.innerHTML = coord_final.x;
        form_coord();
        
        if(buffering){
            let dt = performance.now()-time_released;
            var spdvctr = new coord2D;
            if(spdabs){
            spdvctr.x = speed.x/spdabs;
            spdvctr.y = speed.y/spdabs;
            }
            if(spdabs > 0){
            spdabs = spdabs - dt*dcrsrt;
            }
            else{
                spdabs = 0;
                buffering = false;
            }
            speed.x = spdvctr.x*spdabs;
            speed.y = spdvctr.y*spdabs;
            
            coord_final.x = coord_final.x + speed.x*dt;
            coord_final.y = coord_final.y + speed.y*dt;
            
            time_released = performance.now();
        }
        
        mainContext.clearColor(0.0,0.0,0.0,0.0);
        mainContext.clear(mainContext.COLOR_BUFFER_BIT);
        //rotated = performance.now()/1000/30*2*Math.PI;
        
        switch(window.orientation){
            case 0: mat4.lookAt(view,[0,0,0],[0,-1,0],[0,0,1]);
                break;
            case 90: mat4.lookAt(view,[0,0,0],[0,-1,0],[-1,0,0]);
                break;
            case -90: mat4.lookAt(view,[0,0,0],[0,-1,0],[1,0,0]);
        }
        mainContext.uniformMatrix4fv(viewMatrixLocataion,mainContext.FALSE,view);
          
        mat4.rotate(world,idmat,coord_device.z*2*Math.PI/360,[0,0,1]);
        mat4.rotate(world,world,coord_device.x*2*Math.PI/360,[1,0,0]);
        mat4.rotate(world,world,coord_device.y*2*Math.PI/360,[0,1,0]);
        mainContext.uniformMatrix4fv(worldMatrixLocataion,mainContext.FALSE,world);
        
        mat4.rotate(rotating,idmat,coord_rotating.x/500,[0,1,0]);
        vec3.rotateY(current_x,[1,0,0],[0,0,0],-coord_rotating.x/500);
        if(!gyroDevice){
        mat4.rotate(rotating,rotating,coord_rotating.y/500,current_x);
        }
        
        mainContext.uniformMatrix4fv(rotateMatrixLocation,mainContext.FALSE,rotating);
        
        
        mainContext.drawElements(mainContext.TRIANGLES,cubeVerticesIndices.length,mainContext.UNSIGNED_SHORT,0);
        requestAnimationFrame(loop);
        
    }
    requestAnimationFrame(loop);
}
