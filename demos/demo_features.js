require([
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'dijit/form/TimeTextBox',
	'dijit/form/CheckBox',
	'gridx/modules/ColumnLock',
	'gridx/modules/extendedSelect/Cell',
	'gridx/modules/RowHeader',
	'gridx/modules/select/Row',
	'gridx/modules/IndirectSelect',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
	'gridx/modules/filter/FilterBar',
	'gridx/modules/Filter',
	'dojo/domReady!'
], function(MemoryStore, Grid, Cache, dataSource){

	var data = dataSource.getData(30),
		store = new MemoryStore({
			data: data.items
		}),
		layout = [
			{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px', editable: true},
			{id: 'Name', field: 'Name', name: 'Name', width: '80px', editable: true},
			{id: 'Artist', field: 'Artist', name: 'Artist', width: '120px', editable: true},
			{id: 'Year', field: 'Year', name: 'Year', width: '80px', editable: true},
			{id: 'Album', field: 'Album', name: 'Album', width: '160px', editable: true},
			{id: 'Length', field: 'Length', name: 'Length', width: '80px', editable: true, 
				editor: 'dijit.form.TimeTextBox',
				editorArgs: {
					fromEditor: function(v, cell){
						if(!v)return cell.data();
						var m = v.getHours(), s = v.getMinutes();
						m = m < 10 ? m + '0' : m;
						s = s < 10 ? s + '0' : s;
						return m + ':' + s; //If no color selected, use the orginal one.
					},
					toEditor: function(v){
						return new Date();
					}
			}},
			{id: 'Track', field: 'Track', name: 'Track', width: '80px', editable: true},
			{id: 'Composer', field: 'Composer', name: 'Composer', width: '160px', editable: true},
			{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '160px', editable: true},
			{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '120px', editable: true},
			{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px', editable: true, alwaysEditing: true, 
				editor: "dijit.form.CheckBox",
				editorArgs: {
					fromEditor: function(v, cell){
						return v ? 'true' : 'false';
					},
					toEditor: function(v){
						return v;
					}
				}
			}
		];



	var grid = window.grid1 = new Grid({
		style: 'width: 800px; height: 500px;',
		cacheClass: "gridx/core/model/cache/Sync",
		store: store,
		structure: layout,
		modules: [
			{
				moduleClass: 'gridx/modules/ColumnLock',
				count: 2
			},
			'gridx/modules/extendedSelect/Cell',
			'gridx/modules/select/Row',
			'gridx/modules/RowHeader',
			'gridx/modules/IndirectSelect',
			'gridx/modules/CellWidget',
			'gridx/modules/Edit',
			'gridx/modules/filter/FilterBar',
			'gridx/modules/Filter'
		]
	});

	document.body.appendChild(grid.domNode);

	grid.startup();
});