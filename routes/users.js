var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(readFiles());
});

/* Reads all lyric files and parses them */
function readFiles(dirname, onFileContent, onError) {
  //Read in all files names under this directory. TODO do this with another level of nested dirs for each album
	var fileNames = fs.readdirSync(path.join(__dirname, "../public/lyrics/kanye/college_dropout")).filter(function(fileName) {
    return fileName.charAt(0) !== "."
  });
	
  var lyricsData = fileNames.map(function(fileName) {
		var content = fs.readFileSync(path.join(__dirname, "../public/lyrics/kanye/college_dropout/" + fileName));
    jsonContent = JSON.parse(content);
    console.log("Json Content: " + jsonContent);
    return processLyricalContent(jsonContent);
	});
  return lyricsData;
}

function processLyricalContent(jsonContent) {
  introCounts = {};
  verseCounts = {};
  chorusCounts = {};
  bridgeCounts = {};
  outroCounts = {};
  totalCounts = {};
  
  processFieldForWordCount(jsonContent, "intro", [introCounts, totalCounts]);
  for (var i = 1; i < 10; i++) {
    processFieldForWordCount(jsonContent, "verse" + i, [verseCounts, totalCounts]);
  }
  for (var i = 1; i < 10; i++) {
    processFieldForWordCount(jsonContent, "chorus" + i, [chorusCounts, totalCounts]);
  }
  processFieldForWordCount(jsonContent, "bridge", [bridgeCounts, totalCounts]);
  processFieldForWordCount(jsonContent, "outro", [outroCounts, totalCounts]);

  return {
    songTitle: jsonContent.songTitle,
    totalCounts: totalCounts,
    introCounts: introCounts,
    verseCounts: verseCounts,
    chorusCounts: chorusCounts,
    bridgeCounts: bridgeCounts,
    outroCounts: outroCounts
  };
}

function processFieldForWordCount(jsonContent, fieldName, countObjects) {
  lyrics = jsonContent[fieldName];
  if (lyrics === undefined || lyrics === null) {
    return; //no lyrics to parse
  }
  var lyricsWithoutPhraseBreaks = lyrics.replace("/", " ");
  var lyricsWithoutSpecialCharsAndDoubleSpaces = lyricsWithoutPhraseBreaks
                                                  .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"]/g, "")
                                                  .replace(/\s{2,}/g," ");
  var words = lyricsWithoutSpecialCharsAndDoubleSpaces.split(" ");
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    for (var j = 0; j < countObjects.length; j++) {
      var countObject = countObjects[j];
      countObject[word] = (countObject[word] === undefined || countObject[word] === null ? 1 : countObject[word] + 1);
    }
  }
  return countObject;
}

function printCounts(countObject) {
  for (var word in countObject) {
    if (countObject.hasOwnProperty(word)) {
        console.log(word + " : " + countObject[word]);
    }
  }
}

module.exports = router;
