// ACCESS TOKEN
mapboxgl.accessToken = 'pk.eyJ1IjoiY2Vpbm5hIiwiYSI6ImNsdWx1Nnl1ZTE1enkya28xc3gxeDE0eG8ifQ.2g1H9RrzSpRkOmNOns7Dpg'


// ---------------------------------------------------------------

// ADD BASE MAP AND FUNCTIONALITY

var mapOptions = {
    container: 'map-container', // container ID
    style: 'mapbox://styles/mapbox/dark-v11', // dark basemap
    center: [1.39433, 48.04965], // starting position [lng, lat]
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
        var imageUrl = tourDate.Nights > 1 ? 'gold-disco.png' : 'silver-disco.png';
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

// ADD FUNCTIONALITY TO BUTTONS

// For the button with a North America ID, when clicked will fly to center the United States
document.getElementById('northAmerica').addEventListener('click', () => {
    userInteracting = true,
        // Fly to a random location
        map.flyTo({
            center: [-107.20676, 40.09066],
            zoom: 3.8,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });

});

// For the button with a European ID, when clicked will fly to center the Europe
document.getElementById('europe').addEventListener('click', () => {
    userInteracting = true,
        // Fly to a random location
        map.flyTo({
            center: [6.46103, 49.92353],
            zoom: 3.9,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
});
