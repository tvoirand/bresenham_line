/*
script.js for bresenham_line
author: thibaut voirand
*/

/*Declaring variables*******************************************************************************
***************************************************************************************************/

// canvas related variables
var canvas = document.getElementById('canvasId');
var canvasContext = canvas.getContext('2d');
var canvasData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);

// pixel color and transparency
var rPixel = 255; // red
var gPixel = 0; // green
var bPixel = 0; // blue
var aPixel = 255; // transparency

// input coordinates
var x0;
var y0;
var x1;
var y1;

/*Functions*****************************************************************************************
***************************************************************************************************/

function drawPixel(x, y, r, g, b, a) {
    var index = (x + y * canvas.width) * 4;

    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

function updateCanvas() {
    canvasContext.putImageData(canvasData, 0, 0);
}

function clearCanvas() {
    var j;
    for (j = 0; j < canvasData.data.length; j++) {
        canvasData.data[j] = 0;
    }

    updateCanvas();
}

function getOctant(dx, dy) {
    /*
  Returns the octant in which a line is, in the following scheme, with starting point at center:
  \2|1/
  3\|/0
 ---+---
  4/|\7
  /5|6\
  */
    var octant = 0;
    if (dx >= 0 && dy >= 0 && dx <= dy) {
        // octant 1
        octant = 1;
    } else if (dx <= 0 && dy >= 0 && -dx <= dy) {
        // octant 2
        octant = 2;
    } else if (dx <= 0 && dy >= 0 && -dx >= dy) {
        // octant 3
        octant = 3;
    } else if (dx <= 0 && dy <= 0 && -dx >= -dy) {
        // octant 4
        octant = 4;
    } else if (dx <= 0 && dy <= 0 && -dx <= -dy) {
        // octant 5
        octant = 5;
    } else if (dx >= 0 && dy <= 0 && dx <= -dy) {
        // octant 6
        octant = 6;
    } else if (dx >= 0 && dy <= 0 && dx >= -dy) {
        // octant 7
        octant = 7;
    }
    return octant;
}

function switchToOctantZeroFrom(octant, x, y) {
    /*
  Function to apply on starting and ending points coordinates, to move the line's from original
  octant to octant zero
  */
    if (octant == 0) {
        return [x, y];
    } else if (octant == 1) {
        return [y, x];
    } else if (octant == 2) {
        return [y, -x];
    } else if (octant == 3) {
        return [-x, y];
    } else if (octant == 4) {
        return [-x, -y];
    } else if (octant == 5) {
        return [-y, -x];
    } else if (octant == 6) {
        return [-y, x];
    } else if (octant == 7) {
        return [x, -y];
    }
}

function switchFromOctantZeroTo(octant, x, y) {
    /*
  Function to apply on starting and ending points coordinates, to move the line's from octant zero
  back to original octant
  */
    if (octant == 0) {
        return [x, y];
    } else if (octant == 1) {
        return [y, x];
    } else if (octant == 2) {
        return [-y, x];
    } else if (octant == 3) {
        return [-x, y];
    } else if (octant == 4) {
        return [-x, -y];
    } else if (octant == 5) {
        return [-y, -x];
    } else if (octant == 6) {
        return [y, -x];
    } else if (octant == 7) {
        return [x, -y];
    }
}

function drawBresenhamLine(x0, y0, x1, y1, octant) {
    [x0, y0] = switchToOctantZeroFrom(octant, x0, y0);
    [x1, y1] = switchToOctantZeroFrom(octant, x1, y1);

    var dx = x1 - x0;
    var dy = y1 - y0;
    var D = 2 * dy - dx;
    var y = y0; //

    for (x = x0; x < x1; x++) {
        // switching back to starting octant and drawing pixels
        drawPixel(
            switchFromOctantZeroTo(octant, x, y)[0],
            switchFromOctantZeroTo(octant, x, y)[1],
            rPixel,
            gPixel,
            bPixel,
            aPixel
        );
        if (D > 0) {
            y = y + 1;
            D = D - 2 * dx;
        }
        D = D + 2 * dy;
    }
}

function getInputCoordinates() {
    /*
  This function assigns user-entered coordinates to the corresponding variables
  */
    x0 = parseInt(document.getElementById('x0Input').value);
    y0 = parseInt(document.getElementById('y0Input').value);
    x1 = parseInt(document.getElementById('x1Input').value);
    y1 = parseInt(document.getElementById('y1Input').value);
}

/*User-Interaction**********************************************************************************
***************************************************************************************************/

document.getElementById('drawButton').onclick = function drawButton() {
    getInputCoordinates();

    var dx = x1 - x0;
    var dy = y1 - y0;

    // case of a single point
    if (dx == 0 && dy == 0) {
        drawPixel(x0, y0, rPixel, gPixel, bPixel, aPixel);
        updateCanvas();
        return;
    }

    var octant = getOctant(dx, dy);

    drawBresenhamLine(x0, y0, x1, y1, octant);

    updateCanvas();
};

document.getElementById('clearButton').onclick = function() {
    clearCanvas();
};
