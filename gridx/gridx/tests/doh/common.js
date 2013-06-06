dojo.provide('gridx.tests.robot.common');
dojo.require("dojo.robotx");

var grid = (function(){
	return function(){
		return window.frames[1].dijit.byId('grid');
	};
})();

var w = (function(){
	return function(){
		return window.frames[1];
	};
})();
