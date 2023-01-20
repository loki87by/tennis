import {
  CANVAS,
  CONTEXT,
  GRID,
  PADDLE_HEIGHT,
  MAX_PADDLE_Y,
  COLLIDES,
} from "./consts.js";

let paddleSpeed = 6;
let ballSpeed = 5;
const leftPaddle = {
  x: GRID * 2,
  y: CANVAS.height / 2 - PADDLE_HEIGHT / 2,
  width: GRID,
  height: PADDLE_HEIGHT,
  dy: 0,
};
const rightPaddle = {
  x: CANVAS.width - GRID * 3,
  y: CANVAS.height / 2 - PADDLE_HEIGHT / 2,
  width: GRID,
  height: PADDLE_HEIGHT,
  dy: 0,
};

const ball = {
  x: CANVAS.width / 2,
  y: CANVAS.height / 2,
  width: GRID,
  height: GRID,
  resetting: false,
  dx: ballSpeed,
  dy: -ballSpeed,
};

const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

const cancelAnimationFrame =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame;

function loop() {
  requestAnimationFrame(loop);
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  if (leftPaddle.y < GRID) {
    leftPaddle.y = GRID;
  } else if (leftPaddle.y > MAX_PADDLE_Y) {
    leftPaddle.y = MAX_PADDLE_Y;
  }

  if (rightPaddle.y < GRID) {
    rightPaddle.y = GRID;
  } else if (rightPaddle.y > MAX_PADDLE_Y) {
    rightPaddle.y = MAX_PADDLE_Y;
  }
  CONTEXT.fillStyle = "red";
  CONTEXT.fillRect(
    leftPaddle.x,
    leftPaddle.y,
    leftPaddle.width,
    leftPaddle.height
  );
  CONTEXT.fillRect(
    rightPaddle.x,
    rightPaddle.y,
    rightPaddle.width,
    rightPaddle.height
  );
  CONTEXT.fillStyle = "white";
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y < GRID) {
    ball.y = GRID;
    ball.dy *= -1;
  } else if (ball.y + GRID > CANVAS.height - GRID) {
    ball.y = CANVAS.height - GRID * 2;
    ball.dy *= -1;
  }

  if ((ball.x < 0 || ball.x > CANVAS.width) && !ball.resetting) {
    ball.resetting = true;
    setTimeout(() => {
      ball.resetting = false;
      ball.x = CANVAS.width / 2;
      ball.y = CANVAS.height / 2;
    }, 1000);
  }

  if (COLLIDES(ball, leftPaddle)) {
    ball.dx *= -1;
    ball.x = leftPaddle.x + leftPaddle.width;
  } else if (COLLIDES(ball, rightPaddle)) {
    ball.dx *= -1;
    ball.x = rightPaddle.x - ball.width;
  }

  CONTEXT.beginPath();
  CONTEXT.arc(ball.x, ball.y, (GRID / 3) * 2, 0, 2 * Math.PI);
  CONTEXT.fill();
  CONTEXT.fillStyle = "lightgreen";
  CONTEXT.fillRect(0, 0, CANVAS.width, GRID / 2);
  CONTEXT.fillRect(0, CANVAS.height - GRID / 2, CANVAS.width, CANVAS.height);

  for (let i = GRID; i < CANVAS.height - GRID / 2; i += GRID * 2) {
    CONTEXT.fillRect(CANVAS.width / 2 - GRID / 4, i, GRID / 2, GRID);
  }
}

document.addEventListener("keydown", function (e) {
  if (e.code === "ArrowUp") {
    rightPaddle.dy = -paddleSpeed;
  } else if (e.code === "ArrowDown") {
    rightPaddle.dy = paddleSpeed;
  }

  if (e.code === "KeyW") {
    leftPaddle.dy = -paddleSpeed;
  } else if (e.code === "KeyS") {
    leftPaddle.dy = paddleSpeed;
  }
});

document.addEventListener("keyup", function (e) {
  if (e.code === "ArrowUp" || e.code === "ArrowDown") {
    rightPaddle.dy = 0;
  }

  if (e.code === "KeyW" || e.code === "KeyS") {
    leftPaddle.dy = 0;
  }
});

requestAnimationFrame(loop);
