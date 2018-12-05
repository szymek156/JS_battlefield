// Dependencies
const http          = require("http");
const https         = require("https");
const url           = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const fs            = require("fs");
const _data         = require("./lib/data");
const handlers      = require("./lib/handlers");
const config        = require("./config");
const helpers       = require("./lib/helpers");

// _data.delete("test", "testFile", function(err, data) { console.log("remove with status ", err);
// }); _data.create("test", "testFile", {prop : "value"}, function(err) { console.log("failed with
// error ", err); }); _data.updatePromise("test", "testFile", {prop2 : "other value"},
//                     function(err) { console.log("failed with error ", err); });

// _data.updatePromise2("test", "testFile", {prop2 : "other value promise2"},
//                      function(err) { console.log("failed with error ", err); });

_data.updatePromise3("test", "testFile", {prop2 : "other value promise3"},
                     function(err) { console.log("failed with error ", err); });
// _data.update("test", "testFile", {prop2 : "other value"}, function(err) { console.log("failed
// with error ", err); }); _data.read("test", "testFile", function(err, data) { console.log("read
// with status ", err, " data ", data); }); _data.delete("test", "testFile", function(err, data) {
// console.log("remove with status ", err); });

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

console.log(httpsServerOptions);

let httpsServer = https.createServer(httpsServerOptions, unifiedServer);

httpsServer.listen(config.httpsPort, function() {
    console.log(`Server is listening on port ${config.httpsPort} in ${config.envName} mode`);
});

function unifiedServer(req, res) {

    let parsedUrl = url.parse(req.url, true);

    // No info about host, just /foo/bar part
    let path = parsedUrl.pathname;

    // Trim leading or following slashes
    path       = path.replace(/^\/+|\/+$/g, "");
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
    req.on("data", function(data) { buffer += decoder.write(data); });

    // End is always called, even if there is no payload
    req.on("end", function() {
        buffer += decoder.end();

        console.log(`palyoad: ${buffer}`);

        var data = {
            "trimmedPath" : path,
            "queryStringObject" : query,
            "method" : method,
            "headers" : headers,
            "payload" : helpers.parseJsonToObject(buffer)
        };

        // Route requests
        let handler = path in router ? router[path] : handlers.notFound;

        handler(data, function(statusCode, payload = {}) {
            let payloadResponse = JSON.stringify(payload);

            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(payloadResponse);

            console.log(`response with status ${statusCode} ${payloadResponse}`);
        });
    });
}

// Define request router
let router = {"ping" : handlers.ping, "users" : handlers.users, "tokens" : handlers.tokens};