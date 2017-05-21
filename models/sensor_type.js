var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var sensor_typeSchema=new Schema({
	type:{type:String,unique:true}	
});

module.exports=mongoose.model('sensor_type',sensor_typeSchema);