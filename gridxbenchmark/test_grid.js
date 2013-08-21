require([
	'gridx/Grid',
	'dojo/_base/array',
	'dojo/_base/lang',
	'dojo/query',
	'dojo/dom-class',
	'dojo/store/Memory',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/TestPane',
	'dojox/grid/DataGrid',
	'dojo/data/ItemFileWriteStore',	
	'gridx/allModules',
	'dojo/on',
	'dijit/registry',
	'dojo/_base/Deferred'
], function(Grid, array, lang, query, domClass, Memory, Cache, dataSource, storeFactory, 
			TestPane, DataGrid, ItemFileWriteStore, modules, on, registry, Deferred){

	var timeoutList = [];
	var _setTimeout = setTimeout;
	setTimeout = function(){
		timeoutList.push(_setTimeout.apply(window, arguments));
	}

	on(dojo.byId('benchBtn'), 'click', function(){
		runBench();
	});
	
	
	var singleModResult = [];
	var doubleModResult = {};
	var grids = [];
	var columnSetIdx = 0;
	var cases = [];
	var caseIndex = 0;
	var caseCount = 0;
	var store = storeFactory({
		dataSource: dataSource,
		size: 100
	});
	var pb = dojo.byId('progressBar');
	var pn = dojo.byId('progressNumber');
	
	var layout = [
			{id: 'id', field: 'id', name: 'Identity', width: '80px'},
			{id: 'order', field: 'order', name: 'Order', width: '80px'},
			{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px', alwaysEditing: false,
				decorator: function(){
				//Generate cell widget template string
					return [
						'<button data-dojo-type="dijit.form.Button" ',
						'data-dojo-attach-point="btn" ',
						'data-dojo-props="onClick: function(){',
							'alert(this.get(\'label\'));',
						'}"></button>'
					].join('');
				}, widgetsInCell: true,
				setCellValue: function(data){
					//"this" is the cell widget
					this.btn.set('label', data);
					console.log('data is', data);
				}
			
			},
			{id: 'Artist', field: 'Artist', name: 'Artist', width: '120px'},
			{id: 'Year', field: 'Year', name: 'Year', width: '80px',alwaysEditing: false,
				decorator: function(){
				//Generate cell widget template string
					return [
						'<button data-dojo-type="dijit.form.Button" ',
						'data-dojo-attach-point="btn" ',
						'data-dojo-props="onClick: function(){',
							'alert(this.get(\'label\'));',
						'}"></button>'
					].join('');
				}, widgetsInCell: true,
				setCellValue: function(data){
					//"this" is the cell widget
					this.btn.set('label', data);
					console.log('data is', data);
				}
			
			},
			{id: 'Album', field: 'Album', name: 'Album', width: '160px'},
			{id: 'Name', field: 'Name', name: 'Name', width: '80px'},
			{id: 'Length', field: 'Length', name: 'Length', width: '80px',alwaysEditing: false},
			{id: 'Track', field: 'Track', name: 'Track', width: '80px'},
			{id: 'Composer', field: 'Composer', name: 'Composer', width: '160px'},
			{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '160px'},
			{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '120px'},
			{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
	];
	// var modules = {
		// 'sort': ['gridx/modules/SingleSort'],
		// 'pagination': ['gridx/modules/Pagination', 'gridx/modules/pagination/PaginationBar'],
		// 'filter': ['gridx/modules/Filter', 'gridx/modules/filter/FilterBar']
	// };
	
	var config = {
			id: 'grid',
			cacheClass: Cache,
			store: store,
			structure: layout,
			modules: [
				modules.VirtualVScroller
			]
	};
	var mods = {
		VirtualVScroller: "virtualVScroller",
		ColumnResizer: "columnResizer",
		NavigableCell: "navigableCell",
		CellWidget: "cellWidget",
		Edit: "edit",
		SingleSort: "sort",
		NestedSort: "sort",
		Pagination: "pagination",
		PaginationBar: "paginationBar",
		PaginationBarDD: "paginationBar",
		Filter: "filter",
		FilterBar: "filterBar",
		QuickFilter: "quickFilter",
		SelectRow: "selectRow",
		SelectColumn: "selectColumn",
		SelectCell: "selectCell",
		ExtendedSelectRow: "selectRow",
		ExtendedSelectColumn: "selectColumn",
		ExtendedSelectCell: "selectCell",
		MoveRow: "moveRow",
		MoveColumn: "moveColumn",
		RowHeader: "rowHeader",
		IndirectSelect: "indirectSelect",
		IndirectSelectColumn: "indirectSelect",
		ColumnLock: "columnLock",
		RowLock: "rowLock",
		Tree: "tree",
		HiddenColumns: 'hiddenColumns',
		GroupHeader: 'groupHeader',
		TouchVScroller: 'vScroller',
		PagedBody: 'pagedBody',
		Dod: 'dod'
	};
	
	var conflicts = {
		MoveRow: {
			SingleSort: 1,
			NestedSort: 1
		},
		ExtendedSelectRow: {
			selectRowMultiple_false: 1
		},
		ExtendedSelectCell: {
			selectCellMultiple_false: 1
		},
		ExtendedSelectColumn: {
			selectColumnMultiple_false: 1
		},
		columnWidthAutoResize: {
			ColumnResizer: 1
		},
		autoWidth: {
			ColumnLock: 1
		},
		Tree: {
			MoveRow: 1
		},
		selectRowTriggerOnCell: {
			SelectCell: 1,
			ExtendedSelectCell: 1
		},
		RowLock: {
			VirtualVScroller: 1
		},
		GroupHeader: {
			ColumnLock: 1,
			HiddenColumns: 1
		},
		PagedBody: {
			Pagination: 1,
			VirtualVScroller: 1
		}
	};
			
	var deps =  {
		Edit: {
			CellWidget: 1
		},
		IndirectSelect: {
			RowHeader: 1,
			SelectRow: 1
		},
		IndirectSelectColumn: {
			SelectRow: 1
		},
		FilterBar: {
			Filter: 1
		},
		QuickFilter: {
			Filter: 1
		},
		PaginationBar: {
			Pagination: 1
		},
		PaginationBarDD: {
			Pagination: 1
		},
		DndRow: {
			MoveRow: 1
		},
		DndColumn: {
			MoveColumn: 1,
			SelectColumn: 1
		}
	};
	
	runBench = function(){
		_init();
		console.log(config);
		grids = [];
		singleModResult = [];
		
		// if(registry.byId('gridxChbx').getValue()){
			// grids.push('gridx');
		// }
		// if(registry.byId('datagridChbx').getValue()){
			// grids.push('datagrid');
		// }
		// array.forEach(grids, function(grid){
			// console.log(grid);
			// create(grid);
		// });
		
		//single modules benchmark test
		for(var i in mods){
			config.modules = [modules.VirtualVScroller];
			config.modules.push(modules[i]);
			if(deps.hasOwnProperty(i)){
				for(var j in deps[i]){
					if(deps[i][j] === 1){
						config.modules.push(modules[j]);
					}
				}
			}
			destroy();
			cases.push({config: lang.clone(config), mods: [i], type: '1mod'});
			// create('gridx', config, i, '');
		}
		
		//double modules benchmark test
		for(var i in mods){
			for(var j in mods){
				config.modules = [];
				if(i == j) continue;
				if(conflicts[i] && conflicts[i].hasOwnProperty(j)){
					continue;
				}
				if(deps.hasOwnProperty(i)){
					for(var k in deps[i]){
						if(deps[i][k] === 1){
							if(modules[k])
								config.modules.push(modules[k]);
						}
					}
				}
				if(deps.hasOwnProperty(j)){
					for(var k in deps[j]){
						if(deps[j][k] === 1){
							if(modules[k])
								config.modules.push(modules[k]);
						}
					}
				}								
				// config.modules.push(modules[i]);			
				config.modules.push(modules[i]);
				config.modules.push(modules[j]);
				destroy();
				// create('gridx', config, i);
				
				cases.push({config: lang.clone(config), mods: [i, j], type: '2mods'});
			}
		}

		caseCount = cases.length;	
		var d = new Deferred();
		dojo.byId('gridxContainer').style.display = 'block';
		runcase(d).then(function(){
			dojo.byId('gridxContainer').style.display = 'none';
			dojo.byId('progress').style.display=  'none';
			console.log(doubleModResult);
			generateResult();
		});
	},
	
	runcase = function(d){
		var c = cases[caseIndex];

		console.log('case index is: ', caseIndex);
		if(c){
			create('gridx', c.config, c.mods, c.type).then(function(){
				caseIndex++;
				var progress  = Math.floor(caseIndex / caseCount * 100);
				pb.style.width = progress + '%';
				pn.innerHTML = 'Progress: ' + progress + '%';		
				runcase(d);
			})
		}else{
			d.callback();
		}
		return d;
	}

	generateResult = function(){
		destroy();
		console.log(singleModResult);
		for(var i in singleModResult){
			singleModResult[i].id = i;
		}
		var store = new Memory({data: singleModResult});
			layout = [
				{id: 1, name: 'module', field: 'module'},
				{id: 2, name: 'benchmark', field: 'benchmark'}
			];
		var grid1 = new Grid({
			id: 'singleModResultGrid',
			cacheClass: Cache,
			store: store,
			structure: layout,
			modules: [modules.SingleSort],
			autoHeight: true
		});
		dojo.byId('singleModuleResultContainer').style.display = 'block';
		grid1.placeAt('singleModuleResultContainer');
		grid1.startup();

		
		var dr = [];
		for(var i in doubleModResult){
			dr.push(lang.mixin(doubleModResult[i], {modName: i, id: i}));
		}
		var id = 1;
		console.log(dr);
		var store = new Memory({data: dr});
			layout = [
				{id: 1000, name: 'name', field: 'modName'}
			];
		for(var i in mods){
			layout.push({id: id++, name: i, field: i});
		}
		console.log(layout);
		var grid2 = new Grid({
			id: 'doubleModResultGrid',
			cacheClass: Cache,
			store: store,
			structure: layout,
			// modules: []
			modules: [modules.SingleSort],
			autoHeight: true
		});
		
		grid2.connect(grid2, 'onCellMouseOver', function(evt){
			var colid = evt.columnId;
			query('.gridxCell', grid2.bodyNode).forEach(function(cell){
				if(cell.getAttribute('colid') == colid){
					domClass.add(cell, 'colHover');
				}
			});
		});
		
		grid2.connect(grid2, 'onCellMouseOut', function(evt){
			var colid = evt.columnId;
			query('.gridxCell', grid2.bodyNode).forEach(function(cell){
				if(cell.getAttribute('colid') == colid){
					domClass.remove(cell, 'colHover');
				}
			});
		});		
		
		grid2.connect(grid2.body, 'onRender', function(){
			console.log('in timeout');
			query('.gridxCell', grid2.bodyNode).forEach(function(cell){
				if(cell.innerHTML == '&nbsp;'){
					domClass.add(cell, 'empty');
				}
			})
		});
		dojo.byId('doubleModuleResultContainer').style.display = 'block';
		grid2.placeAt('doubleModuleResultContainer');
		grid2.startup();	
	}
	
	destroy = function(){
		array.forEach(timeoutList, function(i){
			clearTimeout(i);
			
		});
		if(window.grid){
			grid.destroy();
			window.grid = undefined;
		}
	};

	
	create = function(gridType, config, mods, type){
		destroy();
		var d = new Deferred();
	
		switch(gridType){
			case 'gridx': 
				if(!window.grid){
					var start = new Date().getTime();
					grid = new Grid(config);
					for(var i in config.modules){
						console.log('gridx loaded console is: ',  config.modules[i].prototype.name);
					}
					grid.placeAt('gridxContainer');
					
					grid.connect(grid, 'onModulesLoaded', function(){
						setTimeout(function(){
							d.callback();
						}, 100);
					});
					grid.startup();
					
					console.log({module: mods, benchmark: new Date().getTime() - start});
					if(type == '1mod'){
						singleModResult.push({module: mods[0], benchmark: new Date().getTime() - start});
					}else{
						var r = doubleModResult[mods[0]] = doubleModResult[mods[0]]? doubleModResult[mods[0]] : {};
						r[mods[1]] = new Date().getTime() - start;
						// doubleModResult.push({module: mods.join(' '), benchmark: new Date().getTime() - start});
					}
					// var end = new Date().getTime();
					console.log('run time is: ' + (new Date().getTime() - start));
				}
				break;
		/*	case 'datagrid':
				var data = {
					  identifier: "id",
					  items: []
				};
				var data_list = [
						{ col1: "normal", col2: false, col3: 'But are not followed by two hexadecimal', col4: 29.91},
						{ col1: "important", col2: false, col3: 'Because a % sign always indicates', col4: 9.33},
						{ col1: "important", col2: false, col3: 'Signs can be selectively', col4: 19.34}
				];
				var rows = 60;
				
				for(var i = 0, l = data_list.length; i < rows; i++){
					data.items.push(lang.mixin({ id: i+1 }, data_list[i%l]));
				}
				
				var store = new ItemFileWriteStore({data: dataSource.getData(100)});
				
				
				// var dgLayout = [[
				  // {'name': 'Column 1', 'field': 'id', 'width': '100px'},
				  // {'name': 'Column 2', 'field': 'col2', 'width': '100px'},
				  // {'name': 'Column 3', 'field': 'col3', 'width': '200px'},
				  // {'name': 'Column 4', 'field': 'col4', 'width': '150px'}
				// ]];
				
				dgLayout = [layout];
				
				var start = new Date().getTime();
				var dg = new DataGrid({
					id: 'dataGrid',
					store: store,
					structure: layout,
					rowSelector: '20px'});
				
				dg.placeAt("dataGridContainer");
				dg.startup();
				
				console.log('time is: ' + (new Date().getTime() - start));			
				break;*/
				
		}
		return d;
	};

	toggleModule = function(checkbox){
		destroy();
		var v = checkbox.getValue(),
			id = checkbox.id;
		var modGroup = modules[id];
		console.log(checkbox.id);
		if(checkbox.getValue()){
				config.modules = config.modules.concat(modGroup);
				console.log(config.modules);
		}else{
			array.forEach(modGroup, function(mod){
				if(config.modules.indexOf(mod) >= 0){
					config.modules.splice(config.modules.indexOf(mod), 1);
				}
			});
		}
		create();
	};
	
	_init = function(){
		var s = dijit.registry.byId('singleModResultGrid'),
			d = dijit.registry.byId('doubleModResultGrid');
		
		caseIndex = 0;
		
		if(s) s.destroy();
		if(d) d.destroy();
		
		dojo.byId('gridxContainer').style.display = 'block';
		dojo.byId('progress').style.display = 'block';
					
	};
	
	_updateProgress = function(p){
		pb.style.width = p + '%';
		pn.innerHTML = 'Progress: ' + p + '%';		
	}
	
	//Test buttons
	// var tp = new TestPane({});
	// tp.placeAt('ctrlPane');

	// tp.addTestSet('Tests', [
		// '<input id="sort" name="sort" data-dojo-type="dijit/form/CheckBox" value="gridx/modules/SingleSort"  onChange="toggleModule(this)" /> <label for="mycheck">Sort</label><br>',
		// '<input id="pagination" name="pagination" data-dojo-type="dijit/form/CheckBox" value="gridx/modules/Pagination" onChange="toggleModule(this)" /> <label for="mycheck">Pagination</label><br>',
		// '<input id="filter" name="filter" data-dojo-type="dijit/form/CheckBox" value="gridx/modules/Filter" onChange="toggleModule(this)" /> <label for="mycheck">Filter</label><br>'
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setColumns">Change column structure</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setStore">Change store</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: newRow">Add an empty new row</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setRow">Set Year of the first row</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: deleteRow">Delete the first row</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: destroy">Destroy</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: create">Create</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: toggleHeader">Toggle Header</div><br/>'
	// ].join(''));

	// tp.startup();
	
    /*set up data store*/

});
