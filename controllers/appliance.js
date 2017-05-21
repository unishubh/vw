var passport = require('passport');
var mongoose = require('mongoose');
var device = mongoose.model('device');
var device_user = mongoose.model('device_user');
var dataStore = mongoose.model('dataSchemaDemo');
var appliances = mongoose.model('applianceList');
var kue = require('kue-scheduler');
//var queue = kue.createQueue();
var util = require('util');



//-----------------------------------------------------------------------------------------------------//

module.exports.addAppliance = function(req , res){

    var newAppliance = new appliances();
    newAppliance.appliance_name = req.body.appliance_name;

    newAppliance.save(function (err, done){

        if(err)
        {
            res.status(401).json({"message": err});
        }
        else
        {
             res.status(200).json({"message" : done});
        }
    });

}