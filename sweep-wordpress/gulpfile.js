/*jshint esversion: 6 */

// GULP
const gulp = require('gulp');

//CSS
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');

// JS
const concat = require('gulp-concat');
const babel = require('gulp-babel');

// UTILITY
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();
const changed = require('gulp-changed');

//IMAGES
const svgo = require('gulp-svgo');
const gulpext = require('gulp-ext');

// CONST
const browserSyncHost = 'sweep.flyhigh.pro';
const isSwiperVersion4 = false;
const config = {
	nodeModulesDir: './node_modules',
	srcDir: './src',
	distDir: './dist',
};

const swiperDeps = (type = 'css') =>
	isSwiperVersion4
		? `/swiper/dist/${type}/swiper.min.${type}`
		: `/swiper/swiper-bundle.min.${type}`;

function prependNodeModulesDir(arrayOfDeps) {
	return arrayOfDeps.map((dependency) => config.nodeModulesDir + dependency);
}

function swallowError(error) {
	console.log(error.toString());
	this.emit('end');
}

function stylesApp() {
	return gulp
	.src(config.srcDir + '/scss/main.scss')
	.pipe(sourcemaps.init())
	.pipe(
		sass({
			outputStyle: 'compressed',
			errLogToConsole: true,
		})
	)
	.on('error', swallowError)
	.pipe(
		autoprefixer({
			grid: 'autoplace',
			browsers: ['last 3 versions'],
		})
	)
	.pipe(concat('app.min.css'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(config.distDir + '/css'))
	.pipe(browserSync.stream());
}

gulp.task('styles-app', stylesApp);

function stylesDeps() {
    return gulp.src(prependNodeModulesDir([
        // list of css dependencies
        '/bootstrap/dist/css/bootstrap.min.css',
        '/simplebar/dist/simplebar.min.css',
        `${swiperDeps('css')}`, // swiper version 4 or latest
        '/modal-video/css/modal-video.min.css',
        '/tooltipster/dist/css/tooltipster.bundle.min.css',
    ]))
        .pipe(cssnano({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(concat('dependencies.min.css'))
        .pipe(gulp.dest(config.distDir + '/css'))
}

gulp.task('styles-dependencies', stylesDeps);

function jsApp() {
	return gulp
	.src([config.srcDir + '/js/**/*.js'])
	.pipe(sourcemaps.init())
	.pipe(
		babel({
			presets: [
				[
					'@babel/env',
					{
						targets: 'last 2 versions, > 0.5%, ie >= 11',
					},
				],
				[
					'minify',
					{
						builtIns: false,
					},
				],
			],
			comments: false,
		})
	)
	.on('error', swallowError)
	.pipe(concat('app.min.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(config.distDir + '/js'));
}

gulp.task('js-app', jsApp);

function jsDeps() {
    return gulp.src(prependNodeModulesDir([
        // list of js dependencies
        '/bootstrap/dist/js/bootstrap.min.js',
        '/simplebar/dist/simplebar.min.js',
        `${swiperDeps('js')}`, // swiper version 4 or latest
        '/modal-video/js/jquery-modal-video.min.js',
        '/tooltipster/dist/js/tooltipster.bundle.min.js',
        // '/sharer.js/sharer.min.js',
        // '/gsap/dist/gsap.min.js',
        // '/gsap/dist/ScrollTrigger.min.js',
    ]))
        .pipe(concat('dependencies.min.js'))
        .pipe(gulp.dest(config.distDir + '/js'))
}

gulp.task('js-dependencies', jsDeps);

function fonts() {
	return gulp.src(config.srcDir + '/fonts/**/*.*').pipe(gulp.dest(config.distDir + '/fonts'));
}

gulp.task('fonts', fonts);

function img() {
	return gulp
	.src(config.srcDir + '/images/**/*.{jpg,jpeg,png,gif,svg,webp,avif,ico,cur}')
	.pipe(changed(config.distDir + '/images'))
	.pipe(gulp.dest(config.distDir + '/images'));
}

gulp.task('img', img);

function svg() {
    return gulp.src(config.srcDir + '/images/**/*.svg')
        .pipe(svgo({
            plugins: [
	            { removeViewBox: false },
	            { cleanupIDs: false },
	            { removeScriptElement: true }
            ]
        }))
        .pipe(gulpext.append('php'))
        .pipe(gulp.dest(config.distDir + '/images'));
}

gulp.task('images-svg', svg);

gulp.task('serve', () => {
	browserSync.init({
		open: 'external',
		host: browserSyncHost,
		proxy: browserSyncHost,
		port: 8080,
	});

    watch(config.srcDir + '/scss/**/*.scss', stylesApp);
    watch(config.srcDir + '/js/**/*.js', gulp.series(jsApp, browserSync.reload));
    watch(config.srcDir + '/images/**/*.{jpg,jpeg,png,gif,svg,webp,avif,ico,cur}', img);
    watch(config.srcDir + '/images/**/*.svg', svg);
    watch(config.srcDir + '/fonts/**/*', fonts);
    watch('**/*.php', browserSync.reload);
});

const allTasks = [
	'styles-dependencies',
	'js-dependencies',
	'styles-app',
	'js-app',
	'fonts',
	'img',
	'images-svg',
];

gulp.task('build', gulp.parallel(...allTasks));

gulp.task('default', gulp.series(gulp.parallel(...allTasks), 'serve'));
