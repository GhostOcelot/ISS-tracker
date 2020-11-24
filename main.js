import "ol/ol.css"
import Feature from "ol/Feature"
import Map from "ol/Map"
import Point from "ol/geom/Point"
import View from "ol/View"
import { Circle, Fill, Style } from "ol/style"
import { OSM, Vector as VectorSource } from "ol/source"
import { Tile, Vector } from "ol/layer"
import { fromLonLat } from "ol/proj"

const info = document.querySelector(".info")

const positionFeature = new Feature()

const getISSPosition = () => {
	fetch("https://api.wheretheiss.at/v1/satellites/25544")
		.then(res => res.json())
		.then(data => {
			console.log(data)
			const ISSPosition = [data.longitude, data.latitude]
			const ISSPositionMercator = fromLonLat(ISSPosition)

			info.innerHTML = `
				<p style="font-size: 18px">ISS Tracker</p>
				<div class="first-divider"></div>
				<p>latitude: <br /><span class="latitude">${ISSPosition[1].toFixed(
					6
				)} </span></p>
				<div class="divider" /></div>
				<p>longitude: <br /><span class="longitude"> ${ISSPosition[0].toFixed(
					6
				)}</span></p>
				<div class="divider" /></div>
				<p>altitude: <br /><span class="altitude"> ${data.altitude.toFixed()} km</span></p>
				<div class="divider" /></div>
				<p>speed: <br /><span class="speed"> ${data.velocity.toFixed()} km/h</span></p>
				`
			setTimeout(() => info.classList.remove("close"), 1000)

			positionFeature.setGeometry(new Point(ISSPositionMercator))

			map.getView().setCenter(ISSPositionMercator)
		})
}

const map = new Map({
	layers: [
		new Tile({
			source: new OSM()
		})
	],
	target: "map",
	view: new View({
		center: [0, 0],
		zoom: 3
	})
})

positionFeature.setStyle(
	new Style({
		image: new Circle({
			radius: 5,
			fill: new Fill({
				color: "red"
			})
		})
	})
)

new Vector({
	map: map,
	source: new VectorSource({
		features: [positionFeature]
	})
})

getISSPosition()

info.addEventListener("click", () => info.classList.toggle("mini"))

setInterval(getISSPosition, 2000)
