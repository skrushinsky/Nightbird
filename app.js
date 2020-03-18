const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/fonts/roboto-fontface', express.static(path.join(__dirname, '/node_modules/roboto-fontface')));
app.use('/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));


app.get('/js/lib/ui-bootstrap-tpls.js', (req, res) =>
	res.sendFile(__dirname + '/node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js')
);
app.get('/js/lib/ui-bootstrap.js', (req, res) =>
	res.sendFile(__dirname + '/node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js')
);


app.use('/', indexRouter);

module.exports = app;
