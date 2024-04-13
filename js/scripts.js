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


// TRYING TO 1. UPLOAD TWO IMAGES FOR TWO MAKERS AND...
// 2. HAVE THE MARKERS DISPLAYED BASED ON DIFFERENT CRITERIA (NUMBER OF NIGHTS PERFORMED)

// Iterate over the beyonceData array and display image icons based on criteria
// Once the map is loaded, add the markers based on the data
map.on('load', function () {
    map.loadImage('https://i.postimg.cc/dDcq7dt5/silver-disco.png', function (error, image1) {
        if (error) throw error;
        map.addImage('silver-disco', image1); // 'silver-disco' is the image ID for icon 1
    });

    // Add custom image 2 as a map sprite
    map.loadImage('https://i.postimg.cc/jjXRLGyJ/gold-disco.png', function (error, image2) {
        if (error) throw error;
        map.addImage('gold-disco', image2); // 'gold-disco' is the image ID for icon 2
    });


    // Iterate over the beyonceData array
    beyonceData.forEach(tourDate => {
        // Determine the image icon based on the criteria
        let iconImage;
        if (tourDate.Nights === 1) {
            iconImage = 'silver-disco'; // Custom image icon 1
        } else {
            iconImage = 'gold-disco'; // Custom image icon 2
        }

        // create a popup to attach to the marker
        const popup = new mapboxgl.Popup({
            offset: 24,
            anchor: 'bottom'
        }).setText(
            `Beyoncé  first performed in ${tourDate.City}, ${tourDate.Country} on ${tourDate["First Date"]}. Recorded attendance for all nights performed was ${tourDate.Attendance} which earned her ${tourDate.Revenue} in revenue.`
        );

         // Add a marker for each data point
         map.addLayer({
            id: tourDate["First Date"],
            type: 'symbol',
            source: {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [tourDate.Longitude, tourDate.Latitude]
                    }
                }
            },
            layout: {
                'icon-image': iconImage,
                'icon-size': 0.05
            }
        });
    });
});






// OLD TRY #2

// map.on('load', function () {
//     // Add custom image 1 as a map sprite
//     map.loadImage('https://i.postimg.cc/dDcq7dt5/silver-disco.png', function (error, image1) {
//         if (error) throw error;
//         map.addImage('silver-disco', image1); // 'silver-disco' is the image ID for icon 1
//     });

//     // Add custom image 2 as a map sprite
//     map.loadImage('https://i.postimg.cc/jjXRLGyJ/gold-disco.png', function (error, image2) {
//         if (error) throw error;
//         map.addImage('gold-disco', image2); // 'gold-disco' is the image ID for icon 2
//     });

//     // Add a layer with custom image markers
//     map.addLayer({
//         id: 'custom-marker-layer',
//         type: 'symbol',
//         source: {
//             type: 'geojson',
//             data: {
//                 type: 'FeatureCollection',
//                 features: [{
//                     type: 'Feature',
//                     geometry: {
//                         type: 'Point',
//                         coordinates: [-74.5, 40]
//                     },
//                     properties: {
//                         // Assuming 'variable' holds the value
//                         variable: 1 // or any other value
//                     }
//                 }]
//             }
//         },
//         layout: {
//             'icon-image': [
//                 'case',
//                 ['==', ['get', 'variable'], 1], 'silver-disco', // Display custom image 1 if variable equals 1
//                 'gold-disco' // Otherwise, display custom image 2
//             ],
//             'icon-size': 1.5
//         }
//     });
// });






// OLD TRY #1
// beyonceData.forEach(function (tourDate) {
//     // Criteria for differentiating markers
//     const criteria1 = tourDate.Nights === 1; // Example criteria
//     const criteria2 = tourDate.Nights != 1; // Example criteria

//     // Data containing coordinates and criteria
//     const data = [
//         { coordinates: [tourDate.Longitude, tourDate.Latitude], criteria: criteria1 },
//         { coordinates: [tourDate.Longitude, tourDate.Latitude], criteria: criteria2 },
//         // Add more data as needed
//     ];

//     // Iterate over data to create GeoJSON objects
//     const features = data.map(item => ({
//         type: 'Feature',
//         geometry: {
//             type: 'Point',
//             coordinates: item.coordinates
//         },
//         properties: {
//             criteria: item.criteria
//         }
//     }));
// });

// // Add layers to the map
// map.on('load', function () {

//     map.loadImage('https://i.postimg.cc/dDcq7dt5/silver-disco.png', function (error, image) {
//         if (error) throw error;
//         map.addImage('silver-disco', image)
//     }); // 'silver-disco' is the image ID

//     map.loadImage('https://i.postimg.cc/jjXRLGyJ/gold-disco.png', function (error, image) {
//         if (error) throw error;
//         map.addImage('gold-disco', image) // 'gold-disco' is the image ID
//     });

//     // Add layer for criteria1 markers
//     map.addLayer({
//         id: 'criteria1-markers',
//         type: 'symbol',
//         source: {
//             type: 'geojson',
//             data: {
//                 type: 'FeatureCollection',
//                 features: features.filter(feature => feature.properties.criteria === criteria1)
//             }
//         },
//         layout: {
//             'icon-image': 'silver-disco', // Image for criteria1 markers
//             'icon-size': 1.5
//         }
//     });

//     // Add layer for criteria2 markers
//     map.addLayer({
//         id: 'criteria2-markers',
//         type: 'symbol',
//         source: {
//             type: 'geojson',
//             data: {
//                 type: 'FeatureCollection',
//                 features: features.filter(feature => feature.properties.criteria === criteria2)
//             }
//         },
//         layout: {
//             'icon-image': 'gold-disco', // Image for criteria2 markers
//             'icon-size': 1.5
//         }
//     });
// });


//  THE BELOW CODE WORKS FOR CREATING TWO DIFFERENT COLOR MARKERS BASED ON NUMBER OF NIGHTS PERFORMED

// // loop over the beyonceData array to make a marker for each record
// beyonceData.forEach(function (tourDate) {

//     var color

//     // use if statements to assign colors based on beyonceData.program
//     if (tourDate.Nights === 1) {
//         color = '#8dd6a1'
//     }
//     if (tourDate.Nights != 1) {
//         color = '#d67ea6'
//     }


//     // create a popup to attach to the marker
//     const popup = new mapboxgl.Popup({
//         offset: 24,
//         anchor: 'bottom'
//     }).setText(
//         `Beyoncé  first performed in ${tourDate.City}, ${tourDate.Country} on ${tourDate["First Date"]}. Recorded attendance for all nights performed was ${tourDate.Attendance} which earned her ${tourDate.Revenue} in revenue.`
//     );

// // create a marker, set the coordinates, add the popup, add it to the map
// new mapboxgl.Marker({
//     scale: 0.65,
//     color: color
// })
//     .setLngLat([tourDate.Longitude, tourDate.Latitude])
//     .setPopup(popup)
//     .addTo(map);
// })
