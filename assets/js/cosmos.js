// ----------------------------------------------------------  Scatter plot -----------------------------------------------------------------------  //
// #region scatter
	
	var xSScale ;
	var rSScale ;
	var ySScale ;
	
	// ------ Scatter data
	var dataScatter;
	// Margins and sizes
	var marginScatter = {top: 35, right: 20, bottom: 20, left: 20},
    widthScatter = 500 - marginScatter.left - marginScatter.right,
    heightScatter = 400- marginScatter.top - marginScatter.bottom;
	
	
	var planetsData;
	
	// ------- Axis X
	// TODO Possibly change distances to something more familiar  and add the labels/legends
	// Function that calculates the X position in the chart based on distance and angles of measurements
	// Math.log10 can be applied if a cleaner scale is required
	var xValueScatter = function(d) { return d.sy_dist*Math.sin(d.ra*Math.PI/180) * Math.sin(d.dec*Math.PI / 180 - Math.PI/4);}, 
	//X Scale map for scatter
		xScaleScatter = d3.scaleLinear().range([0, widthScatter]), 
	// Applies the x value to the scatter
		xMap = function(d,i) { 
					return xScaleScatter(xValueScatter(d));}, 
		xAxisScatter = d3.axisTop().scale(xScaleScatter);
		
		
		

	// -------- Axis Y
	// Function that calculates the Y position in the chart based on distance and angles of measurements
	// Math.log10 can be applied if a cleaner scale is required
	var yValueScatter = function(d,i) { return -d.sy_dist*Math.sin(d.ra*Math.PI/180) * Math.cos(d.dec*Math.PI / 180 - Math.PI/4);},
	//Y Scale map for scatter
		yScaleScatter = d3.scaleLinear().range([heightScatter, 0]),
		// Applies the x value to the scatter
		yMap = function(d,i) {
				return yScaleScatter(yValueScatter(d));},// data -> display
		yAxisScatter = d3.axisRight().scale(yScaleScatter);

	// --------- Color
	// TODO - Sync to barchart 
	

	// -------- SVG 
	var svgScatter ;

	// ----------- Tooltip Scatter
	// TODO - Check Heba's tooltip and sync it. -- Possibly different to barchart
	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	
	//----------- Load data and initial VIZ
	d3.csv("./data/data.csv").then(function( data) 
	{
		dataScatter = data;
		svgScatter = d3.select("#SvgScatter")
			//.attr("width", widthScatter + marginScatter.left + marginScatter.right)
			//.attr("height", heightScatter + marginScatter.top + marginScatter.bottom) 
			.attr('width', '95%')
			.attr('height', '95%')
			//.attr('viewBox','0 0 '+Math.min(widthScatter,heightScatter)+' '+Math.min(widthScatter,heightScatter))
			//.attr('viewBox','0 0 '+ widthScatter +' '+ heightScatter )
			.attr('viewBox','0 0 '+ widthScatter +' '+heightScatter)
			.attr('preserveAspectRatio','xMinYMin')
			//.append(“svg”)
			.on("wheel", onWheel)
			.on("mouseover",handleMouseMoveInSvgScatter)
			//.on("mouseover",handleMouseOverSvgScatter)
			//.on("mouseout",handleMouseMoveOutSvgScatter)
		  .append("g")
			//.attr('transform', 'translate(' + Math.min(widthScatter,heightScatter) / 2 + ','+ Math.min(widthScatter,heightScatter) / 2 + ')')
			.attr("transform", "translate(" + marginScatter.left + "," + marginScatter.top + ")");
			
		yScaleScatter.range([heightScatter - marginScatter.top - marginScatter.bottom , 0]);
		yAxisScatter.scale(yScaleScatter);
		xScaleScatter.range([0, widthScatter - marginScatter.left - marginScatter.right]);
		// change string (from CSV) into number format
		var countInQYm = 0;
		var lastQyM = 0;
		dataScatter.forEach(function(d) {
			d.sy_dist = +d.sy_dist * 3.2616; //Distance from Earth
			d.ra = +d.ra; // Angle 1 of measurement
			d.dec = +d.dec; // Angle 2 of measurement
			d.year = +d.disc_pubdate.substr(0,4) ;
			d.month = +d.disc_pubdate.substr(5,2); 
			d.qym = d.year*12 + d.month; 
			if(d.qym != lastQyM)
			{
				countInQYm = 0;
				lastQyM = d.qym;
			}
			countInQYm += 1;
			d.filterTime = countInQYm;
		  });
		
		dataScatter.sort((a,b) => a.qym - b.qym);
		dataScatter.forEach(function(d) {
			if(d.qym != lastQyM)
			{
				countInQYm = 0;
				lastQyM = d.qym;
			}
			countInQYm += 1;
			d.filterTime = countInQYm;
		  });

		// Fixing domains based on data
		filterText2 = svgScatter.append('text')
		  .attr('class', 'yearText')
		  .style('fill', 'white')
		  .style('font-size', 20)
		  .style('background', 'black')
		  .attr('x', 0)
		  .attr('y',  0 )
		  .style('text-anchor', 'start')
		  .html('-');

		
		limitsScatter.minX = d3.min(dataScatter, xValueScatter);
		limitsScatter.topMinX = limitsScatter.minX;
		
		limitsScatter.minY = d3.min(dataScatter, yValueScatter);
		limitsScatter.topMinY = limitsScatter.minY;
		
		limitsScatter.maxX = d3.max(dataScatter, xValueScatter);
		limitsScatter.topMaxX = limitsScatter.maxX;
		
		limitsScatter.maxY = d3.max(dataScatter, yValueScatter);
		limitsScatter.topMaxY = limitsScatter.maxY;
		
		xScaleScatter.domain([limitsScatter.topMinX, limitsScatter.topMaxX]);
		yScaleScatter.domain([limitsScatter.topMinY, limitsScatter.topMaxY]);

		// x-axis
		svgScatter.append("g")
		  .attr("class", "axis xAxisScatter")
		  .attr("transform", "translate(0," + yScaleScatter(0) + ")")
		  .call(xAxisScatter)
		.append("text")
		  .attr("class", "label")
		  .attr("x", widthScatter)	
		  .attr("y", -6)
		  //.attr("transform", "translate(0," + ((height)/2 + marginScatter.top) + ")")
		  .style("text-anchor", "end")
		  .text("Distance");
		
		svgScatter.selectAll('.xAxisScatter>.tick>text')
			.attr("transform", "rotate(-40)");
	  // y-axis
		svgScatter.append("g")
		  .attr("class", "axis yAxisScatter")
		  .attr("transform", "translate(" + xScaleScatter(0) + ",0)")
		  .call(yAxisScatter);
		  
		svgScatter.append("text")
		  .attr("class", "scatterLabel scatterXLabel")
		  //attr("transform", "rotate(-90)")
		  .attr("y", yScaleScatter(0) )
		  .attr("x", xScaleScatter(limitsScatter.maxX))
		  .attr("dy", "1em")
		  .style("text-anchor", "end")
		  .style("fill", "white")
		  .style("font-size", 8)
		  .text("Lightyears"); 
		  
		svgScatter.append("text")
		  .attr("class", "scatterLabel scatterYLabel")
		  .attr("y", yScaleScatter(limitsScatter.minY))
		  .attr("x", xScaleScatter(0))
		   //.attr("transform", "translate("+xScaleScatter(0)+"," + yScaleScatter(limitsScatter.maxY)  + "); rotate(-90)")
		  .attr("dy", "1em")
		  .style("text-anchor", "end")
		  .style("fill", "white")
		  .style("font-size", 8)
		  .text("Lightyears");

	  // Draw Circules
	  var circles = svgScatter.selectAll(".dot");
		 circles.data(dataScatter)
		.enter().append("circle")
			.attr("class",d=> "dot " + d.rowid + " " + "dot" + nameDMDeleteSpace(d.discoverymethod))
			.attr("r", 2)
			.style("stroke", "black")
		  //.attr("r", function(d){if(d.hostname == 'OGLE-2014-BLG-0124L'){console.log(xMap(d));console.log(yMap(d));console.log(d.pl_name);console.log(d.sy_dist);console.log(d.ra);console.log(d.dec);return 25;}else{return 0.5;}})
			.attr("cx", xMap)
			.attr("cy", yMap)
			.style("fill", d => colors(nameDMDeleteSpace(d.discoverymethod) ))		
			.on('click', handleClickDot)
			.on('mouseover', handleMouseOverDot)
			.on('mouseout', handleMouseOutDot);// function(d) { return color(cValue(d));}) ;
		
		var solarSystem =  [
			{"name": "sun", "symbol": "☉",  "color": "#FFFF55", "mass": 1, "r": 400,  "distance": 0, "velocity" : 1},
            { "name": "mercury", "symbol": "☿", "color": "#D4CCC5", "mass": 0.17, "r":  32, "distance": 10.39 , "velocity" : 88},
            { "name": "venus",   "symbol": "♀", "color": "#99CC32", "mass": 2.45, "r":  40, "distance": 12.723 , "velocity" : 225},
            { "name": "earth", "symbol": "♁", "color": "#007FFF", "mass": 3, "r": 43, "distance": 15, "velocity" : 365 },
            { "name": "mars",    "symbol": "♂", "color": "#FF7700", "mass": 0.32, "r":  46, "distance": 19.524 , "velocity" : 687},
            { "name": "jupiter", "symbol": "♃", "color": "#D98719", "mass":  955, "r": 277, "distance": 30.203 , "velocity" : 1200},
            { "name": "saturn",  "symbol": "♄", "color": "#B5A642", "mass":  286, "r": 152, "distance": 50.539 , "velocity" : 1600},
            { "name": "uranus",  "symbol": "⛢", "color": "#7093DB", "mass":   44, "r": 100, "distance": 65.18 , "velocity" : 1800},
            { "name": "neptune", "symbol": "♆", "color": "#7093DB", "mass":   52, "r": 95, "distance": 76.06 ,"velocity" : 2000}
			];		
		
		 xSScale = d3.scaleLinear().range([0,widthScatter - marginScatter.left - marginScatter.right]);
		 rSScale = d3.scaleLinear().range([0,widthScatter]);
		 ySScale = d3.scaleLinear().range([heightScatter - marginScatter.top - marginScatter.bottom , 0]);
		 xSScale.domain([-60,60]);
		 rSScale.domain([0,8000]);
		 ySScale.domain([-60,60]);

	
		svgScatter.selectAll('.solarSystem')
			.data(solarSystem)
			.enter()
			.append('circle')
			.attr('class','solarSystem')
			.attr('id', d => d.name)
			.attr('r', d => rSScale(d.r))
			.style('fill', d => d.color)
			.style('visibility', 'hidden')
			.attr('cx', function(d) {
					d.initialAngle = d3.randomUniform(0, 2)();
					return xSScale(d.distance*Math.cos(Math.PI*d.initialAngle));
				})
			.attr('cy', function(d) {
					//d.initialAngle = d3.randomUniform(0, 2)();
					return xSScale(d.distance*Math.sin(Math.PI*d.initialAngle));
				});
				
		svgScatter.selectAll('.solarSystemL')
			.data(svgScatter.selectAll('.solarSystem').data())
			.enter()
			.append('circle')
			.attr('class','solarSystemL')
			.attr('r', d =>xSScale(d.distance) -xSScale(0))
			.attr('cx', d =>xSScale(0))
			.attr('cy', d =>xSScale(0))
			.style('visibility', 'hidden')
			.style('fill', 'none')
			.style('stroke', d=> d.color);
		
	});


// #endregion
// ----------------------------------------------------------  END Scatter plot -----------------------------------------------------------------------  //




