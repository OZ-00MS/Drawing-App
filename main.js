const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const colorInput = document.getElementById("color");
const sizeInput = document.getElementById("size");
const clearBtn = document.getElementById("clear");
const saveBtn = document.getElementById("save");
const eraserBtn = document.getElementById("eraser");
const brushBtn = document.getElementById("brush");
const undoBtn = document.getElementById("undo");

let drawing = false;
let erasing = false;
let lastX = 0;
let lastY = 0;
let history = [];

/* Resize canvas safely */
function resizeCanvas() {
  const img = canvas.toDataURL();
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const image = new Image();
  image.src = img;
  image.onload = () => ctx.drawImage(image, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* Save state */
function saveState() {
  history.push(canvas.toDataURL());
  if (history.length > 30) history.shift();
}

/* Drawing */
canvas.addEventListener("mousedown", e => {
  drawing = true;
  saveState();
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseleave", () => drawing = false);

canvas.addEventListener("mousemove", e => {
  if (!drawing) return;

  ctx.strokeStyle = erasing ? "#ffffff" : colorInput.value;
  ctx.lineWidth = sizeInput.value;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();

  [lastX, lastY] = [e.offsetX, e.offsetY];
});

/* Tools */
eraserBtn.onclick = () => erasing = true;
brushBtn.onclick = () => erasing = false;

/* Undo */
undoBtn.onclick = undo;
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key === "z") undo();
});

function undo() {
  if (!history.length) return;
  const img = new Image();
  img.src = history.pop();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
}

/* Clear */
clearBtn.onclick = () => {
  if (!confirm("Clear the canvas?")) return;
  saveState();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

/* Save */
saveBtn.onclick = () => {
  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};
