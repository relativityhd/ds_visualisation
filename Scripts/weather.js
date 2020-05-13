var delayedFlights = 0
var punctualFlights = 0 
var punctualFlightsAllTime = 0
var delayedFlightsAllTime = 0
var absoluteDelayAllTime = 0
var absolutePunctualityAllTime = 0
var delayedFlightsFair = 0
var punctualFlightsFair =  0
var delayedFLightsPartly = 0
var punctualFlightsPartly = 0
var delayedFlightsMostly = 0
var punctualFlightsMostly = 0
var delayedFlightsCloudy = 0
var punctualFlightsCloudy = 0
var delayedFlightsRainy  = 0
var punctualFlightsRainy = 0


let flightsProm = new Promise((res) => {
    Plotly.d3.csv(
        "https://gist.githubusercontent.com/florianeichin/cfa1705e12ebd75ff4c321427126ccee/raw/c86301a0e5d0c1757d325424b8deec04cc5c5ca9/flights_all_cleaned.csv",
        (err,rows) => {
            res(rows)
        })
})
let weatherProm  = new Promise((res) => {
    Plotly.d3.csv(
        "https://gist.githubusercontent.com/relativityhd/a42770d1498ae2cde03e789a79dd43be/raw/a5af5d8164be0ad974ba019f5edad0c2ce2bf776/WeatherDataAtlanta.csv",
        (err,rows) => {
            res(rows)
        }
    )
})

async function runPie(currentTime) {
    delayedFlights = 0
    punctualFlights = 0
    let data = await  Promise.all([flightsProm, weatherProm])
    data[0].filter((row) => {
        let myDate = new Date(row["SCHEDULED_DEPARTURE"])
        return (row["ORIGIN_AIRPORT"] == "ATL" && myDate.getHours() == currentTime)
    })
    .forEach(row => {
        if (row["DEPARTURE_DELAY"] > 0){
            delayedFlights++
        }
        else{
            punctualFlights++
        } 
    })
    

    $('#weatherNow').html(data[1][(currentTime - 1)]["Condition"])
    renderWeatherPieHourly()
    renderBarPercentage()
}

async function runPieAllTime(radioButton) {
    delayedFlightsAllTime = 0
    punctualFlightsAllTime = 0
    absoluteDelayAllTime = 0
    absolutePunctualityAllTime =  0
    let data = await  Promise.all([flightsProm, weatherProm])
    data[0].filter((row) => {
        return (row["ORIGIN_AIRPORT"] == "ATL") 
    })
    .forEach(row => {
        if (row["DEPARTURE_DELAY"] > 0){
            delayedFlightsAllTime++
            absoluteDelayAllTime += parseFloat(row["DEPARTURE_DELAY"])
        }
        else if (row["DEPARTURE_DELAY"] <= 0) {
            punctualFlightsAllTime++
            absolutePunctualityAllTime += (parseFloat(row["DEPARTURE_DELAY"]) * -1)
        }
        
    })
    if (radioButton.value == "percentage") {
        renderWeatherPieAllTimePercentage()
    }
    else if (radioButton.value == "absolute") {
        renderWeatherPieAllTimeAbsolute()
    }
}

async function runBar(){
    let fairHours = []
    let partlyCloudyHours = []
    let mostlyCloudyHours  = []
    let cloudyHours = []
    let rainyHours  = []

    let data = await  Promise.all([flightsProm, weatherProm])
    let flightsATL = data[0].filter((row) => {
        return (row["ORIGIN_AIRPORT"] == "ATL")
    })
    data[1].forEach((row,index) => {
        if (row["Condition"] == "Fair") {
            fairHours.push(index + 1)
        }
        else if (row["Condition"] == "Partly Cloudy") {
            partlyCloudyHours.push(index + 1)
        }
        else if  (row["Condition"] == "Mostly Cloudy") {
            mostlyCloudyHours.push(index + 1)
        }
        else if (row["Condition"] == "Cloudy") {
            cloudyHours.push(index + 1)
        }
        else {
            rainyHours.push(index + 1)
        }
    })
    for (let i = 0; i < fairHours.length;i++) {
        flightsATL.filter((row) => {
            let myDate = new Date(row["SCHEDULED_DEPARTURE"])
            return (myDate.getHours() == fairHours[i])
        })
        .forEach(row => {
            if (row["DEPARTURE_DELAY"] > 0){
                delayedFlightsFair++
            }
            else{
                punctualFlightsFair++
            } 
        })

    }
    for (let i = 0; i < partlyCloudyHours.length;i++) {
        flightsATL.filter((row) => {
            let myDate = new Date(row["SCHEDULED_DEPARTURE"])
            return (myDate.getHours() == partlyCloudyHours[i])
        })
        .forEach(row => {
            if (row["DEPARTURE_DELAY"] > 0){
                delayedFLightsPartly++
            }
            else{
                punctualFlightsPartly++
            } 
        })

    }
    for (let i = 0; i < mostlyCloudyHours.length;i++) {
        flightsATL.filter((row) => {
            let myDate = new Date(row["SCHEDULED_DEPARTURE"])
            return (myDate.getHours() == mostlyCloudyHours[i])
        })
        .forEach(row => {
            if (row["DEPARTURE_DELAY"] > 0){
                delayedFlightsMostly++
            }
            else{
                punctualFlightsMostly++
            } 
        })

    }
    for (let i = 0; i < cloudyHours.length;i++) {
        flightsATL.filter((row) => {
            let myDate = new Date(row["SCHEDULED_DEPARTURE"])
            return (myDate.getHours() == cloudyHours[i])
        })
        .forEach(row => {
            if (row["DEPARTURE_DELAY"] > 0){
                delayedFlightsCloudy++
            }
            else{
                punctualFlightsCloudy++
            } 
        })

    }
    for (let i = 0; i < rainyHours.length;i++) {
        flightsATL.filter((row) => {
            let myDate = new Date(row["SCHEDULED_DEPARTURE"])
            return (myDate.getHours() == rainyHours[i])
        })
        .forEach(row => {
            if (row["DEPARTURE_DELAY"] > 0){
                delayedFlightsRainy++
            }
            else{
                punctualFlightsRainy++
            } 
        })

    }
    renderBarPercentage()
        

}

function convertToPercentage(delayed,punctual) {
    return ((delayed / (delayed + punctual))*100)

}



function renderWeatherPieAllTimePercentage(){
    let departureDelayPie = [{
        values: [delayedFlightsAllTime,punctualFlightsAllTime],
        labels: ['Delayed', 'Punctual'],
        type: 'pie'
      }];
      
    let layout = {
        height: 400,
        width: 500
      };
      
    Plotly.newPlot('weatherAllTime', departureDelayPie, layout, {responsive: true});

}
function renderWeatherPieAllTimeAbsolute(){
    let data = [
        {
          x: ["Delayed", "Punctual"],
          y: [absoluteDelayAllTime,absolutePunctualityAllTime],
          type: 'bar'
        }
      ];
      
      Plotly.newPlot('weatherAllTime', data, {responsive: true});

}
function renderWeatherPieHourly(){
    let departureDelayPieHourly = [{
        values: [delayedFlights,punctualFlights],
        labels: ['Delayed', 'Punctual'],
        type: 'pie'
      }];
      
    let layoutHourly = {
        height: 400,
        width: 500
      };
      
    Plotly.newPlot('weatherPieHourly', departureDelayPieHourly, layoutHourly, {responsive: true});

}
function renderBarPercentage(){
    var trace1 = {
        x: ["Fair","Partly Cloudy","Mostly Cloudy","Cloudy","Light Rain"],
        y: [convertToPercentage(delayedFlightsFair,punctualFlightsFair),convertToPercentage(delayedFLightsPartly,punctualFlightsPartly),convertToPercentage(delayedFlightsMostly,punctualFlightsMostly),convertToPercentage(delayedFlightsCloudy,punctualFlightsCloudy),convertToPercentage(delayedFlightsRainy,punctualFlightsRainy)],
        type: 'bar',
        text: [(convertToPercentage(delayedFlightsAllTime,punctualFlightsAllTime) - convertToPercentage(delayedFlightsFair,punctualFlightsFair)) + ' below the mean', (convertToPercentage(delayedFlightsAllTime,punctualFlightsAllTime) - convertToPercentage(delayedFLightsPartly,punctualFlightsPartly)) + ' below the mean', (convertToPercentage(delayedFlightsAllTime,punctualFlightsAllTime) - convertToPercentage(delayedFlightsMostly,punctualFlightsMostly)) + ' below the mean', (convertToPercentage(delayedFlightsAllTime,punctualFlightsAllTime) - convertToPercentage(delayedFlightsCloudy,punctualFlightsCloudy)) + ' below the mean', ((convertToPercentage(delayedFlightsAllTime,punctualFlightsAllTime) - convertToPercentage(delayedFlightsRainy,punctualFlightsRainy))* -1) +' above the mean'],
        marker: {
        color: 'rgb(142,124,195)'
        }
    };
    
    var data = [trace1];
    
    var layout = {
        font:{
        family: 'Raleway, sans-serif'
        },
        showlegend: false,
        xaxis: {
        tickangle: -45
        },
        yaxis: {
        zeroline: true,
        gridwidth: 1
        },
        bargap :0.2
    };
    
    Plotly.newPlot('weatherBarGraph', data, layout, {responsive: true});
}


  runPie(12)
  runBar()
  
