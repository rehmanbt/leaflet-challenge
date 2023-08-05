// Function to create the map and add earthquake data to it
function createMap(earthquakeData) {
    // Creating tile layer that will be the background of the map
    const tileLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      }
    );
  
    // Create base map object to hold the tile layer
    const baseMap = {
      "Map": tileLayer
    };
  
    // Create layer group to hold the markers
    const earthquakes = L.layerGroup();
  
    // Loop through earthquake data to create markers and bind popups
    earthquakeData.features.forEach(feature => {
      const latitude = feature.geometry.coordinates[1];
      const longitude = feature.geometry.coordinates[0];
      const magnitude = feature.properties.mag;
      const depth = feature.geometry.coordinates[2];
      const location = feature.properties.place;
  
      const marker = L.circleMarker([latitude, longitude], {
        radius: magnitude * 5, // Can adjust multiplier to set the marker size based on magnitude
        fillColor: getColor(depth), // Pass the depth to get the color based on depth
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      }).bindPopup(
        "Magnitude: " + magnitude +
        "<br>Depth: " + depth +
        "<br>Location: " + location
      );
  
      marker.addTo(earthquakes);
    });
  
    // Creating map with the baseMap and earthquakes layers
    const map = L.map("map", {
      center: [0, 0],
      zoom: 2,
      layers: [tileLayer, earthquakes]
    });
  
    // Adding the legend to the map
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
      const div = L.DomUtil.create("div", "info legend");
      const depths = [-10, 10, 30, 50, 70, 90];
      const labels = [];
  
      for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
          depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
      }
  
      return div;
    };
    legend.addTo(map);
  }
  
  // Function to get colors based on depth
  function getColor(depth) {
    return depth > 90 ? "#800026" :
           depth > 70 ? "#BD0026" :
           depth > 50 ? "#E31A1C" :
           depth > 30 ? "#FC4E2A" :
           depth > 10 ? "#FD8D3C" :
                        "#FFEDA0";
  }
  
  // Fetching earthquake data from given URL
  fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
    .then(response => response.json())
    .then(data => {
      createMap(data);
    });  