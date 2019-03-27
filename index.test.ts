"use strict";

import {Settings} from "./index";

test("Base empty test case", () => {
	expect(Settings.instance()).toBeDefined();
});
