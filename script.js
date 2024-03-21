const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const VERTEX_COUNT = 10;
const VERTEX_RADIUS = 15;
const N = 3105;

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

const pseudoRandom = (seed) => {
    let value = seed;

    return function() {
        value = (value * 1103515245 + 12345) % 2147483648;
        return value % 100 < 19;
    }
}

const findMaxNeighbourLength = (Coords) => {
    let maxNeighbourLength = 0;
    for (let j = 0; j < VERTEX_COUNT; j++){
        for (let i = 0; i < VERTEX_COUNT; i++){
            const vec = vectorModule(vector(Coords.xCoord[j], Coords.yCoord[j],
                Coords.xCoord[i], Coords.yCoord[i]));
            maxNeighbourLength = maxNeighbourLength > vec ? maxNeighbourLength : vec;
        }
    }
    return maxNeighbourLength;
}

const createDirMatrix = (n) => {
    const n1 = Math.floor(n / 1000),
        n2 = Math.floor((n - n1 * 1000) / 100),
        n3 = Math.floor((n - n1 * 1000 - n2 * 100) / 10),
        n4 = Math.floor((n - n1 * 1000 - n2 * 100 - n3 * 10))
    const variant = [n1, n2, n3, n4];
    const count = 10 + variant[2];
    const generator = pseudoRandom(n);
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

const undirMatrix = (arr) => {
    let matrix = arr;
    for (let i = 0; i < matrix.length; i++){
        for (let j = 0; j < matrix[i].length; j++){
            if (matrix[i][j] === 1){
                matrix[j][i] = 1;
            }
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
            case 1:
            case 2:
            case 3: {
                Coords.xCoord[i] = Coords.xCoord[i - 1] + 60;
                Coords.yCoord[i] = Coords.yCoord[i - 1] + 100;
                break;
            }
            case 4:
            case 5:
            case 6:
            case 7: {
                Coords.xCoord[i] = Coords.xCoord[i - 1] - 90;
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

const drawOnlyVertex = (Coords, i) => {
    ctx.beginPath();
    ctx.arc(Coords.xCoord[i], Coords.yCoord[i], VERTEX_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.fillText((i + 1).toString(), Coords.xCoord[i], Coords.yCoord[i]);
    ctx.closePath();
}

const drawVertexes = (ctx, count, x, y) => {
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
        const Coords = findVertexCoord(count, x, y);
        drawOnlyVertex(Coords, i);
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
    for (let k = 0; k < Coords.xCoord.length; k++){
        if(k === i || k === j) continue;
        if(Math.abs(j - i) === 1) break;
        const vector2 = vector(startX, startY, Coords.xCoord[k], Coords.yCoord[k]);
        const vector3 = vector(Coords.xCoord[k], Coords.yCoord[k], endX, endY);
        const b = vectorModule(vector2);
        const c = vectorModule(vector3);
        const p = (a + b + c) / 2;
        const height = Math.sqrt(p * (p - a) * (p - b) * (p - c)) * 2 / a;
        if (height < VERTEX_RADIUS) {
            valResult = a;
            break;
        }
    }
    return valResult;
}

const matrixOutput = (matrix, tableId) => {
    return document.addEventListener("DOMContentLoaded", function() {

        const table = document.getElementById(tableId);

        let headerRow = table.insertRow();
        headerRow.insertCell();
        for (let j = 0; j < matrix[0].length; j++) {
            let cell = headerRow.insertCell();
            cell.textContent = j + 1 + " - ";
        }

        for (let i = 0; i < matrix.length; i++) {
            let row = table.insertRow();
            let rowNumberCell = row.insertCell();
            rowNumberCell.textContent = i + 1 + " - ";

            for (let j = 0; j < matrix[i].length; j++) {
                let cell = row.insertCell();
                cell.textContent = matrix[i][j] + " - ";
            }
        }
    });
}

const drawStitch = (Coords, i) => {
    ctx.beginPath();
    ctx.moveTo(Coords.xCoord[i], Coords.yCoord[i]);
    ctx.arc(Coords.xCoord[i] - VERTEX_RADIUS, Coords.yCoord[i] - VERTEX_RADIUS,
        VERTEX_RADIUS, Math.PI * 2, 0);
    ctx.stroke();
    ctx.closePath();
}

const drawLine = (Coords, i, j) => {
    ctx.beginPath();
    ctx.moveTo(Coords.xCoord[i], Coords.yCoord[i]);
    ctx.lineTo(Coords.xCoord[j], Coords.yCoord[j]);
    ctx.stroke();
    ctx.closePath();
}

const drawEllipse = (Coords, i, j, angle) => {
    const endX = Coords.xCoord[j] - VERTEX_RADIUS * Math.cos(angle);
    const endY = Coords.yCoord[j] - VERTEX_RADIUS * Math.sin(angle);
    const startX = Coords.xCoord[i],
        startY = Coords.yCoord[i]
    const middleX = (startX + endX) / 2;
    const middleY = (startY + endY) / 2;
    const newAngle = Math.atan2((endY - startY), (endX - startX));
    const radius = vectorModule(vector(startX, startY, endX, endY))
    ctx.beginPath();
    ctx.moveTo(Coords.xCoord[i], Coords.yCoord[i]);
    ctx.ellipse(middleX, middleY, radius / 2, VERTEX_RADIUS * 2,
        newAngle, Math.PI, 0);
    ctx.stroke();
    ctx.closePath();
    return newAngle;
}

const drawArrows = (angle, xArrow, yArrow, n = 0) => {
    let leftX,
        rightX,
        leftY,
        rightY;
    if (n === 1){
        leftX = xArrow - 15 * Math.cos(angle + 0.5 + Math.PI / 3);
        rightX = xArrow - 15 * Math.cos(angle - 0.5 + Math.PI / 3);
        leftY = yArrow - 15 * Math.sin(angle + 0.5 + Math.PI / 3);
        rightY = yArrow - 15 * Math.sin(angle - 0.5 + Math.PI / 3);
    }
    else {
        leftX = xArrow - 15 * Math.cos(angle + 0.5);
        rightX = xArrow - 15 * Math.cos(angle - 0.5);
        leftY = yArrow - 15 * Math.sin(angle + 0.5);
        rightY = yArrow - 15 * Math.sin(angle - 0.5);
    }
    ctx.beginPath();
    ctx.moveTo(xArrow, yArrow);
    ctx.lineTo(leftX, leftY);
    ctx.moveTo(xArrow, yArrow);
    ctx.lineTo(rightX, rightY);
    ctx.stroke();
    ctx.closePath();
}

const arrow = (Coords, j, angle, vertexRadius, n) => {
    const xArrow = Coords.xCoord[j] - vertexRadius * Math.cos(angle);
    const yArrow = Coords.yCoord[j] - vertexRadius * Math.sin(angle);
    drawArrows(angle, xArrow, yArrow, n);
}

const calculateAngle = (Coords, i, j) => {
    const startX = Coords.xCoord[i];
    const startY = Coords.yCoord[i];
    const endX = Coords.xCoord[j];
    const endY = Coords.yCoord[j];
    return Math.atan2(endY - startY, endX - startX);
}

const drawDirMatrixEdges = (x, y, n) => {
    const matrix = createDirMatrix(n);
    const Coords = findVertexCoord(VERTEX_COUNT, x, y);
    for (let i = 0; i < VERTEX_COUNT; i++) {
        for (let j = 0; j < VERTEX_COUNT; j++) {
            if (matrix[i][j] === 1) {
                const angle = calculateAngle(Coords, i, j);
                const val = lineVal(Coords, i, j);
                if (i === j) {
                    drawStitch(Coords, i);
                    arrow(Coords, j, angle, VERTEX_RADIUS);
                }
                else if (matrix[j][i] === 1 && i > j || val !== null){
                    const valid = 1;
                    drawEllipse(Coords, i, j, angle);
                    arrow(Coords, j, angle, VERTEX_RADIUS, valid);
                }
                else {
                    drawLine(Coords, i, j);
                    arrow(Coords, j, angle, VERTEX_RADIUS);
                }
            }
        }
    }
}

const drawUndirMatrixEdges = (x, y, n) => {
    const matrix = undirMatrix(createDirMatrix(n));
    const Coords = findVertexCoord(VERTEX_COUNT, x, y);
    for (let i = 0; i < VERTEX_COUNT; i++) {
        for (let j = 0; j <= i; j++) {
            if (matrix[i][j] === 1) {
                const angle = calculateAngle(Coords, i, j);
                const val = lineVal(Coords, i, j);
                if (i === j) {
                    drawStitch(Coords, i);
                }
                else if (val !== null){
                    drawEllipse(Coords, j, i, angle);
                }
                else{
                    drawLine(Coords, i, j);
                }
            }
        }
    }
}

const matrix = createDirMatrix(N)
const undMatrix = undirMatrix(createDirMatrix(N));
drawUndirMatrixEdges(300, 180, N);
drawDirMatrixEdges(800, 180, N);
drawVertexes(ctx, VERTEX_COUNT, 300, 180);
drawVertexes(ctx, VERTEX_COUNT, 800, 180);
matrixOutput(matrix, "dirMatrixTable");
matrixOutput(undMatrix, "undirMatrixTable")