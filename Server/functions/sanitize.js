//Check if phone is in format +19876543210
function validPhone(pnum){
    let num = pnum.toString();
    let res = num.length === 12;
    res = res && num.charAt(0) === "+";
    res = res && num.charAt(1) === "1";

    return res;
}

//Check if username contains only alphanumeric characters
function validUsername(uname){
    uname = uname.toString();
    if(uname.length <= 3){
        return false;
    }
    uname = uname.replace(/[A-Za-z0-9]/g, ""); //get rid of all alphanumeric characters
    console.log("Reduced UNAME", uname);
    return !uname.length; 
}

//Check if password is require length and complexity (8-32 characters, no spaces, and at least: 1 upper case, 1 lower case, 1 number, 1 special character)
function validPass(pword){
    pword = pword.toString();
    let res = pword.length >= 8 && pword.length <= 32;
    console.log(res, pword.replace(/[A-Z]/, ""));

    res = res && !!pword.match(/[A-Z]/); //at least 1 uppercase

    res = res && !!pword.match(/[a-z]/); //at least 1 lowercase

    res = res && !!pword.match(/[0-9]/); //at least 1 number

    res = res && (pword.replace(/[A-Za-z0-9]/g, "").length > 0); //at least 1 special character
    
    res = res && (pword.replace(/\s+/, "").length === pword.length); //no spaces
    return res;
}

module.exports = {validPhone, validUsername, validPass}