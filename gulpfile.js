var gulp = require('gulp');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var minifyCss = require('gulp-csso');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker'); //Pack same CSS media query rules into one using PostCSS
var browserSync = require('browser-sync');
var run = require('run-sequence');


// инициализация browserSync
gulp.task('browserSync', function () {
	browserSync({
		server: "."
	})
});


// последовательный запуск
gulp.task('build', function (fn) {
	run('style', 'browserSync', fn);
});


//сборка style
gulp.task('style', function () {
	return gulp.src('./sass/**/*.scss')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([
			autoprefixer({
				browsers: [
				"last 1 version",
				"last 2 Chrome versions",
				"last 2 Firefox versions",
				"last 2 Opera versions",
				"last 2 Edge versions"
			]
			}),
			mqpacker({
				sort: true
			})
		]))
		.pipe(gulp.dest('./css'))
		.pipe(rename("style.min.css"))
		.pipe(minifyCss()) //Минификация css
		.pipe(gulp.dest('./css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});


//Отслеживание
gulp.task('watch', ['build'], function () {
	gulp.watch('sass/**/*.scss', ['style']);
	gulp.watch("*.html").on('change', browserSync.reload);
	gulp.watch('js/**/*.js', browserSync.reload);
});


gulp.task('default', ['watch']);
