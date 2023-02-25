#!/usr/bin/env bash

rm -r ./tests/ZolaTest
mkdir ./tests/ZolaTest

cd ./packages/zola-bin
npm pack --pack-destination ../../tests/ZolaTest

cd ../zola-bin-win32
npm pack --pack-destination ../../tests/ZolaTest

cd ../zola-bin-darwin
npm pack --pack-destination ../../tests/ZolaTest

cd ../zola-bin-linux
npm pack --pack-destination ../../tests/ZolaTest

cd ../../tests/ZolaTest

npm init -y

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  npm install --prefer-offline --no-audit ./zola-bin-linux-*.tgz
elif [[ "$OSTYPE" == "darwin"* ]]; then
  npm install --prefer-offline --no-audit ./zola-bin-darwin-*.tgz
elif [[ "$OSTYPE" == "msys" ]]; then
  npm install --prefer-offline --no-audit ./zola-bin-win32-*.tgz
elif [[ "$OSTYPE" == "win32" ]]; then
  npm install --prefer-offline --no-audit ./zola-bin-win32-*.tgz
fi

npm install --prefer-offline --no-audit cowsay ./zola-bin-0.*.tgz 
npm exec -c 'cowsay Zola'
npm exec -c 'zola-bin --version'
