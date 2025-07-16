const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 300;

const playerRunImg = new Image();
playerRunImg.src = "assets/player.png";

const playerJumpImg = new Image();
playerJumpImg.src = "assets/player_jump.png";

const zombieImg = new Image();
zombieImg.src = "assets/zombie.png";

const bgImg = new Image();
bgImg.src = "assets/background.png";

const finalImg = new Image();
finalImg.src = "assets/final_scene.png";

let player = {
  x: 50,
  y: 170,
  width: 48,
  height: 48,
  vy: 0,
  jumping: false,
  lives: 5
};

let gravity = 1.2;
let jumpPower = -18;
let ground = 218;
let obstacles = [];
let obstacleSpacing = 400;
let reachedEnd = false;

function spawnObstacles() {
  for (let i = 1; i <= 6; i++) {
    obstacles.push({
      x: i * obstacleSpacing + 600,
      y: ground - 40,
      width: 88,
      height: 88,
      hit: false
    });
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
  ctx.font = "20px Arial";
  ctx.fillText("Vidas: " + player.lives, 10, 25);
}

function drawEndScene() {
  ctx.drawImage(finalImg, 250, 30, 300, 200);
  ctx.fillStyle = "#fff";
  ctx.font = "22px Arial";
  ctx.fillText("Sobreviviste a los zombis...", 40, 150);
  ctx.fillText("Y ahora...", 40, 200);
  ctx.fillText("¡Feliz cumpleaños, Rocío!", 40, 250);
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

if (player.y >= ground - player.height) {
  player.y = ground - player.height;
  player.jumping = false;
}

  for (let obs of obstacles) {
    obs.x -= 2;

if (
  player.x + 10 < obs.x + obs.width - 10 &&
  player.x + player.width - 10 > obs.x + 10 &&
  player.y + 10 < obs.y + obs.height - 10 &&
  player.y + player.height - 10 > obs.y + 10
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
