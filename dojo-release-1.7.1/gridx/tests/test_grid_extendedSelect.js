require([
	'dojo/_base/connect',
	'dojo/_base/array',
	'dojo/dom',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane',
	'gridx/tests/support/modules',
	'dijit/form/NumberTextBox'
], function(connect, array, dom, Grid, Cache, dataSource, storeFactory, TestPane, modules){

grid = new Grid({
	id: 'grid',
	cacheClass: Cache,
	store: storeFactory({
		dataSource: dataSource,
		size: 100
	}),
	structure: dataSource.layouts[0],
	modules: [
		modules.Focus,
		modules.RowHeader,
//        modules.IndirectSelect,
		modules.ExtendedSelectRow,
		modules.ExtendedSelectColumn,
		modules.ExtendedSelectCell,
		modules.VirtualVScroller
	]
});
grid.placeAt('gridContainer');
grid.startup();

connect.connect(grid.select.row, 'onSelectionChange', function(selected){
	dom.byId('rowSelectedCount').value = selected.length;
	dom.byId('rowStatus').value = selected.join("\n");
});
connect.connect(grid.select.column, 'onSelectionChange', function(selected){
	dom.byId('colSelectedCount').value = selected.length;
	dom.byId('colStatus').value = selected.join("\n");
});
connect.connect(grid.select.cell, 'onSelectionChange', function(selected){
	dom.byId('cellSelectedCount').value = selected.length;
	selected = array.map(selected, function(cell){
		return ['(', cell[0], ', ', cell[1], ')'].join('');
	});
	dom.byId('cellStatus').value = selected.join("\n");
});

});
function selectRow(toSelect){
	var start = dijit.byId('rowStart').get('value');
	var end = dijit.byId('rowEnd').get('value');
	var a = Math.max(start, end);
	start = Math.min(start, end);
	end = a;
	grid.select.row[toSelect ? 'selectByIndex' : 'deselectByIndex']([start, end]);
}

function selectAllRow(toSelect){
	if(toSelect){
		grid.select.row.selectAll();
	}else{
		grid.select.row.clear();
	}
}

function selectColumn(toSelect){
	var start = dijit.byId('colStart').get('value');
	var end = dijit.byId('colEnd').get('value');
	var a = Math.max(start, end);
	start = Math.min(start, end);
	end = a;
	grid.select.column[toSelect ? 'selectByIndex' : 'deselectByIndex']([start, end]);
}

function selectAllColumn(toSelect){
	if(toSelect){
		grid.select.column.selectAll();
	}else{
		grid.select.column.clear();
	}
}

function selectCell(toSelect){
	var start = [dijit.byId('cellStartR').get('value'), dijit.byId('cellStartC').get('value')];
	var end = [dijit.byId('cellEndR').get('value'), dijit.byId('cellEndC').get('value')];
	grid.select.cell[toSelect ? 'selectByIndex' : 'deselectByIndex'](start.concat(end));
}

function selectAllCell(toSelect){
	if(toSelect){
		grid.select.cell.selectAll();
	}else{
		grid.select.cell.clear();
	}
}
