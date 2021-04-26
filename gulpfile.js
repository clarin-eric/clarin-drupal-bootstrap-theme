const fs = require("fs");

let gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  $ = require('gulp-load-plugins')(),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  replace = require('gulp-replace'),
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

// Custom paths for development build
var distPath = '.'
var bootstrapBarrioPath = '../../contrib/bootstrap_barrio' // Existing bootstrap barrio location inside a Drupal installation
if (!fs.existsSync(bootstrapBarrioPath)) {
  bootstrapBarrioPath = './dist/bootstrap_barrio'
}

// Custom paths for distribution build
if ( process.argv.includes('dist') ) {
  distPath = './dist/clarin_bootstrap'
  bootstrapBarrioPath = './dist/bootstrap_barrio'
}

const paths = {
  scss: {
    src: './assets/styles/style.scss',
    includes: [
        './node_modules/bootstrap/scss',
        bootstrapBarrioPath.concat('/scss'),
    ],
    dest: distPath.concat("/css"),
    watch: './assets/styles/**/*.scss',
  },
  csslib: {
    bootstraptoc: './assets/styles/lib/bootstrap-toc.css',
    slidenav: './assets/styles/lib/slide-nav.scss',
  },
  js: {
    src: 'assets/scripts/*.js',
    bootstrap: './node_modules/bootstrap/dist/js/bootstrap.min.js',
    jquery: './node_modules/jquery/dist/jquery.min.js',
    popper: './node_modules/popper.js/dist/umd/popper.min.js',
    poppermap: './node_modules/popper.js/dist/umd/popper.min.js.map',
    barrio: bootstrapBarrioPath.concat('/js/barrio.js'),
    dest:  distPath.concat("/js"),
  },
  jslib: {
    bootstraptoc: './assets/scripts/lib/bootstrap-toc.min.js',
  },
  static: {
    dest: distPath,
    images: '*images/**/*',
    fonts: '*fonts/**/*',
    config: '*config/**/*',
    templates: '*templates/**/*',
    ymlFiles: './clarin_bootstrap.*.yml',
    themeFile: './clarin_bootstrap.theme',
    composerFile: './composer.json',
    logo: './logo.svg',
    favicon: './favicon.ico',
    screenshot: 'screenshot.png',
  }
}

// Compile sass into CSS
function styles () {
  return gulp.src([paths.csslib.bootstraptoc, paths.csslib.slidenav, paths.scss.src])
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: paths.scss.includes
    }).on('error', sass.logError))
    .pipe(replace(/(url\()[./]+(..\/images\/\w+(?:\.svg|\.gif|\.png|\.jpg)\))/gi, '$1$2'))
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
  return gulp.src([paths.js.bootstrap, paths.jslib.bootstraptoc, paths.js.jquery, paths.js.popper, paths.js.poppermap, paths.js.barrio, paths.js.src])
    .pipe(gulp.dest(paths.js.dest))
}

// Move the static files into our distribution
function static () {
  return gulp.src([paths.static.images, paths.static.fonts, paths.static.config, paths.static.templates, paths.static.ymlFiles, 
    paths.static.themeFile, paths.static.composerFile, paths.static.logo, paths.static.favicon, paths.static.screenshot])
    .pipe(gulp.dest(paths.static.dest))
}

// Add auto-inject into browsers for development
function stylesDev () {
  return styles().pipe(browserSync.stream())
}

function jsDev () {
  return js().pipe(browserSync.stream())
}

// Static Server + watching scss/html files
function serve () {
  browserSync.init({
    proxy: 'https://grrr-www.clarin.eu',
  })

  gulp.watch([paths.scss.watch], styles).on('change', browserSync.reload)
  // Watch js-files
  gulp.watch([paths.js.src], js).on('change', browserSync.reload)
}

// Tasks
const dist = gulp.series(styles, js, static)
const dev = gulp.series(stylesDev, gulp.parallel(jsDev, serve))

exports.dist = dist
exports.dev = dev

exports.default = dev