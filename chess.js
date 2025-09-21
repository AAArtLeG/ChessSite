const canvas = document.getElementById('ChessBoard');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

function drawSquare(i,j,width){
ctx.fillStyle = '#CCCC00';
ctx.fillRect(i*width/8, j*width/8, width/8, width/8);
}

function FillChessBackground(){
    const width = canvas.width;
    //const height = canvas.height;
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(0, 0, width, width); //placement to be changed
    const squareSize = width/8;
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if((i+j)%2==1){
                drawSquare(i,j,width);
            };
        }
    }
}

FillChessBackground()