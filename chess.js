const canvas = document.getElementById("ChessBoard");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const workzone = document.getElementById("workzone");
const maxSizeCanvas = 800; // Maximum size in pixels
// Calculate size based on screen width
let CanvasSize = Math.min(window.innerWidth * 1, maxSizeCanvas); // 100% of screen width or max 800px
canvas.width = CanvasSize;
canvas.height = CanvasSize;

function drawSquare(i, j, width) {
  ctx.fillStyle = "#444400";
  ctx.fillRect((i * width) / 8, (j * width) / 8, width / 8, width / 8);
}

function FillChessBackground() {
  const width = canvas.width;
  //const height = canvas.height;
  ctx.fillStyle = "#CCAA00";
  ctx.fillRect(0, 0, width, width); //placement to be changed
  const squareSize = width / 8;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 == 1) {
        drawSquare(i, j, width);
      }
    }
  }
}

FillChessBackground();

document.getElementById("buttonForTakeTextFromFname").onclick = function () {
  const inputTextElem = document.getElementById("fname");
  console.log(inputTextElem.value);
  const header1Forname = document.getElementById("myName");
  header1Forname.innerHTML = inputTextElem.value;

  document.getElementById("buttonForTakeTextFromFname").style.height = "90px";
  document.getElementById("coverBox").style.zIndex = -1;
  document.getElementById("coverBox").style.display = "none";
};
