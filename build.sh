#!/bin/sh
set -e

PACKAGE_VERSION="${THEME_VERSION}"
BOOTSTRAP_BARRIO_VERSION="5.1.4"

BASE_DIRECTORY=$(cd "$(dirname "$BASH_SOURCE[0]")"; pwd)
OUTPUT_DIRECTORY="${BASE_DIRECTORY}/dist"

if [ -z "${PACKAGE_VERSION}" ]; then
	PACKAGE_VERSION="dev"
fi
BUILD_PACKAGE="${OUTPUT_DIRECTORY}/clarin_bootstrap-${PACKAGE_VERSION}.tar.gz"

#gcp and grm can be installed on MacOS via brew. Run "brew install coreutils" to do so.
RM=`which grm||which rm`  #if grm available (on Mac), use it instead of BSD rm

case "${1}" in
    "ci" | "clean")
        # Cleanup everything from potential previous build
        ${RM} -fr -- "${OUTPUT_DIRECTORY}" "node-modules"
        echo 'Installing npm dependencies ...'
        # Install everything fresh
        npm ci
        ;;
    "")
        # Cleanup build output only
        ${RM} -fr -- "${OUTPUT_DIRECTORY}"
        echo 'Installing npm dependencies ...'
        # Update pre-installed packes
        npm install
        ;;
    *) 
        echo "Invalide build parameter: \"${1}\" ... exiting ...\n"
	    exit 1
	    ;;
esac

    
GULP="./node_modules/gulp/bin/gulp.js"
echo 'Using local gulp: ' ${GULP}

echo 'Retrieving bootstrap barrio...'
# Retrieve bootstrap barrio drupal theme
mkdir "${OUTPUT_DIRECTORY}"
curl --fail --location --show-error --silent --tlsv1 \
    "https://ftp.drupal.org/files/projects/bootstrap_barrio-${BOOTSTRAP_BARRIO_VERSION}.tar.gz" | \
tar -x -z -p -C "${OUTPUT_DIRECTORY}"

echo 'Building ...'
${GULP} "ci"

echo 'Packaging ...'
tar -c -p -z -f "${BUILD_PACKAGE}"  -C "${OUTPUT_DIRECTORY}" "clarin_bootstrap"

echo 'Done!
Result written to' "${BUILD_PACKAGE}"