module.exports = {
	testPageUrl: "http://localhost/git/dojoprjs/gridxdoh/tests/testcases.html",
	screenshotDir: __dirname + "/../tests/cases/screenshots",
	refScreenshotDir: __dirname + "/../tests/cases/ref-screenshots",
	testCaseTimeout: 5 * 60 * 1000,
	gridxCreationTimeout: 2 * 60 * 1000,
	cases: [
		'../tests/cases/other_wd.js',
		'../tests/cases/mobile_wd.js'
	]
};
