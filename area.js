function Area (pointArray, id){
	this.pointArray = pointArray;
	this.Color = getColor();
	this.ID = "Area"
	this.id = id;

}

Area.prototype.draw = function(context){
	context.strokeStyle = this.Color;
	context.beginPath();
	context.moveTo(this.pointArray[0].x,this.pointArray[0].y);
	for(var i = 0;i<this.pointArray.length-1;i++){
		//context.moveTo(this.pointArray[i].x,this.pointArray[i].y);
		context.lineTo(this.pointArray[i+1].x,this.pointArray[i+1].y);
		context.stroke()
	}
	//context.moveTo(this.pointArray[this.pointArray.length-1].x,this.pointArray[this.pointArray.length-1].y);
	context.lineTo(this.pointArray[0].x,this.pointArray[0].y)
	context.stroke();
	context.closePath();
}

Area.prototype.pick = function(pos){
	var cout = 0;
	for (var i = 0;i<this.pointArray.length;i++)
	{
		if(this.pointArray[i].pick(pos) == true)
		{
			return true;
		}
	}
	cout = 0;
	for(var i = 0; i<this.pointArray.length-1; i++){
		var x0
		var x1
		var y0
		var y1
		if(this.pointArray[i].y < this.pointArray[i+1].y){
			x0 = this.pointArray[i].x
			x1 = this.pointArray[i+1].x
			y0 = this.pointArray[i].y
			y1 = this.pointArray[i+1].y
		}
		else{
			x0 = this.pointArray[i+1].x
			x1 = this.pointArray[i].x
			y0 = this.pointArray[i+1].y
			y1 = this.pointArray[i].y
		}

		if(pos.y > y0 && pos.y < y1 && (pos.x > x0 || pos.x > x1)){
			if((pos.x < x0 && pos.x < x1)){
				cout += 1;
			}
			else{
				var dx = x0 - x1;
				var xc = x0;
				if(dx != 0){
					xc += ( pos.y - y0 ) * dx / ( y0 - y1 );
				}
				if(pos.x > xc){
					cout += 1
				}
			}
		}
	}

	if(this.pointArray[this.pointArray.length-1].y < this.pointArray[0].y){
		x0 = this.pointArray[this.pointArray.length-1].x
		x1 = this.pointArray[0].x
		y0 = this.pointArray[this.pointArray.length-1].y
		y1 = this.pointArray[0].y
	}else{
		x0 = this.pointArray[0].x
		x1 = this.pointArray[this.pointArray.length-1].x
		y0 = this.pointArray[0].y
		y1 = this.pointArray[this.pointArray.length-1].y
	}

	if(pos.y > y0 && pos.y < y1 && (pos.x > x0 || pos.x > x1)){
		if((pos.x < x0 && pos.x < x1)){
			cout += 1;
		}else{
			var dx = x0 - x1;
			var xc = x0;
			if(dx != 0){
				xc += ( pos.y - y0 ) * dx / ( y0 - y1 );
			}
			if(pos.x > xc){
				cout += 1
			}
		}
	}
	if(cout%2 == 1){
		return true;
	}
	else{
		return false;
	}
}


Area.prototype.highlight = function(context){
	var minX = canvas.width;
	var maxX = 0;
	var minY = canvas.height;
	var maxY = 0;
	for (var i = 0; i< this.pointArray.length;i++){
		if(this.pointArray[i].x < minX){
			minX = this.pointArray[i].x;
		}
		if(this.pointArray[i].x > maxX){
			maxX = this.pointArray[i].x;
		}
		if(this.pointArray[i].y < minY){
			minY = this.pointArray[i].y;
		}
		if(this.pointArray[i].y > maxY){
			maxY = this.pointArray[i].y;
		}
	}
	context.rect(minX,minY,maxX - minX , maxY - minY);
	context.strokeStyle = "rgb(0,0,0)"
	context.setLineDash([1,3]); 
	context.stroke();
	context.setLineDash([0,0]);
}

Area.prototype.translate = function(pos)
{	
	//ver se forma moveu e pega o vetor dos pontos que moveram e o id da forma
	moveu = true;
	oquemoveu = this.pointArray;
	idquemoveu = this.id;
	var distX = this.pointArray[0].x
	var distY = this.pointArray[0].y
	this.pointArray[0].translate(pos);
	for(var i = 1; i < this.pointArray.length; i++){
		this.pointArray[i].x += this.pointArray[0].x - distX
		this.pointArray[i].y += this.pointArray[0].y - distY
	}
	//tirei por performance, atualiza quando dá o mouseup --> mouseFunction.js linha 452
	//updatePoints(this.pointArray, this.id);
}

Area.prototype.scale = function(rate){
	for(var i = 0; i < this.pointArray.length;i++){
		this.pointArray[i].x *= rate
		this.pointArray[i].y *= rate
	}

	drawCall()
}

Area.prototype.drawScale = function(rate){
	context.strokeStyle = this.Color;
	for(var i = 0;i<this.pointArray.length-1;i++){
		context.beginPath();
		context.moveTo(this.pointArray[i].x*rate,this.pointArray[i].y*rate);
		context.lineTo(this.pointArray[i+1].x*rate,this.pointArray[i+1].y*rate);
		context.stroke()
	}
	context.beginPath();
	context.moveTo(this.pointArray[this.pointArray.length-1].x*rate,this.pointArray[this.pointArray.length-1].y*rate);
	context.lineTo(this.pointArray[0].x*rate,this.pointArray[0].y*rate)
	context.stroke();
}


Area.prototype.rotate = function(sin,cos,pt){
	var CoM = pt;
	for (var i = 0 ; i < this.pointArray.length;i++){
		this.pointArray[i].x += CoM.x*-1
		this.pointArray[i].y += CoM.y*-1
		this.pointArray[i].x = ((cos*this.pointArray[i].x) - (sin*this.pointArray[i].y));
		this.pointArray[i].y = ((sin*this.pointArray[i].x) + (cos*this.pointArray[i].y));
		this.pointArray[i].x += CoM.x
		this.pointArray[i].y += CoM.y
	}
	
}

Area.prototype.drawRotate = function(sin,cos,pt){
	context.strokeStyle = this.Color;
	var ptList = []
	var CoM = pt
	for(var i = 0 ; i < this.pointArray.length; i++){
		ptList.push(new Point (this.pointArray[i].x,this.pointArray[i].y))
	}

	for(var i = 0;i<this.pointArray.length;i++){
		ptList[i].x += CoM.x*-1
		ptList[i].y += CoM.y*-1
		ptList[i].x = ((cos*ptList[i].x) - (sin*ptList[i].y));
		ptList[i].y = ((sin*ptList[i].x) + (cos*ptList[i].y));
		ptList[i].x += CoM.x
		ptList[i].y += CoM.y
	}

	for (var i = 0 ; i < ptList.length-1;i++){
		context.beginPath();
		context.moveTo(ptList[i].x,ptList[i].y);
		context.lineTo(ptList[i+1].x,ptList[i+1].y);
		context.stroke();
	}
	context.beginPath();
	context.moveTo(ptList[ptList.length-1].x,ptList[ptList.length-1].y);
	context.lineTo(ptList[0].x,ptList[0].y);
	context.stroke();
}