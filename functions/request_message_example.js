export default (request) => {
    const message = request.message;
    console.log("request.message = " + JSON.stringify(message));
    if (message.shouldAbort) {
        return request.abort();
    }
    return request.ok();
}