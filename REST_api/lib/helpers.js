const crypto = require("crypto");
const config = require("../config");

let helpers = {};

helpers.hash = function(str) {
    let hash = crypto.createHmac("sha256", config.hashingSecret).update(str).digest("hex");
    return hash;
};

helpers.parseJsonToObject = function(str) {
    try {
        let obj = JSON.parse(str);
        return obj;
    } catch (err) {
        return {};
    }
};

module.exports = helpers;