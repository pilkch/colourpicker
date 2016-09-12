
function ASSERT(condition, message)
{
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

// Parse the RGB hex values from a string such as "#123456"
function ParseColourHexString(value)
{
  if (value.length != 7) return null;
  else if (value[0] != "#") return null;

  var colour = { r: parseInt(value.substring(1, 3), 16), g: parseInt(value.substring(3, 5), 16), b: parseInt(value.substring(5, 7), 16) };
  console.log("ParseColourHexString value=\"" + value + "\", 0=\"" + value.substring(1, 3) + "\", 1=\"" + value.substring(3, 5) + "\", 2=\"" + value.substring(5, 7) + "\", returning (" + colour.r + ", " + colour.g + ", " + colour.b + ")");
  return colour;
}

// Parse the RGB floating point values from a string such as "(1.0f, 1.0f, 1.0f)"
function ParseColourFloatString(value)
{
  if (value === "") return null;
  else if (value[0] != "(") return null;
  else if (value[value.length - 1] != ")") return null;

  // Split the value on "," and ")"
  var parts = value.split(/\(|,|\)/);
  if (parts < 3) return null;

  var colour = { r: parseFloat(parts[1]), g: parseFloat(parts[2]), b: parseFloat(parts[3]) };
  //console.log("ParseColourFloatString value=\"" + value + "\", 1=\"" + parts[1] + "\", 2=\"" + parts[2] + "\", 3=\"" + parts[3] + "\", returning (" + colour.r + ", " + colour.g + ", " + colour.b + ")");
  return colour;
}
