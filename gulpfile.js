// ////////////////////////////////////////////
// Modules
// ////////////////////////////////////////////

// the main gulp reference
let gulp = require('gulp');

// deletes files used during build (https://www.npmjs.com/package/gulp-clean)
let clean = require('gulp-clean');

// watches files for changes and reruns tasks (https://www.npmjs.com/package/gulp-watch)
let watch = require('gulp-watch');

// karma server to run automated unit tests (http://karma-runner.github.io/0.13/index.html)
// let Server = require('karma').Server;

// used to run backend tests
const jasmine = require('gulp-jasmine');

// used show backend test errors and output in a clearer way (The default reporter does not show stacktraces!)
const TerminalReporter = require('jasmine-terminal-reporter');

// ////////////////////////////////////////////
// Variables
// ////////////////////////////////////////////

// All application JS files.
let appFiles = [
    // 'api/models/**/*.model.js',
  'lib/**/*.js',
  'test/**/*.js'];

// ////////////////////////////////////////////
// Tasks
// ////////////////////////////////////////////

// single run testing
gulp.task('test', function(done) {
  return gulp.src(appFiles)
        // gulp-jasmine works on filepaths so you can't have any plugins before it
        .pipe(jasmine({
          reporter: new TerminalReporter({
                // isVerbose: true,
            includeStackTrace: true,
            stackFilter: stack => {
              return stack.split('\n', 1500).slice(0, 1500).join('\n');
            }
          }),
          errorOnFail: true
        }))
        ;

    // new Server({ configFile: __dirname + '/karma.conf.js', singleRun: true },
    //     function (code) {
    //         if (code == 1) {
    //             console.log('Unit Test failures, exiting process');
    //             //done(new Error(`Karma exited with status code ${code}`));
    //             return process.exit(code);
    //         } else {
    //             console.log('Unit Tests passed');
    //             done();
    //         }
    //     }).start();
});

// continuous testing
// gulp.task('tdd', function(done) {
//   new Server({configFile: __dirname + '/karma.conf.js'}, function() {
//     done();
//   }).start();
// });

// watch the app .js files for changes and execute the app-js task if necessary
gulp.task('app-watch', function() {
  watch(appFiles, function(file) {
        // gulp.start('app-js-dev');
  });
});

// clean up files after builds
gulp.task('cleanup', function() {
  return gulp.src('build', {read: false})
        .pipe(clean());
});

// continuous watchers
gulp.task('default', function() {
  gulp.start(['app-watch', 'tdd']);
});

