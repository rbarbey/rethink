/**
 * Copyright (c) 2015 Acrolinx GmbH.
 * All rights reserved.
 *
 * Created by robert on November 16, 2015.
 */ 
 
'use strict';

var app = require('./index');
var http = require('http');

var server = http.createServer(app);

server.listen(8000);

server.on('listening', function () {
  console.log('Server listening on port %d', this.address().port);
});
