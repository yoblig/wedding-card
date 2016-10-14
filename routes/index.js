
app.get('/', function(req, res, next){
    res.render('index', { title: 'Cards Against Matrimony' })
});

app.get('/couple', function(req, res, next){
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
});

app.post('/couple', function(req, res){
    console.log('Couple Post Work');
    var bride = req.body.bride;
    var groom = req.body.groom;
    console.log('this is bride:' + bride);
    res.redirect('/card');   
});

app.get('/card', function(req, res, next) {
    res.render('card', {title:'Enter Your Personal Cards'});
});

app.get('/review', function(req, res, next) {
    res.render('review', {title: 'Review Your Order'});
});

app.get('/order', function(req, res, next) {
    res.render('order', {title: 'Order & Pay'});
});

app.get('/confirm', function(req, res, next) {
    res.render('confirm', {title:'Order Has Been Placed'});
});
