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
var io = require('socket.io')(server);
var r = require('rethinkdbdash')();

io.on('connection', function (socket) {
  console.log('Connection established using socket', socket.id);

  r.table('todos').changes().run().then(function (changes) {
    changes.each(function (err, change) {
      socket.broadcast.emit('update', change);
    });
  });

  socket.on('disconnect', function () {
    console.log('Connection closed for socket', this.id);
  });
});

server.listen(8000);

server.on('listening', function () {
  console.log('Server listening on port %d', this.address().port);
});
