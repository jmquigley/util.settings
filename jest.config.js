module.exports = {
	bail: true,
	collectCoverage: true,
	coveragePathIgnorePatterns: ["<rootDir>/node_modules"],
	moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
	notify: false,
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	testPathIgnorePatterns: [
		"<rootDir>/node_modules",
		"<rootDir>/__tests__/__mocks__"
	],
	verbose: true
};
