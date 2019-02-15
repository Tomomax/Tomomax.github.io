var canvas = document.getElementById("canvas");

var x = 150;
var y = 150;
var dx = 2;
var dy = 4;
var WIDTH;
var HEIGHT;
var r = 10;
var f = 5;
var ctx;
var paddlex;
var paddleh;
var paddlew;

var rightDown = false;
var leftDown = false;
var canvasMinX;
var canvasMaxX;

var bricks;
var NROWS;
var NCOLS;
var BRICKWIDTH;
var BRICKHEIGHT;
var PADDING;

function drawIt() {
	
	function onKeyDown(evt) {
		if (evt.keyCode == 39) 
			rightDown = true;
		else if (evt.keyCode == 37)
			leftDown = true;
	}
	
	function onKeyUp(evt) {
		if (evt.keyCode == 39)
			rightDown = false;
		else if (evt.keyCode == 37)
			leftDown = false;
	}
	
	function onMouseMove(evt) {
		if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
			paddlex = evt.pageX - canvasMinX - paddlew/2;
		}
	}
	
	$(document).mousemove(onMouseMove);
	$(document).keydown(onKeyDown);
	$(document).keyup(onKeyUp);  
	
	function initbricks() {	//inicializacija opek - polnjenje v tabelo
		NROWS = 7;
		NCOLS = 10;
		BRICKWIDTH = (WIDTH/NCOLS) - 1;
		BRICKHEIGHT = 18;
		PADDING = 1;
		bricks = new Array(NROWS);
		for (i=0; i < NROWS; i++) {
			bricks[i] = new Array(NCOLS);
			for (j=0; j < NCOLS; j++) {
				bricks[i][j] = 1;
			}
		}
	}
	
	function init() {
		ctx = $('canvas')[0].getContext("2d");
		WIDTH = $("canvas").width();
		HEIGHT = $("canvas").height();
		return setInterval(draw, 10);
	}
	
	function init_mouse() {
		canvasMinX = $("canvas").offset().left;
		canvasMaxX = canvasMinX + WIDTH;
	}
	
	function init_paddle(){
		paddlex = WIDTH/2;
		paddleh = 10;
		paddlew = 75;
	}
	
	function circle(x,y,r) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
	}
	
	function rect(x,y,w,h) {
		ctx.beginPath();
		ctx.rect(x,y,w,h);
		ctx.closePath();
		ctx.fill();
	}
	
	function color(){
		ctx.fillStyle="#FFFFFF";
		ctx.closePath();
		ctx.fill();
	}
	
	function clear() {
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
	}
	
	function draw() {
		clear();
		circle(x, y, 10);
		rect(paddlex, HEIGHT-paddleh, paddlew, paddleh);
		//risanje opek
		for (i=0; i < NROWS; i++) {
			for (j=0; j < NCOLS; j++) {
				if (bricks[i][j] == 1) {
					rect((j * (BRICKWIDTH + PADDING)) + PADDING,(i * (BRICKHEIGHT + PADDING)) + PADDING,BRICKWIDTH, BRICKHEIGHT);
				}
			}
		}
		color();
		
		if(rightDown){
			if((paddlex+paddlew) < WIDTH){
				paddlex += 5;
			}else{
				paddlex = WIDTH-paddlew;
			}
		}
		else if(leftDown){
			if(paddlex>0){
				paddlex -=5;
			}else{
				paddlex=0;
			}
		}
		
		//rušenje opek
		rowheight = BRICKHEIGHT + PADDING; //Smo zadeli opeko?
		colwidth = BRICKWIDTH + PADDING;
		row = Math.floor(y/rowheight);
		col = Math.floor(x/colwidth);
		//Če smo zadeli opeko, vrni povratno kroglo in označi v tabeli, da opeke ni več
		if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
			dy = -dy;
			bricks[row][col] = 0;
		}

		if (x + dx > WIDTH -r || x + dx < 0+r)
			dx = -dx;
		if (y + dy < 0+r)
			dy = -dy;
		else if (y + dy > HEIGHT -(r+f)) {
			if (x > paddlex-r && x < paddlex + paddlew + r) {
				dx = 8 * ((x-(paddlex+paddlew/2))/paddlew);
				dy = -dy;
			}
			else if (y + dy > HEIGHT-r){ 
				clearInterval(intervalId);
			}
		}
		x += dx;
		y += dy;
	}
	
	init();
	init_mouse();
	init_paddle();
	initbricks();
	
}