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

const matrix = createMatrix(3105);

for (let i = 0; i < matrix.length; i++){
    let rowString = "";
    for (let j = 0; j < matrix[0].length; j++){
        rowString += matrix[i][j] + " ";
    }
    console.log(rowString);
}