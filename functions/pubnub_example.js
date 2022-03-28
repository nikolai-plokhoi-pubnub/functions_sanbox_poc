const pubnub = require('pubnub');

export default (request) => {
    return pubnub.publish({
        channel: 'pubnub-functions-sandbox-channel',
        message: `Hello from function_example, original message [${request.message}]`
    }).then(response => {
        console.log('Successfully publish test message, response: ' + JSON.stringify(response));
        return request.ok();
    }).catch(error => {
        console.error('Failed to publish test message, error: ' + error);
        return request.abort();
    })
}