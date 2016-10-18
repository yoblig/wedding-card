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
var nodemailer = require("nodemailer");

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
  // app.get('/order/:id', function(req, res, next) {
    res.render('order', {title: 'Order & Pay'});
    
    
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    var stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");
    
    // Get the credit card details submitted by the form
    var token = req.body.stripeToken; // Using Express
    
    // Create a charge: this will charge the user's card
    var charge = stripe.charges.create({
      amount: 4000, // Amount in cents
      currency: "usd",
      source: token,
      description: "Example Card Matrimony Charge"
    }, function(err, charge) {
      if (err && err.type === 'StripeCardError') {
        // The card has been declined
      }
    });
    
  //   Order.findOne({_id: req.params.id}, function(err,order){
  //   if (err) return console.log(err);
  //   else {
      
  //     var transporter = nodemailer.createTransport('smtps://someone@gmail.com:password@smtp.gmail.com');
    
  //     // setup e-mail data with unicode symbols 
  //     var mailOptions = {
  //         from: '"', // sender address 
  //         to: '', // list of receivers 
  //         subject: 'Wedding Card Confirmation', // Subject line 
  //         html: 'You have cards coming your way for <b>' + order.bride + '</b>', // html body 
  //         attachments:   {   // file on disk as an attachment 
  //           path: 'public/images/cards.png' // stream this file 
  //         }
  //     };
   
  //     // send mail with defined transport object
  //     transporter.sendMail(mailOptions, function(error, info) {
  //       if(error) return console.log(error);
  //       console.log('Message sent: ' + info.response);
  //     });
  //   }
  // });
    
    
    
  //   Order.findOne({_id: req.params.id}, function(err,order){
  //   if (err) return console.log(err);
  //   else {
      
  //     var transporter = nodemailer.createTransport('smtps://gilboyk@gmail.com:Go2Hell!@smtp.gmail.com');
    
  //     // setup e-mail data with unicode symbols 
  //     var mailOptions = {
  //         from: '"Kevin Gilboy" <gilboyk@gmail.com>', // sender address 
  //         to: 'kevin_gilboy@yahoo.com', // list of receivers 
  //         subject: 'Wedding Card Confirm', // Subject line 
  //         text: 'You have cards coming your way for ' + order.bride, // plaintext body 
  //         //html: '<b>Get Money</b>' // html body 
  //     };
   
  //     // send mail with defined transport object
  //     transporter.sendMail(mailOptions, function(error, info) {
  //       if(error) return console.log(error);
  //       console.log('Message sent: ' + info.response);
  //     });
      
  //     ejs.renderFile('./views/confirm.ejs', {order:order, title: "moneybank"}, {}, function(err, str){
  //     if (err) console.log(err);
  //     else {
  //       res.send(str);
  //     }
  //   });
  //   }
  // });
    
   
});

app.get('/confirm', function(req, res, next) {
    res.render('confirm', {title:'Order Has Been Placed'});
});

// END Routes


app.listen(8080, function(){
  console.log("Server Running On 8080");
});
