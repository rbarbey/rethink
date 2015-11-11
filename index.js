/**
 * Copyright (c) 2015 Acrolinx GmbH.
 * All rights reserved.
 *
 * Created by robert on November 11, 2015.
 */ 
 
var r = require('rethinkdb');

var config = {
  host: 'localhost',
  port: 28015,
  table: 'test'
};

r.connect(config)
  .then(function (conn) {
    return r.table('authors').changes().run(conn);
  })
  .then(function (cursor) {
    cursor.each(consol.log);
  });
