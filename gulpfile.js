'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var requirejs = require('requirejs');
var watch = require('gulp-watch');
var batch = require('gulp-batch');

const libs = [
    "node_modules/underscore/underscore.js",
    "node_modules/react/dist/react-with-addons.js",
    "node_modules/react-dom/dist/react-dom.js",
    "node_modules/requirejs/require.js",
    "node_modules/redux/dist/redux.min.js",
    "node_modules/react-redux/dist/react-redux.min.js"
];

const requireConfig = {
    baseUrl: 'public/javascripts/out',
    paths: {
        "underscore": "../libs/underscore",
        "react": "../libs/react-with-addons",
        "react-dom": "../libs/react-dom",
        "react-redux": "../libs/react-redux.min",
        "redux": "../libs/redux.min"
    },
    shim: {
        'underscore': {
            'exports': '_'
        },
        'react': {
            exports: 'React'
        }
    },
    optimize: 'uglify',
    name: 'main',
    out: 'public/javascripts/dist/main.js'
};

gulp.task('libs', function(){
    return gulp.src(libs)
        .pipe(gulp.dest("public/javascripts/libs"));
});


gulp.task('jsx', ['libs'], function(){
    return gulp.src("public/javascripts/src/**/*.jsx")
        .pipe(sourcemaps.init())
        .pipe(babel({
            sourceMaps: true,
            plugins: ['transform-es2015-modules-amd'],
            presets: ['react']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("public/javascripts/out"))
});

gulp.task('out', ['jsx'], function(){
    return gulp.src("public/javascripts/src/**/*.js")
        .pipe(concat('main.js'))
        .pipe(gulp.dest("public/javascripts/out"))
});

gulp.task('requirejs', ['out'], function (taskReady) {
    requirejs.optimize(requireConfig, function () {
        taskReady();
    }, function (error) {
        console.error('requirejs task failed', JSON.stringify(error));
        process.exit(1);
    });
});

gulp.task('dist', ['requirejs']);

gulp.task('sass', function () {
    gulp.src('public/stylesheets/src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concatCss('style.css'))
        .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('watch', ['default'], function () {
    watch('public/javascripts/src/**/*.jsx', batch(function (events, done) {
        gulp.start('dist', done);
    }));
    watch('public/stylesheets/src/**/*.scss', batch(function (events, done) {
        gulp.start('sass', done);
    }));
});


gulp.task('default', ['sass', 'dist']);