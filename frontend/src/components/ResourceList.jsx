import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { List, ListItem, ListItemText, ListItemIcon, Dialog, DialogTitle, Button } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { useHistory  } from 'react-router-dom'


const dialogStyle = {
  dialogPaper: {
        minHeight: '80vh',
        maxHeight: '80vh',
    },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#00000'
}

function SimpleDialog(props) {
    const { onClose, open, docInfo } = props;
    let history = useHistory();

    const handleReview = () => {
        history.push('/review/' + docInfo.uid);
    }
    console.log(docInfo);
    return (
        <Dialog style={dialogStyle} onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Resource Information</DialogTitle>
            <Button onClick={handleReview}> Leave a Review </Button>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    docInfo: PropTypes.object.isRequired
};

export default function ResourceList(){
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(false);
    const [dbData, setDBData] = useState();
    const [selectedData, setSelectedData] = useState();
    let history = useHistory();

    const listStyle = {
      height: '50vh',
      width: '50vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      float: 'right',
      flexDirection: 'column',
      display: 'flex'
    }

    const listItemStyle = {
      backgroundColor: '#c4c4c4',
      width: '47vh',
      border: '1px solid #444',
      margin: '5px',
      borderRadius:25,
      display: 'flex'
    }

    const listItemTextStyle = {
      width: '45vh',
      fontSize:16,
      color: '#000000'
    }

    const listIconStyle ={
      color: '#ffc107',
      justifyContent: 'flex-end',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      justify: 'flex-end'
    }

    const handleClick = (doc) => {
        setOpen(true);
        setSelectedData(doc);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedData();
    };

    firebase.auth().onAuthStateChanged(userStatus => {
        if (userStatus && !user) {
            setUser(true);
            firebase.firestore().collection("resources").get().then((snapshot) => {
                let data = [];
                snapshot.forEach((doc) => {
                    console.log(doc.data());
                    let thisData = doc.data();
                    let tempInfo = {
                        "uid":doc.id,
                        "Address":thisData.Address,
                        "City":thisData.City,
                        "Description":thisData.Description,
                        "Email":thisData.Email,
                        "Name":thisData.Name,
                        "Phone":thisData.Phone,
                        "Website":thisData.Website
                    }
                    data.push(tempInfo);
                })
                setDBData(data);
            })
        } else if (!user) {
            setUser(false);
        }
    });

    if (user && dbData) {
        const listItems = dbData.map((doc) =>
            <ListItem style={listItemStyle} button onClick={() => {handleClick(doc);}}>
              <ListItemText style={listItemTextStyle}
                primary = {doc.Name}
                secondary = {doc.Address}/>

                <ListItemIcon style = {listIconStyle}>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText
                  secondary = "5/5" />
            </ListItem>
        );
        return <div>
            <List style={listStyle}>
                {listItems}
            </List>
            <SimpleDialog open={open} onClose={handleClose} docInfo={selectedData} />
        </div>;
    }
    else {
        return (
            <div></div>
        );
    }
}
