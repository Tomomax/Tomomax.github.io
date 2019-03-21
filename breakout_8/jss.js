var canvas = document.getElementById("canvas");

var x = 450;
var y = 450;
var dx = 1;
var dy = 4;
var WIDTH;
var HEIGHT;
var r = 10;
var f = 5;
var ctx;
var paddlex;
var paddleh;
var paddlew;
var life = 3;
var vs;

var pcolor1 = new Image();
pcolor1.src = "slike/brick1.png";
var staff = new Image();
staff.src = "slike/staff.png";

var rightDown = false;
var leftDown = false;
var spaceClick = false;
var pClick = false;
var rClick = false;
var canvasMinX;
var canvasMaxX;

var bricks;
var NROWS;
var NCOLS;
var BRICKWIDTH;
var BRICKHEIGHT;
var PADDING;

var tocke;

function drawIt() {
	
	function onKeyDown(evt) {
		if (evt.keyCode == 39) 
			rightDown = true;
		else if (evt.keyCode == 37)
			leftDown = true;
		else if (evt.keyCode == 32)
			spaceClick = true;
		else if (evt.keyCode == 80)
			gamePause();
		else if (evt.keyCode == 82)
			gameRestart();
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
	
	function gameRestart(){
		location.reload();
	}
	
	function gamePause(){
		if(spaceClick == true){
			if(!pClick){
				pClick = true;
				clearInterval(drawInterval);
				$("#black").show();
				$("#pause").show();
			}else{
				pClick = false;
				$("#black").hide();
				$("#pause").hide();
				drawInterval=setInterval(draw, 10);
			}
		}
	}
	
	$(document).keydown(onKeyDown);
	$(document).keyup(onKeyUp);
	
	function initbricks() {	//inicializacija opek - polnjenje v tabelo
		NROWS = 7;
		NCOLS = 12;
		BRICKWIDTH = 50;
		BRICKHEIGHT = 30;
		PADDING = 1;
		bricks = new Array(NROWS);
		for (i=0; i < NROWS; i++) {
			bricks[i] = new Array(NCOLS);
			for (j=5; j < NCOLS; j++) {
				bricks[i][j] = 1;
			}
		}
	}
	
	function noBricks(){
		vs=0;
		for (i=0; i < NROWS; i++) {
			for (j=5; j < NCOLS; j++) {
				vs = vs+bricks[i][j];
			}
		}
		if(vs<=7){
			endGame();
		}
	}
	
	function black(){
		$("black").html(black);
	}
	
	function init() {
		ctx = $('canvas')[0].getContext("2d");
		WIDTH = $("canvas").width();
		HEIGHT = $("canvas").height();
		tocke = 0;
		$("#tocke").html(tocke);
		drawInterval = setInterval(draw, 10);
		return drawInterval;
	}
	
	function init_mouse() {
		canvasMinX = $("canvas").offset().left;
		canvasMaxX = canvasMinX + WIDTH;
	}
	
	function init_paddle(){
		paddlex = WIDTH/2;
		paddleh = 80;
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
	
	function end(){
		//RABM DISABLE-AT PAUZO :/
		$("#l1").attr("src","slike/life_not.png");
		clearInterval(drawInterval);
		$("#black").show();
        $("#end").show();
		$("#continue").show();
		$("#yes").click(function(){
			location.reload();
		})
		$("#no").click(function(){
			$("#end").hide();
			$("#continue").hide();
			$("#go").fadeIn(1500)();
		})
	}
	
	function endGame(){
		clearInterval(drawInterval);
		$("#black").show();
		$("#beat").fadeIn(500);
		$("#next").fadeIn(1500);
		$("#restart").fadeIn(1500);
		$("#restart").click(function(){
			location.reload();
		})
	}
	
	function draw() {
		clear();
		circle(x, y, 10);
		ctx.drawImage(staff, paddlex, HEIGHT-paddleh, paddlew, paddleh);
		//risanje opek
		for (i=1; i < NROWS; i++) {
			for (j=5; j < NCOLS; j++) {
				if (bricks[i][j] == 1) {
					ctx.drawImage(pcolor1, (j * (BRICKWIDTH + PADDING)) + PADDING,(i * (BRICKHEIGHT + PADDING)) + PADDING,BRICKWIDTH, BRICKHEIGHT);
				}
			}
		}
		color();
		
		if(spaceClick == true){
			$("#black").hide();
			$("#start").hide();
			$(document).mousemove(onMouseMove);
			
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
				bricks[row][col] -= 1;
				tocke+=100;
				$("#tocke").html(tocke);
				noBricks();
			}
			
			if (x + dx > WIDTH -r -78 || x + dx < 0 +r +78)
				dx = -dx;
			if (y + dy < 0 +r +43)
				dy = -dy;
			else if (y + dy > HEIGHT -(r+f) -55) {
				if (x > paddlex-r && x < paddlex + paddlew + r) {
					dx = 8 * ((x-(paddlex+paddlew/2))/paddlew);
					dy = -dy;
				}
				else if (y + dy > HEIGHT-r){ 
					x=450;
					y=450;
					spaceClick == false;
					if(life == 3){
						$("#l3").attr("src","slike/life_not.png");
						life--;
					}else if(life == 2){
						$("#l2").attr("src","slike/life_not.png");
						life--;
					}else if(life == 1){
						end();
					}
				}
			}
			x += dx;
			y += dy;
		}
	}
	
	drawInterval = init();
	init_mouse();
	init_paddle();
	initbricks();
	
}