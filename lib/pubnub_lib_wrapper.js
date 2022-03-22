'use strict';

const PubNubSDK = require('pubnub');

module.exports = class PubNub {

    allowedMethods = [
        'publish',
        'fire',
        'signal',
        'listFiles',
        'getFileUrl',
        'deleteFile',
        'publishFile'
    ];

    constructor(publicKey, subscribeKey, uuid) {
        this.pubnub = new PubNubSDK({
            publishKey: publicKey,
            subscribeKey: subscribeKey,
            uuid: uuid,
        });

        this.allowedMethods.forEach(method => {
           this[method] = this.pubnub[method];
        });
    }
}
