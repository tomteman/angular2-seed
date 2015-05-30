'use strict';

var gulp = require('gulp'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    traceur = require('gulp-traceur');


var connect = require('gulp-connect'),
    open = require('gulp-open'),
    port = 3456;

var PATHS = {
    src: {
        js: 'src/**/*.js',
        html: 'src/**/*.html'
    },
    lib: [
        'node_modules/gulp-traceur/node_modules/traceur/bin/traceur-runtime.js',
        'node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.src.js',
        'node_modules/systemjs/lib/extension-register.js',
        'node_modules/angular2/node_modules/zone.js/dist/zone.js',
        'node_modules/angular2/node_modules/zone.js/dist/long-stack-trace-zone.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/reflect-metadata/Reflect.js.map',
        'node_modules/firebase/lib/firebase-web.js'

    ],
    angularfire: {
        js: 'node_modules/angularfire/dist/angularfire.js'
    }
};


gulp.task('watch', function() {
    gulp.watch(PATHS.src.js, ['js']);
    gulp.watch(PATHS.src.html, ['html']);
});

gulp.task('js', function() {
    return gulp.src(PATHS.src.js)
        .pipe(rename({
            extname: ''
        })) //hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
        .pipe(plumber())
        .pipe(traceur({
            modules: 'instantiate',
            moduleName: true,
            annotations: true,
            types: true,
            memberVariables: true
        }))
        .pipe(rename({
            extname: '.js'
        })) //hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
        .pipe(gulp.dest('dist'));
});

gulp.task('angularfire', function() {
    return gulp.src(PATHS.angularfire.js)
        .pipe(rename({
            extname: ''
        })) //hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
        .pipe(plumber())
        .pipe(traceur({
            modules: 'instantiate',
            moduleName: true,
            annotations: true,
            types: true,
            memberVariables: true
        }))
        .pipe(rename({
            extname: '.js'
        })) //hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
        .pipe(gulp.dest('dist'));
});

gulp.task('html', function() {
    return gulp.src(PATHS.src.html)
        .pipe(gulp.dest('dist'));
});

gulp.task('angular2', function() {

    var buildConfig = {
        paths: {
            "angular2/*": "node_modules/angular2/es6/prod/*.es6",
            "rx": "node_modules/angular2/node_modules/rx/dist/rx.js"
        },
        meta: {
            // auto-detection fails to detect properly here - https://github.com/systemjs/builder/issues/123
            'rx': {
                format: 'cjs'
            }
        }
    };

    var Builder = require('systemjs-builder');
    var builder = new Builder(buildConfig);

    return builder.build('angular2/angular2', 'dist/lib/angular2.js', {});
});

gulp.task('libs', ['angular2'], function() {
    var size = require('gulp-size');
    return gulp.src(PATHS.lib)
        .pipe(size({
            showFiles: true,
            gzip: true
        }))
        .pipe(gulp.dest('dist/lib'));
});



gulp.task('connect', function() {
    connect.server({
        root: __dirname + '/dist',
        port: port,
        livereload: true
    });
});

gulp.task('open', function() {
    var options = {
        url: 'http://localhost:' + port,
    };
    gulp.src('./index.html')
        .pipe(open('', options));
});
gulp.task('clean', function(done) {
    del(['dist'], done);
});
gulp.task('build', function(callback) {
    runSequence('clean', ['js', 'angularfire', 'html','libs'], callback);
});

gulp.task('default', ['build']);
gulp.task('serve', ['connect', 'open']);

