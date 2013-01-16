var siteName = 'GridX';

// Set currentVersion as a global variable, since it's accessed from api.js
var currentVersion = '1.0';

var page = '';

require([
	"dojo/dom",
	"dojo/_base/fx",
	"dojo/ready",
	"dijit/registry",
	"api/api"
], function(dom, fx, ready, registry){
	ready(function(){
		setTimeout(function(){
			var loader = dom.byId("loader");
			fx.fadeOut({
				node: loader,
				duration: 500,
				onEnd: function(){
					loader.style.display = "none";
				}
			}).play();
		}, 500);
	});
});
