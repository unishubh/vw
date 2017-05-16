var passport = require('passport');
var mongoose = require('mongoose');
var device = mongoose.model('device');
var device_user = mongoose.model('device_user');
var kue = require('kue-scheduler');
//var queue = kue.createQueue();
var util = require('util');
var users = mongoose.model('user');
//--------------------------------------



/*========================================================================================================

    Functions in this file shall be pertaining to the devices and it's users.

=======================================================================================================*/

/*=======================================================================================================
     
    Function to add a new user of the device

========================================================================================================*/

module.exports.addUser = function (req, res) {
  //  console.log("in function");

    var admin = req.payload._id;
    var newdevice = req.body.device_id;
    var newUser = req.body.phone_num;
   // console.log(newdevice);
   // console.log(admin);

    device.find({_id:newdevice}, function(err, result){

        if(err){
            res.status(401).json({"message":err});
        }
        if(!result.length) {
            res.status(403).json({"message":"You are not the admin"});
        }

        else {
   // console.log(result[0].state);
    //console.log(util.inspect(result, { showHidden: true, depth: null }));
                users.aggregate([
                    { $match:
                      {
                          phone_num : newUser
                      }
                     } ,
                      {
                          $project :
                          {
                              _id : 1
                          } 
                      }
                     

                ], function (err, result1){

                    if(err)
                    {
                        res.status(401).json(err);
                    }

                    else if(!result1.length){
                        res.status(403).json({"message":"No user with this phone number"});
                    }
                    else 
                    {
                   // console.log(result1[0]._id);
                    relation = new device_user();
                    relation.user_id = result1[0]._id;
                    relation.device_id=newdevice;

                    device_user.find({device_id:newdevice, user_id:result1[0]._id}, function(err, result) {

                        if(err) {
                        res.status(401).json({"message":err});
                        }
                        if(result.length) {
                          //  console.log(result[0].device_id);
                    res.status(200).json({"message":"User already has access to the device"});
                        }
                        else if(!result.length) {

                                relation.save( function(err, newRelation){

                                    if(err)
                                    res.status(401).json({"message":err});

                                    else
                                    res.status(200).json({"message":"New User successfully added"});
                                });
                        }
                    });
                }
                    });
                
                    
            }
    });
}

//-------------------------------------------------------------------------------------------------------//

/*========================================================================================================

Function to search for the users and return their user_id

=========================================================================================================*/
module.exports.searchUser = function(req, res){
    var admin = req.payload._id;
    var newdevice = req.body.device_id;
    var newUser = req.body.phone_num;
    //res.status(200).json({"message":device});
    //console.log(device);
    console.log(admin);
     device.find({_id:newdevice}, function(err, done){

        if(err){
            res.status(401).json({"message":err});
        }
        
        else {
            //console.log(done.data);
             res.status(200).json({"message":"You are  the admin"});
        }
     }); 
}