gulp = require 'gulp'
gutil = require 'gulp-util'
del = require 'del'
coffee = require 'gulp-coffee'
webserver = require 'gulp-webserver'
source = require 'vinyl-source-stream'
buffer = require 'vinyl-buffer'
watchify = require 'watchify'
browserify = require 'browserify'

htmlFilesMask = './src/**/*.html'
libs = [
	'promise-polyfill'
	'react-tools'
	'React'
]

browserifyOpts =
	entries: ['./src/index.coffee'],
	transform: ['coffee-reactify']
	debug: true

b =
	browserify browserifyOpts
	.external libs
b = watchify b

compileCode = ->
	b.bundle()
	.on 'error', gutil.log.bind(gutil, 'Browserify Error')
	.pipe source('index.js')
	.pipe buffer()
	.pipe gulp.dest('./build')

b.on 'update', compileCode
b.on 'log', gutil.log

gulp.task 'libs', ['cleanBuildDir'], ->
	browserify {}
	.require libs
	.bundle()
	.pipe source('libs.js')
	.pipe gulp.dest('./build')

gulp.task 'compileCode', ['cleanBuildDir'], compileCode

gulp.task 'html', ['cleanBuildDir'], ->
	gulp.src htmlFilesMask
		.pipe gulp.dest './build'

gulp.task 'cleanBuildDir', (cb)->
	del ['./build/**/*.*'], cb

gulp.task 'build', ['compileCode', 'html', 'libs']

gulp.task 'webserver', ['build'], ->
	gulp.src 'build'
		.pipe webserver
			livereload: true,
			open: true
			root: './build'

gulp.task 'default', ['build', 'webserver'], ->
	gulp.watch htmlFilesMask, ['html']
