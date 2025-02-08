#!/usr/bin/env node

const { execZola } = require("../dist/exec.js");

execZola(process.argv.slice(1));
