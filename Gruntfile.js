module.exports = function(grunt) {
    // 配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },            
            dist: {
                src: ['src/Util.js', 'src/Emiter.js', 'src/AOP.js', 'src/DataManager.js', 'src/Data.js', 'src/WatchData.js', 'src/Bind.js', 'src/ExpParser.js', ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {          
            options: {
                sourceMap: true,
                sourceMapName: 'dist/<%= pkg.name %>.min.map',                
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        jshint: {       
            beforeconcat: ['src/*.js'],
            afterconcat: ['dist/*.js']
        },
        watch: {
          scripts: {
            files: ['src/*.js'],
            tasks: ['concat', 'uglify'],
            // tasks: ['concat', 'uglify', 'jshint'],
            options: {
              // spawn: false,
            },
          },
          livereload: {
            options: {
              livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
            },
            // tasks: ['concat', 'uglify'],
            files: [  //下面文件的改变就会实时预览
              '../index.html',
              'sdemo/*.html',
              'sdemo/*.js',
              'sdemo/*.css',
              'dist/*.js'
            ]
          }
        },
        connect: {
          options: {
            port: 9000,
            hostname: 'localhost', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
            livereload: 35729  //声明给 watch 监听的端口
          },
          server: {
            options: {
              open: true, //自动打开网页 http://
              base: [
                '../'  //主目录
              ]
            }
          }
        }        
    });
    // 载入concat和uglify插件，分别对于合并和压缩
    // grunt.loadNpmTasks('grunt-contrib-concat');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    require('load-grunt-tasks')(grunt); //加载所有的任务
    // 注册任务
    grunt.registerTask('uglifyTask', ['concat', 'uglify']);
    grunt.registerTask('jshintTask', ['jshint']);
    grunt.registerTask('watchTask', ['watch']);
    grunt.registerTask('default', ['connect:server', 'watch']);
};