const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const vertexCount = 10;
const vertexRadius = 15;
const vector = (x1, y1, x2, y2) => {
    const x = x2 - x1,
        y = y2 - y1;
    return {
        x: x,
        y: y
    }
}
const vectorModule = (vector) => {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}
function pseudoRandom(seed) {
    let value = seed;

    return function() {
        value = value + value % 5;
        return value % 2;
    }
}
let createMatrix = (n) => {
    const n1 = Math.floor(n / 1000),
        n2 = Math.floor((n - n1 * 1000)/100),
        n3 = Math.floor((n - n1 * 1000 - n2 * 100)/10),
        n4 = Math.floor((n - n1*1000-n2*100-n3*10))
    const variant = [n1, n2, n3, n4];
    const count = 10 + variant[2];
    let generator = pseudoRandom(1);
    let matrix = new Array(count);
    for (let i = 0; i < count; i++) {
        matrix[i] = new Array(count);
    }
    const k = 1.0 - variant[2] * 0.02 - variant[3] * 0.005 - 0.25;
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            matrix[i][j] = Math.floor(generator() * 2 * k);
        }
    }
    return matrix;
}

const findVertexCoord = (vertexCount, firstCoordX, firstCoordy) => {
    let Coords = {
        xCoord: [],
        yCoord: []
    }

    Coords.xCoord[0] = firstCoordX;
    Coords.yCoord[0] = firstCoordy;
    for (let i = 1; i < vertexCount; i++){
        switch (i) {
            case 1: {
                Coords.xCoord[i] = Coords.xCoord[i - 1];
                Coords.yCoord[i] = 150;
                break;
            }
            case 2:
            case 3:
            case 4: {
                Coords.xCoord[i] = Coords.xCoord[i - 1] + 60;
                Coords.yCoord[i] = Coords.yCoord[i - 1] + 100;
                break;
            }
            case 5:
            case 6:
            case 7: {
                Coords.xCoord[i] = Coords.xCoord[i - 1] - 120;
                Coords.yCoord[i] = Coords.yCoord[i - 1];
                break;
            }
            case 8:
            case 9: {
                Coords.xCoord[i] = Coords.xCoord[i - 1] + 60;
                Coords.yCoord[i] = Coords.yCoord[i - 1] - 100;
                break;
            }
            default: {
                break;
            }
        }
    }
    return Coords;
}

const drawOnlyVertice = (Coords, i) => {
    ctx.beginPath();
    ctx.arc(Coords.xCoord[i], Coords.yCoord[i], vertexRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.fillText((i + 1).toString(), Coords.xCoord[i], Coords.yCoord[i]);
}

const drawVertices = (ctx, count, x, y) => {
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
        const Coords = findVertexCoord(count, x, y);
        drawOnlyVertice(Coords, i);
    }
}
const lineVal = (Coords, i, j) => {
    const startX = Coords.xCoord[i];
    const startY = Coords.yCoord[i];
    const endX = Coords.xCoord[j];
    const endY = Coords.yCoord[j];
    const vector1 = vector(startX, startY, endX, endY);
    const a = vectorModule(vector1);
    let valResult = null;
        for (let k = i + 1; k < Coords.xCoord.length; k++){
            const vector2 = vector(startX, startY, Coords.xCoord[k], Coords.yCoord[k]);
            const vector3 = vector(Coords.xCoord[k], Coords.yCoord[k], endX, endY);
            const b = vectorModule(vector2);
            const c = vectorModule(vector3);
            const p = (a + b + c) / 2;
            const height = Math.sqrt(p * (p - a) * (p - b) * (p - c)) * 2 / a;
            if (height + 5 < vertexRadius) {
                valResult = a;
                break;
            }
        }
    return valResult;
}

function drawEdges(x, y) {
    const matrix = createMatrix(3105);
    const Coords = findVertexCoord(vertexCount, x, y);
    for (let i = 0; i < vertexCount; i++) {
        for (let j = 0; j < vertexCount; j++) {
            if (matrix[i][j] === 1) {
                const startX = Coords.xCoord[i];
                const startY = Coords.yCoord[i];
                const endX = Coords.xCoord[j];
                const endY = Coords.yCoord[j];
                const angle = Math.atan2(endY - startY, endX - startX);
                const val = lineVal(Coords, i, j);
                if (i === j) {
                    ctx.beginPath();
                    ctx.moveTo(Coords.xCoord[i], Coords.yCoord[i]);
                    ctx.arc(Coords.xCoord[i] - vertexRadius, Coords.yCoord[i] - vertexRadius,
                        vertexRadius, Math.PI * 2, 0);
                    ctx.stroke();
                    continue;
                }
                else if (Math.abs(i - j) === 1 && matrix[j][i] !== 1){
                    ctx.beginPath();
                    ctx.moveTo(Coords.xCoord[i], Coords.yCoord[i]);
                    ctx.lineTo(Coords.xCoord[j], Coords.yCoord[j]);
                    ctx.stroke();
                }
                else if (val !== null){
                        const middleX = (Coords.xCoord[i] + Coords.xCoord[j]) / 2;
                        const middleY = (Coords.yCoord[i] + Coords.yCoord[j]) / 2;
                        ctx.beginPath();
                        ctx.moveTo(Coords.xCoord[i], Coords.yCoord[i]);
                        ctx.ellipse(middleX, middleY, val / 2, vertexRadius + 5,
                           angle, Math.PI, 0);
                        ctx.stroke();
                        continue;
                }
                ctx.beginPath();
                ctx.moveTo(Coords.xCoord[i], Coords.yCoord[i]);
                ctx.lineTo(Coords.xCoord[j], Coords.yCoord[j]);
                ctx.stroke();
            }
        }
    }
}
const matrix = createMatrix(3105);
drawEdges(300, 330);
drawEdges(800, 330);
drawVertices(ctx, vertexCount, 300, 330);
drawVertices(ctx, vertexCount, 800, 330);
for (let i = 0; i < matrix.length; i++){
    let rowString = "";
    for (let j = 0; j < matrix[0].length; j++){
        rowString += matrix[i][j] + " ";
    }
    document.querySelector(`output`).innerHTML = JSON.stringify(rowString, null, 4);
}





