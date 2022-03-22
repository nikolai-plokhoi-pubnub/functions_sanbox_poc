'use strict';

const jsoning = require("jsoning");

module.exports = class Vault {

    constructor(filename) {
        this.db = new jsoning(filename);
        console.log('Loaded Vault from file ' + filename);
    }

    get(key) {
        return this.db.get(key);
    }
}
