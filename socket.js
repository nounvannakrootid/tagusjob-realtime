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
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-CSRF-TOKEN");
    next();
});

var FADE_TIME = 150; // ms
var TYPING_TIMER_LENGTH = 400; // ms

// Prompt for setting a username
var username;
var connected = false;
var typing = false;
var lastTypingTime;

io.on('connection', function(socket){
  console.log("socket.io connected");
});

// Updates the typing event
function updateTyping (object) {
  if (!typing) {
    typing = true;
    io.emit('Typing',object);
  }
  lastTypingTime = (new Date()).getTime();

  setTimeout(function () {
    var typingTimer = (new Date()).getTime();
    var timeDiff = typingTimer - lastTypingTime;
    if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
      io.emit('Stop Typing',object);
      typing = false;
    }
  }, TYPING_TIMER_LENGTH);
}

// First Page
app.get('/',function(req,res){
  console.log("Welcome to my Tagusjob.com");
});

// channel new post
app.post('/NewPost', function(req, res){
  console.log("/NewPost");
  var results = {user_id:req.query.user_id,message:req.query.message};
  io.emit('New Post',results);
  res.end();
});

// channel new comment
app.post('/NewComment/:feedID',function(req,res){
  console.log("/NewComment/"+req.params.feedID);
  var results = req.query;
  io.emit('New Comment '+req.params.feedID,results);
  res.end();
});

// channel count comment
app.post('/CountComment/:feedID',function(req,res){
  console.log("/CountComment/"+req.params.feedID);
  var results = req.query;
  io.emit('Count Comment '+req.params.feedID,results);
  res.end();
});

// channel check user comment
app.post('/UserComment/:feedID',function(req,res){
  console.log("/UserComment/"+req.params.feedID);
  var results = req.query;
  io.emit('User Comment '+req.params.feedID,results);
  res.end();
});

// channel count like
app.post('/CountLike/:feedID',function(req,res){
  console.log("/CountLike/"+req.params.feedID);
  var results = req.query;
  io.emit('Count Like '+req.params.feedID,results);
  res.end();
});

// channel check commenting
app.post('/CheckCommenting/:feedID',function(req,res){
  console.log("/CheckCommenting/"+req.params.feedID);
  var results = req.query;
  io.emit('Check Commenting '+req.params.feedID,results);
  res.end();
});

// channel count jobs
app.post('/CountJob',function(req,res){
  console.log("/CountJob");
  var results = req.query;
  io.emit('Count Job',results);
  res.end();
});

// channel count notification
app.post('/CountNotification/:userID/:counter',function(req,res){
  console.log("/CountNotification/"+req.params.userID);
  var results = {'counter':req.params.counter,'notification':req.query};
  io.emit('Count Notification '+req.params.userID,results);
  res.end();
});

app.post('/FollowingNnotification/:userID',function(req,res){
  // console.log("/FollowingNnotification/"+req.params.userID);
  var results = req.query;
  io.emit('Following Notification '+req.params.userID,results);
  res.end();
});

app.post('/Typing/:feedID/:user_name/:user_id',function(req,res){
  console.log("/Typing/"+req.params.feedID);
  var results = {"user_name":req.params.user_name,"feed_id":req.params.feedID,"user_id":req.params.user_id};
  // io.emit('Typing',results);
  updateTyping(results);
  res.end();
});

app.post('/StopTyping/:feedID',function(req,res){
  console.log("/StopTyping/"+req.params.feedID);
  var results = {"feed_id":req.params.feedID};
  updateTyping(results);
  // io.emit('Stop Typing',results);
  res.end();
});

// following count
app.post('/FollowingCounter/:user_id/:counter',function(req,res){
  console.log("/FollowingCounter/"+req.params.user_id+"/"+req.params.counter);
  var results = {"user_id":req.params.user_id,"counter":req.params.counter};
  io.emit('Following Counter '+req.params.user_id,results);
  res.end();
});

// follower count
app.post('/FollowerCounter/:user_id/:counter',function(req,res){
  console.log("/FollowerCounter/"+req.params.user_id+"/"+req.params.counter);
  var results = {"user_id":req.params.user_id,"counter":req.params.counter};
  io.emit('Follower Counter '+req.params.user_id,results);
  res.end();
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
// function a(){
//
// }
// export{a}
