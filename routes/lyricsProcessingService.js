var path = require('path');
var fs = require('fs');
var stopwords = require('./stopwords');

function readBrands() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "../public/brands.json")));
}

/* Reads all lyric files and parses them */
function readFiles() {
  var brandData = readBrands();
  //Read in all files names under this directory. TODO do this with another level of nested dirs for each album
	var fileNames = fs.readdirSync(path.join(__dirname, "../public/lyrics/kanye/college_dropout")).filter(function(fileName) {
    return fileName.charAt(0) !== "."
  });
	
  var lyricsData = fileNames.map(function(fileName) {
		var content = fs.readFileSync(path.join(__dirname, "../public/lyrics/kanye/college_dropout/" + fileName));
    jsonContent = JSON.parse(content);
    return processLyricalContent(jsonContent, brandData);
	});
  return lyricsData;
}

function processLyricalContent(jsonContent, brandData) {
  //TODO separate between brand counts vs all inclusive word counts
  introCounts = {};
  verseCounts = {};
  chorusCounts = {};
  bridgeCounts = {};
  outroCounts = {};
  totalCounts = {};
  brandTotalCounts = {};
  //init brandTotalCounts
  for (var i = 0; i < brandData.length; i++) {
    var brand = brandData[i];
    brandTotalCounts[brand.id] = 0;
  }
  
  processFieldForWordCount(jsonContent, "intro", [introCounts, totalCounts], brandData, brandTotalCounts);
  for (var i = 1; i < 10; i++) {
    processFieldForWordCount(jsonContent, "verse" + i, [verseCounts, totalCounts], brandData, brandTotalCounts);
  }
  for (var i = 1; i < 10; i++) {
    processFieldForWordCount(jsonContent, "chorus" + i, [chorusCounts, totalCounts], brandData, brandTotalCounts);
  }
  processFieldForWordCount(jsonContent, "bridge", [bridgeCounts, totalCounts], brandData, brandTotalCounts);
  processFieldForWordCount(jsonContent, "outro", [outroCounts, totalCounts], brandData, brandTotalCounts);

  return {
    songTitle: jsonContent.songTitle,
    //totalCounts: totalCounts,
    //introCounts: introCounts,
    //verseCounts: verseCounts,
    //chorusCounts: chorusCounts,
    //bridgeCounts: bridgeCounts,
    //outroCounts: outroCounts
    brandTotalCounts: brandTotalCounts
  };
}

function processFieldForWordCount(jsonContent, fieldName, countObjects, brandData, brandTotalCounts) {
  lyrics = jsonContent[fieldName];
  if (lyrics === undefined || lyrics === null) {
    return; //no lyrics to parse
  }
  var lyricsWithoutPhraseBreaks = lyrics.replace(/\//g, " ");
  var lyricsWithoutSpecialCharsAndDoubleSpaces = lyricsWithoutPhraseBreaks
                                                  .replace(/[.,\/#!?$%\^&\*;:{}=\_`~()"]/g, " ")
                                                  .replace(/[']/g, "")
                                                  .replace(/\s{2,}/g," ");
  /* Should check for brand counts HERE, before spaces are removed.
  */
  processLyricForBrandCount(lyricsWithoutSpecialCharsAndDoubleSpaces, brandData, brandTotalCounts);
  processLyricForTotalCounts(lyricsWithoutSpecialCharsAndDoubleSpaces, countObjects);
}

function processLyricForTotalCounts(lyrics, countObjects) {
  var words = lyrics.split(" ");
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if (stopwords.words.indexOf(word.toLowerCase()) !== -1) {
      continue;
    }
    for (var j = 0; j < countObjects.length; j++) {
      var countObject = countObjects[j];
      var index = word.toLowerCase();
      countObject[index] = 
        (countObject[index] === undefined || countObject[index] === null ? 1 : countObject[index] + 1);
      //to get an accurate count for brand count, we should not double count ones found under ones with spaces.
    }
  }
}

function processLyricForBrandCount(lyrics, brandData, brandTotalCounts) {
  for (var i = 0; i < brandData.length; i++) {
    var brand = brandData[i];
    var brandSearchTerms = [brand.canonicalBrandName].concat(brand.brandSynonyms);
    //Process brand search terms with SPACES first.
    var brandSearchTermsWithoutSpaces = [];
    for (var j = 0; j < brandSearchTerms.length; j++) {
      var brandSearchTerm = brandSearchTerms[j];
      if (brandSearchTerm.indexOf(" ") === -1) {
        brandSearchTermsWithoutSpaces.push(brandSearchTerm);
        continue;
      }
      var brandSearchTermRegex = new RegExp(" " + brandSearchTerm.replace(/[']/g, "") + " ", "ig");
      var matchResult = lyrics.match(brandSearchTermRegex);
      if (matchResult) {
        //console.log("more than one match result!");
        brandTotalCounts[brand.id] += matchResult.length;
        lyrics = lyrics.replace(brandSearchTermRegex, " ");
      }
    }

    //Process brand search terms without spaces.
    var words = lyrics.split(" ");
    for (var j = 0; j < words.length; j++) {
      var word = words[j];
      //words are not double counted, since lyrics have the phrases removed in previous pass
      for (var k = 0; k < brandSearchTermsWithoutSpaces.length; k++) {
        var brandSearchTermWithoutSpaces = brandSearchTermsWithoutSpaces[k];
        if (brandSearchTermWithoutSpaces.toLowerCase().replace(/[']/g, "") === word.toLowerCase().replace(/[']/g, "")) {
            brandTotalCounts[brand.id] += 1;
        }
      }
    }
  }
}

function printCounts(countObject) {
  for (var word in countObject) {
    if (countObject.hasOwnProperty(word)) {
        console.log(word + " : " + countObject[word]);
    }
  }
}

module.exports = {
  readFiles: readFiles,
  readBrands: readBrands,
  printCounts: printCounts,
};
