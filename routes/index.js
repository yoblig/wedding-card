var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/couple', function(req, res, next){
    //spin up new order in db   
   res.render('couple', {title: 'Enter Couple Names'}); 
});

// router.post('/couple', function(req,res){
//   // get the names
//   // attach the names to the order
   
//   res.send('')
// });

router.get('/card', function(req, res, next) {
    res.render('card', {title:'Enter Your Personal Cards'});
});

router.get('/review', function(req, res, next) {
    res.render('review', {title: 'Review Your Order'});
});

router.get('/order', function(req, res, next) {
    res.render('order', {title: 'Order'});
});

router.get('/confirm', function(req, res, next) {
    res.render('confirm', {title:'Order Has Been Placed'});
});





module.exports = router;
