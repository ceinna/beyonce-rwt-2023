// Access Token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2Vpbm5hIiwiYSI6ImNsdWx1Nnl1ZTE1enkya28xc3gxeDE0eG8ifQ.2g1H9RrzSpRkOmNOns7Dpg'

var mapOptions = {
    container: 'map-container', // container ID
    style: 'mapbox://styles/mapbox/dark-v11', // dark basemap
    center: [12.72369, 46.62962], // starting position [lng, lat]
    zoom: 3.3, // starting zoom,
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

function spinGlobe() {
    const zoom = map.getZoom();
    if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 250 / secondsPerRevolution;
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
map.on('dragstart', () => {
    userInteracting = true;
});

// When animation is complete, start spinning if there is no ongoing interaction
map.on('moveend', () => {
    spinGlobe();
});

spinGlobe();

// loop over the pizzaData array to make a marker for each record
beyonceData.forEach(function (tourDate) {

    var color

    // use if statements to assign colors based on pizzaData.program
    if (tourDate.Nights === 1) {
        color = '#8dd6a1'
    }
    if (tourDate.Nights != 1) {
        color = '#d67ea6'
    }


    // create a popup to attach to the marker
    const popup = new mapboxgl.Popup({
        offset: 24,
        anchor: 'bottom'
    }).setText(
        `Beyoncé  first performed in ${tourDate.City}, ${tourDate.Country} on ${tourDate["First Date"]}. The recorded attendance for all nights performed was ${tourDate.Attendance} which earned her ${tourDate.Revenue} in revenue.`
    );

// create a marker, set the coordinates, add the popup, add it to the map
new mapboxgl.Marker({
    scale: 0.65,
    color: color
})
    .setLngLat([tourDate.Longitude, tourDate.Latitude])
    .setPopup(popup)
    .addTo(map);
})
