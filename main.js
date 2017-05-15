var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var drawBuffer = [];
var drawPoint = false;
var drawLine = 0;
var drawArc = 0;
var drawBezier = 0;
var drawArea = 0;
var drawFree = 0;
var tol = 10;
var img = null;
var cont = 0;
var moveu = false;
var oquemoveu = [];
var idquemoveu = 0;

drawCall = function ()
{
	context.fillStyle = "rgb(255,255,255)";
	context.fillRect(0, 0, canvas.width, canvas.height);
	if(img!=null){
		context.drawImage(img, 0,0);
	}
	if(drawBuffer.length > 0){
		for (var i = 0; i < drawBuffer.length; i++){
			context.setLineDash([0,0]);
			//if(scale != 2 && drawBuffer[i] != pick){
			drawBuffer[i].draw(context);
			//}
		}	
	}
}

getColor = function() 
{
	return document.getElementById("colorwheel").value;
}

setAllFalse = function()
{
	drawPoint = false;
	drawFree = 0;
	drawLine = 0;
	drawArc = 0;
	drawBezier = 0;
	drawArea = 0;
	scale = 0;
	rotation = 0;
	pick = null;
}

generateNewFree = function(){
	if(drawFree == 0){
		setAllFalse();
		drawFree = 1;
	}else{
		drawFree = 0;
	}
}

generateNewPoint = function()
{
	if(drawPoint == false){
		setAllFalse();
		drawPoint = true;
	}
	else{
		drawPoint = false;
	}
}

generateNewLine = function()
{
	if(drawLine == 0){
		setAllFalse();
		drawLine = 1;
	}
}

generateNewArc = function()
{
	if(drawArc == 0){
		setAllFalse();
		drawArc = 1;
	}
}

generateNewBezier = function()
{
	if(drawBezier == 0){
		setAllFalse();
		drawBezier = 1;
	}
}

generateNewArea = function()
{
	if(drawArea == 0){
		setAllFalse();
		drawArea = 1;
	}
}
scaleFlag = function()
{
	if(scale == 0){
		setAllFalse();
		scale = 1;
	}
}

rotationFlag = function()
{
	if(rotation == 0 && pick != null){
		setAllFalse();
		rotation = 1;
	}
}

drawCall();