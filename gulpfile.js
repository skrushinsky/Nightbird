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
	        .pipe(gulp.dest('./dist/fonts'))
	        .pipe(gulp.dest('./dist/js'));
	});
	done();
}

function dist_sources(done) {
	gulp.src('./src/**/*.*').pipe(gulp.dest('./dist'));
	done();
}

function dist_framework(done) {
	gulp.src('./node_modules/materialize-css/dist/css/materialize.min.css')
		.pipe(gulp.dest('./dist/css'));
	gulp.src('./node_modules/materialize-css/dist/js/materialize.min.js')
		.pipe(gulp.dest('./dist/js'));
	done();
}

function dist_fonts(done) {
	gulp.src('./node_modules/material-design-icons/iconfont/**/*')
		.pipe(gulp.dest('./dist/fonts/iconfont'));
	gulp.src('./node_modules/roboto-fontface/css/roboto/roboto-fontface.css')
		.pipe(gulp.dest('./dist/css/roboto'));
	gulp.src('./node_modules/roboto-fontface/css/roboto-condensed/roboto-condensed-fontface.css')
		.pipe(gulp.dest('./dist/css/roboto-condensed'));
	gulp.src('./node_modules/roboto-fontface/css/roboto-slab/roboto-slab-fontface.css')
		.pipe(gulp.dest('./dist/css/roboto-slab'));
	gulp.src('./node_modules/roboto-fontface/fonts/**/*')
		.pipe(gulp.dest('./dist/fonts'));

	done();
}


gulp.task('clean', done => {
  del.sync([ './dist/*' ]);
  done();
});

gulp.task('build', series(make_dirs, parallel(dist_framework, dist_sources, dist_fonts)), done => {
  done();
});

gulp.task('serve', series('build', () => {
  gulp.src('./dist/').pipe(server({
			livereload: true,
			open: true
		}));
}));
