
function ASSERT(condition, message) {
  return;

  if (!condition) {
    message = message || "Assertion failed";
    if (typeof Error !== "undefined") {
      throw new Error(message);
    }
    throw message; // Fallback
  }
}

// Stolen from here:
// http://www.webdesignerdepot.com/2013/03/how-to-create-a-color-picker-with-html5-canvas/
function IntToHex(value) {
  value = parseInt(value, 10);
  if (isNaN(value)) return "00";
  value = Math.max(0, Math.min(value, 255)); return "0123456789ABCDEF".charAt((value - (value % 16)) / 16) + "0123456789ABCDEF".charAt(value % 16);
}
