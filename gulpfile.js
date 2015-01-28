var gulp = require('gulp'), sh = require('shelljs'), uglify = require('gulp-uglify')

gulp.task('test', function () {
    sh.exec("karma start karma.conf.js --reporters progress");
});

gulp.task('test-coverage', function () {
    sh.exec("karma start karma.conf.js --reporters progress,coverage");
});

gulp.task('test-build', function () {
    sh.exec("karma start karma.conf.build.js --reporters progress --singleRun true");
});

gulp.task('build', function () {
    sh.exec("rm -r dist/");
    sh.exec("mkdir dist/");
    sh.exec("cp base.js dist/base.js");
    sh.exec("cp base.js dist/base_to_min.js");
    sh.exec("gulp js");
    sh.exec("gulp build_finalize");
    sh.exec("gulp test-build");
});

gulp.task('js', function () {
    gulp.src('dist/base_to_min.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});


gulp.task('build_finalize', function () {
    sh.exec('mv dist/base_to_min.js dist/base.min.js');
});