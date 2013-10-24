define([
	'require',
	'./syncwd',
	"intern!bdd",
	"intern/node_modules/dojo/node!fs",
	"intern/node_modules/dojo/node!path",
	"intern/node_modules/dojo/node!./config.js",
	"intern/node_modules/dojo/node!should"
], function(require, Syncwd, bdd, fs, path, config){

var s = new Syncwd();

require(config.cases, function(){

	var testcases = [].slice.apply(arguments);

	if(!fs.existsSync(config.screenshotDir)){
		fs.mkdirSync(config.screenshotDir);
	}
	if(!fs.existsSync(config.refScreenshotDir)){
		fs.mkdirSync(config.refScreenshotDir);
	}

	function getUtil(browser, wdSync, testSuitName, testCaseName){
		var browserArgs = browser.sessionCapabilities();
		var names = [testSuitName, testCaseName];
		var scrollerOffsetH = 9;
		var scrollerOffsetV = 21;
		if(browserArgs.browserName == 'internetexplorer'){
			scrollerOffsetH = 10;
			scrollerOffsetV = 50;
		}
		var screenshotDir = path.join(config.screenshotDir, browserArgs.browserName);
		if(!fs.existsSync(screenshotDir)){
			fs.mkdirSync(screenshotDir);
		}
		var refScreenshotDir = path.join(config.refScreenshotDir, browserArgs.browserName);
		if(!fs.existsSync(refScreenshotDir)){
			fs.mkdirSync(refScreenshotDir);
		}
		return {
			takeScreenshot: function(name){
				var picName = names.concat(name !== undefined ? [name] : []).join('-') + '.png';
				var picPath = path.join(config.screenshotDir, browserArgs.browserName, picName);
				browser.execute('hideMiscellany();');
				wdSync.sleep(100);
				var pic = browser.takeScreenshot();
				fs.writeFileSync(picPath, pic, "base64");
				browser.execute('showMiscellany();');
				return pic;
			},
			assertScreenshot: function(name){
				var picName = names.concat(name !== undefined ? [name] : []).join('-') + '.png';
				var picPath = path.join(config.screenshotDir, browserArgs.browserName, picName);
				var refPicPath = path.join(config.refScreenshotDir, browserArgs.browserName, picName);
				browser.execute('hideMiscellany();');
				var pic = browser.takeScreenshot();
				var needCompare = 0;
				if(fs.existsSync(refPicPath) && !config.isRecording){
					needCompare = 1;
					var refPic = fs.readFileSync(refPicPath, 'base64');
					var picsAreEqual = pic == refPic;
				}else{
					fs.writeFileSync(refPicPath, pic, 'base64');
				}
				fs.writeFileSync(picPath, pic, 'base64');
				browser.execute('showMiscellany();');
				if(needCompare){
					picsAreEqual.should.be.ok;
				}
			},
			vScroll: function(start, distance){
				var element = browser.elementByCss('.gridxVScroller');
				browser.moveTo(element, scrollerOffsetH, scrollerOffsetV + start);
				browser.buttonDown();
				wdSync.sleep(500);
				browser.moveTo(element, scrollerOffsetH, scrollerOffsetV + start + distance);
				wdSync.sleep(500);
				browser.buttonUp();
				browser.moveTo(browser.elementByTagName('body'), 0, 0);
				wdSync.sleep(500);
			},
			hScroll: function(start, distance){
				var element = browser.elementByCss('.gridxHScrollerInner');
				var size = element.getSize();
				browser.moveTo(element, scrollerOffsetV + start, scrollerOffsetH);
				browser.buttonDown();
				wdSync.sleep(500);
				browser.moveTo(element, scrollerOffsetV + start + distance, scrollerOffsetH);
				wdSync.sleep(500);
				browser.buttonUp();
				browser.moveTo(browser.elementByTagName('body'), 0, 0);
				wdSync.sleep(500);
			}
		};
	}

	with(bdd){
		describe('gridx', function(){
			before(s.prepareBrowser(function(){
				s.browser.setWindowSize(1024, 768);
			}));

			function doSuite(suiteName, cases){
				describe(suiteName, function(){
					for(var caseName in cases){
						doCase(suiteName, caseName, cases[caseName]);
					}
				});
			}

			function doCase(suiteName, caseName, caseFunc){
				var url = config.testPageUrl + "?c=" + encodeURIComponent(suiteName);

				it(caseName, s.wrapTest(function(){
					//clear cookie
					s.browser.deleteAllCookies();
					//load page
					s.browser.get(url);
					//reset mouse position
					var body = s.browser.elementByTagName('body');
					s.browser.moveTo(body, 0, 0);
					//wait for gridx
					s.browser.waitForElementByClassName('gridx', 10 * 1000);
					//do test case
					var util = getUtil(s.browser, s.wd, suiteName, caseName);
					caseFunc(s.browser, s.wd, util);
				}));
			}

			for(var i = 0; i < testcases.length; ++i){
				for(var suiteName in testcases[i]){
					doSuite(suiteName, testcases[i][suiteName]);
				}
			}

			after(s.quitBrowser());
		});
	}
});
});

