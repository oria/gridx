define([
	"gridx/allModules"
], function(mods){
	return {
		ColumnResizer: {
			name: "columnResizer",
			constructor: mods.ColumnResizer
		},
		NavigableCell: {
			name: "navigableCell",
			constructor: mods.NavigableCell
		},
		CellWidget: {
			name: "cellWidget",
			constructor: mods.CellWidget
		},
		Edit: {
			name: "edit",
			constructor: mods.Edit
		},
		SingleSort: {
			name: "sort",
			constructor: mods.SingleSort
		},
		NestedSort: {
			name: "sort",
			constructor: mods.NestedSort
		},
		Pagination: {
			name: "pagination",
			constructor: mods.Pagination
		},
		PaginationBar: {
			name: "paginationBar",
			constructor: mods.paginationBar
		},
		PaginationBarDD: {
			name: "paginationBar",
			constructor: mods.PaginationBarDD
		},
		Filter: {
			name: "filter",
			constructor: mods.Filter
		},
		FilterBar: {
			name: "filterBar",
			constructor: mods.FilterBar
		},
		QuickFilter: {
			name: "quickFilter",
			constructor: mods.QuickFilter
		},
		SelectRow: {
			name: "selectRow",
			constructor: mods.SelectRow
		},
		SelectColumn: {
			name: "selectColumn",
			constructor: mods.SelectColumn
		},
		SelectCell: {
			name: "selectCell",
			constructor: mods.selectCell
		},
		ExtendedSelectRow: {
			name: "selectRow",
			constructor: mods.ExtendedSelectRow
		},
		ExtendedSelectColumn: {
			name: "selectColumn",
			constructor: mods.ExtendedSelectColumn
		},
		ExtendedSelectCell: {
			name: "selectCell",
			constructor: mods.ExtendedSelectCell
		},
		MoveRow: {
			name: "moveRow",
			constructor: mods.MoveRow
		},
		MoveColumn: {
			name: "moveColumn",
			constructor: mods.MoveColumn
		},
		RowHeader: {
			name: "rowHeader",
			constructor: mods.RowHeader
		},
		IndirectSelect: {
			name: "indirectSelect",
			constructor: mods.IndirectSelect
		},
		IndirectSelectColumn: {
			name: "indirectSelect",
			constructor: mods.IndirectSelectColumn
		},
		ColumnLock: {
			name: "columnLock",
			constructor: mods.ColumnLock
		},
		RowLock: {
			name: "rowLock",
			constructor: mods.RowLock
		},
		Tree: {
			name: "tree",
			constructor: mods.Tree
		},
		HiddenColumns: {
			name: 'hiddenColumns',
			constructor: mods.HiddenColumns
		},
		GroupHeader: {
			name: 'groupHeader',
			constructor: mods.GroupHeader
		},
		TouchVScroller: {
			name: 'vScroller',
			constructor: mods.TouchVScroller
		},
		PagedBody: {
			name: 'pagedBody',
			constructor: mods.PagedBody
		},
		Dod: {
			name: 'dod',
			constructor: mods.Dod
		},
		VirtualVScroller: {
			name: "virtualVScroller",
			constructor: mods.VirtualVScroller
		}
	};
});
