'use strict';

import {createClickQueue, createDirMatrix, undirMatrix} from "./utility.js";
import {drawGraph} from "./draw.js";
import {drawPrima} from "./prima.js"

const clickQueue = createClickQueue();
const button = document.getElementById("button1");

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const VERTEX_COUNT = 10;
const VERTEX_RADIUS = 15;
const N = 3105;
const matrix = createDirMatrix(N);

drawGraph(800, 180, N, ctx, VERTEX_RADIUS, VERTEX_COUNT, true);
drawPrima(undirMatrix(matrix), 300, 180, ctx, VERTEX_COUNT, VERTEX_RADIUS, clickQueue, button);
