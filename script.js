/*
script.js for bresenham_line
author: thibaut voirand
*/

// declaring canvas related variables
var canvas = document.getElementById('canvasId');
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var canvasContext = canvas.getContext('2d');
var canvasData = canvasContext.getImageData(0, 0, canvasWidth, canvasHeight);

// pixel color and transparency
var rPixel = 255; // red
var gPixel = 0; // green
var bPixel = 0; // blue
var aPixel = 255; // transparency

// drawing pixel by pixel on the canvas: defining the value of a pixel
function drawPixel(x, y, r, g, b, a) {
  var index = (x + y * canvasWidth) * 4;

  canvasData.data[index + 0] = r;
  canvasData.data[index + 1] = g;
  canvasData.data[index + 2] = b;
  canvasData.data[index + 3] = a;
}

// drawing pixel by pixel on the canvas: update the canvas
function updateCanvas() {
  canvasContext.putImageData(canvasData, 0, 0);
}

// switching coordinates octant for bresenham line algorithm
function switchToOctantZeroFrom(octant, x, y) {
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

// switching coordinates octant for bresenham line algorithm
function switchFromOctantZeroTo(octant, x, y) {
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

// bresenham line algorithm
function bresenhamLine(x0, y0, x1, y1) {
  var coordinates = [[]]; // coordinates array
  var dx = x1 - x0;
  var dy = y1 - y0;

  // switching to Octant zero
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
  [x0, y0] = switchToOctantZeroFrom(octant, x0, y0);
  [x1, y1] = switchToOctantZeroFrom(octant, x1, y1);

  //initialisation
  dx = x1 - x0;
  dy = y1 - y0;
  var D = 2 * dy - dx;
  var y = y0; //

  for (x = x0; x < x1; x++) {
    // filling coordinates array and switching back to starting octant
    coordinates.push(switchFromOctantZeroTo(octant, x, y));
    if (D > 0) {
      y = y + 1;
      D = D - 2 * dx;
    }

    D = D + 2 * dy;
  }

  coordinates = coordinates.slice(1, coordinates.length); // slicing out first value, which is empty

  return coordinates;
}

document.getElementById('drawButton').onclick = function() {
  // getting input parameters
  var x0Input = parseInt(document.getElementById('x0Input').value);
  var y0Input = parseInt(document.getElementById('y0Input').value);
  var x1Input = parseInt(document.getElementById('x1Input').value);
  var y1Input = parseInt(document.getElementById('y1Input').value);

  // obtaining coordinates of pixels forming line using bresenham's algorithm
  var lineCoordinates = bresenhamLine(x0Input, y0Input, x1Input, y1Input);

  // drawing pixels
  var j;
  for (j = 0; j < lineCoordinates.length; j++) {
    drawPixel(
      lineCoordinates[j][0],
      lineCoordinates[j][1],
      rPixel,
      gPixel,
      bPixel,
      aPixel
    );
  }
  updateCanvas();
};
