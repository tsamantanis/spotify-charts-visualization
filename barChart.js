/* eslint-disable no-undef */

export default function BarChart(id, data, options) {

  const cfg = {
    w: options.w, // Width of the circle
    h: options.h, // Height of the circle
    margin: options.margin, // The margins of the SVG
    levels: options.levels, // How many levels or inner circles should there be drawn
    maxValue: options.maxValue, // What is the value that the biggest circle will represent
    labelFactor: 1.25, // How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, // The number of pixels after which a label needs to be given a new line
    opacityArea: 0.4, // The opacity of the area of the blob
    dotRadius: 4, // The size of the colored circles of each blog
    opacityCircles: 1, // The opacity of the circles of each blob
    strokeWidth: 2, // The width of the stroke around each blob
    roundStrokes: options.roundStrokes, // If true the area and stroke will follow a round path (cardinal-closed)
    color: options.color, // Color function
  }
  // const axisNames = [
  //   'Danceability',
  //   'Energy',
  //   'Loudness',
  //   'Speechiness',
  //   'Acousticness',
  //   'Liveness',
  // ]
  d3.select(id).select('svg').remove()

  // const svg = d3
  //   .select(id)
  //   .append('svg')
  //   .attr('width', cfg.w + cfg.margin.left + cfg.margin.right)
  //   .attr('height', cfg.h + cfg.margin.top + cfg.margin.bottom)
  //   .attr('class', `radar${id}`)
// append the svg object to the body of the page
  var svg = d3.select(id)
    .append("svg")
      .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + cfg.margin.left + "," + cfg.margin.top + ")");
   // Add X axis
   var x = d3.scaleLinear()
   .domain([0, 100])
   .range([ 0, cfg.w]);
 
   svg.append("g")
      .attr("transform", "translate(0," + cfg.h + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

 // Y axis
 var y = d3.scaleBand()
   .range([ 0, cfg.h ])
   .domain(data.map(function(d) { return d.axis; }))
   .padding(.1);
 svg.append("g")
   .call(d3.axisLeft(y))

 //Bars
 svg.selectAll("myRect")
   .data(data)
   .enter()
   .append("rect")
   .attr("x", x(0) )
   .attr("y", function(d) { return y(d.axis); })
   .attr("width", function(d) { return x(d.value); })
   .attr("height", y.bandwidth() )
   .attr("fill", "#69b3a2")
}