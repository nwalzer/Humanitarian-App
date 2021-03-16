import React, { useState, useRef, useEffect } from 'react';

import config from '../assets/mapbox.json'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '../assets/heatmap.css'
import GeoData from '../assets/resources.json'


// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const MAPBOX_TOKEN = config.REACT_APP_TOKEN;

export default function HeatmapPage() {

  const mapContainer = useRef();
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);


  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [lng, lat],
      zoom: zoom,
      accessToken: MAPBOX_TOKEN
    });
    map.addControl(
      new MapboxGeocoder({
        accessToken: MAPBOX_TOKEN,
        mapboxgl: mapboxgl
      })
    );

    map.on('load', function () {
      map.addSource('resources', {
        type: 'geojson',
        data: GeoData
      });

      

      map.addLayer({
        id: 'resources-heat',
        type: 'heatmap',
        source: 'resources',
        maxzoom: 15,
        paint: {
          // increase weight as diameter breast height increases
          'heatmap-weight': {
            property: 'dbh',
            type: 'exponential',
            stops: [
              [1, 0],
              [62, 1]
            ]
          },
          // increase intensity as zoom level increases
          'heatmap-intensity': {
            stops: [
              [11, 1],
              [15, 3]
            ]
          },
          // assign color values be applied to points depending on their density
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(236,222,239,0)',
            0.2, 'rgb(208,209,230)',
            0.4, 'rgb(166,189,219)',
            0.6, 'rgb(103,169,207)',
            0.8, 'rgb(28,144,153)'
          ],
          // increase radius as zoom increases
          'heatmap-radius': {
            stops: [
              [11, 15],
              [15, 20]
            ]
          },
          // decrease opacity to transition into the circle layer
          'heatmap-opacity': {
            default: 1,
            stops: [
              [14, 1],
              [15, 0]
            ]
          },
        }
      }, 'waterway-label');

      map.addLayer({
        id: 'resources-point',
        type: 'circle',
        source: 'resources',
        minzoom: 14,
        paint: {
          'circle-radius': {
            property: 'dbh',
            type: 'exponential',
            stops: [
              [{ zoom: 15, value: 1 }, 5],
              [{ zoom: 15, value: 62 }, 10],
              [{ zoom: 22, value: 1 }, 20],
              [{ zoom: 22, value: 62 }, 50],
            ]
          },
          'circle-color': {
            property: 'dbh',
            type: 'exponential',
            stops: [
              [0, 'rgba(236,222,239,0)'],
              [10, 'rgb(236,222,239)'],
              [20, 'rgb(208,209,230)'],
              [30, 'rgb(166,189,219)'],
              [40, 'rgb(103,169,207)'],
              [50, 'rgb(28,144,153)'],
              [60, 'rgb(1,108,89)']
            ]
          },
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1,
          'circle-opacity': {
            stops: [
              [14, 0],
              [15, 1]
            ]
          }
        }
      }, 'waterway-label');
    });

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });



    return () => map.remove();
  }, []);

  return (
    <div>
      <div className="map-container" ref={mapContainer} />
    </div>
  )
}