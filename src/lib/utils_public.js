'use strict';

// Returns a random integer between min (included) and max (excluded)
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Determines if a value is numeric
function isNumeric(n) {
    n = parseInt(n);
    return (typeof n === 'number' && !isNaN(n));
}

exports.randomInt = randomInt;
exports.isNumeric = isNumeric;