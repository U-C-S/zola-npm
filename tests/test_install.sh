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
npm install --prefer-offline --no-audit ./zola-bin-*.tgz ./zola-bin-win32-*.tgz ./zola-bin-darwin-*.tgz ./zola-bin-linux-*.tgz cowsay
npm exec -c 'cowsay Zola'
npm exec -c 'zola-bin --version'
