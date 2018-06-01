'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);


mongoose.connection.on('connected',()=>{
  console.log("Connected to database " + process.env.MONGO_URI) ;
});

mongoose.connection.on('error',(err)=>{
  console.log("Database error " + err) ;
});

app.use('/', express.static(process.cwd() + '/public'));
app.use('/jquery', express.static(process.cwd() + '/app/bower_components/jquery'));
app.use('/angular', express.static(process.cwd() + '/app/bower_components/angular'));
app.use('/bootstrap', express.static(process.cwd() + '/app/bower_components/bootstrap'));
app.use('/font-awesome', express.static(process.cwd() + '/app/bower_components/font-awesome'));

app.use(session({
	secret: 'secretNightlife',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port);
});