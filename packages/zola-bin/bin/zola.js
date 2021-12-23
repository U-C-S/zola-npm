#!/usr/bin/env node

import { execSync } from "../dist/exec.js";

execSync(process.argv.slice(2));
