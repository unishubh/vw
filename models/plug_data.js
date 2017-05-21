var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

//Schema to store the data as recieved by the sensor //

/* var dataSchema = new mongoose.Schema ({
    timeStart : 
    { 
        type: Date,
        default:Date.now
    },

    timeEnd   : 
    { 
        type: Date,
        default: Date.now,
    },

    values : [{
        device_id: {
            type: String,
            default: "abcd"
        },
        user_id  : 
        { 
            type:String,
            default: "efgh",
        },

        state    : {
            type:Number,
            default:0,
        },

        updated_at: 
        {
        type:Date,
        default:Date.now
        }
    }]



    

});  */

var dataSchemaDemo = new mongoose.Schema({

    device_id : String,
    updated_by: String,
    value: Number,
    updated_at:Date,
    state: Number
});

mongoose.model('dataSchemaDemo',dataSchemaDemo);
