const bcrypt = require("bcrypt");

function addNewUser(db, uname, phone, email, pass) {
    return db.ref('users/' + uname).set({
      email: email,
      phone: phone,
      phash: pass
    }).then(function(val){
      return true;
    }).catch(function(error){
      console.log(error);
      return false;
    });
  }

function userExists(db, uname){
  const ref = db.ref('users/' + uname);
  console.log("REF: " + ref);
  return ref.once("value").then(function(snapshot){
    console.log("CHECKING: " + snapshot.exists());
    return snapshot.exists();
  }).catch(function(error){
    console.log(error);
    return false;
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
  const ref = db.ref('users/' + user);

  return ref.once("value").then(function(snapshot){
    let phash = snapshot.val().phash;
    return phash;    
  }).catch(function(error){
    console.log("Failed to read: " + error);
    return "FAILED";
  })
}

module.exports = {addNewUser, hashPassword, userExists, compareHash};