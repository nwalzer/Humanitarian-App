import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { List, ListItem, Dialog, DialogTitle, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useHistory  } from 'react-router-dom'


function SimpleDialog(props) {
    const { onClose, open, docInfo } = props;
    let history = useHistory();

    const handleReview = () => {
        history.push('/review/' + docInfo.uid);
    }

    console.log(docInfo);

    return (
        <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Resource Information</DialogTitle>
            info goes here
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
            <ListItem button onClick={() => {handleClick(doc);}}>Name: {doc.Name}. Address: {doc.Address}. Email: {doc.Email}</ListItem>
        );
        return <div>
            <List>
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