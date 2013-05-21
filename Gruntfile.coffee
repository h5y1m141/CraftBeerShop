module.exports = (grunt)->
  coffees = [
    'coffee/main.coffee'
  ]
 
  grunt.initConfig
    # config
    dir    :
      temp   : 'temp'
      js     : 'public/javascripts'
    pkg     : '<json:package.json>'
 
    # tasks
    coffee:
      flatten: 
        options: 
          flatten: false
          bare: true
        files: 
          '<%= dir.temp %>/<%= pkg.name %>.src.js': coffees
    min:
      dist:
        src:[
            '<%= dir.temp %>/<%= pkg.name %>.src.js'
          ]
        dest: '<%= dir.temp %>/<%= pkg.name %>.min.js'
        separator: ';'
    compress:
      gzip:
        files: 
          '<%= dir.temp %>/<%= pkg.name %>.min.gzip':'<%= dir.temp %>/<%= pkg.name %>.min.js'
    copy:
      dist:
        src:
          '<%= dir.temp %>/<%= pkg.name %>.min.gzip'
        dest:
          '<%= dir.js %>/<%= pkg.name %>.min.js'
 
  grunt.loadNpmTasks 'grunt-contrib'
  grunt.loadNpmTasks 'grunt-s3'
  grunt.registerTask 'default', 'coffee min compress copy'