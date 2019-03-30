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

To build the production version of the app and run all tests:
```
$ yarn run all
```

This module uses [puppeteer](https://github.com/GoogleChrome/puppeteer).  If working in Linux, see this [troubleshooting guide](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md) for setting up "Chrome Linux Sandbox".  The automated test cases will start an express server, use puppeteer to load the page, run some confirming tests, and then shutdown the server once complete.  Manual testing can also be performed after building the application by starting the server:

```
$ yarn start
```

This will start a localhost server on port 4000.  To stop the server use:

```
$ yarn stop
```


## Overview
This module contains code to manage and persist settings for a web application using [localforage](https://localforage.github.io/localForage/).  A section is registered with the settings instance singleton using the register function.  These settings are then placed into a simple object that is monitored by a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) using the [on-change](https://github.com/sindresorhus/on-change) library.  When the application makes changes to this object the changes are automatically persisted to local storage using the [localforage](https://localforage.github.io/localForage/) package.

### Usage

To retrieve the Settings object instance and register new configuration options, use the `.instance()` Promise factory:

```javascript
import {SectionConfig, Settings} from "util.settings";

Settings.instance().then((instance: Settings) => {

    instance.register({
		name: "general",
		default: {
			key1: "defaultValue1",
			key2: "defaultValue2",
			key3: "defaultValue3"
		}
    });

    window.settings = instance.root;
});
```

The instance call is a [thenable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then).  When the promise instance is resolved it is initialized and passed to `then`.  During this initialization previous settings are retrieved from localforage and saved in the root settings object.





## API

#### functions


#### properties
