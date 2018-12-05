
const _data   = require("./data");
const helpers = require("./helpers");

// Define handlers
var handlers = {};

handlers.ping = function(data, callback) { callback(200); };

handlers.notFound = function(data, callback) { callback(404); };

handlers.users = function(data, callback) {
    let methods = [ "post", "get", "put", "delete" ];

    if (methods.find((elem) => elem === data.method)) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._users = {};

// data: firstName, lastName, phone, password, tosAgreement
// optional: none
handlers._users.post = function(data, callback) {
    let firstName    = data.payload.firstName;
    let lastName     = data.payload.lastName;
    let phone        = data.payload.phone;
    let password     = data.payload.password;
    let tosAgreement = data.payload.tosAgreement;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure, that user doesn't exists
        _data.read("users", phone, function(err, data) {
            if (err) {
                // Not exist, which is good
                // Hash the password
                let hashedPswd = helpers.hash(password);

                if (hashedPswd) {
                    let userObject = {
                        firstName : firstName,
                        lastName : lastName,
                        phone : phone,
                        password : hashedPswd,
                        tosAgreement : true
                    };

                    _data.create("users", phone, userObject, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {"Error" : "Could not add new user"});
                        }
                    });
                } else {
                    callback(500, {"Error" : "Could not hash a password"});
                }

            } else {
                callback(400, {"Error" : "User already exists!"});
            }
        });
    } else {
        callback(400, {"Error" : "Missing required fields"});
    }
};

// Required data: phone
// Optional data: none
// @TODO let only authorized users to read
handlers._users.get = function(data, callback) {
    var phone = data.payload.phone;

    if (!phone) {
        phone = data.queryStringObject.phone;
    }

    if (phone) {
        _data.read("users", phone, function(err, data) {
            if (!err && data) {
                // Delete password property
                delete data.password;

                callback(200, data);
            } else {
                callback(404, {"Error" : "User not exists"});
            }
        });
    } else {
        callback(400, {"Error" : "Invalid get request"});
    }
};

// Required data: phone
// Optional data: firstName, lastName, password, at least one has to be present)
// @TODO let only authorized users to put
handlers._users.put = function(data, callback) {
    let phone = data.payload.phone;
    if (phone) {
        let firstName = data.payload.firstName;
        let lastName  = data.payload.lastName;
        let password  = data.payload.password;

        if (firstName || lastName || password) {
            _data.read("users", phone, function(err, data) {
                if (!err && data) {
                    if (firstName) {
                        data.firstName = firstName;
                    }
                    if (lastName) {
                        data.lastName = lastName;
                    }
                    if (password) {
                        data.password = helpers.hash(password);
                    }

                    _data.update("users", phone, data, function(err) {
                        if (!err) {
                            callback(200, data);
                        } else {
                            callback(500, {"Error" : "Failed to update user"});
                        }
                    });
                } else {
                    callback(400, {"Error" : "User not present"});
                }
            });
        } else {
            callback(400, {"Error" : "Missing parameters"});
        }
    } else {
        callback(400, {"Error" : "Invalid put request"});
    }
};

// TODO: only auth users
// TODO: cleanup associated data
handlers._users.delete = function(data, callback) {
    var phone = data.payload.phone;

    if (phone) {
        _data.read("users", phone, function(err, data) {
            if (!err && data) {
                _data.delete("users", phone, function(err) {
                    if (!err) {
                        callback(200, data);
                    } else {
                        callback(500, {"Error" : "Could not delete specified user"});
                    }
                });

            } else {
                callback(404, {"Error" : "User not exists"});
            }
        });
    } else {
        callback(400, {"Error" : "Invalid delete request"});
    }
};

handlers.users = function(data, callback) {
    let methods = [ "post", "get", "put", "delete" ];

    if (methods.find((elem) => elem === data.method)) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

let _tokens = {};

// Req data: phone, password
// Opt data: none
_tokens.post = function(data, callback) {
    var phone    = data.payload.phone;
    var password = data.payload.password;

    if (phone && password) {
        _data.read("users", phone, function(err, data) {
            if (!err && data) {
                // Delete password property

                let hashed = helpers.hash(password);
                if (hashed === data.password) {

                } else {
                    callback(400, {"Error" : "Incorrect password"});
                }

            } else {
                callback(400, {"Error" : "User not exists"});
            }
        });
    } else {
        callback(400, {"Error" : "Invalid post request"});
    }
};

_tokens.get = function(data, callback) {

};
_tokens.put = function(data, callback) {

};
_tokens.delete = function(data, callback) {

};

module.exports = handlers;