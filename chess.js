const pieces = document.querySelectorAll(".chess-piece"); //this finds ALL pieceS
const canvas = document.getElementById("ChessBoard");
const chessSet = document.getElementById("ChessSet");
const ctx = canvas.getContext("2d");
const workzone = document.getElementById("workzone");
const maxSizeCanvas = 600; // Maximum size in pixels
const coverBox = document.getElementById("coverBox");
//coverBox.style.width = `${window.visualViewport.width}px`;

// Calculate size based on screen width
let CanvasSize = Math.min(window.visualViewport.width * 0.9, maxSizeCanvas); // 90% of screen width or max 600px
canvas.width = CanvasSize;
canvas.height = CanvasSize;

canvas.style.width = CanvasSize + "px";
canvas.style.height = CanvasSize + "px";

chessSet.style.width = CanvasSize + "px";
chessSet.style.height = CanvasSize + "px";

workzone.style.width = CanvasSize + "px";

const recruitZone = document.getElementById("recruit");
recruitZone.style.width = `${CanvasSize}px`;
recruitZone.style.height = pieces[0].height * 2 + "px";

// Раздел игровой доски
const boardState = {
    //coordinates span from 0 to 1
  // White pieces
  "wR1": { type: "rook",   color: "white", x: 0.5/8, y: 0.5/8 },
  "wN1": { type: "knight", color: "white", x: 1.5/8, y: 0.5/8 },
  "wB1": { type: "bishop", color: "white", x: 2.5/8, y: 0.5/8 },
  "wQ":  { type: "queen",  color: "white", x: 3.5/8, y: 0.5/8 },
  "wK":  { type: "king",   color: "white", x: 4.5/8, y: 0.5/8 },
  "wB2": { type: "bishop", color: "white", x: 5.5/8, y: 0.5/8 },
  "wN2": { type: "knight", color: "white", x: 6.5/8, y: 0.5/8 },
  "wR2": { type: "rook",   color: "white", x: 7.5/8, y: 0.5/8 },

  "wP1": { type: "pawn", color: "white", x: 0.5/8, y: 1.5/8 },
  "wP2": { type: "pawn", color: "white", x: 1.5/8, y: 1.5/8 },
  "wP3": { type: "pawn", color: "white", x: 2.5/8, y: 1.5/8 },
  "wP4": { type: "pawn", color: "white", x: 3.5/8, y: 1.5/8 },
  "wP5": { type: "pawn", color: "white", x: 4.5/8, y: 1.5/8 },
  "wP6": { type: "pawn", color: "white", x: 5.5/8, y: 1.5/8 },
  "wP7": { type: "pawn", color: "white", x: 6.5/8, y: 1.5/8 },
  "wP8": { type: "pawn", color: "white", x: 7.5/8, y: 1.5/8 },

  // Black pieces
  "bR1": { type: "rook",   color: "black", x: 0.5/8, y: 7.5/8 },
  "bN1": { type: "knight", color: "black", x: 1.5/8, y: 7.5/8 },
  "bB1": { type: "bishop", color: "black", x: 2.5/8, y: 7.5/8 },
  "bQ":  { type: "queen",  color: "black", x: 3.5/8, y: 7.5/8 },
  "bK":  { type: "king",   color: "black", x: 4.5/8, y: 7.5/8 },
  "bB2": { type: "bishop", color: "black", x: 5.5/8, y: 7.5/8 },
  "bN2": { type: "knight", color: "black", x: 6.5/8, y: 7.5/8 },
  "bR2": { type: "rook",   color: "black", x: 7.5/8, y: 7.5/8 },

  "bP1": { type: "pawn", color: "black", x: 0.5/8, y: 6.5/8 },
  "bP2": { type: "pawn", color: "black", x: 1.5/8, y: 6.5/8 },
  "bP3": { type: "pawn", color: "black", x: 2.5/8, y: 6.5/8 },
  "bP4": { type: "pawn", color: "black", x: 3.5/8, y: 6.5/8 },
  "bP5": { type: "pawn", color: "black", x: 4.5/8, y: 6.5/8 },
  "bP6": { type: "pawn", color: "black", x: 5.5/8, y: 6.5/8 },
  "bP7": { type: "pawn", color: "black", x: 6.5/8, y: 6.5/8 },
  "bP8": { type: "pawn", color: "black", x: 7.5/8, y: 6.5/8 }
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

function PlaceStartingPieces() {
    for (const key in boardState) {
        const piece = boardState[key];
        console.log(key, piece);
    }
}
//PlaceStartingPieces();

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

//move chess piece section
let positionOfCursorFromPieceX = 0;
let positionOfCursorFromPieceY = 0;
let isMoving = false;
let activePiece = null;

function eventOnMouseDown(e) {
  e.preventDefault(); // for prevent drag-click

  isMoving = true;
  activePiece = e.currentTarget;

  activePiece.style.cursor = "grabbing";

  const rectPiece = activePiece.getBoundingClientRect();

  //позиция курсора, относительно левого верхнего угла img фигуры
  positionOfCursorFromPieceX = e.clientX - rectPiece.x;
  positionOfCursorFromPieceY = e.clientY - rectPiece.y;
}

function eventOnMouseMove(e) {
  if (isMoving && activePiece) {
    const rectWorkzone = workzone.getBoundingClientRect();

    //координаты точки начала рисования картинки, относительно relative контейнера, в котором находимся, теперь workzone
    let newX = e.clientX - positionOfCursorFromPieceX - rectWorkzone.x;
    let newY = e.clientY - positionOfCursorFromPieceY - rectWorkzone.y;

    if (newX < 0) {
      newX = 0;
    }
    if (newX > rectWorkzone.width - activePiece.offsetWidth) {
      newX = rectWorkzone.width - activePiece.offsetWidth;
    }
    if (newY < 0) {
      newY = 0;
    }
    if (newY > rectWorkzone.height - activePiece.offsetHeight) {
      newY = rectWorkzone.height - activePiece.offsetHeight;
    }

    activePiece.style.left = newX + "px";
    activePiece.style.top = newY + "px";
  }
}

function eventOnMouseUp(e) {
  if (!isMoving || !activePiece) return;

  isMoving = false;

  activePiece.style.cursor = "grab";
  activePiece = null;
}

pieces.forEach((piece) => {
  piece.style.cursor = "grab";
  piece.addEventListener("mousedown", eventOnMouseDown);
});

document.addEventListener("mousemove", eventOnMouseMove);

document.addEventListener("mouseup", eventOnMouseUp);

document.getElementById("buttonForTakeTextFromFname").onclick = function () {
  /*  */
  //const inputTextElem = document.getElementById("fname");
  //console.log(inputTextElem.value);
  //const header1Forname = document.getElementById("myName");
  //header1Forname.innerHTML = inputTextElem.value;

  //document.getElementById("buttonForTakeTextFromFname").style.height = "90px";
  document.getElementById("coverBox").style.zIndex = -1;
  document.getElementById("coverBox").style.display = "none";
};
