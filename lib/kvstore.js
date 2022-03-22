'use strict';

const jsoning = require("jsoning");
const { spinWait } = require("./utils_internal");

module.exports = class KVStore {

    constructor(filename) {
        this.db = new jsoning(filename);
        console.log('Loaded KV from file ' + filename);
    }

    get(key) {
        return this.db.get(key);
    }

    getItem(key) {
        return this.get(key);
    }

    getKeys() {
        return Object.keys(this.db.all());
    }

    set(key, value) {
        return spinWait(this.db.set(key, value));
    }

    setItem(key, value) {
        return spinWait(this.set(key, value));
    }

    removeItem(key) {
        return spinWait(this.db.delete(key));
    }
}
