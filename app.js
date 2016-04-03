var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var lyricsData = require('./routes/lyricsData');
var kanyeBrandMentionsBySong = require('./routes/kanyeBrandMentionsBySong');
var kanyeBrandMentionsOverAllSongs = require('./routes/kanyeBrandMentionsOverAllSongs');
var kanyeBrandCategoriesBySong = require('./routes/kanyeBrandCategoriesBySong');
var kanyeBrandCategoriesOverAllSongs = require('./routes/kanyeBrandCategoriesOverAllSongs');

var app = express();
app.d3 = require('d3');
app.jsdom = require('jsdom');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/lyricsData', lyricsData);
app.use('/kanyeBrandsbySong', kanyeBrandMentionsBySong);
app.use('/kanyeBrandsOverAllSongs', kanyeBrandMentionsOverAllSongs);
app.use('/kanyeCategoriesBySong', kanyeBrandCategoriesBySong);
app.use('/kanyeBrandCategoriesOverAllSongs', kanyeBrandCategoriesOverAllSongs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
