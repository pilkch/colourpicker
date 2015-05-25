// ** Colour picker dialog, blatently stolen and only slightly modified from Rob Tarr:
// http://seesparkbox.com/foundry/how_i_built_a_canvas_color_picker
// https://gist.github.com/robtarr/1199770

var app = {};

app.init = function(handler) {
  // Set up our handler
  app.handler = handler;
  
  // Create four colour elements
  app.colors = [ { element:null }, { element:null }, { element:null }, { element:null } ];
  
  // Create our contexts array
  app.colorctx = [];
  
  // Create our positions arrays
  app.colorEventX = [];
  app.colorEventY = [];

  app.initCanvas(0);
  app.initCanvas(1);
  app.initCanvas(2);
  app.initCanvas(3);
};

app.initCanvas = function(uCanvasIndex) {
  var elements = $('canvas.color-palette' + uCanvasIndex);
  app.colors[uCanvasIndex].$element = elements;
  app.colorctx[uCanvasIndex] = elements[0].getContext('2d');

  app.buildColorPalette(uCanvasIndex);
}

// Build Color palette
app.buildColorPalette = function(uCanvasIndex) {
  var gradient = app.colorctx[uCanvasIndex].createLinearGradient(0, 0, app.colors[uCanvasIndex].$element.width(), 0);

  // Create color gradient
  gradient.addColorStop(0,    "rgb(255,   0,   0)");
  gradient.addColorStop(0.15, "rgb(255,   0, 255)");
  gradient.addColorStop(0.33, "rgb(0,     0, 255)");
  gradient.addColorStop(0.49, "rgb(0,   255, 255)");
  gradient.addColorStop(0.67, "rgb(0,   255,   0)");
  gradient.addColorStop(0.84, "rgb(255, 255,   0)");
  gradient.addColorStop(1,    "rgb(255,   0,   0)");

  // Apply gradient to canvas
  app.colorctx[uCanvasIndex].fillStyle = gradient;
  app.colorctx[uCanvasIndex].fillRect(0, 0, app.colorctx[uCanvasIndex].canvas.width, app.colorctx[uCanvasIndex].canvas.height);

  // Create semi transparent gradient (white -> trans. -> black)
  gradient = app.colorctx[uCanvasIndex].createLinearGradient(0, 0, 0, app.colors[uCanvasIndex].$element.height());
  gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
  gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
  gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");

  // Apply gradient to canvas
  app.colorctx[uCanvasIndex].fillStyle = gradient;
  app.colorctx[uCanvasIndex].fillRect(0, 0, app.colorctx[uCanvasIndex].canvas.width, app.colorctx[uCanvasIndex].canvas.height);

  app.colors[uCanvasIndex].$element.mousedown(function(e) {
    app.colorEventX[uCanvasIndex] = e.pageX - app.colors[uCanvasIndex].$element.offset().left;
    app.colorEventY[uCanvasIndex] = e.pageY - app.colors[uCanvasIndex].$element.offset().top;

    app.handler.OnColourSelected(uCanvasIndex);

    // Track mouse movement on the canvas if the mouse button is down
    $(document).mousemove(function(e) {
      app.colorEventX[uCanvasIndex] = e.pageX - app.colors[uCanvasIndex].$element.offset().left;
      app.colorEventY[uCanvasIndex] = e.pageY - app.colors[uCanvasIndex].$element.offset().top;

      app.handler.OnColourSelected(uCanvasIndex);
    });

    // Get the color at the current mouse coordinates
    app.colorTimer = setInterval(function() { app.getColor(uCanvasIndex); }, 50);
  })

  // On mouseup, clear the interval and unbind the mousemove event,
  // it should only happen if the button is down
  .mouseup(function(e) {
    clearInterval(app.colorTimer);
    $(document).unbind('mousemove');
  });
};

app.getColor = function(uCanvasIndex) {
  imageData = app.colorctx[uCanvasIndex].getImageData(app.colorEventX[uCanvasIndex], app.colorEventY[uCanvasIndex], 1, 1);

  console.log("app.getColor RGB(" + imageData.data[4] + ", " + imageData.data[5] + ", " + imageData.data[6] + ")");

  var colour = { r : imageData.data[4], g : imageData.data[5], b : imageData.data[6] };
  
  return colour;
};
