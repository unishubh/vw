

var passport = require('passport');
var mongoose = require('mongoose');
var device = mongoose.model('device');
var device_user = mongoose.model('device_user');
var dataStore = mongoose.model('dataSchemaDemo');
var appliances = mongoose.model('applianceList');
var kue = require('kue-scheduler');
var queue = kue.createQueue();
var util = require('util');
//-------------------------------------------------------------------------------------------------------//

module.exports.delayTest = function(req, res){





var job = ({
    from: req.payload._id,
    type: 'message',
    data: {
        device: req.body.device_id,
        state: req.body.state
    }
});
//console.log(job.from);

var job = queue.createJob('schedule', job);
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
                 //var stat = 9;

                 device.findById(newdevice.device_id, function(err, device1) {

                 if(err)
                 {
                return "error";
                 }
                 //if(device1.state==NULL)
                 //console.log(device1._id);
                console.log(device1.state);
                stat =  device1.state;
                //console.log("state "+ stat);
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
        device.update({_id: req.body.device_id}, {$set: {admin: req.payload._id, appliance_id: req.body.appliance_id}}, function(err, done) {
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
    console.log(req.payload._id);
    device_user.find({user_id:req.payload._id, device_id:req.body.device_id}, function (err, result){

            if(err)
            {
                console.log(err);
                 res.status(401).json({"message":err});
            }

            else if(!result.length)
            {
                console.log("User does not have the rights to access the device");
                res.status(403).json({"message":"User does not have the rights to access the device"});
            }
            
            else {
                //console.log("Yahan AAya");
    console.log(result.device_id);

                device.update({_id : req.body.device_id}, {$set: {state: t}}, function(err, done){
                if(err)
                {
                    res.status(401).json({"message":err});
                }
                console.log(done);
                newData = new dataStore();
                newData.state = t;
                newData.device_id=req.body.device_id;
                newData.updated_by = req.payload._id;
                newData.updated_at=Date.now();
                newData.save(function(err){
                    if(err)
                    {
                        res.status(401).json({"message":err+" Data Storage "});
                    }
                    else
                    {
                        res.status(200).json({"message": "Updated Successfully"});
                    }
                });
                    });
        }
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

//Function to read the status of a device

module.exports.read = function (req, res){


device.findOne({_id:req.params.device_id}, function(err, device1){
    console.log(req.params.device_id);
    if(err)
    {
        console.log("Some error");
        res.status(401).json({"message": err});
    }
     else
{
console.log(device1.state );
//res.status(200).json({"message" : device1.state});
var t = device1.state+"";
res.send(t);
}
});

};


/*====================================================================================================
  

====================================================================================================*/ 

//Helper function
var help = function(id){
    
};

