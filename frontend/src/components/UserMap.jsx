import React, { useState, useRef, useEffect } from 'react';
import ResourceList from './ResourceList';
import Button from '@material-ui/core/Button';

import config from '../assets/mapbox.json'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '../assets/map.css'

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const MAPBOX_TOKEN = config.REACT_APP_TOKEN;



export default function UserMap() {

  const mapContainer = useRef();
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [mapObj, setMapObj] = useState();

  const [user, setUser] = useState(false);
  const [dbData, setDBData] = useState({});

  firebase.auth().onAuthStateChanged(userStatus => {
    if (userStatus && !user) {
      setUser(true);
      firebase.firestore().collection("resources").get().then((snapshot) => {
        let data = {
          "type": "FeatureCollection",
          "features": []
        }
        snapshot.forEach((doc) => {
          let thisData = doc.data();
          let tempInfo = {
            "type": "Feature",
            "properties": {
              "uid": doc.id,
              "Address": thisData.Address,
              "City": thisData.City,
              "Description": thisData.Description,
              "Email": thisData.Email,
              "Name": thisData.Name,
              "Phone": thisData.Phone,
              "Website": thisData.Website
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                thisData.Longitude,
                thisData.Latitude
              ]
            }
          }
          data.features.push(tempInfo);
        })

        setDBData(data);

      })
    } else if (!user) {
      setUser(false);
    }
  });



  useEffect(() => {
    if (dbData) {
      // you will get updated finalData here, each time it changes
      console.log("Updated Data");
    }
  }, [dbData]);

  useEffect(() => {
    if (user) {
      // you will get updated finalData here, each time it changes
      console.log("Updated User");
    }
    // you can trigger your function from here
  }, [user]);


  useEffect(() => {

    if (user && dbData) {
     const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v10',
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

      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      );

      map.on('move', () => {
        setLng(map.getCenter().lng.toFixed(4));
        setLat(map.getCenter().lat.toFixed(4));
        setZoom(map.getZoom().toFixed(2));
      });


      map.on('load', function () {
        map.addSource('resources', {
          type: 'geojson',
          data: dbData
        });
        map.addLayer({
          "id": 'resources',
          "type": "circle",
          "source": 'resources'
        });
      }
      );
      document.getElementById('fly').addEventListener('click', function () {
        // Fly to a random location by offsetting the point -74.50, 40
        // by up to 5 degrees.
        map.flyTo({
          center: [
            -74.5 + (Math.random() - 0.5) * 10,
            40 + (Math.random() - 0.5) * 10
          ],
          essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
      });

      return () => map.remove();
    }
    else return <div>Loading</div>
  }, [user, dbData]);

  const handleFly = () => {
    console.log("FLYING");
    mapObj.flyTo({
      center: [
        -74.5 + (Math.random() - 0.5) * 10,
        40 + (Math.random() - 0.5) * 10
      ],
      essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
  }

  return <div>
    <div class='sidebar-user'>
      <div class='heading'>
        <h1>Our locations</h1>
      </div>
      <button id="fly">Fly</button>
      <ResourceList />
      <Button onclick={handleFly}>CLICK HERE FOR TEST</Button>
    </div>
    <div className="map-container-user" ref={mapContainer} />
  </div>

}