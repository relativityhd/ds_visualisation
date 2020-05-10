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
 * - (SCHEDULED_TIME - ELAPSED_TIME) / DISTANCE (Flugzeit / km)
 * - (DESTINATION_DELAY - DEPARTURE_DELAY) / DISTANCE (Aufgeholte Verspätung / km)
 * 
 * Interaktive Gründe:
 * - Flugzeit / km | Aufgeholte Verspätung / km
 * - Abflug Verspätung | Ankunft Verspätung
 * - Abflug Flughafen | Ankunft Flughafen | Airline | Flugnummer
 * 
 * Alle Möglichkeiten zur Map (Alles durchschnittswerte um Vergleichbarkeit zu erzielen):
 * - [ Koordinate		& Größe Punkt			& Farbe Punkt ]
 * - Abflug Flughafen	& Abflug Verspätung		& Flugzeit
 * - Abflug Flughafen	& Abflug Verspätung		& Aufgeholte Verspätung
 * - Abflug Flughafen	& Ankunft Verspätung	& Flugzeit
 * - Abflug Flughafen	& Ankunft Verspätung	& Aufgeholte Verspätung
 * - Ankunft Flughafen	& Abflug Verspätung		& Flugzeit
 * - Ankunft Flughafen	& Abflug Verspätung		& Aufgeholte Verspätung
 * - Ankunft Flughafen	& Ankunft Verspätung	& Flugzeit
 * - Ankunft Flughafen	& Ankunft Verspätung	& Aufgeholte Verspätung
 * ===> Werden zusammengefasst zu 3 Radio-Buttons:
 * = Abflug/Ankunft Flughafen (2 Wahl-Möglichkeiten)
 * = Abflug/Ankunft Verspätung (2 Wahl-Möglichkeiten)
 * = Flugzeit/Aufgeholte Verspätung (2 Wahl-Möglichkeiten)
 * ===> 2^3 = 8 Anzeige Möglichkeiten
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
 * ===> Werden zusammengefasst zu 2 Radio-Buttons:
 * = Abflug/Ankunft Flughafen / Airline / Flugnummer (4 Wahl-Möglichkeiten)
 * = Abflug/Ankunft Verspätung / Flugzeit/Aufgeholte Verspätung (4 Wahl-Möglichkeiten)
 * ==> 4^2 = 16 Anzeige Möglichkeiten
 */

// Input Radios sind mit Keywords versehen
// Input Radios für Mapbox
let airport_choice = "ankunft-port" // "ankunft-port" oder "abflug-port" [text]
let late_choice = "ankunft-late" // "ankunft-late" oder "abflug-late" [größe]
let km_choice = "flugzeit" // "flugzeit" oder "aufgeholt" [farbe]

// Input Radios für Bar Plot
let x_choice = "airline" // "airline", "flugnummer", "abflug-port" oder "ankunft-port" [x-achse]
let y_choice = "flugzeit" // "flugzeit", "aufgeholt", "ankunft-late", "abflug-late" [y-achse]

let rows = []
Plotly.d3.csv(
    // Ist noch nicht die locale file, weil ditt iwie nicht funktioniert aufgrund von Zugriffsbeschränkungen
    "https://gist.githubusercontent.com/florianeichin/b877d354d6bc52e6ce840572e40b0497/raw/19759410471073756a388dada5fcb40109f0d13e/flights_subset_cleaned.csv",
	(err, r) => {
		rows = r
		console.log(r)
		renderMapPlot()
	}
);

function unpack(rows, keyword) {

	// Nach Flughafen Mappen
	if (keyword=="ankunft-port") {
		return rows.map((row) => {
			return row["DESTINATION_AIRPORT"];
		})
	} else if (keyword=="abflug-port") {
		return rows.map((row) => {
			return row["ORIGIN_AIRPORT"];
		})
	} else if (keyword=="ankunft-late") {
		return rows.map((row) => {
			return parseFloat(row["DESTINATION_DELAY"]);
		})
	} else if (keyword=="abflug-late") {
		return rows.map((row) => {
			return parseFloat(row["DEPARTURE_DELAY"]);
		})
	} else if (keyword=="flugzeit") {
		return rows.map((row) => {
			return parseFloat(row["SCHEDULED_TIME"] - row["ELAPSED_TIME"]) || 0;
		})
	} else if (keyword=="aufgeholt") {
		return rows.map((row) => {
			return parseFloat(row["DESTINATION_DELAY"] - row["DEPARTURE_DELAY"])*(-1) || 0;
		})
	} else if (keyword=="airline") {
		return rows.map((row) => {
			return row["AIRLINE"];
		})
	} else if (keyword=="flugnummer") {
		return rows.map((row) => {
			return row["FLIGHT_NUMBER"];
		})
	}
}

function unpack_pos(rows, keyword, lonlat) {
	if (keyword=="ankunft-port" && lonlat=="lon") {
		return rows.map((row) => {
			return row["DESTINATION_AIRPORT_LON"];
		})
	} else if (keyword=="abflug-port" && lonlat=="lon") {
		return rows.map((row) => {
			return row["ORIGIN_AIRPORT_LON"];
		})
	} else if (keyword=="ankunft-port" && lonlat=="lat") {
		return rows.map((row) => {
			return row["DESTINATION_AIRPORT_LAT"];
		})
	} else if (keyword=="abflug-port" && lonlat=="lat") {
		return rows.map((row) => {
			return row["ORIGIN_AIRPORT_LAT"];
		})
	}
}

function renderMapPlot() {
	// late_data ist ein Array bestehend aus den Values welche vom Benutzer gewählt wurden
	let late_data = unpack(rows, late_choice),
		minval = Math.min.apply(Math, late_data),
		maxval = Math.max.apply(Math, late_data)
	let size_data = late_data.map(val => {
		val = val - minval
		return parseInt(2 + (20*val/(maxval - minval)))
	})

	var data = [
		{
			type: "scattermapbox",
			text: unpack(rows, airport_choice),
			lon: unpack_pos(rows, airport_choice, "lon"),
			lat: unpack_pos(rows, airport_choice, "lat"),
			marker: {
				color: unpack(rows, km_choice),
				colorscale: 'Portland',
				showscale: true,
				colorbar: {
					title: {
						text: (km_choice == "flugzeit" ? "Flugzeit" : "Aufgeholte Flugzeit")+" in Minuten",
						side: "right"
					}
				},
				cmin: minval,
				cmax: maxval,
				size: size_data }
		}
	];

	var layout = {
		dragmode: "zoom",
		mapbox: { style: "open-street-map", center: { lat: 38, lon: -90 }, zoom: 3 },
		margin: { r: 0, t: 0, b: 0, l: 0 }
	};

	Plotly.newPlot("map-plot", data, layout);
}

function map_radio_changed(type, radioBtn) {

	if (type=="port") {
		airport_choice = radioBtn.value
	} else if (type=="late") {
		late_choice = radioBtn.value
	} else if (type=="time") {
		km_choice = radioBtn.value
	} else {
		return false
	}
	renderMapPlot()
}
