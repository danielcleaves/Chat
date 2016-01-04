// require express
var express = require("express");
// require body-parser
var bodyParser = require('body-parser');

// path module -- try to figure out where and why we use this
var path = require("path");

// create the express app
var app = express();

// static content 
app.use(express.static(path.join(__dirname, "./static")));

// use it!
app.use(bodyParser.urlencoded());


// setting up ejs and our views folder
var messages = [];

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index", {messages: messages});
});

app.post('/text', function(req,res) {
	console.log('hello', req.body.message);
	res.redirect('/');
});



// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
 console.log("listening on port 8000");

});

var io = require('socket.io').listen(server);


io.sockets.on('connection',function(socket) {
	var user_name;
	
	socket.on('user_connected', function(data){
		user_name = data.name;
	});
	
	socket.on('message_sent', function(data){
		messages.push({name: user_name, message: data.message});
		console.log(messages);
		io.emit('message_added',{name: user_name, message: data.message });
	});
	
	

});