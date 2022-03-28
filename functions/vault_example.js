const vault = require('vault');

export default (request) => {
    console.log("vault get #1: " + vault.get('secret#1'));
    console.log("vault get #2: " + vault.get('secret#2'));
    console.log("vault get unknown: " + vault.get('secret#3'));

    return request.ok();
}