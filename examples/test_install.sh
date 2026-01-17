#!/usr/bin/env bash

PWD=$(pwd)
echo "Starting test installation script..."
echo "-> Current working directory: $PWD"
echo "-> Operating System Type: $OSTYPE"

rm -r ./examples/ZolaTest
mkdir ./examples/ZolaTest
echo "-> Created directory: $PWD/examples/ZolaTest"

npm pack --pack-destination ./examples/ZolaTest


if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  cd ./npm/linux-x64-gnu
  npm pack --pack-destination ../../examples/ZolaTest
elif [[ "$OSTYPE" == "darwin"* ]]; then
  cd ./npm/darwin-x64
  npm pack --pack-destination ../../examples/ZolaTest
  cd ../darwin-arm64
  npm pack --pack-destination ../../examples/ZolaTest
elif [[ "$OSTYPE" == "msys" ]]; then
  cd ./npm/win32-x64-msvc
  npm install --prefer-offline --no-audit ./u-c-s-zola-win32-*.tgz
elif [[ "$OSTYPE" == "win32" ]]; then
  cd ./npm/win32-x64-msvc
  npm pack --pack-destination ../../examples/ZolaTest
fi

cd ../../examples/ZolaTest

echo "-> change directory to $PWD. Initializing sample npm project..."

npm init -y

echo "-> Installing zola deps and cowsay to the npm project"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  npm install --prefer-offline --no-audit ./u-c-s-zola-linux-*.tgz
elif [[ "$OSTYPE" == "darwin"* ]]; then
  npm install --prefer-offline --no-audit ./u-c-s-zola-darwin-arm*.tgz
  npm install --prefer-offline --no-audit ./u-c-s-zola-darwin-*.tgz
elif [[ "$OSTYPE" == "msys" ]]; then
  npm install --prefer-offline --no-audit ./u-c-s-zola-win32-*.tgz
elif [[ "$OSTYPE" == "win32" ]]; then
  npm install --prefer-offline --no-audit ./u-c-s-zola-win32-*.tgz
fi

npm install --prefer-offline --no-audit cowsay ./zola-bin-2.*.tgz 
npm exec -c 'cowsay Zola'
npm exec -c 'zola-bin --version'

echo "-> Finished running the test install script"
