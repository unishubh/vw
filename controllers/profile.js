var mongoose = require('mongoose');
var User = mongoose.model('user');


module.exports.profileRead = function(req, res){
    //console.log("profile");
    if(!req.payload._id) {
        res.status(401).json({
            "message": "Private Profile"
        });
    }
    else{
        User.findById(req.payload._id).exec(function(err, user){
            res.status(200).json(user);
        });
    }

};