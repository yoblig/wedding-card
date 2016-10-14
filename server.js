var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require("helmet");
var compression = require("compression");
var methodOverride = require("method-override");
var ejs = require("ejs");
var email = require("emailjs");

// Database - Overall
// Models & Schema
var mongoose = require("mongoose");


var Schema = mongoose.Schema;
var OrderSchema = new Schema({
    bride: String,
    groom: String,
    sayings: Array,
    confirmId: String
});

var Order = mongoose.model('Order', OrderSchema);

// END Models & Schema 

// Database Connection
mongoose.connect('mongodb://Test:test@ds053216.mlab.com:53216/weddingcard');

// END Database - Overall

// Express Config 
  // Construct Express
  var app = express();
  
  // view engine setup
  app.set('view engine', 'ejs');

  // app.set('views', path.join(__dirname, 'views'));
  // app.set('views',__dirname + '/views');
  // app.set('view options', { layout:false, root: __dirname + '/views' } );
  
  // Middleware
  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(helmet());
  app.use(compression());
  app.use(methodOverride());
  
  // Middleware - Custom

  // error handlers
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }
  
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

// END Express Config

// Routes 
  
app.get('/', function(req, res, next){
    ejs.renderFile('./views/index.ejs', {title:'Cards Against Matrimony'}, {}, function(err, str){
        if(err) res.send(err);
        else res.send(str);
    });
});

// Routes: Couple
app.get('/couple', function(req, res, next){
    ejs.renderFile('./views/couple.ejs', {title:'Cash'},{}, function(err, str) {
        if(err) res.send(err);
        else res.send(str);
    }); 
});

app.post('/couple', function(req, res){
    var bride = req.body.bride;
    var groom = req.body.groom;
    
    var order = new Order({
      bride: bride,
      groom: groom
    });
    
    order.save(function (err, data) {
      if (err) console.log(err);
      else {
        console.log('Saved ', data );
        res.redirect('/card/' + data._id);   
      }
    });
    
});

// Routes: Card
app.delete('/card/:id', function(req, res, next){
  console.log('perform delete on saying');
  res.send('moneybank');
});

app.get('/card/:id', function(req, res, next) {
  Order.findOne({_id: req.params.id}, function(err,order){
    if (err) return console.log(err);
    else {
      ejs.renderFile('./views/card.ejs', {order:order, title: "moneybank"}, {}, function(err, str){
      if (err) console.log(err);
      else {
        res.send(str);
      }
    });
    }
  });
});

app.post('/card/:id', function(req, res, next){
  var newCard = req.body.saying;
  console.log(newCard);
  
  Order.update({_id: req.params.id},{ $push: {sayings:newCard} }, function(err, order){
    if (err) return console.log(err)});
  
  res.redirect('/card/' + req.params.id);
});

// Routes: Review
app.get('/review/:id', function(req, res, next) {
  Order.findOne({_id: req.params.id}, function(err,order){
    if (err) return console.log(err);
    else {
      ejs.renderFile('./views/review.ejs', {order:order, title: "moneybank"}, {}, function(err, str){
      if (err) console.log(err);
      else {
        res.send(str);
      }
    });
    }
  });
});

app.get('/order', function(req, res, next) {
    res.render('order', {title: 'Order & Pay'});
    
    // var server = email.server.connect({
    //   "host" : "smtp.gmail.com",
    //   "user" : "",
    //   "password" : "!",
    //   "ssl" : true,
    //   "port" : 465
    // });
    
    // server.send({
    //   text:    "i hope this works", 
    //   from:    "you <gilboyk@gmail.com>", 
    //   to:      "someone <kevin_gilboy@yahoo.com>",
    //   subject: "testing emailjs"
    // }, function(err, message) { console.log(err || message); });
    
  //   var server 	= email.server.connect({
  //   user:    "username", 
  //   password:"password", 
  //   host:    "smtp.your-email.com", 
  //   ssl:     true
  // });
 
  // // send the message and get a callback with an error or details of the message that was sent 
  // server.send({
  //   text:    "i hope this works", 
  //   from:    "you <username@your-email.com>", 
  //   to:      "someone <someone@your-email.com>, another <another@your-email.com>",
  //   cc:      "else <else@your-email.com>",
  //   subject: "testing emailjs"
  // }, function(err, message) { console.log(err || message); });
});

app.get('/confirm', function(req, res, next) {
    res.render('confirm', {title:'Order Has Been Placed'});
});

// END Routes


app.listen(8080, function(){
  console.log("Server Running On 8080");
});
