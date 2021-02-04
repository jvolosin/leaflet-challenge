// Creating map object
var myMap = L.map("map", {
  center: [-15.92, -56.75],
  zoom: 4
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


var usgsURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


//Set colors based on depth
var colors = ["#33FFC3", "#26BF92", "#1A8062", "#0D4031", "#062018"]
var depth = [0, 30, 50, 70, 90];

//Request Data
d3.json(usgsURL, function(response) {
  console.log(response);

  var usgsURL = response.features;

  function getColor(d) {
    for (var i = 0; i < depth.length; i++) {
      if (d < depth[i]) {
        return colors[i - 1];
      }
      else if (d > depth[depth.length - 1]) {
        return colors[depth.length - 1];
      }
    }
  }


  // Create loop
  for (var i = 0; i < usgsURL.length; i++) {

    
    var location = usgsURL[i].geometry;

    //Create markers and popup info
    
    if (location) {
      L.circleMarker([location.coordinates[1], location.coordinates[0]], {
        fillOpacity: 0.65,
        color: "black",
        weight: 0.5,
        fillColor: getColor(location.coordinates[2]),
        radius: usgsURL[i].properties.mag 
      }).bindPopup("Magnitude: " + usgsURL[i].properties.mag
        + "<br>Depth: " + location.coordinates[2]
        + "<br>Location:" + usgsURL[i].properties.place)
        .addTo(myMap);
        }
  }
});