define([
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/modules/Focus',
	'gridx/modules/extendedSelect/Row',
	'gridx/modules/filter/Filter',
	'gridx/modules/filter/FilterBar',
	'gridx/modules/filter/QuickFilter',
	'gridx/modules/ToolBar',
	'gridx/modules/SummaryBar',
	'dijit/form/Button',
	'dojo/domReady!'
], function(Grid, Cache, dataSource, storeFactory,
	Focus, ExtendedSelectRow, Filter, FilterBar, QuickFilter, ToolBar, SummaryBar,
	Button){
	
	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource,
			size: 100
		}),
		structure: dataSource.layouts[0],
		modules: [
			Focus,
			ExtendedSelectRow,
			Filter,
			FilterBar,
			QuickFilter,
			ToolBar,
			SummaryBar
		],
		selectRowTriggerOnCell: true
	});
	grid.placeAt('gridContainer');
	grid.startup();

	var toolbar = grid.toolBar.widget;
	toolbar.addChild(new Button({
		label: 'cut',
		showLabel:false,
		iconClass:"dijitEditorIcon dijitEditorIconCut",
		onClick: function(){
			console.log('cut');
		}
	}));
	toolbar.addChild(new Button({
		label: 'copy',
		iconClass:"dijitEditorIcon dijitEditorIconCopy",
		showLabel: false,
		onClick: function(){
			console.log('copy');
		}
	}));
	toolbar.addChild(new Button({
		label: 'paste',
		iconClass:"dijitEditorIcon dijitEditorIconPaste",
		showLabel: false,
		onClick: function(){
			console.log('paste');
		}
	}));
});
