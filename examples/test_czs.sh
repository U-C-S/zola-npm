#!/usr/bin/env bash

rm -r ./examples/ZolaSiteTest
mkdir ./examples/ZolaSiteTest

cd ./src/create-zola-site
npm pack --pack-destination ../../examples/ZolaSiteTest

cd ../../examples/ZolaSiteTest

npm init -y
npm install --prefer-offline --no-audit ./create-zola-site-*.tgz
npx create-zola-site