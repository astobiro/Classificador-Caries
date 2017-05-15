var fs;
var curform = 0;
var xml = document.createElement("root");
var rxml
var dentes = document.createElement("Dentes");
var caminho = document.createElement("Caminho");
var dente = [];
var attr  = [];
var tmpcur = 0;
var img;
var flag = false;
var cnt = 0;
var currentfile;
var curfile = 0;
var zip = new JSZip();
var cur;

dentes.appendChild(caminho);
for(var i=0;i<32;i++){
	attr[i] = document.createAttribute("num");
	dente[i] = document.createElement("Dente");
}

var val = 18
for(var i=0;i<8;i++){
	attr[i].value = val;
	dente[i].setAttributeNode(attr[i]);
	val--;
}
val = 21;
for(var i=8;i<16;i++){
	attr[i].value = val;
	dente[i].setAttributeNode(attr[i]);
	val++;
}
val = 48;
for(var i=16;i<24;i++){
	attr[i].value = val;
	dente[i].setAttributeNode(attr[i]);
	val--;
}
val = 31;
for(var i=24;i<32;i++){
	attr[i].value = val;
	dente[i].setAttributeNode(attr[i]);
	val++;
}

for(var i=0;i<32;i++){
	dentes.appendChild(dente[i]);
}
xml.appendChild(dentes);

var textarea = document.getElementById("txt");
textarea.value = "";

//reativar botao quado abrir novo arquivo
var imginput = document.getElementById("fileinput");
var xmlinput = document.getElementById("readinput");

imginput.onchange = function(e){
	loadfile();
	var imgname = document.getElementById("imgname");
	imgname.innerHTML = fileName('fileinput') + ".jpg";
}

xmlinput.onchange = function(e){
	readTextFile();
	var xmlname = document.getElementById("xmlname");
	xmlname.innerHTML = fileName('readinput') + ".xml"
}

handleClick = function(){
	imginput.click();
}

handleLoadClick = function(){
	xmlinput.click();
}

resetFileOpen = function(){
	//var btn = document.getElementById("open");
	
	drawBuffer = [];
	curform = 0;
	cont = 0;
	setAllFalse();
	for(var i=1;i<33;i++){
		for(var j=0;j<dentes.childNodes[i].childNodes.length;j++){
			dentes.childNodes[i].removeChild(dentes.childNodes[i].childNodes[j]);
		}
	}
	//btn.disabled = false;
}
//carregar imagem
loadfile = function(){
	var file, input, fr;
	resetFileOpen();
	input = document.getElementById("fileinput");
	file = input.files[0];

	if(file!=null){
		//limpar tela e buffer após o carregamento da imagem
		drawBuffer = [];
		context.clearRect(0,0, 1000, 500);
		fr = new FileReader();
		fr.onload = function createImage(){
			img = new Image();
			img.onload = function imgLoaded() {
				//setar largura e altura do canvas para largura e altura da imagem
				canvas.width = img.width;
				canvas.height = img.height;
				var container = document.getElementById("canvas_container");
				var bcontainer = document.getElementById("container");
				var topcontainer = document.getElementById("barra_lateral");
				var topcontainer2 = document.getElementById("barra_superior");
				container.style.width = img.width + "px";
				if(img.width > 875){
					bcontainer.style.width = img.width + 25 + "px";
					topcontainer.style.width = bcontainer.style.width;
					topcontainer2.style.width = bcontainer.style.width;
				}
				container.style.height = img.height + "px";
				if(img.height > 500){
					bcontainer.style.height = img.height + 210 + "px";
				}
				context.drawImage(img, 0,0);
			}
			img.src = this.result;
			if(caminho.firstChild!=null){
				caminho.removeChild(caminho.firstChild);
			}
			caminho.appendChild(document.createTextNode(img.src));
		}
		fr.readAsDataURL(file);
		//var btn = document.getElementById("open");
		//btn.disabled = true;
	}/*else{
		var btn = document.getElementById("open");
		btn.disabled = true;
	}*/
}

//Modal vars
var modal = document.getElementById("modal");
var modalbtn = document.getElementById("save");
var span = document.getElementsByClassName("close")[0];
//fechar modal
span.onclick = function(){
	modal.style.display = "none";
	if(drawFree == 1){
		drawBuffer.pop();
		drawCall();
	}
	modalbtn.disabled = false;
}
//clicar fora do modal
window.onclick = function(event) {
	if(event.target == modal){
		modal.style.display = "none";
		if(drawFree == 1){
			drawBuffer.pop();
			drawCall();
		}
		modalbtn.disabled = false;
	}
}
//pegar dente selecionado
filterDente = function(){
	var numdente = document.getElementById("numdente");
	for(var i=0;i<32;i++){
		if(numdente.options[numdente.selectedIndex].text == dente[i].getAttribute("num")){
			return dente[i];
		}
	}
}
//criar filhos do dente atual
createXML = function (){
	var odente = filterDente();
	var pontos = document.createElement("Pontos");
	var id = document.createAttribute("id");
	id.value = drawBuffer[curform].id;
	pontos.setAttributeNode(id);
	var attr = document.createAttribute("num");
	var tlesao = document.getElementById("tlesao");

	//tipos de carie
	var classlesao = document.createElement("Lesao");
	if(tlesao.selectedIndex == 0){
		var esm = document.createAttribute("tipo");
		esm.value = "1";
		classlesao.setAttributeNode(esm);
	}else if(tlesao.selectedIndex == 1){
		var dent = document.createAttribute("tipo");
		dent.value = "2";
		classlesao.setAttributeNode(dent);
	}else if(tlesao.selectedIndex == 2){
		var pulp = document.createAttribute("tipo");
		pulp.value = "3";
		classlesao.setAttributeNode(pulp);
	}else if(tlesao.selectedIndex == 3){
		var reci = document.createAttribute("tipo");
		reci.value = "4";
		classlesao.setAttributeNode(reci);
	}

	var texta = document.getElementById("txt");
	var txt = document.createElement("obs");
	txt.appendChild(document.createTextNode(texta.value));
	
	//Pegar os pontos do desenho
	for(var i=0;i<drawBuffer[curform].pointArray.length;i++){
		var ponto = document.createElement("Ponto");
		var pontoattr = document.createAttribute("num");
		var px = document.createElement("X");
		var py = document.createElement("Y");
		px.appendChild(document.createTextNode(drawBuffer[curform].pointArray[i].x));
		py.appendChild(document.createTextNode(drawBuffer[curform].pointArray[i].y));
		ponto.appendChild(px);
		ponto.appendChild(py);
		pontoattr.value = parseInt(i);
		ponto.setAttributeNode(pontoattr);
		pontos.appendChild(ponto);
	}
	curform++;
	
    //classlesao.appendChild( caminho );
    classlesao.appendChild( pontos );
    classlesao.appendChild(txt);
    odente.appendChild( classlesao );
    //retorna o curform a posicao original e seta moveu para falso (após ter salvo já no xml)
    if(moveu == true){
    	curform = tmpcur;
    	moveu = false;
    }
    loadData(xml.firstChild)
}
//criar o xml
saveToXML = function(){
	var modal = document.getElementById("modal");
	modal.style.display = "none";
	createXML();
}
//salvar o xml para um arquivo com o nome da imagem
saveAll = function(){
	var blob = new Blob([xml.innerHTML], {type: "text/xml;charset=utf-8"});
	var savename;
	if(fileName('fileinput') != undefined){
		savename = fileName('fileinput') + ".xml";
	}else{
		savename = fileName('readinput') + ".xml";
	}
	
	saveAs(blob, savename);
}

saveToJPG = function(){
	var savename;
	if(fileName('fileinput') != undefined){
		savename = fileName('fileinput') + "_edit" + ".jpg";
	}else{
		savename = fileName('readinput') + "_edit" + ".jpg";
	}
	if(savename != undefined){
		canvas.toBlob(function(blob) {
	   		saveAs(blob, savename);
		});
	}
}
//ler xml para carregar dados
readTextFile = function(){
	var file, input, fr;

	input = document.getElementById("readinput");
	file = input.files[0];

	if(file!=null){
		fr = new FileReader();
		fr.onload = function createXML(){
			var text = this.result;
			text = parseXml(text);
			rxml = [];
			rxml = text.childNodes[0];
			loadXML(rxml);
		}
		fr.readAsText(file);
	}
}

var parseXml;

if (window.DOMParser) {
	parseXml = function(xmlStr) {
    	return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
	};
} else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
	parseXml = function(xmlStr) {
	    var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
	    xmlDoc.async = "false";
	    xmlDoc.loadXML(xmlStr);
	    return xmlDoc;
	};
} else {
	parseXml = function() { return null; }
}
//carregar dados do xml para desenhar
loadXML = function(newxml){
	var pointsArray = [];
	
	setAllFalse();
	for(var i=1;i<33;i++){
		for(var j=0;j<dentes.childNodes[i].childNodes.length;j++){
			dentes.childNodes[i].removeChild(dentes.childNodes[i].childNodes[j]);
		}
	}

	xml.removeChild(xml.firstChild);
	xml.appendChild(newxml);
	for(var i=0;i<32;i++){
		dente[i] = newxml.childNodes[i];
	}
	dentes = newxml;

	drawBuffer = [];
	curform = 0;
	cont = 0;

	//carregar imagem
	img = new Image();
	//desenhar imagem e pontos quando ela estiver carregada
	img.onload = function(){
		loadImgContainer();
		loadPoints(newxml);
	}
	img.src = newxml.firstChild.innerHTML;
	//img.setAttribute("src", newxml.firstChild.innerHTML);
}

loadImgContainer = function(){
	context.clearRect(0,0,1000,500);
	//setar largura e altura do canvas para largura e altura da imagem
	canvas.width = img.width;
	canvas.height = img.height;
	var container = document.getElementById("canvas_container");
	var bcontainer = document.getElementById("container");
	var topcontainer = document.getElementById("barra_lateral");
	var topcontainer2 = document.getElementById("barra_superior");
	
	container.style.width = img.width + "px";
	if(img.width > 875){
		bcontainer.style.width = img.width + 25 + "px";
		topcontainer.style.width = bcontainer.style.width;
		topcontainer2.style.width = bcontainer.style.width;
	}
	container.style.height = img.height + "px";
	if(img.height > 500){
		bcontainer.style.height = img.height + 210 + "px";
	}
	context.drawImage(img, 0, 0);
}

loadPoints = function(newxml){
	for(var i=1;i<newxml.childNodes.length;i++){
		if(newxml.childNodes[i].childNodes[0] != null){
			for(var j=0;j<newxml.childNodes[i].childNodes.length;j++){
				
				//carregar pontos
				var points = [];
				points = newxml.childNodes[i].childNodes[j].getElementsByTagName("pontos")[0];
				var num = parseInt(points.getAttribute("id"));
				var p = [];
				var prev = [];
				pointsArray = [];
				//desenhar pontos
				prev = new Point(parseInt(points.childNodes[0].childNodes[0].innerHTML), parseInt(points.childNodes[0].childNodes[1].innerHTML));
				context.beginPath()
				context.moveTo(prev.x, prev.y)
				for(var k=1;k<points.childNodes.length-1;k++){
					prev = new Point(parseInt(points.childNodes[k].childNodes[0].innerHTML), parseInt(points.childNodes[k].childNodes[1].innerHTML));
					p = new Point(parseInt(points.childNodes[k+1].childNodes[0].innerHTML), parseInt(points.childNodes[k+1].childNodes[1].innerHTML));
					//context.beginPath();
					//context.moveTo(prev.x, prev.y);
					context.lineTo(p.x, p.y);
					//adiciona cada ponto no vetor
					pointsArray.push(new Point(prev.x, prev.y));
				}
				//context.moveTo(p.x, p.y);
				context.lineTo(pointsArray[0].x, pointsArray[0].y);
				context.stroke()
				context.closePath();
				pointsArray.push(new Point(p.x, p.y));
				//adiciona vetor no vetor de desenho
				drawBuffer.push(new Area(pointsArray, num));
				cont = num;
				cont++;
				curform = cont
				curform++;
				drawCall();
			}
		}
	}
	loadData(newxml)
}

//atualizar xml com os pontos modificados
updatePoints = function(pointArray, id){
	for(var i=1;i<33;i++){
		if(dentes.childNodes[i].firstChild != null){
			if(dentes.childNodes[i].firstChild.childNodes[0] != null){

				//dentes.childNodes[i].firstChild.removeChild(dentes.childNodes[i].firstChild.childNodes[1]);
				if(id == parseInt(dentes.childNodes[i].firstChild.firstChild.getAttribute("id"))){
					for(var j=0;j<pointArray.length;j++){
						//dentes.childNodes[i].firstChild.removeChild(dentes.childNodes[i].firstChild.childNodes[1]);
						npontos = dentes.childNodes[i].firstChild.childNodes[0];
						for(var k=0;k<pointArray.length;k++){
							nponto = npontos.childNodes[k];
							npontoattr = nponto.getAttribute("num");
							npx = nponto.childNodes[0];
							npy = nponto.childNodes[1];
							npx.innerHTML = pointArray[k].x;
							npy.innerHTML = pointArray[k].y;
						}	
					}
				}
			}
		}
	}
	loadData(xml.firstChild)
}
//remover filhos do dente quando houver mudança
cleanData = function(pointArray, id){
	for(var i=1;i<33;i++){
		if(dentes.childNodes[i].firstChild != null){
			for(var j=0;j<dentes.childNodes[i].childNodes.length;j++){
				if(id == parseInt(dentes.childNodes[i].childNodes[j].firstChild.getAttribute("id"))){
					//colocar dados da forma atual no modal
					var ndente = document.getElementById("numdente");
					var tlesao = document.getElementById("tlesao");
					var texta = document.getElementById("txt");
					ndente.selectedIndex = i-1;
					tlesao.selectedIndex = dentes.childNodes[i].childNodes[j].getAttribute("tipo")-1;
					texta.value = dentes.childNodes[i].childNodes[j].childNodes[1].innerHTML;

					dentes.childNodes[i].removeChild(dentes.childNodes[i].childNodes[j]);
					tmpcur = curform;
					curform = id;
				}
			}
		}
	}
}
//pegar nome do arquivo sem a extensão
fileName = function(input){
	var fullPath = document.getElementById(input).value;
	if (fullPath) {
	    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
	    var filename = fullPath.substring(startIndex);
	    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
	        filename = filename.substring(1, filename.lastIndexOf('.'));
	    }
	   	return filename;
	}
}

removeFromXML = function(id){
	for(i=1;i<33;i++){
		if(dentes.childNodes[i].firstChild!=null){
			for(var j=0;j<dentes.childNodes[i].childNodes.length;j++){
				if(id == parseInt(dentes.childNodes[i].childNodes[j].firstChild.getAttribute("id"))){
					dentes.childNodes[i].removeChild(dentes.childNodes[i].childNodes[j]);
				}
			}
		}
	}
}

showData = function(pointArray, id){
	for(var i=1;i<33;i++){
		if(dentes.childNodes[i].firstChild!=null){
			for(var j=0;j<dentes.childNodes[i].childNodes.length;j++){
				if(id == parseInt(dentes.childNodes[i].childNodes[j].firstChild.getAttribute("id"))){
					//colocar dados da forma atual no modal
					var ndente = document.getElementById("numdente");
					var tlesao = document.getElementById("tlesao")
					ndente.selectedIndex = i-1;
					tlesao.selectedIndex = dentes.childNodes[i].childNodes[j].getAttribute("tipo")-1;
					var modal = document.getElementById("modal");
					modal.style.display = "block";
					modalbtn.disabled = true;
				}
			}
		}
	}
}

loadData = function(xml){
	var div = document.getElementById("dadosdentes")
	var innerdiv = []
	for(var i=1;i<33;i++){
		if(dentes.childNodes[i].firstChild!=null){
			for(var j=0;j<dentes.childNodes[i].childNodes.length;j++){
				var dentenum = parseInt(dentes.childNodes[i].getAttribute("num"))
				var tipo = parseInt(dentes.childNodes[i].childNodes[j].getAttribute("tipo"))
				var tipol = ""
				if(tipo == 1){
					tipol = "Lesâo cariosa em esmalte"
				}else if(tipo == 2){
					tipol = "Lesâo cariosa em dentina"
				}else if(tipo == 3){
					tipol = "Lesão cariosa pulpar"
				}else{
					tipol = "Lesão cariosa recidivante"
				}
				var obsl = dentes.childNodes[i].childNodes[j].childNodes[1].innerHTML
				innerdiv.push(`
				<div style="margin-top: 10px"><label id="numdentel">Número do dente: ` + dentenum + `</label></div>
				<div><label id="tlesaol">Tipo de lesão: `+ tipol + `</label></div>
				<div><label id="obsl">Observações: ` + obsl + "</label></div>")
			}
		}
	}
	div.innerHTML = ""
	for(var i=0;i<innerdiv.length;i++){
		if(innerdiv[i]!=undefined){
			div.innerHTML += innerdiv[i]
		}
	}
}

savePatches = function(forma, filename){
	for(var i=0;i<forma.length;i++){
		var minX = canvas.width;
		var maxX = 0;
		var minY = canvas.height;
		var maxY = 0;
		for (var j = 0; j< forma[i].pointArray.length;j++){
			if(forma[i].pointArray[j].x < minX){
				minX = forma[i].pointArray[j].x;
			}
			if(forma[i].pointArray[j].x > maxX){
				maxX = forma[i].pointArray[j].x;
			}
			if(forma[i].pointArray[j].y < minY){
				minY = forma[i].pointArray[j].y;
			}
			if(forma[i].pointArray[j].y > maxY){
				maxY = forma[i].pointArray[j].y;
			}
		}
		var yeoldcanvas = canvas
		console.log(yeoldcanvas)
		var theNewCanvas = document.createElement('canvas');
		theNewCanvas.width = maxX-minX;
		theNewCanvas.height = maxY-minY;
		var newContext = theNewCanvas.getContext('2d');
		newContext.drawImage(canvas, minX, minY, maxX - minX, maxY - minY, 0, 0, maxX - minX, maxY - minY)
		var savename;
		
		filename = filename.substring(0, filename.lastIndexOf('.'));
		savename = filename + "_patch_" + i + ".jpg";

		if(savename != undefined){
			theNewCanvas.toBlob(function(blob) {
		   		zip.file(savename,blob, {base64: true});
			});
		}
	}
}

patchSaver = function() {
	var file, input, fr;
	
	input = document.getElementById("readinput");
	
	var file = input.files[curfile];
	if(file == null){
		console.log("Final dos arquivos");
	}else if(file!=null){
		var fr = new FileReader();
		currentfile = file.name
		fr.name = file.name;
		fr.onload = function createXMLu(){
			var filename = this.name
			var text = []
			var text = this.result;

			var parseXml;

			if (window.DOMParser) {
				parseXml = function(xmlStr) {
			    	return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
				};
			} else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
				parseXml = function(xmlStr) {
				    var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
				    xmlDoc.async = "false";
				    xmlDoc.loadXML(xmlStr);
				    return xmlDoc;
				};
			} else {
				parseXml = function() { return null; }
			}
			var ntext = parseXml(text);
			
			var rxml = [];
			rxml = ntext.childNodes[0];
			var pointsArray = [];
			
			setAllFalse();
			for(var i=1;i<33;i++){
				for(var j=0;j<dentes.childNodes[i].childNodes.length;j++){
					dentes.childNodes[i].removeChild(dentes.childNodes[i].childNodes[j]);
				}
			}

			xml.removeChild(xml.firstChild);
			xml.appendChild(rxml);
			for(var i=0;i<32;i++){
				dente[i] = rxml.childNodes[i];
			}

			drawBuffer = []
			curform = 0;
			cont = 0;
			img = new Image();
			//desenhar imagem e pontos quando ela estiver carregada
			img.onload = function(){
				drawBuffer = []
				//loadImgContainer();
				context.clearRect(0,0,1000,500);
				//setar largura e altura do canvas para largura e altura da imagem
				canvas.width = img.width;
				canvas.height = img.height;
				var container = document.getElementById("canvas_container");
				var bcontainer = document.getElementById("container");
				var topcontainer = document.getElementById("barra_lateral");
				var topcontainer2 = document.getElementById("barra_superior");
				
				container.style.width = img.width + "px";
				if(img.width > 875){
					bcontainer.style.width = img.width + 25 + "px";
					topcontainer.style.width = bcontainer.style.width;
					topcontainer2.style.width = bcontainer.style.width;
				}
				container.style.height = img.height + "px";
				if(img.height > 500){
					bcontainer.style.height = img.height + 210 + "px";
				}
				context.drawImage(img, 0, 0);

				//loadPoints(rxml);
				for(var i=1;i<rxml.childNodes.length;i++){
					if(rxml.childNodes[i].childNodes[0] != null){
						for(var j=0;j<rxml.childNodes[i].childNodes.length;j++){
							
							//carregar pontos
							var points = [];
							points = rxml.childNodes[i].childNodes[j].getElementsByTagName("pontos")[0];
							var num = parseInt(points.getAttribute("id"));
							var p = [];
							var prev = [];
							pointsArray = [];
							//desenhar pontos
							context.beginPath();
							//context.strokeStyle = "red"
							prev = new Point(parseInt(points.childNodes[0].childNodes[0].innerHTML), parseInt(points.childNodes[0].childNodes[1].innerHTML));
							context.moveTo(prev.x, prev.y);
							for(var k=0;k<points.childNodes.length-1;k++){
								prev = new Point(parseInt(points.childNodes[k].childNodes[0].innerHTML), parseInt(points.childNodes[k].childNodes[1].innerHTML));
								p = new Point(parseInt(points.childNodes[k+1].childNodes[0].innerHTML), parseInt(points.childNodes[k+1].childNodes[1].innerHTML));
								//context.moveTo(prev.x, prev.y);
								context.lineTo(p.x, p.y);
								context.stroke();
								//adiciona cada ponto no vetor
								pointsArray.push(new Point(prev.x, prev.y));
							}
							//context.moveTo(p.x, p.y);
							context.lineTo(pointsArray[0].x, pointsArray[0].y);
							context.closePath();
							context.stroke();
							pointsArray.push(new Point(p.x, p.y));
							//adiciona vetor no vetor de desenho
							drawBuffer.push(new Area(pointsArray, num));
							cont = num;
							cont++;
							curform = cont
							curform++;
							drawCall();
						}
					}
				}
				
				var maskCanvas = document.createElement('canvas');
				// Ensure same dimensions
				maskCanvas.width = canvas.width;
				maskCanvas.height = canvas.height;
				var maskCtx = maskCanvas.getContext('2d');

				// This color is the one of the filled shape
				maskCtx.fillStyle = "black";
				// Fill the mask
				maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
				// Set xor operation
				maskCtx.globalCompositeOperation = 'xor';
				// Draw the shape you want to take out
				for(var i=0;i<drawBuffer.length;i++){
					var vet = drawBuffer[i].pointArray
					maskCtx.strokeStyle = "black"
					maskCtx.beginPath()
					maskCtx.moveTo(vet[0].x, vet[0].y)
					for(var j=1;j<vet.length;j++){
						maskCtx.lineTo(vet[j].x, vet[j].y)
					}
					maskCtx.lineTo(vet[0].x, vet[0].y)
					maskCtx.stroke()
					//drawBuffer[i].draw(maskCtx)
					maskCtx.fillStyle = "black"
					maskCtx.fill()
				}
				
				maskCtx.stroke()
				context.clearRect(0,0,canvas.width,canvas.height);
				context.drawImage(img, 0, 0)
				context.drawImage(maskCanvas, 0, 0)

				for(var i=0;i<drawBuffer.length;i++){
					drawBuffer[i].color = "black"
					drawBuffer[i].draw(context)
				}
				
				//savePatches(drawBuffer, filename);
				filename = filename.substring(0, filename.lastIndexOf('.'));
				for(var i=0;i<drawBuffer.length;i++){
					//console.log(drawBuffer[i]);
					var minX = canvas.width;
					var maxX = 0;
					var minY = canvas.height;
					var maxY = 0;
					for (var j = 0; j< drawBuffer[i].pointArray.length;j++){
						if(drawBuffer[i].pointArray[j].x < minX){
							minX = drawBuffer[i].pointArray[j].x;
						}
						if(drawBuffer[i].pointArray[j].x > maxX){
							maxX = drawBuffer[i].pointArray[j].x;
						}
						if(drawBuffer[i].pointArray[j].y < minY){
							minY = drawBuffer[i].pointArray[j].y;
						}
						if(drawBuffer[i].pointArray[j].y > maxY){
							maxY = drawBuffer[i].pointArray[j].y;
						}
					}
					var theNewCanvas = document.createElement('canvas');
					theNewCanvas.width = maxX-minX;
					theNewCanvas.height = maxY-minY;
					var newContext = theNewCanvas.getContext('2d');
					newContext.drawImage(canvas, minX, minY, maxX - minX, maxY - minY, 0, 0, maxX - minX, maxY - minY)
					var savename;
					
					savename = filename + "_patch_";
					/*
					if(savename != undefined){
						theNewCanvas.toBlob(function(blob) {
							saveAs(blob, savename);
						});
					}
					*/
					cur = 0
					if(savename != undefined){
						theNewCanvas.toBlob(function(blob) {
							savename = filename + "_patch_" + cur + ".jpg";
					   		zip.file(savename,blob, {base64: true});
					   		cur++
						});
					}
					var xmlname = document.getElementById("xmlname");
					xmlname.innerHTML = filename + ".xml";
				}
			}
			img.src = rxml.firstChild.innerHTML;
		}
		fr.readAsText(file);
	}
	curfile++;
}

function executeAsynchronously(functions, timeout) {
	for(var i = 0; i < functions.length; i++) {
		setTimeout(functions[i], timeout);
	}
}

saveZip = function(){
	zip.generateAsync({type:"blob"})
	.then(function(content) {
	    // see FileSaver.js
	    saveAs(content, "patches.zip");
	});
}

nextFile = function() {
	curfile++;
	console.log(curfile);
}