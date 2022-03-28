const basicAuth = require('codec/auth');
const base64Codec = require('codec/base64');
const queryStringCodec = require('codec/query_string');

export default (request) => {
    console.log('[basicAuth("many", "blocks") === bWFueTpibG9ja3M=] -> ' + basicAuth.basic('many', 'blocks'));
    console.log('[btoa("hello") === aGVsbG8=] -> ' + base64Codec.btoa('hello'));
    console.log('[atob("aGVsbG8=") === hello] -> ' + base64Codec.atob('aGVsbG8='));
    console.log('[encodeString("a+b") === a_b] -> ' + base64Codec.encodeString('+'));
    console.log('[queryStringCodec.parse("a=5&b=10") === {a: 5, b: 10}] -> ' + JSON.stringify(queryStringCodec.parse('a=5&b=10')));
    console.log('[queryStringCodec.stringify({ a: 10, b: 15 })) === a=10&b=15] -> ' + queryStringCodec.stringify({ a: 10, b: 15 }));

    return request.ok();
}