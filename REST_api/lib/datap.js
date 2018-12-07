const _data = require("./data");
const util  = require("util");

let lib = {};

lib.create = util.promisify(_data.create);
lib.read   = util.promisify(_data.read);
lib.update = util.promisify(_data.update);
lib.delete = util.promisify(_data.delete);

module.exports = lib;