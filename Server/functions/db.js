const bcrypt = require("bcrypt");
const admin = require('firebase-admin');

function addNewUser(db, uname, phone, pass) {
  const userRef = db.collection('users');
  return userRef.add({
    phone: phone,
    phash: pass,
    uname: uname
  }).then(function (val) {
    console.log("ADDED: ", val.id);
    return true;
  }).catch(function (error) {
    console.log(error);
    return false;
  });
}

function userExists(db, uname) {
  const ref = db.collection('users');

  return ref.where('uname', '==', uname).get().then(snapshot => {
    if (snapshot.empty) {
      return false;
    } else {
      return true;
    }
  });
}

const hashPassword = async (password, saltRounds = 12) => {
  try {
    return bcrypt.genSalt(saltRounds).then(function (salt) {
      return bcrypt.hash(password, salt);
    });
  } catch (error) {
    console.log(error);
  }
  // Return null if error
  return null;
};

function compareHash(db, user, pword) {
  return getHash(db, user).then(function (hash) {
    if (hash === "FAILED") {
      return false;
    } else {
      return bcrypt.compare(String(pword), String(hash));
    }
  }).catch(function (error) {
    console.log(error);
    return false;
  });
}

function getHash(db, user) {
  const ref = db.collection('users');
  return ref.where('uname', '==', user).get().then(snapshot => {
    if (snapshot.empty) {
      console.log("USER DOES NOT EXIST");
      return "FAILED";
    } else {
      let hash = "";
      snapshot.forEach(doc => {
        hash = doc.data().phash;
      });
      console.log("RETRIEVED HASH");
      return hash;
    }
  });
}

function getUname(db, uid) {
  const ref = db.collection('users').doc(uid);
  return ref.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        return doc.data().uname;
    } else {
        return "";
    }
}).catch((error) => {
    console.log("Error getting document:", error);
    return "";
});

}

function createCustomToken(uname, db) {
  const ref = db.collection('users')

  return ref.where('uname', '==', uname).get().then(snapshot => {
    if (snapshot.empty) {
      return "FAILED";
    } else {
      let uid = "";
      snapshot.forEach(doc => {
        uid = doc.id;
      });
      return admin
        .auth()
        .createCustomToken(uid)
        .then((customToken) => {
          return customToken
        })
        .catch((error) => {
          console.log('Error creating custom token:', error);
          return "FAILED"
        });
    }
  }).catch((error) => {
    console.log('Error getting UID:', error);
    return "FAILED";
  });

}

function review(db, username, rating, content, locID, author) {
  const revRef = db.collection('reviews');
  return revRef.add({
    uname: username,
    rating: rating,
    content: content,
    locID: locID
  }).then(function (val) {
    return setReviewAuthor(db, val.id, author);
  }).catch(function (error) {
    return {"status": "ERROR", "error": error};
  });
}

function setReviewAuthor(db, revID, author){
  const revAuthRef = db.collection('reviewAuthors');
  return revAuthRef.add({
    revID: revID,
    author: author
  }).then(function (val) {
    return {"status": "SUCCESS"};
  }).catch(function (error) {
    return {"status": "ERROR", "error": error};
  });
}

module.exports = { addNewUser, hashPassword, userExists, compareHash, createCustomToken, getUname, review };