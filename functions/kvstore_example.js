const kvstore = require('kvstore');

export default (request) => {
    console.log("kvstore keys:" + kvstore.getKeys());

    console.log('kvstore put: ' + kvstore.set('ratio', request.message.ratio));
    console.log('kvstore get: ' + kvstore.getItem('ratio'));
    console.log('kvstore put: ' + kvstore.set('id', request.message.id));
    console.log('kvstore get: ' + kvstore.getItem('id'));

    console.log('kvstore keys: ' + kvstore.getKeys());
    console.log('kvstore remove: ' + kvstore.removeItem('id'));
    console.log('kvstore remove: ' + kvstore.removeItem('ratio'));

    console.log('kvstore keys size should be zero: ' + kvstore.getKeys().length);

    return request.ok();
}