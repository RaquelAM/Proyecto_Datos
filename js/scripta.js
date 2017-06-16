var w1 = d3.select("#d2").style("width");
var width = parseInt(w1,10);
var height = width * 0.65;

console.log(width);

var mapad3 = d3.map();

var proy = d3.geo.mercator()
			.center([-102,23.7])
			.scale(width * 1.7)
			.translate([width/2,height/2]);

var camino = d3.geo.path()
			.projection(proy);

var svg = d3.select("#d2").append("svg")
			.attr("width",width)
			.attr("height",height);

var svg2 = d3.select("#d3").append("svg")
			.attr("width",width)
			.attr("height",height)
			.append("g").attr("class","mapa");

var scalax = d3.scale.ordinal().rangeRoundBands([0,width],0.1);
var scalay = d3.scale.linear().range([height*0.5,0]).domain([0,100]);
var scalac = d3.scale.linear().range(["#ffffff","#756BB1"]).domain([0,30]);

d3.json("./datos/edos.json",function(error,data){
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

	//console.log("edos",data[1])
	var ndata = data;
	console.log("ndata",ndata[1].mujeres)
	// ndata.forEach(function(ele){
	// 	mapad3.set(ele.edo,ele.mujeres)
	// });
	
	d3.selectAll(".estado")
		.on("click",mujeres)
		.style("stroke","black")
		.style("stroke-width",0.5)
		.style("fill",function(d,i){
			var temporal = ndata[i].mujeres;

			// var temporal2 = ndata.filter(function(ele){return ele.edo === d.id});
			// console.log("temporal2",temporal2)
			// var temporal = temporal2[0].mujeres;

			//var temporal = mapad3.get(d.id);
			return scalac(temporal*10)});


	function mujeres (d,i) {
		if (ndata[i].mujeres == 0) {
			$(".lightbox").addClass("active")
			d3.select(".msj")
			.append("span")
			.html("En el estado de " + d.id + " no hay mujeres que quieran ser científicas o ingenieras, que tenga entre 18 y 20 años.");
		} else{
			console.log("si me interesa")
		};
	}
	
	// var estados = data.map(function(ele){return ele.edo});
	// console.log(estados);

	// var nestados = estadospoli.features.map(function(ele){return ele.id});
	// console.log(nestados);

	// scalax.domain(estados);

	/*
	d3.select("svg").append("g").attr("class","barras")
		.selectAll("rect")
		.data(ndata).enter()
		.append("rect")
		.attr("class","barra")
		.attr("x",function(d,i){return scalax(d.estado)})
		.attr("y",function(d,i){return scalay(0)})
		.attr("height",function(d,i){return scalay(0) - scalay(0)})
		//.attr("y",function(d,i){return scalay(d.valor)})
		//.attr("height",function(d,i){return scalay(0) - scalay(d.valor)})
		.attr("width",scalax.rangeBand())
		.style("fill",function(d,i){return scalac(d.valor)});

	d3.select("svg").append("g").attr("class","etiquetas")
		.selectAll("text")
		.data(ndata).enter()
		.append("g").attr("class","et1")
		.append("text")
		.attr("x",function(d,i){return scalax(d.estado) - scalax.rangeBand()*0.5})
		.attr("y",function(d,i){return scalay(0) + scalax.rangeBand()*0.7})
		.text(function(d,i){return d.estado})
		.style("font-size",width/60 + "px")
		.style("text-anchor","end")
		.attr("transform",function(d,i){return "rotate(-90," + scalax(d.estado) + "," + scalay(0) + ")"});

	d3.selectAll("rect").transition()
		.duration(2000)
		.attr("y",function(d,i){return scalay(d.valor)})
		.attr("height",function(d,i){return scalay(0) - scalay(d.valor)});

	d3.selectAll(".barra").on("mouseover",info);
	d3.selectAll(".barra").on("mouseout",salir);

	d3.selectAll(".estado").on("mouseover",info2);
	d3.selectAll(".estado").on("mouseout",salir);

	function info2(d,i){

		d3.selectAll(".barra").classed("apagado",function(p,j){return p.estado !== d.id});
		d3.selectAll(".estado").classed("apagado",function(p,j){return d !== p});

		d3.selectAll(".apagado").style("opacity",0);

		d3.select("#d1")
			.append("h2")
			.attr("class","info")
			.html(d.id);

		d3.select("#d1")
			.append("p")
			.attr("class","info")
			.html("Pobreza extrema: ")
			.append("span")
			.html(mapad3.get(d.id) + "%")
			.style("font-weight","bold");

	}

	function info(d,i){

		d3.selectAll(".barra").classed("apagado",function(p,j){return p !== d});
		d3.selectAll(".estado").classed("apagado",function(p,j){return d.estado !== p.id})

		d3.selectAll(".apagado").style("opacity",0);

		d3.select("#d1")
			.append("h2")
			.attr("class","info")
			.html(d.estado);

		d3.select("#d1")
			.append("p")
			.attr("class","info")
			.html("Pobreza extrema: ")
			.append("span")
			.html(d.valor + "%")
			.style("font-weight","bold");
	}

	 function salir(d,i){

	 	d3.selectAll(".barra").transition().style("opacity",1);
	 	d3.selectAll(".estado").transition().style("opacity",1);

	 	d3.selectAll(".barra").classed("apagado",function(){return false});
	 	d3.selectAll(".estado").classed("apagado",function(){return false});

	 	d3.selectAll(".info").remove();

	 }*/	


})
})


//Cerrar lightbox
$('.close-button').click(function(){
	$('.lightbox').removeClass('active');
	$('.msj span').remove();
})
