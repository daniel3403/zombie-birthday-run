const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 300;

// ✅ Primero definimos el suelo
let ground = 299;

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

const jumpSound = new Audio("assets/woosh-230554.mp3");
jumpSound.load();

const birthdaySong = new Audio("assets/birthday_song.mp3");
birthdaySong.load();

const hitSound = new Audio("assets/hit.mp3");
hitSound.load(); // precarga para evitar retrasos

// ✅ Jugador bien alineado al suelo
let player = {
  x: 50,
  y: ground - 68,
  width: 88,
  height: 88,
  vy: 0,
  jumping: false,
  lives: 5
};

let gravity = 0.3;
let jumpPower = -10;
let obstacles = [];
let obstacleSpacing = 400;
let reachedEnd = false;

function spawnObstacles() {
  for (let i = 1; i <= 6; i++) {
    obstacles.push({
      x: i * obstacleSpacing + 600,
      y: ground - 64, // alineado con el suelo
      width: 88,
      height: 68,
      hit: false
    });
  }
}

function drawPlayer() {
  // 🟤 Dibujar sombra en el suelo (solo si está por encima del suelo)
  if (player.y < ground - player.height) {
    ctx.beginPath();
    ctx.ellipse(player.x + player.width / 2, ground - 5, 15, 5, 0, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fill();
  }

  // 🧍‍♀️ Dibuja a Rocío (corriendo o saltando)
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
  ctx.fillStyle = "#000000"; 
  ctx.font = "22px Arial";
  ctx.fillText("Sobreviviste a los zombis...", 250, 250);
  ctx.fillText("Y ahora...", 250, 270);
  ctx.fillText("¡Feliz cumpleaños, Rocío!", 250, 290);

  // Reproduce solo si no ha empezado
  if (birthdaySong.paused) {
    birthdaySong.play();
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  if (reachedEnd) {
    drawEndScene();
    return;
  }

  // Movimiento del jugador
  player.y += player.vy;
  player.vy += gravity;

  if (player.y >= ground - player.height) {
    player.y = ground - player.height;
    player.jumping = false;
  }

  // Movimiento y colisión de obstáculos
  for (let obs of obstacles) {
    obs.x -= 2;

    if (
      player.x + 20 < obs.x + obs.width - 20 &&
      player.x + player.width - 10 > obs.x + 20 &&
      player.y + 20 < obs.y + obs.height - 20 &&
      player.y + player.height - 10 > obs.y + 20
    ) {
      if (!obs.hit) {
  hitSound.pause();             // detiene si estaba sonando
  hitSound.currentTime = 0;     // reinicia el sonido
  hitSound.play();              // lo reproduce
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

  // Fin del juego
  if (obstacles.length && obstacles[obstacles.length - 1].x < -60) {
    reachedEnd = true;
  }

  drawPlayer();
  drawObstacles();
  drawLives();

  requestAnimationFrame(update);
}

// Controles
document.addEventListener("keydown", (e) => {
  if ((e.code === "Space" || e.code === "ArrowUp") && !player.jumping) {
    jumpSound.pause();
    jumpSound.currentTime = 0;
    jumpSound.play();
    
    player.vy = jumpPower;
    player.jumping = true;
  }
});

document.addEventListener("click", () => {
  if (!player.jumping) {
    jumpSound.pause();
    jumpSound.currentTime = 0;
    jumpSound.play();
    
    player.vy = jumpPower;
    player.jumping = true;
  }
});

// Esperar que carguen todas las imágenes antes de empezar
Promise.all([
  new Promise(res => playerRunImg.onload = res),
  new Promise(res => playerJumpImg.onload = res),
  new Promise(res => zombieImg.onload = res),
  new Promise(res => bgImg.onload = res),
  new Promise(res => finalImg.onload = res)
]).then(() => {
  spawnObstacles();
  update();
});

window.addEventListener("load", () => {
  // 🔇 "Calienta" el sonido para evitar retrasos al primer salto
  jumpSound.play().then(() => jumpSound.pause());
});
