#!/usr/bin/env bash

rm -r ./test/ZolaTest
mkdir ./test/ZolaTest

cd ./packages/zola-bin
npm pack --pack-destination ../../test/ZolaTest

cd ../../test/ZolaTest

npm init -y
npm install ./zola-bin-*.tgz cowsay
npm exec -c 'cowsay Zola'
npm exec -c 'zola-bin --version'
