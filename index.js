
async function handleData() {
  var margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
            
  var color = d3.scaleOrdinal()
    .range(["#7400b8", "#6930c3", "#5e60ce", "#5390d9", "#4ea8de", "#48bfe3", "#56cfe1", "#64dfdf", "#72efdd", "#80ffdb"]);
    
  var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 0.5,
    levels: 6,
    roundStrokes: true,
    color: color
  };

  function formatValue(value) {
    return Math.abs(parseFloat(value)) > 1 ? 1 : Math.abs(parseFloat(value))
  }

  const data = await d3.csv("./spotify_dataset.csv")
  const formattedData = data.map(d => d["Danceability"] ?
    [
      { axis: "Danceability", value: formatValue(d["Danceability"]) || 0 }, 
      { axis: "Energy", value: formatValue(d["Energy"]) || 0 }, 
      { axis: "Loudness", value: formatValue(d["Loudness"]) || 0 }, 
      { axis: "Speechiness", value: formatValue(d["Speechiness"]) || 0 }, 
      { axis: "Acousticness", value: formatValue(d["Acousticness"]) || 0 }, 
      { axis: "Liveness", value: formatValue(d["Liveness"]) || 0 }
    ] : null
  ).filter(d => d !== null)

  // const maxDanceability = Math.max(...formattedData.map(d => d[0].value))
  // const maxEnergy = Math.max(...formattedData.map(d => d[1].value))
  // const maxLoudness = Math.max(...formattedData.map(d => d[2].value))
  // const maxSpeechiness = Math.max(...formattedData.map(d => d[3].value))
  // const maxAcousticness = Math.max(...formattedData.map(d => d[4].value))
  // const maxLiveness = Math.max(...formattedData.map(d => d[5].value))
  
  // const test = formattedData.slice(0, 3)
  // console.log(test)
  //Call function to draw the Radar chart
  RadarChart(".radarChart", formattedData, radarChartOptions);

}

handleData();