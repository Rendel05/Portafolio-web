const coordsPoligono = [
  [21.254885, -98.749395],
  [21.254835, -98.749260],
  [21.254695, -98.749325],
  [21.254745, -98.749460]
];


const map = L.map('map');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

const polygon = L.polygon(coordsPoligono).addTo(map);
polygon.bindPopup("Yo vivo aquí");
map.fitBounds(polygon.getBounds());