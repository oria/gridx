define([
	'dojo/_base/array',
	'dojo/html',
	'dojo/query',
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/modules/Focus',
	'dijit/form/Button'
], function(array, html, query, Memory, Grid, Cache){
	comps = ['Header', 'Row', 'HeaderCell', 'Cell'];
	events = [
		'Click', 'DblClick', 
		'MouseDown', 'MouseUp', 
		'MouseOver', 'MouseOut', 
		'MouseMove', 'ContextMenu',
		'KeyDown', 'KeyPress', 'KeyUp'
	];

	function createStore(){
		var items = array.map(events, function(evt){
			var item = {id: evt};
			array.forEach(comps, function(comp){
				item[comp] = 0;
			});
			return item;
		});
		return new Memory({
			data: items
		});
	}
	store1 = createStore();
	layout1 = array.map(comps, function(comp){
		return {id: comp, name: comp, width: '100px;', field: comp};
	});
	layout1.unshift({id: 'id', width: '100px;', field: 'id', style: 'background-color: #'});

	clear = function(){
		grid.setStore(createStore());
	};


});
