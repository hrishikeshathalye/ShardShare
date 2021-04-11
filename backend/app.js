var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const mongoose = require('mongoose');

// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.js');
var secretRouter = require('./routes/secret.js');
var requestRouter = require('./routes/recoveryRequest.js');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/secret', secretRouter);
app.use('/request', requestRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

const mongoURL = "mongodb://ShardShareUser:seproject123@shardshare-shard-00-00.1a5qt.mongodb.net:27017,shardshare-shard-00-01.1a5qt.mongodb.net:27017,shardshare-shard-00-02.1a5qt.mongodb.net:27017/ShardShare?ssl=true&replicaSet=atlas-vfiwm5-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(mongoURL, {useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
  console.log("Succesfully Connected To Database...");
}).catch((err)=>{
  console.log(err);
});

module.exports = app;
