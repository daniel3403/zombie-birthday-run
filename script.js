const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1600;
canvas.height = 600;

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
  x: 100,
  y: 500,
  width: 96,
  height: 96,
  vy: 0,
  jumping: false,
  lives: 3
};

let gravity = 0.9;
let jumpPower = -28;
let ground = 564;
let obstacles = [];
let obstacleSpacing = 700;
let reachedEnd = false;

function spawnObstacles() {
  for (let i = 1; i <= 10; i++) {
    obstacles.push({
      x: i * obstacleSpacing + 400,
      y: ground,
      width: 96,
      height: 96,
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
  ctx.fillText("Vidas: " + player.lives, 20, 30);
}

function drawEndScene() {
  ctx.drawImage(finalImg, 650, 100, 300, 300);
  ctx.fillStyle = "#fff";
  ctx.font = "26px Arial";
  ctx.fillText("Sobreviviste a los zombis. Corriste sin parar.", 400, 450);
  ctx.fillText("Y ahora, te espera lo mejor: una torta y una amiga que te quiere.", 250, 490);
  ctx.fillText("¡Feliz cumpleaños, Rocío!", 600, 530);
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
    ctx.font = "32px Arial";
    ctx.fillText("¡Perdiste! Recarga la página para intentarlo de nuevo.", 400, 300);
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
