//----------------------------------------------------------- Common --------------------------------------------------------------------------------//
	var limitsScatter = {minX:0,maxX:0,minY:0,maxY:0, topMaxX:0, topMinX:0, topMaxY:0, topMinY:0};
	
	var handleMouseOverBar = function(d, i)
	{	
		svgBar.selectAll('.bar')
				.style('opacity', 0.2);
		d3.select(this)
				.style('opacity', 1);
				
		svgScatter.selectAll('.dot')
				.attr('r', 0.1)
				.style('opacity', 0.05);
				
		svgScatter.selectAll('.dot' + nameDMDeleteSpace(d.method))
				.attr('r',5)
				.style('opacity', 1);
		
	}
	var handleMouseOutBar = function(d, i)
	{	
		svgBar.selectAll('.bar')
				.style('opacity', 1);
		svgScatter.selectAll('.dot')
				.attr('r', 2)
				.style('opacity', 1);
	}
	
	var onWheel = function(d)
	{
		d3.event.preventDefault();
		d3.event.stopPropagation();
		var center = d3.mouse(this);
		var px = xScaleScatter.invert(center[0]);
		var py = yScaleScatter.invert(center[1]);
		
		var distance = d3.min([Math.abs(limitsScatter.minX - px),Math.abs(limitsScatter.maxX - px),Math.abs(limitsScatter.minY - py),Math.abs(limitsScatter.maxY - py)]);
		var direction = d3.event.wheelDelta < 0 ? 'down' : 'up';
        if(d3.event.wheelDelta > 0)    
		{
			limitsScatter.minX = px - distance/2;
			limitsScatter.maxX = px + distance/2;
			limitsScatter.minY = py - distance/2;
			limitsScatter.maxY = py + distance/2;
			
			/*limitsScatter.minX = (limitsScatter.minX - px)/2;
			limitsScatter.maxX = (limitsScatter.maxX - px)/2;
			limitsScatter.minY = (limitsScatter.minY - py)/2;
			limitsScatter.maxY = (limitsScatter.maxY - py)/2;*/
		}
		else
		{
			limitsScatter.minX = d3.max([(limitsScatter.minX + limitsScatter.topMinX)/2,limitsScatter.topMinX]);
			limitsScatter.maxX = d3.min([(limitsScatter.maxX + limitsScatter.topMaxX)/2,limitsScatter.topMaxX]);
			limitsScatter.minY = d3.max([(limitsScatter.minY + limitsScatter.topMinY)/2,limitsScatter.topMinY]);
			limitsScatter.maxY = d3.min([(limitsScatter.maxY + limitsScatter.topMaxY)/2,limitsScatter.topMaxY]);
		}
			
			//zoom(direction === 'up' ? d : d.parent);
		
		/*
		limitsScatter.minX += distance;
		limitsScatter.maxX -= distance;
		limitsScatter.minY += distance;
		limitsScatter.maxY -= distance;*/
		
		xScaleScatter.domain([limitsScatter.minX, limitsScatter.maxX]);
		yScaleScatter.domain([limitsScatter.minY, limitsScatter.maxY]);
			
		let dots = svgScatter.selectAll('.dot');

		svgScatter.select('.xAxisScatter')
			.attr("transform", "translate(0," + yScaleScatter(0) + ")")
			.call(xAxisScatter);
			
		svgScatter.select('.yAxisScatter')
			.attr("transform", "translate(" + xScaleScatter(0) + ",0)")
			.call(yAxisScatter);
		dots			
			.attr("cx", xMap)
			.attr("cy", yMap);
		
	}
	
	
	var nameDMInsertSpace = function (name)
	{
		return name.replaceAll('_',' ');
	}
	
	var nameDMDeleteSpace = function (name)
	{
		return name.replaceAll(' ','_');
	}
	
	var colors  = d3.scaleOrdinal(
				['Radial_Velocity','Imaging','Eclipse_Timing_Variations','Transit','Astrometry','Disk_Kinematics','Orbital_Brightness_Modulation','Pulsation_Timing_Variations','Microlensing','Transit_Timing_Variations','Pulsar_Timing'],
				["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]);


	var animation = function()
	{
		
		year = 1989; //1989 
		month = 5; //5
		var counter = 0;
		var tope = 0;
		var prevLen = 0;
		tickDuration = 200;
		var tickMinimum = 400;
		var thickMaximum = 7000;
		
		
		var ticker = d3.interval(e => {
			
			// Data of the currente year-month
			yearSlice = dataBarchart.filter(d => d.yearR == year && !isNaN(d.value) && d.monthnumber == month)
				.sort((a,b) => b.value - a.value)
				.slice(0,top_n);
			tickDuration = tickMinimum; 
			// Update rank
			yearSlice.forEach((d,i) => d.rank = i);
		 
			//console.log('IntervalYear: ', yearSlice);
			//Update  domian
			xScaleBars.domain([0, d3.max(yearSlice, d => (d.value+2))]); 
			// Update axis
			svgBar.select('.xAxisBars')
				.transition()
				.duration(tickDuration)
				.ease(d3.easeLinear)
				.call(xAxisBars);
			
			// Getting bars elements
			let bars = svgBar.selectAll('.bar').data(yearSlice, d => d.method);
		
			// Enter - new bars 
			// TODO maybe start with less bars could have better effect
			bars
				.enter()
				.append('rect')
				.attr('class', d => 'bar '+ d.method)
				.attr('x', xScaleBars(0)+1)
				.attr( 'width', d => xScaleBars(d.value)-xScaleBars(0)-1)
				.attr('y', d => yScaleBars(top_n+1)+5)
				.attr('height', yScaleBars(1)-yScaleBars(0)-barPadding)
				.on('mouseover', handleMouseOverBar)
				.on('mouseout', handleMouseOutBar)
				.style('fill', d => d.colour)
				.transition()
				  .duration(tickDuration)
				  .ease(d3.easeLinear)
				  .attr('y', d => yScaleBars(d.rank)+5);
				  
				  
				  
			// Update - existing barrs
			bars
				.transition()
				  .duration(tickDuration)
				  .ease(d3.easeLinear)
				  .attr('width', d => xScaleBars(d.value)-xScaleBars(0)-1)
				  .attr('y', d => yScaleBars(d.rank)+5);
			// Exit, when removing bars. Not used here
			bars
				.exit()
				/*.transition()
				  .duration(tickDuration)
				  .ease(d3.easeLinear)
				  .attr('width', d => xScaleBars(d.value)-xScaleBars(0)-1)
				  .attr('y', d => yScaleBars(top_n+1)+5)*/
				  .remove();

			// Getting labels
			let labels = svgBar.selectAll('.label')
			  .	data(yearSlice, d => d.method);
			// Enter labels
			labels
				.enter()
				.append('text')
				.attr('class', 'label')
				.attr('x', d => xScaleBars(d.value))
				.attr('y', d => yScaleBars(d.rank)+5+((yScaleBars(1)-yScaleBars(0))/2)+1)
				.style('fill', 'white')
				.style('text-anchor', 'start')
				.html(d => d.method + '(' + d.value + ')')
				.on('mouseover', handleMouseOverBar)
				.on('mouseout', handleMouseOutBar)
				.transition()
					.duration(tickDuration)
					.ease(d3.easeLinear)
					.attr('y', d => yScaleBars(d.rank)+5+((yScaleBars(1)-yScaleBars(0))/2)+1);

			// Update labels
			labels
				.html(d => d.method + '(' + d.value + ')')
				.transition()
				.duration(tickDuration)
					.ease(d3.easeLinear)
					.attr('x', d => xScaleBars(d.value))
					.attr('y', d => yScaleBars(d.rank)+5+((yScaleBars(1)-yScaleBars(0))/2)+1);
			// Exit labels
			labels
				.exit()
				/*.transition()
					.duration(tickDuration)
					.ease(d3.easeLinear)
					.attr('x', d => xScaleBars(d.value)-8)
					.attr('y', d => yScaleBars(top_n+1)+5)*/
					.remove();
			 

			/*// Getting value labels
			let valueLabels = svgBar.selectAll('.valueLabel').data(yearSlice, d => d.method);
		
			valueLabels
				.enter()
				.append('text')
				.attr('class', 'valueLabel')
				.attr('x', d => xScaleBars(d.value)+5)
				.attr('y', d => yScaleBars(top_n+1)+5)
				.text(d => d3.format(',.0f')(d.lastValue))
				.transition()
					.duration(tickDuration)
					.ease(d3.easeLinear)
					.attr('y', d => yScaleBars(d.rank)+5+((yScaleBars(1)-yScaleBars(0))/2)+1);
				
			valueLabels
				.transition()
					.duration(tickDuration)
					.ease(d3.easeLinear)
					.attr('x', d => xScaleBars(d.value)+5)
					.attr('y', d => yScaleBars(d.rank)+5+((yScaleBars(1)-yScaleBars(0))/2)+1)
					.tween("text", function(d) {
						let i = d3.interpolateRound(d.lastValue, d.value);
						return function(t) {
							this.textContent = d3.format(',')(i(t));
						};
					});
		  
		 
			valueLabels
				.exit()
				/*.transition()
					.duration(tickDuration)
					.ease(d3.easeLinear)
					.attr('x', d => xScaleBars(d.value)+5)
					.attr('y', d => yScaleBars(top_n+1)+5)*/
					/*.remove();*/
		

			// Linechart animation ----------------------------------------------------------------------------------------------------------
			dataLinesAnim1 = dataLines1.filter(d => timeConv(d.code) <= timeConv(year + "-" + month));
			dataLinesAnim1.columns = dataLines1.columns;
			dataLinesAnim2 = dataLinesAnim1.columns.slice(4).map(function(id) {
			return {
				id: id,
				values: dataLinesAnim1.map(function(d){
					return {
						date: timeConv(d.code),
						measurement: +d[id]
					};
				})
			};
			});
			var domi = [(0), d3.max(dataLinesAnim2, function(c) {
					return d3.max(c.values, function(d) {
						return d.measurement + 4; });
						})
					];
			yScaleLines.domain(domi);
			
			//yAxisLines.scale(yScaleLines);
			var sl =svgLines.select('.yAxisLines');
			svgLines.select('.yAxisLines')
				.transition()
				.duration(tickDuration)
				.ease(d3.easeLinear)
				.call(yScaleLines);
			
			
			let lines = svgLines.selectAll('.lines').data(dataLinesAnim2, d => d.id);
			
			lines
				.enter()
				.append("g")
				.attr("class", function(d) { return 'lines ' + d.id; })
				.append("path")
				.attr("class", function(d) { return 'linesPath ' + d.id; })
				.style('stroke', d => colors(nameDMDeleteSpace(d.id)))
				.style('stroke-width', 3)
				.style('fill','none')
				.transition()
				  .duration(tickDuration)
				  .ease(d3.easeLinear)				
				.attr("d", function(d) { return lineGenerator(d.values); })

			// Update - existing barrs
			lines
				.select('.linesPath ')
				.transition()
				  .duration(tickDuration)
					.ease(d3.easeLinear)
					.attr("d", function(d) { return lineGenerator(d.values); })
					;
			// Exit, when removing bars. Not used here
			lines
				.exit()
				/*.transition()
				  .duration(tickDuration)
				  .attr("r", 0)
				  .ease(d3.easeLinear)*/
				  .remove();
			// Getting circile elements
			
			
			//--------------------- Animation Scatter
			console.log('Planets');
			console.log('Planets');
			let dots = svgScatter.selectAll('.dot').data(planetsData, d => d.rowid);
			//tickDuration = d3.max([d3.sum(yearSlice, d=> d.value) * thickMaximum/1292, tickMinimum]);
			if(counter ==0)
			{
				planetsData = dataScatter.filter(d => (d.qym <= year*12 + month));
				tope = Math.floor((planetsData.length - prevLen)/10) + 1;
				prevLen =  planetsData.length;
				if(tope > 1)
				{
					console.log(tope);
				}
			}
			counter +=1;
			planetsData = dataScatter.filter(d => (d.qym < year*12 + month) || (d.qym == year*12 + month && d.filterTime <= counter*10));
			
				
			limitsScatter.minX = d3.min(planetsData, xValueScatter);
			limitsScatter.minY = d3.min(planetsData, yValueScatter);
			limitsScatter.maxX = d3.max(planetsData, xValueScatter);
			limitsScatter.maxY = d3.max(planetsData, yValueScatter);
			
			xScaleScatter.domain([limitsScatter.minX, limitsScatter.maxX]);
			yScaleScatter.domain([limitsScatter.minY, limitsScatter.maxY]);
			

			svgScatter.select('.xAxisScatter')
				.transition()
				.duration(tickDuration)
				.ease(d3.easeLinear)
				.attr("transform", "translate(0," + yScaleScatter(0) + ")")
				.call(xAxisScatter);
			svgScatter.select('.yAxisScatter')
				.transition()
				.duration(tickDuration)
				.ease(d3.easeLinear)
				.attr("transform", "translate(" + xScaleScatter(0) + ",0)")
				.call(yAxisScatter);
			
			// Enter - new bars 
			// TODO maybe start with less bars could have better effect
			dots
				.enter()
				.append('circle')
				.attr('class', d => 'dot '+ d.rowid + " " + "dot" + nameDMDeleteSpace(d.discoverymethod))
				.attr("r", 20)
				.attr("cx", xMap)
				.attr("cy", yMap)
				.style("stroke", "white")
				.style("fill", d => colors(nameDMDeleteSpace(d.discoverymethod) ))
				.transition()
				  .duration(tickDuration)
				  .ease(d3.easeLinear)
					.attr("r", 2)
					//.style("fill", d => colors(nameDMDeleteSpace(d.discoverymethod) ))
					;

			// Update - existing barrs
			dots
				.transition()
				  .duration(tickDuration)
					.ease(d3.easeLinear)
					//.style('fill', 'blue')
					.style("stroke", "black")
					.attr("r", 2)
					.attr("cx", xMap)
					.attr("cy", yMap);
			// Exit, when removing bars. Not used here
			dots
				.exit()
				/*.transition()
				  .duration(tickDuration)
				  .attr("r", 0)
				  .ease(d3.easeLinear)*/
				  .remove();
			yearText.html(year + '-' + month);
			if(counter >  tope)
			{
				counter = 0;
				month +=1;
				if(month == 13)
				{
					month = 1;
					year++;
				}
			}

			if(year == 2020 && month > 10) ticker.stop();
	//     year = d3.format('.1f')((+year) + 0.1);
	   },tickDuration);
	}
// ----------------------------------------------------------  Barchart plot -----------------------------------------------------------------------  //
// #region barchart
    // ------ Barchart data
	var dataBarchart;
    
	// Margins and sizes
	var marginBarChart = {top: 20, right: 20, bottom: 20, left: 20},
    width = 600 - marginBarChart.left - marginBarChart.right,
    height = 280 - marginBarChart.top - marginBarChart.bottom;    
	// SVG Bars
	var svgBar;

	// Duration in ms fo the transition in animations
    var tickDuration = 200;
	// Maximum number of barrs allowed in the plot
    var top_n = 11;

	//Scales for barchart plot
    var xScaleBars = d3.scaleLinear();
    var yScaleBars = d3.scaleLinear();
    var xAxisBars = d3.axisTop()
        .scale(xScaleBars)
        .ticks(width > 500 ? 5:2)
        .tickSize(-(height-marginBarChart.top-marginBarChart.bottom))
        .tickFormat(d => d3.format(',')(d));
	var barPadding = (height-(marginBarChart.bottom+marginBarChart.top))/(top_n*5);
	
	// Manage the time in the animation is showing
	var yearSlice;
	var year = 2020; //1989 
	var month = 10; //5
	var yearText;

  

    d3.csv("./data/dataChartRace.csv").then( function(data) {
		dataBarchart = data;
		svgBar = d3.select("#SvgBars")
		.attr("width", width + marginBarChart.left + marginBarChart.right)
		.attr("height", height + marginBarChart.top + marginBarChart.bottom)
   
      
		/*let title = svgBar.append('text')
		 .attr('class', 'title')
		 .attr('y', 24)
		 .html('Discovery method per planets');
  
		let subTitle = svgBar.append("text")
		 .attr("class", "subTitle")
		 .attr("y", 55)
		 .html("Number of planets");
   
		let caption = svgBar.append('text')
		 .attr('class', 'caption')
		 .attr('x', width)
		 .attr('y', height-5)
		 .style('text-anchor', 'end')
		 .html('Nasa Exoplanets');*/

		//if (error) throw error;
		//console.log(dataBarchart);
		  
		dataBarchart.forEach(function(d) {
			d.value = +d.value;
			d.lastValue = +d.lastValue;
			d.value = isNaN(d.value) ? 0 : d.value;
			d.year = +d.year;
			d.yearR = +d.yearR;
			d.monthnumber = +d.monthnumber;
			d.colour = colors(nameDMDeleteSpace(d.method));
		});
		
		// Solo las fechas de interés
		yearSlice = dataBarchart.filter(d => d.yearR == year && !isNaN(d.value) && d.monthnumber == month)
		.sort((a,b) => b.value - a.value)
		.slice(0, top_n);
		yearSlice.forEach((d,i) => d.rank = i);
		//console.log('yearSlice: ', yearSlice)
  
		xScaleBars
        .domain([0, d3.max(yearSlice, d => d.value)])
        .range([marginBarChart.left, width-marginBarChart.right-65]);
  
		yScaleBars
        .domain([top_n, 0])
        .range([height-marginBarChart.bottom, marginBarChart.top]);
  
		svgBar.append('g')
		   .attr('class', 'axis xAxisBars')
		   .attr('transform', 'translate(0, ' + marginBarChart.top + ')')
		   .call(xAxisBars)
		   .selectAll('.tick line')
		   .classed('origin', d => d == 0);
  
		svgBar.selectAll('rect.bar')
			//.data(yearSlice, d => d.name)
			.data(yearSlice)
			.enter()
			.append('rect')
			.attr('class', d=>'bar '+d.method)
			.attr('x', xScaleBars(0)+1)
			.attr('width', d => xScaleBars(d.value)-xScaleBars(0))
			.attr('y', d => yScaleBars(d.rank)+5)
			.attr('height', yScaleBars(1)-yScaleBars(0)-barPadding)
			.style('fill', d => d.colour)
			.on('mouseover', handleMouseOverBar)
			.on('mouseout', handleMouseOutBar);
      
		svgBar.selectAll('text.label')
			//.data(yearSlice, d => d.name)
			.data(yearSlice)
			.enter()
			.append('text')
			.attr('class', 'label')
			.attr('x', d => xScaleBars(d.value))
			.attr('y', d => yScaleBars(d.rank)+5+((yScaleBars(1)-yScaleBars(0))/2)+1)
			.style('text-anchor', 'start')
			.style('fill', 'white')
			.html(d => d.method + '(' + d.value + ')')
			.on('mouseover', handleMouseOverBar)
			.on('mouseout', handleMouseOutBar);
      
		/*svgBar.selectAll('text.valueLabel')
			//.data(yearSlice, d => d.name)
			.data(yearSlice)
			.enter()
			.append('text')
			.attr('class', 'valueLabel')
			.attr('x', d => xScaleBars(d.value))
			.attr('y', d => yScaleBars(d.rank)+5+((yScaleBars(1)-yScaleBars(0))/2)+1)
			.style('text-anchor', 'end')
			.text(d => d3.format(',.0f')(d.lastValue));*/

		yearText = svgBar.append('text')
		  .attr('class', 'yearText')
		  .attr('x', width-marginBarChart.right)
		  .attr('y', height-25)
		  .style('text-anchor', 'end')
		  .html(~~year)
		  .call(halo, 10);
  
 });
    


 const halo = function(text, strokeWidth) {
  text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
    .style('fill', '#ffffff')

     .style( 'stroke','#ffffff')
     .style('stroke-width', strokeWidth)
     .style('stroke-linejoin', 'round')
     .style('opacity', 1);
   
}   
 function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// #endregion
// ----------------------------------------------------------  END Barchart plot -----------------------------------------------------------------------  //
// ----------------------------------------------------------  Lines plot -----------------------------------------------------------------------  //
// #region linechart

	//Time converter
	const timeConv = d3.timeParse("%Y-%m");
	var nn = timeConv('05-1995');
	
	// ------ Scatter data
	var dataLines1;
	var dataLines2;
	var dataLinesAnim1;
	var dataLinesAnim1;
	
	// Margins and sizes
	var marginLines = {top: 20, right: 20, bottom: 20, left: 40},
    widthLines = 500 - marginLines.left - marginLines.right,
    heightLines = 230 - marginLines.top - marginLines.bottom;
	
	var xScaleLines = d3.scaleTime().range([0,widthLines]);
	var yScaleLines = d3.scaleLinear().rangeRound([heightLines,0]);
	
	var xAxisLines = d3.axisBottom();
	var yAxisLines = d3.axisLeft();

	var svgLines ; 
	var lineGenerator = d3.line()
		.x(function(d) { return xScaleLines(d.date); })
		.y(function(d) { return yScaleLines(d.measurement); });

	d3.csv('./data/lchart.csv').then(function(data){
		dataLines2 = data.columns.slice(4).map(function(id) {
        return {
            id: id,
            values: data.map(function(d){
                return {
                    date: timeConv(d.code),
                    measurement: +d[id]
                };
            })
        };
		});
		dataLines1 = data;
		xScaleLines.domain(d3.extent(dataLines1, function(d){
				return timeConv(d.code)}));
		yScaleLines.domain([(0), d3.max(dataLines2, function(c) {
				return d3.max(c.values, function(d) {
					return d.measurement + 4; });
					})
				]);
		xAxisLines.scale(xScaleLines);
		yAxisLines.scale(yScaleLines);
		
		svgLines = d3.select("#SvgLines")
			.attr("width", widthLines + marginLines.left + marginLines.right)
			.attr("height", heightLines + marginLines.top + marginLines.bottom)
		.append("g")
			.attr("transform", "translate(" + marginLines.left + "," + marginLines.top + ")");

		svgLines.append("g")
			.attr("class", "axis xAxisLines")
			.attr("transform", "translate(0," + heightLines + ")")
			.call(xAxisLines);

		svgLines.append("g")
			.attr("class", "axis yAxisLines")
			//.attr("transform", "translate(" + marginLines.left + ",0)")
			.call(yAxisLines);

		var lines = svgLines.selectAll("lines")
			.data(dataLines2)
			.enter()
			.append("g")
			.attr("class", function(d) { return 'lines ' + d.id; })
			.append("path")
			.attr("class", function(d) { return 'linesPath ' + d.id; })
			.attr("d", function(d) { return lineGenerator(d.values); })
			.style('fill','none')
			.style('stroke-width', 3)
			.style('stroke', d => colors(nameDMDeleteSpace(d.id)));

	});

	

	
	
// #endregion
// ----------------------------------------------------------  END Lines plot -----------------------------------------------------------------------  //