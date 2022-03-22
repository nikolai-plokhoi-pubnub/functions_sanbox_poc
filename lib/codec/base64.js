'use strict';

function urlsafe_btoa(unencoded) {
    return btoa(unencoded)
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

exports.btoa = btoa;
exports.atob = atob;
exports.encodeString = urlsafe_btoa;
