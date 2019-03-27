"use strict";

import {Sections, Settings} from "../index";
import puppeteer from "puppeteer";

let browser: any = null;
let page: any = null;

beforeAll(async () => {
	browser = await puppeteer.launch();
	page = await browser.newPage();
	await page.goto("http://localhost:4000");
});

afterAll(async () => {
	await browser.close();
	page = browser = null;
});

test("Retrieve an instance of the settings class", () => {
	expect(Settings.instance()).toBeDefined();

	const obj: Sections = {
		section1: {
			key1: "foo",
			key2: "bar"
		},
		section2: {
			key1: "foo",
			key2: "bar"
		}
	};

	expect(obj).toBeDefined();
});

test("Retrieve 3 updated fields from webpage replaced with stored settings", async () => {
	let html = await page.$eval("#f1", (e) => e.innerHTML);
	expect(html).toBe("foo");

	html = await page.$eval("#f2", (e) => e.innerHTML);
	expect(html).toBe("bar");

	html = await page.$eval("#f3", (e) => e.innerHTML);
	expect(html).toBe("baz");
});
