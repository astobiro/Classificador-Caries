move = function (pos,pt){
	var input1[[1,0,pos.x],[0,1,pos.y],[0,0,1]]
	var input2 =[pt.x,pt.y,0]
	var output[]
	var sum = 0
	for (var i = 0 i < 2, i++){
		for (var j = 0; j < 2 ; j++){
			sum += input1[i][j] * input2[j]

		}
		output.push(sum)
	}
	console.log([output[0]/output[2],output[0]/output[2]])
}