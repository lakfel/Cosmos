//----------------------------------------------------------- Common --------------------------------------------------------------------------------//
	var limitsScatter = {minX:0,maxX:0,minY:0,maxY:0, topMaxX:0, topMinX:0, topMaxY:0, topMinY:0};
	var planetTooltip = d3.select("#infoCardScatter");
	var methodTooltip = d3.select("#infoCardBars");
	var exploringSvgScatter = false;

	var dragginToolTip = false;
	var deltaXtt = 0;
	var deltaYtt = 0;
	var filterText;var filterText2;
	var closeTooltipPlanet = function()
	{
		planetTooltip
			.style('visibility','hidden')
			.style("opacity", 0);
		methodTooltip
			.style('visibility','hidden')
			.style("opacity", 0);
		dragginToolTip = false;
	}

	var handleMouseDownToolTip = function()
	{
		dragginToolTip = true;
		var tt = planetTooltip;
		var px = d3.mouse(svgScatter.node())[0];
		var py = d3.mouse(svgScatter.node())[1];
		//deltaXtt = px - parseFloat(tt.style('left').substr(0,tt.style('left').length - 2)) ;
		//deltaXtt = px - parseFloat(tt.style('top').substr(0,tt.style('top').length - 2)) ;
		deltaXtt = px - parseFloat(planetTooltip.style('left').replaceAll('px','')) ;
		deltaYtt = py - parseFloat(planetTooltip.style('top').replaceAll('px','')) ;

	}
	var handleMouseUpToolTip = function()
	{
		dragginToolTip = false;
	}
	var handleMouseOverToolTip = function(e,d)
	{
		if(dragginToolTip)
		{
			var tt = planetTooltip;
			var px = d3.mouse(svgScatter.node())[0];
			var py = d3.mouse(svgScatter.node())[1];
			planetTooltip.style('left', (px - deltaXtt) + 'px');
			planetTooltip.style('top', (py - deltaYtt) + 'px');

		} 
	}

	var handleClickDot = function(d,i)
	{
		
		planetTooltip
				//.style('left',(d3.mouse(this)[0] ) + 'px')
				//.style('top',(d3.mouse(this)[1] ) + 'px' )
				
				.on('mousedown' , handleMouseDownToolTip)
				.on('mouseover' , handleMouseOverToolTip)
				.on('mouseup' , handleMouseUpToolTip)
				.style('visibility','visible')
				.style("border-color", "white")
				.style("border", "solid")
				.style("border-width", "4px")
				.style("border-radius", "5px")
				.style('left',(d3.select(this).attr('cx') +250 ) + 'px')
				.style('top',(d3.select(this).attr('cy') + 250 ) + 'px' )
				.style('opacity', 1)
				//  .call(d3.drag()
					//.on("start", handleMouseDownToolTip)
					//.on("drag",  (event,d) => (planetTooltip.style('left', event.x + 'px'), planetTooltip.style('top', event.y + 'px'))))
					//.on("end", handleMouseUpToolTip)
					//.on("start.update drag.update end.update", update))
					;

		planetTooltip
				.select('#lblPlanetName').html(d.pl_name);
		planetTooltip
				.select('#txtPlanetSize').html('<u>Size:</u> ' +  d.pl_rade + ' times the size of earth');
		planetTooltip
				.select('#txtPlanetMass').html('<u>Mass:</u> ' +  d.pl_bmasse + ' times the mass of earth');
		planetTooltip
				.select('#txtDistanceSystem').html('<u>Distance from earth :</u> ' + d.sy_dist + ' parsecs');
		planetTooltip
				.select('#txtHostStar').html('<u>Star :</u> ' + d.hostname);
		planetTooltip
				.select('#txtNumberorPlanets').html('<u>No of planets in the system:</u> ' + d.sy_pnum);
		planetTooltip
				.select('#txtStarMass').html('<u>Mass:</u> ' + d.st_mass + ' times sun mass');
		planetTooltip
				.select('#txtStarSize').html('<u>Size: ' + d.st_rad + ' times sun size');
		planetTooltip
				.select('#txtDateDiscovery').html('<u>Discovery date: </u>' + d.disc_pubdate);
		planetTooltip
				.select('#txtMethodDiscovery')
				.html('<u>Discovery method:</u> ' + d.discoverymethod)
				.style('background-color',colors(nameDMDeleteSpace(d.discoverymethod)));
				//.style("position", "absolute")
				//.style('display','');
	}
	var handleClickBar = function(d,i)
	{
		
		methodTooltip = d3.select("#infoCardBars");
		methodTooltip
				.style('visibility','visible')
				.style("border-color", "white")
				.style("border", "solid")
				.style("border-width", "4px")
				.style("border-radius", "5px")
				.style('left','150px')
				.style('top','50px')
				.style('opacity', 1);
		methodTooltip
				.select('#imgMethod')
				.attr('src','assets/img/' + nameDMDeleteSpace(d.method) + '.jpg');
		methodTooltip
				.select('#urlDiscoveryMethod').html('....');
	}
	var handleMouseMoveInSvgScatter = function()
	{
		//if(!exploringSvgScatter) return;
		let mx = d3.mouse(this)[0];
		let my = d3.mouse(this)[1];
		svgScatter.selectAll('.dot')
			.transition()
			.duration(100)
			.ease(d3.easeLinear)
			.attr('r', function(d)
					{
						if(Math.pow(xMap(d)- mx,  2) + Math.pow(yMap(d) - my, 2) <= 2500)
							return 8;
						else
							return 2;
						
					}
			)
			/*.attr('cx', function(d)
					{
						if(Math.pow(xMap(d)- mx,  2) + Math.pow(yMap(d) - my, 2) <= 1600)
							return xMap(d) + (xMap(d) - mx)*5/4;
						else
							return xMap(d);
						
					}
			)
			.attr('cy', function(d)
					{
						if(Math.pow(yMap(d)- mx,  2) + Math.pow(yMap(d) - my, 2) <= 1600)
							return yMap(d) + (yMap(d) - my)*5/4;
						else
							return yMap(d)*;
						
					}
			)*/;
	}
	var handleMouseOverSvgScatter = function()
	{
		exploringSvgScatter = true;
	}
	var handleMouseMoveOutSvgScatter = function()
	{
		exploringSvgScatter = false;
	}

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
				.attr('r',2)
				.style('opacity', 1);
				
	}
	
	var handleMouseOverDot = function(d, i)
	{	
		planetTooltip = d3.select("#infoCardScatter");
		svgBar.selectAll('.bar')
				.style('opacity', 0.2);
		svgBar.selectAll('.bar'+nameDMDeleteSpace(d.discoverymethod))
				.style('opacity', 1);


		svgScatter.selectAll('.dot')
				.style('opacity', 0.2);
		d3.select(this)
				.attr('r', 5)
				.style('opacity', 1);
				
		
	}
	var handleMouseOutDot = function(d, i)
	{	
		planetTooltip = d3.select("#infoCardScatter");
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
			limitsScatter.minX = (px + limitsScatter.minX)/2;
			limitsScatter.maxX = (px + limitsScatter.maxX)/2;
			limitsScatter.minY = (py + limitsScatter.minY)/2;
			limitsScatter.maxY = (py + limitsScatter.maxY)/2;
			
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
		
		svgScatter.selectAll('.axis')
				.style('visibility','hidden');

		svgScatter.selectAll('.dot')
				.style('visibility','hidden');


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
		
		var xSScale = d3.scaleLinear().range([0,widthScatter]);
		var rSScale = d3.scaleLinear().range([0,widthScatter]);
		var ySScale = d3.scaleLinear().range([heightScatter,0]);
		 xSScale.domain([-60,60]);
		 rSScale.domain([0,8000]);
		 ySScale.domain([-60,60]);

		
		svgScatter.select(".xAxisScatter")
		  //.attr("transform", "translate(0," + yScaleScatter(0) + ")")
		  .call(xSScale)
		svgScatter.select(".yAxisScatter")
		  //.attr("transform", "translate(0," + yScaleScatter(0) + ")")
		  .call(ySScale)
		svgScatter.selectAll('.solarSystem')
			.data(solarSystem)
			.enter()
			.append('circle')
			.attr('class','solarSystem')
			.attr('id', d => d.name)
			.attr('r', d => rSScale(d.r))
			.style('fill', d => d.color)
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
			.style('fill', 'none')
			.style('stroke', d=> d.color);
			/*.attr('x1', function(d) {
					
					return xSScale(d.distance*Math.cos(Math.PI*(d.initialAngle -12*2/d.velocity )));
				})
			.attr('x2', function(d) {
					//d.initialAngle = d3.randomUniform(0, 2)();
					return xSScale(d.distance*Math.cos(Math.PI*d.initialAngle));
				})
			.attr('y1', function(d) {
					
					return ySScale(d.distance*Math.sin(Math.PI*(d.initialAngle -12*2/d.velocity )));
				})
			.attr('y2', function(d) {
					//d.initialAngle = d3.randomUniform(0, 2)();
					return ySScale(d.distance*Math.sin(Math.PI*d.initialAngle));
				})
			.style('stroke', d => d.color)
			.style('stroke-width' , d => rSScale(d.r) / 4)*/;

		var simDur = 0;
		var initTicker = d3.interval(e=>{
			svgScatter.selectAll('.solarSystem')
				.transition()
				.duration(20)
				.ease(d3.easeLinear)
				//.attr('class','solarSystem')
				//.attr('r', d => d.r)
				.attr('r', d => rSScale(d.r))
				.attr('cx', function(d)
					{
						d.initialAngle +=  2*2/d.velocity;
						return xSScale(d.distance*Math.cos(Math.PI*d.initialAngle));
					})
				.attr('cy', function(d)
					{
						//d.initialAngle = d3.randomUniform(0, 2)();
						return xSScale(d.distance*Math.sin(Math.PI*d.initialAngle));
					})
			.style('opacity', (220-simDur)/220);
					
		
		svgScatter.selectAll('.solarSystemL')
			.transition()
			.duration(30)
			.ease(d3.easeLinear)
			.attr('r', d =>xSScale(d.distance)-xSScale(0))
			.attr('cx', d =>xSScale(0))
			.attr('cy', d =>xSScale(0))
			.style('opacity', (220-simDur)/220);
			//.style('fill', 'none')
			//.style('stroke', => d.color);
			/*.attr('x1', function(d) {
					
					return xSScale(d.distance*Math.cos(Math.PI*(d.initialAngle -0.1)));
				})
			.attr('x2', function(d) {
					//d.initialAngle = d3.randomUniform(0, 2)();
					return xSScale(d.distance*Math.cos(Math.PI*d.initialAngle));
				})
			.attr('y1', function(d) {
					
					return ySScale(d.distance*Math.sin(Math.PI*(d.initialAngle - 0.1 )));
				})
			.attr('y2', function(d) {
					//d.initialAngle = d3.randomUniform(0, 2)();
					return ySScale(d.distance*Math.sin(Math.PI*d.initialAngle));
				})
			.style('stroke-width' , d => rSScale(d.r) / 4)*/;	
			
			if(simDur > 80)
			{
				 xSScale.domain([-60 *(1+(simDur - 79)/10),60 *(1+(simDur - 79)/10)]);
				 rSScale.domain([0 *(1+(simDur - 79)/10),8000*(1+(simDur - 79)/10)]);
				 ySScale.domain([-60*(1+(simDur - 79)/10),60*(1+(simDur - 79)/10)]);
				svgScatter.select(".xAxisScatter")
				  //.attr("transform", "translate(0," + yScaleScatter(0) + ")")
				  .call(xSScale)
				svgScatter.select(".yAxisScatter")
				  //.attr("transform", "translate(0," + yScaleScatter(0) + ")")
				  .call(ySScale)
			}
			simDur +=1;
			if(simDur == 180)
			{
				xScaleScatter.domain([-limitsScatter.maxX, limitsScatter.maxX]);
				yScaleScatter.domain([limitsScatter.minY, limitsScatter.maxY]);
				
				svgScatter.selectAll('.axis')
						.style('visibility','visible');
				svgScatter.select('.xAxisScatter')
						.transition()
						.duration(50)
						.ease(d3.easeLinear)
					.attr("transform", "translate(0," + xScaleScatter(0) + ")")
					.call(xAxisScatter);
				svgScatter.select('.yAxisScatter')
						.transition()
						.duration(50)
						.ease(d3.easeLinear)
					.attr("transform", "translate(" + xScaleScatter(0) + ",0)")
					.call(yAxisScatter);
				
				svgScatter.selectAll('.dot').data([]).exit().remove();
			}
			if(simDur == 220)
			{
				initTicker.stop();
				svgScatter.selectAll('.solarSystem')
						.style('visibility','hidden');

				svgScatter.selectAll('.solarSystemL')
						.style('visibility','hidden');
				
				
			
				animationPart2();
			}
		},30);

	
	}
	var animationPart2 = function ()
	{
		svgScatter.selectAll('.axis')
				.style('visibility','visible');

		svgScatter.selectAll('.dot')
				.style('visibility','visible');
		
		resetFilter();

		year = 1989; //1989 
		month = 5; //5
		var counter = 0;
		var tope = 0;
		var prevLen = 0;
		tickDuration = 200;
		var tickMinimum = 400;
		var thickMaximum = 7000;
		
		
		var ticker = d3.interval(e => {
			
			svgLines.select('.Limit2').data().forEach(d=> d.x = xScaleLines(timeConv(year + '-' + month)));
			svgLines.select('.Limit2').attr('cx',d=>d.x);
			filterInTime();
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
				.on('click', handleClickBar)
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
				planetsData = dataScatter.filter(d => (d.qym <= year*12 + month) && (d.qym >=12));
				tope = Math.floor((planetsData.length - prevLen)/10) + 1;
				prevLen =  planetsData.length;
				if(tope > 1)
				{
					console.log(tope);
				}
			}
			counter +=1;
			planetsData = dataScatter.filter(d => ((d.qym < year*12 + month) || (d.qym == year*12 + month && d.filterTime <= counter*10)) && (d.qym >=12));
			
				
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
				.style('visibility','visible')
				.on('mouseover', handleMouseOverDot)
				.on('mouseout', handleMouseOutDot)
				.on('click', handleClickDot)
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
					.style('visibility','visible')
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
    widthBars = 600 - marginBarChart.left - marginBarChart.right,
    heightBars = 280 - marginBarChart.top - marginBarChart.bottom;    
	// SVG Bars
	var svgBar;

	// Duration in ms fo the transition in animations
    var tickDuration = 200;
	// Maximum number of barrs allowed in the plot
    var top_n = 11;
	//var top_n = 4;
	//Scales for barchart plot
    var xScaleBars = d3.scaleLinear();
    var yScaleBars = d3.scaleLinear();
    var xAxisBars = d3.axisTop()
        .scale(xScaleBars)
        .ticks(widthBars > 500 ? 5:2)
        .tickSize(-(heightBars-marginBarChart.top-marginBarChart.bottom))
        .tickFormat(d => d3.format(',')(d));
	var barPadding = (heightBars-(marginBarChart.bottom+marginBarChart.top))/(top_n*5);
	
	// Manage the time in the animation is showing
	var yearSlice;
	var year = 2020; //1989 
	var month = 10; //5
	var yearText;

  

    d3.csv("./data/dataChartRace.csv").then( function(data) {
		dataBarchart = data;
		
		svgBar = d3.select("#SvgBars")
		//.attr("width", widthBars + marginBarChart.left + marginBarChart.right)
		//.attr("height", heightBars + marginBarChart.top + marginBarChart.bottom)
		.attr('width', '100%')
		.attr('height', '100%')
		.attr('viewBox','0 0 '+  widthBars +' '+ heightBars)
		.attr('preserveAspectRatio','xMinYMin')
		//.append('g')
		;
		/*.attr("width",'100%')
		.attr("height", '100%')
		.attr('viewBox','0 0 '+ Math.min(widthBars,heightBars) + ' ' + Math.min(widthBars,heightBars))
		.attr('preserveAspectRatio',)
      */
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
		 .attr('x', widthBars)
		 .attr('y', heightBars-5)
		 .style('text-anchor', 'end')
		 .html('Nasa Exoplanets');*/

		//if (error) throw error;
		//console.log(dataBarchart)
		;
		  
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
        .range([marginBarChart.left, widthBars-marginBarChart.right-65]);
  
		yScaleBars
        .domain([top_n, 0])
        .range([heightBars-marginBarChart.bottom, marginBarChart.top]);
  
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
			.on('mouseout', handleMouseOutBar)
			.on('click', handleClickBar);
      
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
		  .style('fill', 'white')
		  .style('font-size', 20)
		  .style('background', 'black')
		  .attr('x', widthBars-2*marginBarChart.right)
		  .attr('y', heightBars-25)
		  .style('text-anchor', 'middle')
		  .html(~~year)
		  //.call(halo, 10);
  
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
	var marginLines = {top: 20, right: 20, bottom: 90, left: 60},
    widthLines = 700 - marginLines.left - marginLines.right,
    heightLines = 300 - marginLines.top - marginLines.bottom;
	
	var xScaleLines = d3.scaleTime().range([0,widthLines]);
	var yScaleLines = d3.scaleLinear().rangeRound([heightLines,0]);
	
	var xAxisLines = d3.axisBottom();
	var yAxisLines = d3.axisLeft();
	
	var spheresFilters;
	
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
			//.attr('width', '100%')
			//.attr('height', '100%')
			//.attr('viewBox','0 0 '+  widthLines +' '+ heightLines)
			//.attr('preserveAspectRatio','xMinYMin')
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
		
		svgLines.selectAll('.domain')
			.style('stroke','white')
			.style('stroke-width','2px');
		svgLines.selectAll('.axis>.tick>text')
			.style('color','white')
			.style("font-size",15);
		
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

		// ------------- Slider for the  filter
		svgLines.append('line')
			.attr('class','filterTime')				
			.attr('x1', 0)
			.attr('x2', widthLines )
			.attr('y1', heightLines + 1/2*marginLines.bottom)
			.attr('y2', heightLines + 1/2*marginLines.bottom)
			.style('stroke','#777')
			.style('stroke-width','5');

		svgLines.append('line')
			.attr('class','filterTime realFilter')				
			.attr('x1', 0)
			.attr('x2', widthLines )
			.attr('y1', heightLines + 1/2*marginLines.bottom)
			.attr('y2', heightLines + 1/2*marginLines.bottom)
			.style('stroke','white')
			.style('stroke-width','5');
		
		var filters = [{name:'Limit1', x:0},{name:'Limit2',x:widthLines}];
		
		spheresFilters = svgLines.selectAll('.filterTimeS')
			.data(filters)
			.enter()
			.append('circle')
			.attr('class',d => 'filterTimeS ' + d.name)				
			.attr('r', 10)
			.attr('cx', (d,i) => d.x)
			.attr('cy', heightLines + 1/2*marginLines.bottom)
			.style('stroke','#999')
			.style('stroke-width','5')
			.call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended)
                  );
		filterText = svgLines.append('text')
		  .attr('class', 'yearText')
		  .style('fill', 'white')
		  .style('font-size', 20)
		  .style('background', 'black')
		  .attr('x', widthLines/2-2)
		  .attr('y', heightLines + marginLines.bottom - 5 )
		  .style('text-anchor', 'middle')
		  .html('-');

	});
    

	
	var filterDotsmin = 0;
	var filterDotsmax = widthLines;

	function resetFilter()
	{
		spheresFilters.data().forEach(function(d,i){d.x = i*widthLines;});
	    spheresFilters.attr("cx", d=> d.x);
		filterInTime();
	}

	function dragstarted(d) {
		d3.select(this).raise().classed("active", true);
	}

	function dragged(d) 
	{
		d3.select(this).attr("cx", d.x = d3.max([d3.min([d3.event.x,widthLines]),0]));
		filterInTime();
	}

	function filterInTime()
	{
		filterDotsmin = d3.min(spheresFilters.data().map(r=>r.x));
		filterDotsmax = d3.max(spheresFilters.data().map(r=>r.x));
		svgLines.select('.realFilter')	
			.attr('x1', filterDotsmin)
			.attr('x2', filterDotsmax)
			.attr('y1', heightLines + 1/2*marginLines.bottom)
			.attr('y2', heightLines + 1/2*marginLines.bottom);
		svgScatter.selectAll('.dot')
			.filter(d => xScaleLines(timeConv(d.disc_pubdate)) >=filterDotsmin && xScaleLines(timeConv(d.disc_pubdate)) <=filterDotsmax)
			.style('visibility','visible');

		svgScatter.selectAll('.dot')
			.filter(d => !(xScaleLines(timeConv(d.disc_pubdate)) >=filterDotsmin && xScaleLines(timeConv(d.disc_pubdate)) <=filterDotsmax))
			.style('visibility','hidden');
		var format = d3.timeFormat("%Y-%m");
		filterText.html(format(xScaleLines.invert(filterDotsmin)) + ' to ' + format(xScaleLines.invert(filterDotsmax)));
		filterText2.html(format(xScaleLines.invert(filterDotsmin)) + ' to ' + format(xScaleLines.invert(filterDotsmax)));
	}

	function dragended(d) {
		d3.select(this).classed("active", false);
	}

	

	
	
// #endregion
// ----------------------------------------------------------  END Lines plot -----------------------------------------------------------------------  //