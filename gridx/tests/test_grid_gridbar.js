require([
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/modules',
	'gridx/modules/GridBar',
	'gridx/modules/gridBarPlugins/Summary',
	'gridx/modules/gridBarPlugins/LinkPager',
	'gridx/modules/gridBarPlugins/LinkSizer',
	'gridx/modules/gridBarPlugins/DropDownPager',
	'gridx/modules/gridBarPlugins/DropDownSizer',
	'gridx/modules/gridBarPlugins/GotoPageButton',
	'gridx/modules/gridBarPlugins/QuickFilter',
	'dijit/Toolbar',
	'dijit/form/Button',
	'dijit/form/ToggleButton',
	'dojo/domReady!'
], function(Grid, Cache, dataSource, storeFactory, modules, GridBar,
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
			modules.ExtendedSelectRow,
			modules.Pagination,
			modules.Filter,
			GridBar
		],
		selectRowTriggerOnCell: true,
		barTop: [
			[
				0,0,
				{pluginClass: QuickFilter, style: 'text-align: right;', colSpan: 2}
			],
			[
				'dijit/Toolbar',
				{pluginClass: LinkPager, style: 'text-align: center;'},
				{pluginClass: DropDownSizer, style: 'text-align: right;'},
				GotoPageButton
			]
		]
//        barBottom: [
//            Summary,
//            {pluginClass: DropDownPager, style: 'text-align: left;'},
//            {pluginClass: LinkSizer, style: 'text-align: right;'}
//        ]
	});
	
	var toolbar = grid.bar.plugins.top[1][0];
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

//    toolbar.addChild(new ToggleButton({
//        label: 'Bold',
//        iconClass:"dijitEditorIcon dijitEditorIconBold",
//        showLabel:false
//    }));

	grid.placeAt('gridContainer');
	grid.startup();
	console.log(new Date - t1);
});
