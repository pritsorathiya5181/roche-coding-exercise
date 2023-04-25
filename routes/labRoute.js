const express = require('express');
const labController = require('../controllers/labController');

const router = express();

router.get('/', labController.fetchAllData);

router.post('/upload', labController.uploadData);

module.exports = router;