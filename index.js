/* eslint-disable no-undef */
import RadarChart from './radarChart.js'
import { colors } from './constants.js'

async function handleData() {
  const margin = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100,
  }
  const width =
    Math.min(700, window.innerWidth - 10) - margin.left - margin.right
  const height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20)

  const color = d3.scaleOrdinal().range(colors)

  const radarChartOptions = {
    w: width,
    h: height,
    margin,
    maxValue: 1,
    levels: 4,
    roundStrokes: true,
    color,
  }

  function formatValue(value) {
    return Math.abs(parseFloat(value)) > 1 ? 1 : Math.abs(parseFloat(value)) || 0
  }

  const data = await d3.csv('./spotify_dataset.csv')
  // const formattedData = data.map(d => d["Danceability"] ?
  //   [
  //     { axis: "Danceability", value: formatValue(d["Danceability"]) || 0 },
  //     { axis: "Energy", value: formatValue(d["Energy"]) || 0 },
  //     { axis: "Loudness", value: formatValue(d["Loudness"]) || 0 },
  //     { axis: "Speechiness", value: formatValue(d["Speechiness"]) || 0 },
  //     { axis: "Acousticness", value: formatValue(d["Acousticness"]) || 0 },
  //     { axis: "Liveness", value: formatValue(d["Liveness"]) || 0 }
  //   ] : null
  // ).filter(d => d !== null)

  // const maxDanceability = Math.max(...formattedData.map(d => d[0].value))
  // const maxEnergy = Math.max(...formattedData.map(d => d[1].value))
  // const maxLoudness = Math.max(...formattedData.map(d => d[2].value))
  // const maxSpeechiness = Math.max(...formattedData.map(d => d[3].value))
  // const maxAcousticness = Math.max(...formattedData.map(d => d[4].value))
  // const maxLiveness = Math.max(...formattedData.map(d => d[5].value))

  const averageDanceability = data.reduce((acc, cur) => acc + formatValue(cur.Danceability), 0) / data.length
  const averageEnergy = data.reduce((acc, cur) => acc + formatValue(cur.Energy), 0) / data.length
  const averageLoudness = data.reduce((acc, cur) => acc + formatValue(cur.Loudness), 0) / data.length
  const averageSpeechiness = data.reduce((acc, cur) => acc + formatValue(cur.Speechiness), 0) / data.length
  const averageAcousticness = data.reduce((acc, cur) => acc + formatValue(cur.Acousticness), 0) / data.length
  const averageLiveness = data.reduce((acc, cur) => acc + formatValue(cur.Liveness), 0) / data.length

  const formattedData = [
    [
      { axis: 'Danceability', value: averageDanceability },
      { axis: 'Energy', value: averageEnergy },
      { axis: 'Loudness', value: averageLoudness },
      { axis: 'Speechiness', value: averageSpeechiness },
      { axis: 'Acousticness', value: averageAcousticness },
      { axis: 'Liveness', value: averageLiveness },
    ],
  ]

  // Call function to draw the Radar chart
  RadarChart('.radarChart', formattedData, radarChartOptions)
}

handleData()
