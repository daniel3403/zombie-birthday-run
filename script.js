const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 300;

let player = {
  x: 50,
  y: 220,
  width: 40,
  height: 40,
  vy: 0,
  jumping: false,
  lives: 3
};

let gravity = 1.5;
let jumpPower = -20;
let obstacles = [];
let obstacleSpacing = 400;
let ground = 260;
let frame = 0;
let reachedEnd = false;

function spawnObstacles() {
  for (let i = 1; i <= 10; i++) {
    obstacles.push({
      x: i * obstacleSpacing + 400,
      y: ground,
      width: 40,
      height: 40,
      hit: false
    });
  }
}

function drawPlayer() {
  ctx.fillStyle = "#6cf";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  ctx.fillStyle = "#9f3";
  for (let obs of obstacles) {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  }
}

function drawLives() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Vidas: " + player.lives, 10, 25);
}

function drawEndScene() {
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText("Sobreviviste a los zombis. Corriste sin parar.", 150, 100);
  ctx.fillText("Y ahora, te espera lo mejor: una torta y una amiga que te quiere.", 40, 140);
  ctx.fillText("¡Feliz cumpleaños, Rocío!", 250, 180);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (reachedEnd) {
    drawEndScene();
    return;
  }

  player.y += player.vy;
  player.vy += gravity;

  if (player.y >= ground) {
    player.y = ground;
    player.jumping = false;
  }

  frame++;
  for (let obs of obstacles) {
    obs.x -= 5;

    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      if (!obs.hit) {
        player.lives--;
        obs.hit = true;
      }
    }
  }

  if (player.lives <= 0) {
    ctx.fillStyle = "#f44";
    ctx.font = "30px Arial";
    ctx.fillText("¡Perdiste! Recarga la página para intentarlo de nuevo.", 100, 150);
    return;
  }

  if (obstacles.length && obstacles[obstacles.length - 1].x < -50) {
    reachedEnd = true;
  }

  drawPlayer();
  drawObstacles();
  drawLives();

  requestAnimationFrame(update);
}

document.addEventListener('keydown', e => {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && !player.jumping) {
    player.vy = jumpPower;
    player.jumping = true;
  }
});

document.addEventListener('click', () => {
  if (!player.jumping) {
    player.vy = jumpPower;
    player.jumping = true;
  }
});

spawnObstacles();
update();