let express = require('express');
let router = express.Router();
let downloadsController = require('../controllers/downloads');


router.post('/', downloadsController.download);

module.exports = router;
