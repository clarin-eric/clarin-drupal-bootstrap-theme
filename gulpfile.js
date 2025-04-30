import gulp from "gulp";
import gulpsass from "gulp-sass";
import * as sass from "sass";
import sourcemaps from "gulp-sourcemaps";
import gulpStylelint from "@ronilaukkarinen/gulp-stylelint";
import cleanCss from "gulp-clean-css";
import rename from "gulp-rename";
import gulpIf from "gulp-if";
import count from "gulp-count";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import uglify from "gulp-uglify-es";
import eslint from "gulp-eslint";
import replace from "gulp-replace";
import postcssInlineSvg from "postcss-inline-svg";
import pxtorem from "postcss-pxtorem";
import browserSync from "browser-sync";
import lazypipe from "lazypipe";

const _sass = gulpsass(sass);

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
    ckeditor5: "scss/ckeditor5-clarin.style.scss",
    edit_form: "scss/edit-form-styles.style.scss",
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
      paths.scss.ckeditor5,
      paths.scss.edit_form,
      paths.scss.slidenav,
      paths.scss.src
    ])
    .pipe(sourcemaps.init())
    .pipe(_sass().on("error", _sass.logError))
    .pipe(
      replace(
        /(url\()[./]+(..\/images\/\w+(?:\.svg|\.gif|\.png|\.jpg)\))/gi,
        "$1$2"
      )
    )
    .pipe(postcss(postcssProcessors))
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

function _lintscss() {
  return gulp
    .src([paths.scss.watch], { base: "." })
    .pipe(
      gulpStylelint({
        failAfterError: true,
        fix: hasFixFlag(),
        reporters: [{ formatter: "string", console: true }]
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

function _lintjs() {
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
    .pipe(uglify.default())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("maps"))
    .pipe(gulp.dest(paths.js.dest));
}

// Move the static files into our distribution
function resourcesSrc() {
  return gulp.src(paths.static.src, {
    encoding: false
  });
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
const lintSCSSint = _lintscss;
const lintESint = _lintjs;
const distint = gulp.parallel(
  resources,
  gulp.series(_lintscss, styles),
  gulp.series(_lintjs, js)
);
const devInt = gulp.parallel(
  resourcesDev,
  gulp.series(_lintscss, stylesDev),
  gulp.series(_lintjs, jsDev),
  serve
);
const _ci = gulp.parallel(resources, styles, js);

gulp.task("dist", distint);
gulp.task("dev", devInt);
gulp.task("lintscss", lintSCSSint);
gulp.task("lintjs", lintESint);
gulp.task("ci", _ci);

gulp.task("default", devInt);
