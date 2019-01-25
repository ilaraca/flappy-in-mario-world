/* Variáveis Globais */
let ctxP = '';
let gameStarted = false;
const frames = 0;
let birdDead = false;
/*-*/
const GAME_OVER_FONT = '80px comic sans';
const GAME_OVER_COLOR = 'black';
const GAME_OVER_TEXT = 'GAME OVER';
const GAME_OVER_X = 230;
const GAME_OVER_Y = 252;

function addCanvas() {
  const newCanvas = document.createElement('canvas');
  ctxP = newCanvas.getContext('2d');
  document.getElementById('game-board').appendChild(newCanvas);
  document.getElementsByTagName('canvas')[0].setAttribute('id', 'flappy-bird');
  document.getElementsByTagName('canvas')[0].setAttribute('width', '900');
  document.getElementsByTagName('canvas')[0].setAttribute('height', '504');
}

/* shot */
function Shot(ctxShot, x, y) {
  this.ctx = ctxShot;
  this.x = x;
  this.y = y;
}

Shot.prototype.drawShot = function drawShot() {
  this.ctx.fillRect(this.x, this.y, 10, 5);
};

Shot.prototype.moveShot = function moveShot() {
  this.x += 10;
};

/* enemy */
let looper;
let rectY = 0;

function Enemy(x, y) {
  this.canvas = document.getElementById('flappy-bird');
  this.ctx = this.canvas.getContext('2d');
  this.x = 500; // 0
  this.y = y;
  this.velY = 0;
  this.width = 50;
  this.height = 50;
  this.arrayEnemy = [];
}

Enemy.prototype.drawImage = function drawImage() {
  this.x -= 1;
  // this.ctx = ctxEne;
  if (this.x > this.width - 50) {
    this.stopLooper();
  }
  this.img = new Image();
  this.img.src = 'images/vilao-flappy-bird.png';
  this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
};

Enemy.prototype.createEnemy = function createEnemy() {
  if (frames % this.width === 0) {
    const x = Math.floor(Math.random() * 10) * this.height;
    this.arrayEnemy.push(new Enemy(this.y, x, this.ctx));
  }
};

Enemy.prototype.drawEnemies = function drawEnemies() {
  this.arrayEnemy.forEach(enemy => enemy.drawImage());
};

Enemy.prototype.render = function render() {
  this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
  this.drawImage(rectY += 1);
};
Enemy.prototype.stopLooper = function stopLooper() {
  clearInterval(looper);
};
/* bird */
function Bird(x, y) {
  this.canvas = document.getElementById('flappy-bird');
  this.ctx = this.canvas.getContext('2d');
  this.x = x;
  this.y = y;
  this.velY = 0;
  this.width = 100;
  this.height = 100;
  this.arrayShot = [];
}

Bird.prototype.drawImage = function drawImage() {
  // this.ctx = ctxBird;
  this.img = new Image();
  this.img.src = 'images/flappy_thug_life_1.png';
  this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
};

Bird.prototype.update = function update() {
  if (this.y + this.velY > this.ctx.height || this.y + this.velY < 0) {
    this.velY *= -1;
  }
  this.y += this.velY;
  this.velY += 0.80; /* 1.25; */
};

Bird.prototype.newPos = function newPos() {
  this.img = new Image();
  this.img.src = 'images/flappy_thug_life_1.png';
  const renderX = -this.width / 2;
  const renderY = -this.height / 2;
  this.ctx.drawImage(this.img, this.x, this.y, renderX, renderY);
};

Bird.prototype.createShot = function createShot() {
  this.arrayShot.push(new Shot(this.ctx, this.x, this.y));
};

/* Background */
function Background() {
  this.canvas = document.getElementById('flappy-bird');
  this.ctx = this.canvas.getContext('2d');
  this.bgPos = 0;
  this.fgPos = 0;
  this.bgSpeed = 2;
  this.bgWidth = 900;
  this.bgHeight = 504;
}

Background.prototype.drawImage = function drawImage() {
  this.bgImg = new Image();
  this.bgImg.src = 'images/agora-vai-mario.png';
  this.ctx.drawImage(this.bgImg, 0, 0, this.bgWidth, this.bgheight);
};

Background.prototype.update = function update() {
  this.bgPos -= this.bgSpeed;
  if (this.bgPos < -this.bgWidth) this.bgPos = 0;
};

Background.prototype.newPos = function newPos() {
  for (let i = 0; i <= this.ctx.width / this.bgWidth + 1; i += 1) {
    this.ctx.drawImage(this.bgImg, this.bgPos + i * this.bgWidth, 0);
  }
};

let background = '';
let bird = '';
let enemy = '';

function onKeySpace(agrBird) {
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 32) {
      bird = agrBird;
      bird.velY = -12;
      bird.createShot();
    }
  });
}

function startGame() {
  const canvas = document.getElementById('flappy-bird');
  const ctx = canvas.getContext('2d');
  ctxP = ctx;
  ctx.width = 900;
  ctx.height = 504;
  background.drawImage();
  background.update();
  background.newPos();
  bird.update();
  bird.newPos();
  const gameOver = () => {
    ctx.font = GAME_OVER_FONT;
    ctx.fillStyle = GAME_OVER_COLOR;
    ctx.fillText(GAME_OVER_TEXT, GAME_OVER_X, GAME_OVER_Y);
    birdDead = true;
  };
  function checkCollision() {
    if (bird.arrayShot.length !== 0) {
      for (let i = 0; i < bird.arrayShot.length; i += 1) {
        for (let j = 0; j < enemy.arrayEnemy.length; j += 1) {
          if (
            bird.arrayShot[i].x >= enemy.arrayEnemy[j].x
            && bird.arrayShot[i].x <= enemy.arrayEnemy[j].x + 50
            && bird.arrayShot[i].y >= enemy.arrayEnemy[j].y
            && bird.arrayShot[i].y <= enemy.arrayEnemy[j].y + 50
          ) {
            enemy.arrayEnemy.splice(j, 1);
            bird.arrayShot.splice(i, 1);
            j = enemy.arrayEnemy.length;
          }
        }
      }
    }
    // corrigir o enemy.width
    if (enemy.arrayEnemy.length !== 0) {
      for (let i = 0; i < enemy.arrayEnemy.length; i += 1) {
        if (bird.x < enemy.arrayEnemy[i].x + 5
          && bird.x + 5 > enemy.arrayEnemy[i].x
          && bird.y < enemy.arrayEnemy[i].y + enemy.height
          && bird.y + bird.height > enemy.arrayEnemy[i].y) {
          gameOver();
          birdDead = true;
          window.cancelAnimationFrame(gameLoop);
          // return;
        }
      }
    }
  }
  if (bird.arrayShot.length > 0) {
    for (let i = 0; i < bird.arrayShot.length; i += 1) {
      bird.arrayShot[i].drawShot();
      bird.arrayShot[i].moveShot();
    }
    checkCollision();
  }
  if (enemy.arrayEnemy.length < 10) {
    enemy.createEnemy();
  }
  enemy.drawEnemies();
  let gameLoop = window.requestAnimationFrame(startGame);
  gameStarted = true;
}
// preventDefault() => para impedir que a barra de espaço role a tela


window.onload = function onload() {
  document.getElementById('start-button').onclick = function press() {
    if (gameStarted === false && birdDead === false) {
      addCanvas();
      background = new Background(ctxP);
      bird = new Bird(130, 252, ctxP);
      enemy = new Enemy(300, 252, ctxP);
      startGame(background, bird, enemy);
      onKeySpace(bird);
    }
    // window.setInterval(exeLoop, 30);
    // event.preventDefault();
  };
};
