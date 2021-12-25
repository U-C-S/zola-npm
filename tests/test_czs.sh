#!/usr/bin/env bash

rm -r ./tests/ZolaSiteTest
mkdir ./tests/ZolaSiteTest

cd ./packages/create-zola-site
npm pack --pack-destination ../../tests/ZolaSiteTest

cd ../../tests/ZolaSiteTest

npm init -y
npm install --prefer-offline --no-audit ./create-zola-site-*.tgz cowsay
npx create-zola-site --force TheZolaSite