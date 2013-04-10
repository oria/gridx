require([
	'dojo/parser',
	'dojo/_base/Deferred',
	'dojo/_base/array',
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'dojo/domReady!'
], function(parser, Deferred, array, Memory){
	var comps = ['Header', 'Row', 'HeaderCell', 'Cell'];
	var events = [
		'Click', 'DblClick',
		'MouseDown', 'MouseUp',
		'MouseOver', 'MouseOut',
		'MouseMove', 'ContextMenu',
		'KeyDown', 'KeyPress', 'KeyUp'
	];

	createStore = function(){
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
	};
	store = createStore();
	layout = array.map(comps, function(comp){
		return {id: comp, name: comp, width: '100px;', field: comp};
	});
	layout.unshift({id: 'id', width: '100px;', field: 'id', style: 'background-color: #'});

	Deferred.when(parser.parse(), function(){
		array.forEach(comps, function(comp){
			array.forEach(events, function(evt){
				var evtName = 'on' + comp + evt;
				grid.connect(grid, evtName, function(e){
					var cell = grid.cell(evt, comp);
					cell.setRawData(parseInt(cell.data(), 10) + 1);
				});
			});
		});
	});
});
