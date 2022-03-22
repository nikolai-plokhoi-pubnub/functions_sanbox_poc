'use strict';

const sleep = require("system-sleep");

// Temporary solution to integrate sync old code with async new library
function spinWait(promise) {
    let result;
    let isCompleted = false;
    promise.then(value => {
        isCompleted = true;
        result = value;
    }).catch(err => {
        isCompleted = true;
        result = err;
    })
    while (!isCompleted) {
        sleep(20);
    }
    return result;
}

exports.spinWait = spinWait