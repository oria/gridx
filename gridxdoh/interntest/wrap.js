define([
	"intern/node_modules/dojo/node!fs",
	"intern/node_modules/dojo/node!path",
	"intern/node_modules/dojo/node!./config.js",
	"intern/node_modules/dojo/node!wd",
	"intern/chai!assert"
], function(fs, path, config, wd, assert){

	if(!fs.existsSync(config.screenshotDir)){
		fs.mkdirSync(config.screenshotDir);
	}
	if(!fs.existsSync(config.refScreenshotDir)){
		fs.mkdirSync(config.refScreenshotDir);
	}

	function getPicPaths(name, remote){
		var names = wrap.context.slice();
		if(name){
			names.push(name);
		}
		var browserName = remote._desiredEnvironment.browserName;
		var picName = names.join('-') + '.png';

		var screenshotDir = path.join(config.screenshotDir, browserName);
		if(!fs.existsSync(screenshotDir)){
			fs.mkdirSync(screenshotDir);
		}
		var refScreenshotDir = path.join(config.refScreenshotDir, browserName);
		if(!fs.existsSync(refScreenshotDir)){
			fs.mkdirSync(refScreenshotDir);
		}

		return {
			picPath: path.join(screenshotDir, picName),
			refPicPath: path.join(refScreenshotDir, picName)
		};
	}

	function saveScreenshot(name){
		var picPaths = getPicPaths(name, this);
		var picData;
		return this.execute('hideMiscellany();').
			takeScreenshot().
			then(function(pic){
				picData = pic;
				fs.writeFileSync(picPaths.picPath, pic, "base64");
			}).
			execute('showMiscellany();').
			then(function(){
				return picData;
			});
	}

	function assertScreenshot(name){
		var picPaths = getPicPaths(name, this);
		var picData;
		return this.execute('hideMiscellany();').
			takeScreenshot().
			then(function(pic){
				picData = pic;
			}).
			execute('showMiscellany();').
			then(function(){
				var needCompare = 0;
				if(fs.existsSync(picPaths.refPicPath) && !config.isRecording){
					needCompare = 1;
					var refPic = fs.readFileSync(picPaths.refPicPath, 'base64');
					var picsAreEqual = picData == refPic;
				}else{
					fs.writeFileSync(picPaths.refPicPath, picData, 'base64');
				}
				fs.writeFileSync(picPaths.picPath, picData, 'base64');
				if(needCompare){
					assert(picsAreEqual, 'screenshot changed');
				}
				return picData;
			});
	}

	function getScrollArgs(remote){
		return {
			offsetH: 9,
			offsetW: 21
		};
	}

	function vScroll(start, distance){
		var scroll = getScrollArgs(this);
		return this.end().
			elementByCss('.gridxVScroller').
			moveTo(scroll.offsetH, scroll.offsetW + start).
			buttonDown().
			moveTo(scroll.offsetH, scroll.offsetW + start + distance).
			buttonUp().
			end().
			elementByTagName('body').
			moveTo(0, 0).
			end();
	}

	function hScroll(start, distance){
		var scroll = getScrollArgs(this);
		return this.end().
			elementByCss('.gridxHScrollerInner').
			moveTo(scroll.offsetW + start, scroll.offsetH).
			buttonDown().
			moveTo(scroll.offsetW + start + distance, scroll.offsetH).
			buttonUp().
			end().
			elementByTagName('body').
			moveTo(0, 0).
			end();
	}

	function wrap(cb){
		return function(){
			var remote = this.remote;
			remote.saveScreenshot = saveScreenshot;
			remote.assertScreenshot = assertScreenshot;
			remote.vScrollGridx = vScroll;
			remote.hScrollGridx = hScroll;
			remote.SPECIAL_KEYS = wd.SPECIAL_KEYS;
			return cb && cb.apply(this, arguments);
		};
	}

	wrap.context = [];
	return wrap;
});
