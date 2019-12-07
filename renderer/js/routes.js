class RouteMatcher {
    constructor(route) {
        this.route = route;
        this.params = [];
    }

    match(uri) {
        const path = this.route.replace(/:\w+/g, match => {
            this.params.push(match.substr(1));
            return '(.+)';
        });
        console.log('path: %s', path);
        const regexp = new RegExp(`^${path}$`);
        console.log('regexp: %s', regexp);
        return uri.match(regexp);
    }
}


class Router {

    constructor() {
        this.routes = [];
    }

    addRoute(uri, callback) {
        // ensure that the parameters are not empty
        if (!uri || !callback) throw new Error('uri or callback must be given');
        // ensure that the parameters have the correct types
        if (typeof uri !== "string") throw new TypeError('typeof uri must be a string');
        if (typeof callback !== "function") throw new TypeError('typeof callback must be a function');
        // throw an error if the route uri already exists to avoid confilicting routes
        if (this.routes.some(it => it.url === uri)) {
            throw new Error(`the uri ${route.uri} already exists`);
        }
        this.routes.push({
            uri,
            callback: (uri, params, query) => {
                console.debug('Route: %s, params: %s, query: %s', uri, JSON.stringify(params), query);
                callback(uri, params, query);
            }
        });
    }


    handle(uri) {
        console.debug('handling %s', uri);
        const [path, query] = uri.split('?');
        for(let route of this.routes) {
            const matcher = new RouteMatcher(route.uri);
            const matches = matcher.match(path);
            if (matches) {
                console.debug('uri %s matches route %s', uri, route.uri);
                //console.log('matches: %s', JSON.stringify(matches));
                const params = {};
                for (let i = 0; i < matcher.params.length; i++){
                   params[matcher.params[i]] = matches[i+1];
                }
                route.callback.call(this, uri, params, query);
                return;
            }
        }
        console.warn('%s not matched', uri);
    }
}

const router = new Router();
