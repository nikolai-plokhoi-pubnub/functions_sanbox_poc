'use strict';

const crypto = require('crypto');
const ALGORITHM = {
    /* EdDSA algorithm definitions */
    ED25519 : {
        scheme : 'eddsa',
        curve  : 'ed25519',
    },

    /* ECDSA algorithm definitions */
    ECDSA_P256_SHA1 : {
        scheme : 'ec',
        curve  : 'p256',
        hash   : 'sha1',
    },
    ECDSA_P256_SHA256 : {
        scheme : 'ec',
        curve  : 'p256',
        hash   : 'sha256',
    },
    ECDSA_P256_SHA512 : {
        scheme : 'ec',
        curve  : 'p256',
        hash   : 'sha512',
    },

    /* Deprecated ECDSA algorithm definitions */
    ECDSA_SHA256 : {
        scheme : 'ec',
        curve  : 'p256',
        hash   : 'sha256',
    },

    /* HMAC Algorithm definitions */
    HMAC_SHA1   : 'sha1',
    HMAC_SHA256 : 'sha256',
    HMAC_SHA512 : 'sha512',
};


const Elliptic = {
    ec    : require('elliptic').ec,
    eddsa : require('elliptic').eddsa,
};

const HASH_FN = {
    sha1   : (msg) => crypto.createHash('sha1').update(msg).digest(),
    sha256 : (msg) => crypto.createHash('sha256').update(msg).digest(),
    sha512 : (msg) => crypto.createHash('sha512').update(msg).digest(),
};


function decodeBase64(value) {
    return new Buffer(value, 'base64');
}

function encodeBase64(value) {
    return urlsafe(
        new Buffer(value, 'hex').toString('base64')
    ).replace(/=/g, '');
}

function urlsafe(value) {
    return value
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function normalizePrivateKey(key) {
    if (typeof(key) === 'string') {
        // Base-64 encoded
        return decodeBase64(key);
    } else if (key.kty === 'EC' && key.d) {
        // JWK
        return decodeBase64(key.d);
    }

    throw new Error('Unknown Private Key format');
}

function normalizePublicKey(key) {
    if (typeof(key) === 'string') {
        // Base-64 encoded
        const priv = decodeBase64(key);

        return priv;
    } else if (key.kty === 'EC' && key.x && key.y) {
        // JWK
        const x = decodeBase64(key.x);
        const y = decodeBase64(key.y);
        const length = 1 + x.length + y.length;
        return Buffer.concat([ new Buffer([ 0x04 ]), x, y ], length);
    }

    throw new Error('Unknown Public Key format');
}

function normalizeSignature(sig, scheme) {
    if (typeof(sig) === 'string') {
        const buf = decodeBase64(sig);
        return {
            r : buf.slice(0, 32).toString('hex'),
            s : buf.slice(32, 64).toString('hex'),
        };
    } else if (sig.r && sig.s && sig.r.length === 43 && sig.s.length === 43) {
        return {
            r : decodeBase64(sig.r),
            s : decodeBase64(sig.s),
        };
    } else if (sig.R && sig.S && sig.R.length === 43 && sig.S.length === 43) {
        return scheme.makeSignature({
            R : Array.from(decodeBase64(sig.R)),
            S : Array.from(decodeBase64(sig.S)),
        });
    }

    throw new Error('Unknown Signature format');
}


function hmac(key, msg, algorithm) {
    if (typeof(key) === 'string') {
        key = decodeBase64(key);
    }
    return urlsafe(
        crypto.createHmac(algorithm, key).update(msg).digest('base64')
    );
}

function sign(key, msg, algorithm) {
    switch (algorithm.scheme) {
    case 'ec': {
        const ec = new Elliptic.ec(algorithm.curve);
        const priv = ec.keyFromPrivate(normalizePrivateKey(key));
        const hash = HASH_FN[algorithm.hash](msg);
        const sig = priv.sign(hash);

        return Promise.resolve(
            (typeof(key) === 'string')
                ? encodeBase64(sig.r.toJSON() + sig.s.toJSON()) + '=='
                : {
                    r : encodeBase64(sig.r.toJSON()),
                    s : encodeBase64(sig.s.toJSON()),
                }
        );
    }

    case 'eddsa': {
        const eddsa = new Elliptic.eddsa(algorithm.curve);
        const sec = eddsa.keyFromSecret(decodeBase64(key.sk));
        const sig = sec.sign(msg);

        return Promise.resolve({
            R : encodeBase64(sig.Rencoded()),
            S : encodeBase64(sig.Sencoded()),
        });
    }

    default:
        throw new Error('Unknown Digital Signature scheme');
    }
}

function verify(sig, key, msg, algorithm) {
    switch (algorithm.scheme) {
    case 'ec': {
        const ec = new Elliptic.ec(algorithm.curve);
        const pub = ec.keyFromPublic(normalizePublicKey(key));
        const hash = HASH_FN[algorithm.hash](msg);

        return pub.verify(hash, normalizeSignature(sig));
    }

    case 'eddsa': {
        const eddsa = new Elliptic.eddsa(algorithm.curve);
        const pub = eddsa.keyFromPublic(decodeBase64(key.pk).toString('hex'));

        return pub.verify(msg, normalizeSignature(sig, eddsa));
    }

    default:
        throw new Error('Unknown Digital Signature scheme');
    }
}

function sha1(msg) {
    return Promise.resolve(crypto.createHash('sha1').update(msg).digest('base64'));
}

function sha256(msg) {
    return Promise.resolve(crypto.createHash('sha256').update(msg).digest('base64'));
}

function sha512(msg) {
    return Promise.resolve(crypto.createHash('sha512').update(msg).digest('base64'));
}

exports.urlsafe = urlsafe;
exports.hmac = hmac;
exports.sign = sign;
exports.verify = verify;
exports.sha1 = sha1;
exports.sha256 = sha256;
exports.sha512 = sha512;
exports.ALGORITHM = ALGORITHM;
