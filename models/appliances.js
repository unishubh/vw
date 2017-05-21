var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var applianceList = new mongoose.Schema({
    appliance_name: String
    
});

mongoose.model('applianceList', applianceList);