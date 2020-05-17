//Alle Benötigten Variablen für die verschiedenen Visualisierungen
//FÜr die Verspätungen pro Stunde
var delayedFlights = 0
var punctualFlights = 0 
//Für die Verspätungen insgesamt
var punctualFlightsAllTime = 0
var delayedFlightsAllTime = 0
var absoluteDelayAllTime = 0
var absolutePunctualityAllTime = 0
//Für die Verspätungen nach Wetter
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

//Einlesen der beiden benutzten .csv Dateien mit Promises, damit sie auch gleichzeitig und rechtzeitig eingelesen sind
//Flugdaten
let flightsProm = new Promise((res) => {
    Plotly.d3.csv(
        "https://gist.githubusercontent.com/florianeichin/cfa1705e12ebd75ff4c321427126ccee/raw/c86301a0e5d0c1757d325424b8deec04cc5c5ca9/flights_all_cleaned.csv",
        (err,rows) => {
            res(rows)
        })
})
//Wetterdaten
let weatherProm  = new Promise((res) => {
    Plotly.d3.csv(
        "https://gist.githubusercontent.com/relativityhd/a42770d1498ae2cde03e789a79dd43be/raw/a5af5d8164be0ad974ba019f5edad0c2ce2bf776/WeatherDataAtlanta.csv",
        (err,rows) => {
            res(rows)
        }
    )
})

//Funktion zur Kalkulierung der Daten des interaktiven Kuchendiagramms
async function runPie(currentTime) {
    //Nullsetzen der Variablen
    delayedFlights = 0
    punctualFlights = 0
    //Auf  das Einlesen der Daten warten
    let data = await  Promise.all([flightsProm, weatherProm])
    //Filtern der Flugdaten nach dem  richtigen Flughafen und der richtigen Uhrzeit
    data[0].filter((row) => {
        let myDate = new Date(row["SCHEDULED_DEPARTURE"])
        return (row["ORIGIN_AIRPORT"] == "ATL" && myDate.getHours() == currentTime)
    })
    //Iteration über diegefilterten Flüge um zu gucken ob sie pünktlich oder unpünktlich sind
    .forEach(row => {
        if (row["DEPARTURE_DELAY"] > 0){
            delayedFlights++
        }
        else{
            punctualFlights++
        } 
    })
    
    //Das richtige Wetter zur Stunde ausgeben
    $('#weatherNow').html(data[1][(currentTime - 1)]["Condition"])
    //Erstellen der Graphen
    renderWeatherPieHourly()
    renderBarPercentage()
}

//Funktion zur Kalkulation der Daten für das Gesamtdaten Kuchendiagramm
async function runPieAllTime(value) {
    //Zurücksetzen der Variablen
    delayedFlightsAllTime = 0
    punctualFlightsAllTime = 0
    absoluteDelayAllTime = 0
    absolutePunctualityAllTime =  0
    //Warten auf das Einlesen  der  Daten
    let data = await  Promise.all([flightsProm, weatherProm])
    //Das  Flugdatenset nach Atlanta filtern
    data[0].filter((row) => {
        return (row["ORIGIN_AIRPORT"] == "ATL") 
    })
    //Iteration über  das gefilterte Datenset
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
    //Je nachdem Welcher Knopf gedrückt wurde  wird  der  entsprechende Graph ausgegeben
    if (value == "percentage") {
        renderWeatherPieAllTimePercentage()
    }
    else if (value == "absolute") {
        renderWeatherPieAllTimeAbsolute()
    }
}

//Funktion zur  kalkulation der Daten für das  Wetter/Verspätungs-Säulendiagramm
async function runBar(){
    //Erstellen von Arrays, um die Zeiten jedes Wetters fest zu halten
    let fairHours = []
    let partlyCloudyHours = []
    let mostlyCloudyHours  = []
    let cloudyHours = []
    let rainyHours  = []

    //Warten auf das  Einlesen der  Daten
    let data = await  Promise.all([flightsProm, weatherProm])
    //Datenset nach  Flügen aus Atlanta filtern
    let flightsATL = data[0].filter((row) => {
        return (row["ORIGIN_AIRPORT"] == "ATL")
    })
    //Iteration über die Wetterdaten um die Zeiten des jeweiligen Wetters herauszufinden
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
    //Flugdaten für das Wetter "Fair"
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
    //FLugdaten für das  Wetter "Partly Cloudy"
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
    //FLugdaten  für das Wetter "Mostly Cloudy"
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
    //FLugdaten für das Wetter "Cloudy"
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
    //FLugdaten für das Wetter "Light Rain"
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

//Konvertiert zwei Zahlen zu der eraltion von der ersten zur zweiten in Prozent
function convertToPercentage(delayed,punctual) {
    return ((delayed / (delayed + punctual))*100)

}


//Erstellt das Kuchendiagramm für alle Verspätungen in Prozent
function renderWeatherPieAllTimePercentage(){
    let departureDelayPie = [{
        values: [delayedFlightsAllTime,punctualFlightsAllTime],
        labels: ['Verspätet', 'Pünktlich'],
        type: 'pie',
        marker: {
            colors: ['rgb(80,0,5)','rgb(0,60,10)']
        },
      }];
      
    Plotly.newPlot('weatherAllTime', departureDelayPie, {}, {responsive: true});

}
//Erstellt das Säulendiagramm für alle Verspätungen  in ganzen  Stunden
function renderWeatherPieAllTimeAbsolute(){
    let data = [
        {
          x: ["Verspätungen", "Verfrühungen"],
          y: [absoluteDelayAllTime,absolutePunctualityAllTime],
          type: 'bar',
          marker: {
            color: 'rgb(56, 75, 126)'
            }
        }
      ];
      
      Plotly.newPlot('weatherAllTime', data, {}, {responsive: true});

}
//Erstellt das Kuchendiegramm für  die stündlichen Verspätungen in Prozent
function renderWeatherPieHourly(){
    let departureDelayPieHourly = [{
        values: [delayedFlights,punctualFlights],
        labels: ['Verspätet', 'Pünktlich'],
        type: 'pie',
        marker: {
            colors: ['rgb(80,0,5)','rgb(0,60,10)']
        },
      }];
      
    Plotly.newPlot('weatherPieHourly', departureDelayPieHourly, {}, {responsive: true});

}
//Erstellt das Säulendiagramm für alle Verspätungen nach Wetter
function renderBarPercentage(){
    var trace1 = {
        x: ["Fair","Partly Cloudy","Mostly Cloudy","Cloudy","Light Rain"],
        y: [convertToPercentage(delayedFlightsFair,punctualFlightsFair),convertToPercentage(delayedFLightsPartly,punctualFlightsPartly),convertToPercentage(delayedFlightsMostly,punctualFlightsMostly),convertToPercentage(delayedFlightsCloudy,punctualFlightsCloudy),convertToPercentage(delayedFlightsRainy,punctualFlightsRainy)],
        type: 'bar',
        text: [(convertToPercentage(delayedFlightsAllTime,punctualFlightsAllTime) - convertToPercentage(delayedFlightsFair,punctualFlightsFair)) + ' unter dem Durchschnitt', (convertToPercentage(delayedFlightsAllTime,punctualFlightsAllTime) - convertToPercentage(delayedFLightsPartly,punctualFlightsPartly)) + ' unter dem Durchschnitt', (convertToPercentage(delayedFlightsAllTime,punctualFlightsAllTime) - convertToPercentage(delayedFlightsMostly,punctualFlightsMostly)) + ' unter dem Durchschnitt', (convertToPercentage(delayedFlightsAllTime,punctualFlightsAllTime) - convertToPercentage(delayedFlightsCloudy,punctualFlightsCloudy)) + ' unter dem Durchschnitt', ((convertToPercentage(delayedFlightsAllTime,punctualFlightsAllTime) - convertToPercentage(delayedFlightsRainy,punctualFlightsRainy))* -1) +' über dem Durchschnitt'],
        marker: {
            color: 'rgb(56, 75, 126)'
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
//Hauptfunktion beim ersten Aufrufen des Dashboards
function weather_main() {
    runPie(12)
    runBar()
    runPieAllTime('percentage')
}