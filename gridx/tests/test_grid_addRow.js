require([
	'dojo/_base/Deferred',
	'dojo/_base/lang',
	'dojo/DeferredList',
	'dijit/form/RadioButton',
	'gridx/Grid',
	'gridx/tests/support/data/TestData',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/stores/JsonRest',
//    'gridx/tests/support/stores/Memory',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane'
], function(Deferred, lang, DeferredList, RadioButton, Grid, dataSource, Cache, storeFactory, modules, TestPane){


	destroy = function(){
		if(window.grid){
			grid.destroy();
			window.grid = undefined;
		}
	};

	create = function(){
		destroy();
		if(!window.grid){
			if(dataSource.resetSeed){
				dataSource.resetSeed();
			}
			var store = storeFactory({
				path: './support/stores',
				dataSource: dataSource, 
				size: 100
			}); 
			var layout = dataSource.layouts[1];
			grid = new Grid({
				id: 'grid',
				cacheClass: Cache,
				cacheSize: 0,
				pageSize: 1000,
				store: store,
				structure: layout,
				vscrollerLazyScroll: true,
				selectRowTriggerOnCell: true,
				modules: [
					modules.SingleSort,
					modules.ExtendedSelectRow,
					modules.MoveRow,
					modules.VirtualVScroller
				]
			});
			grid.placeAt('gridContainer');
			grid.startup();
		}
	};

	create();
	
	var newId = 1000000;

	var getNewItem = function(){
		var item = dataSource.getData(1).items[0];
		item.id = ++newId;
		return item;
	};

	window.newRow = function(){
		var btn = dijit.byId('addRowBtn');
		btn.set('disabled', true);
//        grid.store.newItem(item);
//        grid.store.save({
//            onComplete: function(){
//                btn.set('disabled', false);
//                console.log("A new item is saved to server");
//            }
//        });
		Deferred.when(grid.store.add(getNewItem()), function(){
			btn.set('disabled', false);
			console.log("A new item is saved to server");
		});
	};

	window.addSomeRows = function(){
		var rows = [], dl = [];
		for(var i = 0; i < 10; ++i){
			rows.push(getNewItem());
			var d = new Deferred();
			Deferred.when(grid.store.add(rows[rows.length - 1]), lang.hitch(d, d.callback));
			dl.push(d);
		}
		(new DeferredList(dl)).then(function(){
			console.log('ok');
		});
	};

	window.deleteFirstRow = function(){
		grid.model.when(0, function(){
			grid.store.remove(grid.row(0).id);
		});
	};

	window.deleteLastRow = function(){
		grid.model.when({start: 0}, function(){
			grid.store.remove(grid.row(grid.rowCount() - 1).id);
		});
	};

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Tests', [
		'<div id="addRowBtn" data-dojo-type="dijit.form.Button" data-dojo-props="onClick: newRow">Add row</div>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: addSomeRows">Add 10 rows</div>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: deleteFirstRow">Delete First Row</div>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: deleteLastRow">Delete Last Row</div>',
		'<br/>',
	''].join(''));

	tp.startup();
});
