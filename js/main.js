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
var NBcrimes = [{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-74.434193, 40.484758]
  },
  "properties": {
    "Crime": "aggravated assault and attempted sexual assault",
    "Date": "Wednesday, March 14, 2018",
    "Time": "3:55 AM",
    "Location": "89 George Street",
    "Perpetrator": "white male, approximately 20 years old, wearing a black hooded sweatshirt",
    "Victim's Rutgers Affiliation": "No",
    "Description": "In this incident the victim reported that she was walking with a male whom she did not know in the area of Commercial Avenue and George Street. They continued to walk together until in the area of 89 George Street when the victim stated that she was not familiar with the area. The perpetrator then knocked the victim to the ground and struck her several times in the face. The perpetrator then touched the victim underneath her clothing while attempting to sexually assault her. The victim successfully defended herself and the perpetrator ran from the area, possibly towards Route 18.",
    "Medical Attention": "The victim refused medical attention.",
    "med_attn": "No",
    "Injuries": "Unknown",
    "Life Threatening": "Unknown",
    "Weapons": "None",
    "Victim's Gender": "Female",
    "Perpetrator's Sex": "Male"
  }
},
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-74.455375, 40.499083]
  },
  "properties": {
    "Crime": "aggravated assault",
    "Date": "Monday, February 12, 2018",
    "Time": "6 PM",
    "Location": "Bristol Street between Guilden and Delafield Streets",
    "Perpetrator": "Descriptions of the perpetrators are limited at this time. A dark colored sedan with tinted windows was described by victims as being seen in the area at the time of the incident, possibly occupied by two males.",
    "Victim's Rutgers Affiliation": "Yes",
    "Description": "In this incident the victims reported that while walking in the area they were hit with paintballs which they believed came from a vehicle idling in the area.",
    "Medical Attention": "None of the victims reported injuries or sought medical attention at the time of the incident.",
    "med_attn": "No",
    "Injuries": "No",
    "Life Threatening": "No",
    "Weapons": "Paintball Gun",
    "Victim's Gender": "Unknown",
    "Perpetrator's Sex": "Unkown"
  }
},
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-74.453138, 40.500131]
  },
  "properties": {
    "Crime": "robbery",
    "Date": "December 11, 2017",
    "Time": "6:40 PM",
    "Location": "Stone Street between Easton Avenue and Sicard Street",
    "Perpetrator": "The description of the perpetrator is limited at this time.",
    "Victim's Rutgers Affiliation": "Yes",
    "Description": "In this incident, the victim reported that he engaged in conversation with a male perpetrator who subsequently struck him, took items of value, and then fled towards Easton Avenue.",
    "Medical Attention": "The victim sustained non-life threatening injuries and declined further medical attention on scene.  No weapons were displayed during this incident.",
    "med_attn": "No",
    "Injuries": "Yes",
    "Life Threatening": "No",
    "Weapons": "None",
    "Victim's Gender": "Male",
    "Perpetrator's Sex": "Male"
  }
},
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-74.449369, 40.498644]
  },
  "properties": {
    "Crime": "aggravated assault",
    "Date": "Sunday, October 28, 2017",
    "Time": "2 AM",
    "Location": "Hamilton Street between Union Street and Easton Avenue",
    "Perpetrator": "The description of the perpetrator is limited at this time.",
    "Victim's Rutgers Affiliation": "No",
    "Description": "In this incident the victim reported that he was engaged in an altercation with another male who displayed a handgun. The victim sustained a gunshot wound to his upper body during the altercation. The suspect then fled on Hamilton Street towards Easton Avenue.",
    "Medical Attention": "The victim was transported to a local hospital for treatment of non-life threatening injuries.",
    "med_attn": "Yes",
    "Injuries": "Yes",
    "Life Threatening": "No",
    "Weapons": "Handgun",
    "Victim's Gender": "Male",
    "Perpetrator's Sex": "Male"
  }
}];

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

var geojsonLayer2 = new L.GeoJSON(states, {
  style: function(feature) {
      switch (feature.properties.party) {
          case 'Republican': return {color: "#ff0000"};
          case 'Democrat':   return {color: "#0000ff"};
      }
  }
});

var geojsonLayer3 = new L.GeoJSON();

$.ajax({
dataType: "json",
url: "NBcrimes.geojson",
success: function(data) {
    $(data.features).each(function(key, data) {
      geojsonLayer3.addData(data);
    });
}
}).error(function() {});

var geojsonLayer = new L.GeoJSON(NBcrimes, {onEachFeature: onEachFeature});
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
  layers: [positron, geojsonLayer]
});

L.control.layers(baseMaps, overlayMaps).addTo(map);