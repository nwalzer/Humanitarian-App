/* import firebase from "firebase/app";
import "firebase/database";
 */
const bcrypt = require("bcrypt");

function addNewUser(uname, phone, email, pass) {
    firebase.database().ref('users/' + uname).set({
      username: uname,
      email: email,
      phone: phone,
      salt: "h",
      pass: pass
    });
  }

const hashPassword = async (password, saltRounds = 10) => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds);
        console.log("SALT:" + salt)

        // Hash password
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }

    // Return null if error
    return null;
};

module.exports.addNewUser = addNewUser;
module.exports.hashPassword = hashPassword;