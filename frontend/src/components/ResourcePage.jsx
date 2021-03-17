import React, { useState, useRef, useEffect } from 'react';
import { useLocation, withRouter, useHistory } from "react-router-dom";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


export default function ResourcePage(props) {

    const [loadedResource, setLoadedResource] = useState(false);
    const [resourceList, setResourceList] = useState([]);
    const [loadedReviews, setLoadedReviews] = useState(false);
    const [reviewList, setReviewList] = useState([]);
    let history = useHistory();

    const loadResources = () => {
        firebase.firestore().collection("resources").where(firebase.firestore.FieldPath.documentId(), '==', props.pathID).get().then((val) => {
            if (!val.empty) {
                setResourceList(val);
                setLoadedResource(true);
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

    
      loadResources(); 
      loadReviews(); 


useEffect(() => {
    if (loadedReviews) {
      // you will get updated finalData here, each time it changes
      console.log("Updated Reviews");
      console.log(resourceList); 
    }
  }, [loadedReviews]);

  useEffect(() => {
    if (loadedResource) {
      // you will get updated finalData here, each time it changes
      console.log("Updated Resources");
      console.log(reviewList); 
    }
  }, [loadedResource]);



return (
    <div> </div>
); 

}



