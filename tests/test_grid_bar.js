require([
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/modules/Focus',
	'gridx/modules/extendedSelect/Row',
	'gridx/modules/pagination/Pagination',
	'gridx/modules/filter/Filter',
	'gridx/modules/Bar',
	'gridx/modules/barPlugins/Summary',
	'gridx/modules/barPlugins/LinkPager',
	'gridx/modules/barPlugins/LinkSizer',
	'gridx/modules/barPlugins/DropDownPager',
	'gridx/modules/barPlugins/DropDownSizer',
	'gridx/modules/barPlugins/GotoPageButton',
	'gridx/modules/barPlugins/QuickFilter',
	'dijit/Toolbar',
	'dijit/form/Button',
	'dijit/form/ToggleButton',
	'dojo/domReady!'
], function(Grid, Cache, dataSource, storeFactory,
	Focus, ExtendedSelectRow, Pagination, Filter, Bar,
	Summary, LinkPager, LinkSizer, DropDownPager, DropDownSizer, GotoPageButton, QuickFilter,
	Toolbar, Button, ToggleButton){
	
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
			Pagination,
			Filter,
			Bar
		],
		selectRowTriggerOnCell: true,
		barTop: [
			[
				{pluginClass: 'dijit/Toolbar', colSpan: 2},
				{pluginClass: QuickFilter, 'className': 'quickFilter'}
			],
			[
				{pluginClass: LinkPager, 'className': 'linkPager'},
				{content: 'Grid Bar Test', style: 'text-align: center; font-size: 15px; font-weight: bolder; text-shadow: 1px 1px 1px #fff;'},
				null
			]
		],
		barBottom: [
			[
				{pluginClass: Summary, rowSpan: 2},
				{pluginClass: LinkSizer, style: 'text-align: center;', colSpan: 2}
			],[
				{pluginClass: DropDownPager, style: 'text-align: center;'},
				'gridx/modules/barPlugins/DropDownSizer',
				GotoPageButton
			]
		]
	});
	
	var toolbar = grid.bar.plugins.top[0][0];
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

	toolbar.addChild(new ToggleButton({
		label: 'Bold',
		iconClass:"dijitEditorIcon dijitEditorIconBold",
		showLabel:false
	}));

	grid.placeAt('gridContainer');
	grid.startup();
});
