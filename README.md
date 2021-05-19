[![CI](https://github.com/clarin-eric/clarin-drupal-bootstrap-theme/workflows/CI/badge.svg)](https://github.com/clarin-eric/clarin-drupal-bootstrap-theme/actions?query=workflow%3ACI+branch%3A1.0)

CONTENTS OF THIS FILE
---------------------

 * Introduction
 * Development requirements
 * Setup environment
 * Run
 * Lint
 * Installation on a drupal site


INTRODUCTION
------------

Source repository for the CLARIN [Bootstrap Barrio](https://www.drupal.org/project/bootstrap_barrio) sub-theme for Drupal 8.

The continuous integration system builds this repository and publishes the theme files to [the theme distribution repository](https://github.com/clarin-eric/clarin-drupal-bootstrap-theme-dist) which can be used as a [composer VCS](https://getcomposer.org/doc/05-repositories.md#vcs).

For theme releases and instructions on how to install and use it in Drupal, check the the theme distribution [repository instructions](https://github.com/clarin-eric/clarin-drupal-bootstrap-theme-dist/blob/main/README.md).

DEVELOPMENT REQUIREMENTS
------------

* `npm` ([see](https://www.npmjs.com/get-npm)).
* Drupal [Bootstrap Barrio](https://www.drupal.org/project/bootstrap_barrio) parent theme.


SETUP ENVIRONMENT
-------------

* You will need `npm` ([see](https://www.npmjs.com/get-npm)).

* Checkout this repository.

* From inside `clarin-drupal-bootstrap-theme` folder run `npm install`.

* Create a `dist` directory and extract the Bootstrap Barrio distribution in it:
```
mkdir dist
curl "https://ftp.drupal.org/files/projects/bootstrap_barrio-${BOOTSTRAP_BARRIO_VERSION}.tar.gz" | \
tar -x -z -p -C dist/
```

Alternatively just run `build.sh` from inside `clarin-drupal-bootstrap-theme` directory

The script will run all required setup commands, build the project and create a distribution build inside `dist/`.


RUN
-------------

* From inside `clarin-drupal-bootstrap-theme` run: `gulp`

Gulp will build the theme files to `dist/clarin_bootstrap`, launch a [browsersync](https://browsersync.io/) proxy and automatically listen for changes in the source files.

To view the full CLARIN website with the hot-deployed theme code go to: https://localhost:3000/
Browsersync will locally proxy the development server instance at https://grrr-www.clarin.eu/ and hot-deploy your code changes on top of that site.

  * SCSS -> CSS code changes are automatically injected after built.
  * JS and resource changes will trigger Gulp to automatically reload your browser after built.

To only build the output distribution without launching browsersync run: `gulp dist`

LINT
-------------

All SCSS and JS code is linted when running `gulp [dist]` and the build will fail in case of errors. You can also call gulp to only lint the code without building:
* Lint javascript: `gulp lintjs`
* Lint SCSS: `gulp lintscss`

Both subcommands accept a `--fix` flag which attempts to automactically fix the found issues.

INSTALLATION ON A DRUPAL SITE
------------

 * For regular installation instructions see the [theme distribution repository](https://github.com/clarin-eric/clarin-drupal-bootstrap-theme-dist).

 * To directly use your build in a drupal site:
   * Get the theme build directory `dist/clarin_bootstrap`.
   * Copy or link it in your Drupal themes directory.
   * Install as you would normally [install a contributed Drupal theme](https://www.drupal.org/docs/user_guide/en/extend-theme-install.html).
