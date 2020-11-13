let gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  $ = require('gulp-load-plugins')(),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  postcssInlineSvg = require('postcss-inline-svg'),
  browserSync = require('browser-sync').create()
  pxtorem = require('postcss-pxtorem'),
	postcssProcessors = [
		postcssInlineSvg({
      removeFill: true,
      paths: ['./node_modules/bootstrap-icons/icons']
    }),
		pxtorem({
			propList: ['font', 'font-size', 'line-height', 'letter-spacing', '*margin*', '*padding*'],
			mediaQuery: true
		})
  ];

const distPath = './dist/clarin_bootstrap';

const paths = {
  scss: {
    src: './assets/styles/style.scss',
    dest: distPath.concat("/css"),
    bootstrap: './node_modules/bootstrap/scss/bootstrap.scss',
  },
  js: {
    src: 'assets/scripts/*.js',
    dest:  distPath.concat("/js"),
    bootstrap: './node_modules/bootstrap/dist/js/bootstrap.min.js',
    jquery: './node_modules/jquery/dist/jquery.min.js',
    popper: './node_modules/popper.js/dist/umd/popper.min.js',
    poppermap: './node_modules/popper.js/dist/umd/popper.min.js.map',
    barrio: './bootstrap_barrio/js/barrio.js',
  },
  static: {
    dest: distPath,
    images: '*images/**/*',
    config: '*config/**/*',
    templates: '*templates/**/*',
    ymlFiles: './clarin_bootstrap.*.yml',
    composerFile: './composer.json',
    logo: './logo.svg',
    screenshot: 'screenshot.png',
  }
}

// Compile sass into CSS & auto-inject into browsers
function styles () {
  return gulp.src([paths.scss.bootstrap, paths.scss.src])
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        './node_modules/bootstrap/scss',
        './bootstrap_barrio/scss'
      ]
    }).on('error', sass.logError))
    .pipe($.postcss(postcssProcessors))
    .pipe(postcss([autoprefixer({
      browsers: [
        'Chrome >= 35',
        'Firefox >= 38',
        'Edge >= 12',
        'Explorer >= 10',
        'iOS >= 8',
        'Safari >= 8',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12']
    })]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.dest))
}

// Move the javascript files into our js folder
function js () {
  return gulp.src([paths.js.bootstrap, paths.js.jquery, paths.js.popper, paths.js.poppermap, paths.js.barrio, paths.js.src])
    .pipe(gulp.dest(paths.js.dest))
}

// Move the static files into our distribution
function static () {
  return gulp.src([paths.static.images, paths.static.config, paths.static.templates, paths.static.ymlFiles, 
    paths.static.composerFile, paths.static.logo, paths.static.screenshot])
    .pipe(gulp.dest(paths.static.dest))
}

// Default task
const build = gulp.series(styles, js, static)

exports.styles = styles
exports.js = js

exports.default = build