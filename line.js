function Line (startPt,endPt){
	this.startPt = startPt;
	this.endPt = endPt;
	this.color = getColor();

	this.ID = "Line";
}

Line.prototype.draw = function(context){
	context.beginPath();
	context.moveTo(this.startPt.x,this.startPt.y);
	context.lineTo(this.endPt.x,this.endPt.y);
	context.strokeStyle = this.color;
	context.stroke();
}

Line.prototype.pick = function(pos){
	var startCode = this.startPt.pickCode(pos);
	var endCode = this.endPt.pickCode(pos);
	if(startCode[0] == false && startCode[1] == false && startCode[2] == false && startCode[3] == false){
		return true;
	}
	else if(endCode[0] == false && endCode[1] == false && endCode[2] == false && endCode[3] == false){
		return true;
	}
	else{
		var tmpPt = new Point(this.startPt.x,this.startPt.y)
		if(startCode[0])
		{
			tmpPt.y += ((pos.x-tol) - this.startPt.x)*(this.endPt.y - this.startPt.y)/(this.endPt.x - this.startPt.x)
			tmpPt.x = (pos.x-tol);
		}
		else if(startCode[1])
		{
			tmpPt.y += ((pos.x+tol) - this.startPt.x)*(this.endPt.y - this.startPt.y)/(this.endPt.x - this.startPt.x)
			tmpPt.x = (pos.x+tol);
		}
		else if(startCode[2])
		{
			tmpPt.x += ((pos.y-tol) - this.startPt.y)*(this.endPt.x - this.startPt.x)/(this.endPt.y - this.startPt.y)
			tmpPt.y = (pos.y-tol);
		}
		else if(startCode[3])
		{
			tmpPt.x += ((pos.y+tol) - this.startPt.y)*(this.endPt.x - this.startPt.x)/(this.endPt.y - this.startPt.y)
			tmpPt.y = (pos.y+tol);
		}
		startCode = tmpPt.pickCode(pos);
		if(startCode[0] == false && startCode[1] == false && startCode[2] == false && startCode[3] == false)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	return false;
}

Line.prototype.highlight = function(context){
	var startX = this.startPt.x;
	var endX = this.endPt.x;
	var startY = this.startPt.y;
	var endY = this.endPt.y;
	if(this.endPt.x < startX){
		startX = this.endPt.x;
		endX = this.startPt.x;
	}
	if(this.endPt.y < startY){
		startY = this.endPt.y;
		endY = this.startPt.y;
	}

	context.rect(startX,startY,endX-startX,endY-startY);
	context.strokeStyle = "rgb(0,0,0)"
	context.setLineDash([1,1]); 
	context.stroke();
	context.setLineDash([0,0]); 
}


Line.prototype.translate = function(pos){
	
	var distX = this.startPt.x 
	var distY = this.startPt.y
	this.startPt.translate(pos);
	this.endPt.x += this.startPt.x - distX
	this.endPt.y += this.startPt.y - distY
	console.log("moveu a linha");
}

Line.prototype.scale = function(rate)
{
	this.endPt.x *= rate
	this.endPt.y *= rate
	drawCall();
}

Line.prototype.scale = function(rate){
	this.startPt.x *= rate
	this.startPt.y *= rate
	this.endPt.x *= rate;
	this.endPt.y *= rate;
}

Line.prototype.drawScale = function(rate){
	context.beginPath();
	context.moveTo(this.startPt.x*rate,this.startPt.y*rate);
	context.lineTo(this.endPt.x*rate,this.endPt.y*rate);
	context.strokeStyle = "rgb(0,0,0)";
	context.strokeStyle = this.color;
	context.stroke();
}

Line.prototype.rotate = function(sin,cos,pt){
	var ptList = [this.startPt,this.endPt]
	var CoM = pt;
	for (var i = 0 ; i < ptList.length;i++){
		ptList[i].x += CoM.x*-1
		ptList[i].y += CoM.y*-1
		ptList[i].x = ((cos*ptList[i].x) - (sin*ptList[i].y));
		ptList[i].y = ((sin*ptList[i].x) + (cos*ptList[i].y));
		ptList[i].x += CoM.x
		ptList[i].y += CoM.y
	}
	
}

Line.prototype.drawRotate = function(sin,cos,pt){
	context.beginPath();
	var ptList = [new Point(this.startPt.x , this.startPt.y),new Point(this.endPt.x , this.endPt.y)]
	var CoM = pt;
	for (var i = 0 ; i < ptList.length;i++){
		ptList[i].x += CoM.x*-1
		ptList[i].y += CoM.y*-1
		ptList[i].x = ((cos*ptList[i].x) - (sin*ptList[i].y));
		ptList[i].y = ((sin*ptList[i].x) + (cos*ptList[i].y));
		ptList[i].x += CoM.x
		ptList[i].y += CoM.y
	}
	context.moveTo(ptList[0].x,ptList[0].y);
	context.lineTo(ptList[1].x,ptList[1].y);
	context.strokeStyle = "rgb(0,0,0)";
	context.strokeStyle = this.color;
	context.stroke();
}

Line.prototype.mirrorX = function (){
	this.startPt.x = 1

}

Line.prototype.getCoM = function(){
	return new Point((this.endPt.x + this.startPt.x)/2,  (this.endPt.y + this.startPt.y)/2)
}