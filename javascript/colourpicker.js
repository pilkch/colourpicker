// ** Colour picker dialog, blatently stolen and only slightly modified from Rob Tarr:
// http://seesparkbox.com/foundry/how_i_built_a_canvas_color_picker
// https://gist.github.com/robtarr/1199770

var app = {};

app.init = function(handler) {
  // Set up our handler
  app.handler = handler;
  
  // Create four colour elements
  app.colours = [ { element:null }, { element:null }, { element:null }, { element:null } ];
  
  // Create our contexts array
  app.colourctx = [];
  
  // Create our gradient images array
  app.gradientImage = [];
  
  // Set our cursor position (Over green in the normal vision colour palette)
  app.crossHairPositionX = 190;
  app.crossHairPositionY = 77;

  app.initCanvas(0);
  app.initCanvas(1);
  app.initCanvas(2);
  app.initCanvas(3);
  
  // Create the first gradient
  app.buildColourPalette(0);
  app.storeGradientImage(0);
  
  // Copy the gradient from the first colour palette to the other colour palettes
  app.copyColourPaletteImageFromTheFirstTo(1);
  app.copyColourPaletteImageFromTheFirstTo(2);
  app.copyColourPaletteImageFromTheFirstTo(3);
  
  // Apply our colour blind filters
  app.applyColourBlindFilterProtanopia(1);
  app.applyColourBlindFilterDeuteranopia(2);
  app.applyColourBlindFilterTritanopia(3);
  
  // Get copies of our gradient images
  app.storeGradientImage(1);
  app.storeGradientImage(2);
  app.storeGradientImage(3);
  
  // Update our cross hairs
  app.updateAllColourPickersFrom(0);
};

app.initCanvas = function(uCanvasIndex) {
  var elements = $('canvas.colour-palette' + uCanvasIndex);
  app.colours[uCanvasIndex].$element = elements;
  app.colourctx[uCanvasIndex] = elements[0].getContext('2d');
  
  // Handle mouse down
  app.colours[uCanvasIndex].$element.mousedown(function(e) {
    app.crossHairPositionX = e.pageX - app.colours[uCanvasIndex].$element.offset().left;
    app.crossHairPositionY = e.pageY - app.colours[uCanvasIndex].$element.offset().top;

    app.handler.OnColourSelected(uCanvasIndex);
    
    app.updateAllColourPickersFrom(uCanvasIndex);

    // Track mouse movement on the canvas if the mouse button is down
    $(document).mousemove(function(e) {
      app.crossHairPositionX = e.pageX - app.colours[uCanvasIndex].$element.offset().left;
      app.crossHairPositionY = e.pageY - app.colours[uCanvasIndex].$element.offset().top;

      app.handler.OnColourSelected(uCanvasIndex);
      
      app.updateAllColourPickersFrom(uCanvasIndex);
    });

    // Get the colour at the current mouse coordinates
    app.colourTimer = setInterval(function() { app.getColour(uCanvasIndex); }, 50);
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
  for (var i = 0; i < 4; i++) {
    app.render(i);
  }
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
  var colour = app.getColour(uCanvasIndex);
  var sText = "RGB(" + colour.r + ", " + colour.g + ", " + colour.b + ")";
  context.font = "20px Georgia"
  context.fillStyle = "#000000";
  context.fillText(sText, 6, 22);
}

app.getOriginalPixel = function(x, y) {
  // Get a 1x1 image of our pixel
  imageData = app.colourctx[0].getImageData(x, y, 1, 1);

  var colour = { r : imageData.data[0], g : imageData.data[1], b : imageData.data[2] };

  return colour;
};

app.getColour = function(uCanvasIndex) {
  return app.getPixel(uCanvasIndex, app.crossHairPositionX, app.crossHairPositionY);
};

app.getPixel = function(uCanvasIndex, x, y) {
  // Get a 1x1 image of our pixel
  var imageData = app.gradientImage[uCanvasIndex];

  var width = app.colours[uCanvasIndex].$element.width();

  var index = 4 * ((y * width) + x);
  var colour = { r : imageData.data[index], g : imageData.data[index + 1], b : imageData.data[index + 2] };

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
