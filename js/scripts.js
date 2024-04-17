// ACCESS TOKEN
mapboxgl.accessToken = 'pk.eyJ1IjoiY2Vpbm5hIiwiYSI6ImNsdWx1Nnl1ZTE1enkya28xc3gxeDE0eG8ifQ.2g1H9RrzSpRkOmNOns7Dpg'


// ---------------------------------------------------------------

// ADD FUNCTIONALITY TO BASE MAP: SPINNING GLOBE ZOOMED IN ON NORTHERN HEMISPHERE

var mapOptions = {
    container: 'map-container', // container ID
    style: 'mapbox://styles/mapbox/dark-v11', // dark basemap
    center: [1.39433, 48.04965], // starting position [lng, lat]
    zoom: 3.8, // starting zoom,
    projection: 'globe',
    height: 3,
}

// instantiate the map
const map = new mapboxgl.Map(mapOptions);

// add a navitation control
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

// At low zooms, complete a revolution every two minutes.
const secondsPerRevolution = 75;
// Above zoom level 5, do not rotate.
const maxSpinZoom = 5;
// Rotate at intermediate speeds between zoom levels 3 and 5.
const slowSpinZoom = 3;

let userInteracting = false;
const spinEnabled = true;

// Function to rotate globe
function spinGlobe() {
    const zoom = map.getZoom();
    if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
            // Slow spinning at higher zooms
            const zoomDif =
                (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
        }
        const center = map.getCenter();
        center.lng -= distancePerSecond;
        // Smoothly animate the map over one second.
        // When this animation is complete, it calls a 'moveend' event.
        map.easeTo({ center, duration: 1000, easing: (n) => n });
    }
}

// Pause spinning on interaction
map.on('mousedown', () => {
    userInteracting = true;
});

// Restart spinning the globe when interaction is complete
map.on('mouseup', () => {
    userInteracting = false;
    spinGlobe();
});

// These events account for cases where the mouse has moved
// off the map, so 'mouseup' will not be fired.
map.on('dragend', () => {
    userInteracting = false;
    spinGlobe();
});
map.on('pitchend', () => {
    userInteracting = false;
    spinGlobe();
});
map.on('rotateend', () => {
    userInteracting = false;
    spinGlobe();
});

// When animation is complete, start spinning if there is no ongoing interaction
map.on('moveend', () => {
    spinGlobe();
});

// When page is loaded, globe will spin as a default
spinGlobe();


// ---------------------------------------------------------------

//  UPLOAD TWO IMAGES FOR TWO MAKERS AND HAVE THE MARKERS DISPLAYED BASED ON DIFFERENT CRITERIA (NUMBER OF NIGHTS PERFORMED)

map.on('load', function () {
    beyonceData.forEach(tourDate => {
        var imageUrl = tourDate.Nights > 1 ? 'gold-disco.png' : 'silver-disco.png';
        var el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(' + imageUrl + ')';

        new mapboxgl.Marker(el)
            .setLngLat([tourDate.Longitude, tourDate.Latitude])
            .setPopup(new mapboxgl.Popup().setHTML('Beyoncé  first performed in ' + tourDate.City + ', ' + tourDate.Country + ' on ' + tourDate["First Date"] + '. Recorded attendance for all nights performed was ' + tourDate.Attendance + ' which earned her ' + tourDate.Revenue + ' in revenue.'))
            .addTo(map);
    });
});


// ---------------------------------------------------------------

// ADD FUNCTIONALITY TO BUTTONS

// For the button with a North America ID, when clicked will fly to center the United States
document.getElementById('north-america').addEventListener('click', () => {
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
