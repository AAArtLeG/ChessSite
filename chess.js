const canvas = document.getElementById("ChessBoard");
const ctx = canvas.getContext("2d");
const workzone = document.getElementById("workzone");
const maxSizeCanvas = 600; // Maximum size in pixels

// Calculate size based on screen width
let CanvasSize = Math.min(window.visualViewport.width * 0.9, maxSizeCanvas); // 90% of screen width or max 600px
canvas.width = CanvasSize;
canvas.height = CanvasSize;

canvas.style.width = CanvasSize + "px";
canvas.style.height = CanvasSize + "px";
recruit.style.width = CanvasSize + "px";

const recruitZone = document.getElementById("recruit");
recruitZone.style.width = `${CanvasSize}px`;

// Раздел игровой доски
let chess_state = {
  1: {},
  2: {},
  3: {},
};

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

function PlaceStartingPieces() {}

// Раздел подключения по сети
function generate_peer() {
  //instruction in https://peerjs.com/
  var peer = new Peer();
  const IDdisplay = document.getElementById("IDdisplay");
  IDdisplay.style.width = CanvasSize + "px";
  IDdisplay.textContent = "Generating peer ID...";
  peer.on("open", function (id) {
    IDdisplay.textContent = "My peer ID is: " + id;
  });
}
generate_peer();
document.getElementById("buttonForTakeTextFromFname").onclick = function () {
  const inputTextElem = document.getElementById("fname");
  console.log(inputTextElem.value);
  const header1Forname = document.getElementById("myName");
  header1Forname.innerHTML = inputTextElem.value;

  document.getElementById("buttonForTakeTextFromFname").style.height = "90px";
  document.getElementById("coverBox").style.zIndex = -1;
  document.getElementById("coverBox").style.display = "none";
};
