require([
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/modules',
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
], function(Grid, Cache, dataSource, storeFactory, modules,
	Summary, LinkPager, LinkSizer, DropDownPager, DropDownSizer, GotoPageButton, QuickFilter,
	Toolbar, Button, ToggleButton){
	
	var t1 = new Date;
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
			modules.ExtendedSelectRow,
			modules.Pagination,
			modules.Filter,
//            modules.FilterBar,
			modules.Bar
		],
		selectRowTriggerOnCell: true,
		barTop: [
			[
				'dijit/Toolbar',
				{pluginClass: LinkPager, 'className': 'linkPager'},
				{pluginClass: DropDownSizer, 'className': 'dropDownSizer'},
				{pluginClass: QuickFilter, 'className': 'quickFilter'}
			]
		],
		barBottom: [
			Summary,
			{pluginClass: LinkSizer, 'className': 'linkSizer'},
			{pluginClass: LinkPager, 'className': 'linkPager'},
			{pluginClass: DropDownSizer, 'className': 'dropDownSizer'},
			{pluginClass: DropDownPager, style: 'text-align: center;'},
			GotoPageButton
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
	console.log(new Date - t1);
});
