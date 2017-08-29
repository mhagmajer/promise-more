/* eslint-disable comma-dangle */

const del = require('del');
const flowRemoveTypes = require('flow-remove-types');
const gulp = require('gulp');
const mirror = require('gulp-mirror');
const rename = require('gulp-rename');
const through = require('through2');

gulp.task('clean', () => del([
  'lib/',
]));

gulp.task('flow-remove-types', ['clean'], () =>
  gulp.src('src/**/*.js')
    .pipe(mirror(
      rename({ extname: '.js.flow' }),
      through.obj((file, enc, cb) => {
        // eslint-disable-next-line no-param-reassign
        file.contents = new Buffer(flowRemoveTypes(file.contents.toString('utf8')).toString());
        cb(null, file);
      })
    ))
    .pipe(gulp.dest('lib/'))
);

gulp.task('default', ['flow-remove-types']);
