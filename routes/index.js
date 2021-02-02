var express = require('express');
var router = express.Router();
var cron = require('node-cron');
var request = require('request');
var util = require('./util');

const XRP = 'xrp';
const ETH = 'eth';

router.all('/', (req, res) => {
  res.send('Slack API');
})

router.all('/:crypto/now', function (req, res) {
  const coin = req.params.crypto;
  request.get(`https://www.bitstamp.net/api/v2/ticker/${coin}usd/`, (_, res, usd) => 
    request.get(`https://www.bitstamp.net/api/v2/ticker/${coin}gbp/`, (_, resp, gbp) =>
      util.priceCheck(JSON.parse(gbp).last, JSON.parse(usd).last, coin)))
})

cron.schedule('*/5 * * * *', () => 
  request.get(`https://www.bitstamp.net/api/v2/ticker/${XRP}usd/`, (_, res, usd) => 
    request.get(`https://www.bitstamp.net/api/v2/ticker/${XRP}gbp/`, (_, resp, gbp) =>
      util.priceCheck(JSON.parse(gbp).last, JSON.parse(usd).last, XRP)))
);

cron.schedule('*/5 * * * *', () => 
  request.get(`https://www.bitstamp.net/api/v2/ticker/${ETH}usd/`, (_, res, usd) => 
    request.get(`https://www.bitstamp.net/api/v2/ticker/${ETH}gbp/`, (_, resp, gbp) =>
      util.priceCheck(JSON.parse(gbp).last, JSON.parse(usd).last, ETH)))
);

module.exports = router;
