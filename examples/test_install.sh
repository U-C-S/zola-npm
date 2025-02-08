#!/usr/bin/env bash

pwd

rm -r ./examples/ZolaTest
mkdir ./examples/ZolaTest

npm pack --pack-destination ./examples/ZolaTest

cd ./npm/win32-x64-msvc
npm pack --pack-destination ../../examples/ZolaTest

cd ./npm/darwin-x64
npm pack --pack-destination ../../examples/ZolaTest

cd ./npm/linux-x64-gnu
npm pack --pack-destination ../../examples/ZolaTest

cd ../../examples/ZolaTest

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
