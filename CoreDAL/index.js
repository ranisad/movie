const MongoClient = require('mongodb').MongoClient;
var db = null;
//Set up default mongoose connection
var mongoDB = 'mongodb://sadhana590:sa1234@ds161312.mlab.com:61312/movie_db';
MongoClient.connect(mongoDB, { useNewUrlParser: true },function(err, client) {
    db = client.db();
    global.movie_db = db;
});

module.exports  = db;