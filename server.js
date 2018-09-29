// Initializes Node.js Packages
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

// Initializes Express.js Server and Defines pPrt
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up Data Parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sets up Handlebars.js
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Imports Routes
var routes = require("./controllers/apiRoutes.js");
app.use(routes);

// Loads Static Files
app.use(express.static("./public"));

// Starts Express.js Server
app.listen(PORT, function() {
	console.log("This app is listening on PORT: " + PORT + ".");
});