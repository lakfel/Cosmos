// ----------------------------------------------------------  Scatter plot -----------------------------------------------------------------------  //
// #region scatter

	// ------ Scatter data
	var dataScatter;
	// Margins and sizes
	var marginScatter = {top: 20, right: 20, bottom: 20, left: 20},
    widthScatter = 560 - marginScatter.left - marginScatter.right,
    heightScatter = 560 - marginScatter.top - marginScatter.bottom;
	
	
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
		yAxisScatter = d3.axisLeft().scale(yScaleScatter);

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
			.attr("width", widthScatter + marginScatter.left + marginScatter.right)
			.attr("height", heightScatter + marginScatter.top + marginScatter.bottom)
			.on("wheel", onWheel)
			.on("mouseover",handleMouseMoveInSvgScatter)
			//.on("mouseover",handleMouseOverSvgScatter)
			//.on("mouseout",handleMouseMoveOutSvgScatter)
		  .append("g")
			.attr("transform", "translate(" + marginScatter.left + "," + marginScatter.top + ")");

		// change string (from CSV) into number format
		var countInQYm = 0;
		var lastQyM = 0;
		dataScatter.forEach(function(d) {
			d.sy_dist = +d.sy_dist; //Distance from Earth
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
		  .attr("class", "x xAxisScatter")
		  .attr("transform", "translate(0," + yScaleScatter(0) + ")")
		  .call(xAxisScatter)
		.append("text")
		  .attr("class", "label")
		  .attr("x", widthScatter)	
		  .attr("y", -6)
		  //.attr("transform", "translate(0," + ((height)/2 + marginScatter.top) + ")")
		  .style("text-anchor", "end")
		  .text("Distance");

	  // y-axis
		svgScatter.append("g")
		  .attr("class", "y yAxisScatter")
		  .attr("transform", "translate(" + xScaleScatter(0) + ",0)")
		  .call(yAxisScatter)
		.append("text")
		  .attr("class", "label")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Distance");

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
		 /* .on("mouseover", function(d) {
			  tooltip.transition()
				   .duration(200)
				   .style("opacity", .9);
			  tooltip.html(d["Cereal Name"] + "<br/> (" + xValueScatter(d) 
				+ ", " + yValueScatter(d) + ")")
				   .style("left", (d3.event.pageX + 5) + "px")
				   .style("top", (d3.event.pageY - 28) + "px");
		  })
		  .on("mouseout", function(d) {
			  tooltip.transition()
				   .duration(500)
				   .style("opacity", 0);
		  });*/
	/*	var fisheye = d3.fisheye().radi;

		svgScatter.on("mousemove", function() {
			fisheye.center(d3.mouse(this));
			circles.each(function(d) { d.fisheye = fisheye(d); })
				.attr("cx", function(d) { return d.fisheye.x; })
				.attr("cy", function(d) { return d.fisheye.y; })
				.attr("r", function(d) { return 2; });
		});
		
		*/
		
	  // draw legend
	  /*var legend = svgScatter.selectAll(".legend")
		  .data(color.domain())
		.enter().append("g")
		  .attr("class", "legend")
		  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  // draw legend colored rectangles
	  legend.append("rect")
		  .attr("x", width - 18)
		  .attr("width", 18)
		  .attr("height", 18)
		  .style("fill", color);

	  // draw legend text
	  legend.append("text")
		  .attr("x", width - 24)
		  .attr("y", 9)
		  .attr("dy", ".35em")
		  .style("text-anchor", "end")
		  .text(function(d) { return d;})*/
	});


// #endregion
// ----------------------------------------------------------  END Scatter plot -----------------------------------------------------------------------  //




