'use strict';

const nconf = require('nconf');
nconf.argv().env('__');
nconf.defaults({
    conf: `${__dirname}/config.json`
});

nconf.file(nconf.get('conf'));

module.exports = nconf;
