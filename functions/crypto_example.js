const crypto = require('crypto');

export default (request) => {
    console.log(crypto.ALGORITHM);

    return Promise.all([
        crypto.sha1('secretPayload').then((result) => {
            console.log('[sha1("secretPayload") === lxKt5ORJB+K62tNQucOyIwgVDfA=] -> ' + result);
        }),
        crypto.sha256('secretPayload').then((result) => {
            console.log('[sha256("secretPayload") === sx4yvIv4TM+p33je5wnxV8qnzekQvvvHaPZzGukC2RI=] -> ' + result);
        }),
        crypto.sha512('secretPayload').then((result) => {
            console.log('[sha256("secretPayload") === E9+4tYwT1BB75vTUL3nvLRhWB2BJ6HRUm4NYqjJ1A4noGOwluCCqNuHAYHiu9eL8StfiBgLIN15qzr7fodBKlA==] -> ' + result);
        })
    ]).catch((error) => {
        console.log(error);
        return request.abort();
    });
}