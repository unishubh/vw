var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');


var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
}

module.exports.register = function(req, res) {
    var flag = 0;
    User.findOne({$or: [ {email: req.body.email}, {phone_num: req.body.phone_num} ] }, function(err, user){
        if(err){
         res.json({
                "message": err
            });
        }

        if(user)
        {
            console.log(user.name);
            sendJSONresponse(res, 400, {
                "message": "The email id or phone number already registered already registered"
                });
               return;
        }

         console.log(flag);
     console.log("No user found", req.body.email);
     var user = new User();
     user.name = req.body.name;
     user.email = req.body.email;
     user.address = req.body.address;
     user.latitude = req.body.latitude;
     user.longitude = req.body.longitude;
     user.phone_num = req.body.phone_num;
     user.setPassword(req.body.password);

     user.save(function(err) {

         if(err)
         {
             res.send(err);
         }
         console.log("saving");
    var token;
    token = user.generateJwt();
    console.log(user.email);
    res.status(200);
    res.json({
      "token" : token
    });

     });
    }); 

   
    
     

    
    
};

module.exports.show = function(req, res) {


}

module.exports.show =  function(req, res) {
  User.find({}, function(err, users) {
    var userMap = {};
    var c=0;

    users.forEach(function(user) {
      userMap[user._id] = user;
      c++;
    });
    console.log(c);
    res.send(userMap);  
  });

};

module.exports.login = function(req, res) {
     //console.login("In login");
   if(!req.body.email || !req.body.password) {
     sendJSONresponse(res, 400, {
       "message": "All fields required"
     });
     return;
   }

  passport.authenticate('local', function(err, user, info){
    var token;
     
    // If Passport throws/catches an error
    if (err) {
        
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){

      console.log(user.name);
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
     // console.log(req,body.email);
      res.status(401).json("message","user not found");
    }
  })(req, res);

};


