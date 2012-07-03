define([
], function(){
	return [
		{mod: '', name: 'autoHeight',
			type: 'bool',
			value: false,
			description: 'If this is set to true, the grid will show all the rows without virtical scroller bar. In this mode, the height of grid is defined by the total height of rows.'
		},
		{mod: '', name: 'autoWidth',
			type: 'bool',
			value: false,
			description: 'If this is set to true, the grid will show all the columns without horizontal scroller bar. In this mode, the width of grid is defined by the total width of columns.'
		},
		{mod: 'body', name: 'rowHoverEffect',
			type: 'bool',
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
			unitPost: 'px',
			value: 60,
			description: ''
		},
		{mod: 'columnWidth', name: 'autoResize',
			type: 'bool',
			value: false,
			description: ''
		},
		{mod: 'vScroller', name: 'lazy',
			type: 'bool',
			value: false,
			description: ''
		},
		{mod: 'vScroller', name: 'buffSize',
			type: 'number',
			editor: 'spinner',
			unitPost: 'extra rows',
			value: 5,
			description: ''
		},
		{mod: 'vScroller', name: 'lazyTimeout',
			type: 'number',
			editor: 'spinner',
			unitPost: 'milli-seconds',
			value: 50,
			description: ''
		},
		{mod: 'columnResizer', name: 'miniWidth',
			type: 'number',
			editor: 'numberTextBox',
			unitPost: 'px',
			value: 20,
			description: ''
		},
		{mod: 'columnResizer', name: 'detectWidth',
			type: 'number',
			editor: 'numberTextBox',
			unitPost: 'px',
			value: 5,
			description: ''
		},
		{mod: 'tree', name: 'nested',
			type: 'bool',
			value: false,
			description: ''
		},
		{mod: 'tree', name: 'expandoPadding',
			type: 'number',
			editor: 'numberTextBox',
			unitPost: 'px',
			value: 18,
			description: ''
		},
		{mod: 'selectRow', name: 'triggerOnCell',
			type: 'bool',
			value: false,
			description: ''
		},
		{mod: 'selectRow', name: 'multiple',
			type: 'bool',
			value: false,
			description: ''
		},
		{mod: 'selectColumn', name: 'multiple',
			type: 'bool',
			value: false,
			description: ''
		},
		{mod: 'selectCell', name: 'multiple',
			type: 'bool',
			value: false,
			description: ''
		},
		{mod: 'pagination', name: 'initialPage',
			type: 'number',
			editor: 'spinner',
			unitPre: 'the',
			unitPost: '-th page',
			value: 0,
			description: ''
		},
		{mod: 'pagination', name: 'initialPageSize',
			type: 'number',
			editor: 'spinner',
			unitPost: 'rows per page',
			value: 10,
			description: ''
		},
		{mod: 'dndRow', name: 'canRearrange',
			type: 'bool',
			value: true,
			description: ''
		},
		{mod: 'dndColumn', name: 'canRearrange',
			type: 'bool',
			value: true,
			description: ''
		},
		{mod: 'indirectSelect', name: 'All',
			type: 'bool',
			value: true,
			description: ''
		}







	];
});
