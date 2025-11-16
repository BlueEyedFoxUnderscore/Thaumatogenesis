"use strict";
let currentSceneFlags = [];

    
let withAs = (obj, cb) => cb(obj);
let sum = arr => arr.reduce((a, b) => a + b);
let mul = arr => arr.reduce((a, b) => a * b);
let sub = arr => arr.splice(1).reduce((a, b) => a - b, arr[0]);
let deepClone = obj => JSON.parse(JSON.stringify(obj));

let shifter = (arr, step) => [
    ...arr.splice(step),
    ...arr.splice(arr.length - step)
]

let makeArray = (n, cb) =>
    [...Array(n).keys()].map(
        i => cb ? cb(i) : i
    )

let makeMatrix = (len, wid, fill) =>
    makeArray(len).map(i => makeArray(
        wid, j => fill ? fill(i, j) : 0
    ))

let matrixRandom =
    (len, wid, min = 0, max = 100) =>
        makeMatrix(len, wid, x => Math.round(
            Math.random() * (max - min)
        ) + min)

let matrixSize = matrix => [
    matrix.length, matrix[0].length
]

/**
 * 
 */
let arr2mat = (len, wid, arr) => 
    makeArray(len).map(i => arr.slice(
        i * wid, i * wid + wid
    ))

let matrixMap = (matrix, cb) =>
    deepClone(matrix).map((i, ix) => i.map(
        (j, jx) => cb({ i, ix, j, jx, matrix })
    ))

let matrixScalar = (n, matrix) =>
    matrixMap(matrix, ({ j }) => n * j)

let matrixAdd = matrices =>
    matrices.reduce((acc, inc) => matrixMap(
        acc, ({ j, ix, jx }) => j + inc[ix][jx]
    ), makeMatrix(...matrixSize(matrices[0])))

let matrixSub = matrices => matrices.splice(1)
    .reduce((acc, inc) => matrixMap(
        acc, ({ j, ix, jx }) => j - inc[ix][jx]
    ), matrices[0])

let matrixMul = (m1, m2) => makeMatrix(
    m1.length, m2[0].length, (i, j) => sum(
        m1[i].map((k, kx) => k * m2[kx][j])
    )
)

let matrixMuls = matrices =>
    deepClone(matrices).splice(1)
        .reduce((acc, inc) => makeMatrix(
            acc.length, inc[0].length,
            (ix, jx) => sum(acc[ix].map(
                (k, kx) => k * inc[kx][jx]
            ))
        ), deepClone(matrices[0]))

let matrixMinor = (matrix, row, col) =>
    matrix.length < 3 ? matrix :
        matrix.filter((i, ix) => ix !== row - 1)
            .map(i => i.filter((j, jx) => jx !== col - 1))

let matrixTrans = matrix => makeMatrix(
    ...shifter(matrixSize(matrix), 1),
    (i, j) => matrix[j][i]
)

let matrixDet = matrix => withAs(
    deepClone(matrix), clone => matrix.length < 3
        ? sub(matrixTrans(clone.map(shifter)).map(mul))
        : sum(clone[0].map((i, ix) => matrixDet(
            matrixMinor(matrix, 1, ix + 1)
        ) * Math.pow(-1, ix + 2) * i))
)

let matrixCofactor = matrix => matrixMap(
    matrix, ({ i, ix, j, jx }) =>
    matrix[0].length > 2 ?
        Math.pow(-1, ix + jx + 2) * matrixDet(
            matrixMinor(matrix, ix + 1, jx + 1)
        ) : (ix != jx ? -matrix[jx][ix]
            : matrix[+!ix][+!jx]
        )
)

let matrixInverse = matrix => matrixMap(
    matrixTrans(matrixCofactor(matrix)),
    ({ j }) => j / matrixDet(matrix)
)

let matrixLinSolve = (conds, res) => matrixMul(
    matrixInverse(conds), res.map(i => [i])
).map(i => i[0])

class Matrix {
    
    static shifter = shifter

    static makeArray = makeArray

    static makeMatrix = makeMatrix

    static matrixRandom = matrixRandom

    static matrixSize = matrixSize

    static arr2mat = arr2mat

    static matrixMap = matrixMap

    static matrixScalar = matrixScalar

    static matrixAdd = matrixAdd

    static matrixSub = matrixSub

    static matrixMul = matrixMul

    static matrixMuls = matrixMuls

    static matrixMinor = matrixMinor

    static matrixTrans = matrixTrans

    static matrixDet = matrixDet

    static matrixCofactor = matrixCofactor

    static matrixInverse = matrixInverse

    static matrixLinSolve = matrixLinSolve
/* */
}

// Aliased functions
let sin = Math.sin,
    cos = Math.cos,
    tan = Math.tan,
    asin = Math.asin,
    acos = Math.acos,
    atan = Math.atan,
    now = Date.now,
    sqrt = Math.sqrt,
    abs = Math.abs,
    sign = Math.sign,
    max = Math.max,
    min = Math.min,
    rand = Math.random,
    log2 = Math.log2,
    floor = Math.floor,
    ceil = Math.ceil,
    round = Math.round,
    pi = Math.PI,
    assert = console.assert,
    log = console.log

// Camera variables
let yaw   = 0, 
    pitch = 0, 
    roll  = 0, 
    cameraZ     = 0, 
    cameraY     = 0, 
    cameraX     = 0;

// Identifiables and related
const identifiables = document.getElementsByClassName("identifiable"),
      identifiers = document.getElementsByClassName("identify"),
      identifierpath = document.getElementById("identifiers");
let identifierProperties = [],
    identifierBoxes = [],
    identifierSizes = [],
    identifierPropertySizes = [];

// Common matrices
let zeroMatrix  = ()        => [0, 0, 0, 0, 
                                0, 0, 0, 0, 
                                0, 0, 0, 0, 
                                0, 0, 0, 0, ],
                                
    identMatrix = ()        => [1, 0, 0, 0, 
                                0, 1, 0, 0, 
                                0, 0, 1, 0, 
                                0, 0, 0, 1, ],

    transMatrix = (x, y, z) => [1, 0, 0, x, 
                                0, 1, 0, y, 
                                0, 0, 1, z, 
                                0, 0, 0, 1, ],

    scaleMatrix = (x, y, z) => [x, 0, 0, 0, 
                                0, y, 0, 0, 
                                0, 0, z, 0, 
                                0, 0, 0, 1, ],
    
    scaleAllMatrix = (a)    => [a, 0, 0, 0, 
                                0, a, 0, 0, 
                                0, 0, a, 0, 
                                0, 0, 0, 1, ],

    rotXMatrix  = (theta)   => [1,          0,          0, 0, 
                                0, cos(theta), sin(theta), 0, 
                                0,-sin(theta), cos(theta), 0, 
                                0,          0,          0, 1, ],

    rotYMatrix  = (theta)   => [cos(theta), 0,-sin(theta), 0, 
                                0,          1, 0,          0, 
                                sin(theta), 0, cos(theta), 0,
                                0,          0, 0,          1, ],

    rotZMatrix  = (theta)   => [cos(theta),-sin(theta), 0, 0, 
                                sin(theta), cos(theta), 0, 0, 
                                0,          0,          1, 0,
                                0,          0,          0, 1, ],
    from2d = (matrix2) => [
        matrix2[0], matrix2[1], 0, matrix2[4],
        matrix2[2], matrix2[3], 0, matrix2[5],
        0, 0, 1, 0,
        0, 0, 0, 1
    ],

    shearMatrix = 
    (xy,xz,yx,yz,zx,zy)     => [ 1, xy, xz, 0, 
                                yx,  1, yz, 0, 
                                zx, zy,  1, 0,
                                 0,  0,  0, 1, ],

    transposeMatrix = (matrix) => [
        matrix[0], matrix[4], matrix[8 ], matrix[12],
        matrix[1], matrix[5], matrix[9 ], matrix[13],
        matrix[2], matrix[6], matrix[10], matrix[15],
        matrix[3], matrix[7], matrix[11], matrix[16],
    ]

Function.prototype.repeat = function (times) {
    return (...args) => 
    {
        for(let i = 0; i < times; i++) args = [this(...args)]
        return args
    }
}

// Scene and camera
const scene = document.getElementById("scene"),
      cameraOrigin = document.getElementById("camera-origin"),
      cameratrans = document.getElementById("camera-translate"),
      camerarot = document.getElementById("camera-rotate")

// Save JSON (currently unused)
let saveJSON = `
{
    "gamestage_components": {
        "gamestage_tags": [],
        "gamestage": 0
    }
}
`


// Verify all components of save are present and paresable
function verifySaveIntegrity(save) {
    saveJSON = JSON.parse(save)
    if (saveJSON.gamestage_components != undefined &&
        saveJSON.gamestage_components.gamestage_tags != undefined &&
        saveJSON.gamestage_components.gamestage != undefined) log ("Save is not corrupt");
    else assert (false, "Missing components")
}

// Intervals and movement related functions
let lastZIncrease, 
    lastZDecrease, 
    lastYawIncrease, 
    lastYawDecrease, 
    lastXIncrease, 
    lastXDecrease, 
    lastPitchIncrease, 
    lastPitchDecrease;
let movespeed = 0.5;
let sensitivity = 0.002;

// Interval names
let increaseZInterval,
    decreaseZInterval,
    increaseXInterval,
    decreaseXInterval,
    increaseYawInterval,
    decreaseYawInterval,
    increasePitchInterval,
    decreasePitchInterval

function cameraHandler () {
    // Clamp so we can't invert view direction (leads to unwanted inversion of yaw)
    pitch = (pitch > pi / 2)? pi / 2: (pitch < -pi / 2)? -pi / 2: pitch

    // Take the modulo so our value stays within normal bounds.
    yaw = yaw < 0? yaw + 2 * pi: yaw > 2 * pi? yaw - 2 * pi: yaw 

    // Set our translation and rotation
    cameratrans.setAttribute("style", `transform: translate3d(calc(${cameraX}px + 50vw), 150px, ${cameraZ}px)`);
    camerarot.setAttribute("style", `transform: rotateX(${pitch}rad) rotateY(${-yaw}rad)`)
}

function rotateX(coord, val) {
    let x = coord.x,
        y = coord.y,
        z = coord.z
    return {
        x: x, 
        y: y * cos(val) - z * sin(val), 
        z: y * sin(val) + z * cos(val)
    }
}

function rotateY(coord, val) {
    let x = coord.x,
        y = coord.y,
        z = coord.z
    return {
        x: z * sin(val) + x * cos(val), 
        y: y, 
        z: z * cos(val) - x * sin(val)
    }
}


function rotateZ(coord, val) {
    let x = coord.x,
        y = coord.y,
        z = coord.z
    return {
        x: x * cos(val) - y * sin(val), 
        y: x * sin(val) + y * sin(val), 
        z: z
    }
}

function translateX(coord, val) {
    let x = coord.x,
        y = coord.y,
        z = coord.z
    return {
        x: x + val, 
        y: y, 
        z: z
    }
}

function translateY(coord, val) {
    let x = coord.x,
        y = coord.y,
        z = coord.z
    return {
        x: x, 
        y: y + val, 
        z: z
    }
}

function translateZ(coord, val) {
    let x = coord.x,
        y = coord.y,
        z = coord.z
    return {
        x: x, 
        y: y, 
        z: z + val
    }
}

function toHomogeneous(coord) {
    return [coord[0], coord[1], coord[2], 1]
}

function toCartesian(coord) {
    return [coord[0] / coord[3], coord[1] / coord[3], coord[2] / coord[3]]
}

function rightMultiplyVector(m1, v1) {
    return [m1[ 0] * v1[0] + m1[ 4] * v1[1] + m1[ 8] * v1[2] + m1[12] * v1[3], 
            m1[ 1] * v1[0] + m1[ 5] * v1[1] + m1[ 9] * v1[2] + m1[13] * v1[3], 
            m1[ 2] * v1[0] + m1[ 6] * v1[1] + m1[10] * v1[2] + m1[14] * v1[3], 
            m1[ 3] * v1[0] + m1[ 7] * v1[1] + m1[11] * v1[2] + m1[15] * v1[3]]
}

function leftMultiplyVector(m1, v1) {
    return [m1[ 0] * v1[0] + m1[ 1] * v1[1] + m1[ 2] * v1[2] + m1[ 3] * v1[3], 
            m1[ 4] * v1[0] + m1[ 5] * v1[1] + m1[ 6] * v1[2] + m1[ 7] * v1[3], 
            m1[ 8] * v1[0] + m1[ 9] * v1[1] + m1[10] * v1[2] + m1[11] * v1[3], 
            m1[12] * v1[0] + m1[13] * v1[1] + m1[14] * v1[2] + m1[15] * v1[3]]
}

function matMultiply4x4(m1, m2) {
    let ax1 = m1[ 0], ax2 = m1[ 1], ax3 = m1[ 2], ax4 = m1[ 3],
        ay1 = m1[ 4], ay2 = m1[ 5], ay3 = m1[ 6], ay4 = m1[ 7],
        az1 = m1[ 8], az2 = m1[ 9], az3 = m1[10], az4 = m1[11],
        aw1 = m1[12], aw2 = m1[13], aw3 = m1[14], aw4 = m1[15]
    let bx1 = m2[ 0], bx2 = m2[ 1], bx3 = m2[ 2], bx4 = m2[ 3],
        by1 = m2[ 4], by2 = m2[ 5], by3 = m2[ 6], by4 = m2[ 7],
        bz1 = m2[ 8], bz2 = m2[ 9], bz3 = m2[10], bz4 = m2[11],
        bw1 = m2[12], bw2 = m2[13], bw3 = m2[14], bw4 = m2[15]
    return [
        ax1 * bx1 + ax2 * by1 + ax3 * bz1 + ax4 * bw1,  ax1 * bx2 + ax2 * by2 + ax3 * bz2 + ax4 * bw2,  ax1 * bx3 + ax2 * by3 + ax3 * bz3 + ax4 * bw3,  ax1 * bx4 + ax2 * by4 + ax3 * bz4 + ax4 * bw4,
        ay1 * bx1 + ay2 * by1 + ay3 * bz1 + ay4 * bw1,  ay1 * bx2 + ay2 * by2 + ay3 * bz2 + ay4 * bw2,  ay1 * bx3 + ay2 * by3 + ay3 * bz3 + ay4 * bw3,  ay1 * bx4 + ay2 * by4 + ay3 * bz4 + ay4 * bw4,
        az1 * bx1 + az2 * by1 + az3 * bz1 + az4 * bw1,  az1 * bx2 + az2 * by2 + az3 * bz2 + az4 * bw2,  az1 * bx3 + az2 * by3 + az3 * bz3 + az4 * bw3,  az1 * bx4 + az2 * by4 + az3 * bz4 + az4 * bw4,
        aw1 * bx1 + aw2 * by1 + aw3 * bz1 + aw4 * bw1,  aw1 * bx2 + aw2 * by2 + aw3 * bz2 + aw4 * bw2,  aw1 * bx3 + aw2 * by3 + aw3 * bz3 + aw4 * bw3,  aw1 * bx4 + aw2 * by4 + aw3 * bz4 + aw4 * bw4,
    ]
}

function fromMatrix3d(transform) {
    return transform.substring(9, transform.length-1).split(",").map((val) => + +val);
}

function fromMatrix2d(transform) {
    return from2d(transform.substring(7, transform.length-1).split(",").map((val) => + +val))

}

function toMatrix3d(transform) {
    return `matrix3d(${""+transform})`
}

function getTotalTransform(element) {
    // This is our identity matrix. It will be transformed into our total transform over time.
    let runningTransform = identMatrix()
    let transform
    while(element.id != "camera-translate") {
        transform = window.getComputedStyle(element).transform
        if (transform.startsWith("matrix3d")) if (transform != "none") runningTransform = matMultiply4x4(runningTransform, fromMatrix3d(transform))
        else; else if (transform.startsWith("matrix")) if (transform != "none") runningTransform = matMultiply4x4(runningTransform, fromMatrix2d(transform))
        element = element.parentElement
    }
    return runningTransform;
}

function uvElementToWorld(elm, u, v) {
    let transform = getTotalTransform(elm)
    let vector = [u, v, 0, 1]
    let transformedCoord = rightMultiplyVector(transform, vector)
    return toCartesian(transformedCoord)
}

function toCamera(elm, u, v) {
    let transformedUV = uvElementToWorld(elm, u, v)
    return [cameraX + transformedUV[0], cameraY + transformedUV[1], cameraZ + transformedUV[2]]
}

function distToCamera(elm, u, v) {
    return pythag(toCamera(elm, u, v))
}
function distToCameraArr(elm, uv) {
    return pythag(toCamera(elm, uv[0], uv[1]))
}

function distToCameraProvider(elm) {
    let transform = getTotalTransform(elm)
    return (u, v) => {
        let transformedUV = toCartesian(rightMultiplyVector(transform, [u, v, 0, 1]))
        return pythag([cameraX - transformedUV[0], cameraY - transformedUV[1], cameraZ - transformedUV[2]])
    }
}

function pythag(vec) {
    return sqrt(vec.reduce((x,y) => x + y * y, 0))
}

markers.innerHTML += '<div id="mark1" ></div>'

setTimeout(() => {
    log(generateRequiredGradients(document.getElementById("groundrender")))
    setInterval(() => {
    let time = performance.now()
    let vec = uvElementToWorld(document.getElementById("transformtest"), -50, -50)
    markers.setAttribute("style", `transform: translate3d(${vec[0]}px, ${vec[1]}px, ${vec[2]}px);`)
    let elm = document.getElementById("mark1")
    let startPos = {u: 0, v: 0}
    let distance = distToCamera(elm, startPos.u, startPos.v)
    let fractalLevel = floor(-log2(fidelity/distance))
    let partialLevel = (distance/fidelity - (2 ** fractalLevel))/(2 ** fractalLevel)
    let time1 = performance.now()
    document.getElementById("mark1").parentElement.innerHTML = `<div id="mark1" style="background-image: ${generateRequiredGradients(document.getElementById("mark1"))}"></div>`
    
    let time2 = performance.now()
    //log(time2-time1)
}, 1000/34)}, 200)

const fidelity = 10,
      dotScale = 1.5,
      maxLevels = 5

function toGradients(u, v, centers, radii) {
    return radii.reduce((valPrev, valNew, ind) => valPrev + ((valNew > 0.01)? `, radial-gradient(circle at ${round((u + centers[ind][0]))}px ${round((v + centers[ind][1]))}px, black ${round(valNew)}px, transparent ${round(valNew)}px)`: ""), "");
}

function cross(a, b) {
    return [a[2] * b[3] - a[3] * b[2], 
            a[1] * b[3] - a[3] * b[1],
            a[1] * b[2] - a[2] * b[1]]
}

function minus(a, b) {
    return a.map((k, i) => k - b[i])
}

function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]
}

function scale(v, n) {
    return v.map((v) => v * n)
}

function project(normal, point, pointOnPlane) {
    return minus(point, scale(normal, dot(minus(pointOnPlane, point), normal)))
}

let transform, planeNormal, planeOrigin, planeTangent, tangent, normal

function getNormal(elm) {
    transform = getTotalTransform(elm)
    planeNormal = toCartesian(rightMultiplyVector(transform, [0, 0, 1, 1]))
    planeOrigin = toCartesian(rightMultiplyVector(transform, [0, 0, 0, 1]))
    normal = minus(planeNormal, planeOrigin)
    return normal 
}

function findClosest(elm) {
    transform = getTotalTransform(elm)
    planeNormal = toCartesian(rightMultiplyVector(transform, [0, 0, 1, 1]))
    planeOrigin = toCartesian(rightMultiplyVector(transform, [0, 0, 0, 1]))
    normal = minus(planeNormal, planeOrigin)
    let vec = toCartesian(rightMultiplyVector(Matrix.matrixInverse(Matrix.arr2mat(4, 4, getTotalTransform(elm))).flat(2), toHomogeneous(project(normal, [-cameraX, cameraY, cameraZ], planeOrigin))))
    return [vec[0], vec[1]]
}

findClosest(document.getElementById('mark1'))

const levels = 1;
let fractalGenerator = [[0, 0], [0.5, 0.5], [0.5, 0], [0, 0.5]];
const nodeConfig = fractalize.repeat(levels)(fractalGenerator)[0]
let startTime

function fractalize(generator) {
    return generator.map((x) => fractalGenerator.map((y) => [x[0] / 2 + y[0], x[1] / 2 + y[1]])).flat(1)
}
let partialLevelCenters, currentIndex, radii
function generateSegment(u, v, level, partial, dist, segwidth) {
    partialLevelCenters = [...nodeConfig];
    currentIndex = 21
    radii = partialLevelCenters.map(() => (--currentIndex, 
        max(min(currentIndex - (partial * nodeConfig.length), 1), 0)
    ) * (dist/20) * dotScale / fidelity);
    return toGradients(u, v, nodeConfig.map(node => [node[0] * segwidth, node[1] * segwidth]), radii)
}

let clip = (num, max, min) => num > max? max: num < min? min: num

const maxSegments = 80000

function quickIntExpo(e) {
    return e > 0? 2 << (e - 1): 1 / (2 << e)
}

function normalize (vec) {
    let py = pythag(vec)
    return [vec[0]/py, vec[1]/py, vec[2]/py]
}

let closest, element, totalWidth, totalHeight, roundWidth, roundHeight, segwidth, closestClipped, distance, partial, requested
let n = 0;
function descend(level, u, v, segwidth) {
    if (u > totalWidth || v > totalHeight) {return "";}
    closestClipped = [clip(closest[0], u + segwidth, u), clip(closest[1], v + segwidth, v)]
    distance = distToCameraArr(element, closestClipped)
    partial = ((distance/fidelity) - segwidth)/segwidth
    //partial = (2 ** partial) - 1
    requested = floor(-log2(fidelity/distance))
    if (requested < level && level - 1 > maxLevels && !(n > maxSegments)) {
        return descend(level - 1, u + (segwidth/2), v + (segwidth/2), segwidth/2) + descend(level - 1, u + (segwidth/2), v, segwidth/2) + descend(level - 1, u, v + (segwidth/2), segwidth/2) + descend(level - 1, u, v, segwidth/2)
    } else {
        return generateSegment(u, v, level, partial, distance, segwidth)
    }
}

function generateRequiredGradients(elm) {
    totalWidth = elm.scrollWidth,
    totalHeight = elm.scrollHeight,
    roundWidth = 2 ** ceil(log2(elm.scrollWidth)),
    roundHeight = 2 ** ceil(log2(elm.scrollHeight))
    element = elm
    closest = findClosest(elm)
    let closestClipped = [clip(closest[0], roundWidth, 0), clip(closest[1], roundHeight, 0)]
    /*if(
        dot(
            normalize(
                minus(
                    uvElementToWorld(elm, closestClipped[0], closestClipped[1]), 
                    [cameraX, cameraY, cameraZ]
                )
            ), 
            getLookVectorArr()
        ) < 0.1 || 
        dot(
            getLookVectorArr(), 
            getNormal(elm)
        ) < 0.1) return;
    /* */
    n = 0;
    startTime = performance.now();
    let gradients = "radial-gradient(circle at 0px 0px, white 0px, transparent 0px)" + descend(max(ceil(log2(elm.scrollWidth)), ceil(log2(elm.scrollHeight))), 0, 0, (2**max(ceil(log2(elm.scrollWidth)), ceil(log2(elm.scrollHeight)))))
    return gradients
}


let i = 0;
let boxesRegistered = false;

function registerIdentifierBoxes() {
    // Don't create elements with the same ID (that would be bad)
    if (boxesRegistered) return;

    // Iterate over our identifier elements.
    for (const e of identifiers) {
        // Create our 2d boxes
        identifierpath.innerHTML += `<div id="identifierbox${i}" class="identifierbox"><div class="actions"></div><div class="associations"></div><div class="names"></div><div class="properties"></div></div>`

        // Register our 2d boxes
        identifierBoxes[i] = document.getElementById(`identifierbox${i}`)

        // Get our identifier's contents (these are hidden in the 3d view.)
        identifierProperties[i] = e.children;

        // Store our dimensions. This helps to optimize our DOM acesses, since otherwise we would be setting our properties every tick (1ms at the moment).
        identifierSizes[i] = {topdims: {top: 0, left: 0, height: 0, width: 0, rendered: false}, propertydims: {width: 0}};
        
        // Increase our array indexes.
        i += 1;
    }

    // Prevent this from being done again (again, same ID would be bad)
    boxesRegistered = true;
}

registerIdentifierBoxes()

function dotProduct(x1, y1, z1, x2, y2, z2) {
    return (x1 * x2) + (y1 * y2) + (z1 * z2);
}

function getLookVector() {
    
    /* [markdown]
    *   Imagine we have a unit sphere, and a point upon it. We only know the point's pitch and yaw, and must find where it is on the sphere.
    *   Since our yaw applies first, we must first find the point along the unit *circle* where our point lies (essentially, the half-plane in which it *could* lie). We can do this easily using Euler's identity:
        
        *       $e^{i\theta} = \cos(\theta) + i \sin(\theta)$

        *   where theta is our yaw. Converting from imaginary to parametric, we have:

        *       {x: sin(θ), z: cos(θ)}
            
        *   You may notice that we have x and z instead of x and y, and that they are reversed. 
        *   We have Z because Y is our upwards direction, which we have not derived yet.
        *   But for X and Z being swapped: This is HTML trickery and I have NO IDEA why it is. AT ALL.
        *   I think it has something to do with how the camera is configured (?) but I have no idea. 
        -# someone please tell me ::(
        
        *   We now have to get the position of the camera upwards. 
        *   The next step is to acquire the great circle perpendicular to the unit circle and passing through our point.
        *   The first step in this process is to see that the 'y' of this circle is *always upwards*. From this, we can derive our final Y coordinate:
        *   
        *       {x: sin(θ), y: sin(φ), z: cos(θ)}
        *   
        *   The next step is to recognize that we already have the 'x' of this circle: our original X and Z. So, all we have to do is multiply them by the cosine of our pitch:
        *   
        *       {x: sin(θ)cos(φ), y: sin(φ), z: cos(θ)cos(φ)}
        *   
        *   and we have our final answers.
        */
    
    return {x: sin(yaw) * cos(pitch), y: -sin(pitch), z: cos(yaw) * cos(pitch)}
}

function getLookVectorArr() {
    return [sin(yaw) * cos(pitch), -sin(pitch), cos(yaw) * cos(pitch)]
}

function getRotVector(vec) {
    return [asin((vec[0]/pythag(vec))/cos(asin(-(vec[1]/pythag(vec))))), asin(-(vec[1]/pythag(vec)))]
}

function identifiableHandler() {
    i = 0;
    // Iterate over all identifiers
    for (const e of identifiers) {
        // Get their origin's x, y, and z
        let identX = e.getAttribute("--3d-x"),
            identY = e.getAttribute("--3d-y"),
            identZ = e.getAttribute("--3d-z");

        // Get distance to camera
        let dX = cameraX - identX,
            dY = cameraY - identY,
            dZ = cameraZ - identZ;

        // Get our look vector.

        let lookVec = getLookVector()
        let lookX = lookVec.x,
            lookY = lookVec.y,
            lookZ = lookVec.z

        // We have to check if this specific identifiable is behind the camera, because otherwise we would *also* render our action box at 180 degrees from the current look view.
        // This is done using linear algebra. Specifically, if our vectors are more than 90 degrees apart (where we can garuntee they aren't rendering), their dot product will be less than zero.
        // (yes, this is why we calculated the look vector earlier)
        let isRendered = sign(dotProduct(dX, dY, dZ, lookX, lookY, lookZ)) < 0;

        // Do some trig to get our rotation angles.
        /* [markdown]
      * Time for some more **math**! Trig again. Gotta love it.
      * In order to get the angles we need, we use right triangles.
      * Our first angle, yaw, we get using the right triangle on the ground (ignoring Y):
      * 
      *           θ (yaw)
      *           /|
      *          / |
      *         /  |
      *    dR  /   | dX
      *       /    |
      *      /     |
      *     /______|
      *       dZ
      * 
      * The first step here is to calculate dR, which using the pythagorean theorum is √dX²+dZ².
      * Translating to code, that's sqrt(dX * dX + dZ * dZ).
      * The next step in getting our object's required yaw is taking the arcsin. We derive this from:
      * 
      *     sin(θ) = dZ/dR
      *         θ  = asin(dZ/dR)
      * 
      * Of course, arcsin won't give us the full answer, because it doesn't preserve our sign. Instead, we now have to check the sign of our X, and multiply by -1 if it's <0:
      * 
      *            = asin(dZ/dR) * sign(dX)
      * 
      * And subtract pi/2 so it's perpendicular to us instead of parallel, as well as multiply by negative one since HTML hates us:
      * 
      *            = -(asin(dZ/dR) + pi/2) * sign(dX)
      *            
      * We do the same with pitch, except with dR and dD instead of dZ and dR. Also, since pitch faces perpendicular to our element, we don't have to add pi/2.
        */
        let dR = sqrt(dX*dX + dZ*dZ)
        let dD = sqrt(dR*dR + dY*dY)
        let pitch2 = -(asin(dR/dD)) * sign(dY)
        let yaw2 = (asin(dZ/dR) + pi/2) * sign(dX) * -1

        // Set our 3d box's rotation and translation.
        e.setAttribute("style", `transform: rotateY(${yaw2}rad) rotateX(${pitch2 + pi/2}rad)`)
        
        // Get its boundaries on screen
        let bound = e.getBoundingClientRect();

        // Get its center
        let y = (bound.top + bound.bottom)/2;
        let x = (bound.right + bound.left)/2;
        
        // Get our properties box (2d) and its bounds
        let props = identifierBoxes[i].children[3];
        let propsBound = props.getBoundingClientRect();

        // Get our 2d ident box's desired size
        let size = min(150000/dD, 300);

        // Get our previous and current size tables
        let prevSize = identifierSizes[i]
        let currSize = 
        {
            topdims: {
                top: y - size/2, 
                left: x - size/2, 
                height: size, 
                width: size,
                rendered: isRendered
            }, 
            propertydims: {
                width: -propsBound.width - 10
            }
        };

        // Check if our dimensions have changed
        if ((prevSize.topdims.top      != currSize.topdims.top || 
             prevSize.topdims.left     != currSize.topdims.left || 
             prevSize.topdims.height   != currSize.topdims.height || 
             prevSize.topdims.width    != currSize.topdims.width ||
             prevSize.topdims.rendered != currSize.topdims.rendered) && isRendered) 
        {
            // If they have, set our attributes
            identifierBoxes[i].setAttribute("style", `top: ${y - size/2}px; left: ${x - size/2}px; height: ${size}px; width: ${size}px`);
        } else if (prevSize.topdims.rendered != currSize.topdims.rendered && !isRendered) {
            // If it isn't rendered *and* it *was* rendered last frame, set it's visibility to hidden
            identifierBoxes[i].setAttribute("style", `visibility: hidden`)
        }

        // If our property box's dimensions have changed, set those dimensions (currently, the Right property, which changes dynamically based on its width)
        if (prevSize.propertydims.width != currSize.propertydims.width && isRendered) {
            identifierBoxes[i].children[3].setAttribute("style", `right: ${-propsBound.width - 10}px`)
            identifierBoxes[i].children[3].innerHTML = identifierProperties[0][0].innerHTML;
        }

        // Set our identifier sizes
        identifierSizes[i] = currSize
    }
}

// Move handlers

let moveForward = () => 
    {
        let t = now();
        let dt = t - lastZIncrease;
        cameraZ += cos(yaw) * movespeed * dt
        cameraX += sin(yaw) * movespeed * dt
        lastZIncrease = t
    },
    moveBackward = () => {
        let t = now()
        let dt = t - lastZDecrease
        cameraZ -= cos(yaw) * movespeed * dt
        cameraX -= sin(yaw) * movespeed * dt
        lastZDecrease = t
    },
    strafeLeft =  () => {
        let t = now()
        let dt = t - lastXIncrease
        cameraZ += sin(-yaw) * movespeed * dt
        cameraX += cos(-yaw) * movespeed * dt
        lastXIncrease = t
    },
    strafeRight = () => {
        let t = now()
        let dt = t - lastXDecrease
        cameraZ -= sin(-yaw) * movespeed * dt
        cameraX -= cos(-yaw) * movespeed * dt
        lastXDecrease = t
    },
    lookLeft = () => {
        let t = now()
        let dt = t - lastYawIncrease
        yaw += sensitivity * dt
        lastYawIncrease = t
    },
    lookRight = () => {
        let t = now()
        let dt = t - lastYawDecrease
        yaw -= sensitivity * dt
        lastYawDecrease = t
    },
    lookUp = () => {
        let t = now()
        let dt = t - lastPitchIncrease
        pitch += sensitivity * dt
        lastPitchIncrease = t
    },
    lookDown = () => {
        let t = now()
        let dt = t - lastPitchDecrease
        pitch -= sensitivity * dt
        lastPitchDecrease = t
    };



let keyControls3d = true;

let moveForwardKey = "KeyW",
    moveBackwardKey = "KeyS",
    strafeLeftKey = "KeyA",
    strafeRightKey = "KeyD",
    lookLeftKey = "KeyQ",
    lookRightKey = "KeyE",
    lookUpKey = "KeyZ",
    lookDownKey = "KeyC";

let tracking;


// Initialize handlers

setInterval(identifiableHandler, 0)

setInterval(cameraHandler, 0)

addEventListener("mousemove", (event) => {
    // If we're tracking, update our pitch and yaw
    if (tracking) {
        pitch -= event.movementY * sensitivity
        yaw -= event.movementX * sensitivity
    }
})

scene.addEventListener('mousedown', function(event) {
    if (event.button == 0) {
        tracking = true;
        // Lock our pointer for easier movement, but only if we click on the background
        document.body.requestPointerLock();
    }
});
  
document.addEventListener('mouseup', function(event) {
    if (event.button == 0) {
        tracking = false;
        // Exit our pointer lock
        document.exitPointerLock();
    }
});

addEventListener("keyup", (event) => {
    // Clear the interval, and clear the interval's slot in code
    switch (event.code) {
        case moveForwardKey:
            clearInterval(increaseZInterval)
            increaseZInterval = undefined
            break
        case moveBackwardKey:
            clearInterval(decreaseZInterval)
            decreaseZInterval = undefined
            break            
        case strafeLeftKey:
            clearInterval(increaseXInterval)
            increaseXInterval = undefined
            break
        case strafeRightKey:
            clearInterval(decreaseXInterval)
            decreaseXInterval = undefined
            break
        case lookLeftKey:
            clearInterval(increaseYawInterval)
            increaseYawInterval = undefined
            break
        case lookRightKey:
            clearInterval(decreaseYawInterval)
            decreaseYawInterval = undefined
            break
        case lookUpKey:
            clearInterval(increasePitchInterval)
            increasePitchInterval = undefined
            break
        case lookDownKey:
            clearInterval(decreasePitchInterval)
            decreasePitchInterval = undefined
            break
    }
})

addEventListener("keydown", (event) => { 
    if (keyControls3d) switch(event.code) {
        // For each of these, check if we already set the interval, and if not, create one
        case moveForwardKey:
            if (increaseZInterval == undefined) {
                lastZIncrease = now()
                increaseZInterval = setInterval(moveForward, 1)
            }
            break;
        case moveBackwardKey:
            if (decreaseZInterval == undefined) {
                lastZDecrease = now()
                decreaseZInterval = setInterval(moveBackward, 1)
            }
            break;
        case strafeLeftKey:
            if (increaseXInterval == undefined) {
                lastXIncrease = now()
                increaseXInterval = setInterval(strafeLeft, 1)
            }
            break;
        case strafeRightKey:
            if (decreaseXInterval == undefined) {
                lastXDecrease = now()
                decreaseXInterval = setInterval(strafeRight, 1)
            }
            break;
        case lookLeftKey:
            if (increaseYawInterval == undefined) {
                lastYawIncrease = now()
                increaseYawInterval = setInterval(lookLeft, 1)
            }
            break;
        case lookRightKey:
            if (decreaseYawInterval == undefined) {
                lastYawDecrease = now()
                decreaseYawInterval = setInterval(lookRight, 1)
            }
            break;
        case lookUpKey:
            if (increasePitchInterval == undefined) {
                lastPitchIncrease = now()
                increasePitchInterval = setInterval(lookUp, 1)
            }
            break;
        case lookDownKey:
            if (decreasePitchInterval == undefined) {
                lastPitchDecrease = now()
                decreasePitchInterval = setInterval(lookDown, 1)
            }
            break;
    }
}) 

generateRequiredGradients(document.getElementById("groundrender"))







