require([
	'dojo/_base/lang',
	'dojo/io-query',
	'dojo/query',
	'dojo/dom-geometry',
	'dojo/dom-style',
	'dojo/has',
	'dojo/_base/array',
	'dojo/json',
	'dojo/store/Memory',
	'dijit/form/FilteringSelect',
	'dojo/text!gridx/package.json',
	'dojo/_base/Deferred',
	'dojo/DeferredList',
	'gridxtest/support/data/AllData',
	'gridxtest/support/stores/Memory',
	'gridxtest/support/stores/JsonRest',
	'gridx/Grid',
	'gridx/allModules',
	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async',
	'dojo/domReady!'
], function(lang, ioQuery, query, domGeo, domStyle, has, array, JSON, Memory, FilteringSelect,
	packageInfo, Deferred, DeferredList, dataSource, memoryFactory, jsonrestFactory, Grid){

	packageInfo = JSON.parse(packageInfo);
	var version = parseFloat(packageInfo.version, 10);

	has.add('gridx1.3', version >= 1.3);
	has.add('gridx1.2', version >= 1.2);
	has.add('gridx1.1', version >= 1.1);

	var uri = document.URL;
	var pos = uri.indexOf("?");
	if(pos > 0){
		var initCase = ioQuery.queryToObject(uri.substring(pos + 1));
		initCase = initCase && initCase.c && decodeURIComponent(initCase.c);
	}

	require([
		'gridxtest/cases'
	], function(cases){

	cases = array.filter(cases, function(c){
		return (!c.version || c.version <= version) &&
			(!c.belowVersion || c.belowVersion >= version);
	});

	if(!initCase){
		initCase = cases[0] && cases[0].title;
	}

	var foundInitCase = array.some(cases, function(c){
		return c.title == initCase;
	});

	var casesTitleStore = new Memory({
		data: array.map(cases, function(c, i){
			return {
				id: c.title,
				idx: i
			};
		})
	});
	var allowOnChange = 1;
	var casesSelect = new FilteringSelect({
		style: 'width: 600px;',
		store: casesTitleStore,
		searchAttr: 'id',
		onChange: function(value){
			if(allowOnChange){
				for(var i = 0; i < cases.length; ++i){
					if(cases[i].title === value){
						document.getElementById('caseId').value = i + 1;
						setTimeout(gotoCase, 0);
						break;
					}
				}
			}
			allowOnChange = 1;
		}
	});
	casesSelect.placeAt('casesSelect');
	casesSelect.startup();

	window.showMiscellany = function(){
		query('.miscellany').forEach(function(node){
			node.style.display = '';
		});
		query('#gridContainer').removeClass('only');
		query('body').removeClass('screenshot');
	};
	window.hideMiscellany = function(){
		query('.miscellany').forEach(function(node){
			node.style.display = 'none';
		});
		query('#gridContainer').addClass('only');
		query('body').addClass('screenshot');
	};

	var columns;
	window.destroyGrid = function(){
		var grid = window.grid;
		columns = null;
		if(grid){
			grid.destroy();
			document.getElementById('casePanel').innerHTML = '';
			document.getElementById('casePanelBtnGroup').innerHTML = '';
			window.grid = null;
		}
	};

	var newId = 1000000;
	function createGrid(args){
		destroyGrid();
		var grid;
		dataSource.resetSeed();

		document.getElementById('caseFile').innerHTML = args.mid;
		if(casesSelect.get('value') !== args.title){
			allowOnChange = 0;
			casesSelect.set('value', args.title);
		}
		var guides = array.map(args.guide || [], function(line, i){
			return (i + 1) + '. ' + line;
		});
		document.getElementById('guide').innerHTML = guides.join('<br />');

		newId = 1000000;
		var store;
		if(lang.isString(args.store)){
			var storeFactory = {
				memory: memoryFactory,
				mockserver: memoryFactory,
				jsonrest: jsonrestFactory
			}[args.store];
			store = storeFactory(lang.mixin({
				isAsync: args.store == 'mockserver',
				asyncTimeout: 1000,
				dataSource: dataSource,
				size: args.size
			}, args.storeArgs || {}));
		}else{
			store = args.store;
		}
		if(args.onBeforeCreate){
			args.onBeforeCreate(args);
		}
		grid = new Grid(lang.mixin({
			id: 'grid',
			cacheClass: args.cache,
			store: store,
			structure: args.structure,
			modules: args.modules
		}, args.props || {}));
		if(args.onCreated){
			args.onCreated(grid);
		}

		grid.connect(grid, 'onModulesLoaded', function(){
			if(args.onModulesLoaded){
				args.onModulesLoaded(grid);
			}
		});

		grid.placeAt('gridContainer');

		grid.startup();
		if(args.onStarted){
			args.onStarted(grid);
		}
		return grid;
	}

	window.gotoCase = function(step){
		var caseIdInput = document.getElementById('caseId');
		var caseId = parseInt(caseIdInput.value, 10) - 1;
		if(caseId < 0){
			caseId = 0;
		}
		caseId += step || 0;
		if(caseId >= 0 && caseId < cases.length){
			caseIdInput.value = caseId + 1;
			var args = cases[caseId];
			window.grid = createGrid(args);
		}
	};

	window.toggleGuide = function(){
		var guide = document.getElementById('guide');
		if(guide.clientHeight){
			guide.style.height = 0;
		}else{
			guide.style.height = '';
		}
	};

	window.addRow = function(){
		if(!window.grid){return;}
		grid.store.add(dataSource.generateItem('', newId++));
	};

	window.addSomeRows = function(){
		if(!window.grid){return;}
		for(var i = 0; i < 10; ++i){
			grid.store.add(dataSource.generateItem('', newId++));
		}
	};

	window.addEmptyRow = function(){
		if(!window.grid){return;}
		grid.store.add(dataSource.emptyItem('', newId++));
	};

	window.removeFirstRow = function(){
		if(!window.grid){return;}
		grid.when(0, function(){
			if(grid.row(0)){
				grid.store.remove(grid.row(0).id);
			}
		});
	};

	window.removeLastRow = function(){
		if(!window.grid){return;}
		var rowCount = grid.rowCount();
		if(rowCount > 0){
			grid.when(rowCount - 1, function(){
				grid.store.remove(grid.row(rowCount - 1).id);
			});
		}
	};

	window.removeFirstSomeRows = function(){
		if(!window.grid){return;}
		grid.when({start: 0, count: 10}, function(){
			var i, rowIds = [], dl = [];
			for(i = 0; i < 10; ++i){
				if(grid.row(i)){
					rowIds.push(grid.row(i).id);
				}
			}
			for(i = 0; i < rowIds.length; ++i){
				var d = new Deferred();
				Deferred.when(grid.store.remove(rowIds[i]), lang.hitch(d, d.callback));
				dl.push(d);
			}
			if(dl.length){
				new DeferredList(dl).then(function(){
					console.debug('delete ok');
				});
			}
		});
	};

	window.removeLastSomeRows = function(){
		if(!window.grid){return;}
		var rowCount = grid.rowCount();
		var start = rowCount - 10 > 0 ? rowCount - 10 : 0;
		var count = rowCount - start;
		grid.when({start: start, count: count}, function(){
			var i, rowIds = [], dl = [];
			for(i = 0; i < count; ++i){
				if(grid.row(start + i)){
					rowIds.push(grid.row(start + i).id);
				}
			}
			for(i = 0; i < rowIds.length; ++i){
				var d = new Deferred();
				Deferred.when(grid.store.remove(rowIds[i]), lang.hitch(d, d.callback));
				dl.push(d);
			}
			if(dl.length){
				new DeferredList(dl).then(function(){
					console.debug('delete ok');
				});
			}
		});
	};

	window.removeRow = function(rowIndex){
		if(!window.grid){return;}
		grid.when(rowIndex, function(){
			var row = grid.row(rowIndex);
			if(row){
				grid.store.remove(row.id);
			}
		});
	};

	window.resizeGrid = function(args){
		if(!window.grid){return;}
		if(args.h){
			args.h *= grid.domNode.clientHeight;
		}
		if(args.w){
			args.w *= grid.domNode.clientWidth;
		}
		grid.resize(args);
	};

	window.toggleHeader = function(){
		if(!window.grid){return;}
		grid.header.hidden = !grid.header.hidden;
		grid.header.refresh();
	};

	window.createDisplayNone = function(){
		destroyGrid();
		document.getElementById('gridContainer').style.display = 'none';
		gotoCase();
	};

	//					display 					
	window.showGrid = function(){
		if(!window.grid){return;}
		document.getElementById('gridContainer').style.display = '';
		grid.resize();
	};

	window.hideGrid = function(){
		if(!window.grid){return;}
		document.getElementById('gridContainer').style.display = 'none';
	};

	window.showLoadingMask = function(){
		if(!window.grid){return}
		if(has('gridx1.3')){
			grid.body._showLoadingMask();
		}
	};

	window.hideLoadingMask = function(){
		if(!window.grid){return}
		if(has('gridx1.3')){
			grid.body._hideLoadingMask();
		}
	};

	var columns;
	window.setColumns = function(){
		if(!window.grid){return;}
		if(!columns){
			columns = grid.structure;
		}
		grid.setColumns([
			{id: 'id', field: 'id', name: 'Identity'},
			{id: 'number', field: 'number', name: 'Number'},
			{id: 'string', field: 'string', name: 'String'}
		]);
	};

	window.setManyColumns = function(){
		if(!window.grid){return;}
		if(!columns){
			columns = grid.structure;
		}
		grid.setColumns([
			{field: 'id', name: 'Identity', width: '20px'},
			{field: 'number', name: 'Number', width: '10em'},
			{field: 'string', name: 'String', width: '200px'},
			{field: 'date', name: 'Date', width: '10%'},
			{field: 'time', name: 'Time', width: '20%'},
			{field: 'bool', name: 'Boolean', width: '30%'},
			{field: 'id', name: 'Identity', width: '20px'},
			{field: 'number', name: 'Number', width: '10em'},
			{field: 'string', name: 'String', width: '200px'},
			{field: 'date', name: 'Date', width: '10%'},
			{field: 'time', name: 'Time', width: '20%'},
			{field: 'bool', name: 'Boolean', width: '30%'}
		]);
	};

	window.setEmptyColumns = function(){
		if(!window.grid){return;}
		if(!columns){
			columns = grid.structure;
		}
		grid.setColumns();
	};

	window.restoreColumns = function(){
		if(!window.grid){return;}
		if(columns){
			grid.setColumns(columns);
			columns = null;
		}
	};

	var store;
	window.setEmptyStore = function(){
		if(!window.grid){return;}
		if(!store){
			store = grid.store;
		}
		grid.setStore(memoryFactory({
			dataSource: dataSource,
			size: 0
		}));
	};

	window.setStore = function(size){
		if(!window.grid){return;}
		if(!store){
			store = grid.store;
		}
		grid.setStore(memoryFactory({
			dataSource: dataSource,
			size: size
		}));
	};

	window.restoreStore = function(){
		if(!window.grid){return;}
		if(store){
			grid.setStore(store);
		}
	};

	window.toggleStuffEmptyCell = function(){
		if(!window.grid){return;}
		grid.body.stuffEmptyCell = !grid.body.stuffEmptyCell;
		grid.body.refresh();
	};

	window.toggleRowHoverEffect = function(){
		if(!window.grid){return;}
		grid.body.rowHoverEffect = !grid.body.rowHoverEffect;
		grid.body.refresh();
	};

	window.toggleSelectRowTriggerOnCell = function(){
		if(!window.grid){return;}
		if(!grid.select || !grid.select.row){return;}
		grid.select.row.triggerOnCell = !grid.select.row.triggerOnCell;
	};

	function getDomSnapshot(node, res, origin){
		var pos = domGeo.position(node);
		pos.x -= origin.x;
		pos.y -= origin.y;
		res.pos = pos;
		for(var i = 0; i < node.childNodes.length; ++i){
			var child = node.childNodes[i];
			if(child.nodeType == 1 && domStyle.get(child, 'display') != 'none'){
				var childRes = {};
				res.children = res.children || [];
				res.children.push(childRes);
				getDomSnapshot(child, childRes, origin);
			}
		}
	}

	window.getSnapshot = function(){
		var res = {};
		var origin = domGeo.position(grid.domNode);
		getDomSnapshot(document.body, res, origin);
		return JSON.stringify(res);
	};

	document.getElementById('totalCaseCount').innerHTML = cases.length;
	//gotoCase();

	var flagDiv = document.createElement('div');
	flagDiv.setAttribute('id', "loadFinishFlag");
	if(foundInitCase){
		casesSelect.set('value', initCase);
		flagDiv.setAttribute('class', 'loadFinishFlagSuccess');
	}else{
		flagDiv.setAttribute('class', 'loadFinishFlagFail');
	}
	document.body.appendChild(flagDiv);

	});
});
