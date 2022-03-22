'use strict';

function parse(query_string, defaults) {
    const params = {};

    query_string.split('&').forEach((v) => {
        const x = v.split('=');
        const key = x.shift();
        const value = x.join('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value) || defaults || 'true';
        }
    });

    return params;
}

function stringify(params) {
    return Object.keys(params).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
}

exports.parse = parse;
exports.stringify = stringify;
