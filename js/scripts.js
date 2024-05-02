// ACCESS TOKEN
mapboxgl.accessToken = 'pk.eyJ1IjoiY2Vpbm5hIiwiYSI6ImNsdWx1Nnl1ZTE1enkya28xc3gxeDE0eG8ifQ.2g1H9RrzSpRkOmNOns7Dpg'


// ---------------------------------------------------------------

// ADD BASE MAP AND FUNCTIONALITY

var mapOptions = {
    container: 'map-container', // container ID
    style: 'mapbox://styles/mapbox/dark-v11', // dark basemap
    center: [6, 49.5], // starting position [lng, lat]
    zoom: 3.8, // starting zoom,
    projection: 'globe',
    height: 3,
    interactive: false //make map static
}

// instantiate the map
const map = new mapboxgl.Map(mapOptions);

// add a navitation control
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');


// ---------------------------------------------------------------

//  UPLOAD TWO IMAGES FOR TWO MAKERS AND HAVE THE MARKERS DISPLAYED BASED ON DIFFERENT CRITERIA (NUMBER OF NIGHTS PERFORMED)

map.on('load', function () {
    beyonceData.forEach(tourDate => {
        var imageUrl = tourDate.Nights > 1 ? 'images/gold-disco.png' : 'images/silver-disco.png';
        var el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(' + imageUrl + ')';

        // Create a popup content string with HTML markup
        var popupContent = `<h3>Venue Details</h3>` +
            `<p><strong>City, Country:</strong> ${tourDate.City},  ${tourDate.Country} </p>` +
            `<p><strong>First performance date:</strong> ${tourDate["First Date"]}</p>` +
            `<p><strong>Total recorded attendance:</strong> ${tourDate.Attendance}</p>` +
            `<p><strong>Total revenue earned:</strong> ${tourDate.Revenue}</p>`;

        new mapboxgl.Marker(el)
            .setLngLat([tourDate.Longitude, tourDate.Latitude])
            .setPopup(new mapboxgl.Popup().setHTML(popupContent))
            .addTo(map);
    });
});


// ---------------------------------------------------------------

// ADD TOGGLE FUNCTIONALITY TO BUTTONS

var button = document.getElementById('toggleButton');
var isNorthAmerica = true;

button.addEventListener('click', function () {
    // Map starts centered on Europe. Button will first read, 'Jump to NA Tour Locations' and when pressed, will do so
    if (isNorthAmerica) {
        map.flyTo({
            center: [-91, 39],
            zoom: 3.4,
            pitch: 0, // Set the pitch to 0 degrees to make the projection not tilted
            bearing: 0 // Set the bearing to north
        });
        button.innerHTML = 'Jump to European Tour Locations';
        isNorthAmerica = false;
        // Once pressed, button will read 'Jump to European Tour Locations' and when pressed will do so. Button will toggle back and forth with these commands
    } else {
        map.flyTo({
            center: [6, 49.5],
            zoom: 3.8
        });
        button.innerHTML = 'Jump to North America Tour Locations';
        isNorthAmerica = true;
    }
});


// ADD FUNCTIONALITY TO COLLAPSIBLE
// from https://www.w3schools.com/howto/howto_js_collapsible.asp

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}