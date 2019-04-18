var config = {
    DEST_DIR: 'dist',
    scssPattern: 'scss/**/*.scss'
};

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    template = require('gulp-template-compile'),
    bourbon = require('node-bourbon'),
    gulpImport = require('gulp-html-import');


gulp.task('sync', function () {
    browserSync({
        server: {
            baseDir: config.DEST_DIR
        },
        notify: false
    });
});

gulp.task('compile_scss', function () {
    return gulp.src(
        ['src/scss/**/*.scss',
        'node_modules/bootstrap/scss/bootstrap.scss',
        '!src/scss/**/module.scss'])
        .pipe(sass({
            includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('min_js', function () {
    return gulp.src([
        'src/js/vendor/jquery-3.3.1.min.js',
        'src/js/*.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('compile_html', function () {
    gulp.src('./src/*.html')
        .pipe(gulpImport('./src/views/'))
        .pipe(gulp.dest('dist'));
});

gulp.task('min_image', function () {
    return gulp.src('src/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build_template', function () {
    gulp.src('src/views/templates/*.html')
        .pipe(template())
        .pipe(concat('tpl.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('assets', function () {
    return gulp.src('src/assets/**/*')
        .pipe(gulp.dest('dist/assets'))
});

gulp.task('remove_dist', function () {
    return del.sync('dist');
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('watch', ['sync', 'remove_dist', 'compile_scss', 'build_template', 'min_js', 'compile_html', 'assets'], function () {
    gulp.watch('src/scss/**/*.scss', ['compile_scss', browserSync.reload]);
    gulp.watch('src/**/*.html', ['compile_html', browserSync.reload]);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/views/templates/*.html', ['build_template', browserSync.reload]);
    gulp.watch(['src/js/**/*.js', 'src/js/*.js'], ['min_js', browserSync.reload]);
});

gulp.task('build', ['clear', 'remove_dist', 'min_image', 'compile_scss', 'build_template', 'min_js', 'compile_html', 'assets']);
gulp.task('default', ['watch']);
