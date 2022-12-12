const http = require('http');
const {URL} = require('url');

const bodyParser = require('./helpers/bodyParser');
const routes = require('./routes');

const server = http.createServer((request, response) => {
    const parseUrl = new URL(`http://localhost:3000${request.url}`);

    let { pathname } = parseUrl;
    let id = null;

    const splitEndpoint = pathname.split('/').filter(Boolean);

    if(splitEndpoint.length > 1){
        pathname = `/${splitEndpoint[0]}/:id`;
        id = splitEndpoint[1];
    }

    const route = routes.find((routeObj) => (
        routeObj.endpoint === pathname && routeObj.method === request.method
    ));

    if(route) {
        request.query = Object.fromEntries(parseUrl.searchParams);
        request.params = { id };

        response.send = (statusCode, body) => {
            response.writeHead(statusCode, {'content-type': 'text/html'});
            response.end(JSON.stringify(body)); 
        }

        if(['POST', 'PUT', 'PATCH'].includes(request.method)){
            bodyParser(request, () => route.handler(request, response));
        }else{
            route.handler(request, response);
        }
    }else{
        response.writeHead(404, {'content-type': 'text/html'});
        response.end(`cannot ${request.method} ${parseUrl.pathname}`);
    }
});

server.listen(3000, ()  => console.log('Server started at http://localhost:3000'));