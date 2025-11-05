"use strict";
let currentSceneFlags = [];

let sin = Math.sin
let cos = Math.cos
let tan = Math.tan
let asin = Math.asin
let acos = Math.acos
let atan = Math.atan
let now = Date.now
let sqrt = Math.sqrt
let abs = Math.abs
let pi = Math.PI
let assert = console.assert

let identifiables = document.getElementsByClassName("identifiable")
let identifiers = document.getElementsByClassName("identify")
let identifierpath = document.getElementById("identifiers")
let identifierProperties = [];
let identifierBoxes = [];
let identifierSizes = [];
let identifierPropertySizes = [];

let saveJSON = `
{
    "gamestage_components": {
        "gamestage_tags": [],
        "gamestage": 0
    }
}
`

console.log(JSON.parse(saveJSON).gamestage_components)

function verifySaveIntegrity(save) {
    saveJSON = JSON.parse(save)
    if (
        saveJSON.gamestage_components != undefined &&
        saveJSON.gamestage_components.gamestage_tags != undefined &&
        saveJSON.gamestage_components.gamestage != undefined) {
        console.log("Save is valid")
    } else {
        console.log("Missing some components")
    }
}

verifySaveIntegrity(saveJSON)

/*
var gamemain = document.querySelector("#renderergpu");
var gl = gamemain.getContext("webgl2");

var vertexShaderSource = `#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
 
// all shaders have a main function
void main() {
 
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`;

var fragmentShaderSource = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  outColor = vec4(1, 0, 0.5, 1);
}
`;

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

function enableCPURendering() {

}

function enableGPURendering() {

}

if (!gl) {
    enableCPURendering()
} else {
    enableGPURendering()
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
   
    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
                       canvas.height !== displayHeight;
   
    if (needResize) {
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
   
    return needResize;
  }

function main() {
    // Get A WebGL context
    var canvas = document.querySelector("#renderergpu");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
      return;
    }
  
    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  
    // Link the two shaders into a program
    var program = createProgram(gl, vertexShader, fragmentShader);
  
    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  
    // Create a buffer and put three 2d clip space points in it
    var positionBuffer = gl.createBuffer();
  
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    var positions = [
      0, 0,
      0, 0.5,
      0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
    // Create a vertex array object (attribute state)
    var vao = gl.createVertexArray();
  
    // and make it the one we're currently working with
    gl.bindVertexArray(vao);
  
    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
  
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);
  
    resizeCanvasToDisplaySize(gl.canvas);
  
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
  
    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);
  
    // draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
}
*/

let cameratrans = document.querySelector("#camera-translate")
let camerarot = document.querySelector("#camera-rotate")
let log = console.log

let increaseZIntervalIndex, 
    decreaseZIntervalIndex, 
    increaseXIntervalIndex, 
    decreaseXIntervalIndex, 
    increaseYawIntervalIndex, 
    decreaseYawIntervalIndex, 
    increasePitchIntervalIndex, 
    decreasePitchIntervalIndex;

let yaw   = 0, 
    pitch = 0, 
    roll  = 0, 
    Z     = 0, 
    Y     = 0, 
    X     = 0;


let tw, ts, tq, te, ta, td, tz, tc;
let movespeed = 0.5;
let sensitivity = 0.002;

function cameraHandler () {
    pitch = (pitch > pi / 2)? pi / 2: (pitch < -pi / 2)? -pi / 2: pitch
    yaw = yaw < 0? yaw + 2 * pi: yaw > 2 * pi? yaw - 2 * pi: yaw 
    cameratrans.setAttribute("style", `transform: translate3d(${X}px, 0, ${Z}px)`);
    camerarot.setAttribute("style", `transform: rotateX(${pitch}rad) rotateY(${-yaw}rad)`)
}

let i = 0;
let boxesRegistered = false;
function registerIdentifierBoxes() {
    if (boxesRegistered) return;
    for (const e of identifiers) {
        identifierpath.innerHTML += `<div id="identifierbox${i}" class="identifierbox"><div class="actions"></div><div class="associations"></div><div class="names"></div><div class="properties"></div></div>`
        log('x')
        log(identifierpath.innerHTML)
        identifierBoxes[i] = document.getElementById(`identifierbox${i}`)
        identifierProperties[i] = e.children;
        identifierSizes[i] = {topdims: {top: 0, left: 0, height: 0, width: 0}, propertydims: {width: 0}};
        i += 1;
    }
    boxesRegistered = true;
}

registerIdentifierBoxes()



function identifiableHandler () {
    i = 0;
    for (const e of identifiers) {
        let identX = e.getAttribute("--3d-x"),
            identY = e.getAttribute("--3d-y"),
            identZ = e.getAttribute("--3d-z");

        let dX = X - identX,
            dY = Y - identY,
            dZ = Z - identZ;

        let dR = sqrt(dX*dX + dZ*dZ)
        let dD = sqrt(dR*dR + dY*dY)
        let pitch = asin(dR/dD)
        let yaw = -asin(dZ/dR)

        e.setAttribute("style", `transform: rotateY(${(yaw - pi/2) * (Math.sign(dX) > 0? 1: -1)}rad) rotateX(${pitch + pi/2}rad)`)
        let bound = e.getBoundingClientRect();
        let side = Math.max(bound.width, bound.height)
        let y = (bound.top + bound.bottom)/2;
        let x = (bound.right + bound.left)/2;
        let rasterPoint = {x, y};
        
        let props = identifierBoxes[i].children[3];
        let propsBound = props.getBoundingClientRect();

        let size = Math.min(300000/dD, 300);

        let prevSize = identifierSizes[i]
        let currSize = 
        {
            topdims: {
                top: y - size/2, 
                left: x - size/2, 
                height: size, 
                width: size}, 
            propertydims: {
                width: -propsBound.width - 10
            }
        };

        if (prevSize.topdims.top != currSize.topdims.top || 
            prevSize.topdims.left != currSize.topdims.left || 
            prevSize.topdims.height != currSize.topdims.height || 
            prevSize.topdims.width != currSize.topdims.width) 
        {
            identifierBoxes[i].setAttribute("style", `top: ${y - size/2}px; left: ${x - size/2}px; height: ${size}px; width: ${size}px`);
        }

        if (prevSize.propertydims.width != currSize.propertydims.width) {
            identifierBoxes[i].children[3].setAttribute("style", `right: ${-propsBound.width - 10}px`)
            identifierBoxes[i].children[3].innerHTML = identifierProperties[0][0].innerHTML;
        }

        identifierSizes[i] = currSize
    }
}

function areObjectsEqual(obj1, obj2) {
    if (obj1 === obj2) return true; // Same object reference

    assert(typeof(obj1) == typeof({}) && typeof(obj2) == typeof({}))

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }

    let objKeys1 = Object.keys(obj1);
    let objKeys2 = Object.keys(obj2);

    if (objKeys1.length !== objKeys2.length) return false;

    for (let key of objKeys1) {
      if (!objKeys2.includes(key) || !areObjectsEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
}


console.log({X} == {X})

setInterval(identifiableHandler, 0)

setInterval(cameraHandler, 0)

addEventListener("mousemove", (event) => {
    if (tracking) {
        pitch -= event.movementY * sensitivity
        yaw -= event.movementX * sensitivity
    }
})

addEventListener("keydown", (event) => { 
    
    if (event.key == "w") {
        if (increaseZIntervalIndex == undefined) {
            tw = now()
            increaseZIntervalIndex = setInterval( () => {
                let t = now();
                let dt = t - tw;
                Z += cos(yaw) * movespeed * dt
                X += sin(yaw) * movespeed * dt
                tw = t
            }, 1)
        }
    }
    if (event.key == "s") {
        if (decreaseZIntervalIndex == undefined) {
            ts = now()
            decreaseZIntervalIndex = setInterval( () => {
                let t = now()
                let dt = t - ts
                Z -= cos(yaw) * movespeed * dt
                X -= sin(yaw) * movespeed * dt
                ts = t
            }, 1)
        }
    }
    if (event.key == "a") {
        if (increaseXIntervalIndex == undefined) {
            ta = now()
            increaseXIntervalIndex = setInterval( () => {
                let t = now()
                let dt = t - ta
                Z += sin(-yaw) * movespeed * dt
                X += cos(-yaw) * movespeed * dt
                ta = t
            }, 1)
        }
    }
    
    if (event.key == "d") {
        if (decreaseXIntervalIndex == undefined) {
            td = now()
            decreaseXIntervalIndex = setInterval( () => {
                let t = now()
                let dt = t - td
                Z -= sin(-yaw) * movespeed * dt
                X -= cos(-yaw) * movespeed * dt
                td = t
            }, 1)
        }
    }

    if (event.key == "q") {
        if (increaseYawIntervalIndex == undefined) {
            tq = now()
            increaseYawIntervalIndex = setInterval( () => {
                let t = now()
                let dt = t - tq
                yaw += sensitivity * dt
                tq = t
            }, 1)
        }
    }

    if (event.key == "e") {
        if (decreaseYawIntervalIndex == undefined) {
            te = now()
            decreaseYawIntervalIndex = setInterval( () => {
                let t = now()
                let dt = t - te
                yaw -= sensitivity * dt
                te = t
            }, 1)
        }
    }

    if (event.key == "z") {
        if (increasePitchIntervalIndex == undefined) {
            tz = now()
            increasePitchIntervalIndex = setInterval( () => {
                let t = now()
                let dt = t - tz
                pitch += sensitivity * dt
                tz = t
            }, 1)
        }
    }
    
    if (event.key == "c") {
        if (decreasePitchIntervalIndex == undefined) {
            tc = now()
            decreasePitchIntervalIndex = setInterval( () => {
                let t = now()
                let dt = t - tc
                pitch -= sensitivity * dt
                tc = t
            }, 1)
        }
    }
}) 



let tracking

document.addEventListener('mousedown', function(event) {
    if (event.button == 0) {
        tracking = true;
        document.body.requestPointerLock();
    }
});
  
document.addEventListener('mouseup', function(event) {
    if (event.button == 0) {
        tracking = false;
        document.exitPointerLock();
    }
});

addEventListener("keyup", (event) => {
    if (event.key == "w") {
        clearInterval(increaseZIntervalIndex)
        increaseZIntervalIndex = undefined
    }

    if (event.key == "s") {
        clearInterval(decreaseZIntervalIndex)
        decreaseZIntervalIndex = undefined
    }
    
    if (event.key == "q") {
        clearInterval(increaseYawIntervalIndex)
        increaseYawIntervalIndex = undefined
    }
    
    if (event.key == "e") {
        clearInterval(decreaseYawIntervalIndex)
        decreaseYawIntervalIndex = undefined
    }
    
    if (event.key == "a") {
        clearInterval(increaseXIntervalIndex)
        increaseXIntervalIndex = undefined
    }
    
    if (event.key == "d") {
        clearInterval(decreaseXIntervalIndex)
        decreaseXIntervalIndex = undefined
    }

    if (event.key == "z") {
        clearInterval(increasePitchIntervalIndex)
        increasePitchIntervalIndex = undefined
    }
    
    if (event.key == "c") {
        clearInterval(decreasePitchIntervalIndex)
        decreasePitchIntervalIndex = undefined
    }
})