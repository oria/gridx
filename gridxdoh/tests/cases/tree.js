define([
	'gridx/allModules',
	'dijit/ProgressBar'
], function(modules){

	var progressDecorator = function(){
		return [
			"<div data-dojo-type='dijit.ProgressBar' data-dojo-props='maximum: 10000' ",
			"class='gridxHasGridCellValue' style='width: 100%;'></div>"
		].join('');
	};

	return [
		{
			title: 'All expandoes in one column, sync store',
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
				modules.Tree,
				modules.Pagination,
				modules.PaginationBar,
				modules.ColumnResizer,
				modules.ExtendedSelectRow,
				modules.CellWidget,
				modules.Edit,
				modules.IndirectSelectColumn,
				modules.SingleSort,
				modules.VirtualVScroller
			],
			props: {
				paginationBarSizes: [1, 2, 0],
				selectRowTriggerOnCell: true
			}
		},
		{
			title: 'All expandoes in one column, async store',
			cache: "gridx/core/model/cache/Async",
			store: 'mockserver',
			size: 4,
			storeArgs: {
				tree: true,
				maxLevel: 4,
				maxChildrenCount: 10
			},
			structure: [
				//Expandable column defaults to the first one, if no expandLevel provided.
				{id: 'id', name: 'id', field: 'id'},
				{id: 'number', name: 'number', field: 'number',
					widgetsInCell: true,
					decorator: progressDecorator
				},
				{id: 'string', name: 'string', field: 'string'},
				{id: 'date', name: 'date', field: 'date'},
				{id: 'time', name: 'time', field: 'time'},
				{id: 'bool', name: 'bool', field: 'bool'}
			],
			modules: [
				modules.Tree,
				modules.Pagination,
				modules.PaginationBar,
				modules.ColumnResizer,
				modules.ExtendedSelectRow,
				modules.CellWidget,
				modules.Edit,
				modules.IndirectSelectColumn,
				modules.SingleSort,
				modules.VirtualVScroller
			],
			props: {
				paginationBarSizes: [1, 2, 0],
				selectRowTriggerOnCell: true
			}
		},
		{
			title: 'Expandoes in different columns (nested), async store',
			cache: "gridx/core/model/cache/Async",
			store: 'mockserver',
			size: 4,
			storeArgs: {
				tree: true,
				maxLevel: 4,
				maxChildrenCount: 10
			},
			structure: [
				{id: 'number', name: 'number', field: 'number'},
				{id: 'string', name: 'string', field: 'string'},
				{id: 'date', name: 'date', field: 'date'},
				{id: 'time', name: 'time', field: 'time'},
				{id: 'bool', name: 'bool', field: 'bool'},
				{id: 'id', name: 'id', field: 'id'}
			],
			modules: [
				modules.Tree,
				modules.Pagination,
				modules.PaginationBar,
				modules.ColumnResizer,
				modules.ExtendedSelectRow,
				modules.CellWidget,
				modules.Edit,
				modules.IndirectSelectColumn,
				modules.SingleSort,
				modules.VirtualVScroller
			],
			props: {
				treeNested: true,
				paginationBarSizes: [1, 2, 0],
				selectRowTriggerOnCell: true
			}
		},
		{
			title: 'Customized expando positions (nested), async store',
			cache: "gridx/core/model/cache/Async",
			store: 'mockserver',
			size: 4,
			storeArgs: {
				tree: true,
				maxLevel: 4,
				maxChildrenCount: 10
			},
			structure: [
				{id: 'id', name: 'id', field: 'id'},
				{id: 'number', name: 'number *', field: 'number', expandLevel: 1},
				{id: 'string', name: 'string *', field: 'string', expandLevel: 2},
				{id: 'date', name: 'date', field: 'date'},
				{id: 'time', name: 'time *', field: 'time', expandLevel: 3},
				{id: 'bool', name: 'bool', field: 'bool'}
			],
			modules: [
				modules.Tree,
				modules.Pagination,
				modules.PaginationBar,
				modules.ColumnResizer,
				modules.ExtendedSelectRow,
				modules.CellWidget,
				modules.Edit,
				modules.IndirectSelectColumn,
				modules.SingleSort,
				modules.VirtualVScroller
			],
			props: {
				treeNested: true,
				paginationBarSizes: [1, 2, 0],
				selectRowTriggerOnCell: true
			}
		}
	];
});

