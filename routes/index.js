var express = require('express');
var router = express.Router();

const indexRouter = require('./indexRouter');
const aboutRouter = require('./aboutRouter');
const helpRouter = require('./helpRouter');
const weatherRouter = require('./weatherRouter');
const forecastRouter = require('./forecastRouter');

router.use('/', indexRouter);
router.use('/about', aboutRouter);
router.use('/help', helpRouter);
router.use('/weather', weatherRouter);
router.use('/forecast', forecastRouter);

module.exports = router;
