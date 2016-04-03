var express = require('express');
var path = require('path');
var fs = require('fs');
var lyricsProcessingService = require('./lyricsProcessingService');
var router = express.Router();

/* GET the post processed lyrics data. */
router.get('/', function(req, res, next) {
  res.send(lyricsProcessingService.readFiles());
});

module.exports = router;
