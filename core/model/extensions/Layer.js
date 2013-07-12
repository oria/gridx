define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	/*====='../Model',=====*/
	'../_Extension'
], function(declare, lang, json,
	/*=====Model, =====*/
	_Extension){

/*=====
	Model.sort = function(){};

	return declare(_Extension, {
		// summary:
	});
=====*/

	return declare(_Extension, {
		name: 'layer',

		priority: 3,

		constructor: function(model, args){
		},

		//Public--------------------------------------------------------------
		byIndex: function(index, parentId){
		},

		indexToId: function(index, parentId){
		},

		idToIndex: function(id){
		},

		size: function(parentId){
		},

		when: function(){
		},

		setLayer: function(){
		},

		layerUp: function(){
		},

		layerId: function(){
		},

		//Private--------------------------------------------------------------

	});
});
