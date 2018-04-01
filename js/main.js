//custom icon
var LeafIcon = L.Icon.extend({
  options: {
      iconSize:     [38, 35],
      iconAnchor:   [20, 37],
      popupAnchor:  [-1, -33]
  }
});

var customIcon = new LeafIcon({iconUrl: 'images/map-marker.png'})

//setting up layers
var states = [{
  "type": "Feature",
  "properties": {"party": "Republican"},
  "geometry": {
      "type": "Polygon",
      "coordinates": [[
          [-104.05, 48.99],
          [-97.22,  48.98],
          [-96.58,  45.94],
          [-104.03, 45.94],
          [-104.05, 48.99]
      ]]
  }
}, {
  "type": "Feature",
  "properties": {"party": "Democrat"},
  "geometry": {
      "type": "Polygon",
      "coordinates": [[
          [-109.05, 41.00],
          [-102.06, 40.99],
          [-102.03, 36.99],
          [-109.04, 36.99],
          [-109.05, 41.00]
      ]]
  }
}];
var geojsonLayer2 = new L.GeoJSON(states, {
  style: function(feature) {
      switch (feature.properties.party) {
          case 'Republican': return {color: "#ff0000"};
          case 'Democrat':   return {color: "#0000ff"};
      }
  }
});

function onEachFeature(feature, layer) {
  var popupContent = '<table>';
  for (var p in feature.properties) {
    if(p=="Crime" || p=="Date" || p=="Time" || p=="Location" || p=="Perpetrator" || p=="Description"){
      popupContent += '<tr><td>' + p + '</td><td>'+ feature.properties[p] + '</td></tr>';
    }
  }
  popupContent += '</table>';
  layer.bindPopup(popupContent);    
  layer.setIcon(customIcon);
}

var geojsonLayer = new L.GeoJSON.AJAX("./js/NBcrimes.geojson", {onEachFeature: onEachFeature});    

var overlayMaps = {
  "Crimes": geojsonLayer,
  "States": geojsonLayer2
};

var grayscale = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',}),
    positron   = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',});
var baseMaps = {
  "Grayscale": grayscale,
  "Positron": positron
};

// Initialize the map 
var map = L.map('map', {
  center: [40.4862, -74.4518],
  zoom: 14,
  layers: [positron]
});

L.control.layers(baseMaps, overlayMaps).addTo(map);
