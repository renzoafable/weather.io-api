const express = require('express');
const router = express.Router();

const { getHelpData } = require('../controllers/helpController');

router.get('/', getHelpData);

module.exports = router;
