var w1 = d3.select("#mapa").style("width");
var width = parseInt(w1,10);
var height = width * 0.65;
var mapad3 = d3.map();
var windowHeight = $( window ).height();

var proy = d3.geo.mercator()
			.center([-102,23.7])
			.scale(width * 1.7)
			.translate([width/2,height/2]);

var camino = d3.geo.path()
			.projection(proy);

var svg2 = d3.select("#mapa").append("svg")
			.attr("width",width)
			.attr("height",height)
			.append("g").attr("class","mapa");

var scalax = d3.scale.ordinal().rangeRoundBands([0,200],0.1);
var scalay = d3.scale.linear().range([windowHeight*(2/3)/9,0]).domain([0,50000]);
var scalac = d3.scale.linear().range(["#ffffff","#6600b7"]).domain([0,30000]);

d3.json("./datos/edos.json",function(error,data){
	d3.json("./datos/p28op1.json",function(error,p28op1){
		d3.json("./datos/p28op2.json",function(error,p28op2){
			d3.json("./datos/p28op3.json",function(error,p28op3){
				d3.json("./datos/p28op4.json",function(error,p28op4){
					d3.json("./datos/p28op5.json",function(error,p28op5){
							d3.json("./datos/estmun2.json",function(error,poligonos){
								var estadospoli = topojson.feature(poligonos, poligonos.objects.estados);

								estadospoli.features.forEach(function(ele){
									if(ele.id === "Coahuila de Zaragoza"){
										ele.id = "Coahuila"
									};
									if(ele.id === "Michoacán de Ocampo"){
										ele.id = "Michoacán"
									};
									if(ele.id === "Veracruz de Ignacio de la Llave"){
										ele.id = "Veracruz"
									};
								})

								svg2.selectAll("poligonos")
									.data(estadospoli.features)
									.enter().append("path")
									.attr("class","estado")
									.attr("d",camino)
									.style("fill","white")
									.style("stroke","white")
									.style("stroke-width",0.5)

								var ndata = data;
								
								d3.selectAll(".estado")
									.on("click",mujeres)
									.style("stroke","black")
									.style("stroke-width",0.5)
									.style("fill",function(d,i){
										var temporal = ndata[i].MujeresSI;
										return scalac(temporal)});


								function mujeres (d,i) {
									if (ndata[i].MujeresSI == 0) {
										$(".lightbox").addClass("active")
										d3.select(".msj")
										.append("span")
										.html("En el estado de " + d.id + " no hay mujeres que quieran ser científicas o ingenieras, que tenga entre 18 y 20 años.");
									} else{
										$("#d2").addClass("active")
										d3.select("#percent")
											.html((ndata[i].MujeresSI*100)/ndata[i].TotalMujeres);
										d3.select("#title")
											.html(d.id);
										
										buildGraph("#op1",p28op1,i, "op1")
										buildGraph("#op2",p28op2,i, "op2")
										buildGraph("#op3",p28op3,i, "op3")
										buildGraph("#op4",p28op4,i, "op4")
										buildGraph("#op5",p28op5,i, "op5")
										
										};
								}
						})
					})
				})
			})
		})
	})
})


//Cerrar lightbox y seccion graficas
$('.close-button').click(function(){
	$('.lightbox').removeClass('active');
	$('.msj span').remove();
})
$('#back').click(function(){
	$('#d2').removeClass('active');
	$('#infoEdo span').empty();
	$('.resp svg').remove();
})

function parseData (originalData, idEstado, idQuestion) {
	var res=[];
	var keys = Object.keys(originalData[idEstado][idQuestion][0]);
	for(var i = 0; i < keys.length; i++){
		var elemento = {}
		var val = originalData[idEstado][idQuestion][0][keys[i]]
		elemento["key"]="opcion"+keys[i]
		elemento["val"]=val
		res.push(elemento)
	}
	return res
}

function buildGraph (selector, rawData, index, idQuestion) {
	var parsedData = parseData(rawData, index, idQuestion)
	var domainX = parsedData.map(function(elem){return elem.key});
	scalax.domain(domainX);
	
	d3.select(selector).append("svg")
		.attr("width","200px")
			.attr("height",windowHeight*(2/3)/7)
		.append("g").attr("class","barras")
		.selectAll("rect")
		.data(parsedData).enter()
		.append("rect")
		.attr("class","barra")
		.attr("x",function(d,i){return scalax(d.key)})
		.attr("y",function(d,i){return scalay(d.val)})
		//.attr("height",function(d,i){return scalay(0) - scalay(0)})
		//.attr("y",function(d,i){return scalay(d.valor)})
		.attr("height",function(d,i){return scalay(0) - scalay(d.val)})
		.attr("width",scalax.rangeBand())
		.style("fill",function(d,i){return scalac(d.val)});
		
}