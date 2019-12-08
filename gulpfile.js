"use strict";

const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const csso = require("gulp-csso");
const del = require("del");
const uglify = require("gulp-uglify");

function css(cb) {
  gulp
    .src([
      "./assets/css/normalize.css",
      "./assets/css/nprogress.css",
      "./assets/css/style.css"
    ])
    .pipe(concat("styles.min.css"))
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(gulp.dest("./assets/dist"));
  cb();
}

function js(cb) {
  gulp
    .src([
      "./assets/js/jquery-1.11.3.min.js",
      "./assets/js/jquery.history.js",
      "./assets/js/jquery.fitvids.js",
      "./assets/ghostHunter/dist/jquery.ghosthunter.js",
      "./assets/js/nprogress.js",
      "./assets/js/Shortcode.js",
      "./assets/js/scripts.js"
    ])
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./assets/dist"));
  cb();
}

function clean(cb) {
  del(["./assets/dist"]);
  cb();
}

exports = Object.assign(exports, {
  css,
  js,
  clean,
  default: gulp.series(clean, gulp.parallel(css, js))
});
