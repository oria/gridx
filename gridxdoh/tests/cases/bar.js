define([
	'./_cases',
	'dojo/has!gridx1.1?gridx/support/Summary',
	'dojo/has!gridx1.1?gridx/support/LinkPager',
	'dojo/has!gridx1.1?gridx/support/LinkSizer',
	'dojo/has!gridx1.1?gridx/support/DropDownPager',
	'dojo/has!gridx1.1?gridx/support/DropDownSizer',
	'dojo/has!gridx1.1?gridx/support/GotoPageButton',
	'dojo/has!gridx1.1?gridx/support/QuickFilter',
	'dijit/Toolbar',
	'dijit/form/Button',
	'dijit/form/ToggleButton'
], function(cases, Summary, LinkPager, LinkSizer, DropDownPager, DropDownSizer, GotoPageButton, QuickFilter,
	Toolbar, Button, ToggleButton){

	function createToolbar(id){
		var gridToolbar = new Toolbar({
			id: id
		});
		gridToolbar.addChild(new Button({
			label: 'cut',
			showLabel:false,
			iconClass:"dijitEditorIcon dijitEditorIconCut",
			onClick: function(){
				alert('cut');
			}
		}));
		gridToolbar.addChild(new Button({
			label: 'copy',
			iconClass:"dijitEditorIcon dijitEditorIconCopy",
			showLabel: false,
			onClick: function(){
				alert('copy');
			}
		}));
		gridToolbar.addChild(new Button({
			label: 'paste',
			iconClass:"dijitEditorIcon dijitEditorIconPaste",
			showLabel: false,
			onClick: function(){
				alert('paste');
			}
		}));
		gridToolbar.addChild(new ToggleButton({
			label: 'Bold',
			iconClass:"dijitEditorIcon dijitEditorIconBold",
			showLabel: false,
			onClick: function(){
				alert('bold');
			}
		}));
		return gridToolbar;
	}
	var toolbar = createToolbar('toolbar1');

	cases.push(
		{
			version: 1.1,
			title: "Top Bar Only",
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Genre', field: 'Genre', name: 'Genre'},
				{id: 'Artist', field: 'Artist', name: 'Artist'},
				{id: 'Name', field: 'Name', name: 'Name'}
			],
			modules: [
				'gridx/modules/extendedSelect/Row',
				'gridx/modules/Pagination',
				'gridx/modules/Filter',
				'gridx/modules/Bar'
			],
			props: {
				'class': 'barTest',
				barTop: [
					toolbar,
					{pluginClass: QuickFilter, 'className': 'quickFilter'}
				],
				selectRowTriggerOnCell: true
			}
		},
		{
			version: 1.1,
			title: "Bottom Bar Only",
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Genre', field: 'Genre', name: 'Genre'},
				{id: 'Artist', field: 'Artist', name: 'Artist'},
				{id: 'Name', field: 'Name', name: 'Name'}
			],
			modules: [
				'gridx/modules/extendedSelect/Row',
				'gridx/modules/Pagination',
				'gridx/modules/Filter',
				'gridx/modules/Bar'
			],
			props: {
				'class': 'barTest',
				barBottom: [
					[
						{pluginClass: Summary, rowSpan: 2},
						{pluginClass: LinkSizer, style: 'text-align: center;', colSpan: 2}
					],
					[
						{pluginClass: DropDownPager, style: 'text-align: center;'},
						'gridx/support/DropDownSizer',
						GotoPageButton
					]
				],
				selectRowTriggerOnCell: true
			}
		},
		{
			version: 1.1,
			title: "Top and Bottom Bar",
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Genre', field: 'Genre', name: 'Genre'},
				{id: 'Artist', field: 'Artist', name: 'Artist'},
				{id: 'Name', field: 'Name', name: 'Name'}
			],
			modules: [
				'gridx/modules/extendedSelect/Row',
				'gridx/modules/Pagination',
				'gridx/modules/Filter',
				'gridx/modules/Bar'
			],
			props: {
				'class': 'barTest',
				barTop: [
					[
						{colSpan: 2},
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
					],
					[
						{pluginClass: DropDownPager, style: 'text-align: center;'},
						'gridx/support/DropDownSizer',
						GotoPageButton
					]
				],
				selectRowTriggerOnCell: true
			}
		},
		{
			version: 1.1,
			title: "SummaryBar as a module",
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Genre', field: 'Genre', name: 'Genre'},
				{id: 'Artist', field: 'Artist', name: 'Artist'},
				{id: 'Name', field: 'Name', name: 'Name'}
			],
			modules: [
				"gridx/modules/extendedSelect/Row",
				"gridx/modules/IndirectSelectColumn",
				"gridx/modules/SummaryBar"
			],
			props: {
				selectRowTriggerOnCell: true
			}
		}
	);

	return cases;
});
