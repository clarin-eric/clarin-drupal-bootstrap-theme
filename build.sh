#!/bin/sh
set -e

PACKAGE_VERSION="${THEME_VERSION}"
BOOTSTRAP_BARRIO_VERSION="5.1.4"

BASE_DIRECTORY=$(cd "$(dirname "$BASH_SOURCE[0]")"; pwd)
OUTPUT_DIRECTORY="${BASE_DIRECTORY}/target"
BUILD_DIRECTORY_NAME="clarin_bootstrap"
BUILD_DIRECTORY="${OUTPUT_DIRECTORY}/${BUILD_DIRECTORY_NAME}/"

if [ "${PACKAGE_VERSION}" == "" ]; then
	PACKAGE_VERSION="dev"
fi
BUILD_PACKAGE="${OUTPUT_DIRECTORY}/clarin_bootstrap-${PACKAGE_VERSION}.tgz"


#gcp and grm can be installed on MacOS via brew. Run "brew install coreutils" to do so.
RM=`which grm||which rm`  #if grm available (on Mac), use it instead of BSD rm

# Cleanup potential previous build output
${RM} -fr -- "${OUTPUT_DIRECTORY}"

# Create transient directories
mkdir -p "${OUTPUT_DIRECTORY}/bootstrap_barrio"
mkdir "${BUILD_DIRECTORY}"
# Create a transient copy of necessary resources
cp "${BASE_DIRECTORY}/package.json" "${BASE_DIRECTORY}/target"
cp "${BASE_DIRECTORY}/gulpfile_package.js" "${BASE_DIRECTORY}/target"
cp -r "${BASE_DIRECTORY}/assets" "${BASE_DIRECTORY}/target"


# Install gulp
echo 'Installing npm dependencies ...'
npm set progress='false'
npm install --prefix="${OUTPUT_DIRECTORY}" --depth '0'
GULP="${OUTPUT_DIRECTORY}/node_modules/gulp/bin/gulp.js"


echo 'Using local gulp: ' ${GULP}

echo 'Retrieving dependencies...'
# Retrieve bootstrap barrio drupal theme
curl --fail --location --show-error --silent --tlsv1 \
    "https://ftp.drupal.org/files/projects/bootstrap_barrio-${BOOTSTRAP_BARRIO_VERSION}.tar.gz" | \
tar -x -z -p --strip-components 1 -C "${OUTPUT_DIRECTORY}/bootstrap_barrio/" -f - "bootstrap_barrio"

#echo 'Customising...'

echo 'Compiling SASS...'
# Compile styles and JS
(
	cd "${OUTPUT_DIRECTORY}"
	${GULP} -f "./gulpfile_package.js"
)

# Make distribution
echo 'Packaging...'
# Copy built resources
mv "${OUTPUT_DIRECTORY}/css" "${BUILD_DIRECTORY}"
mv "${OUTPUT_DIRECTORY}/js" "${BUILD_DIRECTORY}"
# Copy static resources
cp -r "${BASE_DIRECTORY}/images" "${BUILD_DIRECTORY}"
cp -r "${BASE_DIRECTORY}/config" "${BUILD_DIRECTORY}"
cp -r "${BASE_DIRECTORY}/templates" "${BUILD_DIRECTORY}"
cp -r "${BASE_DIRECTORY}/clarin_bootstrap.info.yml" "${BUILD_DIRECTORY}"
cp -r "${BASE_DIRECTORY}/clarin_bootstrap.libraries.yml" "${BUILD_DIRECTORY}"
cp -r "${BASE_DIRECTORY}/clarin_bootstrap.theme" "${BUILD_DIRECTORY}"
cp -r "${BASE_DIRECTORY}/composer.json" "${BUILD_DIRECTORY}"
cp -r "${BASE_DIRECTORY}/logo.svg" "${BUILD_DIRECTORY}"
cp -r "${BASE_DIRECTORY}/screenshot.png" "${BUILD_DIRECTORY}"

tar -c -p -z -f "${BUILD_PACKAGE}"  -C "${OUTPUT_DIRECTORY}" "${BUILD_DIRECTORY_NAME}"

echo 'Done!
Result written to' "${BUILD_PACKAGE}"