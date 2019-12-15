# util.settings

> Settings management singleton for a web application

[![build](https://github.com/jmquigley/util.settings/workflows/build/badge.svg)](https://github.com/jmquigley/util.settings/actions)
[![analysis](https://img.shields.io/badge/analysis-tslint-9cf.svg)](https://palantir.github.io/tslint/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![testing](https://img.shields.io/badge/testing-jest-blue.svg)](https://facebook.github.io/jest/)
[![NPM](https://img.shields.io/npm/v/util.settings.svg)](https://www.npmjs.com/package/util.settings)


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

Also note when building this module one may see the warning "npm WARN lifecycle The node binary used for scripts is ...".  To get rid of this warning in the build environment add the following to `~/.npmrc`:

```
scripts-prepend-node-path=true
```

This can also be done via the CLI with:

```
$ npm config set scripts-prepend-node-path true
```

## Overview
This module contains code to manage and persist settings for a web application using [localforage](https://localforage.github.io/localForage/).  A section is registered with the settings instance singleton using the register function.  These settings are then placed into a simple object that is monitored by a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) using the [on-change](https://github.com/sindresorhus/on-change) library.  When the application makes changes to this object the changes are automatically persisted to local storage using the [localforage](https://localforage.github.io/localForage/) package.


## Usage

To retrieve the Settings object instance and register new configuration options, use the `.instance()` Promise factory:

```javascript
import {SectionConfig, Settings} from "util.settings";

Settings.instance()
    .then((instance: Settings) => {

        const newSettings: SectionConfig = {
		    name: "general",
		    default: {
			    key1: "defaultValue1",
			    key2: "defaultValue2",
			    key3: "defaultValue3"
            }
        };

        instance.register(newSettings);
        window.settings = instance.root;
    })
    .then(() => {
        // initialize the application
        // use settings like:
        //     `window.settings.general.key1`
        //     `window.settings["general"]["key1"]
    });
```

The `instance()` call is a [thenable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then).  When the promise instance is exectued it is initialized and passed to `then`.  During this initialization previous settings are retrieved from [localforage](https://localforage.github.io/localForage/) and saved in the root settings object.  Inside of `then` the `register()` is called to add a section to the settings.  The example above adds a new section named `general` with three settings keys.  If the section already exists it is used instead of adding a new section.

The settings object is then retrieved and set globally on the window via a call to `instance.root`.  Each of the setting can then be retrieved like any normal Javascript object in `window.settings`, e.g. `window.settings.general.key1`.  Changes that are made to this settings object are captured via a Proxy and automatically persisted to the localforage.  The following [data types](https://localforage.github.io/localForage/#data-api-setitem) can be used:

- Array
- ArrayBuffer
- Blob
- Float32Array
- Float64Array
- Int8Array
- Int16Array
- Int32Array
- Number
- Object
- Uint8Array
- Uint8ClampedArray
- Uint16Array
- Uint32Array
- String

Note that there is an issue with keys that contain complex objects (e.g. An array of strings associated to a key).  If the underlying object is manipulated, then the Proxy will not properly invoke the associated save.  This can be worked around by cloning the underlying object, manipulating the clone, and then assigning the clone back to the key.

An idea to fix this was to use [ImmutableJS](https://github.com/immutable-js/immutable-js), but that will not work in this library because this object type is not properly serialized by [localforage](https://localforage.github.io/localForage/).


## API

#### functions

- [.clear()](docs/index.md#module_Settings.Settings+clear)
- [.register()](docs/index.md#module_Settings.Settings+register)
- [.removeKey()](docs/index.md#module_Settings.Settings+removeKey)

#### properties

- `.noProxyRoot` - a read only version of the settings object without the proxy overlay.  Changes to this object will NOT persist.
- `.root` - a reference to the settings object with proxy overlay.  This should be used to interact with all settings.
- `.sections` - an array of all setions contained within the settings object.
