# util.settings

> Settings management singleton for a web application

[![build](https://circleci.com/gh/jmquigley/util.settings/tree/master.svg?style=shield)](https://circleci.com/gh/jmquigley/util.settings/tree/master)
[![analysis](https://img.shields.io/badge/analysis-tslint-9cf.svg)](https://palantir.github.io/tslint/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![testing](https://img.shields.io/badge/testing-jest-blue.svg)](https://facebook.github.io/jest/)
[![NPM](https://img.shields.io/npm/v/util.settings.svg)](https://www.npmjs.com/package/util.settings)
[![Coverage Status](https://coveralls.io/repos/github/jmquigley/util.settings/badge.svg?branch=master)](https://coveralls.io/github/jmquigley/util.settings?branch=master)


## Installation

This module uses [yarn](https://yarnpkg.com/en/) to manage dependencies and run scripts for development.

To install as an application dependency:
```
$ yarn add util.settings
```

To build the app and run all tests:
```
$ yarn run all
```

This module uses [puppeteer](https://github.com/GoogleChrome/puppeteer).  If working in Linux, see this [troubleshooting guide](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md) for setting up "Chrome Linux Sandbox".


## Overview
This module contains code to manage and persist settings for a web application using [localforage](https://localforage.github.io/localForage/).


## API

#### functions
