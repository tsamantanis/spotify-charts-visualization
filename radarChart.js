/* eslint-disable no-undef */
import { colors } from './constants.js'

export default function RadarChart(id, data, options) {
  const cfg = {
    w: options.w, // Width of the circle
    h: options.h, // Height of the circle
    margin: options.margin, // The margins of the SVG
    levels: options.levels, // How many levels or inner circles should there be drawn
    maxValue: options.maxValue, // What is the value that the biggest circle will represent
    labelFactor: 1.15, // How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, // The number of pixels after which a label needs to be given a new line
    opacityArea: options.opacity, // The opacity of the area of the blob
    dotRadius: 4, // The size of the colored circles of each blog
    opacityCircles: 1, // The opacity of the circles of each blob
    strokeWidth: 2, // The width of the stroke around each blob
    roundStrokes: options.roundStrokes, // If true the area and stroke will follow a round path (cardinal-closed)
    color: options.color, // Color function
  }

  let wrapcount = 0
  function wrap(text, width) {
    text.each((function () {
      const textLabel = d3.select(this)
      // const words = textLabel.text().split(/\s+/).reverse()
      let word = ''
      let line = []
      let lineNumber = 0
      const lineHeight = 1.4 // ems
      const y = textLabel.attr('y')
      const x = textLabel.attr('x')
      const dy = parseFloat(textLabel.attr('dy'))
      let tspan = textLabel.text(null).append('tspan').attr('x', x).attr('y', y)
        .attr('dy', `${dy}em`)
      
      word = axisNames[wrapcount]
      wrapcount += 1
      line.push(word)
      tspan.text(line.join(' '))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(' '))
        line = [word]
        lineNumber += 1
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', `${lineNumber * lineHeight + dy}em`)
          .text(word)
      }
      
    }))
  }

  const axisNames = [
    'Danceability',
    'Energy',
    'Loudness',
    'Speechiness',
    'Acousticness',
    'Liveness',
  ]

  const total = axisNames.length // The number of different axes
  const radius = Math.min(cfg.w / 2, cfg.h / 2) // Radius of the outermost circle
  // const Format = d3.format('%'); // Percentage formatting
  const angleSlice = (Math.PI * 2) / total // The width in radians of each "slice"

  const rScale = d3.scaleLinear().range([0, radius]).domain([0, cfg.maxValue])

  const backgroundColor = '#191414'

  d3.select(id).select('svg').remove()

  const svg = d3
    .select(id)
    .append('svg')
    .attr('width', cfg.w + cfg.margin.left + cfg.margin.right)
    .attr('height', cfg.h + cfg.margin.top + cfg.margin.bottom)
    .attr('class', `radar${id}`)

  const g = svg
    .append('g')
    .attr('transform', `translate(${
      cfg.w / 2 + cfg.margin.left},${cfg.h / 2 + cfg.margin.top
    })`)

  const filter = g.append('defs').append('filter').attr('id', 'glow')

  filter
    .append('feGaussianBlur')
    .attr('stdDeviation', '2.5')
    .attr('result', 'coloredBlur')

  const feMerge = filter.append('feMerge')

  feMerge.append('feMergeNode').attr('in', 'coloredBlur')
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

  const defs = svg.append('defs')
  const filterShadow = defs
    .append('filter')
    .attr('id', 'drop-shadow')
    // these values are larger than necessary to account for highly offset shadows
    // they can be decreased to the maximum expected area around the element
    .attr('y', '-100%')
    .attr('x', '-100%')
    .attr('height', '300%')
    .attr('width', '300%')

  // an SVG gaussian blur based on the shape of the element
  filterShadow
    .append('feGaussianBlur')
    .attr('in', 'SourceAlpha')
    .attr('stdDeviation', 10)

  // offset the blur by dx and dy pixels
  filterShadow
    .append('feOffset')
    .attr('dx', 4)
    .attr('dy', 4)
    .attr('result', 'offsetblur')

  filterShadow
    .append('feOffset')
    .attr('dx', -4)
    .attr('dy', -4)
    .attr('result', 'offsetblur')

  // apply the color to the filter
  filterShadow
    .append('feFlood')
    .attr('flood-color', colors[colors.length - 1])
    .attr('flood-opacity', '1')
    .attr('result', 'colorblur')

  // combine the effects of the offset and the color filters
  filterShadow
    .append('feComposite')
    .attr('in', 'colorblur')
    .attr('in2', 'offsetblur')
    .attr('operator', 'in')

  // shows both the original element and the drop shadow
  const feMergeShadow = filterShadow.append('feMerge')

  feMergeShadow.append('feMergeNode').attr('in', 'offsetBlur')
  feMergeShadow.append('feMergeNode').attr('in', 'SourceGraphic')

  const axisGrid = g.append('g').attr('class', 'axisWrapper')
  
  axisGrid
    .selectAll('.levels')
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append('circle')
    .attr('class', 'gridCircle')
    .attr('r', (d) => (radius / cfg.levels) * d)
    .style('fill', backgroundColor)
    .style('fill-opacity', cfg.opacityCircles)
    .style('filter', 'url(#drop-shadow)')

  const axis = axisGrid
    .selectAll('.axis')
    .data(axisNames)
    .enter()
    .append('g')
    .attr('class', 'axis')

  axis
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (d, i) => (
      rScale(cfg.maxValue) * Math.cos(angleSlice * i - Math.PI / 2)))
    .attr('y2', (d, i) => (
      rScale(cfg.maxValue) * Math.sin(angleSlice * i - Math.PI / 2)))
    .attr('class', 'line')
    .style('stroke', 'white')
    .style('stroke-width', '1px')

  axis
    .append('text')
    .attr('class', 'legend')
    .style('font-size', '14px')
    .attr('fill', '#ffffff')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr(
      'x',
      (d, i) => (
        rScale(cfg.maxValue * cfg.labelFactor) *
        Math.cos(angleSlice * i - (Math.PI / 2))
      )
    )
    .attr(
      'y',
      (d, i) => (
        rScale(cfg.maxValue * cfg.labelFactor) *
        Math.sin(angleSlice * i - (Math.PI / 2))
      )
    )
    .text(d => d)
    .call(wrap, cfg.wrapWidth)

  const radarLine = d3
    .lineRadial()
    .curve(d3.curveCardinalClosed)
    .radius((d) => rScale(d.value))
    .angle((d, i) => i * angleSlice)

  // Create a wrapper for the blobs
  const blobWrapper = g
    .selectAll('.radarWrapper')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'radarWrapper')

  // Append the backgrounds
  blobWrapper
    .append('path')
    .attr('class', 'radarArea')
    .attr('d', (d) => radarLine(d))
    .style('fill', (d, i) => cfg.color(i))
    .style('fill-opacity', cfg.opacityArea)

  // Create the outlines
  blobWrapper
    .append('path')
    .attr('class', 'radarStroke')
    .attr('d', (d) => radarLine(d))
    .style('stroke-width', `${cfg.strokeWidth}px`)
    .style('stroke', (d, i) => cfg.color(i))
    .style('fill', 'none')
    .style('filter', 'url(#glow)')

  // Append the circles
  blobWrapper
    .selectAll('.radarCircle')
    .data((d) => d)
    .enter()
    .append('circle')
    .attr('class', 'radarCircle')
    .attr('r', cfg.dotRadius)
    .attr('cx', (d, i) => (
      rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)))
    .attr('cy', (d, i) => (
      rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)))
    .style('fill', (d, i, j) => cfg.color(j))
    .style('fill-opacity', cfg.opacityArea * 3)
} // RadarChart
