let UPDATE_INTERVAL_MS = 17; // 60 FPS same as .env but fuck it 

let isInActiveinterval = false;
const BASE = 'http://localhost:3000/api';
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");


// PUT http://localhost:3000/api/movePlayerUp/2 HTTP/1.1
// ###
// PUT http://localhost:3000/api/movePlayerDown/2 HTTP/1.1
function moveUp() {
    fetch(`${BASE}/movePlayerUp/2`, { method: 'PUT' })
  }
  
  function moveDown() {  
    fetch(`${BASE}/movePlayerDown/2`, { method: 'PUT' })
  }

function startGame() {
    fetch(`${BASE}/startGame`, { method: 'PUT' })
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
    fetch(`${BASE}/positions`)
      .then(res => res.json())
      .then(data => {
        drawGame(data);
        setTimeout(loop, 17); 
      })
  }

  loop(); 
}

function drawGame(data) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!Array.isArray(data)) return;
    
    data.forEach(ball => {
        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.ballX, ball.ballY, 10, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        
        // Draw paddles
        ball.playersInfo.forEach(player => {
            ctx.fillStyle = "white";
            const paddleWidth = 10;
            const paddleHeight = 80;
            const x = player.side === "left" ? 0 : canvas.width - paddleWidth;
            ctx.fillRect(x, player.PaddlePos, paddleWidth, paddleHeight);
        });
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        moveUp();
    } else if (event.key === 'ArrowDown') {
        moveDown();
    }
});
getPositions();