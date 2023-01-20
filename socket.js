var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var request = require("request");
const bodyParser = require("body-parser");

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "https://uat-ocp.wooribank.com.kh");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-CSRF-TOKEN");
    next();
});

io.on('connection', function(socket){
  console.log("socket.io connected");
});

// First Page
app.get('/',function(req,res){
  console.log("Welcome to my Woori Bank Real-time application");
});

// Refresh Amount MB
app.post('/RefreshAmount/:AccountID',function(res,req){
  console.log("/RefreshAmount/"+res.params.AccountID);
  var results = res.body;
  console.log("Status Code: " + req.statusCode);
  console.log(results);
  io.emit('RefreshAmount-'+res.params.AccountID,results);
  req.end();
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
