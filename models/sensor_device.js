var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var sensor_device_schema=new Schema({
	device_id:String,
	sensor_id:String,
	threshold_start:Number,
	threshold_stop:Number	
})
module.exports=mongoose.model('sensor_device',sensor_device_schema);