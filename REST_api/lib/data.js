const fs   = require("fs");
const path = require("path");
const util = require("util");
// TESTING
// _data.create("test", "testFile", {prop : "value"}, function(err) { console.log("failed with error ", err); });
// _data.update("test", "testFile", {prop2 : "other value"}, function(err) { console.log("failed with error ", err); });
// _data.read("test", "testFile", function(err, data) { console.log("read with status ", err, " data ", data); });
// _data.delete("test", "testFile", function(err, data) { console.log("remove with status ", err); });

var lib = {
    baseDir : path.join(__dirname, "/../.data"),
    create : function(dir, filename, data, callback) {
        fs.open(path.join(lib.baseDir, dir, filename + ".json"), "wx", function(err, fd) {
            if (!err && fd) {
                let strData = JSON.stringify(data);
                fs.write(fd, strData, function(err) {
                    if (!err) {
                        fs.close(fd, function(err) {
                            if (!err) {
                                callback("File create succesfully");
                            } else {
                                callback("Error closing file");
                            }
                        });
                    } else {
                        callback("Error writing to file");
                    }
                });

            } else {
                callback("could not create new file, it may already exist");
            }
        });
    },

    read : function(dir, file,
                    callback) { fs.readFile(path.join(lib.baseDir, dir, file + ".json"), "utf8", callback); },

    update : function(dir, file, data, callback) {
        fs.open(path.join(lib.baseDir, dir, file + ".json"), "r+", function(err, fd) {
            if (!err && fd) {
                let strData = JSON.stringify(data);

                fs.truncate(fd, function(err) {
                    if (!err) {
                        fs.write(fd, strData, function(err) {
                            if (!err) {
                                fs.close(fd, function(err) {
                                    if (!err) {
                                        callback("Update OK");
                                    } else {
                                        callback("Fail during closing a file");
                                    }
                                });
                            } else {
                                callback("Err while updating the file");
                            }
                        });
                    } else {
                        callback("Err while truncating a file");
                    }
                });
            } else {
                callback("Could not update a file");
            }
        });
    },

    delete : function(dir, file, callback) {
        fs.unlink(path.join(lib.baseDir, dir, file + ".json"), function(err) {
            if (!err) {
                callback("File removed");
            } else {
                callback(`Failed removing a file ${err}`);
            }
        });
    }

};

lib.updatePromise = function(dir, file, data, callback) {
    // well, not quite, assuming every operation on a file takes ages, this approach
    // gives only small intervals for a breath, and posibility to kick in for other tasks,
    // but file operations are done synchronously i.e. on a microqueue, pure fs.read async
    // call delegates a thread outside event loop (???) for that

    let update = new Promise(function(resolve) {
        let fullPath = path.join(lib.baseDir, dir, file + ".json");

        resolve(fullPath);
    });

    update
        .then(function(fullPath) {
            let fd = fs.openSync(fullPath, "r+");
            return fd;
        })
        .then(function(fd) {
            fs.ftruncateSync(fd);

            return fd;
        })
        .then(function(fd) {
            let strData = JSON.stringify(data);

            fs.writeSync(fd, strData);
            return fd;
        })
        .then(function(fd) { fs.closeSync(fd); });
};

lib.updatePromise2 = function(dir, file, data) {
    // Awesomness of node gives possibility to promisify functions with callback definition (err, value) well, not all
    // of them has it, write has (err, written, buffer), but it seems to work, due to the fact JS is extremly dynamic
    // language

    let open      = util.promisify(fs.open);
    let ftruncate = util.promisify(fs.ftruncate);
    let write     = util.promisify(fs.write);
    let close     = util.promisify(fs.close);

    let fullPath = path.join(lib.baseDir, dir, file + ".json");
    let strData  = JSON.stringify(data);

    open(fullPath, "r+")
        .then((fd) => {
            ftruncate(fd);
            return fd;
        })
        .then((fd) => {
            write(fd, strData);
            return fd;
        })
        .then((fd) => close(fd))
        .catch((err) => console.log("Awesome promisify failed with ", err));
};

lib.updatePromise3 = async function(dir, file, data) {
    // Async/await version

    let open      = util.promisify(fs.open);
    let ftruncate = util.promisify(fs.ftruncate);
    let write     = util.promisify(fs.write);
    let close     = util.promisify(fs.close);

    let fullPath = path.join(lib.baseDir, dir, file + ".json");
    let strData  = JSON.stringify(data);

    try {
        const fd = await                open(fullPath, "r+");
        await                           ftruncate(fd);
        const {written, buffer} = await write(fd, strData);
        await                           close(fd);

    } catch (err) {
        console.log("Awesome async/await failed with ", err);
    }
};

module.exports = lib;