//----------------------------------------------------------- Common --------------------------------------------------------------------------------//
	 
	var limitsScatter = {minX:0,maxX:0,minY:0,maxY:0, topMaxX:0, topMinX:0, topMaxY:0, topMinY:0};
	var planetTooltip = d3.select("#infoCardScatter");
	var methodTooltip = d3.select("#infoCardBars");
	var exploringSvgScatter = false;
	var filterLimits = {min:"",max:""}
	var stopAnim = false;
	var animationInProgress = false;
	var animationInProgress2 = false;
	
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
		
		var left = parseFloat(d3.select(this).attr('cx')) + 10;
		var top = parseFloat(d3.select(this).attr('cy')) + 10; 
		
		if(left + planetTooltip.node().getBoundingClientRect().width > svgScatter.node().parentNode.getBoundingClientRect().width)
		{
			left = svgScatter.node().parentNode.getBoundingClientRect().width  - planetTooltip.node().getBoundingClientRect().width - 20; 
		}
		planetTooltip.style('left',left + 'px');
		/*f(top + planetTooltip.node().getBoundingClientRect().height > svgScatter.node().parentNode.getBoundingClientRect().height)
		{
			top = svgScatter.node().parentNode.getBoundingClientRect().height - planetTooltip.node().getBoundingClientRect().height - 20; 
		}*/
		planetTooltip.style('top',top + 'px');
		planetTooltip.raise();
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
				//.style('left',(d3.select(this).attr('cx') +250 ) + 'px')
				//.style('top',(d3.select(this).attr('cy') + 250 ) + 'px' )
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
				.select('#txtDistanceSystem').html('<u>Distance from earth :</u> ' + d.sy_dist + ' lightyears');
		planetTooltip
				.select('#txtHostStar').html('<u>Star :</u> ' + d.hostname);
		planetTooltip
				.select('#txtNumberorPlanets').html('<u>No of planets in the system:</u> ' + d.sy_pnum);
		planetTooltip
				.select('#txtStarMass').html('<u>Mass:</u> ' + d.st_mass + ' times sun mass');
		planetTooltip
				.select('#txtStarSize').html('<u>Size:</u>  ' + d.st_rad + ' times sun size');
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
				//.style("border-color", "white")
				//.style("border", "solid")
				//.style("border-width", "4px")
				//.style("border-radius", "5px")
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
				.attr('r', 7)
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
		if(animationInProgress) 
		{
			year = 2020;
			month = 09;
			return;
		}
		animationInProgress = true;
		animationInProgress2 = true;
		svgScatter.selectAll('.axis')
				.style('opacity',0)
				.style('visibility','hidden');
		svgScatter.selectAll('.scatterLabel')
				.style('visibility','hidden');
	
		var divisor = 1/4;
	
		xSScale.domain([-60*divisor,60*divisor]);
		rSScale.domain([0,8000*divisor]);
		ySScale.domain([-60*divisor,60*divisor]);
		
		
		var lineHint = svgScatter
						.append('line')
						.attr('id','lineHint')
						.attr('x1',xSScale(0))
						.attr('x2',xSScale(0))
						.attr('y1',ySScale(0))
						.attr('y2',ySScale(0))
						.attr('stroke','white')
						.attr('stroke-width','2px')
						.style('visibility','hidden' );
		var textHint = svgScatter
						.append('text')
						.attr('id','textHint')
						.style('color','white')
						.attr("dy", "-1em")
						.style("font-size",11)
						.style('fill','white')
						.style("text-anchor", "start")
						.text('')
						.style('visibility','hidden' );
		var rectangleHint = svgScatter
						.append('rect')
						.attr('id','rectHint')
						.style('fill','black')
						.style('visibility','hidden' );
			
		
		svgScatter.selectAll('.dot')
				.data([])
				.style('visibility','hidden')
				.exit()
				.remove();
		svgScatter.selectAll('.solarSystem')
				//.attr('class','solarSystem')
				//.attr('r', d => d.r)
				.attr('r', d => rSScale(d.r))
				.attr('cx', function(d)
					{
						return ySScale(d.distance*Math.cos(Math.PI*d.initialAngle)) - ySScale(0) + xSScale(0);
					})
				.attr('cy', function(d)
					{
						//d.initialAngle = d3.randomUniform(0, 2)();
						return ySScale(d.distance*Math.sin(Math.PI*d.initialAngle));
					});
		svgScatter.selectAll('.solarSystemL')
			.attr('r', d =>ySScale(-d.distance) -ySScale(0))
			.attr('cx', d =>xSScale(0))
			.attr('cy', d =>ySScale(0));
			
	    svgScatter.selectAll('.solarSystemT')
			.attr('x', function(d,i) {
					//d.initialAngle = d3.randomUniform(0, 2)();
					//if(i==0) return xSScale(0); else
					return ySScale(d.distance*Math.cos(Math.PI*d.initialAngle)) - ySScale(0) + xSScale(0);// - rSScale(d.r);
				})
			.attr('y', function(d,i) {
					//d.initialAngle = d3.randomUniform(0, 2)();
					//if(i==0) return ySScale(0); else
					return ySScale(d.distance*Math.sin(Math.PI*d.initialAngle)) - rSScale(d.r);
				});
		
		svgScatter.selectAll('.solarSystem')
				.style('visibility',(d,i)=> i <=3? 'visible':'hidden');
		
		svgScatter.selectAll('.solarSystemL')
				.style('visibility',(d,i)=> i <= 3? 'visible':'hidden');
				
		svgScatter.selectAll('.solarSystemT')
				.style('visibility',(d,i)=> i <= 3? 'visible':'hidden');
				
		svgScatter.selectAll('.dot').data([]).exit().remove();


		

		var simDur = 0;
		var middleInterval = 0;
		var tickInt = 45;
		var steps = 0;
		var initTicker = d3.interval(e=>{
			svgScatter.selectAll('.solarSystem')
				.transition()
				.duration(tickInt)
				.ease(d3.easeLinear)
				//.attr('class','solarSystem')
				//.attr('r', d => d.r)
				.attr('r', d => rSScale(d.r))
				.attr('cx', function(d)
					{
						d.initialAngle +=  2*1.5/d.velocity;
						return ySScale(d.distance*Math.cos(Math.PI*d.initialAngle))  - ySScale(0) + xSScale(0);
					})
				.attr('cy', function(d)
					{
						//d.initialAngle = d3.randomUniform(0, 2)();
						return ySScale(d.distance*Math.sin(Math.PI*d.initialAngle));
					})
			.style('opacity', (220-simDur)/220);
					
		
		svgScatter.selectAll('.solarSystemL')
			.transition()
			.duration(tickInt)
			.ease(d3.easeLinear)
			.attr('r', d =>ySScale(-d.distance)-ySScale(0))
			.attr('cx', d =>xSScale(0))
			.attr('cy', d =>ySScale(0))
			.style('opacity', (220-simDur)/220);
		
		 svgScatter.selectAll('.solarSystemT')
			.transition()
			.duration(tickInt)
			.ease(d3.easeLinear)
			.attr('x', function(d,i) {
					//if(i==0) return xSScale(0); else
					return ySScale(d.distance*Math.cos(Math.PI*d.initialAngle)) - ySScale(0) + xSScale(0) ;//- rSScale(d.r);
				})
			.attr('y', function(d,i) {
					//d.initialAngle = d3.randomUniform(0, 2)();
					//if(i==0) return ySScale(0); else
					return ySScale(d.distance*Math.sin(Math.PI*d.initialAngle)) - rSScale(d.r)
				});
			
			if(simDur == 10)
			{
				if (steps == 0)
				{
					lineHint
						.attr('x1',ySScale(0))
						.attr('x2',ySScale(0))
						.attr('y1',ySScale(0))
						.attr('y2',ySScale(0))
						//.attr('y1',10+marginScatter.top)
						//.attr('y2',10+marginScatter.top)
						.style('visibility','visible')
						.raise();
					textHint
						.attr('x', xSScale(0))
						.attr('y', ySScale(0))
						.text('Distance Sun-earth = 8 ligth minutes')
						.style('visibility','visible')
						.style('opacity',0)
						.style('background-color','black')
						.style("text-anchor", "start")
						.raise();
					
					rectangleHint
						.attr('x',xSScale(0))
						.attr('y', ySScale(0) - 20)
						.style('visibility','visible')
						.style('opacity',0)
						.style('background-color','black')
						.attr("width",  1)
						.attr("height", 30);
						
					middleInterval = 80;
					steps = 1;
				}
				lineHint
					.transition()
					.duration(tickInt)
					.ease(d3.easeLinear)
					.attr('x1',xSScale(0))
					.attr('x2',(ySScale(-15*d3.min([(80 -middleInterval)/30,1])) - ySScale(0))  + xSScale(0)  )
				    .style('visibility','visible');
				textHint
					.transition()
					.duration(tickInt)
					.ease(d3.easeLinear)
					.style('opacity', d3.min([(80 -middleInterval)/30,1]))
				    .style('visibility','visible');
				rectangleHint
					.transition()
					.duration(tickInt)
					.ease(d3.easeLinear)
					.attr('width',(ySScale(-15*d3.min([(80 -middleInterval)/30,1]))  - ySScale(0))   + xSScale(0)  )
					.style('opacity', d3.min([(80 -middleInterval)/30,0.75]))
				    .style('visibility','visible');
				
			}	
			if(simDur == 20)
			{
				if (steps == 1)
				{	
					lineHint
						.transition()
						.duration(tickInt)
						.ease(d3.easeLinear)
						.attr('x1',xSScale(0))
						.attr('x2',xSScale(0) )
						.style('visibility','hidden');
					textHint
						.transition()
						.duration(tickInt)
						.ease(d3.easeLinear)
						.text('')
						.style("text-anchor", "start")
						.style('opacity', d3.min([7/middleInterval,1]))
						.style('visibility','hidden');
					rectangleHint
						.transition()
						.duration(tickInt)
						.ease(d3.easeLinear)
						.attr('width',0 )
						.style('opacity', 0)
						.style('visibility','hidden');
					svgScatter.selectAll('.solarSystem')
							.transition()
							.duration(tickInt)
							.ease(d3.easeLinear)
							.style('visibility', 'visible')
							.style('opacity', 1);
							
					
					svgScatter.selectAll('.solarSystemL')
							.transition()
							.duration(tickInt)
							.ease(d3.easeLinear)
							.style('visibility', 'visible')
							.style('opacity', 1);
							
					svgScatter.selectAll('.solarSystemT')
							.transition()
							.duration(tickInt)
							.ease(d3.easeLinear)
							.style('visibility', 'visible')
							.style('opacity', 1);
					
					middleInterval = 4;
					steps = 2;
				}
				if(middleInterval == 0)
					divisor=1;
				else
					divisor = 1/middleInterval;
	
				xSScale.domain([-60*divisor,60*divisor]);
				rSScale.domain([0,8000*divisor]);
				ySScale.domain([-60*divisor,60*divisor]);
				
				
			}
			if(simDur == 30)
			{
				if (steps == 2)
				{
					lineHint
						.attr('x1',ySScale(0))
						.attr('x2',ySScale(0))
						.attr('y1',ySScale(0))
						.attr('y2',ySScale(0))
						//.attr('y1',10+marginScatter.top)
						//.attr('y2',10+marginScatter.top)
						.style('visibility','visible')
						.raise();
					textHint
						.attr('x', xSScale(0))
						.attr('y', ySScale(0))
						.style('visibility','visible')
						.style('opacity',0)
						.style("text-anchor", "start")
						.style('background-color','black')
						.raise();
					
					rectangleHint
						.attr('x',xSScale(0))
						.attr('y', ySScale(0) - 20)
						.style('visibility','visible')
						.style('opacity',0)
						.style('background-color','black')
						.attr("width",  1)
						.attr("height", 30);
						
					middleInterval = 80;
					steps = 3;
				}
				lineHint
					.transition()
					.duration(tickInt)
					.ease(d3.easeLinear)
					.attr('x1',xSScale(0))
					.attr('x2',(ySScale(-76*d3.min([(80 -middleInterval)/30,1])) - ySScale(0))  + xSScale(0)  )
				    .style('visibility','visible');
				textHint
					.transition()
					.duration(tickInt)
					.ease(d3.easeLinear)
					.text('Distance Sun-neptune = 4 ligth hours')
					.style('opacity', d3.min([(80 -middleInterval)/30,1]))
				    .style('visibility','visible');
				rectangleHint
					.transition()
					.duration(tickInt)
					.ease(d3.easeLinear)
					.attr('width',(ySScale(-76*d3.min([(80 -middleInterval)/30,1]))  - ySScale(0))   + xSScale(0)  )
					.style('opacity', d3.min([(80 -middleInterval)/30,0.75]))
				    .style('visibility','visible');
				
			}	
			if(simDur == 40)
			{
				
					lineHint
						.transition()
						.duration(tickInt)
						.ease(d3.easeLinear)
						.attr('x1',xSScale(0))
						.attr('x2',xSScale(0) )
						.style('visibility','hidden');
					textHint
						.transition()
						.duration(tickInt)
						.ease(d3.easeLinear)
						.attr('x',xSScale(0))
						.attr('y',ySScale(0))
						.text('')
						.style('opacity', d3.min([7/middleInterval,1]))
						.style('visibility','hidden');
					rectangleHint
						.transition()
						.duration(tickInt)
						.ease(d3.easeLinear)
						.attr('width',0 )
						.style('opacity', 0)
						.style('visibility','hidden');
						
					 svgScatter.selectAll('.solarSystemT')
						.transition()
						.duration(tickInt)
						.ease(d3.easeLinear)
						.attr('width',0 )
						.style('opacity', 0)
						.style('visibility','hidden');
				
				
				
			}
			
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
			if(simDur >= 180 && simDur <= 194)
			{
				xScaleScatter.domain([-1, 1]);
				yScaleScatter.domain([-1, 1]);
				
				svgScatter.selectAll('.axis')
				//		.style('opacity',0)
				        .style('visibility','visible');
				svgScatter.select('.xAxisScatter')
						.transition()
						.duration(tickInt)
						.ease(d3.easeLinear)
					.attr("transform", "translate(0," + ySScale(0) + ")")
						.style('opacity', (simDur - 179)/15)
					.call(xAxisScatter);
				svgScatter.select('.yAxisScatter')
						.transition()
						.duration(tickInt)
						.ease(d3.easeLinear)
						.style('opacity',(simDur - 179)/15)
					.attr("transform", "translate(" + xSScale(0) + ",0)")
					.call(yAxisScatter);
				
				
		
			}
			if(simDur >= 216 && simDur <= 220)
			{
				let tempo = simDur - 216;
				
				xScaleScatter.domain([-0.25*tempo, 7 * tempo / 4]);
				yScaleScatter.domain([-0.25*tempo, 3*tempo]);
				
				
				svgScatter.select('.xAxisScatter')
						.transition()
						.duration(tickInt)
						.ease(d3.easeLinear)
					//.attr("transform", "translate(0," + xScaleScatter(0) + ")")
					.call(xAxisScatter);
				svgScatter.select('.yAxisScatter')
						.transition()
						.duration(tickInt)
						.ease(d3.easeLinear)
					//attr("transform", "translate(" + yScaleScatter(0) + ",0)")
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
						
				svgScatter.selectAll('.scatterLabel')
						.style('visibility','visible');
				
				
				
				d3.selectAll('.animateBtn').attr('class','btn btn-warning animateBtn').html('Go to year 2020');
				animationInProgress2 = false;
				animationPart2();
			}
			if(middleInterval <=0)
				simDur +=1;
			else
				middleInterval -=1;
		},tickInt);

	
	}
	
	var animationStop = function()
	{	
		year = 2019;
		month = 01;
		stopAnim = true;
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
		tickDuration = 150;
		var tickMinimum = 400;
		var thickMaximum = 7000;
		svgLines.select('.filterTimeS').data().forEach(d=> d.x = xScaleLines(timeConv(year + '-' + month)));
		svgLines.select('.filterTimeS').attr('cx',d=>d.x);
		
		
		var ticker = d3.interval(e => {
			
			
			svgLines.select('.Limit2').data().forEach(d=> d.x = xScaleLines(timeConv(year + '-' + month)));
			svgLines.select('.Limit2').attr('cx',d=>d.x);
			
			svgLines.select('.realFilter').style('stroke','#E14ECA');
			
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
			
			svgScatter.selectAll('.xAxisScatter>.tick>text')
				.attr("transform", "rotate(-40)");
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
			if(!stopAnim)
			{
				bars
					.transition()
					  .duration(tickDuration)
					  .ease(d3.easeLinear)
					  .attr('width', d => xScaleBars(d.value)-xScaleBars(0)-1)
					  .attr('y', d => yScaleBars(d.rank)+5);
			}
			else
			{
				bars
				  .attr('width', d => xScaleBars(d.value)-xScaleBars(0)-1)
				  .attr('y', d => yScaleBars(d.rank)+5);	
			}
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
			if(!stopAnim)
			{
				labels
					.html(d => d.method + '(' + d.value + ')')
					.transition()
					.duration(tickDuration)
						.ease(d3.easeLinear)
						.attr('x', d => xScaleBars(d.value))
						.attr('y', d => yScaleBars(d.rank)+5+((yScaleBars(1)-yScaleBars(0))/2)+1);
			}
			else
			{
				labels
					.html(d => d.method + '(' + d.value + ')')				
					.attr('x', d => xScaleBars(d.value))
					.attr('y', d => yScaleBars(d.rank)+5+((yScaleBars(1)-yScaleBars(0))/2)+1);
				
			}
			// Exit labels
			labels
				.exit()
					.remove();
			 

		

			// Linechart animation ----------------------------------------------------------------------------------------------------------
			dataLinesAnim1 = dataLines1.filter(d => timeConv(d.code) <= timeConv(year + "-" + month));
			dataLinesAnim1.columns = dataLines1.columns;
			let maxLi, minLi;
			maxLi = -1;
			minLi = 10000;
			dataLinesAnim2 = dataLinesAnim1.columns.slice(4).map(function(id) {
			return {
				id: id,
				values: dataLinesAnim1.map(function(d){
					minLi = (+d[id]) < minLi ? +d[id] : minLi;
					maxLi = (+d[id]) > maxLi ? +d[id] : maxLi;
					return {
						date: timeConv(d.code),
						measurement: +d[id]
					};
				})
			};
			});
			/*let domi = [(0), d3.max(dataLinesAnim2, function(c) {
					return d3.max(c.values, function(d) {
						return d.measurement + 4; });
						})
					];*/
			let domi = [minLi,maxLi + 3];
			yScaleLines.domain(domi);
			
			yAxisLines.scale(yScaleLines);
			//yAxisLines.scale(yScaleLines);
			var sl =svgLines.select('.yAxisLines');
			svgLines.selectAll('.yAxisLines')
				.transition()
				.duration(tickDuration)
				.ease(d3.easeLinear)
				.call(yAxisLines);
				
				
			svgLines.selectAll('.domain')
				.style('stroke','white')
				.style('stroke-width','2px');
			svgLines.selectAll('.axis>.tick>text')
				.style('color','white')
				.style("font-size",15);
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
			if(!stopAnim)
			{
				lines
					.select('.linesPath ')
					.transition()
					  .duration(tickDuration)
						.ease(d3.easeLinear)
						.attr("d", function(d) { return lineGenerator(d.values); })
						;
			}
			else
			{
				lines
					.select('.linesPath ')
						.attr("d", function(d) { return lineGenerator(d.values); })
			}
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
			//let dots = svgScatter.selectAll('.dot').data(planetsData);//, d => d.rowid);
			//tickDuration = d3.max([d3.sum(yearSlice, d=> d.value) * thickMaximum/1292, tickMinimum]);
			if(counter ==0)
			{
				planetsData = dataScatter.filter(d => (d.qym <= year*12 + month) && (d.qym >=12));
				tope = Math.floor((planetsData.length - prevLen)/10) + 1;
				prevLen =  planetsData.length;
				if(tope > 20)
				{
					stopAnim = true;
					counter = tope/2;
				}
			}
			counter +=1;
			planetsData = dataScatter.filter(d => ((d.qym < year*12 + month) || (d.qym == year*12 + month && d.filterTime <= counter*10)) && (d.qym >=12));
			
				
			limitsScatter.minX = d3.min([d3.min(planetsData, xValueScatter),0]);
			limitsScatter.minY = d3.min([d3.min(planetsData, yValueScatter),0]);
			limitsScatter.maxX = d3.max([d3.max(planetsData, xValueScatter),0]);
			limitsScatter.maxY = d3.max([d3.max(planetsData, yValueScatter),0]);
			
			xScaleScatter.domain([-1 + limitsScatter.minX, limitsScatter.maxX + 1]);
			yScaleScatter.domain([-1 + limitsScatter.minY, limitsScatter.maxY + 1]);
			

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
			
			svgScatter.select(".scatterXLabel")
				.transition()
				.duration(tickDuration)
				.ease(d3.easeLinear)
				.attr("y", yScaleScatter(0) )
				.attr("x", xScaleScatter(limitsScatter.maxX))
				.attr("dy", "1em");
				
			svgScatter.select(".scatterYLabel")
				.transition()
				.duration(tickDuration)
				.ease(d3.easeLinear)
			  .attr("y", yScaleScatter(limitsScatter.minY))
			  .attr("x", xScaleScatter(0))
			   //.attr("transform", "translate("+xScaleScatter(0)+"," + yScaleScatter(limitsScatter.maxY)  + "); rotate(-90)")
			  .attr("dy", "1em");
			
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
			if(!stopAnim)
			{
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
			}
			else
			{
				dots
					.style("stroke", "black")
					.style('visibility','visible')
					.attr("r", 2)
					.attr("cx", xMap)
					.attr("cy", yMap);
			}
			// Exit, when removing bars. Not used here
			dots
				.exit()
				/*.transition()
				  .duration(tickDuration)
				  .attr("r", 0)
				  .ease(d3.easeLinear)*/
				  .remove();
			yearText.html(year + '-' + month);
			
			
			if(stopAnim)
			{
				counter = 1;
				tope =1;
				stopAnim = false;
			}
			if(counter >  tope)
			{
				counter = 0;
				month +=1;
				if(month >= 13)
				{
					month = 1;
					year++;
				}
			}

			if((year == 2020 && month > 10) || year>2020 ) {animationInProgress = false ;
			svgLines.select('.realFilter').style('stroke','white');
			d3.selectAll('.animateBtn').attr('class','btn btn-neutral animateBtn').html('Animate');
			ticker.stop()};
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
    heightBars = 260 - marginBarChart.top - marginBarChart.bottom;    
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
		//document.getElementsByTagName('Body')[0].style.zoom = '77%';
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
	var marginLines = {top: 20, right: 20, bottom: 100, left: 60},
    widthLines = 600 - marginLines.left - marginLines.right,
    heightLines = 320 - marginLines.top - marginLines.bottom;
	
	var xScaleLines = d3.scaleTime()
        .range([marginLines.left, widthLines-marginLines.right-65]);
	var yScaleLines = d3.scaleLinear()
        .range([heightLines-marginLines.bottom, marginLines.top]);
	
		
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
				
		
		


		svgLines = d3.select("#SvgLines")
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('viewBox','0 0 '+  widthLines +' '+ heightLines)
			//.attr('viewBox','0 0 '+  Math.min(widthLines,heightLines) +' '+ Math.min(widthLines,heightLines))
			.attr('preserveAspectRatio','xMinYMin')
			//.attr("width", widthLines + marginLines.left + marginLines.right)
			//.attr("height", heightLines + marginLines.top + marginLines.bottom)
			.append("g")
				.attr("transform", "translate(" + marginLines.left + "," + marginLines.top + ")");

		 /*xScaleLines
			.range([marginLines.left, svgLines.node().parentNode.getBoundingClientRect().width -marginLines.right]);
		 yScaleLines
			.range([svgLines.node().parentNode.getBoundingClientRect().height + marginLines.bottom, marginLines.top]);*/
		 xScaleLines
			.range([0, widthLines  - marginLines.right -  marginLines.left]);
		 yScaleLines
			.range([heightLines- marginLines.bottom, 0 ]);
		xAxisLines.scale(xScaleLines);
		yAxisLines.scale(yScaleLines);
			
		svgLines.append("g")
			.attr("class", "axis xAxisLines")
			//.attr("transform", "translate(0," + svgLines.node().parentNode.getBoundingClientRect().height + ")")
			.attr("transform", "translate(0," + (heightLines - marginLines.bottom) + ")")
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
			.style("font-size",10)
			.style('text-anchor', 'end');
		svgLines.selectAll('.xAxisLines>.tick>text')
			.attr("transform", "rotate(-40)");


		
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
			.attr('x2', widthLines - marginLines.left - marginLines.right)
			.attr('y1', heightLines - 1/2*marginLines.bottom)
			.attr('y2', heightLines - 1/2*marginLines.bottom)
			.style('stroke','#777')
			.style('stroke-width','5');

		svgLines.append('line')
			.attr('class','filterTime realFilter')				
			.attr('x1', 0)
			.attr('x2', widthLines - marginLines.left - marginLines.right )
			.attr('y1', heightLines - 1/2*marginLines.bottom)
			.attr('y2', heightLines - 1/2*marginLines.bottom)
			.style('stroke','white')
			.style('stroke-width','5');
		
		var filters = [{name:'Limit1', x:0},{name:'Limit2',x:widthLines - marginLines.left - marginLines.right}];
		
		spheresFilters = svgLines.selectAll('.filterTimeS')
			.data(filters)
			.enter()
			.append('circle')
			.attr('class',d => 'filterTimeS ' + d.name)				
			.attr('r', 10)
			.attr('cx', (d,i) => d.x)
			.attr('cy', heightLines - 1/2*marginLines.bottom)
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
		  .style('font-size', 15)
		  .style('background', 'black')
		  .attr('x', (widthLines - marginLines.left - marginLines.right)/2-2)
		   .attr('y', heightLines- 2/7*marginLines.bottom )
		  //.attr('x',10)
		  //.attr('y',0 )
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
		d3.select(this).attr("cx", d.x = d3.max([d3.min([d3.event.x,widthLines - marginLines.left - marginLines.right]),0]));
		stopAnim = true;
		filterInTime();
		var tickInt = 45;
		var steps = 0;
		
	}

	function filterInTime()
	{
		filterDotsmin = d3.min(spheresFilters.data().map(r=>r.x));
		filterDotsmax = d3.max(spheresFilters.data().map(r=>r.x));
		var format = d3.timeFormat("%Y-%m");
		filterLimits.min = format(xScaleLines.invert(filterDotsmin)) ;
		filterLimits.max = format(xScaleLines.invert(filterDotsmax));
		svgLines.select('.realFilter')	
			.attr('x1', filterDotsmin)
			.attr('x2', filterDotsmax)
			.attr('y1', heightLines - 1/2*marginLines.bottom)
			.attr('y2', heightLines - 1/2*marginLines.bottom);
		svgScatter.selectAll('.dot')
			.filter(d => xScaleLines(timeConv(d.disc_pubdate)) >=filterDotsmin && xScaleLines(timeConv(d.disc_pubdate)) <=filterDotsmax)
			.style('visibility','visible');

		svgScatter.selectAll('.dot')
			.filter(d => !(xScaleLines(timeConv(d.disc_pubdate)) >=filterDotsmin && xScaleLines(timeConv(d.disc_pubdate)) <=filterDotsmax))
			.style('visibility','hidden');
		filterText.html(format(xScaleLines.invert(filterDotsmin)) + ' to ' + format(xScaleLines.invert(filterDotsmax)));
		filterText2.html(format(xScaleLines.invert(filterDotsmin)) + ' to ' + format(xScaleLines.invert(filterDotsmax)));
		if(stopAnim)
		{
			year = parseFloat(format(xScaleLines.invert(filterDotsmax)).substr(0,4));
			month = parseFloat(format(xScaleLines.invert(filterDotsmax)).substr(5,2));
		}
	}

	function dragended(d) {
		d3.select(this).classed("active", false);
	}

	

	
	
// #endregion
// ----------------------------------------------------------  END Lines plot -----------------------------------------------------------------------  //