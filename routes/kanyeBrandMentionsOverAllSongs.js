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

  //aggregate the brandTotalCount children
  var brandTotalCountsAllSongs = [];
  for (var i = 0; i < lyricsData.length; i++) {
    var songData = lyricsData[i];
    // DON'T make subchildren of root by song.
    for (var word in songData.brandTotalCounts) {
      if (songData.brandTotalCounts.hasOwnProperty(word)) {
        brandTotalCountsAllSongs[word] = (brandTotalCountsAllSongs[word] ? 
          brandTotalCountsAllSongs[word] + songData.brandTotalCounts[word] : 
          songData.brandTotalCounts[word]);
      }
    }
  }

  //parse through brand counts over all songs, attach to root.
  for (var word in brandTotalCountsAllSongs) {
    if (brandTotalCountsAllSongs.hasOwnProperty(word)) {
      var size = produceSizeForBrandWordsBySong(brandTotalCountsAllSongs[word]);
      if (size !== 0) {
        root.children.push({
          "name": word,
          "size": size
        });
      }
    }
  }
  return root;
}

//copy pasta function that may vary depending on aesthetics.
function produceSizeForBrandWordsBySong(count) {
  return count;
}

module.exports = router;
