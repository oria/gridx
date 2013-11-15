define([
	'dojo/_base/array',
	'dojo/store/Memory',
	'./_util'
], function(array, Memory, util){

	var comps = ['Header', 'Row', 'HeaderCell', 'Cell'];
	var events = [
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
	var store = createStore();
	var layout = array.map(comps, function(comp){
		return {id: comp, name: comp, width: '100px;', field: comp};
	});
	layout.unshift({id: 'id', width: '100px;', field: 'id', style: 'background-color: #'});

	return [
		{
			title: 'mouse and key events',
			cache: 'gridx/core/model/cache/Sync',
			store: createStore(),
			structure: layout,
			modules: [],
			props: {
				autoWidth: true,
				autoHeight: true,
				bodyRowHoverEffect: false
			},
			onCreated: function(grid){
				array.forEach(comps, function(comp){
					array.forEach(events, function(evt){
						var evtName = 'on' + comp + evt;
						grid.connect(grid, evtName, function(e){
							var cell = grid.cell(evt, comp);
							cell.setRawData(parseInt(cell.data(), 10) + 1);
						});
					});
				});
				util.addButton('clear counter', function(){
					grid.setStore(createStore());
				});
			}
		}
	];
});
