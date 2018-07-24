const router = require('express').Router();
const battleDal = require('./../DAL/battle');
let battle = new battleDal();

router.get('/list', (request, response) => {
    battle.getAllBattlePlaces().then(data => {
        response.json(data);
    }).catch(err => {
        response.json(err);
    })
});


router.get('/count', (request, response) => {
    battle.getTotalNoOfBattle().then(data => {
        response.json(data);
    }).catch(err => {
        response.json(err);
    })
});

router.get('/stats', (request, response) => {
    battle.getStats().then(data => {
        response.json(data);
    }).catch(err => {
        response.json(err);
    });
});

router.get('/search', (request, response) => {
    battle.getSearchData(request.query).then(data => {
        response.json(data);
    }).catch(err => {
        response.json(err);
    })
})

module.exports = router;