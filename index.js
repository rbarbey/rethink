/**
 * Copyright (c) 2015 Acrolinx GmbH.
 * All rights reserved.
 *
 * Created by robert on November 11, 2015.
 */ 
 
var express = require('express');
var app = module.exports = express();
var logger = require('morgan');
var bodyParser = require('body-parser');

function serveIndex(req, res) {
  res.sendFile(__dirname + '/public/index.html');
}

app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/', serveIndex);
app.use('/todos', require('./routes/todos'));

app.on('start', function () {
  console.log('Application ready to serve requests');
});

