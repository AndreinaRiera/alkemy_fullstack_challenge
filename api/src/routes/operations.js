const router = require('express').Router();
const controller = require('../controllers/operations/');

router.post('/create', controller.create);
router.get('/list', controller.list);
router.put('/update/:id', controller.update);
router.delete('/delete/:id', controller.delete);

module.exports = router;