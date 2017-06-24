//utility function to complete sensor write operation
var mongoose = require('mongoose');
var sensor_type=require('../models/sensor_type');
var sensor=require('../models/sensor_new');
var sensor_device=require('../models/sensor_device');
var device_user = require('../models/device_user');
var device = require('../models/device');

var write=require('./device').write; //write apiin device.js
/* ---------------------------function for sensor write----------------------*/
module.exports.sensorWrite=function(req,res)
{
    console.log('yhi humai');
    if(!req.body.sensor_id || !req.body.data)
		return sendJSONresponse(res,400,{message:'please provide sensor id/data'});
	
	sensor_device.findOne({sensor_id:req.body.sensor_id},function(err,sen)
	{
		if(err)
		return sendJSONresponse(res,500,err);

		var data=req.body.data;
		console.log('yhi humai 2');
        if(data>=sen.threshold_stop) //state=0
		{
    		/*console.log('i am here 1');*/
			req.body.data=0;
            return write(req,res,0); //calling write api in device.js to complete the write operation
		}
		else if(data<=sen.threshold_start) //state=1
		{
			console.log('i am here');
			req.body.data=1;
            return write(req,res,1);  //calling write api in device.js to complete the write operation
		}

		else
		{
			res.status(200).json({"message":"Data Does not change the state of plug"});
		}
	})
}

