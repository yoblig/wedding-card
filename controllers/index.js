// TODO: Why include if in server file
var mongoose = require("mongoose");
var Order = mongoose.model('Order');

exports.indexGet = function(req, res, next){
    res.render('index', { title: 'Cards Against Matrimony' });
};

exports.coupleGet = function(req, res, next){
    console.log("coupleGet");
    Order.find({})
        .exec(function(err, orders){
            if(err){
                res.send("Error Occured");
            }
            else { 
                console.log(orders);
            }
        });
  res.render('couple', {title: 'Enter Couple Names'}); 
}

exports.couplePost = function(req, res){
    console.log('Couple Post Work');
    var bride = req.body.bride;
    var groom = req.body.groom;
    console.log('this is bride:' + bride);
    res.redirect('/card');   
}
