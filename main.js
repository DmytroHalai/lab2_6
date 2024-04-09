'use strict';

import {matrixOutput} from "./output.js";
import {createDirMatrix, undirMatrix} from "./utility.js";
import {drawVertexes, drawUndirMatrixEdges, drawDirMatrixEdges} from "./draw.js";

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const VERTEX_COUNT = 10;
const VERTEX_RADIUS = 15;
const N = 3105;

const matrix = createDirMatrix(N)
const undMatrix = undirMatrix(createDirMatrix(N));
drawUndirMatrixEdges(300, 180, N, ctx, VERTEX_RADIUS, VERTEX_COUNT);
drawDirMatrixEdges(800, 180, N, ctx, VERTEX_RADIUS, VERTEX_COUNT);
drawVertexes(ctx, VERTEX_COUNT, 300, 180, VERTEX_RADIUS);
drawVertexes(ctx, VERTEX_COUNT, 800, 180, VERTEX_RADIUS);
matrixOutput(matrix, "dirMatrixTable");
matrixOutput(undMatrix, "undirMatrixTable")