'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var pump = require('pump');
var babel = require('gulp-babel');
var imagemin = require('gulp-imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');

//Build all package
// Gulp task to minify all files
gulp.task('build', function() {
    runSequence(
        'styles',
        'scripts',
        'pages',
        'end'
    );
});
//css - min
gulp.task('styles', function() {
    return gulp.src('./css/forum.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css'))
        .pipe(csso())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./css'))
});
//html - min
gulp.task('pages', function() {
    return gulp.src(['./index_src.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./'));
});

//js - min
gulp.task('scripts', function(cb) {
    pump([
            gulp.src('./js/forum.js'),
            babel({
                presets: ['env']
            }),
            uglify(),
            rename({
                suffix: '.min'
            }),
            gulp.dest('./js')
        ],
        cb
    );
});

gulp.task('end', function() {
    console.log('Wyprodukowano paczkę');
})

// Clean output directory
// gulp.task('clean', function(){
//     del(['dist']);
// });

//copy files
// gulp.task('copy', function () {
//     gulp.src('./images/*')
//         .pipe(gulp.dest('./dist/images'));
// });

//Dev
gulp.task('watch', function() {
    gulp.watch(
        ['./css/*.scss', './js/forum.js'], ['sass', 'scripts-dev']);
    // ['./css/*.scss'],['sass'])

});
gulp.task('sass', function() {
    return gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(csso())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css'));
});
gulp.task('scripts-dev', function(cb) {
    pump([
            gulp.src('./js/forum.js'),
            babel({
                presets: ['env']
            }),
            uglify(),
            rename({
                suffix: '.min'
            }),
            gulp.dest('./js')
        ],
        cb
    );
});
gulp.task('min', function() {
    gulp.src('./css/*.css')
        .pipe(csso())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css'));
});
gulp.task('bab', () =>
    gulp.src('./js/*.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest('./dist/js'))
);
gulp.task('optimize', function() {
    return gulp.src('./img2/big/*')
        .pipe(imagemin([
            imagemin.gifsicle(),
            imageminJpegRecompress({
                loops: 4,
                min: 50,
                max: 95,
                quality: 'low'
            }),
            imagemin.optipng(),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('./img2/smal'))
});