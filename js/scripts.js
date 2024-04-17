// Access Token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2Vpbm5hIiwiYSI6ImNsdWx1Nnl1ZTE1enkya28xc3gxeDE0eG8ifQ.2g1H9RrzSpRkOmNOns7Dpg'


// BASE OF MAP: SPINNING GLOBE ZOOMED IN ON NORTHERN HEMISPHERE
// ALL DATES PERFORMED IN EUROPE AND NORTH AMERICA

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
map.on('dragstart', () => {
    userInteracting = true;
});

// When animation is complete, start spinning if there is no ongoing interaction
map.on('moveend', () => {
    spinGlobe();
});

spinGlobe();


// //  UPLOAD TWO IMAGES FOR TWO MAKERS AND HAVE THE MARKERS DISPLAYED BASED ON DIFFERENT CRITERIA (NUMBER OF NIGHTS PERFORMED)

// // Iterate over the beyonceData array and display image icons based on criteria
// // Once the map is loaded, add the markers based on the data
// map.on('load', function () {
//     map.loadImage('https://i.postimg.cc/dDcq7dt5/silver-disco.png', function (error, image1) {
//         if (error) throw error;
//         map.addImage('silver-disco', image1); // 'silver-disco' is the image ID for icon 1
//     });

//     // Add custom image 2 as a map sprite
//     map.loadImage('https://i.postimg.cc/jjXRLGyJ/gold-disco.png', function (error, image2) {
//         if (error) throw error;
//         map.addImage('gold-disco', image2); // 'gold-disco' is the image ID for icon 2
//     });


//     // Iterate over the beyonceData array
//     beyonceData.forEach(tourDate => {
//         // Determine the image icon based on the criteria
//         let iconImage;
//         if (tourDate.Nights === 1) {
//             iconImage = 'silver-disco'; // Custom image icon 1
//         } else {
//             iconImage = 'gold-disco'; // Custom image icon 2
//         }

//         // Add a marker for each data point
//         map.addLayer({
//             id: tourDate["First Date"],
//             type: 'symbol',
//             source: {
//                 type: 'geojson',
//                 data: {
//                     type: 'Feature',
//                     geometry: {
//                         type: 'Point',
//                         coordinates: [tourDate.Longitude, tourDate.Latitude]
//                     }
//                 }
//             },
//             layout: {
//                 'icon-image': iconImage,
//                 'icon-size': 0.025
//             }

//         });
//             map.on('click', tourDate["First Date"], function (e) {
//                 new mapboxgl.Popup()
//                     .setLngLat(e.features[0].geometry.coordinates)
//                     .setText(`Beyoncé  first performed in ${tourDate.City}, ${tourDate.Country} on ${tourDate["First Date"]}. Recorded attendance for all nights performed was ${tourDate.Attendance} which earned her ${tourDate.Revenue} in revenue.`)
//                     .addTo(map);

//             });
// });
// });

map.on('load', function () {
    beyonceData.forEach(tourDate => {
      var imageUrl = tourDate.Nights > 1 ? 'gold-disco.png' : 'silver-disco.png';
      var el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(' + imageUrl + ')';

      new mapboxgl.Marker(el)
        .setLngLat([tourDate.Longitude, tourDate.Latitude])
        .setPopup(new mapboxgl.Popup().setHTML('Beyoncé  first performed in ' + tourDate.City +', '+ tourDate.Country + ' on ' + tourDate["First Date"] + '. Recorded attendance for all nights performed was ' + tourDate.Attendance + ' which earned her ' + tourDate.Revenue + ' in revenue.'))
        .addTo(map);
    });
});

document.getElementById('north-america').addEventListener('click', () => {
    // Fly to a random location
    map.flyTo({
        center: [-104.60460, 40.09066],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
});

document.getElementById('europe').addEventListener('click', () => {
    // Fly to a random location
    map.flyTo({
        center: [4.70531, 48.18800],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
});
