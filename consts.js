export const CANVAS = document.getElementById("game");
export const CONTEXT = CANVAS.getContext("2d");
export const GRID = 15;
export const PADDLE_HEIGHT = GRID * 5;
export const MAX_PADDLE_Y = CANVAS.height - GRID - PADDLE_HEIGHT;

export const COLLIDES = (obj1, obj2) => {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
};
