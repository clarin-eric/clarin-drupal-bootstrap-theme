#!/bin/sh
set -e

PACKAGE_VERSION="${THEME_VERSION}"
BOOTSTRAP_BARRIO_VERSION="5.1.4"

BASE_DIRECTORY=$(cd "$(dirname "$BASH_SOURCE[0]")"; pwd)
OUTPUT_DIRECTORY="${BASE_DIRECTORY}/dist"

if [ "${PACKAGE_VERSION}" == "" ]; then
	PACKAGE_VERSION="dev"
fi
BUILD_PACKAGE="${OUTPUT_DIRECTORY}/clarin_bootstrap-${PACKAGE_VERSION}.tar.gz"

#gcp and grm can be installed on MacOS via brew. Run "brew install coreutils" to do so.
RM=`which grm||which rm`  #if grm available (on Mac), use it instead of BSD rm

# Cleanup potential previous build output
${RM} -fr -- "${OUTPUT_DIRECTORY}" "node-modules" "bootstrap_barrio"

# Install build environment
echo 'Installing npm dependencies ...'
npm install --depth '0'

GULP="./node_modules/gulp/bin/gulp.js"
echo 'Using local gulp: ' ${GULP}

echo 'Retrieving bootstrap barrio...'
# Retrieve bootstrap barrio drupal theme
curl --fail --location --show-error --silent --tlsv1 \
    "https://ftp.drupal.org/files/projects/bootstrap_barrio-${BOOTSTRAP_BARRIO_VERSION}.tar.gz" | \
tar -x -z -p

#echo 'Customising...'

echo 'Building ...'
${GULP} -f "./gulpfile_package.js"

echo 'Packaging ...'
tar -c -p -z -f "${BUILD_PACKAGE}"  -C "${OUTPUT_DIRECTORY}" "clarin_bootstrap"

echo 'Done!
Result written to' "${BUILD_PACKAGE}"