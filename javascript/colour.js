// Stolen from:
// https://stackoverflow.com/questions/2348597/why-doesnt-this-javascript-rgb-to-hsl-code-work
function RGBtoHSL(colourRGB)
{
  var r = colourRGB.r / 255.0;
  var g = colourRGB.g / 255.0;
  var b = colourRGB.b / 255.0;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.floor(h * 360), s: Math.floor(s * 100), l: Math.floor(l * 100) };
}

// Stolen from:
// https://stackoverflow.com/questions/16835070/create-gradient-for-color-selection-with-html5-canvas-all-possible-rgb-colors
// Takes in an RGB colour 0..255, returns a HSV colour 0..360, 0..100, 0.100
function RGBtoHSV(colourRGB)
{
  var r = colourRGB.r / 255.0;
  var g = colourRGB.g / 255.0;
  var b = colourRGB.b / 255.0;

  var h = 0.0;
  var s = 0.0;

  var v = Math.max(r, g, b);
  var diff = v - Math.min(r, g, b);

  var diffc = function (c) {
    return (v - c) / 6 / diff + 1 / 2;
  };

  if (diff === 0) {
    h = s = 0;
  } else {
    s = diff / v;

    var rr = diffc(r);
    var gg = diffc(g);
    var bb = diffc(b);

    if (r === v) h = bb - gg;
    else if (g === v) h = (1 / 3) + rr - bb;
    else if (b === v) h = (2 / 3) + gg - rr;

    if (h < 0) h += 1;
    else if (h > 1) h -= 1;
  }

  return {
    h: (h * 360 + 0.5) | 0,
    s: (s * 100 + 0.5) | 0,
    v: (v * 100 + 0.5) | 0
  };
}

// Stolen from here:
// https://www.mikekohn.net/file_formats/yuv_rgb_converter.php
function RGBtoYUV(colourRGB)
{
  var r = colourRGB.r;
  var g = colourRGB.g;
  var b = colourRGB.b;

  var y = r * 0.299000 + g * 0.587000 + b * 0.114000
  var u = r * -0.168736 + g * -0.331264 + b * 0.500000 + 128.0
  var v = r * 0.500000 + g * -0.418688 + b * -0.081312 + 128.0

  output_y = Math.floor(y);
  output_u = Math.floor(u);
  output_v = Math.floor(v);

  return {
    y: output_y,
    u: output_u,
    v: output_v
  };
}

// Convert RGB to LMS
// http://en.wikipedia.org/wiki/LMS_color_space
function RGBtoLMS(colourRGB)
{
	// RGB to LMS matrix conversion
	var long = (17.8824 * colourRGB.r) + (43.5161 * colourRGB.g) + (4.11935 * colourRGB.b);
	var medium = (3.45565 * colourRGB.r) + (27.1554 * colourRGB.g) + (3.86714 * colourRGB.b);
	var short = (0.0299566 * colourRGB.r) + (0.184309 * colourRGB.g) + (1.46709 * colourRGB.b);

  var colour = { l:long, m:medium, s:short };
  return colour;
}

// Convert LMS to RGB
// http://en.wikipedia.org/wiki/LMS_color_space
function LMStoRGB(l, m, s)
{
	// LMS to RGB matrix conversion
	var red = (0.0809444479 * l) + (-0.130504409 * m) + (0.116721066 * s);
	var green = (-0.0102485335 * l) + (0.0540193266 * m) + (-0.113614708 * s);
	var blue = (-0.000365296938 * l) + (-0.00412161469 * m) + (0.693511405 * s);

  var colour = { r:red, g:green, b:blue };
  return colour;
}

function ColourRGB255ToRGBf(colourRGB255)
{
  var colour = { r : colourRGB255.r / 255, g : colourRGB255.g / 255, b : colourRGB255.b / 255 };
  return colour;
}

function ColourRGBfToRGB255(colourRGBf)
{
  var colour = { r : colourRGBf.r * 255, g : colourRGBf.g * 255, b : colourRGBf.b * 255 };
  return colour;
}


// http://www.daltonize.org/2010/05/lms-daltonization-algorithm.html
// https://gist.github.com/jcdickinson/580b7fb5cc145cee8740

// Daltonize (source http://www.daltonize.org/search/label/Daltonize)
// Modified to simulate colour blindness

// Protanope - reds are greatly reduced (1% men)
function ApplyFilterProtanopia(inputColour)
{
  // Get an LMS colour
  var lms = RGBtoLMS(inputColour);
  var L = lms.l;
  var M = lms.m;
  var S = lms.s;

  var l = 0.0 * L + 2.02344 * M + -2.52581 * S;
  var m = 0.0 * L + 1.0 * M + 0.0 * S;
  var s = 0.0 * L + 0.0 * M + 1.0 * S;

  // LMS to RGB matrix conversion
  var colour = LMStoRGB(l, m, s);

  ASSERT(colour.r < 1.0);
  ASSERT(colour.g < 1.0);
  ASSERT(colour.b < 1.0);
  
  return colour;
}

// Deuteranope - greens are greatly reduced (1% men)
function ApplyFilterDeuteranopia(inputColour)
{
  // Get an LMS colour
  var lms = RGBtoLMS(inputColour);
  var L = lms.l;
  var M = lms.m;
  var S = lms.s;

  var l = 1.0 * L + 0.0 * M + 0.0 * S;
  var m = 0.494207 * L + 0.0 * M + 1.24827 * S;
  var s = 0.0 * L + 0.0 * M + 1.0 * S;

  // LMS to RGB matrix conversion
  var colour = LMStoRGB(l, m, s);

  ASSERT(colour.r < 1.0);
  ASSERT(colour.g < 1.0);
  ASSERT(colour.b < 1.0);
  
  return colour;
}

// Tritanope - blues are greatly reduced (0.003% population)
function ApplyFilterTritanopia(inputColour)
{
  // NOTE: These lines didn't work so we use a matrix instead
  //var l = 1.0 * L + 0.0 * M + 0.0 * S;
  //var m = 0.0 * L + 1.0 * M + 0.0 * S;
  //var s = -0.395913 * L + 0.801109 * M + 0.0 * S;
  
  var matTritanopia = [
    0.972, 0.022, -0.063,
    0.112, 0.818, 0.881,
    -0.084, 0.160, 0.182
  ];

  var matTri0 = matTritanopia[0];
  var matTri1 = matTritanopia[1];
  var matTri2 = matTritanopia[2];
  var matTri3 = matTritanopia[3];
  var matTri4 = matTritanopia[4];
  var matTri5 = matTritanopia[5];
  var matTri6 = matTritanopia[6];
  var matTri7 = matTritanopia[7];
  var matTri8 = matTritanopia[8];

  // Multiply out the input colour by the 3x3 matrix
  var outputColour = {
    r : inputColour.r * matTri0 + inputColour.g * matTri3 + inputColour.b * matTri6,
    g : inputColour.r * matTri1 + inputColour.g * matTri4 + inputColour.b * matTri7,
    b : inputColour.r * matTri2 + inputColour.g * matTri5 + inputColour.b * matTri8,
  };
  
  return outputColour;
}
