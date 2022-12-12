function bodyParser(request, callback) {
    let body = '';

    request.on('data', (chuck) => {
        body += chuck;        
    });

    request.on('end', () => {
        body = JSON.parse(body);
        request.body = body;
        callback();
    });
}

module.exports = bodyParser;