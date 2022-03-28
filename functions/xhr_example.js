const xhr = require('xhr');

export default (request) => {
    return xhr.fetch('https://catfact.ninja/fact')
        .then(response => response.json())
        .then((response) => {
            console.log('Fact about cats: ' + response.fact);
            return request.ok();
        }).catch((err) => {
            console.error(err);
            return request.abort();
        });
}