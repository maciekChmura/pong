const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(w, h) {
    this.pos = new Vec;
    this.size = new Vec(w, h)
  }
  get left() {
    return this.pos.x
  }
  get right() {
    return this.pos.x + this.size.x
  }
  get top() {
    return this.pos.y
  }
  get bottom() {
    return this.pos.y + this.size.y
  }
}

class Ball extends Rect {
  constructor() {
    super(10, 10)
    this.vel = new Vec;
  }
}

const ball = new Ball;
console.log(ball);
ball.pos.x = 100;
ball.pos.y = 50;

ball.vel.x = 100;
ball.vel.y = 100;


let lastTime;
function callback(milliSec) {
  if (lastTime) {
    update((milliSec - lastTime) / 1000);
  }
  lastTime = milliSec;
  requestAnimationFrame(callback);
}

function update(deltaTime) {
  ball.pos.x += ball.vel.x * deltaTime;
  ball.pos.y += ball.vel.y * deltaTime;

  if (ball.left < 0 || ball.right > canvas.width) {
    ball.vel.x = -ball.vel.x;
  }
  if (ball.top < 0 || ball.bottom > canvas.height) {
    ball.vel.y = -ball.vel.y;
  }
  console.log(ball.pos.x);
  console.log("ball left: " + ball.left);
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#fff";
  context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
}

callback();
