/**
 * A set of jest mock functions for the [localforage](https://localforage.github.io/localForage/)
 * module.  Jest will override the real functions with these, since they only
 * really exist within the browser.  This allows for unit testing the settings
 * code without needed the real localforage.  This does not mock all functions
 * for that library.
 */

import {PromiseFn} from "util.promise";
import {Sections} from "../../index";

const debug = require("debug")("util.settings.localforage");

module.exports = {
	keystore: {
		"testing.key1": "testkey1",
		"testing.key2": "testkey2",
		"testing.key3": "testkey3"
	},
	initKeystore: function() {
		this.keystore = this.default.keystore = {
			"testing.key1": "testkey1",
			"testing.key2": "testkey2",
			"testing.key3": "testkey3"
		};
	},
	clear: function() {
		return new Promise((resolve: PromiseFn<void>) => {
			this.keystore = this.default.keystore;
			debug("clear() -> keystore: %O", this.keystore);
			resolve();
		});
	},
	getItem: function(path: string) {
		return new Promise(
			(resolve: PromiseFn<any>, reject: PromiseFn<string>) => {
				if (path in this.keystore) {
					resolve(this.keystore[path]);
				} else {
					reject(`${path} not in keystore`);
				}
			}
		);
	},
	keys: function() {
		return new Promise(
			(resolve: PromiseFn<string[]>, reject: PromiseFn<string>) => {
				const keys = Object.keys(this.keystore);
				if (keys.length > 0) {
					resolve(keys);
				} else {
					resolve([]);
				}
			}
		);
	},
	ref: function() {
		return this;
	},
	removeItem: function(path: string) {
		return new Promise(
			(resolve: PromiseFn<void>, reject: PromiseFn<string>) => {
				if (path in this.keystore) {
					delete this.keystore[path];
					resolve();
				} else {
					reject(`${path} not in keystore`);
				}
			}
		);
	},
	setItem: function(path: string, value: any) {
		return new Promise(
			(resolve: PromiseFn<any>, reject: PromiseFn<string>) => {
				if (path) {
					this.keystore[path] = value;
					resolve(this.keystore[path]);
				} else {
					reject("no keystore to set");
				}
			}
		);
	}
};

module.exports.initKeystore.bind(module.exports);
module.exports.ref.bind(module.exports);

export default module.exports;

// const keystore: any = initKeystore();
//
// export function initKeystore() {
// 	keystore = {
// 		"testing.key1": "testkey1",
// 		"testing.key2": "testkey2",
// 		"testing.key3": "testkey3"
// 	};
//
// 	return keystore;
// }
//
// export function clear() {
// 	return new Promise((resolve: PromiseFn<void>) => {
// 		keystore = initKeystore();
// 		debug("clear() -> keystore: %O", keystore);
// 		resolve();
// 	});
// }
//
// export function getItem(path: string) {
// 	return new Promise((resolve: PromiseFn<any>, reject: PromiseFn<string>) => {
// 		if (path in keystore) {
// 			resolve(keystore[path]);
// 		} else {
// 			reject(`${path} not in keystore`);
// 		}
// 	});
// }
//
// export function keys() {
// 	return new Promise(
// 		(resolve: PromiseFn<string[]>, reject: PromiseFn<string>) => {
// 			const keys = Object.keys(keystore);
// 			if (keys.length > 0) {
// 				resolve(keys);
// 			} else {
// 				resolve([]);
// 			}
// 		}
// 	);
// }
//
// export function removeItem(path: string) {
// 	return new Promise(
// 		(resolve: PromiseFn<void>, reject: PromiseFn<string>) => {
// 			if (path in keystore) {
// 				delete keystore[path];
// 				resolve();
// 			} else {
// 				reject(`${path} not in keystore`);
// 			}
// 		}
// 	);
// }
//
// export function setItem(path: string, value: any) {
// 	return new Promise((resolve: PromiseFn<any>, reject: PromiseFn<string>) => {
// 		if (path) {
// 			keystore[path] = value;
// 			resolve(keystore[path]);
// 		} else {
// 			reject("no keystore to set");
// 		}
// 	});
// }
