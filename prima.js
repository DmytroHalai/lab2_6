'use strict';

import {calculateAngle, createDirMatrix, findVertexCoord, lineVal, undirMatrix} from "./utility.js";
import {arrow, drawEllipse, drawLine, drawOnlyVertex, drawStitch, drawVertexes, drawWeight} from "./draw.js";

const colors = ["red", "blue", "black", "green", "yellow",
    "brown", "#70295a", "orange", "#295b70", "#70294f"];

class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    add(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }

    delete(data) {
        let current = this.head;
        let prev = null;

        while (current != null) {
            if (current.data === data) {
                if (prev == null) {
                    this.head = current.next;
                } else {
                    prev.next = current.next;
                }
                this.size--;
                return current.data;
            }
            prev = current;
            current = current.next;
        }
        return null;
    }

    getSize() {
        return this.size;
    }

    print() {
        let current = this.head;
        let result = '';
        while (current) {
            result += current.data + ' -> ';
            current = current.next;
        }
        console.log(result + 'null');
    }
}

const weightMatrix = (matrix) => {
    const { length } = matrix;
    const mat = undirMatrix(matrix);
    const b = createDirMatrix(3105, true);
    const cTemp = Array.from({ length }, () => Array(length).fill(0));
    const c = cTemp.map((value, index) => value.map(
        (value2, index2) => Math.ceil(100 * b[index][index2] * mat[index][index2])
    ));
    const dTemp = Array.from({ length }, () => Array(length).fill(0));
    const d = dTemp.map((value, index) => value.map(
        (value2, index2) => c[index][index2] === 0 ? 0 : 1)
    );
    const hTemp = Array.from({ length }, () => Array(length).fill(0));
    const h = hTemp.map((value, index) => value.map(
        (value2, index2) => d[index][index2] !== d[index2][index] ? 1 : 0)
    );
    const tr = Array.from({ length }, () => Array(length).fill(0));
    for (let i = 0; i < length; i++){
        for (let j = i; j < length; j++){
             tr[i][j] = 1;
        }
    }
    const w = Array.from({ length }, () => Array(length).fill(0));
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < i; j++) {
            w[i][j] = w[j][i] = (d[i][j] + h[i][j] * tr[i][j]) * c[i][j];
        }
    }
    return w;
}

const sort = (matrix) => {
    const { length } = matrix;
    const mat = matrix.map((value) => value.map(Math.round));
    const result = Array.from({ length }, () => [])
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            if (matrix[i][j] !== 0 && matrix[i][j] !== Infinity) {
                result[i].push([j, mat[i][j]]);
            }
        }
    }
    for (const row of result) {
        row.sort(([, k1], [, k2]) => k1 - k2);
    }
    return result;
};

const prima = (matrix, start) => {
    const weight = weightMatrix(matrix);
    const W = sort(weight);
    const { length } = matrix;
    const visited = new Array(length).fill(false);
    visited[start] = true;
    const result = new LinkedList();
    const stack = [start];
    let totalSum = 0;
    while (stack.length) {
        const vertex = stack.at(-1);
        let min = Infinity;
        let index = -1;
        const row = W[vertex];
        for (const [i, m] of row) {
            if (visited[i]) continue;
            index = i;
            min = m;
            break;
        }
        if (index === -1) {
            stack.pop();
            continue
        }
        result.add([vertex, index]);
        stack.push(index);
        visited[index] = true;
        totalSum += min;
    }
    return { result, totalSum };
};

const drawPrima = (matrix, x, y, ctx, count, radius, clickQueue, button) => {
    const w = weightMatrix(matrix);
    const coords = findVertexCoord(matrix.length, x, y);
    const array = prima(matrix, 0);
    console.log(array)
    console.log('Adjacency matrix of the graph');
    console.table(matrix);
    console.log('Weighted matrix of the graph');
    console.table(w);
    console.log('Total sum in result of tracing this graph: ' + array.totalSum);
    const length = array.result.getSize();
    console.log(length);
    let pointer = 0;
    console.log('The list of graph edges:');
    drawVertexes(ctx, count, x, y, radius);
    array.result.print();
    let current = array.result.head;
    while(current !== null){
        const start = current.data[0];
        const end = current.data[1];
        const angle = calculateAngle(coords, start, end);
        const val = lineVal(coords, start, end, radius);
        const color = colors[pointer];
        console.log((start + 1) + ' -> ' + (end + 1));
        if (start === end) {
            clickQueue.enqueue(() => {
                drawStitch(coords, start, ctx, radius, color);
                drawOnlyVertex(coords, start, ctx, radius, color);
                drawOnlyVertex(coords, end, ctx, radius, color);
                arrow(coords, end, angle, radius, ctx, color);
                drawWeight(coords, start, end, ctx, radius, w, 10, true, color);
            })
        }
        else if (val !== null){
            clickQueue.enqueue(() => {
                drawEllipse(coords, start, end, angle, ctx, radius, color);
                drawOnlyVertex(coords, start, ctx, radius, color);
                drawOnlyVertex(coords, end, ctx, radius,color);
                arrow(coords, end, angle, radius, ctx, color, 1);
                drawWeight(coords, start, end, ctx, radius, w, 10, true, color);
            })

        }
        else{
            clickQueue.enqueue(() => {
                drawLine(coords, start, end, ctx, radius, angle, color);
                drawOnlyVertex(coords, start, ctx, radius, color);
                drawOnlyVertex(coords, end, ctx, radius, color);
                arrow(coords, end, angle, radius, ctx, color);
                drawWeight(coords, start, end, ctx, radius, w, 10, true, color);
            })

        }
        pointer++;
        current = current.next;
    }
    button.addEventListener("click", clickQueue.next);

}

export { weightMatrix, drawPrima, prima};