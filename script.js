const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200;
canvas.height = 450;

const playerRunImg = new Image();
playerRunImg.src = "assets/player.png";

const playerJumpImg = new Image();
playerJumpImg.src = "assets/player_jump.png";

const zombieImg = new Image();
zombieImg.src = "assets/zombie.png";

const bgImg = new Image();
const finalImg = new Image();
finalImg.src = "assets/final_scene.png";
bgImg.src = "assets/background.png";

let player = { x: 75, y: 315, width: 72, height: 72, vy: 0, jumping: false, lives: 3 };
let gravity = 1.2;
let jumpPower = -27;
let ground = 387;
let obstacles = [];
let frame = 0;
let reachedEnd = false;

function spawnObstacles() {
  for (let i = 1; i <= 10; i++) {
    obstacles.push({ x: i * 400 + 400, y: ground, width: 72, height: 72, hit: false });
  }
}

function drawPlayer() {
  const currentSprite = player.jumping ? playerJumpImg : playerRunImg;
  ctx.drawImage(currentSprite, player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  for (let obs of obstacles) {
    ctx.drawImage(zombieImg, obs.x, obs.y, obs.width, obs.height);
  }
}

function drawBackground() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function drawLives() {
  ctx.fillStyle = "#fff";
  ctx.font = "18px Arial";
  ctx.fillText("Vidas: " + player.lives, 10, 25);
}

function drawEndScene() {
ctx.drawImage(finalImg, 250, 30, 300, 200);
  ctx.fillStyle = "#fff";
  ctx.font = "22px Arial";
  ctx.fillText("Sobreviviste a los zombis. Corriste sin parar.", 150, 100);
  ctx.fillText("Y ahora, te espera lo mejor: una torta y una amiga que te quiere.", 40, 140);
  ctx.fillText("¡Feliz cumpleaños, Rocío!", 250, 180);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

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

  for (let obs of obstacles) {
    obs.x -= 2;

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
    ctx.font = "26px Arial";
    ctx.fillText("¡Perdiste! Recarga la página para intentarlo de nuevo.", 100, 150);
    return;
  }

  if (obstacles.length && obstacles[obstacles.length - 1].x < -60) {
    reachedEnd = true;
  }

  drawPlayer();
  drawObstacles();
  drawLives();

  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  if ((e.code === "Space" || e.code === "ArrowUp") && !player.jumping) {
    player.vy = jumpPower;
    player.jumping = true;
  }
});

document.addEventListener("click", () => {
  if (!player.jumping) {
    player.vy = jumpPower;
    player.jumping = true;
  }
});

spawnObstacles();
update();