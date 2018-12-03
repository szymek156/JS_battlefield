// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const fs = require("fs");

const config = require("./config");

// HTTP
let httpServer = http.createServer(unifiedServer);

httpServer.listen(config.httpPort, function() {
    console.log(`Server is listening on port ${config.httpPort} in ${config.envName} mode`);
});


// HTTPS
let httpsServerOptions = {
    key : fs.readFileSync("./https/key.pem"),
    cert : fs.readFileSync("./https/cert.pem")
};

let httpsServer = https.createServer(httpsServerOptions, unifiedServer);

httpsServer.listen(config.httpsPort, function() {
    console.log(`Server is listening on port ${config.httpsPort} in ${config.envName} mode`);
});

// Define handlers
var handlers = {};
handlers.sample = function(data, callback) {
    callback(406, {"name" : "sample payload"});
};

handlers.notFound = function(data, callback) {
    callback(404);
};

// Define request router
let router = {
    "sample" : handlers.sample
};

function unifiedServer(req, res) {

    let parsedUrl = url.parse(req.url, true);

    // No info about host, just /foo/bar part
    let path = parsedUrl.pathname;

    // Trim leading or following slashes
    path = path.replace(/^\/+|\/+$/g, "");
    let method = req.method.toLowerCase();

    // Puts address query in nice object literal
    let query = parsedUrl.query;

    // Get headers as an objects
    let headers = req.headers

    console.log("HTTP Request dump")
    console.log(`requested ${path} with ${method}`);
    console.log(`query: ${JSON.stringify(query)}`);
    console.log(`headers: ${JSON.stringify(headers)}`);

    let decoder = new StringDecoder("utf-8");

    // Payload in HTTP request comes in streams
    let buffer = "";

    // When chunk of data is ready, append it to the buffer
    req.on("data", function (data) {
        buffer += decoder.write(data);
    });

    // End is always called, even if there is no payload
    req.on("end", function() {
        buffer += decoder.end();

        console.log(`palyoad: ${buffer}`);
    });


    // Route requests
    let handler = path in router ? router[path] : handlers.notFound;

    var data = {
        "trimmedPath" : path,
        "quesyStringObject" : query,
        "method" : method,
        "headers" : headers,
        "payload" : buffer
    };

    handler(data, function(statusCode, payload={}) {
        let payloadResponse = JSON.stringify(payload);

        res.setHeader("Content-Type", "application/json");
        res.writeHead(statusCode);
        res.end(payloadResponse);

        console.log(`response with status ${statusCode}`);
    });
}