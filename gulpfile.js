const gulp = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('sass'); // use Dart Sass
const cleancss = require('gulp-clean-css');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');

const paths = {
  source: './src/*.scss',
  doc: './docs/src/scss/*.scss'
};

async function _build(filePaths, destination) {
  return new Promise((resolve, reject) => {
    gulp.src(filePaths)
      .pipe(sass({ outputStyle: 'expanded', precision: 10 })
        .on('error', sass.logError)
      )
      .pipe(autoprefixer())
      .pipe(gulp.dest(destination))
      .pipe(cleancss())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest(destination))
      .on('end', resolve)
      .on('error', reject);
  });
}

async function build() {
  return _build(paths.source, './dist');
}

async function docs() {
  const pugTask = new Promise((resolve, reject) => {
    gulp.src('docs/src/**/!(_)*.pug')
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest('./docs/'))
      .on('end', resolve)
      .on('error', reject);
  });
  
  return Promise.all([
    _build(paths.doc, './docs/dist'),
    _build(paths.source, './docs/dist'),
    pugTask
  ]);
}

function watch() {
  gulp.watch('./**/*.scss', build);
  gulp.watch('./**/*.scss', docs);
  gulp.watch('./**/*.pug', docs);
}

exports.build = build;
exports.docs = docs;
exports.watch = watch;
exports.default = build;
