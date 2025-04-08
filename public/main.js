let UPDATE_INTERVAL_MS = 17; // 60 FPS same as .env but fuck it 

let isInActiveinterval = false;
const BASE = 'http://localhost:3000/api';
const BASEAI = 'http://localhost:3001/api';
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const gameid = prompt("game id :")

// PUT http://localhost:3000/api/movePlayerUp/2 HTTP/1.1
// ###
// PUT http://localhost:3000/api/movePlayerDown/2 HTTP/1.1
function moveUp(playerID) {
    fetch(`${BASE}/movePlayerUp/${playerID}`, { method: 'PUT' })
  }
  
  function moveDown(playerID) {  
    fetch(`${BASE}/movePlayerDown/${playerID}`, { method: 'PUT' })
  }

function startGame() {
    fetch(`${BASE}/startGame/${gameid}`, { method: 'PUT' })
}

function stopGame() {
    fetch(`${BASE}/stopGame`, { method: 'PUT' })
}

let polling = false;

function getPositions() {
  if (polling) 
    return;
  polling = true;
  
  function loop() {
    fetch(`${BASE}/match/${gameid}`)
    .then(res => res.json())
    .then(data => {
      drawGame(data);
      // MoveAIs(data);
      setTimeout(loop, 17); 
    })
  }
  
  loop(); 
}

async function MoveAIs(data) {
  data.forEach(async ball =>{
    ball.playersInfo.forEach(async player => {
      if (player.AI === true){
        let res = await fetch(`${BASEAI}/train`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            AIid : player.PlayerID,
            ballX: ball.ballX,
            ballY: ball.ballY,
            ballSpeedX: ball.ballVelocityX,
            ballSpeedY: ball.ballVelocityY,
            myPosition: player.PaddlePos,
            PaddleHeight: player.PaddleHeight
          })
        })
        let readyRes = await res.json();
        if (readyRes.move === 'up') {
          // console.log(player.PlayerID);
          moveUp(player.PlayerID);
        }
        else if (readyRes.move === 'down') {
          moveDown(player.PlayerID);
        }
      }
    })
  })
}

function drawGame(data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  
  // Draw ball
  // console.log(data.ball);
  ctx.beginPath();
  ctx.arc(data.ball.ballX, data.ball.ballY, data.ball.ballRadius, 0, Math.PI * 2);
  // console.log(data.ball.ballX, data.ball.ballY, data.ballRadius);
  ctx.fillStyle = "white";
  ctx.fill();
  console.log(data);
      
      // // Draw paddles
      data.players.forEach(player => {
          ctx.fillStyle = player.playerColor;
          // console.log(player.playerColor ); 
          const paddleWidth = 10;
          const paddleHeight = 80;
          const x = player.side === "left" ? 0 : canvas.width - paddleWidth;
          ctx.fillRect(x, player.PaddlePos, paddleWidth, paddleHeight);
      });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        moveUp(2);
    } else if (event.key === 'ArrowDown') {
        moveDown(2);
    }
    if (event.key === 'w') {
        moveUp(1);
    } else if (event.key === 's') {
        moveDown(1);
    }
  

});
getPositions();