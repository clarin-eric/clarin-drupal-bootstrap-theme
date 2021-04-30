const fs = require("fs");

let gulp = require("gulp"),
  sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  $ = require("gulp-load-plugins")(),
  cleanCss = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  uglify = require("gulp-uglify-es").default,
  eslint = require("gulp-eslint"),
  replace = require("gulp-replace"),
  postcssInlineSvg = require("postcss-inline-svg"),
  pxtorem = require("postcss-pxtorem"),
  postcssProcessors = [
    postcssInlineSvg({
      removeFill: true,
      paths: ["node_modules/bootstrap-icons/icons"]
    }),
    pxtorem({
      propList: ["font", "font-size", "line-height", "letter-spacing", "*margin*", "*padding*"],
      mediaQuery: true
    })
  ],
  browserSync = require("browser-sync").create();

// Custom paths for development build
var distPath = ".";
var bootstrapBarrioPath = "../../contrib/bootstrap_barrio"; // Existing bootstrap barrio location inside a Drupal installation
if (!fs.existsSync(bootstrapBarrioPath)) {
  bootstrapBarrioPath = "dist/bootstrap_barrio/";
}

// Custom paths for distribution build
if ( process.argv.includes("dist") ) {
  distPath = "dist/clarin_bootstrap";
  bootstrapBarrioPath = "dist/bootstrap_barrio/";
}

const paths = {
  scss: {
    src: "assets/styles/style.scss",
    includes: [
      "node_modules/bootstrap/scss",
      bootstrapBarrioPath.concat("scss"),
    ],
    slidenav: "assets/styles/modules/slidenav.scss",
    dest: distPath.concat("/css"),
    watch: "assets/styles/**/*.scss",
  },
  csslib: {
    bootstraptoc: "assets/styles/lib/bootstrap-toc.css",
  },
  js: {
    src: "assets/scripts/*.js",
    bootstrap: "node_modules/bootstrap/dist/js/bootstrap.js",
    jquery: "node_modules/jquery/dist/jquery.js",
    popper: "node_modules/popper.js/dist/umd/popper.js",
    barrio: bootstrapBarrioPath.concat("js/barrio.js"),
    dest:  distPath.concat("/js"),
  },
  jslib: {
    bootstraptoc: "assets/scripts/lib/bootstrap-toc.js",
  },
  static: {
    dest: distPath,
    src: [
      "*images/**/*",
      "*fonts/**/*",
      "*config/**/*",
      "*templates/**/*",
      "clarin_bootstrap.*.yml",
      "clarin_bootstrap.theme",
      "composer.json",
      "logo.svg",
      "favicon.ico",
      "screenshot.png"
    ]
  }
};

// Compile sass into CSS
function styles () {
  return gulp.src([paths.csslib.bootstraptoc, paths.scss.slidenav, paths.scss.src])
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: paths.scss.includes
    }).on("error", sass.logError))
    .pipe(replace(/(url\()[./]+(..\/images\/\w+(?:\.svg|\.gif|\.png|\.jpg)\))/gi, "$1$2"))
    .pipe($.postcss(postcssProcessors))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(cleanCss())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("maps"))
    .pipe(gulp.dest(paths.scss.dest));
}

function lintjs_gulpfile () {
  return gulp.src("gulpfile.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function lintjs_theme () {
  return gulp.src([paths.js.src, "gulpfile.js"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}
// Move the javascript files into our js folder
function js () {
  return gulp.src([paths.js.bootstrap, paths.jslib.bootstraptoc, paths.js.jquery, paths.js.popper, paths.js.barrio, paths.js.src])
    .pipe(sourcemaps.init())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("maps"))
    .pipe(gulp.dest(paths.js.dest));
}

// Move the static files into our distribution
function resourcesSrc () {
  return gulp.src(paths.static.src);
}

function resources () {
  return resourcesSrc().pipe(gulp.dest(paths.static.dest));
}

function resourcesDev () {
  return resourcesSrc().pipe(browserSync.stream());
}

// Add auto-inject styles into browsers for development
function stylesDev () {
  return styles().pipe(browserSync.stream({match: "**/*.css"}));
}

function jsDev () {
  return js().pipe(browserSync.stream({match: "**/*.js"}));
}

// Static Server + watching scss/html files
function serve () {
  browserSync.init({
    proxy: "https://grrr-www.clarin.eu",
    serveStatic: [{
      route: ["/themes/custom/clarin_bootstrap"],
      dir: ["."]
    }],
    open: false,
    logConnections: true
  });

  // Watch scss, js and resource files
  gulp.watch(paths.scss.watch, stylesDev);
  gulp.watch(paths.js.src, jsDev);
  gulp.watch(paths.static.src, resourcesDev);
}

// Tasks
const lintjs = gulp.parallel(lintjs_gulpfile, lintjs_theme);
const dist = gulp.parallel(styles, gulp.series(lintjs, js), resources);
const dev = gulp.parallel(resourcesDev, stylesDev, gulp.series(lintjs, jsDev), serve);

exports.dist = dist;
exports.dev = dev;
exports.lintjs = lintjs;

exports.default = dev;