var express = require('express');
var path = require('path');
var fs = require('fs');
var lyricsProcessingService = require('./lyricsProcessingService');
var d3 = require("d3");
var jsdom = require("jsdom");
var router = express.Router();

/* GET the post processed lyrics data. */
router.get('/', function(req, res, next) {
  res.send(lyricsProcessingService.readFiles());
});

module.exports = router;
