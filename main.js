'use strict';

import {printMatrix} from "./output.js";
import {createDirMatrix} from "./utility.js";
import {drawDirGraph, BFS, DFS} from "./draw.js";

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const VERTEX_COUNT = 10;
const VERTEX_RADIUS = 15;
const N = 3105;

const matrix = createDirMatrix(N)
drawDirGraph(800, 180, N, ctx, VERTEX_RADIUS, VERTEX_COUNT);
BFS(300, 180, VERTEX_COUNT, matrix, 0, ctx, VERTEX_RADIUS);
DFS(1300, 180, VERTEX_COUNT, matrix, 0, ctx, VERTEX_RADIUS);
printMatrix(matrix);