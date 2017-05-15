pick = null;
move = false;
scale = 0;
rotation = 0;
rate = 1
var tmpBegin = [];
var freestart = 0;
var tmpDrawBuffer = [];

function getMousePos(canvas, evt)
{
	var rect = canvas.getBoundingClientRect();
	return {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
}

document.addEventListener("keydown", function(evt)//end area
{
	if(drawArea == 3){
		setAllFalse();
		tmpArray.push(new Point(pos.x,pos.y));
		drawBuffer.push(new Area(tmpArray, cont));
		cont++;
		var modal = document.getElementById("modal");
		modal.style.display = "block";
		drawCall();
	}
	if(evt.keyCode == 27) // esc
	{
		pick = null
		setAllFalse();
		drawCall();
	}
	if(evt.keyCode == 46) // delete
	{
		if(pick != null)
		{
			for(var i = 0; i < drawBuffer.length;i++)
			{
				if(drawBuffer[i] === pick)
				{
					pick = null;
					removeFromXML(drawBuffer[i].id);
					drawBuffer.splice(i,1);
				}
			}
			drawCall();
		}

	}
}, false);

canvas.addEventListener('mousemove', function(evt)
{
	pos = getMousePos(canvas, evt);
	if(scale == 2 && pick != null)
	{
		context.fillStyle = "rgb(255,255,255)";
		//context.fillRect(0, 0, canvas.width, canvas.height);

		if(drawBuffer.length > 0){
			for (var i = 0; i < drawBuffer.length; i++){
				context.setLineDash([0,0]);
				if(drawBuffer[i] != pick){
					drawBuffer[i].draw(context);
				}
			}
		}
		context.beginPath();
		context.moveTo(scalePt.x,scalePt.y);
		context.lineTo(pos.x,pos.y);
		context.strokeStyle = "rgb(0,0,0)";
		context.setLineDash([3,5]); 
		context.stroke();
		context.setLineDash([0,0]); 
		rate = pos.x/(canvas.width/2)
		pick.drawScale(rate)
		console.log(pos.x/(canvas.width/2) )
	}
	else if(rotation == 2)
	{	
		drawCall();
		context.beginPath();
		context.moveTo(tmpPt1.x,tmpPt1.y);
		context.lineTo(pos.x,pos.y);
		context.strokeStyle = "rgb(0,0,0)";
		context.setLineDash([3,5]); 
		context.stroke();

		context.beginPath();
		context.moveTo(tmpPt1.x-150,tmpPt1.y);
		context.lineTo(tmpPt1.x+150,tmpPt1.y);
		context.stroke();

		context.beginPath();
		context.moveTo(tmpPt1.x,tmpPt1.y-150);
		context.lineTo(tmpPt1.x,tmpPt1.y+150);
		context.stroke();

		context.beginPath()
		context.arc(tmpPt1.x,tmpPt1.y,150,0,Math.PI * 2);
		context.stroke()
		context.setLineDash([0,0]);

		var sin = ((pos.y-tmpPt1.y)/calcDistancia(tmpPt1,pos))
		var cos = ((pos.x-tmpPt1.x)/calcDistancia(tmpPt1,pos))
		pick.drawRotate(sin,cos,tmpPt1)
	}
	else if(move == true && pick != null){
		pick.translate(pos);
		drawCall();
		pick.highlight(context);
	}

	if(drawFree == 2){
		drawCall();
		/*
		for(var i=0;i<tmpArray.length-1;i++){
			context.beginPath();
			context.moveTo(tmpArray[i].x, tmpArray[i].y);
			context.lineTo(tmpArray[i+1].x, tmpArray[i].y);
			context.stroke();
		}
		*/
		context.beginPath();
		context.moveTo(tmpPt1.x, tmpPt1.y);
		context.lineTo(pos.x, pos.y);
		context.strokeStyle = getColor();
		context.stroke();
		drawBuffer.push(new Line(tmpPt1, new Point(pos.x, pos.y)));
		tmpArray.push(tmpPt1);
		//tmpArray.push(new Point(pos.x, pos.y));
		tmpPt1 = new Point(pos.x, pos.y);
	}

	//Rubber Banding Line
	if(drawLine == 2)
	{
		drawCall();
		context.beginPath();
		context.moveTo(tmpPt1.x,tmpPt1.y);
		context.lineTo(pos.x,pos.y);
		context.strokeStyle = getColor();
		context.stroke();
	}

	//Ruber Banding Arc
	else if(drawArc == 2)
	{
		drawCall();
		context.beginPath();
		context.moveTo(tmpPt1.x,tmpPt1.y);
		context.lineTo(pos.x,pos.y);
		context.strokeStyle = "rgb(0,0,0)";
		context.setLineDash([3,5]); 
		context.stroke();
		context.setLineDash([0,0]); 
	}
	else if(drawArc == 3)
	{
		drawCall();
		context.beginPath();
		context.strokeStyle = "rgb(0,0,0)";
		context.setLineDash([3,5]); 
		context.moveTo(tmpPt1.x,tmpPt1.y);
		context.lineTo(tmpPt2.x,tmpPt2.y);
		context.stroke();

		context.beginPath();
		context.moveTo(tmpPt1.x,tmpPt1.y);
		context.lineTo(pos.x,pos.y);
		context.stroke();

		context.setLineDash([0,0]); 
		
		context.strokeStyle = getColor();
		context.beginPath();

		if(tmpPt2.y > tmpPt1.y)
		{
			if(pos.y > tmpPt1.y)
			{
				context.arc(tmpPt1.x,tmpPt1.y,radius,Math.acos((tmpPt2.x-tmpPt1.x)/radius),Math.acos((pos.x-tmpPt1.x)/calcDistancia(tmpPt1,pos)),true);
			}
			else
			{
				context.arc(tmpPt1.x,tmpPt1.y,radius,Math.acos((tmpPt2.x-tmpPt1.x)/radius),-Math.acos((pos.x-tmpPt1.x)/calcDistancia(tmpPt1,pos)),true);	
			}
		}
		else
		{
			if(pos.y > tmpPt1.y)
			{
				context.arc(tmpPt1.x,tmpPt1.y,radius,-Math.acos((tmpPt2.x-tmpPt1.x)/radius),Math.acos((pos.x-tmpPt1.x)/calcDistancia(tmpPt1,pos)),true);
			}
			else
			{
				context.arc(tmpPt1.x,tmpPt1.y,radius,-Math.acos((tmpPt2.x-tmpPt1.x)/radius),-Math.acos((pos.x-tmpPt1.x)/calcDistancia(tmpPt1,pos)),true);	
			}
		}
		context.stroke();
	}

	//Rubber Banding Bezier
	else if (drawBezier == 2)
	{
		drawCall();
		context.beginPath();
		context.moveTo(tmpPt1.x,tmpPt1.y);
		context.lineTo(pos.x,pos.y);
		context.strokeStyle = getColor();
		context.stroke();	
	}
	else if (drawBezier == 3)
	{
		drawCall();
		context.beginPath();
		context.moveTo(tmpPt1.x,tmpPt1.y);
		context.bezierCurveTo(pos.x,pos.y,tmpPt2.x,tmpPt2.y,tmpPt2.x,tmpPt2.y);
		context.strokeStyle = getColor();
		context.stroke();

		context.beginPath();
		context.moveTo(tmpPt1.x,tmpPt1.y);
		context.lineTo(pos.x,pos.y);
		context.strokeStyle = "rgb(0,0,0)";
		context.setLineDash([3,5]); 
		context.stroke();
		context.setLineDash([0,0]); 
	}
	else if (drawBezier == 4)
	{
		drawCall();
		context.beginPath();
		context.moveTo(tmpPt1.x,tmpPt1.y);
		context.bezierCurveTo(tmpPt3.x,tmpPt3.y,pos.x,pos.y,tmpPt2.x,tmpPt2.y);
		context.strokeStyle = getColor();
		context.stroke();

		context.beginPath();
		context.moveTo(tmpPt2.x,tmpPt2.y);
		context.lineTo(pos.x,pos.y);
		context.strokeStyle = "rgb(0,0,0)";
		context.setLineDash([3,5]); 
		context.stroke();
		context.setLineDash([0,0]); 
	}

	//Draw Area
	else if(drawArea == 2)
	{
		drawCall();
		//Linha pro mouse
		context.beginPath();
		context.moveTo(tmpPt.x,tmpPt.y);
		context.lineTo(pos.x,pos.y);
		context.strokeStyle = "rgb(0,0,0)";
		context.setLineDash([3,5]); 
		context.stroke();
		context.setLineDash([0,0]); 
	}
	else if(drawArea == 3)
	{
		drawCall();
		context.strokeStyle = getColor();
		for (var i = 0; i< tmpArray.length-1;i++){
			context.beginPath();
			context.moveTo(tmpArray[i].x,tmpArray[i].y)
			context.lineTo(tmpArray[i+1].x,tmpArray[i+1].y);
			context.stroke();
		}

		//1 Linha pro mouse
		context.beginPath();
		context.moveTo(tmpPt.x,tmpPt.y);
		context.lineTo(pos.x,pos.y);
		context.strokeStyle = "rgb(0,0,0)";
		context.setLineDash([3,5]); 
		context.stroke();

		//Ultima Linha por mouse
		context.beginPath();
		context.moveTo(tmpArray[0].x,tmpArray[0].y);
		context.lineTo(pos.x,pos.y);
		context.strokeStyle = "rgb(0,0,0)";
		context.setLineDash([3,5]); 
		context.stroke();
		context.setLineDash([0,0]); 
	}

}, false);

canvas.addEventListener('mouseup', function(evt)
{
	move = false;

	if(rotation == 1){
		tmpPt1 = new Point(pos.x,pos.y)
		rotation = 2
	}
	
	if(drawFree == 2){
		drawCall();
		
		context.beginPath();
		context.moveTo(pos.x, pos.y);
		context.lineTo(tmpArray[0].x, tmpArray[0].y);
		context.strokeStyle = getColor();
		context.stroke();
		drawBuffer.push(new Line(tmpBegin, new Point(pos.x, pos.y)));

		tmpArray.push(new Point(pos.x, pos.y));
		
		for(var i=0;i<freestart;i++){
			tmpDrawBuffer.push(drawBuffer[i]);
		}
		drawBuffer = [];
		drawBuffer = tmpDrawBuffer;
		drawBuffer.push(new Area(tmpArray, cont));
		cont++;
		setAllFalse();
		tmpPt1 = null;
		var modal = document.getElementById("modal");
		modal.style.display = "block";
		//inicializar valores do modal
		textarea.value = "";
		var tlesao = document.getElementById("tlesao");
		var numdente = document.getElementById("numdente");
		tlesao.selectedIndex = 0;
		numdente.selectedIndex = 0;


		drawFree = 1;
		drawCall();
	}
	
	//Draw Point
	if(drawPoint == true)
	{
		drawBuffer.push(new Point(pos.x,pos.y));
		drawCall();
	}

	//Draw Line
	else if(drawLine == 1)
	{
		tmpPt1 = new Point(pos.x,pos.y);
		drawLine = 2;
	}
	else if(drawLine == 2)
	{
		drawBuffer.push(new Line (tmpPt1,new Point(pos.x,pos.y)));
		drawLine = 1;
		drawCall();
	}

	//Draw Arc
	else if(drawArc == 1)
	{
		
		tmpPt1 = new Point(pos.x,pos.y);
		drawArc = 2;
	}
	else if(drawArc == 2)
	{	
		tmpPt2 = new Point(pos.x,pos.y)
		radius = calcDistancia(tmpPt1,tmpPt2);
		drawArc = 3;
	}
	else if(drawArc == 3)
	{
		if(tmpPt2.y > tmpPt1.y)
		{
			if(pos.y > tmpPt1.y)
			{
				drawBuffer.push(new Arc (tmpPt1,calcDistancia(tmpPt1,tmpPt2),Math.acos((tmpPt2.x-tmpPt1.x)/radius),Math.acos((pos.x-tmpPt1.x)/calcDistancia(tmpPt1,pos))));
			}
			else
			{
				drawBuffer.push(new Arc (tmpPt1,calcDistancia(tmpPt1,tmpPt2),Math.acos((tmpPt2.x-tmpPt1.x)/radius),-Math.acos((pos.x-tmpPt1.x)/calcDistancia(tmpPt1,pos))));
			}
		}
		else
		{
			if(pos.y > tmpPt1.y)
			{
				drawBuffer.push(new Arc (tmpPt1,calcDistancia(tmpPt1,tmpPt2),-Math.acos((tmpPt2.x-tmpPt1.x)/radius),Math.acos((pos.x-tmpPt1.x)/calcDistancia(tmpPt1,pos))));
			}
			else
			{
				drawBuffer.push(new Arc (tmpPt1,calcDistancia(tmpPt1,tmpPt2),-Math.acos((tmpPt2.x-tmpPt1.x)/radius),-Math.acos((pos.x-tmpPt1.x)/calcDistancia(tmpPt1,pos))));
			}
		}
		drawArc = 0;
		drawCall();
	}

	//Draw Bezier
	else if(drawBezier == 1){
		tmpPt1 = new Point(pos.x,pos.y)
		drawBezier = 2;
	}else if(drawBezier == 2){
		tmpPt2 = new Point(pos.x,pos.y)
		drawBezier = 3;
	}else if(drawBezier == 3){
		tmpPt3 = new Point(pos.x,pos.y)
		drawBezier = 4;
	}
	else if(drawBezier == 4){
		tmpPt4 = new Point(pos.x,pos.y)
		drawBuffer.push (new Bezier(tmpPt1,tmpPt2,tmpPt3,tmpPt4));
		drawBezier = 0;
		drawCall();
	}

	//Draw Area
	else if(drawArea == 1){
		tmpPt = new Point(pos.x,pos.y);
		tmpArray = [];
		tmpArray.push(tmpPt);
		drawArea = 2;
	}else if(drawArea == 2){
		tmpPt = new Point(pos.x,pos.y);
		tmpArray.push(tmpPt);
		drawArea = 3;
	}else if(drawArea == 3){
		tmpPt = new Point(pos.x,pos.y);
		tmpArray.push(tmpPt);
	}else{
		if(scale == 0 && rotation == 0){
			pick = null;
			if(drawFree!=1){
				for(var i = drawBuffer.length-1;i >= 0 ;i--){		
					if(drawBuffer[i].pick(pos) == true){	
						pick = drawBuffer[i];
						break;
					}
				}

				if(pick != null){
					drawCall()
					//AQUI A FUNCAO NOVA
					//savePatch(pick);
					pick.highlight(context);
				}else {
					drawCall();
				}
			}
		}
	}
	//checa se terminou de mover e mostra o modal
	if(moveu == true){
		cleanData(oquemoveu, idquemoveu);
		//chama a função para atualizar o xml
		updatePoints(oquemoveu, idquemoveu);	
		var modal = document.getElementById("modal");
		modal.style.display = "block";
	}

}, false);	

canvas.addEventListener('mousedown', function(evt)
{
	if(rotation == 2 && pick != null){
		move = false
		var sin = ((pos.y-tmpPt1.y)/calcDistancia(tmpPt1,pos))
		var cos = ((pos.x-tmpPt1.x)/calcDistancia(tmpPt1,pos))
		pick.rotate(sin,cos,tmpPt1)
		rotation = 0
	}
	else if(scale == 1){
		move = false;
		scalePt = new Point(pos.x,pos.y)
		scale = 2;
	}
	
	else if(scale == 2 && pick != null)
	{
		scale = 0;
		console.log("rate",rate)
		pick.scale(rate)
		console.log(pick)
	}


	else if(pick != null && scale == 0 && rotation == 0){
		move = true;
	}

	else if(drawFree == 1){
		freestart = drawBuffer.length;
		tmpPt1 = new Point(pos.x, pos.y);
		tmpBegin = [];
		tmpBegin = new Point(tmpPt1.x, tmpPt1.y);
		tmpArray = [];
		
		tmpDrawBuffer = [];
		drawFree = 2;
	}
}, false);