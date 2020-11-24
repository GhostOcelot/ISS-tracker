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

const getISSPosition = () => {
	fetch("https://api.wheretheiss.at/v1/satellites/25544")
		.then(res => res.json())
		.then(data => {
			const ISSPosition = [data.longitude, data.latitude]
			const ISSPositionMercator = fromLonLat(ISSPosition)
			setTimeout(() => info.classList.remove("close"), 1000)
			const map = new Map({
				layers: [
					new Tile({
						source: new OSM()
					})
				],
				target: "map",
				view: new View({
					center: [ISSPositionMercator[0], ISSPositionMercator[1]],
					zoom: 2
				})
			})

			const positionFeature = new Feature()

			positionFeature.setStyle(
				new Style({
					image: new Circle({
						radius: 4,
						fill: new Fill({
							color: "red"
						})
					})
				})
			)

			positionFeature.setGeometry(new Point(ISSPositionMercator))

			new Vector({
				map: map,
				source: new VectorSource({
					features: [positionFeature]
				})
			})
		})
}

getISSPosition()

info.addEventListener("click", () => info.classList.toggle("mini"))

setInterval(() => {
	fetch("https://api.wheretheiss.at/v1/satellites/25544")
		.then(res => res.json())
		.then(data => {
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
		})
}, 1000)
