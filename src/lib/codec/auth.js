'use strict';

function basicAuth(username, password) {
    return `Basic ${btoa(`${username}:${password}`)}`;
}

exports.basic = basicAuth;