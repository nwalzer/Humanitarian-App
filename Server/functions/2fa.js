const twofactor = require("node-2fa");

function generateSecret(uname){
    const newSecret = twofactor.generateSecret({ name: "LGBT+ Resource Application Prototype", account: uname });
    return newSecret;
}

function verifyToken(secret, token){
    const res = twofactor.verifyToken(secret, token);
    if(res && res.delta === 0){
        return true;
    } else {
        return false;
    }
}

module.exports = { generateSecret, verifyToken }