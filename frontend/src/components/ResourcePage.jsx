import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemIcon, Button } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF"
  }
})(Typography);

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

export default function ResourcePage(props) {

  const [loadedResource, setLoadedResource] = useState(false);
  const [resourceInfo, setResourceInfo] = useState();
  const [loadedReviews, setLoadedReviews] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  let history = useHistory();

  const handleReview = () => {
    history.push('/review/' + props.pathID);
  }

  const loadResources = () => {
    firebase.firestore().collection("resources").doc(props.pathID).get().then((doc) => {
      if (doc.exists) {
        setResourceInfo(doc.data());
        setLoadedResource(true);
      } else {
        console.log("No such document!");
      }
    })
  }

  const loadReviews = () => {
    firebase.firestore().collection("reviews").where('locID', '==', props.pathID).get().then((val) => {
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

  if (!loadedResource) {
    loadResources();
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
    <div>
      <WhiteTextTypography noWrap>{resourceInfo.Name}</WhiteTextTypography>
      <WhiteTextTypography noWrap> Address: {resourceInfo.Address}, {resourceInfo.City} </WhiteTextTypography>
      <WhiteTextTypography noWrap> Email: {resourceInfo.Email}, Phone: {resourceInfo.Phone}, Website: {resourceInfo.Website} </WhiteTextTypography>
      <WhiteTextTypography> {resourceInfo.Description} </WhiteTextTypography>
      <Button onClick={handleReview}> <WhiteTextTypography noWrap> Leave a Review </WhiteTextTypography> </Button>
      <List style={listStyle}>
        {listItems}
      </List>
    </div>
  );
  }

}



