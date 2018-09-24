const router = require('express').Router();
const battleDal = require('../DAL/movie');
let battle = new battleDal();

router.get('/', (req, res) => {
    res.json({ "hello": "world" });
})

router.get('/getActor', (req, res) => {
    battle.getActor().then(data => {
        console.log(data)
        res.json({
            actor: data[0]._id,
            success: true
        });
    }).catch(err => {
        console.log(err)
        res.json({
            success: false,
            error: err
        })
    })
});

router.get('/revenue', (req, res) => {
    battle.getRevenue().then(data => {
        console.log(data)
        res.json({
            totalRevenue: data[0].count,
            success: true
        });
    }).catch(err => {
        console.log(err)
        res.json({
            success: false,
            error: err
        });
    });
});

module.exports = router;