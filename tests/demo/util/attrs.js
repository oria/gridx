define([
], function(){
	return [
		{mod: '', name: 'autoHeight',
			type: 'bool',
			unitPost: 'Grid body height equals the sum of row height, and there\'s no vertical scroll bar.',
			value: false,
			description: 'If this is set to true, the grid will show all the rows without virtical scroller bar. In this mode, the height of grid is defined by the total height of rows.'
		},
		{mod: '', name: 'autoWidth',
			type: 'bool',
			unitPost: 'Grid body width equals the sum of column width, and there\'s no horizontal scroll bar.',
			value: false,
			description: 'If this is set to true, the grid will show all the columns without horizontal scroller bar. In this mode, the width of grid is defined by the total width of columns.'
		},
		{mod: 'body', name: 'rowHoverEffect',
			type: 'bool',
			unitPost: 'When mouse hovering a row, highlight it.',
			value: true,
			description: ''
		},
		{mod: 'columnLock', name: 'count',
			type: 'number',
			editor: 'spinner',
			unitPre: 'lock the first',
			unitPost: 'columns',
			value: 1,
			description: ''
		},
		{mod: 'columnWidth', name: 'default',
			type: 'number',
			editor: 'numberTextBox',
			unitPre: 'Default column width set to',
			unitPost: 'px',
			value: 60,
			description: ''
		},
		{mod: 'columnWidth', name: 'autoResize',
			type: 'bool',
			unitPost: 'Only percentage column width and auto column width are allowed, no horizontal scroll bar, no column resizer.',
			value: false,
			description: ''
		},
		{mod: 'vScroller', name: 'lazy',
			type: 'bool',
			unitPost: 'Fetch data only when user stops scrolling the grid vertically.',
			value: false,
			description: ''
		},
		{mod: 'vScroller', name: 'buffSize',
			type: 'number',
			editor: 'spinner',
			unitPre: 'Render',
			unitPost: 'more rows above/below the view port.',
			value: 5,
			description: ''
		},
		{mod: 'vScroller', name: 'lazyTimeout',
			type: 'number',
			editor: 'spinner',
			unitPre: 'Wait for',
			unitPost: 'milli-seconds before fetching data for every scroll (only effective when "lazy" is true)',
			value: 50,
			description: ''
		},
		{mod: 'columnResizer', name: 'miniWidth',
			type: 'number',
			editor: 'numberTextBox',
			unitPre: 'The minimal width a column can be resized to is',
			unitPost: 'px',
			value: 20,
			description: ''
		},
		{mod: 'columnResizer', name: 'detectWidth',
			type: 'number',
			editor: 'numberTextBox',
			unitPre: 'Change mouse cursor to resizer shape when it is less than',
			unitPost: 'px from the right border of a column',
			value: 5,
			description: ''
		},
		{mod: 'tree', name: 'nested',
			type: 'bool',
			unitPost: 'Show tree expandos in different columns for each level of data.',
			value: false,
			description: ''
		},
		{mod: 'tree', name: 'expandoPadding',
			type: 'number',
			editor: 'numberTextBox',
			unitPre: 'For every level in Tree grid, intend the expando by',
			unitPost: 'px',
			value: 18,
			description: ''
		},
		{mod: 'selectRow', name: 'triggerOnCell',
			type: 'bool',
			unitPost: 'Select a row when any cell in that row is clicked.',
			value: false,
			description: ''
		},
		{mod: 'selectRow', name: 'multiple',
			type: 'bool',
			unitPost: 'Allow selecting multiple rows (holding CTRL).',
			value: false,
			description: ''
		},
		{mod: 'selectColumn', name: 'multiple',
			type: 'bool',
			unitPost: 'Allow selecting multiple columns (holding CTRL).',
			value: false,
			description: ''
		},
		{mod: 'selectCell', name: 'multiple',
			type: 'bool',
			unitPost: 'Allow selecting multiple cells (holding CTRL).',
			value: false,
			description: ''
		},
		{mod: 'pagination', name: 'initialPage',
			type: 'number',
			editor: 'spinner',
			unitPre: 'Show the',
			unitPost: '-th page when grid is created.',
			value: 0,
			description: ''
		},
		{mod: 'pagination', name: 'initialPageSize',
			type: 'number',
			editor: 'spinner',
			unitPre: 'Show',
			unitPost: 'rows for every page',
			value: 10,
			description: ''
		},
		{mod: 'dndRow', name: 'canRearrange',
			type: 'bool',
			unitPost: 'Allow rearrange rows within the grid by drag and drop.',
			value: true,
			description: ''
		},
		{mod: 'dndColumn', name: 'canRearrange',
			type: 'bool',
			unitPost: 'Allow rearrange columns within the grid by drag and drop.',
			value: true,
			description: ''
		},
		{mod: 'indirectSelect', name: 'All',
			type: 'bool',
			unitPost: 'Show the "select all" check box in the header of the indirect selection column.',
			value: true,
			description: ''
		}







	];
});
