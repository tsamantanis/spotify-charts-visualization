/* eslint-disable no-undef */
import RadarChart from './radarChart.js'
import BarChart from './barChart.js'
import { colors } from './constants.js'

async function handleData(analysis, chartType) {
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

  const chartOptions = {
    w: width,
    h: height,
    margin,
    maxValue: 100,
    levels: 4,
    opacity: analysis === "top10" ? 0.05 : analysis === "top100" ? 0 : 0.3,
    roundStrokes: true,
    color,
  }

  

  const data = await d3.csv('./spotify_dataset.csv')
  let formattedData = []

  const maxDanceability = Math.max(...data.map(d => Math.abs(d.danceability)))
  const maxEnergy = Math.max(...data.map(d => Math.abs(d.energy)))
  const maxLoudness = Math.max(...data.map(d => Math.abs(d["loudness.dB"])))
  const maxSpeechiness = Math.max(...data.map(d => Math.abs(d.speechiness)))
  const maxAcousticness = Math.max(...data.map(d => Math.abs(d.acousticness)))
  const maxLiveness = Math.max(...data.map(d => Math.abs(d.liveness)))

  const maxValues = {
    ['Danceability']: maxDanceability,
    ['Energy']: maxEnergy,
    ['Loudness']: maxLoudness,
    ['Speechiness']: maxSpeechiness,
    ['Acousticness']: maxAcousticness,
    ['Liveness']: maxLiveness
  }

  function formatValue(value, axis) {
    return (Math.abs(parseFloat(value)) / maxValues[axis]) * 100
  }

  if (analysis === "average") {
    const averageDanceability = data.reduce((acc, cur) => acc + formatValue(cur.danceability, "Danceability"), 0) / data.length
    const averageEnergy = data.reduce((acc, cur) => acc + formatValue(cur.energy, "Energy"), 0) / data.length
    const averageLoudness = data.reduce((acc, cur) => acc + formatValue(cur["loudness.dB"], "Loudness"), 0) / data.length
    const averageSpeechiness = data.reduce((acc, cur) => acc + formatValue(cur.speechiness, "Speechiness"), 0) / data.length
    const averageAcousticness = data.reduce((acc, cur) => acc + formatValue(cur.acousticness, "Acousticness"), 0) / data.length
    const averageLiveness = data.reduce((acc, cur) => acc + formatValue(cur.liveness, "Liveness"), 0) / data.length
    formattedData = [
      [
        { axis: 'Danceability', value: averageDanceability },
        { axis: 'Energy', value: averageEnergy },
        { axis: 'Loudness', value: averageLoudness },
        { axis: 'Speechiness', value: averageSpeechiness },
        { axis: 'Acousticness', value: averageAcousticness },
        { axis: 'Liveness', value: averageLiveness },
      ],
    ]
  } else if (analysis === "max") {
    
    formattedData = [
      [
        { axis: 'Danceability', value: maxDanceability },
        { axis: 'Energy', value: maxEnergy },
        { axis: 'Loudness', value: maxLoudness },
        { axis: 'Speechiness', value: maxSpeechiness },
        { axis: 'Acousticness', value: maxAcousticness },
        { axis: 'Liveness', value: maxLiveness },
      ],
    ]
  } else if (analysis === "min") {
    const minDanceability = Math.min(...data.map(d => d.danceability))
    const minEnergy = Math.min(...data.map(d => d.energy))
    const minLoudness = Math.min(...data.map(d => d["loudness.dB"]))
    const minSpeechiness = Math.min(...data.map(d => d.speechiness))
    const minAcousticness = Math.min(...data.map(d => d.acousticness))
    const minLiveness = Math.min(...data.map(d => d.liveness))
    formattedData = [
      [
        { axis: 'Danceability', value: minDanceability },
        { axis: 'Energy', value: minEnergy },
        { axis: 'Loudness', value: minLoudness },
        { axis: 'Speechiness', value: minSpeechiness },
        { axis: 'Acousticness', value: minAcousticness },
        { axis: 'Liveness', value: minLiveness },
      ],
    ]
  } else if (analysis === "top10") {
    formattedData = data.slice(0, 10).map(d => (
      [
        { axis: "Danceability", value: formatValue(d["danceability"], "Danceability") || 0 },
        { axis: "Energy", value: formatValue(d["energy"], "Energy") || 0 },
        { axis: "Loudness", value: formatValue(d["loudness.dB"], "Loudness") || 0 },
        { axis: "Speechiness", value: formatValue(d["speechiness"], "Speechiness") || 0 },
        { axis: "Acousticness", value: formatValue(d["acousticness"], "Acousticness") || 0 },
        { axis: "Liveness", value: formatValue(d["liveness"], "Liveness") || 0 }
      ]
    )).filter(d => d !== null)
  } else if (analysis === "top50") {
    formattedData = data.slice(0, 50).map(d => (
      [
        { axis: "Danceability", value: formatValue(d["danceability"], "Danceability") || 0 },
        { axis: "Energy", value: formatValue(d["energy"], "Energy") || 0 },
        { axis: "Loudness", value: formatValue(d["loudness.dB"], "Loudness") || 0 },
        { axis: "Speechiness", value: formatValue(d["speechiness"], "Speechiness") || 0 },
        { axis: "Acousticness", value: formatValue(d["acousticness"], "Acousticness") || 0 },
        { axis: "Liveness", value: formatValue(d["liveness"], "Liveness") || 0 }
      ]
    )).filter(d => d !== null)
  } else if (analysis === "top100") {
    formattedData = data.map(d => (
      [
        { axis: "Danceability", value: formatValue(d["danceability"], "Danceability") || 0 },
        { axis: "Energy", value: formatValue(d["energy"], "Energy") || 0 },
        { axis: "Loudness", value: formatValue(d["loudness.dB"], "Loudness") || 0 },
        { axis: "Speechiness", value: formatValue(d["speechiness"], "Speechiness") || 0 },
        { axis: "Acousticness", value: formatValue(d["acousticness"], "Acousticness") || 0 },
        { axis: "Liveness", value: formatValue(d["liveness"], "Liveness") || 0 }
      ]
    )).filter(d => d !== null)
  }
  
  // Call function to draw the Radar chart
  if (chartType === "radar") {
    RadarChart('.radarChart', formattedData, chartOptions)
  } else if (chartType === "bar") {
    BarChart('.barChart', formattedData[0], chartOptions)
  }
}

let selectedButton = "average"
let selectedChart = "radar"
const chartButtons = document.getElementsByClassName("chart-button")
const dataButtons = document.getElementsByClassName('data-button')

function triggerReload() {
  handleData(selectedButton, selectedChart)

  for (let i = 0; i < dataButtons.length; i++) {
    dataButtons[i].classList.remove("active")
    if (selectedButton === dataButtons[i].id) {
      dataButtons[i].classList.add("active")
    }
  }

  for (let i = 0; i < chartButtons.length; i++) {
    chartButtons[i].classList.remove("active")
    if (selectedChart === chartButtons[i].id) {
      chartButtons[i].classList.add("active")
    }
  }
}

for (let i = 0; i < chartButtons.length; i++) {
  chartButtons[i].addEventListener('click', () => {
    selectedChart = chartButtons[i].id
    triggerReload()
  })
}

for (let i = 0; i < dataButtons.length; i++) {
  dataButtons[i].addEventListener('click', () => {
    selectedButton = dataButtons[i].id
    triggerReload()
  })
}

triggerReload()