

module.exports = class Battle {
    // constructor() {
    //     movie = movie_db.collection('movie')
    //     credit = movie_db.collection('credit')
    // }
    getActor() {
        return new Promise((resolve, reject) => {
            movie_db.collection('credit').aggregate([
                {
                    $lookup:
                    {
                        from: "movie",
                        localField: "movie_id",
                        foreignField: "id",
                        as: "holidays"
                    }
                },
                {
                    $match:
                        { "holidays.genres.name": "Action" }
                },
                { $unwind: "$cast" },
                {
                    $group: {
                        _id: "$cast.name",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "count": -1 }
                },
                {
                    $limit: 1
                }
            ]).toArray((err, data) => {
                if (err) {
                    console.log(err)
                    return reject(err);
                }
                resolve(data);
            });
        });
    }


    getRevenue() {
        return new Promise((resolve, reject) => {
            movie_db.collection('credit').aggregate([
                {
                    $lookup:
                    {
                        from: "movie",
                        localField: "movie_id",
                        foreignField: "id",
                        as: "holidays"
                    }
                },
                {
                    $match:
                    {
                        "holidays.production_companies.name": "Twentieth Century Fox Film Corporation",
                        "cast.name": "Will Smith",
                        'holidays.release_date': { '$gte': new Date('2000-01-01').toISOString() }
                    }
                },
                { $unwind: "$holidays" },
                {
                    $group: {
                        _id:"1",
                        count: { $sum: "$holidays.revenue" }
                    }
                },
            ]).toArray((err, data) => {
                if (err) {
                    console.log(err)
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
}