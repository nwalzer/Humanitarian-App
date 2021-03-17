import React, { useState, useRef, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogContentText, Button } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import PropTypes from 'prop-types';

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

const dialogStyle = {
  height: '50vh',
  width: '50vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#00000'
}

const listStyle = {
  height: '80vh',
  width: '50vh',
  overflowY: 'auto',
  overflowX: 'hidden',
  flexDirection: 'column',
  display: 'flex'
}

const listItemStyle = {
  backgroundColor: '#c4c4c4',
  width: '47vh',
  border: '1px solid #444',
  margin: '5px',
  borderRadius: 25,
  display: 'flex'
}

const listItemTextStyle = {
  width: '45vh',
  fontSize: 16,
  color: '#000000'
}

const listIconStyle = {
  color: '#ffc107',
  justifyContent: 'flex-end',
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  justify: 'flex-end'
}

export default function UserMap() {

  const mapContainer = useRef();
  const buttonRef = useRef();
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [mapObj, setMapObj] = useState();

  const [open, setOpen] = useState(false);
  const [resData, setResData] = useState();
  const [selectedData, setSelectedData] = useState();

  const [user, setUser] = useState(false);
  const [dbData, setDBData] = useState({});

  let history = useHistory();



  function createPopUp(currentFeature) {

    const handleClick = () => {
      console.log("switching pages");
      history.push({ pathname: '/resource/' + currentFeature.uid })
    }


    if (mapObj) {
      var popUps = document.getElementsByClassName('mapboxgl-popup');
      /** Check if there is already a popup on the map and if so, remove it */
      if (popUps[0]) popUps[0].remove();

      var coordinates = new mapboxgl.LngLat(currentFeature.Lng, currentFeature.Lat);
      var description = '<h3>' + currentFeature.Name + '</h3>' + '<h4>' + currentFeature.Address + '</h4>' + `
      <button class="btn" ref=${buttonRef.current}>See More</button>`;


      var popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(mapObj);
      const btn = document.getElementsByClassName("btn")[0];
      btn.addEventListener("click", handleClick);
    }
  };

  function createPopUp2(currentFeature) {

    const handleClick = () => {
      console.log("switching pages");
      history.push({ pathname: '/resource/' + currentFeature.uid })
    }


    if (mapObj) {
      var popUps = document.getElementsByClassName('mapboxgl-popup');
      /** Check if there is already a popup on the map and if so, remove it */
      if (popUps[0]) popUps[0].remove();

      var description = '<h3>' + currentFeature.properties.Name + '</h3>' + '<h4>' + currentFeature.properties.Address + '</h4>' + `
      <button class="btn" ref=${buttonRef.current}>See More</button>`;


      var popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(description)
        .addTo(mapObj);
      const btn = document.getElementsByClassName("btn")[0];
      btn.addEventListener("click", handleClick);
    }
  };



  const handleClick = (doc) => {
    //setOpen(true);
    //setSelectedData(doc);
    if (mapObj) {
      mapObj.flyTo({
        center: [
          doc.Lng,
          doc.Lat
        ],
        essential: true,
      });
      createPopUp(doc);
    }

  }; 

  const flyToDot = (currentFeature) => {
    if (mapObj) {
      mapObj.flyTo({
        center: [
          currentFeature.geometry.coordinates[0],
          currentFeature.geometry.coordinates[1]
        ],
        essential: true
      });
    }
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedData();
  };

  firebase.auth().onAuthStateChanged(userStatus => {
    if (userStatus && !user) {
      setUser(true);
      firebase.firestore().collection("resources").get().then((snapshot) => {
        let data = {
          "type": "FeatureCollection",
          "features": []
        }
        let resData = [];
        snapshot.forEach((doc) => {
          let thisData = doc.data();
          let resInfo = {
            "uid": doc.id,
            "Address": thisData.Address,
            "City": thisData.City,
            "Description": thisData.Description,
            "Email": thisData.Email,
            "Name": thisData.Name,
            "Phone": thisData.Phone,
            "Website": thisData.Website,
            "Lng": thisData.Longitude,
            "Lat": thisData.Latitude
          }
          resData.push(resInfo);

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
        setResData(resData);

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

      map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['resources']
        });

        /* If yes, then: */
        if (features.length) {
          var clickedPoint = features[0];

          console.log(clickedPoint.properties.uid);
          flyToDot(clickedPoint);
          createPopUp2(clickedPoint);

          /* Highlight listing in sidebar (and remove highlight for all other listings) */
          var activeItem = document.getElementsByClassName('active');

          if (activeItem[0]) {
            activeItem[0].classList.remove('active');
          }
        }

      });

      setMapObj(map);

      return () => map.remove();
    }
    else return <div>Loading</div>
  }, [user, dbData]);

  if (user && resData) {
    const listItems = resData.map((doc) =>
      <ListItem style={listItemStyle} button onClick={() => { handleClick(doc); }}>
        <ListItemText style={listItemTextStyle}
          primary={doc.Name}
          secondary={doc.Address} />

        <ListItemIcon style={listIconStyle}>
          <StarIcon />
        </ListItemIcon>
        <ListItemText
          secondary="5/5" />
      </ListItem>
    );

    return <div>
      <div class='sidebar-user'>
        <List style={listStyle}>
          {listItems}
        </List>
        <SimpleDialog open={open} onClose={handleClose} docInfo={selectedData} />
      </div>
      <div className="map-container-user" ref={mapContainer} />
    </div>
  } else {
    return <div>
      <div class='sidebar-user'>
        <div class='heading'>
          <h1>Our locations</h1>
        </div>
      </div>
      <div className="map-container-user" ref={mapContainer} />
    </div>
  }

}


function SimpleDialog(props) {
  const { onClose, open, docInfo } = props;
  const [loadedReviews, setLoadedReviews] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  let history = useHistory();

  const handleReview = () => {
    history.push('/review/' + docInfo.uid);
  }

  const loadReviews = () => {
    firebase.firestore().collection("reviews").where('locID', '==', docInfo.uid).get().then((val) => {
      if (!val.empty) {
        let tempList = [];
        val.forEach(doc => {
          tempList.push(doc.data());
        });
        setReviewList(tempList);
        setLoadedReviews(true);
      }
    })
  }

  if (!docInfo) {
    return (<div></div>);
  } else {
    if (!loadedReviews) {
      loadReviews();
    }
    const listItems = reviewList.map((doc) =>
      <ListItem style={listItemStyle}>
        <ListItemText style={listItemTextStyle}
          primary={doc.uname}
          secondary={doc.content} />

        <ListItemIcon style={listIconStyle}>
          <StarIcon />
        </ListItemIcon>
        <ListItemText
          secondary={doc.rating} />
      </ListItem>
    );

    return (
      <div style={dialogStyle}>
        <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
          <DialogTitle id="simple-dialog-title">{docInfo.Name}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-address" primary="Address">
              Address: {docInfo.Address}, {docInfo.City}
            </DialogContentText>
            <DialogContentText id="alert-dialog-contact" primary="Contact">
              Email: {docInfo.Email}, Phone: {docInfo.Phone}, Website: {docInfo.Website}
            </DialogContentText>
            <DialogContentText>
              {docInfo.Description}
            </DialogContentText>
          </DialogContent>
          <Button onClick={handleReview}> Leave a Review </Button>
          <List style={listStyle}>
            {listItems}
          </List>
        </Dialog>
      </div>
    );
  }
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  docInfo: PropTypes.object.isRequired
};