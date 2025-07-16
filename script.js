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
  y: 210,
  width: 48,
  height: 48,
  vy: 0,
  jumping: false,
  lives: 3
};

let gravity = 1.2;
let jumpPower = -18;
let ground = 258;
let obstacles = [];
let obstacleSpacing = 400;
let reachedEnd = false;

function spawnObstacles() {
  for (let i = 1; i <= 6; i++) {
    obstacles.push({
      x: i * obstacleSpacing + 400,
      y: ground,
      width: 48,
      height: 48,
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
  player.x + 20 < obs.x + obs.width - 20 &&
  player.x + player.width - 20 > obs.x + 20 &&
  player.y + 20 < obs.y + obs.height - 20 &&
  player.y + player.height - 20 > obs.y + 20
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
