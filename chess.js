const softSnapping = false;
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
recruitZone.style.height = `${CanvasSize / 2}px`;

// Раздел игровой доски
const boardState = {
  //coordinates span from 0 to 1
  // White pieces
  1: { type: "rook", color: "white", x: 0.5 / 8, y: 0.5 / 8 },
  2: { type: "knight", color: "white", x: 1.5 / 8, y: 0.5 / 8 },
  3: { type: "bishop", color: "white", x: 2.5 / 8, y: 0.5 / 8 },
  4: { type: "queen", color: "white", x: 3.5 / 8, y: 0.5 / 8 },
  5: { type: "king", color: "white", x: 4.5 / 8, y: 0.5 / 8 },
  6: { type: "bishop", color: "white", x: 5.5 / 8, y: 0.5 / 8 },
  7: { type: "knight", color: "white", x: 6.5 / 8, y: 0.5 / 8 },
  8: { type: "rook", color: "white", x: 7.5 / 8, y: 0.5 / 8 },

  9: { type: "pawn", color: "white", x: 0.5 / 8, y: 1.5 / 8 },
  10: { type: "pawn", color: "white", x: 1.5 / 8, y: 1.5 / 8 },
  11: { type: "pawn", color: "white", x: 2.5 / 8, y: 1.5 / 8 },
  12: { type: "pawn", color: "white", x: 3.5 / 8, y: 1.5 / 8 },
  13: { type: "pawn", color: "white", x: 4.5 / 8, y: 1.5 / 8 },
  14: { type: "pawn", color: "white", x: 5.5 / 8, y: 1.5 / 8 },
  15: { type: "pawn", color: "white", x: 6.5 / 8, y: 1.5 / 8 },
  16: { type: "pawn", color: "white", x: 7.5 / 8, y: 1.5 / 8 },

  // Black pieces
  17: { type: "rook", color: "black", x: 0.5 / 8, y: 7.5 / 8 },
  18: { type: "knight", color: "black", x: 1.5 / 8, y: 7.5 / 8 },
  19: { type: "bishop", color: "black", x: 2.5 / 8, y: 7.5 / 8 },
  20: { type: "queen", color: "black", x: 3.5 / 8, y: 7.5 / 8 },
  21: { type: "king", color: "black", x: 4.5 / 8, y: 7.5 / 8 },
  22: { type: "bishop", color: "black", x: 5.5 / 8, y: 7.5 / 8 },
  23: { type: "knight", color: "black", x: 6.5 / 8, y: 7.5 / 8 },
  24: { type: "rook", color: "black", x: 7.5 / 8, y: 7.5 / 8 },

  25: { type: "pawn", color: "black", x: 0.5 / 8, y: 6.5 / 8 },
  26: { type: "pawn", color: "black", x: 1.5 / 8, y: 6.5 / 8 },
  27: { type: "pawn", color: "black", x: 2.5 / 8, y: 6.5 / 8 },
  28: { type: "pawn", color: "black", x: 3.5 / 8, y: 6.5 / 8 },
  29: { type: "pawn", color: "black", x: 4.5 / 8, y: 6.5 / 8 },
  30: { type: "pawn", color: "black", x: 5.5 / 8, y: 6.5 / 8 },
  31: { type: "pawn", color: "black", x: 6.5 / 8, y: 6.5 / 8 },
  32: { type: "pawn", color: "black", x: 7.5 / 8, y: 6.5 / 8 },
};
function PlacePieces(boardState) {
  const set = document.getElementById("ChessSet");

  for (const key in boardState) {
    const piece = boardState[key];
    console.log(key, piece);

    const el = document.createElement("div");
    el.classList.add("chess-piece", piece.color, piece.type); //adding classes to div object
    el.setAttribute("draggable", "false");

    const board = document.getElementById("ChessBoard");
    const rect = board.getBoundingClientRect();
    let px = piece.x * rect.width;
    let py = (1 - piece.y) * rect.height;
    el.style.left = px + "px";
    el.style.top = py + "px";
    el.style.position = "absolute";
    el.dataset.id = key;
    set.appendChild(el);

    const el2 = document.createElement("div");
    el2.classList.add("chess-piece", piece.color, piece.type, "fromRZ"); //adding classes to div object
    el2.setAttribute("draggable", "false");

    if (key < 17) {
      px = piece.x * rect.width;
      py = (1 - piece.y) * rect.height + rect.height / 2;
    } else {
      px = piece.x * rect.width;
      py = (1 - piece.y) * rect.height + rect.height;
    }

    el2.style.left = px + "px";
    el2.style.top = py + "px";
    el2.style.position = "absolute";
    el2.dataset.id = key;
    set.appendChild(el2);
  }
}
PlacePieces(boardState);
const pieces = document.querySelectorAll(".chess-piece"); //has to be created after board setup

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
function snapBoard(boardState, softsnapping) {
  if (!softSnapping) return boardState;
  const snapped = {};
  for (const key in boardState) {
    const piece = boardState[key];
    const xIndex = Math.round(piece.x * 8 - 0.5); //0..7
    const yIndex = Math.round(piece.y * 8 - 0.5);
    snapped[key] = {
      ...piece, //copy properties of piece
      x: (xIndex + 0.5) / 8,
      y: (yIndex + 0.5) / 8,
    };
  }
  return snapped;
}

// Connection section
//instruction in https://peerjs.com/
let my_id = null;
let conn; //dataConnection object
let peer;
function generate_peer() {
  if (peer) {
    //if exists
    peer.destroy(); // closes connections, removes listeners
    peer = null;
    my_id = null;
  }
  peer = new Peer();
  const IDdisplay = document.getElementById("IDdisplay");
  document.getElementById("coverBox").style.zIndex = +1;
  document.getElementById("coverBox").style.display = "block";

  IDdisplay.style.width = CanvasSize + "px";
  IDdisplay.textContent = "Generating peer ID...";
  peer.on("open", function (id) {
    my_id = id;
    IDdisplay.textContent = "My peer ID is: " + id;
  });
  peer.on("error", (err) => console.error("Peer error:", err));

  peer.on("connection", function (conn) {
    conn.on("data", function (data) {
      if (typeof data === "object") {
        console.log(data);
        boardState = data;
        PlacePieces(boardState);
        setTimeout(() => make_pieces_responsive(), 0);
      } else if (typeof data === "string") {
        console.log("Chat:", data);
      }
    });
  });
}
generate_peer();
function connect_to_host(friend_id) {
  //unfiltered
  conn = peer.connect(friend_id);
  conn.on("open", function () {
    conn.send("hi!");
  });
  conn.on("data", function (data) {
    if (typeof data === "object") {
      console.log(data);
      boardState = data;
      PlacePieces(boardState);
      setTimeout(() => make_pieces_responsive(), 0);
    } else if (typeof data === "string") {
      console.log("Chat:", data);
    }
  });
}
function send_state() {
  if (conn && conn.open) {
    conn.send(boardState);
  }
}
function send_chat(string) {
  if (conn && conn.open) {
    conn.send(string);
  }
}
// end of connection section

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
    let newX = e.clientX - rectWorkzone.x; // - positionOfCursorFromPieceX
    let newY = e.clientY - rectWorkzone.y; // - positionOfCursorFromPieceY

    if (newX < 0) {
      newX = 0;
    }
    if (newX > rectWorkzone.width) {
      newX = rectWorkzone.width;
    }
    if (newY < 0) {
      newY = 0;
    }
    if (newY > rectWorkzone.height) {
      newY = rectWorkzone.height;
    }

    activePiece.style.left = newX + "px";
    activePiece.style.top = newY + "px";
  }
}

function eventOnMouseUp(e) {
  if (!isMoving || !activePiece) return;

  isMoving = false;

  const rect = recruitZone.getBoundingClientRect();
  const rectBoard = document
    .getElementById("ChessBoard")
    .getBoundingClientRect();
  const rectWorkzone = workzone.getBoundingClientRect();
  if (
    !activePiece.classList.contains("fromRZ") &&
    e.clientX > rect.left &&
    e.clientY > rect.top &&
    e.clientX < rect.right &&
    e.clientY < rect.bottom
  ) {
    activePiece.parentNode.removeChild(activePiece);
    activePiece = null;
    return;
  }

  if (activePiece.classList.contains("fromRZ")) {
    const key = activePiece.dataset.id;

    if (
      !(
        e.clientX > rect.left &&
        e.clientY > rect.top &&
        e.clientX < rect.right &&
        e.clientY < rect.bottom
      ) &&
      e.clientX > rectWorkzone.left &&
      e.clientY > rectWorkzone.top &&
      e.clientX < rectWorkzone.right &&
      e.clientY < rectWorkzone.bottom
    ) {
      const piece = boardState[key];

      const el = document.createElement("div");
      el.classList.add("chess-piece", piece.color, piece.type);
      el.setAttribute("draggable", "false");

      const board = document.getElementById("ChessBoard");
      const rect = board.getBoundingClientRect();
      const rectWork = workzone.getBoundingClientRect();
      let px = e.clientX - rectWork.left;
      let py = e.clientY - rectWork.top;
      el.style.left = px + "px";
      el.style.top = py + "px";
      el.style.position = "absolute";
      el.dataset.id = key;
      document.getElementById("ChessSet").appendChild(el);
      el.style.cursor = "grab";
      el.addEventListener("mousedown", eventOnMouseDown);

      //checkers
      /*
      console.log("new piece:", el);
      console.log("isConnected:", el.isConnected);
      console.log("parent:", el.parentNode);
      */
    }
    if (key < 17) {
      px = boardState[key].x * rectBoard.width;
      py = (1 - boardState[key].y) * rectBoard.height + rectBoard.height / 2;
    } else {
      px = boardState[key].x * rectBoard.width;
      py = (1 - boardState[key].y) * rectBoard.height + rectBoard.height;
    }
    activePiece.style.left = px + "px";
    activePiece.style.top = py + "px";
    activePiece.style.position = "absolute";

    activePiece.style.cursor = "grab";
    activePiece = null;
    return;
  }

  activePiece.style.cursor = "grab";
  activePiece = null;
}

function make_pieces_responsive() {
  //will be called with each new board
  pieces.forEach((piece) => {
    piece.style.cursor = "grab";
    piece.addEventListener("mousedown", eventOnMouseDown);
  });
}
make_pieces_responsive();

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
