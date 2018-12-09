let path    = require("path");
let fs      = require("fs");
let _data   = require("./data");
let http    = require("http");
let https   = require("https");
let helpers = require("helpers");
let url     = require("url");

let workers = {};

workers.loop = function() {
    setInterval(() => {
        workers.gatherAllChecks();
    }, 1000 * 60);
};

workers.gatherAllChecks = function() {
    _data.list("checks", function(err, checks) {
        if (!err && checks && checks.length > 0) {
            checks.forEach(function(check) {
                _data.read("checks", check, function(err, checkObj) {
                    if (!err && checkObj) {
                        workers.validateCheckData(checkObj);
                    } else {
                        console.log(`Error reading ${check}`);
                    }
                });
            });
        } else {
            console.log("Error: Could not find any checks to process");
        }
    }
};

workers.validateCheckData = function(check) {
    check = helpers.validateParameter(check, "object");

    // check.state = up, down;
    if (!"state" in check) {
        check.state = "down";
    }

    check.lastChecked = 0;

    if (check.id) {
        workers.performCheck(check);
    } else {
        console.log("Error: Invalid check");
    }
};

workers.performCheck = function(check) {
    let outcome = {error: false, responseCode: false};


    let outcomeSent = false;

    let parsedUrl = url.parse(check.protocol + "://" + check.url, true);
    let hostname  = parsedUrl.hostname;
    let path      = parsedUrl.path;

    let requestDetails = {
        protocol: check.protocol + ":",
        hostname: hostname,
        method: check.method.toUpperCase(),
        path: path,
        timeout: check.timeoutSeconds * 1000
    };

    let module = check.protocol === "http" ? http : https;

    let req = module.reuqest(requestDetails, function(res) {
        let status = res.statusCode;

        outcome.responseCode = status;

        if (!outcomeSent) {
            workers.processCheckOutcome(check, outcome);
            outcomeSent = true;
        }
    });

    req.on("error", function(err) {
        outcome.err = {error: true, value: err};

        if (!outcomeSent) {
            workers.processCheckOutcome(check, outcome);
            outcomeSent = true;
        }
    });

    req.on("timeout", function(err) {
        outcome.err = {error: true, value: err};

        if (!outcomeSent) {
            workers.processCheckOutcome(check, outcome);
            outcomeSent = true;
        }
    });

    req.end();
};

workers.processCheckOutcome = function(check, outcome) {
    console.log(`check = ${JSON.stringify(check)}, outcome = ${JSON.stringify(outcome)}`);
};

workers.init = function() {
    workers.gatherAllChecks();

    workers.loop();
};

module.exports = workers;
