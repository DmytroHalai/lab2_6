'use strict';

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

export {matrixOutput};