define([
	'./_util',
	'gridx/allModules',
	'dijit/ProgressBar',
	'dijit/form/NumberTextBox'
], function(util, modules){

	var progressDecorator = function(){
		return [
			"<div data-dojo-type='dijit.ProgressBar' data-dojo-props='maximum: 10000' ",
			"class='gridxHasGridCellValue' style='width: 100%;'></div>"
		].join('');
	};

	return [
		{
			version: 1.3,
			title: 'layer tree grid',
			guide: [
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 4,
			storeArgs: {
				tree: true,
				maxLevel: 4,
				maxChildrenCount: 10
			},
			structure: [
				//Anything except natual number (1, 2, 3...) means all levels are expanded in this column.
				{id: 'number', name: 'number', field: 'number',
					expandLevel: 'all',
					width: '200px',
					widgetsInCell: true,
					decorator: progressDecorator,
					editable: true,
					editor: 'dijit/form/NumberTextBox'
				},
				{id: 'id', name: 'id', field: 'id'},
				{id: 'string', name: 'string', field: 'string'},
				{id: 'date', name: 'date', field: 'date'},
				{id: 'time', name: 'time', field: 'time'},
				{id: 'bool', name: 'bool', field: 'bool'}
			],
			modules: [
				modules.Layer,
				modules.ColumnResizer,
//                modules.ExtendedSelectRow,
				modules.CellWidget,
				modules.Edit,
//                modules.IndirectSelectColumn,
				modules.SingleSort,
				modules.VirtualVScroller
			],
			props: {
				paginationBarSizes: [1, 2, 0],
				selectRowTriggerOnCell: true
			}
		},
		{
			version: 1.3,
			title: 'async layer tree grid',
			guide: [
			],
			cache: "gridx/core/model/cache/Async",
			store: 'mockserver',
			size: 4,
			storeArgs: {
				tree: true,
				maxLevel: 4,
				maxChildrenCount: 10
			},
			structure: [
				//Anything except natual number (1, 2, 3...) means all levels are expanded in this column.
				{id: 'number', name: 'number', field: 'number',
					expandLevel: 'all',
					width: '200px',
					widgetsInCell: true,
					decorator: progressDecorator,
					editable: true,
					editor: 'dijit/form/NumberTextBox'
				},
				{id: 'id', name: 'id', field: 'id'},
				{id: 'string', name: 'string', field: 'string'},
				{id: 'date', name: 'date', field: 'date'},
				{id: 'time', name: 'time', field: 'time'},
				{id: 'bool', name: 'bool', field: 'bool'}
			],
			modules: [
				modules.Layer,
				modules.ColumnResizer,
//                modules.ExtendedSelectRow,
				modules.CellWidget,
				modules.Edit,
//                modules.IndirectSelectColumn,
				modules.SingleSort,
				modules.VirtualVScroller
			],
			props: {
				paginationBarSizes: [1, 2, 0],
				selectRowTriggerOnCell: true
			}
		},
	
		{
			version: 1.2,
			title: 'paged body',
			guide: [
				'scroll to bottom, click load more button, it should show loading info',
				'load 3 times, then the first page (0 - 20) should be gone. There is a Load Previous button instead.',
				'Load Previous and Load More buttons are accessable using TAB'
			],
			cache: "gridx/core/model/cache/Async",
			store: 'mockserver',
			size: 100,
			structure: [
				{id: 'id', name: 'id', field: 'id'},
				{id: 'number', name: 'number', field: 'number'},
				{id: 'string', name: 'string', field: 'string'}
			],
			modules: [
				"gridx/modules/TouchVScroller",
				"gridx/modules/ColumnResizer",
				"gridx/modules/PagedBody"
			],
			props: {
				style: 'width: 500px;',
				pageSize: 20,
				bodyMaxPageCount: 3
			}
		},
		{
			version: 1.2,
			title: 'paged body with page size == 1',
			guide: [
			],
			cache: "gridx/core/model/cache/Async",
			store: 'mockserver',
			size: 1000,
			structure: [
				{id: 'id', name: 'id', field: 'id'},
				{id: 'number', name: 'number', field: 'number'},
				{id: 'string', name: 'string', field: 'string'}
			],
			modules: [
				"gridx/modules/TouchVScroller",
				"gridx/modules/ColumnResizer",
				"gridx/modules/PagedBody"
			],
			props: {
				style: 'width: 500px;',
				pageSize: 1,
				bodyMaxPageCount: 3
			}
		},
		{
			version: 1.3,
			title: 'auto paged body',
			guide: [
			],
			cache: "gridx/core/model/cache/Async",
			store: 'mockserver',
			size: 1000,
			structure: [
				{id: 'id', name: 'id', field: 'id'},
				{id: 'number', name: 'number', field: 'number'},
				{id: 'string', name: 'string', field: 'string'}
			],
			modules: [
				"gridx/modules/TouchVScroller",
				"gridx/modules/ColumnResizer",
				"gridx/modules/AutoPagedBody"
			],
			props: {
				style: 'width: 500px;',
				pageSize: 20,
				bodyMaxPageCount: 3
			}

		}
	];
});
