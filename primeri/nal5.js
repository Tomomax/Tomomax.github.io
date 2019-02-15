var paddlex;
var paddleh;
var paddlew;


function init_paddle() {
  paddlex = WIDTH / 2;
  paddleh = 10;
  paddlew = 75;
}

function draw() {
  clear();
  circle(x, y, 10);
  rect(paddlex, HEIGHT-paddleh, paddlew, paddleh);

  if (x + dx > WIDTH-r || x + dx < 0+r)
    dx = -dx;

  if (y + dy < 0+r)
    dy = -dy;
  else if (y + dy > HEIGHT-r) {
    if (x > paddlex && x < paddlex + paddlew)
      dy = -dy;
    else
      clearInterval(intervalId);
  }

  x += dx;
  y += dy;
}
init_paddle();