var express = require('express');
var app = express();
var sha512 = require('js-sha512');
var http = require('http').Server(app);
var io = require('socket.io')(http);

require("./socket.js")(io);
var mysql = require("./mysql.js"); // call function i.e. mysql.insert_account()
var players = [];

/*app.get('/', function(req, res){
  res.send('<h1>Node.js Socket.io Server</h1>');
});*/
var oauth = require("./oauth2"),

    url = oauth.getAuthorizeUrl({
        redirect_uri  : "http://gw2commandcenter.com:3001/receiveCode",
        response_type : "code",
        scope         : "account offline"
    });

//console.log(url);

/*app.post('/getCode', function (req, res){
   res.json({ code: sha512('5t7uab-bks21-dda1v-h431o')});
});*/
var fs = require('fs'); // this engine requires the fs module
app.engine('htmlv', function (filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(new Error(err));
    // this is an extremely simple template engine
    var rendered = content.toString().replace('<%title%>', options.title)
    .replace('<%code%>', options.code);
    return callback(null, rendered);
  })
});
app.set('views', './public');
app.set('view engine', 'htmlv');

app.get('/receiveCode', function(req, res){
	console.log(req.query.code);
	oauth.getOAuthAccessToken(
	    req.query.code,
	    {
	        redirect_uri : "http://gw2commandcenter.com:3001/receiveCode",
	        grant_type   : "authorization_code",
	        response_type : "code"
	    },
	    function(err, access, refresh, result) {
	        if(err) {
	        	//console.log("error comes up next");
	            return console.log(err);
	        }

	        oauth.get(
	            "https://api.guildwars2.com/v2/account",
	            access,
	            function(err, body, response) {
	            	var accountInfo = JSON.parse(body);
	            	//console.log(accountInfo.name);
	            	var salt = salt_generator();
	            	accountInfo.code = sha512(accountInfo.name + salt);
	            	players.push(accountInfo);
	                //console.log(players);
	                //console.log(players[0].name);
	                mysql.insert_account(accountInfo.id, accountInfo.name, accountInfo.world, accountInfo.code);
	                res.render('index', { title: 'Guild Wars 2 Command Center', code: accountInfo.code});
	            }
	        );
	    }
	);
});

app.get('/overwolf', function(req, res){
	console.log(url);
	res.redirect(url);
});

//app.use(express.static('public'));

http.listen(3001, function(){
  console.log('listening on *:3001');
});

function salt_generator() {
  var salt;
  var characterList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+";
  for(i = 0; i < 22; i++) {
    salt += characterList.charAt(Math.floor((Math.random() * characterList.length)));
  }
  return salt;
}
