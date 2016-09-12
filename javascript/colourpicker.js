// ** Colour picker dialog, blatently stolen and only slightly modified from Rob Tarr:
// http://seesparkbox.com/foundry/how_i_built_a_canvas_color_picker
// https://gist.github.com/robtarr/1199770

var app = {};

app.init = function (handler) {
  // Set up a constant for the number of colour pickers
  app.nColourPickers = 5;

  // Set up our handler
  app.handler = handler;
  
  // Create four colour elements
  app.colours = [ { element: null }, { element: null }, { element: null }, { element: null }, { element: null } ];
  
  // Create our contexts array
  app.colourctx = [];
  
  // Create our gradient images array
  app.gradientImage = [];
  
  // Set our cursor position (Over green in the normal vision colour palette)
  app.crossHairPositionX = 190;
  app.crossHairPositionY = 77;

  for (var i = 0; i < app.nColourPickers; i++) app.initCanvas(i);
  
  // Create the first gradient
  app.buildColourPalette(0);
  app.storeGradientImage(0);
  
  // Copy the gradient from the first colour palette to the other colour palettes
  for (var i = 1; i < app.nColourPickers; i++) app.copyColourPaletteImageFromTheFirstTo(i);
  
  // Apply our colour blind filters
  app.applyColourBlindFilterProtanopia(1);
  app.applyColourBlindFilterDeuteranopia(2);
  app.applyColourBlindFilterTritanopia(3);
  
  // Get copies of our gradient images
  for (var i = 1; i < app.nColourPickers; i++) app.storeGradientImage(i);
  
  // Update our cross hairs
  app.updateAllColourPickersFrom(0);

  // Init the controls on the rest of the page
  app.handler.OnColourSelected(0);
};

app.initCanvas = function(uCanvasIndex) {
  var elements = $('canvas.colour-palette' + uCanvasIndex);
  app.colours[uCanvasIndex].$element = elements;
  app.colourctx[uCanvasIndex] = elements[0].getContext('2d');
  
  // Handle mouse down
  app.colours[uCanvasIndex].$element.mousedown(function(e) {
    app.crossHairPositionX = e.pageX - app.colours[uCanvasIndex].$element.offset().left;
    app.crossHairPositionY = e.pageY - app.colours[uCanvasIndex].$element.offset().top;
    
    app.updateAllColourPickersFrom(uCanvasIndex);

    app.handler.OnColourSelected(uCanvasIndex);

    // Track mouse movement on the canvas if the mouse button is down
    $(document).mousemove(function(e) {
      app.crossHairPositionX = e.pageX - app.colours[uCanvasIndex].$element.offset().left;
      app.crossHairPositionY = e.pageY - app.colours[uCanvasIndex].$element.offset().top;
      
      app.updateAllColourPickersFrom(uCanvasIndex);

      app.handler.OnColourSelected(uCanvasIndex);
    });

    // Get the colour at the current mouse coordinates
    app.colourTimer = setInterval(function() { app.getColourUnderCrossHair(uCanvasIndex); }, 50);
  })

  // Handle mouse up
  .mouseup(function(e) {
  // Clear the interval and unbind the mousemove event,
  // it should only happen if the button is down
    clearInterval(app.colourTimer);
    $(document).unbind('mousemove');

    app.updateAllColourPickersFrom(uCanvasIndex);
  });
}

// Build Colour palette
app.buildColourPalette = function(uCanvasIndex) {
  var gradient = app.colourctx[uCanvasIndex].createLinearGradient(0, 0, app.colours[uCanvasIndex].$element.width(), 0);

  // Create colour gradient
  gradient.addColorStop(0,    "rgb(255,   0,   0)");
  gradient.addColorStop(0.15, "rgb(255,   0, 255)");
  gradient.addColorStop(0.33, "rgb(0,     0, 255)");
  gradient.addColorStop(0.49, "rgb(0,   255, 255)");
  gradient.addColorStop(0.67, "rgb(0,   255,   0)");
  gradient.addColorStop(0.84, "rgb(255, 255,   0)");
  gradient.addColorStop(1,    "rgb(255,   0,   0)");

  // Apply gradient to canvas
  app.colourctx[uCanvasIndex].fillStyle = gradient;
  app.colourctx[uCanvasIndex].fillRect(0, 0, app.colourctx[uCanvasIndex].canvas.width, app.colourctx[uCanvasIndex].canvas.height);

  // Create semi transparent gradient (white -> trans. -> black)
  gradient = app.colourctx[uCanvasIndex].createLinearGradient(0, 0, 0, app.colours[uCanvasIndex].$element.height());
  gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
  gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
  gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");

  // Apply gradient to canvas
  app.colourctx[uCanvasIndex].fillStyle = gradient;
  app.colourctx[uCanvasIndex].fillRect(0, 0, app.colourctx[uCanvasIndex].canvas.width, app.colourctx[uCanvasIndex].canvas.height);
};

app.storeGradientImage = function(uCanvasIndex) {
  // Get a copy of the gradient image for drawing later
  app.gradientImage[uCanvasIndex] = app.colourctx[uCanvasIndex].getImageData(0, 0, app.colours[uCanvasIndex].$element.width(), app.colours[uCanvasIndex].$element.height());
}

app.copyColourPaletteImageFromTheFirstTo = function(uCanvasIndex) {
  // Set our image data to the gradient image of the first colour palette
  app.colourctx[uCanvasIndex].putImageData(app.gradientImage[0], 0, 0);
}

app.updateAllColourPickersFrom = function(uCanvasIndex) {
  for (var i = 0; i < app.nColourPickers; i++) app.render(i);
}

app.render = function(uCanvasIndex) {
  var context = app.colourctx[uCanvasIndex];

  var width = app.colours[uCanvasIndex].$element.width();
  var height = app.colours[uCanvasIndex].$element.height();

  // Draw the colour gradient
  context.putImageData(app.gradientImage[uCanvasIndex], 0, 0);

  // Draw our cursor
  var x = app.crossHairPositionX;
  var y = app.crossHairPositionY;

  var innerRadius = 3;
  var outerRadius = 10;

  context.beginPath();
  context.moveTo(x - innerRadius, y);
  context.lineTo(x - outerRadius, y);
  context.moveTo(x + innerRadius, y);
  context.lineTo(x + outerRadius, y);
  context.moveTo(x, y - innerRadius);
  context.lineTo(x, y - outerRadius);
  context.moveTo(x, y + innerRadius);
  context.lineTo(x, y + outerRadius);
  context.stroke();

  // Draw the RGB value
  var colour = app.getColourUnderCrossHair(uCanvasIndex);
  var sText = "RGB(" + colour.r + ", " + colour.g + ", " + colour.b + ")";
  context.font = "20px Georgia"
  context.fillStyle = "#000000";
  context.fillText(sText, 6, 22);
}

app.getOriginalPixel = function (x, y) {
  // Get a pixel from the first canvas
  return app.getPixel(0, x, y);
};

app.getColourUnderCrossHair = function (uCanvasIndex) {
  return app.getPixel(uCanvasIndex, app.crossHairPositionX, app.crossHairPositionY);
};

app.getPixel = function(uCanvasIndex, x, y) {
  // Get a 1x1 image of our pixel
  imageData = app.colourctx[uCanvasIndex].getImageData(x, y, 1, 1);

  var colour = { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2] };

  return colour;
};

app.setPixel = function(uCanvasIndex, x, y, colour) {
  // Get a 1x1 image of our pixel
  var imageData = app.colourctx[uCanvasIndex].createImageData(1, 1);
  var data  = imageData.data;
  data[0]   = colour.r;
  data[1]   = colour.g;
  data[2]   = colour.b;
  data[3]   = 255; // Full alpha

  // Set the new image data
  app.colourctx[uCanvasIndex].putImageData(imageData, x, y);  
};

// Stolen from:
// https://stackoverflow.com/questions/16835070/create-gradient-for-color-selection-with-html5-canvas-all-possible-rgb-colors
// Takes a colour in RGB, finds the position of a HSV pixel that matches, updates the crosshair position and updates all colour pickers
app.setCanvas0Colour = function (colourRGB) {
  var colourHSV = RGBtoHSV(colourRGB);

  var width = app.colours[0].$element.width();
  var height = app.colours[0].$element.height();

  // NOTE: Width is flipped from left to right because our colour palettes are flipped left to right
  var x = width - (width / 360 * colourHSV.h);
  var y = 0;
  var m = height / 2;

  if (colourHSV.s === 100 && colourHSV.v === 100) {
    y = m;
  } else if (colourHSV.v === 100 && colourHSV.s < 100) {
    y = m / 100 * colourHSV.s;
  } else if (colourHSV.s === 100 && colourHSV.v < 100) {
    y = m / 100 * (100 - colourHSV.v) + m;
  }

  x = (x + 0.5) | 0; // Convert to integer
  y = (y + 0.5) | 0;

  // Set our cursor position
  app.crossHairPositionX = x;
  app.crossHairPositionY = y;

  // Update our cross hairs
  app.updateAllColourPickersFrom(0);
}

// Protanopia (Reds are greatly reduced (1% of men))
app.applyColourBlindFilterProtanopia = function(uCanvasIndex) {
  var width = app.colours[uCanvasIndex].$element.width();
  var height = app.colours[uCanvasIndex].$element.height();
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      var colour = app.getOriginalPixel(x, y);

      var colourf = ColourRGB255ToRGBf(colour);
      
      var colourFilteredf = ApplyFilterProtanopia(colourf);
      
      var newColour = ColourRGBfToRGB255(colourFilteredf);
      
      app.setPixel(uCanvasIndex, x, y, newColour);
    }
  }
};

// Deuteranopia (Greens are greatly reduced (1% of men))
app.applyColourBlindFilterDeuteranopia = function(uCanvasIndex) {
  var width = app.colours[uCanvasIndex].$element.width();
  var height = app.colours[uCanvasIndex].$element.height();
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      var colour = app.getOriginalPixel(x, y);

      var colourf = ColourRGB255ToRGBf(colour);
      
      var colourFilteredf = ApplyFilterDeuteranopia(colourf);  
      
      var newColour = ColourRGBfToRGB255(colourFilteredf);
      
      app.setPixel(uCanvasIndex, x, y, newColour);
    }
  }
};

// Tritanopia (Blues are greatly reduced (0.003% of the population))
app.applyColourBlindFilterTritanopia = function(uCanvasIndex) {
  var width = app.colours[uCanvasIndex].$element.width();
  var height = app.colours[uCanvasIndex].$element.height();
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      var colour = app.getOriginalPixel(x, y);

      var colourf = ColourRGB255ToRGBf(colour);
      
      var colourFilteredf = ApplyFilterTritanopia(colourf);
      
      var newColour = ColourRGBfToRGB255(colourFilteredf);
      
      app.setPixel(uCanvasIndex, x, y, newColour);
    }
  }
};
