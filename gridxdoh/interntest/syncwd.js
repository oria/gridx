define([
	'intern/node_modules/dojo/Deferred',
	"intern/node_modules/dojo/node!wd-sync"
], function(Deferred, wdSync){

	function Syncwd(){
	}

	var prot = Syncwd.prototype;

	prot.wd = wdSync;

	prot.prepareBrowser = function(cb){
		var t = this;
		return function(){
			var browserEnvironment = this.remote._desiredEnvironment; // the current browser environment
			var client = wdSync.remote();
			t.browser = client.browser;
			t.sync = client.sync;
			var args = arguments;
			return t.wrap(function(){
				t.browser.init(browserEnvironment);
				if(cb){
					cb(args);
				}
			})();
		};
	};

	prot.wrap = function(cb){
		var t = this;
		return function(){
			var context = this;
			var d = new Deferred();
			t.sync(function(){
				try{
					cb.apply(context, arguments);
					d.resolve();
				}catch(e){
					d.errback(e);
				}
			});
			return d;
		};
	};

	prot.wrapTest = function(cb, timeout){
		var t = this;
		return function(){
			var sessionId = this.remote.sessionId;
			var dfd = this.async(timeout || 60000);
			t.sync(function(){
				try{
					cb();
				}catch(e){
					dfd.reject(e);
				}finally{
					// retrieve and publish the coverage data
					coverageData = t.browser.execute("return typeof __internCoverage !== 'undefined' && JSON.stringify(__internCoverage)");
					if(coverageData){
						topic.publish("/coverage", sessionId, JSON.parse(coverageData));
					}
					if(!dfd.isRejected()){
						dfd.resolve();
					}
				}
			});
			return dfd;
		};
	};

	prot.quitBrowser = function(cb){
		var t = this;
		return t.wrap(function(){
			if(cb){
				cb();
			}
			t.browser.quit();
		});
	};

	return Syncwd;
});
