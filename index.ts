/**
 *
 * @module Settings
 */

import autobind from "autobind-decorator";
import * as localforage from "localforage";
import {cloneDeep} from "lodash";
import {PromiseFn} from "util.promise";
import {splitInTwo} from "util.string";
import {waitPromise} from "util.wait";

const debug = require("debug")("util.settings");
const onChange = require("on-change");

export const wait = waitPromise;

export interface SectionKeyVal {
	[key: string]: any;
}

export interface SectionConfig {
	name: string;
	default: SectionKeyVal;
}

export interface Sections {
	[key: string]: SectionKeyVal;
}

export class Settings {
	private static _instance: Settings = null;
	private _noProxyRoot: Sections = {};
	private _root: Sections = {};

	/**
	 * A factory method that retrieves the instance of the settings object.
	 * It uses a promise to retrieve the instance. The promise resolves to
	 * the reference to the instance object.  This is a singleton pattern
	 * so repeated calls to this method will resolve to the same instance
	 * unless the reset flag is set to true.
	 * @param reset=false {boolean} - if true, then generate a new instance
	 * of the settings.  Typically this should not be used and was only
	 * added to aid in testing.
	 * @return a Promise that resolves to the instance object for the
	 * settings.
	 */
	public static instance(reset: boolean = false) {
		return new Promise(
			(resolve: PromiseFn<Settings>, reject: PromiseFn<string>) => {
				if (!Settings._instance || reset) {
					Settings._instance = new Settings();
					Settings._instance
						.init()
						.then(() => {
							resolve(Settings._instance);
						})
						.catch((err: string) => {
							reject(err);
						});
				} else {
					resolve(Settings._instance);
				}
			}
		);
	}

	/**
	 * Empty private construtor that forces the use of the .instance method
	 * to get a reference to the settings.
	 * @constructor
	 */
	private constructor() {}

	/** @return the read only root object without the proxy overlay */
	get noProxyRoot(): Sections {
		return cloneDeep(this._noProxyRoot);
	}

	/** @return a reference to the settings object that is proxy wrapped */
	get root(): Sections {
		return this._root;
	}

	/** @return the list of sections contained in the settings */
	get sections(): string[] {
		return Object.keys(this._noProxyRoot);
	}

	/**
	 * Reapplies the change proxy on the raw settings object.  A convenience
	 * method to reapply settings after register adds new values.
	 * @private
	 */
	private applyProxyToRoot() {
		this._root = onChange(this._noProxyRoot, this.save);
	}

	/**
	 * Removes all settings.
	 */
	public clear() {
		return new Promise(
			(resolve: PromiseFn<Settings>, reject: PromiseFn<string>) => {
				localforage
					.clear()
					.then(() => {
						this._noProxyRoot = this._root = {};
						resolve(this);
					})
					.catch((err: string) => {
						reject(err);
					});
			}
		);
	}

	/**
	 * Initializes the object when the instance is first created.  This has to
	 * happen outside of the constructor.  This will retrieve all of the current
	 * composite keys from the store and add them to the root.
	 * @private
	 * @return a Promise that resolves to an initialized settings instance.
	 */
	private init() {
		return new Promise(
			(resolve: PromiseFn<Settings>, reject: PromiseFn<string>) => {
				localforage
					.keys()
					.then((keys: any[]) => {
						const promises: Array<Promise<any>> = [];

						for (const compositeKey of keys) {
							promises.push(
								this.parseCompositeKeyAndSet(compositeKey)
							);
						}

						return Promise.all(promises);
					})
					.then(() => {
						this.applyProxyToRoot();
					})
					.then(() => {
						resolve(this);
					})
					.catch((err: string) => {
						reject(err);
					});
			}
		);
	}

	/**
	 * Takes a localforage composite key, parses it into its section and key,
	 * retrieves the value for that composite key, and sets the section/key
	 * in the root object.  A composite key has the following format:
	 *
	 *     "{section}.{key}"  e.g. general.debug
	 *
	 * @private
	 * @param compositeKey {string} - the composite key that will be parsed
	 * and saved in the root object.
	 * @return a Promise object that will parse and set a new key/value pair
	 */
	private parseCompositeKeyAndSet(compositeKey: string) {
		return new Promise(
			(resolve: PromiseFn<any>, reject: PromiseFn<string>) => {
				localforage
					.getItem(compositeKey)
					.then((val: any) => {
						const [section, key] = splitInTwo(compositeKey, ".");

						if (!(section in this._noProxyRoot)) {
							this._noProxyRoot[section] = {
								[key]: val
							};
						} else {
							this._noProxyRoot[section][key] = val;
						}

						resolve(val);
					})
					.catch((err: string) => {
						reject(err);
					});
			}
		);
	}

	/**
	 * Adds a new configuration section to the settings.  The function
	 * expects the input to use the SectionConfig interface.  It can
	 * take a single configuration item or an array of items.  The
	 * Section config is composed of two fields: name and default.
	 * The name represents the section that will be added to the
	 * top level of the settings.  The default attribute contains an
	 * object with key/value pairs that represent the initial default
	 * values for settings within that section.  All settings must be
	 * present within the default.
	 *
	 * @param configs {SectionConfig} - a new section to add to the
	 * settings object.
	 * @return a reference to the settings proxy object (root).
	 */
	@autobind
	public register(configs: SectionConfig | SectionConfig[]): Sections {
		if (!(configs instanceof Array)) {
			configs = [configs];
		}

		for (const config of configs) {
			if (!("name" in config)) {
				throw new Error(
					"Invalid config: no 'name' field in definition"
				);
			}

			if (!("default" in config)) {
				throw new Error(
					"Invalid config: no 'default' field in definition"
				);
			}

			// The values that were loaded from localforage have precedence
			// over new items.
			this._noProxyRoot[config.name] = Object.assign(
				{},
				config.default,
				this._noProxyRoot[config.name]
			);
		}

		this.saveAllKeys();
		this.applyProxyToRoot();

		return this._root;
	}

	/**
	 * Removes a key from a section within the settings.
	 * @param section {string} - the section where the key is located
	 * @param key {string} - the key that will be delete from the section
	 */
	@autobind
	public removeKey(section: string, key: string) {
		const compositeKey = `${section}.${key}`;
		debug(`removing key: ${compositeKey}`);

		localforage
			.removeItem(compositeKey)
			.then(() => {
				delete this._noProxyRoot[section][key];
				this.applyProxyToRoot();
			})
			.catch((err: string) => console.error(err));
	}

	/**
	 * This method is called by the proxy when a property of the root object
	 * is changed.  This will persiste that setting key/valu into the
	 * localforage.
	 * @private
	 * @param path {string} - the "." separate path from the root to the key;
	 * in the object where the save happened.  This generates a unique key
	 * value that will be used in the save.
	 * @param value {any} - the value that will be saved into localforage
	 * @param previousValue {any} - the current value before the save
	 */
	@autobind
	private save(path: string, value: any, previousValue: any) {
		debug("Saving setting %s to %o from %o", path, value, previousValue);

		localforage
			.setItem(path, value)
			.catch((err: string) => console.error(err));
	}

	/**
	 * Iterates through all sections and keys and saves them to local
	 * storage.
	 * @private
	 */
	private saveAllKeys() {
		for (const section of this.sections) {
			for (const key of Object.keys(this._noProxyRoot[section])) {
				const path = `${section}.${key}`;
				this.save(path, this._noProxyRoot[section][key], null);
			}
		}
	}
}

export default Settings;
