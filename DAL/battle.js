const battle = require('./schema/battle');
const promise = require('promise');

module.exports = class Battle {
    getAllBattlePlaces() {
        return new promise((resolve, reject) => {
            battle.find({}, { "location": 1, "_id": 0 }, (err, locations) => {
                if (err)
                    reject(err);
                resolve(locations);
            })
        })
    }

    getTotalNoOfBattle() {
        return new promise((resolve, reject) => {
            battle.count({}, (err, locations) => {
                if (err)
                    reject(err);
                resolve(locations);
            })
        })
    }

    getStats() {
        return new promise((resolve, reject) => {
            Promise.all([
                battle.aggregate([
                    {
                        "$match": {
                            defender_size: { "$ne": "" }
                        }
                    },
                    {
                        "$group": {
                            "_id": null,
                            "max": { "$max": "$defender_size" },
                            "min": { "$min": "$defender_size" },
                            "avg": { "$avg": "$defender_size" }
                        }
                    }
                ]),
                battle.distinct("battle_type"),
                battle.aggregate([
                    {
                        "$group": {
                            "_id": { "$toLower": "$attacker_outcome" },
                            "count": { "$sum": 1 }
                        }
                    },
                    {
                        "$group": {
                            "_id": null,
                            "counts": {
                                "$push": {
                                    "k": "$_id",
                                    "v": "$count"
                                }
                            }
                        }
                    },
                    {
                        "$replaceRoot": {
                            "newRoot": { "$arrayToObject": "$counts" }
                        }
                    }
                ]),
                battle.aggregate([
                    { $unwind: '$attacker_king' },
                    { $group: { _id: '$attacker_king', count: { $sum: 1 } } },
                    { $sort: { 'count': -1 } }]),
                battle.aggregate([
                    { $unwind: '$defender_king' },
                    { $group: { _id: '$defender_king', count: { $sum: 1 } } },
                    { $sort: { 'count': -1 } }]),
                battle.aggregate([
                    { $unwind: '$region' },
                    { $group: { _id: '$region', king: { $sum: 1 } } },
                    { $sort: { 'count': -1 } }]),
                battle.aggregate([
                    { $unwind: '$name' },
                    { $group: { _id: '$name', count: { $sum: 1 } } },
                    { $sort: { 'king': -1 } }])
            ]).then(([defender_size, battle_type, attacker_outcome, attacker_king, defender_king, region, name]) => {
                // console.log(group)
                let json = {};
                json.attacker_outcome = attacker_king[0]._id;
                json.defender_king = defender_king[0]._id;
                json.region = region[0]._id;
                json.name = region[0]._id;

                delete defender_size[0].id;
                resolve({
                    defender_size: defender_size[0],
                    battle_type,
                    attacker_outcome: attacker_outcome[0],
                    most_active: json
                })
            })
        })
    }

    getSearchData(obj) {
        return new promise((resolve, reject) => {
            battle.find({
                'location': obj.location ? obj.location : /.*/,
                'battle_type': obj.type ? obj.type : /.*/,
                $or: [{ 'attacker_king': obj.king }, { 'defender_king': obj.king }]
            },(err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            })
        });
    }
}