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
  res.append('access-control-allow-methods', 'GET,POST,DELETE,PATCH');

  next();
});

var Joi = require('joi');

var todoSchema = Joi.object().keys({
  title: Joi.string().required(),
  order: Joi.number().positive(),
  completed: Joi.boolean().default(false)
});

function createUrl(todo, req) {
  return req.protocol + '://' + req.get('host') + req.originalUrl + '/' + todo.id;
}

router.get('/', function (req, res) {
  return r.table('todos').run().then(function (todos) {

    res.json(todos.map(function (todo) {
      todo.url = createUrl(todo, req);
      return todo;
    }));
  }).error(function (err) {
    console.error('Error reading TODOs from database at', config, ':', err);
    res.status(500).send();
  })
});

router.get('/:id', function (req, res) {
  return r.table('todos').get(req.params.id).run().then(function (todo) {
    todo.url = createUrl(todo, req);
    res.json(todo);
  }).error(function (err) {
    console.error('Error finding TODO with ID', req.params.id, err);
    res.status(500).send();
  });
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
    returnedTodo.url = createUrl(returnedTodo, req);
    console.log('Server created todo', returnedTodo);
    res.status(201).json(returnedTodo);
  }).error(function (err) {
    console.error('Error creating TODO', JSON.stringify(req.body), err);
    res.status(500).send();
  });
});

router.patch('/:id', function (req, res) {
  return r.table('todos')
    .get(req.params.id)
    .update(req.body, { returnChanges: true })
    .run()
    .then(function (result) {
      var updatedTodo = result.changes[0].new_val;
      console.log('Updated TODO',req.params.id, updatedTodo);
      updatedTodo.url = createUrl(updatedTodo, req);
      res.json(updatedTodo);
    });
});

router['delete']('/', function (req, res) {
  return r.table('todos').delete().then(function () {
    res.status(204).send();
  }).error(function (err) {
    console.err('Error deleting TODO item', req.params.id, err);
    res.status(500).send();
  });
});

module.exports = router;
