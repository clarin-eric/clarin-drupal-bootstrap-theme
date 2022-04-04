const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const gulpStylelint = require("@ronilaukkarinen/gulp-stylelint");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const gulpIf = require("gulp-if");
const count = require("gulp-count");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const uglify = require("gulp-uglify-es").default;
const eslint = require("gulp-eslint");
const replace = require("gulp-replace");
const postcssInlineSvg = require("postcss-inline-svg");
const pxtorem = require("postcss-pxtorem");
const browserSync = require("browser-sync").create();
const lazypipe = require("lazypipe");
const $ = require("gulp-load-plugins")();

const postcssProcessors = [
  postcssInlineSvg({
    removeFill: true,
    paths: ["node_modules/bootstrap-icons/icons"]
  }),
  pxtorem({
    propList: [
      "font",
      "font-size",
      "line-height",
      "letter-spacing",
      "*margin*",
      "*padding*"
    ],
    mediaQuery: true
  })
];

// Custom paths for development build
const distPath = "dist/clarin_bootstrap";

const paths = {
  scss: {
    src: "scss/style.scss",
    barrio: "scss/barrio-custom.scss",
    slidenav: "scss/modules/slidenav.scss",
    dest: distPath.concat("/css"),
    watch: "scss/**/*.scss"
  },
  js: {
    src: "js/*.js",
    dest: distPath.concat("/js")
  },
  lib: {
    css: {
      bootstraptoc: "lib/css/bootstrap-toc.css"
    },
    js: {
      bootstraptoc: "lib/js/bootstrap-toc.js"
    }
  },
  static: {
    dest: distPath,
    src: [
      "*images/**/*",
      "*fonts/**/*",
      "*config/**/*",
      "*templates/**/*",
      "*scss/**/*",
      "clarin_bootstrap.*.yml",
      "clarin_bootstrap.theme",
      "composer.json",
      "LICENSE",
      "DISTRIBUTION-README.md",
      "logo.svg",
      "favicon.ico",
      "screenshot.png"
    ],
    watch: [
      "*images/**/*",
      "*fonts/**/*",
      "logo.svg",
      "favicon.ico",
      "screenshot.png"
    ]
  }
};

// Compile sass into CSS
function styles() {
  return gulp
    .src([
      paths.lib.css.bootstraptoc,
      paths.scss.barrio,
      paths.scss.slidenav,
      paths.scss.src
    ])
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(
      replace(
        /(url\()[./]+(..\/images\/\w+(?:\.svg|\.gif|\.png|\.jpg)\))/gi,
        "$1$2"
      )
    )
    .pipe($.postcss(postcssProcessors))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(cleanCss())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("maps"))
    .pipe(gulp.dest(paths.scss.dest));
}

function hasFixFlag() {
  return process.argv.slice(2).includes("--fix");
}

function isJsFixed(file) {
  return file.eslint != null && file.eslint.fixed;
}

function lintscss() {
  return gulp
    .src([paths.scss.watch], { base: "." })
    .pipe(
      gulpStylelint({
        failAfterError: true,
        fix: hasFixFlag(),
        reporters: [{ formatter: "verbose", console: true }]
      })
    )
    .pipe(
      gulpIf(
        hasFixFlag,
        gulp.dest("."),
        count(
          "\x1b[91m\x1b[1mSome warnings might be fixable with the `--fix` option.\x1b[0m\n\n"
        )
      )
    );
}

function lintjs() {
  const fixAndReport = lazypipe()
    .pipe(gulp.dest, ".")
    .pipe(
      count,
      "\x1b[32mJavascript autofix applied to: <%= files %>.\x1b[0m\n\n",
      { logFiles: "\x1b[32m[AUTOFIXED]: \x1b[4m<%= file.path %>\x1b[0m" }
    );

  return gulp
    .src(["gulpfile.js", paths.js.src], { base: "." })
    .pipe(
      eslint({
        fix: hasFixFlag()
      })
    )
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(gulpIf(isJsFixed, fixAndReport()));
}

// Move the javascript files into our js folder
function js() {
  return gulp
    .src([paths.lib.js.bootstraptoc, paths.js.src])
    .pipe(sourcemaps.init())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("maps"))
    .pipe(gulp.dest(paths.js.dest));
}

// Move the static files into our distribution
function resourcesSrc() {
  return gulp.src(paths.static.src);
}

function resources() {
  return resourcesSrc()
    .pipe(
      rename(path => {
        if (path.basename + path.extname === "DISTRIBUTION-README.md") {
          path.basename = "README";
        }
      })
    )
    .pipe(gulp.dest(paths.static.dest));
}

function resourcesDev() {
  return resources().pipe(browserSync.stream());
}

// Add auto-inject styles into browsers for development
function stylesDev() {
  return styles().pipe(browserSync.stream({ match: "**/*.css" }));
}

function jsDev() {
  return js().pipe(browserSync.stream({ match: "**/*.js" }));
}

// Static Server + watching scss/html files
function serve() {
  browserSync.init({
    proxy: "https://www.clarin.eu",
    serveStatic: [
      {
        route: ["/themes/contrib/clarin_bootstrap"],
        dir: ["dist/clarin_bootstrap"]
      }
    ],
    open: false,
    ghostMode: false,
    logConnections: true
  });

  // Watch scss, js and resource files
  gulp.watch(paths.scss.watch, stylesDev);
  gulp.watch(paths.js.src, jsDev);
  gulp.watch(paths.static.watch, resourcesDev);
}

// Tasks
const lintSCSS = lintscss;
const lintES = lintjs;
const dist = gulp.parallel(
  resources,
  gulp.series(lintscss, styles),
  gulp.series(lintjs, js)
);
const dev = gulp.parallel(
  resourcesDev,
  gulp.series(lintscss, stylesDev),
  gulp.series(lintjs, jsDev),
  serve
);
const ci = gulp.parallel(resources, styles, js);

exports.dist = dist;
exports.dev = dev;
exports.lintscss = lintSCSS;
exports.lintjs = lintES;
exports.ci = ci;

exports.default = dev;
