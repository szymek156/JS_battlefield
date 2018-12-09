const _data   = require("./data");
const _datap  = require("./datap");
const helpers = require("./helpers");
const config  = require("./config")

// Define handlers
var handlers = {};

handlers.ping = function(data, callback) {
    callback(200);
};

handlers.notFound = function(data, callback) {
    callback(404);
};

handlers.users = function(data, callback) {
    let methods = ["post", "get", "put", "delete"];

    if (methods.find((elem) => elem === data.method)) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._users = {};

// data: firstName, lastName, id, password, tosAgreement
// optional: none
handlers._users.post = function(data, callback) {
    let firstName    = data.payload.firstName;
    let lastName     = data.payload.lastName;
    let id           = data.payload.id;
    let password     = data.payload.password;
    let tosAgreement = data.payload.tosAgreement;

    if (firstName && lastName && id && password && tosAgreement) {
        // Make sure, that user doesn't exists
        _data.read("users", id, function(err, data) {
            if (err) {
                // Not exist, which is good
                // Hash the password
                let hashedPswd = helpers.hash(password);

                if (hashedPswd) {
                    let userObject = {
                        firstName: firstName,
                        lastName: lastName,
                        id: id,
                        password: hashedPswd,
                        tosAgreement: true,
                        checks: []
                    };

                    _data.create("users", id, userObject, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {"Error": "Could not add new user"});
                        }
                    });
                } else {
                    callback(500, {"Error": "Could not hash a password"});
                }

            } else {
                callback(400, {"Error": "User already exists!"});
            }
        });
    } else {
        callback(400, {"Error": "Missing required fields"});
    }
};

// Required data: phone
// Optional data: none
handlers._users.get = function(data, callback) {
    var phone = data.payload.phone;

    if (!phone) {
        phone = data.queryStringObject.phone;
    }

    if (phone) {
        // Get token from the headers
        let token = data.headers.token;

        handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
            if (tokenIsValid) {
                _data.read("users", phone, function(err, data) {
                    if (!err && data) {
                        // Delete password property
                        delete data.password;

                        callback(200, data);
                    } else {
                        callback(404, {"Error": "User not exists"});
                    }
                });
            } else {
                callback(403, {"Error": "Unauthorized access"});
            }
        });
    } else {
        callback(400, {"Error": "Invalid get request"});
    }
};

// Required data: id
// Optional data: firstName, lastName, password, at least one has to be present)
handlers._users.put = function(data, callback) {
    let phone     = data.payload.phone;
    let firstName = data.payload.firstName;
    let lastName  = data.payload.lastName;
    let password  = data.payload.password;

    let token = data.headers.token;

    if (phone) {
        handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
            if (tokenIsValid) {
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
                                    callback(500, {"Error": "Failed to update user"});
                                }
                            });
                        } else {
                            callback(400, {"Error": "User not present"});
                        }
                    });
                } else {
                    callback(400, {"Error": "Missing parameters"});
                }
            } else {
                callback(403, {"Error": "Unauthorized access"});
            }
        });
    } else {
        callback(400, {"Error": "Invalid put request"});
    }
};

// TODO: only auth users
// TODO: cleanup associated data
handlers._users.delete = function(data, callback) {
    var id = data.payload.id;

    if (id) {
        _data.read("users", id, function(err, data) {
            if (!err && data) {
                _data.delete("users", id, function(err) {
                    if (!err) {
                        callback(200, data);
                    } else {
                        callback(500, {"Error": "Could not delete specified user"});
                    }
                });

            } else {
                callback(404, {"Error": "User not exists"});
            }
        });
    } else {
        callback(400, {"Error": "Invalid delete request"});
    }
};

handlers.tokens = function(data, callback) {
    let methods = ["post", "get", "put", "delete"];

    if (methods.find((elem) => elem === data.method)) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._tokens = {};

// Req data: id, password
// Opt data: none
handlers._tokens.post = function(data, callback) {
    var phone    = data.payload.phone;
    var password = data.payload.password;

    if (phone && password) {
        _data.read("users", id, function(err, data) {
            if (!err && data) {
                // Delete password property

                let hashed = helpers.hash(password);
                if (hashed === data.password) {
                    let tokenId = helpers.createRandomString(20);

                    let expires     = Date.now() + 1000 * 60 * 60;
                    let tokenObject = {phone: phone, id: tokenId, expires: expires};

                    _data.create("tokens", tokenId, tokenObject, function(err) {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {"Error": "Unable to create token"});
                        }
                    });

                } else {
                    callback(400, {"Error": "Incorrect password"});
                }

            } else {
                callback(400, {"Error": "User not exists"});
            }
        });
    } else {
        callback(400, {"Error": "Invalid post request"});
    }
};

// Req data: id
// Opt data: none
handlers._tokens.get = function(data, callback) {
    let id = data.queryStringObject.id;

    if (id) {
        _data.read("tokens", id, function(err, data) {
            if (!err && data) {
                callback(200, data);
            } else {
                callback(404, {"Error": "Token not exists"});
            }
        });
    } else {
        callback(400, {"Error": "Invalid get request"});
    }
};

// Req data: id, extend
// Opt data: none
handlers._tokens.put = function(data, callback) {
    var id     = data.payload.id;
    var extend = typeof (data.payload.extend) == "boolean" ? data.payload.extend : false;

    if (id && extend) {
        _data.read("tokens", id, function(err, token) {
            if (!err && token) {
                // Check if token is not already expried
                if (token.expires > Date.now()) {
                    token.expires = Date.now() + 1000 * 60 * 60;

                    _data.update("tokens", id, token, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {"Error": "Unable to update token"});
                        }
                    })
                } else {
                    callback(400, {"Error": "Token already expired"});
                }
            } else {
                callback(400, "Token doesn't exist");
            }
        })
    } else {
        callback(400, {"Error": "Incorrect put value"});
    }
};

// Req data: id
// Opt data: none
handlers._tokens.delete = function(data, callback) {
    var id = data.payload.id;

    if (id) {
        _data.read("tokens", id, function(err, data) {
            if (!err && data) {
                _data.delete("tokens", id, function(err) {
                    if (!err) {
                        callback(200, data);
                    } else {
                        callback(500, {"Error": "Could not delete specified token"});
                    }
                });

            } else {
                callback(404, {"Error": "Token not exists"});
            }
        });
    } else {
        callback(400, {"Error": "Invalid delete request"});
    }
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken =
    function(id, phone, callback) {
    _data.read("tokens", id, function(err, token) {
        if (!err && token) {
            // if (token.phone === phone && token.expires > Date.now()) {
            callback(true);
            // } else {
            //     callback(false);
            // }
        } else {
            callback(false);
        }
    });
}

    handlers.checks = function(data, callback) {
    let methods = ["post", "get", "put", "delete"];

    if (methods.find((elem) => elem === data.method)) {
        handlers._checks[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._checks = {};

// Req params: protocol, url, method successCodes, timeoutSeconds
// Opt params: none
handlers._checks.post = async function(data, callback) {
    let protocol = helpers.validateParameter(data.payload.protocol, "string", ["http", "https"]);
    let url      = helpers.validateParameter(data.payload.url, "string");
    let method =
        helpers.validateParameter(data.payload.method, "string", ["post", "get", "put", "delete"]);
    let successCodes   = helpers.validateParameter(data.payload.successCodes, "object", [], Array);
    let timeoutSeconds = helpers.validateParameter(data.payload.timeoutSeconds, "number");

    if (protocol && url && method && successCodes && timeoutSeconds) {
        // Get token from headers

        try {
            let token     = helpers.validateParameter(data.headers.token, "string");
            let tokenData = await _datap.read("tokens", token);
            let                   userPhone = tokenData.phone;
            let userData                    = await _datap.read("users", userPhone);

            if (userData.checks.length < config.maxChecks) {
                // Create random id for the check
                let checkId = helpers.createRandomString(20);

                let checkObject = {
                    id: checkId,
                    phone: userPhone,
                    protocol: protocol,
                    url: url,
                    method: method,
                    successCodes: successCodes,
                    timeoutSeconds: timeoutSeconds
                };

                await _datap.create("checks", checkId, checkObject);

                userData.checks.push(checkId);

                await _datap.update("users", userPhone, userData);

                callback(200, checkObject);

            } else {
                callback(400, {
                    "Error": `Max checks excceded ${userData.checks.length} >= ${config.maxChecks}`
                });
            }

        } catch (err) {
            callback(400, err);
        }

    } else {
        callback(400, {Error: "Incorrect post request"});
    }
};

handlers._checks.get = async function(data, callback) {
    let id = helpers.validateParameter(data.queryStringObject.id, "string");

    if (id) {
        let check = await _datap.read("checks", id);

        let token = helpers.validateParameter(data.headers.token, "string");
        handlers._tokens.verifyToken(token, check.phone, function(err) {
            if (!err) {
                callback(200, check);
            } else {
                callback(403);
            }
        })
        let tokenData = await _datap.read("tokens", token);
    } else {
        callback(400, {"Error": "Invalid get request"});
    }
};

handlers._checks.put = async function(data, callback) {
    let protocol = helpers.validateParameter(data.payload.protocol, "string", ["http", "https"]);
    let url      = helpers.validateParameter(data.payload.url, "string");
    let method =
        helpers.validateParameter(data.payload.method, "string", ["post", "get", "put", "delete"]);
    let successCodes   = helpers.validateParameter(data.payload.successCodes, "object", [], Array);
    let timeoutSeconds = helpers.validateParameter(data.payload.timeoutSeconds, "number");

    let id    = helpers.validateParameter(data.payload.id, "string");
    let token = data.headers.token;

    if (id) {
        let checkData = await _datap.read("checks", id);

        handlers._tokens.verifyToken(token, checkData.phone, async function(tokenIsValid) {
            if (tokenIsValid) {
                if (protocol || url || method || successCodes || timeoutSeconds) {
                    if (protocol) {
                        checkData.protocol = protocol;
                    }
                    if (url) {
                        checkData.url = url;
                    }
                    if (method) {
                        checkData.method = method;
                    }
                    if (successCodes) {
                        checkData.successCodes = successCodes;
                    }
                    if (timeoutSeconds) {
                        checkData.time = timeoutSeconds;
                    }

                    await _datap.update("checks", id, checkData);
                    callback(200, checkData);

                } else {
                    callback(400, {"Error": "Missing parameters"});
                }
            } else {
                callback(403, {"Error": "Unauthorized access"});
            }
        });
    } else {
        callback(400, {"Error": "Invalid put request"});
    }
};

handlers._checks.delete = async function(data, callback) {
    let id = helpers.validateParameter(data.payload.id, "string");

    if (id) {
        try {
            let checkData = await _datap.read("checks", id);
            let userData  = await _datap.read("users", checkData.phone);

            userData.checks.splice(userData.checks.indexOf(checkData.id), 1);

            await _datap.update("users", userData.phone, userData);
            await _datap.delete("checks", id);
            callback(200);
        } catch (err) {
            callback(400, err);
        }
    } else {
        callback(400, {"Error": "Invalid delete request"});
    }
};

module.exports = handlers;