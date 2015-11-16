/**
 * Copyright (c) 2015 Acrolinx GmbH. All rights reserved.
 *
 * Created by robert on November 16, 2015.
 */

var config = {
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
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server', 'Starts the server and watches for changes', [
    'nodemon'
  ]);

  grunt.initConfig(config)
};
