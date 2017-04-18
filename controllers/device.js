var passport = require('passport');
var mongoose = require('mongoose');
var device = mongoose.model('device');
var device_user = mongoose.model('device_user');
var kue = require('kue-scheduler');
var queue = kue.createQueue();
var util = require('util');
//-------------------------------------------------------------------------------------------------------//

module.exports.delayTest = function(req, res){




//console.log(res.headers);
   


  /*  var job = queue.create('myQueue',{
        from : 'user',
        type : 'message',
        data : {
            msg: 'This is first attempt to queue'
        }
    }).save(function (err) {
        if(err){
            console.log(err);
        }
        else
        console.log(job.id);
         console.log("success") ;
res.status(200).json({
            "message": job.id
        });    });
   
*/
var job = ({
    from: req.payload._id,
    type: 'message',
    data: {
        device: req.body.device_id,
        state: req.body.state
    }
});
//console.log(job.from);

var job = queue.createJob('myQueue', job);
queue.schedule(req.body.time+'seconds from now', job);
//console.log(job.id);
         console.log("success") ;
res.status(200).json({
            "message": "The action has been scheduled"
        }); 
}

//-----------------------------------------------------------------------------------------------------

//Return the list of device and their status
module.exports.deviceList = function(req, res){
   console.log("Successfull request from"+req.payload._id);
    if(!req.payload._id){
        res.status(401).json({
            "message": "Please login to see your devices"
        });
    }
//var devices = {};
 device_user.find({user_id: req.payload._id}, function(err, devices) {
    var devicemap = [];
    if(err){
	      console.log(err+" was the error");
         res.json({
                "message": err
            });
        }

        else 
        {
            function callback()
            {
	  var x = JSON.stringify(devicemap)
                res.status(200).json({
         "array" : devicemap }
       );
//		res.status(200).json({
  //          "message": "Done"
    //    });
            }

            var itemsProcessed = 0;
            
            console.log("Items");
		console.log(devices.length);
			if(devices.length == 0) {
				console.log("Zero");
				res.status(200).json({
            "message": "Zero Elements"
        });
  }
            devices.forEach(function(newdevice){
                console.log(newdevice.device_id); 
                 //var state = help(newdevice.device_id);
                 var stat = 9;

                 device.findById(newdevice.device_id, function(err, device) {

                 if(err)
                 {
                return "error";
                 }
                console.log(device.state);
                stat =  device.state;
                console.log("state "+ stat);
                devicemap.push({device_id: newdevice.device_id, state: stat});
                    itemsProcessed++;
                 if(itemsProcessed === devices.length) {
                   callback();
                     }
                    });
                
            });

            
        }
});
};


//-------------------------------------------------------------------------------------------------------//


//To inititate a new device
module.exports.addDevice = function(req, res){

        if(!req.payload._id){
        res.status(401).json({
            "message": "Please login to add a new device"
        });
        }
        device.update({_id: req.body.device_id}, {$set: {admin: req.payload._id}}, function(err, done) {
            if(err) {
                console.log(req.params.device_id+" "+err+" IS THE ERROR");
                res.status(401).json({"message" : "Please enter a valid device id"});
            }

            else
            var new_device_user = new device_user();
            new_device_user.device_id = req.body.device_id;
            new_device_user.user_id = req.payload._id;

            new_device_user.save(function (err){
                if(err)
                {
                     res.status(401).json({"message" : "Some error"});
                }
            });

            res.status(200).json({"message": "Added Successfully"});
        });
        


};

//-------------------------------------------------------------------------------------------------------//


//Changing the status of a file
module.exports.write = function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    var t = req.body.data;
    device.update({_id : req.body.device_id}, {$set: {state: t}}, function(err, done){
        if(err)
        {
            res.status(401).json({"message":err});
        }
        console.log(done);
        res.status(200).json({"message": "Current state "+t});
    });
};

//-------------------------------------------------------------------------------------------------------//


//Add a new device
module.exports.adder = function(req, res){
    var newDevice = new device();
    newDevice.save( function(err, newDevice){ 
        if(err)
        {
            res.status(401).json({"message": err});
        }
        res.status(200).json({"message" : newDevice});
    } );

};

//-------------------------------------------------------------------------------------------------------//

module.exports.read = function (req, res){

console.log("req.body.device_id hai yaha pe");
device.findOne({_id:req.params.device_id}, function(err, device1){
    if(err)
    {
        console.log("Some error");
        res.status(401).json({"message": err});
    }
console.log(device1.state );
//res.status(200).json({"message" : device1.state});
var t = device1.state+"";
res.send(t);
});

};

//Helper function
var help = function(id){
    
};

