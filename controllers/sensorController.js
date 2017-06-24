var passport = require('passport');
var mongoose = require('mongoose');
var device = mongoose.model('device');
var device_user = mongoose.model('device_user');
var dataStore = mongoose.model('dataSchemaDemo');
var appliances = mongoose.model('applianceList');
var kue = require('kue-scheduler');
var queue = kue.createQueue();
var util = require('util');
var sensor_type=require('../models/sensor_type');
var sensor=require('../models/sensor_new');
var sensor_device=require('../models/sensor_device');
var device_user = mongoose.model('device_user');
//-------------------------------------------------------------------------------------------------------//
var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
}


/*----------------function to add sensor type-----------------*/

module.exports.addSensorType=function(req,res)
{
	if(!req.body.type)
	{
		return sendJSONresponse(res,500,{message:'please provide a sensor type'});
	}
	var newSensorType=new sensor_type({type:req.body.type});
	
	newSensorType.save(function(err,ns) 
	{
		if(err)
		return sendJSONresponse(res,500,err);
		
		sendJSONresponse(res,200,{id:ns._id});
	})

}


/*----------------function to list all  sensor types-----------------*/

module.exports.listSensorType=function(req,res)
{
	sensor_type.find({},function(err,list)
	{
		if(err)
			return sendJSONresponse(res,500,{message:err});
		
		return sendJSONresponse(res,200,list);
	})
}



/*----------------function to add sensor-----------------*/

module.exports.addSensor=function(req,res)
{
	if(!req.payload._id){
      return res.status(401).json({
            "message": "Please login to add a new device"
        });}

      //if no data is provided in body
	if(!req.body.type)
		return sendJSONresponse(res,403,{message:'please provide a sensor type'});


	sensor_type.findOne({type:req.body.type},function(err,sensorType)
	{
		if(err)
			return sendJSONresponse(res,500,err);
		//no sensor exist of the requested type
		if(!sensorType)
			return sendJSONresponse(res,403,{message:'invalid sensor type'});
		else
		{
			/*var newSensor=new sensor();
			newSensor.type=sensorType.type; //foreign key wrt sensor_type

			newSensor.admin=req.payload._id; //logged in user is the admin
				//update 
			newSensor.save(function(err,ns)
			{
				if(err)
					return sendJSONresponse(res,500,err);
				else
					return sendJSONresponse(res,200,ns);
			});*/
			/*sensor.update({_id: req.body.sensor_id}, 
			{$set: {admin: req.payload._id}}, function(err, done)
			{
				if(err)
					return sendJSONresponse(res,401,done);
				else
				{
					
					return sendJSONresponse(res,200,done);
				}
			})
			*/
			var newSensor=new sensor();
			newSensor.admin=req.payload._id;
			newSensor.type=req.body.type;
			newSensor.save(function(err,sense)
			{
				if(err)
					return sendJSONresponse(res,404,err);
				else
					return sendJSONresponse(res,200,sense);
			})
		}
	})
}

/*----------------function to list sensors of user-----------------*/

module.exports.listSensor=function(req,res)
{
	if(!req.payload._id){
      return res.status(401).json({
            "message": "Please login to add a new device"
        });}

     sensor.find({admin:req.payload._id},function(err,list) 
     {
    	 if(err)
			return sendJSONresponse(res,500,err);
		else if(!list)
			return sendJSONresponse(res,401,{message:"No sensors found"});
		else
			return sendJSONresponse(res,200,list);;
     
     })   
}




/*----------------function to add sensors for devices -----------------*/

module.exports.addSensor_Device=function(req,res)
{
	if(!req.payload._id){
      return res.status(401).json({
            "message": "Please login to add a new device"
        });}

     if(!req.body.sensor_id || !req.body.device_id)
     	return sendJSONresponse(res,400,{message:'please enter sensor/device id'});

     //validating sensor_id
     var id = mongoose.Types.ObjectId(req.body.device_id);
     console.log(id);
     sensor.findOne({_id:req.body.sensor_id,admin:req.payload._id},function(err,sen)
     {
     	if(err)
			return sendJSONresponse(res,500,err);
		else if(!sen) //no sensor found
		{
			return sendJSONresponse(res,400,{message:'invalid sensor_id'});			
		}
		else 
			{
				console.log('valid sensor id');
				
				//validating device_id
				device_user.findOne({device_id:req.body.device_id,user_id:req.payload._id},function(err,dev)
				{
					if(err)
						return sendJSONresponse(res,500,err);
					else if(!dev) //no device found
					{
						return sendJSONresponse(res,400,{message:'invalid device_id'});			
					}
					else
					{
						console.log('valid device id '+dev.device_id);
						var sd=new sensor_device();
						sd.device_id=dev.device_id;
						sd.sensor_id=sen._id;
						sd.threshold_start=req.body.threshold_start;
						sd.threshold_stop=req.body.threshold_stop;
						sd.save(function(err,done)
						{
							if(err)
							return sendJSONresponse(res,500,err);
							else
							return sendJSONresponse(res,200,done);
						})
					}
				})
			

			}	

     })

}



