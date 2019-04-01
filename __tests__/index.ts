"use strict";

import {OrderedSet} from "immutable";
import assert from "power-assert";
import puppeteer from "puppeteer";
import Settings, {SectionConfig, wait} from "../index";

import * as localforage from "localforage";
jest.mock("localforage");

const debug = require("debug")("util.settings.test");

let browser: any = null;
let page: any = null;

afterAll(async () => {
	await browser.close();
	page = browser = null;
});

afterEach(() => {
	jest.resetModules();
});

beforeAll(async () => {
	browser = await puppeteer.launch({
		args: ["--no-sandbox", "--disable-setuid-sandbox"]
	});

	page = await browser.newPage();
	await page.goto("http://localhost:4000");
	await wait(3);
});

beforeEach(() => {
	localforage.initKeystore();
});

test("Retrieve an instance of the settings class", async () => {
	const instance = await Settings.instance(true)
		.then((instance: Settings) => {
			assert(instance);
			assert(instance.sections);
			assert(instance.root);

			debug("test 1 settings: %O", instance.root);

			const newSettings: SectionConfig[] = [
				{
					name: "section1",
					default: {
						key1: "foo",
						key2: "bar"
					}
				},
				{
					name: "section2",
					default: {
						key1: "foo",
						key2: "bar"
					}
				}
			];

			assert(newSettings);

			const settings = instance.register(newSettings);
			assert(settings);
			assert(instance.sections);

			debug("settings: %O", settings);

			assert(instance.sections.length === 3);

			expect(settings).toMatchSnapshot();
			expect(instance.noProxyRoot).toMatchSnapshot();

			return instance.clear();
		})
		.catch((err: string) => console.error(err));
});

test("Use a single config instance with register", async () => {
	const instance = await Settings.instance(true)
		.then((instance) => {
			assert(instance);

			debug("test 2 settings: %O", instance.root);

			const newSettings: SectionConfig = {
				name: "section3",
				default: {
					key1: "foo",
					key2: "bar"
				}
			};

			assert(newSettings);

			const settings = instance.register(newSettings);
			assert(settings);
			assert(instance.sections);
			assert(instance.sections.length === 2);

			expect(settings).toMatchSnapshot();
			expect(instance.noProxyRoot).toMatchSnapshot();

			return instance.clear();
		})
		.catch((err: string) => console.error(err));
});

test("Use immutable with a complex type in settings", async () => {
	const instance = await Settings.instance(true)
		.then((instance) => {
			assert(instance);

			debug("test immutable settings: %O", instance.root);

			const newSettings: SectionConfig = {
				name: "immutable",
				default: {
					key1: OrderedSet<string>()
				}
			};

			assert(newSettings);

			const settings = instance.register(newSettings);
			assert(settings);
			assert(instance.sections);
			assert(instance.sections.length === 2);

			return instance;
		})
		.then((instance) => {
			const settings = instance.root;
			settings["immutable"]["key1"] = settings["immutable"]["key1"].add(
				"test"
			);
			expect(settings).toMatchSnapshot();
			return instance.clear();
		})
		.catch((err: string) => console.error(err));
});

test("Remove a key from the settings", async () => {
	return await Settings.instance(true)
		.then((instance) => {
			assert(instance);
			expect(instance.root).toMatchSnapshot();
			instance.removeKey("testing", "key1");

			// typically one would not use this wait when performing the delete
			// we would just let the promise go off and resolve.  Only waiting
			// for testing purposes.
			return wait(2, instance);
		})
		.then((instance) => {
			expect(instance.root).toMatchSnapshot();
			return instance.clear();
		})
		.catch((err: string) => console.error(err));
});

test("Pass invalid configuration object to register (no name)", async () => {
	const instance = await Settings.instance();
	assert(instance);
	await instance.clear();

	const newSettings: SectionConfig = {
		default: {
			key1: "foo",
			key2: "bar"
		}
	};

	assert(newSettings);

	expect(() => {
		const settings = instance.register(newSettings);
	}).toThrowError("Invalid config: no 'name' field in definition");
});

test("Pass invalid configuration object to register (no default)", async () => {
	const instance = await Settings.instance();
	assert(instance);
	await instance.clear();

	const newSettings: SectionConfig = {
		name: "section1"
	};

	assert(newSettings);

	expect(() => {
		const settings = instance.register(newSettings);
	}).toThrowError("Invalid config: no 'default' field in definition");
});

// puppeteer integration test

test("Retrieve 3 updated fields from webpage replaced with stored settings", async () => {
	let html = await page.$eval("#origKey1", (e) => e.innerHTML);
	expect(html).toBe("defaultValue1");

	html = await page.$eval("#origKey2", (e) => e.innerHTML);
	expect(html).toBe("defaultValue2");

	html = await page.$eval("#origKey3", (e) => e.innerHTML);
	expect(html).toBe("defaultValue3");

	html = await page.$eval("#newKey1", (e) => e.innerHTML);
	expect(html).toBe("updatedValue1");

	html = await page.$eval("#newKey2", (e) => e.innerHTML);
	expect(html).toBe("updatedValue2");

	html = await page.$eval("#newKey3", (e) => e.innerHTML);
	expect(html).toBe("updatedValue3");
});
