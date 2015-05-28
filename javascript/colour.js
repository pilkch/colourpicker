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
// Modified to simulate color blindness

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
