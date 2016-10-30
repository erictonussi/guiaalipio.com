'use strict';
const gulp = require('gulp');
const inject = require('gulp-inject');

// 'gulp inject:head' -- injects our style.css file into the head of our HTML
gulp.task('inject:head', () =>
  gulp.src('.tmp/src/_includes/head.html')
    .pipe(inject(gulp.src('.tmp/assets/css/*.css'), {ignorePath: '.tmp'}))
    .pipe(gulp.dest('.tmp/src/_includes'))
);

// 'gulp inject:footer' -- injects our index.js file into the end of our HTML
gulp.task('inject:footer', () =>
  gulp.src('.tmp/src/_includes/footer.html')
    .pipe(inject(gulp.src('.tmp/assets/js/*.js'), {ignorePath: '.tmp'}))
    .pipe(gulp.dest('.tmp/src/_includes'))
);
