const express = require('express');
const router = express.Router();

const { getAboutData } = require('../controllers/aboutController');

router.get('/', getAboutData);

module.exports = router;
