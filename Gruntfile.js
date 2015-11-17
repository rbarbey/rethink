/**
 * Copyright (c) 2015 Acrolinx GmbH. All rights reserved.
 *
 * Created by robert on November 16, 2015.
 */

'use strict';

var config = {
  jshint: {
    options: {
      jshintrc: true
    },
    all: ['*.js', 'routes/*.js']
  },

  nodemon: {
    dev: {
      script: 'server.js',
      options: {
        ignore: ['node_modules/**']
      }
    }
  }
};

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server', 'Starts the server and watches for changes', [
    'jshint',
    'nodemon'
  ]);

  grunt.initConfig(config);
};
