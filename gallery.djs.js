define([
	'dojo/_base/declare'
	,'dojos/PageContext'
	,'dojo/text!./header.html'
	,'dojo/text!./footer.html'
], function(declare, PageContext, header, footer){
    return declare(PageContext, {
    	getContent: function(){
    		
    	}
        ,getContext: function(){
        	var context = {
        		header: header
        		,footer: footer
	        	,core: [
	        		{
	        			id: 'header'
	        			,name: 'Header'
	        			,description: 'This module is in charge of the rendering of the grid header. But it should not manage column width, which is the responsibility of ColumnWidth module.'
	        			,demo: 'test_grid.html'
	        		},{
	        			id: 'body'
	        			,name: 'Body'
	        			,description: 'This module is in charge of row rendering. It should be compatible with virtual/non-virtual scroll, pagination, details on demand, and even tree structure.'
	        			,demo: 'test_grid.html'
	        		},{
	        			id: 'virtualScroller'
	        			,name: 'Virtual Scroller'
	        			,description: 'This module takes a DOMNode-based way to implement lazy-rendering.\
							It tries to remove all the DOMNodes that are out of the grid body viewport,\
							so that the DOMNodes in grid are always limited to a very small number.'
	        		},{
	        			id: 'hScroller'
	        			,name: 'Horizontal Scroller'
	        			,description: 'This module provides basic horizontal scrolling for grid'
	        			,demo: 'test_grid.html'
	        		},{
	        			id: 'columnResizer'
	        			,name: 'Column Resizer'
	        			,description: 'This module provides a way to resize column width. '
	        		},{
	        			id: 'singleSort'
	        			,name: 'Single Sort'
	        			,description: 'This module provides the single column sorting functionality for grid.'
	        		}
	        	]
	        	,basic: [
	        		{
	        			id: 'editableCell'
	        			,name: 'Editable Cell'
	        			,description: 'This module relies on an implementation of the CellWidget module.\
							The editing mode means there will be an editable widget appearing in the grid cell.\
							This implementation also covers "alwaysEditing" mode for grid columns,\
							which means all the cells in this column are always in editing mode.'
	        			,demo: 'test_grid_edit.html'
	        		},{
	        			id: 'pagination'
	        			,name: 'Pagination'
	        			,description: 'This module does not include any UI buttons for pagination, so that various\
							kinds of pagination UI implementations can benifit from this module.'
	        			,demo: 'test_grid_paginationBar.html'
	        		},{
	        			id: 'simpleSelect'
	        			,name: 'Simple Select'
	        			,description: 'There are three modules for simple row/column/cell select.\
			    			These modules only allow to select a single row/column/cell in one time.\
			    			If need multi select, use extendedSelect instead.'
	        			,demo: 'test_grid_select.html'
	        		},{
	        			id: 'indirectSelect'
	        			,name: 'Indirect Select'
	        			,description: 'This module will check whether the SelectRow module provides the functionality \
	        				 of "select rows by index" \
							(which means the "selectByIndex" method exists). If so, a "select all" checkbox can be provided \
							in the header node of the row header column.'
	        		},{
	        			id: 'rowDnd'
	        			,name: 'Row DnD'
	        			,description: 'This module provides an implementation of row drag & drop. '
							+ 'It supports row reordering within grid, dragging out of grid, and dragging into grid.'
	        			,demo: 'test_grid_dndrow_nongrid_source.html'
	        		},{
	        			id: 'columnDnd'
	        			,name: 'Column DnD'
	        			,description: 'This module provides an implementation of column drag & drop. '
							+ 'It supports column reordering within grid, dragging out of grid, and dragging into grid.'
	        			,demo: 'test_grid_dnd_rearrange.html'
	        		},{
	        			id: 'filter'
	        			,name: 'Filter'
	        			,description: 'This module makes it possible for user to set arbitrary filter condition to grid.'
	        				+ ' It is used by an UI module FilterBar which provides the interface to set filter rules.'
	        		},{
	        			id: 'cellWidget'
	        			,name: 'Cell Widgets'
	        			,description: 'Since widget declarations need to be parsed by dojo.parser, it can NOT be directly'
							+ ' created by the decorator function. This module takes advantage of the _TemplatedMixin'
							+ ' and the _WidgetInTemplateMixin so that users can write "templates" containing widgets'
							+ ' in decorator function.'
	        		},{
	        			id: 'menu'
	        			,name: 'Menus'
	        			,description: 'This module provides grid context menu. The context could be cell, column, row, header, body etc.'
	        				+ ' All information is passed to menu actions by callback arguments'
	        		},{
	        			id: 'persist'
	        			,name: 'Persists'
	        			,description: 'Provide a mechanism to persist various grid features when the grid is destroyed,'
							+ ' so that when a new grid with the same id (or the same persist key) is created,'
							+ ' all these features will be restored.'
	        		}
	        	]
	        	,advanced: [
	        		{
	        			id: 'export_print'
	        			,name: 'Export/Print'
	        			,description: 'This module provides the API to print grid contents or provide print preview'
	        			,demo: 'test_grid_exporter.html'
	        		},{
	        			id: 'nestedSort'
	        			,name: 'Nested Sort'
	        			,description: 'This module provides the UI to sort the grid by multi columns.' 
	        				+ ' Each column header shows a number indicating the sort order.'
	        		},{
	        			id: 'columnLock'
	        			,name: 'Column Lock'
	        			,description: 'This module provides a way to lock consecutive leading columns.'
	        		},{
	        			id: 'rowLock'
	        			,name: 'Row Lock'
	        			,description: 'This module allows consecutive top rows to be locked. It could only be used with sync vertical scroller.'
	        		},{
	        			id: 'dod'
	        			,name: 'Details on Demand'
	        			,description: 'This module allows a row to be expanded to show details.'
	        				+ ' An arrow is displayed in the first of each row and clicking it will toggle detail display.'
	        		},{
	        			id: 'extendedSelect'
	        			,name: 'Extended Select'
	        			,description: 'This module provides the capability to select multi rows/columns'
	        		},{
	        			id: 'treeGrid'
	        			,name: 'Tree Grid'
	        			,description: 'This module is used for creation, destruction and management of the Tree Grid.'
							+ ' There are two kind of Tree Grid: columnar or nested, it will be indicated by'
							+ ' the argument `type`, and the layout of the TreeGrid will be defined by extended'
							+ ' structure` argument.'
	        			,demo: 'test_grid_tree.html'
	        		}
	        	]
	        	,mobile: [
	        		{
	        			id: 'mobile'
	        			,name: 'Mobile Grid'
	        			,description: 'Mobile GridX is based on dojox.mobile and provides native-like UI.'
	        				+ 'It\'s now only for experienmental using. '
	        				+ 'Currently it provides several plugins such as pull-refresh/lazy-load/sort etc.'
	        			,demo: '../mobile/demos/demo.html'
	        		}
	        	]
	        };
	        context.all = context.core.concat(context.basic).concat(context.advanced).concat(context.mobile);
	        context.all.forEach(function(m){if(!m.demo)m.demo = 'test_grid_' + m.id + '.html';});
	        return context;
	    }
    });
});



