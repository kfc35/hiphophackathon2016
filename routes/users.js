var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(readFiles());
});

function readFiles(dirname, onFileContent, onError) {
	var fileNames = fs.readdirSync(path.join(__dirname, "../public/lyrics/kanye/college_dropout"));
  var jsonContent;
	fileNames.forEach(function(fileName) {
    if (fileName === ".DS_Store") {
      return ;
    }
    console.log(fileName);
		var content = fs.readFileSync(path.join(__dirname, "../public/lyrics/kanye/college_dropout/" + fileName));
    jsonContent = JSON.parse(content);
	});
  return jsonContent;
}

module.exports = router;
