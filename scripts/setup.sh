#!/bin/bash

set -e
set -x

yarn
npx patch-package
npx pod-install
