const Filter = require("bad-words");

//Check if username contains only alphanumeric characters
function validUsername(uname){
    uname = uname.toString();
    if(uname.length <= 3){
        return false;
    }
    uname = uname.replace(/[A-Za-z0-9]/g, ""); //get rid of all alphanumeric characters
    return !uname.length; 
}

//Check if password is required length
function validPass(pword){
    pword = pword.toString();
    return pword.length >= 8 && pword.length <= 64;
}

//Check if rating is an integer between 1 and 5
function validRating(rating){
    try {
        let numRate = parseInt(rating)
        if(numRate < 1 || numRate > 5){
            return false;
        } else {
            return true;
        }
    } catch (e){
        return false;
    }
}

//Checks for inappropriate words, 300 character limit.
function validContent(content){
    const filter = new Filter();
    if(content.length > 300){
        return false;
    } else if(filter.isProfane(content)){
        return false;
    }

    return true;
}

module.exports = { validUsername, validPass, validContent, validRating}