require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane',

	'dijit/Menu',
	"dijit/MenuItem",
	"dijit/PopupMenuItem",
	"dijit/CheckedMenuItem",
	"dijit/MenuSeparator",
	'dijit/form/CheckBox'
], function(Grid, Cache, dataSource, storeFactory, modules, TestPane){

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource,
			size: 100
		}),
		structure: dataSource.layouts[0],
		modules: [
			modules.VirtualVScroller,
			modules.Focus,
			modules.RowHeader,
			modules.ExtendedSelectCell,
			modules.ExtendedSelectColumn,
			modules.ExtendedSelectRow,
			modules.Menu
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();
	
	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');
	
	tp.addTestSet('Bind Menu Actions', [
		'<input id="grid-grid" data-dojo-id="grid-grid" data-dojo-type="dijit.form.CheckBox" data-dojo-props="onChange: bindMenu">Grid Menu</input><br/>',
		'<input id="body-grid" data-dojo-id="body-grid" data-dojo-type="dijit.form.CheckBox" data-dojo-props="onChange: bindMenu">Body Menu</input><br/>',
		'<input id="header" data-dojo-id="header" data-dojo-type="dijit.form.CheckBox" data-dojo-props="onChange: bindMenu">Header Menu</input><br/>',
		'<input id="headercell" data-dojo-id="headercell" data-dojo-type="dijit.form.CheckBox" data-dojo-props="onChange: bindMenu">Header Cell Menu</input><br/>',
		'<input id="headercell-selected" data-dojo-id="headercell-selected" data-dojo-type="dijit.form.CheckBox" data-dojo-props="onChange: bindMenu">Header Cell Selected Menu</input><br/>',
		'<input id="row" data-dojo-id="row" data-dojo-type="dijit.form.CheckBox" data-dojo-props="onChange: bindMenu">Row Menu</input><br/>',
		'<input id="row-selected" data-dojo-id="row-selected" data-dojo-type="dijit.form.CheckBox" data-dojo-props="onChange: bindMenu">Row Selected Menu</input><br/>',
		'<input id="cell" data-dojo-id="cell" data-dojo-type="dijit.form.CheckBox" data-dojo-props="onChange: bindMenu">Cell Menu</input><br/>',
		'<input id="cell-selected" data-dojo-id="cell-selected" data-dojo-type="dijit.form.CheckBox" data-dojo-props="onChange: bindMenu">Cell Selected Menu</input><br/>'
	].join(''));
	
	tp.startup();
});

function bindMenu(flag){
	var id = this.id.split('-'), menu = dijit.byId(this.id + "Menu");
	if(flag){
		grid.menu.bind(menu, {
			hookPoint: id[0],
			selected: id[1] == 'selected'
		});
	}else{
		grid.menu.unbind(menu);
	}
}

function getInfo(context){
	var row = context.row ? context.row : context.cell ? context.cell.row : null;
	var column = context.column ? context.column : context.cell ? context.cell.column : null;
	var info = [ 'grid id: ' + context.grid.id, 
			'row id: ' + (row ? row.id: 'null'),
			'row index: ' + (row ? row.index(): 'null'),
			'column id: ' + (column ? column.id: 'null'),
			'column index: ' + (column ? column.index(): 'null'),
			'cell data: ' + (context.cell ? context.cell.data() : 'null')
	];
	return info.join('\n');
}

function showInfo(){
	alert(getInfo(grid.menu.context));
}
