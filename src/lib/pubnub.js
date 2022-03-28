'use strict';

const PubNubSDK = require('pubnub');

module.exports = class PubNub {

    constructor(publicKey, subscribeKey, uuid) {
        this.pubnub = new PubNubSDK({
            publishKey: publicKey,
            subscribeKey: subscribeKey,
            uuid: uuid,
        });
    }

    publish({ message, channel }) {
        return this.pubnub.publish({ message, channel });
    }

    fire({ message, channel }) {
        return this.pubnub.signal({ message, channel });
    }

    signal({ message, channel }) {
        return this.pubnub.signal({ message, channel });
    }

    listFiles({ channel, limit, next }) {
        return this.pubnub.listFiles({ channel, limit, next });
    }

    getFileUrl({ channel, id, name }) {
        return this.pubnub.getFileUrl({ channel, id, name });
    }

    deleteFile({ channel, id, name }) {
        return this.pubnub.deleteFile({ channel, id, name });
    }

    publishFile({ message, channel, fileId, fileName, storeInHistory, ttl, meta }) {
        return this.pubnub.publishFile({ message, channel, fileId, fileName, storeInHistory, ttl, meta });
    }
}
