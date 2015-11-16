/**
 * Copyright (c) 2015 Acrolinx GmbH.
 * All rights reserved.
 *
 * Created by robert on November 11, 2015.
 */ 
 
var express = require('express');

var app = module.exports = express();
var bodyParser = require('body-parser');

app.on('start', function () {
  console.log('Application ready to serve requests');
});

app.use(bodyParser.json());

var todos = require('./routes/todos');

app.use('/todos', todos);


