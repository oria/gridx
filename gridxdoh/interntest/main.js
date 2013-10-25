define([
	'require',
	'./wrap',
	"intern!bdd",
	"intern/node_modules/dojo/node!./config.js",
	"intern/chai!should"
], function(require, wrap, bdd, config){

require(config.cases, function(){

	var testcases = arguments;

	function findOnlyCase(){
		for(var i = 0; i < testcases.length; ++i){
			for(var suiteName in testcases[i]){
				var cases = testcases[i][suiteName];
				for(var caseName in cases){
					if(/^!/.test(caseName)){
						var suites = {};
						var onlySuite = suites[suiteName] = {};
						onlySuite[caseName.substring(1)] = cases[caseName];
						return [suites];
					}
				}
			}
		}
		return null;
	}
	var onlyCase = findOnlyCase();
	if(onlyCase){
		testcases = onlyCase;
	}

	with(bdd){
		describe('gridx', function(){
			function doSuite(suiteName, cases){
				describe(suiteName, function(){
					for(var caseName in cases){
						doCase(suiteName, caseName, cases[caseName]);
					}
				});
			}

			function doCase(suiteName, caseName, caseFunc){
				var url = config.testPageUrl + "?c=" + encodeURIComponent(suiteName);

				it(caseName, wrap(function(){
					wrap.context = [suiteName, caseName];
					var d = this.remote.
						deleteAllCookies().
						setWindowSize(1024, 768).
						get(url).
						waitForElementByClassName('gridx', 10000);
					return caseFunc.call(d, d);
				}));
			}

			for(var i = 0; i < testcases.length; ++i){
				for(var suiteName in testcases[i]){
					doSuite(suiteName, testcases[i][suiteName]);
				}
			}
		});
	}
});
});

