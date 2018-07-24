var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://sadhana590:sa1234@ds247061.mlab.com:47061/battle_db';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
global.battle_db = db;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports  = db;