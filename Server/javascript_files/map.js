src='https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.js'

    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FrYmFyIiwiYSI6ImNra3RpNHRzdTBoNzUzMW15emlmaGNxYTgifQ.uXLwvykOd7ymJEmXDGTCqg';
    var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
