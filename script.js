import {
  CANVAS,
  FIRST_INFO,
  SECOND_INFO,
  FIRST_SCORE,
  SECOND_SCORE,
  POPUP,
  POPUP_TITLE,
  CONTEXT,
  RESTART,
  GRID,
  PADDLE_HEIGHT,
  MAX_PADDLE_Y,
  COLLIDES,
  CLONE_POINTS,
} from "./consts.js";

let paddleSpeed = 6;
let ballSpeed = 5;
let firstScore = 0;
let secondScore = 0;
let frame = null;
const points = [];

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

for (let i = 0; i < 6; i++) {
  CLONE_POINTS(FIRST_INFO);
  CLONE_POINTS(SECOND_INFO);
}

const FIRST_POINTS = Array.from(FIRST_INFO.querySelectorAll("div"));
const SECOND_POINTS = Array.from(SECOND_INFO.querySelectorAll("div"));

function setPoints() {
  FIRST_SCORE.textContent = 0
  SECOND_SCORE.textContent = 0
  points.forEach((point, index) => {
    let winner;
    let looser;

    if (point === 1) {
      FIRST_POINTS[index].classList.add("loose");
      SECOND_POINTS[index].classList.add("win");
      winner = SECOND_POINTS[index];
      looser = FIRST_POINTS[index];
    } else if (point === 0) {
      FIRST_POINTS[index].classList.add("win");
      SECOND_POINTS[index].classList.add("loose");
      winner = FIRST_POINTS[index];
      looser = SECOND_POINTS[index];
    }
    const win = winner.querySelector("svg");
    const ok = win.getElementById("ok");
    const loose = looser.querySelector("svg");
    loose.setAttribute("stroke", "#f00");
    const cross = loose.getElementById("cross");
    ok.classList.remove("hidden");
    cross.classList.remove("hidden");
    setTimeout(() => {
      FIRST_POINTS[index].classList.add("animated");
    }, 500);
    setTimeout(() => {
      SECOND_POINTS[index].classList.add("animated");
    }, 1000);
  });
}

function closePopup() {
  POPUP.classList.remove("popup_opened");
}

function restart() {
  firstScore = 0;
  secondScore = 0;
  FIRST_SCORE.textContent = 0
  SECOND_SCORE.textContent = 0

  for (let i = 0; i < 7; i++) {
    points.pop();
  }
  [...FIRST_POINTS, ...SECOND_POINTS].forEach((item) => {
    const svg = item.children[0];
    const pathes = Array.from(svg.children);
    pathes.forEach((path) => {
      if (!path.classList.contains("hidden")) {
        path.classList.add("hidden");
      }
    });
  });
  closePopup();
  ball.resetting = false;
  ball.x = CANVAS.width / 2;
  ball.y = CANVAS.height / 2;
  loop()
}

function showPopup(arg, gameOver) {
  POPUP.classList.add("popup_opened");

  if (!gameOver) {
    POPUP_TITLE.textContent = `Раунд выиграл игрок ${arg + 1}`;
    setTimeout(() => {
      closePopup();
      setPoints();
    }, 2300);
  } else {
    POPUP_TITLE.textContent = `Игра окончена. Победитель: Игрок ${arg + 1}`;
    RESTART.classList.remove("hidden");
  }
}

function loop() {
  frame = requestAnimationFrame(loop);

  function timeOut(arg) {
    points.push(arg);
    secondScore = 0;
    firstScore = 0;

    if (points.length < 7) {
      showPopup(arg);
    } else {
      setPoints()
    }
  }

  function resetting(time) {
    setTimeout(() => {
      ball.resetting = false;
      ball.x = CANVAS.width / 2;
      ball.y = CANVAS.height / 2;
    }, time);
  }

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
    if (ball.x < 0) {
      secondScore++;
      SECOND_SCORE.textContent = secondScore;
    }

    if (ball.x > CANVAS.width) {
      firstScore++;
      FIRST_SCORE.textContent = firstScore;
    }
    ball.resetting = true;
    if ([firstScore, secondScore].find((score) => score === 11)) {
      if (points.length < 7) {
        resetting(5000);
      }
    } else {
      resetting(1000);
    }

    [firstScore, secondScore].forEach((score, index) => {
      if (score === 11) {
        timeOut(index);
      }
    });

    if (points.length === 7) {
      cancelAnimationFrame(frame);
      const total = points.reduce(function (previousValue, item) {
        return previousValue + item;
      });
      showPopup(total > 3 ? 1 : 0, true);
    }
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

RESTART.addEventListener("click", restart);

requestAnimationFrame(loop);
