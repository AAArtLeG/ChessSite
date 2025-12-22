const snapModes = Object.freeze({
  NONE: 0, //
  CONSTRAINED: 1, //pieces can't hang over an edge
  ALL: 2, //piece is snapped to center of edges, corners, centers of spaces
  CLASSIC: 3, //piece is snapped to centers of spaces
});
let snapMode = snapModes.CLASSIC;

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
const recruitlines = 2; //to allow adding more pieces
recruitZone.style.width = `${CanvasSize}px`;
recruitZone.style.height = `${(CanvasSize / 8) * recruitlines}px`;

// Раздел игровой доски
let nextPieceId = 33;
let boardState = {
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
    //console.log(key, piece);

    const el = document.createElement("div");
    el.classList.add("chess-piece", piece.color, piece.type); //adding classes to div object
    el.setAttribute("draggable", "false");

    const board = document.getElementById("ChessBoard");
    const rect = board.getBoundingClientRect();
    let px = piece.x * rect.width;
    let py = piece.y * rect.height;
    el.style.left = px + "px";
    el.style.top = py + "px";
    el.style.position = "absolute";
    el.dataset.id = key;
    set.appendChild(el);
  }
}
PlacePieces(boardState);
function PlacePiece(boardState, activePieceIdx) {
  const set = document.getElementById("ChessSet");

  const piece = boardState[activePieceIdx];
  //console.log(key, piece);

  const el = document.createElement("div");
  el.classList.add("chess-piece", piece.color, piece.type); //adding classes to div object
  el.setAttribute("draggable", "false");

  const board = document.getElementById("ChessBoard");
  const rect = board.getBoundingClientRect();
  let px = piece.x * rect.width;
  let py = piece.y * rect.height;
  el.style.left = px + "px";
  el.style.top = py + "px";
  el.style.position = "absolute";
  el.dataset.id = activePieceIdx;
  set.appendChild(el);

  el.style.cursor = "grab";
  el.addEventListener("mousedown", eventOnMouseDown);
  el.addEventListener("touchstart", (e) => eventOnMouseDown(normalizeEvent(e)));
}
function delete_all_pieces() {
  const workzonePieces = document.querySelectorAll(
    "#workzone .chess-piece:not(#recruit .chess-piece)"
  );
  workzonePieces.forEach((el) => el.remove());
}

function delete_piece(id) {
  const selector = `#workzone .chess-piece[data-id="${id}"]`;
  const el = document.querySelector(selector);
  if (el) {
    el.remove();
  }
}

const recruitState = {
  1: { type: "pawn", color: "white", x: 0.5 / 8, y: 0.5 / recruitlines },
  2: { type: "knight", color: "white", x: 1.5 / 8, y: 0.5 / recruitlines },
  3: { type: "bishop", color: "white", x: 2.5 / 8, y: 0.5 / recruitlines },
  4: { type: "rook", color: "white", x: 3.5 / 8, y: 0.5 / recruitlines },
  5: { type: "queen", color: "white", x: 4.5 / 8, y: 0.5 / recruitlines },
  6: { type: "king", color: "white", x: 5.5 / 8, y: 0.5 / recruitlines },

  7: { type: "pawn", color: "black", x: 0.5 / 8, y: 1.5 / recruitlines },
  8: { type: "knight", color: "black", x: 1.5 / 8, y: 1.5 / recruitlines },
  9: { type: "bishop", color: "black", x: 2.5 / 8, y: 1.5 / recruitlines },
  10: { type: "rook", color: "black", x: 3.5 / 8, y: 1.5 / recruitlines },
  11: { type: "queen", color: "black", x: 4.5 / 8, y: 1.5 / recruitlines },
  12: { type: "king", color: "black", x: 5.5 / 8, y: 1.5 / recruitlines },

  //special pieces
  13: { type: "duck", color: "none", x: 7.5 / 8, y: 0.5 / recruitlines },
  14: { type: "crow", color: "none", x: 6.5 / 8, y: 0.5 / recruitlines },
  15: { type: "beaver", color: "none", x: 6.5 / 8, y: 1.5 / recruitlines },
  16: { type: "panda", color: "none", x: 7.5 / 8, y: 1.5 / recruitlines },
};
function PlaceRecruits(recruitState) {
  const set = document.getElementById("recruit");
  for (const key in recruitState) {
    const piece = recruitState[key];

    const el = document.createElement("div");
    const board = document.getElementById("ChessBoard");
    const rectBoard = board.getBoundingClientRect();

    const recruitZone = document.getElementById("recruit");
    const rectRecruit = recruitZone.getBoundingClientRect();

    el.classList.add("chess-piece", piece.color, piece.type, "recruit-piece");
    el.setAttribute("draggable", "false");

    let px = piece.x * rectRecruit.width;
    let py = piece.y * rectRecruit.height + rectBoard.height;

    el.style.left = px + "px";
    el.style.top = py + "px";
    el.style.position = "absolute";
    el.dataset.id = key;
    el.dataset.type = piece.type;
    el.dataset.color = piece.color;
    set.appendChild(el);
  }
}
PlaceRecruits(recruitState);

let pieces = document.querySelectorAll(".chess-piece"); //has to be created after board setup

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
  //to be changed
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

  peer.on("connection", function (connection) {
    document.getElementById("coverBox").style.zIndex = -1;
    document.getElementById("coverBox").style.display = "none";
    connection.on("data", (data) => handle_recieved_message(data));
    conn = connection;
  });
}
generate_peer();
function handle_recieved_message(data) {
  console.log(data);
  if (data.type === "board") {
    boardState = data.contents;
    delete_all_pieces();
    PlacePieces(boardState);
    //make_pieces_responsive();
    setTimeout(() => make_pieces_responsive(), 1);
    return;
  }
  if (data.type === "pieceMove") {
    boardState = data.contents;
    delete_piece(data.idx);
    PlacePiece(boardState, data.idx);
    return;
  }
  if (data.type === "mouse") {
    return;
  }
}
function connect_to_host(friend_id) {
  //unfiltered
  conn = peer.connect(friend_id);
  conn.on("open", function () {
    conn.send("hi!");
    console.log("connection started");
  });
  conn.on("data", (data) => handle_recieved_message(data));
}
function send_state() {
  if (conn && conn.open) {
    const message = {
      type: "board",
      contents: boardState,
    };
    conn.send(message);
  }
}

function send_piece(activePieceIdx) {
  if (conn && conn.open) {
    const message = {
      type: "pieceMove",
      contents: boardState,
      idx: activePieceIdx,
    };
    conn.send(message);
  }
}

function send_chat(string) {
  if (conn && conn.open) {
    conn.send(string);
  }
}
// end of connection section

//move chess piece section
//let positionOfCursorFromPieceX = 0;
//let positionOfCursorFromPieceY = 0;
function pointInRect(x, y, rect) {
  //reusable condition
  return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
}
let isMoving = false;
let activePiece = null;

function eventOnMouseDown(e) {
  e.preventDefault(); // for prevent drag-click
  isMoving = true;
  const original = e.currentTarget; //for both normal and recruit piece

  if (original.classList.contains("recruit-piece")) {
    // clone recruit piece, instead of moving the original
    const clone = original.cloneNode(true);
    const id = nextPieceId++;
    clone.dataset.id = id;
    clone.classList.remove("recruit-piece");
    clone.addEventListener("mousedown", eventOnMouseDown);
    clone.addEventListener("touchstart", (e) =>
      eventOnMouseDown(normalizeEvent(e))
    );

    document.getElementById("workzone").appendChild(clone);
    activePiece = clone;

    boardState[id] = {
      type: original.dataset.type,
      color: original.dataset.color,
      x: original.offsetLeft,
      y: original.offsetTop,
    };
  } else {
    activePiece = original;
  }
  activePiece.style.cursor = "grabbing";
}

function eventOnMouseMove(e) {
  if (isMoving && activePiece) {
    const rectWorkzone = workzone.getBoundingClientRect();

    //координаты точки начала рисования картинки, относительно relative контейнера, в котором находимся, теперь workzone
    let newX = e.clientX - rectWorkzone.x;
    let newY = e.clientY - rectWorkzone.y;

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

    boardState[activePiece.dataset.id].x = newX / rectWorkzone.width;
    boardState[activePiece.dataset.id].y = newY / rectWorkzone.width;

    activePiece.style.left = newX + "px";
    activePiece.style.top = newY + "px";
    //send_state();
    send_piece(activePiece.dataset.id);
  }
}

function eventOnMouseUp(e) {
  if (!isMoving || !activePiece) return;

  isMoving = false;

  const rectWorkzone = workzone.getBoundingClientRect();
  const rectRecruit = recruitZone.getBoundingClientRect();

  // If dropped in recruitzone then delete
  if (pointInRect(e.clientX, e.clientY, rectRecruit)) {
    const key = activePiece.dataset.id;
    activePiece.parentNode.removeChild(activePiece);
    if (boardState[key]) delete boardState[key];
    activePiece = null;
    return;
  }
  activePiece.style.cursor = "grab";
  activePiece = null;
}

function make_pieces_responsive() {
  //will be called with each new board
  let pieces = document.querySelectorAll(".chess-piece");
  pieces.forEach((piece) => {
    piece.style.cursor = "grab";
    piece.addEventListener("mousedown", eventOnMouseDown);
    piece.addEventListener("touchstart", (e) =>
      eventOnMouseDown(normalizeEvent(e))
    );
  });
}
make_pieces_responsive();

function normalizeEvent(e) {
  // take touchpad or mouse event
  // if touch, then reformat like it was a mouse
  let x, y;
  if (e.touches && e.touches.length > 0) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }
  return {
    ...e,
    clientX: x,
    clientY: y,
    //currentTarget: e.currentTarget
  };
}

document.addEventListener("mousemove", eventOnMouseMove);
document.addEventListener("touchmove", (e) =>
  eventOnMouseMove(normalizeEvent(e))
);

document.addEventListener("mouseup", eventOnMouseUp);
document.addEventListener("touchend", (e) => eventOnMouseUp(normalizeEvent(e)));

document.getElementById("buttonLogin").onclick = function () {
  const friend_id = document.getElementById("inputCode").value.trim();

  document.getElementById("coverBox").style.zIndex = -1;
  document.getElementById("coverBox").style.display = "none";

  if (friend_id === "") {
    //starting Solo
    //nothing happens
  } else {
    // starting connection to host
    connect_to_host(friend_id);
  }
};
