import { colors } from './constants.js';

export default function RadarChart(id, data, options) {
	let cfg = {
	 w: 900,				//Width of the circle
	 h: 900,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 4,				//How many levels or inner circles should there be drawn
	 maxValue: 1, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.4, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3
    .scaleSequential()
    .domain([0, data.length])
    .interpolator(d3.interpolateRainbow) //.schemeCategory10() //.scale.category10()	//Color function
	};
	
	//Put all of the options into a letiable called cfg
	if('undefined' !== typeof options){
	  for(let i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if
	
	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	// let maxValue = Math.max(cfg.maxValue, d3.max(data, function(i) {
  //   return d3.max(i.map(function(o) {
  //     return o.value;
  //   })
  //   )})
  // );
	
  const axisNames = [
    "Danceability",
    "Energy",
    "Loudness",
    "Speechiness",
    "Acousticness",
    "Liveness"
  ]

  const total = axisNames.length,					//The number of different axes
		radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
		Format = d3.format('%'),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	let rScale = d3
    .scaleLinear()
		.range([0, radius])
		.domain([0, cfg.maxValue]);
		
	d3.select(id).select("svg").remove();
	
	let svg = d3.select(id).append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+id);

      let g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
	
	let filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

    let defs = svg.append("defs");
    let filterShadow = defs.append('filter')
      .attr('id', 'drop-shadow')
      // these values are larger than necessary to account for highly offset shadows
      // they can be decreased to the maximum expected area around the element
      .attr('y', '-100%')
      .attr('x', '-100%')
      .attr('height', '300%')
      .attr('width', '300%')

  // an SVG gaussian blur based on the shape of the element
  filterShadow.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 10)

  // offset the blur by dx and dy pixels
  filterShadow.append('feOffset')
      .attr('dx', 4)
      .attr('dy', 4)
      .attr('result', 'offsetblur')

  filterShadow.append('feOffset')
    .attr('dx', -4)
    .attr('dy', -4)
    .attr('result', 'offsetblur')

  // apply the color to the filter
  filterShadow.append('feFlood')
      .attr('flood-color', colors[colors.length - 1])
      .attr('flood-opacity', '1')
      .attr('result', 'colorblur')

  // combine the effects of the offset and the color filters
  filterShadow.append('feComposite')
      .attr('in', 'colorblur')
      .attr('in2', 'offsetblur')
      .attr('operator', 'in')

  // shows both the original element and the drop shadow
  let feMergeShadow = filterShadow.append('feMerge')
  feMergeShadow.append('feMergeNode')
      .attr('in', 'offsetBlur')
  feMergeShadow.append('feMergeNode')
      .attr('in', 'SourceGraphic')

	let axisGrid = g.append("g").attr("class", "axisWrapper");
	
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels + 1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", d => radius / cfg.levels * d)
		.style("fill", "#FFFFFF")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#drop-shadow)")

	let axis = axisGrid.selectAll(".axis")
		.data(axisNames)
		.enter()
		.append("g")
		.attr("class", "axis");

    axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (d, i) => rScale(cfg.maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
		.attr("y2", (d, i) => rScale(cfg.maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "1px");

	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", (d, i) => rScale(cfg.maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
		.attr("y", (d, i) => rScale(cfg.maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
		.text(d => d)
		.call(wrap, cfg.wrapWidth);

	let radarLine = d3.lineRadial()
		// .interpolate("linear-closed")
		.radius((d) => rScale(d.value) / 2)
		.angle((d,i) => i * angleSlice);
		
	// if(cfg.roundStrokes) {
	// 	radarLine.interpolate("cardinal-closed");
	// }
				
	//Create a wrapper for the blobs	
	let blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
			
	//Append the backgrounds	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", d => radarLine(d))
		.style("fill", (d, i) => cfg.color(i))
		.style("fill-opacity", cfg.opacityArea)
	// 	.on('mouseover', function (d,i) {
	// 		//Dim all blobs
	// 		d3.selectAll(".radarArea")
	// 			.transition().duration(200)
	// 			.style("fill-opacity", 0.1); 
	// 		//Bring back the hovered over blob
	// 		d3.select(this)
	// 			.transition().duration(200)
	// 			.style("fill-opacity", 0.7);	
	// 	})
	// 	.on('mouseout', function() {
	// 		//Bring back all blobs
	// 		d3.selectAll(".radarArea")
	// 			.transition().duration(200)
	// 			.style("fill-opacity", cfg.opacityArea);
	// 	});
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", (d) => radarLine(d))
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", (d,i) => cfg.color(i))
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(d => d)
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", (d,i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2) / 2)
		.attr("cy", (d,i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2) / 2)
		.style("fill", (d,i,j) => cfg.color(j))
		.style("fill-opacity", 1);

	function wrap(text, width) {
	  text.each(function() {
		let text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}//wrap	
	
}//RadarChart