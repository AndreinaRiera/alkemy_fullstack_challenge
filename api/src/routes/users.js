const router = require('express').Router();
const controller = require('../controllers/users/');

router.get('/get/:uid', controller.get);
router.post('/create', controller.create);

module.exports = router;