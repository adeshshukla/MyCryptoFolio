//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var router = require("./router.ts");
var serverConfig = require('./config/serverConfig.ts');

var app = express();
// Body Parser Middleware
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));          // parse application/x-www-form-urlencoded
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

//CORS Middleware
app.use(function (req, res, next) {
	//Enabling CORS 
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
	next();
});

// api
app.use('/', router);

// const Firebase = require('./services/firebaseService.ts');
// const fireBaseService = new Firebase();
// console.log('Test firebase service...')
// fireBaseService.getUsers();

//Setting up server
var server = app.listen(process.env.PORT || serverConfig.serverPort, function () {
	var portNo = server.address().port;
	var apiUrl = "http://localhost:" + portNo;
	console.log("** Node API Server running on " + apiUrl + " **");
});
