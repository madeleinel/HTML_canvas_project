//////// SETTING UP THE CANVASES AND VARIABLES ////////

// Set the canvas to draw on to be canvas element #drawingArea, and the canvas containing the background colour to be the canvas element #drawingBackground
const canvas = document.querySelector("#drawingArea");
const background = document.querySelector("#drawingBackground");

// Set the 2D contexts of each canvas
const ctx = canvas.getContext("2d");
const backCtx = background.getContext("2d");

// Set the basic properties (size and position) of both canvas elements
// Want the canvases to overlap completely, so they should have the same siza and position values
canvas.width = (window.innerWidth * 0.8);
canvas.height = (window.innerHeight * 0.816);
background.width = (window.innerWidth * 0.8);
background.height = (window.innerHeight * 0.816);

canvas.style.top = "18.4vh";
canvas.style.left = "20vw";
background.style.top = "18.4vh";
background.style.left = "20vw";

// Set the default brushstroke values
// Don't need to set these for the background canvas, as will not be drawing on that canvas
// ctx.lineJoin = "round";   // Set the default style of brushstoke joints  // round / square / butt / miter (default)    // Remove this line? Setting it to a different value doesn't seem to have an effect
ctx.lineCap = "round";    // Set the default style of brushstoke ends  // round / square / butt
ctx.globalCompositeOperation = "source-over";   // Set the default brushstroke effect

// Set the global variables
let isDrawing = false;    // Set the default state to be not-drawing
let lastX;
let lastY;
let direction = true;
let color;
let backgroundColor;
let strokeWidth = 10;    // Set default width of the brushstroke to match the default value specified for the HTML input element

// Define the variables for the HTML input elements (for the drawing effects)
// For the colour and width of the brush strokes:
const colorChange = document.getElementById("colorSelector");
const widthChange = document.getElementById("widthSelector");
// For the brush shape effect:
const brushEffectList = document.getElementById("brushEffectList");
const brushEffectOptions = document.querySelectorAll("#brushEffectList input");
const numOfBrushEffects = brushEffectOptions.length;
// For the brush painting effect:
const colorEffectList = document.getElementById("effectList");
const colorEffectOptions = document.querySelectorAll("#effectList input");
const numOfColorEffects = colorEffectOptions.length;
// For the background colour:
const backgroundChange = document.getElementById("backgroundSelector");

// Define the variable that will store the brushstroke image data
let canvasStorage = [];
// Define the variable that will store the background image data
// let backgroundStorage;   // Use this, and enable undoing background colour change, as well?
// Define the undo, redo and save buttons
const undo = document.getElementById("undo");
const redo = document.getElementById("redo");
const save = document.getElementById("save");

//////// DRAWING FUNCTIONS ////////

// Define the draw function >> Tells the browser what to do when the user is drawing (ie have their mouse down and is moving it around)
function draw(e) {
  if(!isDrawing) return;    // If isDrawing is set to False (ie mouse not down on the canvas) >> exit the function

  // If isDrawing is set to True, execute the following code:
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;

  // Define where the brush stroke should start from (starting location)
  ctx.beginPath();
  // Define where the brush stroke should move to:
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Define function to enable changing the colour of brush strokes
colorChange.addEventListener("change", (e) => color = e.srcElement.value);
// Define function to enable changing the width of brush strokes
widthChange.addEventListener("change", (e) => strokeWidth = e.srcElement.value);
// Define function to enable changing the brush shape effect
brushEffectList.addEventListener("change", (e) => {
  for (i = 0; i < numOfBrushEffects; i++) {   // Loop through the list of HTML input elements
    if (brushEffectOptions[i].checked === true) {   // Checked each option to see whether it's been checked
      ctx.lineCap = brushEffectOptions[i].value;    // If it has been checked >> Update the lineCap value to that of the chosen effect
    }
  }
});
// Define function to enable changing the brush painting effect
colorEffectList.addEventListener("change", (e) => {
  for (i = 0; i < numOfColorEffects; i++) {
    if (colorEffectOptions[i].checked === true) {
      ctx.globalCompositeOperation = colorEffectOptions[i].value;
    }
  }
});

// Define the background colour of the background canvas
backgroundChange.addEventListener("change", (e) => {
  backgroundColor = e.srcElement.value;
  backCtx.fillStyle = backgroundColor;
  backCtx.fillRect(0, 0, background.width, background.height);
});

//////// Enable the drawing ////////

// Start drawing when click on the canvas (mouse down)
canvas.addEventListener("mousedown", (e) => {
  // Before start drawing, save the last version of the drawing to the beginning of the canvasStorage array
  canvasStorage.unshift(ctx.getImageData(0, 0, canvas.width, canvas.height));
  isDrawing = true;   // Enable drawing
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

// Call the draw function when move the mouse >> so if drawing is enabled, will execute it
canvas.addEventListener("mousemove", draw);

// Stop drawing (ie set isDrawing to False) when release the mouse or move the mouse outside of the canvas
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mouseout", () => isDrawing = false);

//////// ENABLE UNDO AND SAVE BUTTONS ////////

// Enable undo button
// CURRENTLY ONLY ABLE TO UNDO THE 1 LAST STEP >> FIX THIS
undo.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(canvasStorage[0], 0, 0);   // Restore the canvas to the latest saved version, ie the one at the beginning of the canvasStorage array
  canvasStorage.shift();    // Remove the restored version from the array, so that next time the user clicks the Undo button it will restore to the next most recent version
});

// Enable redo button
// SET THIS UP
redo.addEventListener("click", () => {
  console.log("Revert the latest undo action");
});

// Enable save button
// SET THIS UP
save.addEventListener("click", () => {
  console.log("Save this to a file");
});



// To create rainbow effect in the brush colour:
// let hue;
// hue++;
// if(hue >= 360) {
//   hue = 0;
// }
