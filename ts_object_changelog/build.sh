#!/bin/bash
../node_modules/.bin/browserify ts/index.ts --debug -p [ tsify --noImplicitAny ] > js/bundle.js
