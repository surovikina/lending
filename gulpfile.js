var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var browserSync = require('browser-sync').create();
var criticalCss = require('gulp-critical-css');
var webpack = require('webpack-stream');

sass.compiler = require('node-sass');

gulp.task('style', function () {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(criticalCss())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./public'))
        .pipe(browserSync.stream());
});

gulp.task('script', function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(webpack())
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function () {

    browserSync.init({
        server: {
            baseDir: "./"
        },
    });

    gulp.watch('./src/scss/**/*.scss', gulp.series('style'));
    gulp.watch('./src/js/**/*.js', gulp.series('script'));
    gulp.watch('./*.html').on('change', browserSync.reload);
    //gulp.watch('./public/*.html', browserSync.reload);
});

gulp.task('clean', function () {
    return del(['./public']);
});

gulp.task ('criticalCss', gulp.series ('clean','style', function () {
    return gulp.src('./public/main.css')
        .pipe(criticalCss())
        .pipe(gulp.dest('./public'))
        .pipe(browserSync.stream());
}));

gulp.task('build', gulp.series('clean',
    gulp.parallel('style')
));

gulp.task('dev', gulp.series('build', 'watch'));