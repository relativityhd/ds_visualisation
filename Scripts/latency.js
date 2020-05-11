/**
 * Ziel:
 * Es geht darum, mögliche Verspätungsgründe interaktiv darzustellen
 * Dabei soll der Benutzer zwischen Verschiedenen interaktiven möglichen Gründen wählen
 * 
 * Benutzte Variablen:
 * - AIRLINE (Airline)
 * - FLIGHT_NUMBER (Flugnummer)
 * - DESTINATION_AIRPORT (Ankunft-Flughafen)
 * - ORIGIN_AIRPORT (Abflug-Flughafen)
 * - DEPARTURE_DELAY (Abflug Verspätung)
 * - DESTINATION_DELAY (Ankunft Verspätung)
 * - ELAPSED_TIME * 100 / (DISTANCE) (Flugzeit / 100 km)
 * - (DESTINATION_DELAY - DEPARTURE_DELAY) * 100 / (DISTANCE) (Aufgeholte Verspätung / 100 km)
 * 
 * Interaktive Gründe:
 * - Flugzeit / km | Aufgeholte Verspätung / km
 * - Abflug Verspätung | Ankunft Verspätung
 * - Abflug Flughafen | Ankunft Flughafen | Airline | Flugnummer
 * - SUM | AVG
 * 
 * Alle Möglichkeiten zur Map (Größe und Farbe Auswahl aus Durchschnittswerte und Absolutwerte):
 * - [ Koordinate		& Größe Punkt			& Farbe Punkt ]
 * - Abflug Flughafen	& Abflug Verspätung		& Flugzeit
 * - Abflug Flughafen	& Abflug Verspätung		& Aufgeholte Verspätung
 * - Abflug Flughafen	& Ankunft Verspätung	& Flugzeit
 * - Abflug Flughafen	& Ankunft Verspätung	& Aufgeholte Verspätung
 * - Ankunft Flughafen	& Abflug Verspätung		& Flugzeit
 * - Ankunft Flughafen	& Abflug Verspätung		& Aufgeholte Verspätung
 * - Ankunft Flughafen	& Ankunft Verspätung	& Flugzeit
 * - Ankunft Flughafen	& Ankunft Verspätung	& Aufgeholte Verspätung
 * ===> Werden zusammengefasst zu 4 Radio-Button-Groups:
 * = Abflug/Ankunft Flughafen (2 Wahl-Möglichkeiten)
 * = Abflug/Ankunft Verspätung (2 Wahl-Möglichkeiten)
 * = Flugzeit/Aufgeholte Verspätung (2 Wahl-Möglichkeiten)
 * = AVG / SUM (2 Wahl Möglichkeiten)
 * ===> 2^4 = 16 Anzeige Möglichkeiten!
 * 
 * Alle Möglichkeiten zu einem Bar Plot:
 * - [ X				& Y ]
 * - Airline			& Abflug Verspätung
 * - Airline			& Ankunft Verspätung
 * - Airline			& Flugzeit
 * - Airline			& Aufgeholte Verspätung
 * - Flugnummer			& Abflug Verspätung
 * - Flugnummer			& Ankunft Verspätung
 * - Flugnummer			& Flugzeit
 * - Flugnummer			& Aufgeholte Verspätung
 * - Abflug Flughafen	& Abflug Verspätung
 * - Abflug Flughafen	& Ankunft Verspätung
 * - Abflug Flughafen	& Flugzeit
 * - Abflug Flughafen	& Aufgeholte Verspätung
 * - Ankunft Flughafen	& Abflug Verspätung
 * - Ankunft Flughafen	& Ankunft Verspätung
 * - Ankunft Flughafen	& Flugzeit
 * - Ankunft Flughafen	& Aufgeholte Verspätung
 * ===> Werden zusammengefasst zu 3 Radio-Button-Groups:
 * = Abflug/Ankunft Flughafen / Airline / Flugnummer (4 Wahl-Möglichkeiten)
 * = Abflug/Ankunft Verspätung / Flugzeit/Aufgeholte Verspätung (4 Wahl-Möglichkeiten)
 * = AVG / SUM (2 Wahl Möglichkeiten)
 * ==> 4*4*2 = 32 Anzeige Möglichkeiten!
 */


// Input Radios sind mit Keywords versehen
// Input Radios für Mapbox
let airport_choice = $('input[name=radios-port]:checked').val() || "ankunft-port" // "ankunft-port" oder "abflug-port" [text]
let late_choice = $('input[name=radios-late]:checked').val() || "ankunft-late" // "ankunft-late" oder "abflug-late" [größe]
let km_choice = $('input[name=radios-time]:checked').val() || "flugzeit" // "flugzeit" oder "aufgeholt" [farbe]
let map_op_choice = $('input[name=radios-map-op]:checked').val() || "AVG" // "SUM" oder "AVG" [Typ der angewanten Operation]

// Input Radios für Bar Plot
let x_choice = $('input[name=radios-x]:checked').val() || "airline" // "airline", "flugnummer", "abflug-port" oder "ankunft-port" [x-achse]
let y_choice = $('input[name=radios-y]:checked').val() || "flugzeit" // "flugzeit", "aufgeholt", "ankunft-late", "abflug-late" [y-achse]
let bar_op_choice = $('input[name=radios-bar-op]:checked').val() || "AVG" // "SUM" oder "AVG" [Typ der angewanten Operation]

// Initiere Globale Variablen für die Formatierten Daten
let dest_airports = {},
	org_airports = {},
	airlines = {},
	flights = {}

// D3 CSV Input
Plotly.d3.csv(
    // Ist  nicht die locale file, weil ditt iwie nicht funktioniert aufgrund von Zugriffsbeschränkungen mit JavaScript
	//"https://gist.githubusercontent.com/florianeichin/b877d354d6bc52e6ce840572e40b0497/raw/19759410471073756a388dada5fcb40109f0d13e/flights_subset_cleaned.csv", // Subset
	"https://gist.githubusercontent.com/florianeichin/cfa1705e12ebd75ff4c321427126ccee/raw/c86301a0e5d0c1757d325424b8deec04cc5c5ca9/flights_all_cleaned.csv", // Richtiges
	(err, rows) => {
		console.log(rows)
		// Überprüfe die Inputs zum Sicherstellen
		airport_choice = $('input[name=radios-port]:checked').val()
		late_choice = $('input[name=radios-late]:checked').val()
		km_choice = $('input[name=radios-time]:checked').val()
		map_op_choice = $('input[name=radios-map-op]:checked').val()

		x_choice = $('input[name=radios-x]:checked').val()
		y_choice = $('input[name=radios-y]:checked').val()
		bar_op_choice = $('input[name=radios-bar-op]:checked').val()
		
		// Überschreibe die alten Daten in den Formatierten Objecten
		dest_airports = {}
		org_airports = {}
		airlines = {}
		flights = {}

		// Iteriere durch jede Zeile und Formatiere die Daten
		rows.forEach(row => {
			// Zeilen Werte die benutzt werden in Variablen speichern
			let rows_dest_airport = row["DESTINATION_AIRPORT"],
				rows_org_airport = row["ORIGIN_AIRPORT"],
				rows_flight = row["FLIGHT_NUMBER"],
				rows_airline = row["AIRLINE"]
			
			let rows_dest_lon = row["DESTINATION_AIRPORT_LON"],
				rows_dest_lat = row["DESTINATION_AIRPORT_LAT"],
				rows_org_lon = row["ORIGIN_AIRPORT_LON"],
				rows_org_lat = row["ORIGIN_AIRPORT_LAT"]

			let rows_dep_delay = parseFloat(row["DEPARTURE_DELAY"]),
				rows_dest_delay = parseFloat(row["DESTINATION_DELAY"]),
				rows_scd_time = parseFloat(row["SCHEDULED_TIME"]),
				rows_elap_time = parseFloat(row["ELAPSED_TIME"]),
				rows_dist = parseFloat(row["DISTANCE"])
			
			// Berechnung Flugzeit / 100km
			let flght_km = parseFloat(rows_elap_time * 1000 / rows_dist),
				rcvd_flght_km = parseFloat((rows_dest_delay - rows_dep_delay) * 1000 / rows_dist)

			// dad = destination airport data, oad = origin airport data, ald = airline data, fnd = flight (number) data
			let dad = dest_airports[rows_dest_airport],
				oad = org_airports[rows_org_airport],
				ald = airlines[rows_airline],
				fnd = flights[rows_flight]

			// Datensatz zu Airport wurde schon angelegt
			if (dad) {
				dad["DEPARTURE_DELAY"].push(rows_dep_delay)
				dad["DESTINATION_DELAY"].push(rows_dest_delay)
				dad["FLIGHTTIME_KM"].push(flght_km)
				dad["RECOVERED_FLIGHTTIME_KM"].push(rcvd_flght_km)
			// Datensatz zu Airport wurde noch nicht angelegt
			} else {
				// Erstelle nested Object, später wird der durchschnitt ausgerechnet
				dest_airports[rows_dest_airport] = {
					"AIRPORT": rows_dest_airport,
					"AIRPORT_LAT": rows_dest_lat,
					"AIRPORT_LON": rows_dest_lon,
					"DEPARTURE_DELAY": [ rows_dep_delay ],
					"DESTINATION_DELAY": [ rows_dest_delay ],
					"FLIGHTTIME_KM": [ flght_km ],
					"RECOVERED_FLIGHTTIME_KM": [ rcvd_flght_km ]
				}
			}

			// Datensatz zu Airport wurde schon angelegt
			if (oad) {
				oad["DEPARTURE_DELAY"].push(rows_dep_delay)
				oad["DESTINATION_DELAY"].push(rows_dest_delay)
				oad["FLIGHTTIME_KM"].push(flght_km)
				oad["RECOVERED_FLIGHTTIME_KM"].push(rcvd_flght_km)
			// Datensatz zu Airport wurde noch nicht angelegt
			} else {
				// Erstelle nested Object, später wird der durchschnitt ausgerechnet
				org_airports[rows_org_airport] = {
					"AIRPORT": rows_org_airport,
					"AIRPORT_LAT": rows_org_lat,
					"AIRPORT_LON": rows_org_lon,
					"DEPARTURE_DELAY": [ rows_dep_delay ],
					"DESTINATION_DELAY": [ rows_dest_delay ],
					"FLIGHTTIME_KM": [ flght_km ],
					"RECOVERED_FLIGHTTIME_KM": [ rcvd_flght_km ]
				}
			}

			// Datensatz zu Airport wurde schon angelegt
			if (ald) {
				ald["DEPARTURE_DELAY"].push(rows_dep_delay)
				ald["DESTINATION_DELAY"].push(rows_dest_delay)
				ald["FLIGHTTIME_KM"].push(flght_km)
				ald["RECOVERED_FLIGHTTIME_KM"].push(rcvd_flght_km)
			// Datensatz zu Airport wurde noch nicht angelegt
			} else {
				// Erstelle nested Object, später wird der durchschnitt ausgerechnet
				// AIRPORT beschreibt hier den Namen der Airline, damit die unpack funktion weiterhin funktioniert
				airlines[rows_airline] = {
					"AIRPORT": rows_airline,
					"DEPARTURE_DELAY": [ rows_dep_delay ],
					"DESTINATION_DELAY": [ rows_dest_delay ],
					"FLIGHTTIME_KM": [ flght_km ],
					"RECOVERED_FLIGHTTIME_KM": [ rcvd_flght_km ]
				}
			}

			
			// Datensatz zu Airport wurde schon angelegt
			if (fnd) {
				fnd["DEPARTURE_DELAY"].push(rows_dep_delay)
				fnd["DESTINATION_DELAY"].push(rows_dest_delay)
				fnd["FLIGHTTIME_KM"].push(flght_km)
				fnd["RECOVERED_FLIGHTTIME_KM"].push(rcvd_flght_km)
			// Datensatz zu Airport wurde noch nicht angelegt
			} else {
				// Erstelle nested Object, später wird der durchschnitt ausgerechnet
				// AIRPORT beschreibt hier die Flugnummer, damit die unpack funktion weiterhin funktioniert
				flights[rows_flight] = {
					"AIRPORT": "FLT-"+rows_flight,
					"DEPARTURE_DELAY": [ rows_dep_delay ],
					"DESTINATION_DELAY": [ rows_dest_delay ],
					"FLIGHTTIME_KM": [ flght_km ],
					"RECOVERED_FLIGHTTIME_KM": [ rcvd_flght_km ]
				}
			}
		})

		// Berechne den Durschnitt und die Summe
		Object.keys(dest_airports).forEach(key => {
			let dad = dest_airports[key]
			dad["DEPARTURE_DELAY_AVG"] = getAVG(dad["DEPARTURE_DELAY"])
			dad["DESTINATION_DELAY_AVG"] = getAVG(dad["DESTINATION_DELAY"])
			dad["FLIGHTTIME_KM_AVG"] = getAVG(dad["FLIGHTTIME_KM"])
			dad["RECOVERED_FLIGHTTIME_KM_AVG"] = getAVG(dad["RECOVERED_FLIGHTTIME_KM"])
			dad["DEPARTURE_DELAY_SUM"] = getSUM(dad["DEPARTURE_DELAY"])
			dad["DESTINATION_DELAY_SUM"] = getSUM(dad["DESTINATION_DELAY"])
			dad["FLIGHTTIME_KM_SUM"] = getSUM(dad["FLIGHTTIME_KM"])
			dad["RECOVERED_FLIGHTTIME_KM_SUM"] = getSUM(dad["RECOVERED_FLIGHTTIME_KM"])
		})
		Object.keys(org_airports).forEach(key => {
			let oad = org_airports[key]
			oad["DEPARTURE_DELAY_AVG"] = getAVG(oad["DEPARTURE_DELAY"])
			oad["DESTINATION_DELAY_AVG"] = getAVG(oad["DESTINATION_DELAY"])
			oad["FLIGHTTIME_KM_AVG"] = getAVG(oad["FLIGHTTIME_KM"])
			oad["RECOVERED_FLIGHTTIME_KM_AVG"] = getAVG(oad["RECOVERED_FLIGHTTIME_KM"])
			oad["DEPARTURE_DELAY_SUM"] = getSUM(oad["DEPARTURE_DELAY"])
			oad["DESTINATION_DELAY_SUM"] = getSUM(oad["DESTINATION_DELAY"])
			oad["FLIGHTTIME_KM_SUM"] = getSUM(oad["FLIGHTTIME_KM"])
			oad["RECOVERED_FLIGHTTIME_KM_SUM"] = getSUM(oad["RECOVERED_FLIGHTTIME_KM"])
		})
		Object.keys(airlines).forEach(key => {
			let ald = airlines[key]
			ald["DEPARTURE_DELAY_AVG"] = getAVG(ald["DEPARTURE_DELAY"])
			ald["DESTINATION_DELAY_AVG"] = getAVG(ald["DESTINATION_DELAY"])
			ald["FLIGHTTIME_KM_AVG"] = getAVG(ald["FLIGHTTIME_KM"])
			ald["RECOVERED_FLIGHTTIME_KM_AVG"] = getAVG(ald["RECOVERED_FLIGHTTIME_KM"])
			ald["DEPARTURE_DELAY_SUM"] = getSUM(ald["DEPARTURE_DELAY"])
			ald["DESTINATION_DELAY_SUM"] = getSUM(ald["DESTINATION_DELAY"])
			ald["FLIGHTTIME_KM_SUM"] = getSUM(ald["FLIGHTTIME_KM"])
			ald["RECOVERED_FLIGHTTIME_KM_SUM"] = getSUM(ald["RECOVERED_FLIGHTTIME_KM"])
		})
		Object.keys(flights).forEach(key => {
			let fnd = flights[key]
			fnd["DEPARTURE_DELAY_AVG"] = getAVG(fnd["DEPARTURE_DELAY"])
			fnd["DESTINATION_DELAY_AVG"] = getAVG(fnd["DESTINATION_DELAY"])
			fnd["FLIGHTTIME_KM_AVG"] = getAVG(fnd["FLIGHTTIME_KM"])
			fnd["RECOVERED_FLIGHTTIME_KM_AVG"] = getAVG(fnd["RECOVERED_FLIGHTTIME_KM"])
			fnd["DEPARTURE_DELAY_SUM"] = getSUM(fnd["DEPARTURE_DELAY"])
			fnd["DESTINATION_DELAY_SUM"] = getSUM(fnd["DESTINATION_DELAY"])
			fnd["FLIGHTTIME_KM_SUM"] = getSUM(fnd["FLIGHTTIME_KM"])
			fnd["RECOVERED_FLIGHTTIME_KM_SUM"] = getSUM(fnd["RECOVERED_FLIGHTTIME_KM"])
		})

		// Rendere Plots
		renderMapPlot()
		renderBarPlot()
		renderPiePlot()
	}
);


// Funktion um den Durschnitt eines Arrays zu berechnen
function getAVG(arr) {
	return arr.reduce((prev, curr) => {return prev + curr}) / arr.length
}

// Funktion um die Summ eines Arrays zu berechnen
function getSUM(arr) {
	return arr.reduce((prev, curr) => {return prev + curr})
}


/**
 * ========================================================================================================
 * MAP Function ===========================================================================================
 * ========================================================================================================
 */

// Sorgt interaktiv dafür, dass dem Plot die richtigen Daten gegeben werden. Steuerung über keyword.
function unpack_map(keyword) {
	let mapby = keyword == "port" ? "AIRPORT" :
				keyword == "lat" ? "AIRPORT_LAT" :
				keyword == "lon" ? "AIRPORT_LON" :
				keyword == "abflug-late" ? "DEPARTURE_DELAY_"+map_op_choice :
				keyword == "ankunft-late" ? "DESTINATION_DELAY_"+map_op_choice :
				keyword == "flugzeit" ? "FLIGHTTIME_KM_"+map_op_choice :
				keyword == "aufgeholt" ? "RECOVERED_FLIGHTTIME_KM_"+map_op_choice:
				"AIRPORT"

	if (airport_choice == "ankunft-port") {
		return Object.keys(dest_airports).map(key => {
			return dest_airports[key][mapby]
		})
	} else if (airport_choice == "abflug-port") {
		return Object.keys(org_airports).map(key => {
			return org_airports[key][mapby]
		})
	}
}


function renderMapPlot() {

	// Berechne die Größe der einzelnen Punkte
	let late_data = unpack_map(late_choice),
		minval = Math.min.apply(Math, late_data),
		maxval = Math.max.apply(Math, late_data)
	let size_data = late_data.map(val => {
		val = val - minval
		return parseInt(4 + (20*val/(maxval - minval)))
	})

	var data = [
		{
			type: "scattermapbox",
			text: unpack_map("port"),
			lon: unpack_map("lon"),
			lat: unpack_map("lat"),
			marker: {
				color: unpack_map(km_choice),
				colorscale: 'Portland',
				showscale: true,
				colorbar: {
					title: {
						text: (km_choice == "flugzeit" ? "Flugzeit" : "Aufgeholte Flugzeit")+" in Minuten / 1000 km",
						side: "right"
					}
				},
				size: size_data }
		}
	];

	var layout = {
		dragmode: "zoom",
		mapbox: { style: "open-street-map", center: { lat: 38, lon: -90 }, zoom: 3 },
		margin: { r: 0, t: 0, b: 0, l: 0 }
	};

	// Responsive Web Design
	var config = {responsive: true}

	Plotly.newPlot("map-plot", data, layout, config);
}


// Funktion welche ausgeführt wird, wenn der Benutzer auf einen Radio Button klickt
function map_radio_changed(type, radioBtn) {
	if (type=="port") {
		airport_choice = radioBtn.value
	} else if (type=="late") {
		late_choice = radioBtn.value
	} else if (type=="time") {
		km_choice = radioBtn.value
	} else if (type=="map-op") {
		map_op_choice = radioBtn.value
	} else {
		return false
	}
	renderMapPlot()
}



/**
 * ========================================================================================================
 * BAR Function ===========================================================================================
 * ========================================================================================================
 */

// Bar Plot funktionert von Datenaufbau her genauso wie Map Plot!!! 

function unpack_bar(keyword) {

	let mapby = keyword == "port" ? "AIRPORT" :
				keyword == "abflug-late" ? "DEPARTURE_DELAY_"+bar_op_choice :
				keyword == "ankunft-late" ? "DESTINATION_DELAY_"+bar_op_choice :
				keyword == "flugzeit" ? "FLIGHTTIME_KM_"+bar_op_choice :
				keyword == "aufgeholt" ? "RECOVERED_FLIGHTTIME_KM_"+bar_op_choice:
				"AIRPORT"

	if (x_choice == "ankunft-port") {
		return Object.keys(dest_airports).map(key => {
			return dest_airports[key][mapby]
		})
	} else if (x_choice == "abflug-port") {
		return Object.keys(org_airports).map(key => {
			return org_airports[key][mapby]
		})
	} else if (x_choice == "airline") {
		return Object.keys(airlines).map(key => {
			return airlines[key][mapby]
		})
 	} else if (x_choice == "flugnummer") {
		return Object.keys(flights).map(key => {
			return flights[key][mapby]
		})
	}
}


function renderBarPlot() {

	var data = [
		{
			type: "bar",
			x: unpack_bar("port"),
			y: unpack_bar(y_choice)
		}
	];

	var config = {responsive: true}

	Plotly.newPlot("bar-plot", data, {}, config);
}


function bar_radio_changed(type, radioBtn) {
	if (type=="x") {
		x_choice = radioBtn.value
	} else if (type=="y") {
		y_choice = radioBtn.value
	} else if (type=="bar-op") {
		bar_op_choice = radioBtn.value
	} else {
		return false
	}

	renderBarPlot()
}



/**
 * ========================================================================================================
 * PIE Function ===========================================================================================
 * ========================================================================================================
 */

// Funktion nimm die 5 Werte mit den meisten Verspätungen und gibt entweder die Werte oder die Labels dieser 5, sowie des Rests summiert, zurück.
function unpack_pie(type) {

	if (type == "values") {
		let sorted_arr = Object
			.keys(flights)
			.map(key => {
				return flights[key]["FLIGHTTIME_KM_SUM"]
			}).sort((a, b) => {
				return a < b ? 1 : a > b ? -1 : 0
			})
		return sorted_arr.slice(0, 5).concat([getAVG(sorted_arr.slice(5))]).map(val => {return val.toFixed(2)})
	} else if (type == "labels") {
		let sorted_arr = Object
			.keys(flights)
			.map(key => { return {v: flights[key]["FLIGHTTIME_KM_SUM"], n: key} })
			.sort((a, b) => { return a.v < b.v ? 1 : a.v > b.v ? -1 : 0 })
			.slice(0, 5)
			.map(o => { return "FLIGHT-"+o.n })
		return sorted_arr.concat(["Rest"])
	}
}


function renderPiePlot() {

	var data = [
		{
			type: "pie",
			values: unpack_pie("values"),
			labels: unpack_pie("labels"),
			name: 'Flights',
			marker: {
				colors: ['rgb(56, 75, 126)', 'rgb(18, 36, 37)', 'rgb(34, 53, 101)', 'rgb(36, 55, 57)', 'rgb(6, 4, 4)']
			},
			hoverinfo: 'label+percent+name+value',
			textinfo: 'none',
			automargin: true
		}
	];

	var config = {responsive: true}

	Plotly.newPlot("pie-plot", data, {}, config);
}