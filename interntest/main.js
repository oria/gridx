define([
	'require',
	'./wrap',
	"intern!bdd",
	"intern/node_modules/dojo/node!./config.js",
	"intern/node_modules/dojo/node!./cases.js"
], function(require, wrap, bdd, config, casefiles){

require(casefiles, function(){

	function findSuites(testcases){
		var suites = {};
		var found = 0;
		for(var i = 0; i < testcases.length; ++i){
			for(var suiteName in testcases[i]){
				if(/^@/.test(suiteName)){
					suites[suiteName.substring(1)] = testcases[i][suiteName];
					found = 1;
				}
			}
		}
		return found ? [suites] : testcases;
	}
	function findCases(testcases){
		var suites = {};
		var found = 0;
		for(var i = 0; i < testcases.length; ++i){
			for(var suiteName in testcases[i]){
				var cases = testcases[i][suiteName];
				for(var caseName in cases){
					if(/^@/.test(caseName)){
						var suite = suites[suiteName] = suites[suiteName] || {};
						suite[caseName.substring(1)] = cases[caseName];
						found = 1;
					}
				}
			}
		}
		return found ? [suites] : testcases;
	}
	var testcases = findCases(findSuites(arguments));

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
					var pos = caseName.indexOf('[');
					if(pos >= 0){
						caseName = caseName.substring(0, pos);
					}
					wrap.context = [suiteName, caseName];
					this.async(Math.max(config.testCaseTimeout, config.gridxCreationTimeout) || 5 * 60 * 1000);
					var d = this.remote.
						deleteAllCookies().
						setWindowSize(1024, 768).
						get(url).
						waitForElementById('loadFinishFlag', 10000).
						hasElementByClassName('loadFinishFlagFail').
						then(function(notestcase){
							if(!notestcase){
								var dd = d.waitForElementByClassName('gridx', config.gridxCreationTimeout || 60 * 1000);
								return caseFunc.call(d, d);
							}
						});
					return d;
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

