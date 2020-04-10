var express = require('express');
var router = express.Router();

const indexRouter = require('./indexRouter');
const weatherRouter = require('./weatherRouter');
const forecastRouter = require('./forecastRouter');

router.use('/', indexRouter);
router.use('/weather', weatherRouter);
router.use('/forecast', forecastRouter);

module.exports = router;
