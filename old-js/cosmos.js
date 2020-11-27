
// load data
d3.csv("./data/data.csv", function(error, data) {
	
	var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 560 - margin.left - margin.right,
    height = 560 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d.sy_dist;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d,i) { 
				//return xScale(Math.log10(xValue(d))*Math.cos(d.ra*Math.PI/180) * Math.cos(d.dec*Math.PI / 180));}, // data -> display
				return xScale(xValue(d)*Math.sin(d.ra*Math.PI/180) * Math.sin(d.dec*Math.PI / 180 - Math.PI/4));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d,i) { return d.sy_dist;}, // data -> value
    
	yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d,i) {
			return yScale(-yValue(d)*Math.sin(d.ra*Math.PI/180) * Math.cos(d.dec*Math.PI / 180 - Math.PI/4));},// data -> display
			//return yScale(Math.log10(yValue(d))*Math.sin(d.ra*Math.PI/180) * Math.cos(d.dec*Math.PI / 180));},// data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");
				;

// setup fill color
var cValue = function(d) {return 'red';},//{ return d.Manufacturer;},
    color = d3.scale.category10();
	
// add the graph canvas to the body of the webpage
//var svg = d3.select("#Cosmos1").append("svg")
var svg = d3.select("#Cosmos1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

	
	
  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.sy_dist = +d.sy_dist;
    d.ra = +d.ra;
    d.dec = +d.dec;
    //d["Protein (g)"] = +d["Protein (g)"];
//    console.log(d);
  });
  //data = data.slice().sort((a, b) => d3.descending(a.sy_dist, b.sy_dist));

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([-d3.max(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([-d3.max(data, yValue)-1, d3.max(data, yValue)+1]);
 // xScale.domain([-Math.log10(d3.max(data, xValue))-1, Math.log10(d3.max(data, xValue))+1]);
  //yScale.domain([-Math.log10(d3.max(data, yValue))-1, Math.log10(d3.max(data, yValue))+1]);
  
  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + yScale(0) + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)	
      .attr("y", -6)
	  //.attr("transform", "translate(0," + ((height)/2 + margin.top) + ")")
      .style("text-anchor", "end")
      .text("Distance");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
	  .attr("transform", "translate(" + xScale(0) + ",0)")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Distance");

  // draw dots
  var circles = svg.selectAll(".dot");
     circles.data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d){if(d.hostname == 'OGLE-2014-BLG-0124L'){console.log(xMap(d));console.log(yMap(d));console.log(d.pl_name);console.log(d.sy_dist);console.log(d.ra);console.log(d.dec);return 25;}else{return 0.5;}})
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));}) ;
     /* .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d) 
	        + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });*/
	var fisheye = d3.fisheye().radi;

	svg.on("mousemove", function() {
		fisheye.center(d3.mouse(this));
		circles.each(function(d) { d.fisheye = fisheye(d); })
            .attr("cx", function(d) { return d.fisheye.x; })
            .attr("cy", function(d) { return d.fisheye.y; })
            .attr("r", function(d) { return 2; });
	});
	
	
    
  // draw legend
  var legend = svg.selectAll(".legend")
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
      .text(function(d) { return d;})
});