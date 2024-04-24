'use strict';

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
    return result
};

const dfs = (matrix, start) => {
    const W = sort(matrix);
    const { length } = matrix;
    const visited = new Array(length).fill(false);
    visited[start] = true;
    const result = [];
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
        result.push([vertex, index]);
        stack.push(index);
        visited[index] = true;
        totalSum += min;
    }
    return { result, totalSum };
};

const matrix = [
    [0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 0],
    [0, 1, 0, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0]
];

const weighted = [
    [0, 12, Infinity, Infinity, 14, Infinity, 20],
    [12, 0, 12, 10, 6, Infinity, Infinity],
    [Infinity, 12, 0, 4, Infinity, Infinity, Infinity],
    [Infinity, 10, 4, 0, Infinity, 6, Infinity],
    [14, 6, Infinity, Infinity, 0, 6, 8],
    [Infinity, Infinity, Infinity, 6, 6, 0, 4],
    [20, Infinity, Infinity, Infinity, 8, 4, 0]
];

console.table(sort(weighted));

const { result, totalSum } = dfs(weighted, 0);
console.log(result);
console.log(totalSum);