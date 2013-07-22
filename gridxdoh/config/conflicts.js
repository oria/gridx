define([
], function(){
	//conflicts: config item => conflicting config item
	return {
		MoveRow: {
			SingleSort: 1,
			NestedSort: 1
		},
		ExtendedSelectRow: {
			selectRowMultiple_false: 1
		},
		ExtendedSelectCell: {
			selectCellMultiple_false: 1
		},
		ExtendedSelectColumn: {
			selectColumnMultiple_false: 1
		},
		columnWidthAutoResize: {
			ColumnResizer: 1
		},
		autoWidth: {
			ColumnLock: 1
		},
		Tree: {
			MoveRow: 1
		},
		selectRowTriggerOnCell: {
			SelectCell: 1,
			ExtendedSelectCell: 1
		},
		RowLock: {
			VirtualVScroller: 1
		},
		GroupHeader: {
			ColumnLock: 1,
			HiddenColumns: 1
		},
		PagedBody: {
			Pagination: 1,
			VirtualVScroller: 1
		}
	};
});
