
var HOSTNAME = "HostName Unselected"

var circle;

var planetData;

var sizeOfEarth = 9;
var sizeOfMoon = 0.27 * sizeOfEarth;
var distanceFromEToM = 30 * sizeOfEarth;

var currentDistance = sizeOfEarth;
var totalDistance = sizeOfEarth;

var radius = function(d) { return d.pl_rade;}

var namesOfSystems = ["test"];
var numberOfUniqueSystems = 0;
var doesExistInArray = false;

// load data
d3.csv("./data/data.csv", function (error, data) {

  planetData = data;

  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 1920 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  /* 
   * value accessor - returns the value to encode for a given data object.
   * scale - maps value to a visual display encoding, such as a pixel position.
   * map function - maps from data value to display value
   * axis - sets up axis
   */

  planetData.forEach(function(d) {
    d.pl_rade = +d.pl_rade;
    d.sy_pnum = +d.sy_pnum;

    //might need to go in its own function call from a button click event
    if(d.sy_pnum >= 5)
    {
      var index;
      for(index = 0; index < namesOfSystems.length; index++)
      {
        if(namesOfSystems[index] == d.hostname)
        {
          doesExistInArray = true;
          break;
        }
        doesExistInArray = false;

      }

      if(doesExistInArray == false)
      {
        //console.log(d.hostname);
        namesOfSystems[numberOfUniqueSystems] = d.hostname;
        numberOfUniqueSystems += 1;
      }

    }
  
  });

  var index;
  var select = document.getElementById("HostName");
  for(index = 0; index < namesOfSystems.length; index++)
  {
    
    console.log(namesOfSystems[index]);
    var option = document.createElement("option");
    option.text = namesOfSystems[index];
    option.value = namesOfSystems[index];
    option.classed = "form-control";
    option.style.background = "#6f42c1;";
    
    select.appendChild(option);

  }

  const x = d3.scale.linear().rangeRound([0, width]);
  const y = d3.scale.linear();

  //TEST
  var svg = d3.select("#Cosmos1")
  .classed('container', true)
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //PUT A FILTER ON DATA FOR SOLARSYSTEM
  //PUT A FILTER ON DATA FOR SIZE OF PLANET

 // xScale.domain([-d3.max(data, xValue)-1, d3.max(data, xValue)+1]);
  // x.domain([-d3.max(data, xValue)-1, d3.max(data, xValue)+1]);
  // y.domain([0]);

  //dataScatter.sort((a,b) => a.qym - b.qym);
  // data.forEach(function(d) {
  //   if(d.qym != lastQyM)
  //   {
  //    // countInQYm = 0;
  //     //lastQyM = d.qym;
  //   }
  //   //countInQYm += 1;
  //   //d.filterTime = countInQYm;
  //   });
  //var 



  circle = svg
        .selectAll(".p_circle")
        .data(planetData)
        .enter()
        .append("circle")
        //.filter(function(d){return(d.hostname == "55 Cnc");})//change to host name variable "55 Cnc"
        .attr("class", "p_circle")
        .attr('r', function(d){return(parseInt(radius(d))*sizeOfEarth);})
        /*.attr('transform',function(d,i){
          currentDistance = (parseInt(radius(d))*sizeOfEarth * 2);
          totalDistance += currentDistance;
          console.log("planets length: " + currentDistance);
          console.log("ALL planets length: " + totalDistance);
          return 'translate(' + (totalDistance - currentDistance / 2) + ', 100)';})*/
        .style("fill", "#2165CE")
        .style("visibility", "hidden");
    circle
    .filter(function(d){return(d.hostname == "55 Cnc");})//change to host name variable "55 Cnc"
    .attr('transform',function(d,i){
      currentDistance = (parseInt(radius(d))*sizeOfEarth * 2);
      totalDistance += currentDistance;
      console.log("planets length: " + currentDistance);
      console.log("ALL planets length: " + totalDistance);
      return 'translate(' + (totalDistance - currentDistance / 2) + ', 100)';})
      .style("visibility", "visible");

  var circle2 = svg
    .selectAll(".p_circleEarth")
    .data(data)
    .enter()
    .append("circle")
    .filter(function(d){return(d.hostname == "30 Ari B");})//change to host name variable
    .attr("class", "p_circleEarth")
    .attr('r', sizeOfEarth)
    .attr('transform',function(d,i){
      // currentDistance = (parseInt(radius(d))*sizeOfEarth * 2);
      // totalDistance += currentDistance;
      // console.log("planets length: " + currentDistance);
      // console.log("ALL planets length: " + totalDistance);
      return 'translate(' + 0 + ', 100)';})
      .style("fill", "#008000");

  var circle3 = svg
    .selectAll(".p_circleMoon")
    .data(data)
    .enter()
    .append("circle")
    .filter(function (d) { return (d.hostname == "30 Ari B"); })//change to host name variable
    .attr("class", "p_circleMoon")
    .attr('r', sizeOfMoon)
    .attr('transform', function (d, i) {
      // currentDistance = (parseInt(radius(d))*sizeOfEarth * 2);
      // totalDistance += currentDistance;
      // console.log("planets length: " + currentDistance);
      // console.log("ALL planets length: " + totalDistance);
      return 'translate(' + distanceFromEToM + ', 100)';
    })
    .style("fill", "#000");


    var textCounter = 0;

    var planetText = svg
    .selectAll("planetName")
    .data(data)
    .enter()
    .append("text")
    .text("55 Cnc")
    .filter(function(d){return(d.hostname == "55 Cnc");})
    .attr('transform',function(d,i){
      currentDistance = (parseInt(radius(d))*sizeOfEarth * 2);
      totalDistance += currentDistance;
      console.log("planets length: " + currentDistance);
      console.log("ALL planets length: " + totalDistance);
      if(textCounter)
      {
        textCounter = 0;
      }
      else
      {
        textCounter = 1;
      }
      return 'translate(' + (totalDistance - currentDistance / 2) + ', '+ '150'+ textCounter * 50 +')';})
      .style("visibility", "visible");
});

var filterByHostName = function (d, i) {

  console.log("button clicked"); // 

  var ddEl = document.getElementById("HostName");
  HOSTNAME = ddEl.options[ddEl.selectedIndex].text;

  totalDistance = sizeOfEarth;

  // You usually have 3 moments. EWnter - update and exit.  I will make easy for you. The best thing you can do is, 1st create all the planets invisible and then show only the ones you want and move them, I will show you
  // If you are putting differents systems, each time you should hide all of them and later show onlye the ones you want 
  //circle.selectAll('.p_circle');
    //.style('opacity', function (d) { d.prevOp = d3.select(this).style('opacity'); return 0; });
  //  svg.selectAll(".p_circle")
  circle.style('visibility','hidden');
  circle
    //.data(planetData)
    //.enter() Those elements are aleready linked to the data, do not need to link them again, and it is not the creation part, so not use enter, only update them
    //.append("circle")
    .filter(function(d){
      //console.log(d.hostname); 
      return(d.hostname == HOSTNAME);})//change to host name variable
    .attr("class", "p_circle")
    .attr('r', function(d){return(parseInt(radius(d))*sizeOfEarth);})
    .attr('transform',function(d,i){
      currentDistance = (parseInt(radius(d))*sizeOfEarth * 2);
      totalDistance += currentDistance;
      console.log("Number of planets in solar system: " + d.sy_pnum);
      //console.log("planets length: " + currentDistance);
      //console.log("ALL planets length: " + totalDistance);
      return 'translate(' + (totalDistance - currentDistance / 2) + ', 100)';})
    .style("fill", "#2165CE")
    .style("visibility", "visible");

    

    // svg.select('.p_circleMoon')
    // .attr('transform',function(d,i){
    //   currentDistance = sizeOfMoon * 2;
    //   totalDistance += currentDistance;
    //   return 'translate(' + (totalDistance - currentDistance / 2) + ', 100)';})
}