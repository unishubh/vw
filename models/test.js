var express=require('express');
var app=express();
var mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1/conFusion');

var Schema=mongoose.Schema;

var sensor_typeSchema=new Schema({
	
	type:String
});

var sensor_type=mongoose.model('sensor_type',sensor_typeSchema);

var s=new sensor_type({type:'mera mann'});

s.save(function(err,s1)
{
	if(err)
		console.log(err);
	else
		console.log(s1);
});

console.log(sensor_type.findOne({type:'mera mann'},function(err,res)
{
	if(err)
		console.log(err);
	else{
		console.log('yo i am here');
		console.log(res);
		var id=res._id;
	
	}
}));