var config = require('./package.json');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');

gulp.task('default', function () {
	gulp.src('./index.js')
		.pipe(browserify({ debug: true }))
		.pipe(uglify())
		.pipe(rename(config.name + '.js'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('watch', function(){
	gulp.watch('src/js/*.js', ['default']);
});

