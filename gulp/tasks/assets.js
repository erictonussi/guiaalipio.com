'use strict';
const argv = require('yargs').argv;
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const gulp = require('gulp');
const gzip = require('gulp-gzip');
const newer = require('gulp-newer');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const when = require('gulp-if');

// 'gulp scripts' -- creates a index.js file from your JavaScript files and
// creates a Sourcemap for it
// 'gulp scripts --prod' -- creates a index.js file from your JavaScript files,
// minifies, gzips and cache busts it. Does not create a Sourcemap
gulp.task('scripts', () =>
  // NOTE: The order here is important since it's concatenated in order from
  // top to bottom, so you want vendor scripts etc on top
  gulp.src([
    'src/assets/js/jquery.min.js',
    'src/assets/js/jquery.scrolly.min.js',
    'src/assets/js/jquery.scrollex.min.js',
    'src/assets/js/skel.min.js',
    'src/assets/js/util.js',
    'src/assets/js/lightbox.min.js',
    'src/assets/js/jquery.jcarousel.min.js',
    'src/assets/js/main.js',
  ])
    .pipe(newer('.tmp/assets/javascript/index.js', {dest: '.tmp/assets/js', ext: '.js'}))
    .pipe(when(!argv.prod, sourcemaps.init()))
    .pipe(babel({
      // presets: ['es2015']
    }))
    .pipe(concat('index.js'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(when(argv.prod, rename({suffix: '.min'})))
    .pipe(when(argv.prod, when('*.js', uglify({preserveComments: 'some'}))))
    .pipe(when(argv.prod, size({
      showFiles: true
    })))
    .pipe(when(argv.prod, rev()))
    .pipe(when(!argv.prod, sourcemaps.write('.')))
    .pipe(when(argv.prod, gulp.dest('.tmp/assets/js')))
    .pipe(when(argv.prod, when('*.js', gzip({append: true}))))
    .pipe(when(argv.prod, size({
      gzip: true,
      showFiles: true
    })))
    .pipe(gulp.dest('.tmp/assets/js'))
);
// 'gulp fonts' -- copies your fonts to the temporary assets directory
gulp.task('scripts:ie', () =>
  gulp.src('src/assets/js/ie/*')
    .pipe(gulp.dest('.tmp/assets/js/ie'))
    .pipe(size({title: 'scripts:ie'}))
);

// 'gulp styles' -- creates a CSS file from your SASS, adds prefixes and
// creates a Sourcemap
// 'gulp styles --prod' -- creates a CSS file from your SASS, adds prefixes and
// then minwhenies, gzips and cache busts it. Does not create a Sourcemap
gulp.task('styles', () =>
  gulp.src('src/assets/scss/main.scss')
    .pipe(when(!argv.prod, sourcemaps.init()))
    .pipe(sass({
      precision: 10,
      includePaths: [
      ]
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({browsers: 'last 1 version'})
    ]))
    .pipe(size({
      showFiles: true
    }))
    .pipe(when(argv.prod, rename({suffix: '.min'})))
    .pipe(when(argv.prod, when('*.css', cssnano({autoprefixer: false}))))
    .pipe(when(argv.prod, size({
      showFiles: true
    })))
    .pipe(when(argv.prod, rev()))
    .pipe(when(!argv.prod, sourcemaps.write('.')))
    .pipe(when(argv.prod, gulp.dest('.tmp/assets/css')))
    .pipe(when(argv.prod, when('*.css', gzip({append: true}))))
    .pipe(when(argv.prod, size({
      gzip: true,
      showFiles: true
    })))
    .pipe(gulp.dest('.tmp/assets/css'))
//    .pipe(when(!argv.prod, browserSync.stream({match: '!*.map'})))
//    .pipe(when(!argv.prod, browserSync.reload({stream: true, match: '.tmp/assets/stylesheets/*.css'})))
);

// 'gulp fonts' -- copies your fonts to the temporary assets directory
gulp.task('styles:css', () =>
  gulp.src('src/assets/css/**/*')
    .pipe(gulp.dest('.tmp/assets/css'))
    .pipe(size({title: 'styles:css'}))
);

// Function to properly reload your browser
function reload(done) {
  browserSync.reload();
  done();
}
// 'gulp serve' -- open up your website in your browser and watch for changes
// in all your files and update them when needed
gulp.task('serve', (done) => {
  browserSync.init({
    // tunnel: true,
    // open: false,
    server: ['.tmp', 'dist'],
    notify: false,
    files: ".tmp/assets/css/*.css"
  });
  done();

  // Watch various files for changes and do the needful
  gulp.watch(['src/**/*.md', 'src/**/*.html', 'src/**/*.yml'], gulp.series('build:site', reload));
  gulp.watch(['src/**/*.xml', 'src/**/*.txt'], gulp.series('site', reload));
  gulp.watch('src/assets/js/**/*.js', gulp.series('scripts', reload));
  gulp.watch('src/assets/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('src/assets/images/**/*', gulp.series('images', reload));
});
