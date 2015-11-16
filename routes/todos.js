/**
 * Copyright (c) 2015 Acrolinx GmbH.
 * All rights reserved.
 *
 * Created by robert on November 16, 2015.
 */ 

var router = require('express').Router();

var config = require('config').rethinkdb;
var r = require('rethinkdbdash')(config);

router.use(function (req, res, next) {
  res.append('access-control-allow-origin', '*');
  res.append('access-control-allow-headers', 'Content-Type');

  next();
});

router.get('/', function (req, res) {
  return r.table('todos').run().then(function (todos) {
    res.json(todos);
  }).error(function (err) {
    console.error('Error reading TODOs from database at', config, ':', err);
    res.status(500).send();
  })
});

router.post('/', function (req, res) {
  console.log('Client wants to create TODO', JSON.stringify(req.body));
  return r.table('todos').insert(req.body).run().then(function (createdTodo) {
    return r.table('todos').get(createdTodo.generated_keys[0]).run()
  }).then(function (returnedTodo) {
    console.log('Server created todo', returnedTodo);
    res.status(201).json(returnedTodo);
  }).error(function (err) {
    console.error('Error creating TODO', JSON.stringify(req.body), err);
    res.status(500).send();
  });
});

module.exports = router;
