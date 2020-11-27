/*
// load data
d3.csv("./data/dataChartRace.csv", function(error, data) {
	
	
	
	var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 560 - margin.left - margin.right,
    height = 560 - margin.top - margin.bottom;

	var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

	var tickDuration = 500;
    var top_n = 31;
	let barPadding = (height-(margin.bottom+margin.top))/(top_n*5);
	let year = 1989;
	data.forEach(function(d) {
        d.Value = +d.Value,
        d.LastValue = +d.LastValue,
        d.Value = isNaN(d.Value) ? 0 : d.Value,
        d.Year = +d.Year,
        d.colour = d3.hsl(Math.random()*360,0.75,0.75)
	});
	let yearSlice  = data.filter(function(d) { return d.Year == year && !isNaN(d.Value)})
      .sort((a,b) => b.value - a.value)
      .slice(0, top_n);
	
	yearSlice.forEach(function(d,i){d.rank = i});
	
	let x = d3.scale.linear()
        .domain([0, d3.max(yearSlice, function(d){return d.Value})])
        .range([margin.left, width-margin.right-65]);
		
	let y = d3.scale.linear()
        .domain([11, 0])
        .range([height-margin.bottom, margin.top]);	
		
	let xAxis = d3.axisTop()
        .scale(x)
        .ticks(width > 500 ? 5:2)
        .tickSize(-(height-margin.top-margin.bottom))
        .tickFormat(d => d3.format(',')(d));
		
	svg.append('g')
       .attr('class', 'axis xAxis')
       .attr('transform', 'translate(0, ${margin.top})')
       .call(xAxis)
       .selectAll('.tick line')
       .classed('origin', function(d){return d == 0;});
	   
	svg.selectAll('rect.bar')
        .data(yearSlice, function(d){return d.Method;})
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x(0)+1)
        .attr('width', d => x(d.Value)-x(0)-1)
        .attr('y', d => y(d.rank)+5)
        .attr('height', y(1)-y(0)-barPadding)
        .style('fill', d => d.colour);
	
      

});*/

 // Feel free to change or delete any of the code you see in this editor!


    
    
    
    var tickDuration = 500;
    var top_n = 11;

	var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

	var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    

  
    let barPadding = (height-(margin.bottom+margin.top))/(top_n*5);
      
    let title = svg.append('text')
     .attr('class', 'title')
     .attr('y', 24)
     .html('Discovery method per planets');
  
    let subTitle = svg.append("text")
     .attr("class", "subTitle")
     .attr("y", 55)
     .html("Number of planets");
   
    let caption = svg.append('text')
     .attr('class', 'caption')
     .attr('x', width)
     .attr('y', height-5)
     .style('text-anchor', 'end')
     .html('Nasa Exoplanets');

     let year = 1989;
	 let month = 5;
    d3.csv("./data/dataChartRace.csv", function(error, data) {
    //if (error) throw error;
      
      console.log(data);
      
       data.forEach(d => {
        d.value = +d.value,
        d.lastValue = +d.lastValue,
        d.value = isNaN(d.value) ? 0 : d.value,
        d.year = +d.year,
        d.yearR = +d.yearR,
        d.monthnumber = +d.monthnumber,
        d.colour = d3.hsl(Math.random()*360,0.75,0.75)
      });

     console.log(data);
    
     let yearSlice = data.filter(d => d.yearR == year && !isNaN(d.value) && d.monthnumber == month)
      //.sort((a,b) => b.value - a.value)
      .slice(0, top_n);
  
      yearSlice.forEach((d,i) => d.rank = i);
    
     console.log('yearSlice: ', yearSlice)
  
     let x = d3.scale.linear()
        .domain([0, d3.max(yearSlice, d => d.value)])
        .range([margin.left, width-margin.right-65]);
  
     let y = d3.scale.linear()
        .domain([top_n, 0])
        .range([height-margin.bottom, margin.top]);
  
     let xAxis = d3.svg.axis()
        .scale(x)
		.orient("top")
        .ticks(width > 500 ? 5:2)
        .tickSize(-(height-margin.top-margin.bottom))
        .tickFormat(d => d3.format(',')(d));
  
     svg.append('g')
       .attr('class', 'axis xAxis')
       .attr('transform', 'translate(0, ' + margin.top + ')')
       .call(xAxis)
       .selectAll('.tick line')
       .classed('origin', d => d == 0);
  
     svg.selectAll('rect.bar')
        //.data(yearSlice, d => d.name)
		.data(yearSlice)
        .enter()
        .append('rect')
        .attr('class', d=>'bar '+d.method)
        .attr('x', x(0)+1)
        .attr('width', d => x(d.value)-x(0))
        .attr('y', d => y(d.rank)+5)
        .attr('height', y(1)-y(0)-barPadding)
        .style('fill', d => d.colour);
      
     svg.selectAll('text.label')
        //.data(yearSlice, d => d.name)
		.data(yearSlice)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.value)-8)
        .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
        .style('text-anchor', 'end')
        .html(d => d.method);
      
    svg.selectAll('text.valueLabel')
        //.data(yearSlice, d => d.name)
		.data(yearSlice)
      .enter()
      .append('text')
      .attr('class', 'valueLabel')
      .attr('x', d => x(d.value)+5)
      .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
      .text(d => d3.format(',.0f')(d.lastValue));

    let yearText = svg.append('text')
      .attr('class', 'yearText')
      .attr('x', width-margin.right)
      .attr('y', height-25)
      .style('text-anchor', 'end')
      .html(~~year)
      .call(halo, 10);
     
   let ticker = d3.timer(e => {
		sleep(tickDuration/2);
      yearSlice = data.filter(d => d.yearR == year && !isNaN(d.value) && d.monthnumber == month)
        .sort((a,b) => b.value - a.value)
        .slice(0,top_n);

      yearSlice.forEach((d,i) => d.rank = i);
     
      //console.log('IntervalYear: ', yearSlice);

      x.domain([0, d3.max(yearSlice, d => d.value)]); 
     
      svg.select('.xAxis')
        .transition()
        .duration(tickDuration)
        .ease("linear")
        .call(xAxis);
    
       let bars = svg.selectAll('.bar').data(yearSlice);
    
       bars
        .enter()
        .append('rect')
        .attr('class', d => 'bar'+ d.method)
        .attr('x', x(0)+1)
        .attr( 'width', d => x(d.value)-x(0)-1)
        .attr('y', d => y(top_n+1)+5)
        .attr('height', y(1)-y(0)-barPadding)
        .style('fill', d => d.colour)
        .transition()
          .duration(tickDuration)
          .ease("linear")
          .attr('y', d => y(d.rank)+5);
          
       bars
        .transition()
          .duration(tickDuration)
          .ease("linear")
          .attr('width', d => x(d.value)-x(0)-1)
          .attr('y', d => y(d.rank)+5);
            
       bars
        .exit()
        .transition()
          .duration(tickDuration)
          .ease("linear")
          .attr('width', d => x(d.value)-x(0)-1)
          .attr('y', d => y(top_n+1)+5)
          .remove();

       let labels = svg.selectAll('.label')
          .data(yearSlice, d => d.method);
     
       labels
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.value)-8)
        .attr('y', d => y(top_n+1)+5+((y(1)-y(0))/2))
        .style('text-anchor', 'end')
        .html(d => d.method)    
        .transition()
          .duration(tickDuration)
          .ease("linear")
          .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
             
    
   	   labels
          .transition()
          .duration(tickDuration)
            .ease("linear")
            .attr('x', d => x(d.value)-8)
            .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
     
       labels
          .exit()
          .transition()
            .duration(tickDuration)
            .ease("linear")
            .attr('x', d => x(d.value)-8)
            .attr('y', d => y(top_n+1)+5)
            .remove();
         

     
       let valueLabels = svg.selectAll('.valueLabel').data(yearSlice, d => d.method);
    
       valueLabels
          .enter()
          .append('text')
          .attr('class', 'valueLabel')
          .attr('x', d => x(d.value)+5)
          .attr('y', d => y(top_n+1)+5)
          .text(d => d3.format(',.0f')(d.lastValue))
          .transition()
            .duration(tickDuration)
            .ease("linear")
            .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
            
       valueLabels
          .transition()
            .duration(tickDuration)
            .ease("linear")
            .attr('x', d => x(d.value)+5)
            .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
            .tween("text", function(d) {
               let i = d3.interpolateRound(d.lastValue, d.value);
               return function(t) {
                 this.textContent = d3.format(',')(i(t));
              };
            });
      
     
      valueLabels
        .exit()
        .transition()
          .duration(tickDuration)
          .ease("linear")
          .attr('x', d => x(d.value)+5)
          .attr('y', d => y(top_n+1)+5)
          .remove();
    
      yearText.html(year + '-' + month);
    // sleep(tickDuration);
	month +=1;
	if(month == 13)
	{
		month = 1;
		year++;
	}
     if(year == 2020 && month > 10) ticker.stop();
//     year = d3.format('.1f')((+year) + 0.1);
   },tickDuration,tickDuration);

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

