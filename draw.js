'use strict';

import {findVertexCoord, vector, vectorModule, undirMatrix, createDirMatrix, lineVal, calculateAngle} from "./utility.js";

const createClickQueue = () => {
    const queue = []; // Черга функцій для виконання

    const enqueue = (action) => {
        queue.push(action);
    };

    const next = () => {
        if (queue.length > 0) {
            const action = queue.shift(); // Беремо першу дію з черги
            action(); // Виконуємо дію
        }
    };

    return { enqueue, next };
}
const drawOnlyVertex = (Coords, i, ctx, radius) => {
    ctx.beginPath();
    ctx.arc(Coords.xCoord[i], Coords.yCoord[i], radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.fillText((i + 1).toString(), Coords.xCoord[i], Coords.yCoord[i]);
    ctx.closePath();
}

const drawVertexes = (ctx, count, x, y, radius) => {
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
        const Coords = findVertexCoord(count, x, y);
        drawOnlyVertex(Coords, i, ctx, radius);
    }
}

const drawStitch = (Coords, i, ctx, radius) => {
    ctx.beginPath();
    ctx.moveTo(Coords.xCoord[i], Coords.yCoord[i]);
    ctx.arc(Coords.xCoord[i] - radius, Coords.yCoord[i] - radius,
        radius, Math.PI * 2, 0);
    ctx.stroke();
    ctx.closePath();
}

const drawLine = (Coords, i, j, ctx) => {
    ctx.beginPath();
    ctx.moveTo(Coords.xCoord[i], Coords.yCoord[i]);
    ctx.lineTo(Coords.xCoord[j], Coords.yCoord[j]);
    ctx.stroke();
    ctx.closePath();
}

const drawEllipse = (Coords, i, j, angle, ctx, radius) => {
    const endX = Coords.xCoord[j] - radius * Math.cos(angle);
    const endY = Coords.yCoord[j] - radius * Math.sin(angle);
    const startX = Coords.xCoord[i],
        startY = Coords.yCoord[i]
    const middleX = (startX + endX) / 2;
    const middleY = (startY + endY) / 2;
    const newAngle = Math.atan2((endY - startY), (endX - startX));
    const triangleRadius = vectorModule(vector(startX, startY, endX, endY))
    ctx.beginPath();
    ctx.moveTo(Coords.xCoord[i], Coords.yCoord[i]);
    ctx.ellipse(middleX, middleY, triangleRadius / 2, radius * 2,
        newAngle, Math.PI, 0);
    ctx.stroke();
    ctx.closePath();
    return newAngle;
}

const drawArrows = (angle, xArrow, yArrow, ctx, n = 0) => {
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

const arrow = (Coords, j, angle, vertexRadius, ctx, n) => {
    const xArrow = Coords.xCoord[j] - vertexRadius * Math.cos(angle);
    const yArrow = Coords.yCoord[j] - vertexRadius * Math.sin(angle);
    drawArrows(angle, xArrow, yArrow, ctx, n);
}

const clickQueue = createClickQueue();

const drawDirMatrixEdges = (x, y, n, ctx, radius, count) => {
    const matrix = createDirMatrix(n);
    const Coords = findVertexCoord(count, x, y);
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            if (matrix[i][j] === 1) {
                const angle = calculateAngle(Coords, i, j);
                const val = lineVal(Coords, i, j, radius);
                if (i === j) {
                    drawStitch(Coords, i, ctx, radius);
                    arrow(Coords, j, angle, radius, ctx);
                }
                else if (matrix[j][i] === 1 && i > j || val !== null){
                    const valid = 1;
                    drawEllipse(Coords, i, j, angle, ctx, radius);
                    arrow(Coords, j, angle, radius, ctx, valid);
                }
                else {
                    drawLine(Coords, i, j, ctx);
                    arrow(Coords, j, angle, radius, ctx);
                }
            }
        }
    }
}

const drawUndirMatrixEdges = (x, y, n, ctx, radius, count) => {
    const matrix = undirMatrix(createDirMatrix(n));
    const Coords = findVertexCoord(count, x, y);
    for (let i = 0; i < count; i++) {
        for (let j = 0; j <= i; j++) {
            if (matrix[i][j] === 1) {
                const angle = calculateAngle(Coords, i, j);
                const val = lineVal(Coords, i, j, radius);
                if (i === j) {
                    drawStitch(Coords, i, ctx, radius);
                }
                else if (val !== null){
                    drawEllipse(Coords, j, i, angle, ctx, radius);
                }
                else{
                    drawLine(Coords, i, j, ctx);
                }
            }
        }
    }
}

export {drawVertexes, drawOnlyVertex, vectorModule, vector, arrow,
    drawStitch, drawLine, drawEllipse, drawArrows, findVertexCoord, drawDirMatrixEdges, drawUndirMatrixEdges}