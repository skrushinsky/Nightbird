const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const spawn = require('child_process').spawn;

const src = 'frontend';
const dst = 'public';


gulp.task('transpile', () => {
    return gulp.src(`${src}/js/es6/**/*.js`).pipe(babel({
        presets: ['@babel/preset-env']
    })).pipe(gulp.dest(`${dst}/js`));
});

gulp.task('libs', () => {
    return gulp.src([`${src}/js/lib/**/*.js`]).pipe(gulp.dest(`${dst}/js/lib`));
});

gulp.task('html', () => {
    return gulp.src([`${src}/**/*.html`, `${src}/*.html`]).pipe(gulp.dest(`${dst}`));
});

gulp.task('styles', () => {
    return gulp.src(`${src}/css/**/*`).pipe(gulp.dest(`${dst}/css`));
});

gulp.task('images', () => {
    return gulp.src(`${src}/img/**/*`).pipe(gulp.dest(`${dst}/img`));
});

gulp.task('fonts', () => {
    return gulp.src(`${src}/fonts/**/*`).pipe(gulp.dest(`${dst}/fonts`));
});

gulp.task('clean', done => {
    del.sync([`${dst}/**/*`]);
    done();
});

gulp.task('test', cb => {
    const cmd = spawn('npm', ['run', 'test'], {
        stdio: 'inherit'
    });
    cmd.on('close', code => {
        console.log('command exited with code ' + code);
        cb(code);
    });
});

gulp.task('build', gulp.series('clean', gulp.parallel(['transpile', 'libs', 'html', 'styles', 'fonts', 'images'])), done => {
    done();
});

gulp.task('run', cb => {
    const cmd = spawn('npm', ['run', 'start-dev'], {
        stdio: 'inherit'
    });
    cmd.on('close', code => {
        console.log('command exited with code ' + code);
        cb(code);
    });
});

gulp.task('default', gulp.series('build', 'run'));
