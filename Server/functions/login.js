const bcrypt = require("bcrypt");

function addNewUser(db, uname, phone, email, pass) {
  const userRef = db.collection('users');
    return userRef.add({
      email: email,
      phone: phone,
      phash: pass,
      uname: uname
    }).then(function(val){
      console.log("ADDED: ", val.id);
      return true;
    }).catch(function(error){
      console.log(error);
      return false;
    });
  }

function userExists(db, uname){
  const ref = db.collection('users');
  
  return ref.where('uname', '==', uname).get().then(snapshot => {
    if (snapshot.empty) {
      return false;
    }  else {
      return true;
    }
  });
}

const hashPassword = async (password, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }
    // Return null if error
    return null;
};

function compareHash(db, user, pword){
  return getHash(db, user).then(function(hash){
		if(hash === "FAILED"){
			return false;
		} else {
			return bcrypt.compareSync(String(pword), String(hash));
		}
  }).catch(function(error){
    console.log(error);
    return false;
  });
}

function getHash(db, user){
  const ref = db.collection('users');
  return ref.where('uname', '==', user).get().then(snapshot => {
    if (snapshot.empty) {
      console.log("USER DOES NOT EXIST");
      return "FAILED";
    }  else {
      let hash = "";
      snapshot.forEach(doc => {
        hash = doc.data().phash;
      });
      console.log("RETRIEVED HASH");
      return hash;
    }
  });
}

module.exports = {addNewUser, hashPassword, userExists, compareHash};