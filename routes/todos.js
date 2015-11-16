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
  res.append('access-control-allow-methods', 'GET,POST,DELETE');

  next();
});

var Joi = require('joi');

var todoSchema = Joi.object().keys({
  title: Joi.string().required(),
  order: Joi.number().positive(),
  completed: Joi.boolean().default(false)
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

  var result = Joi.validate(req.body, todoSchema);
  if (result.error) {
    res.status(422).json(result.error);
    return;
  }

  return r.table('todos').insert(result.value).run().then(function (createdTodo) {
    return r.table('todos').get(createdTodo.generated_keys[0]).run()
  }).then(function (returnedTodo) {
    console.log('Server created todo', returnedTodo);
    returnedTodo.url = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.status(201).json(returnedTodo);
  }).error(function (err) {
    console.error('Error creating TODO', JSON.stringify(req.body), err);
    res.status(500).send();
  });
});

router['delete']('/', function (req, res) {
  console.log('Client tries to delete TODO with ID', req.params.id);

  return r.table('todos').delete().then(function () {
    res.status(204).send();
  }).error(function (err) {
    console.err('Error deleting TODO item', req.params.id, err);
    res.status(500).send();
  });
});

module.exports = router;
