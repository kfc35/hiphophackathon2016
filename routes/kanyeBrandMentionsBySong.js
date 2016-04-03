var express = require('express');
var path = require('path');
var fs = require('fs');
var lyricsProcessingService = require('./lyricsProcessingService');
var d3service = require('./d3service');
var router = express.Router();

/* GET the post processed lyrics data. */
router.get('/', function(req, res, next) {
  d3 = req.app.d3;
  document = req.app.jsdom.env('', function(error, window) {
    var svg = d3service.produceGraph(transformLyricDataForD3(), window);
    res.send(svg.node().outerHTML);
  });
});

function transformLyricDataForD3() {
  var lyricsData = lyricsProcessingService.readFiles();
  var root = {
    "name": "CollegeDropout",
    "children": [
    ]
  };

  /* Make subchildren by song*/
  for (var i = 0; i < lyricsData.length; i++) {
    var songData = lyricsData[i];
    var songChild = {
      "name": songData.songTitle,
      "children": [
      ]
    }
    //For each song, calculate brand mentions, attach under song child
    for (var word in songData.brandTotalCounts) {
      if (songData.brandTotalCounts.hasOwnProperty(word)) {
        var size = produceSizeForBrandWordsBySong(songData.brandTotalCounts[word]);
        if (size !== 0) {
          songChild.children.push({
            "name": word,
            "size": size
          });
        }
      }
    }
    root.children.push(songChild);
  }
  return root;
}

function produceSizeForBrandWordsBySong(count) {
  if (count <= 0) {
    return 0;
  } else {
    return Math.pow(5, count - 1);
  }
}

module.exports = router;
