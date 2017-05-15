calcDistancia = function(pt1,pt2){
	return Math.sqrt(Math.pow(pt1.x - pt2.x,2)+Math.pow(pt1.y - pt2.y,2));
}

calcArcAngle = function(pos,canvas,angle){
	if(pos.x < 100){
		return angle;
	}
	else{
		return map(pos.x,100,canvas.width-100,angle,(Math.PI*2)-angle);
	}
}

map = function(x,in_min,in_max,out_min,out_max){
	return (x - in_min)*(out_max - out_min)/(in_max - in_min)+out_min;
}

Lerp = function(pt1,pt2,t)
{
	var newPt = new Point(pt1.x+(t*(pt2.x-pt1.x)),pt1.y+(t*(pt2.y-pt1.y)));
	return newPt;
}