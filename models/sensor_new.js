var mongoose=require('mongoose');
var Schema=mongoose.Schema;

//sensor schema to be used
var sensor_schema=new Schema(
{
	admin:{type:String,default:null},
	type:{type:String,default:null} //foreign key to sensor_type
})

module.exports=mongoose.model('sensor_new',sensor_schema); //updated module of sensor