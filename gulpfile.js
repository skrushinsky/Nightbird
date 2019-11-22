const gulp = require('gulp');
const {
	series,
	parallel
} = require('gulp');
const server = require('gulp-server-livereload');
const del = require('del');


function make_dirs(done) {
	gulp.task('directories', function () {
	    return gulp.src('*.*', {read: false})
	        .pipe(gulp.dest('./dist/css'))
	        .pipe(gulp.dest('./dist/img'))
	        .pipe(gulp.dest('./dist/img/icons'))
	        .pipe(gulp.dest('./dist/fonts'))
	        .pipe(gulp.dest('./dist/js'));
	});
	done();
}

function dist_sources(done) {
	gulp.src('./src/**/*.*').pipe(gulp.dest('./dist'));
	done();
}

function dist_uikit(done) {
	gulp.src('./node_modules/uikit/dist/css/uikit.min.css')
		.pipe(gulp.dest('./dist/css'));
	gulp.src('./node_modules/uikit/dist/js/uikit.min.js')
		.pipe(gulp.dest('./dist/js'));
	gulp.src('./node_modules/uikit/dist/js/uikit-icons.min.js')
		.pipe(gulp.dest('./dist/js'));

	done();
}


gulp.task('clean', done => {
  del.sync([ './dist/*' ]);
  done();
});

gulp.task('build', series(make_dirs, parallel(dist_uikit, dist_sources)), done => {
  done();
});

gulp.task('serve', series('build', () => {
  gulp.src('./dist').pipe(server({
			livereload: true,
			open: true
		}));
}));
