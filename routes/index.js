var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlDevice = require('../controllers/device');
var ctrlSensor = require('../controllers/sensors');
var ctrlUser = require('../controllers/users');
var ctrlAppliance = require('../controllers/appliance');
var ctrlSensor_new=require('../controllers/sensorController'); //updated sensor schemas and module
var ctrlSensorWrite=require('../controllers/sensorWrite');
router.get('/profile', auth, ctrlProfile.profileRead);
router.post('/register', ctrlAuth.register);
router.get('/show',ctrlAuth.show);
router.post('/login', ctrlAuth.login);
router.post('/addDevice', auth, ctrlDevice.addDevice);
router.post('/showDevice', auth, ctrlDevice.deviceList);
router.post('/device', ctrlDevice.adder);
router.post('/write', auth, ctrlDevice.write);
router.post('/delay',auth,ctrlDevice.delayTest);
router.get('/read/:device_id',ctrlDevice.read);
router.get('/readSensor/:sensor_id',ctrlSensor.sensor_read);
//router.post('/addSensor',ctrlSensor.add_sensor);
router.post('/writeSensor/:sensor_id/:data',ctrlSensor.sensor_write);
router.post('/addUser',auth,ctrlUser.addUser);
router.post('/addAppliance', ctrlAppliance.addAppliance);

router.post('/addSensorType',ctrlSensor_new.addSensorType);
router.get('/listSensorType',ctrlSensor_new.listSensorType);
router.post('/addSensor',auth,ctrlSensor_new.addSensor);
router.get('/listSensor',auth,ctrlSensor_new.listSensor);
router.post('/addSensorDevice',auth,ctrlSensor_new.addSensor_Device);
router.post('/sensorWrite',auth,ctrlSensorWrite.sensorWrite);
module.exports = router; 