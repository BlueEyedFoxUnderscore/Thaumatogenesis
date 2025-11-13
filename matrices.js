


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

export class Matrix {
    
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
}