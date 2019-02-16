function draw() {

clear();

circle(x, y, 10);

if (x + dx > WIDTH (-r)|| x + dx < 0 (+r))

dx = -dx;

if (y + dy > HEIGHT (-r)|| y + dy < 0 (+r))

dy = -dy;

x += dx;

y += dy;

}