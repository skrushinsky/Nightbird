const express = require('express');
const router = express.Router();
const path = require('path');
const API_KEY = process.env.API_KEY;

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { api_key: API_KEY });
});

router.get('*', (req, res) => {
  res.render('index', { api_key: API_KEY });
})

module.exports = router;
