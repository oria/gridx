require([
	'dojo/_base/array',
	'dojo/dom',
	'dojo/dom-class',
	'dijit/layout/AccordionContainer',
	'dijit/layout/ContentPane',
	'dojox/fx/scroll'
], function(array, dom, cls, AccordionContainer, ContentPane, smoothScroll){

	var packs = [
		['Core', [
			['Simplest Grid', 'demo_mini_grid', 'simplegrid.png', 'The most lightweight mini Grid'],
			['AutoHeight / autoWidth', 'test_grid_autoHeight_autoWidth', 'autoheight-autowidth.png', 'Make the grid show every row (autoHeight) and every column (autoWidth).'],			
			['Declarative Creation', 'test_grid_declarative', 'declarative.jpg', 'Declaratively create a grid in HTML by means of dojo parser.'],
			['ColumnWidth Distribution', 'test_grid_columnwidth', 'columnwidth.png', 'Distribute column width smartly based on any flexible combinations of pixel/em/percentage or auto adjusting'],			
			['Resize', 'test_grid_resize', 'resize.png', 'Resize the grid use the resize function.'],
		0]],
		['Plugins', [		
			['Virtual Scrolling', 'test_grid_virtualScroller', 'virtualscroller.jpg', 'Lazy-render the grid body to speed up the whole rendering process and minimize memory usage. This is an useful alternative to pagination.'],						
			['Simple Select', 'test_grid_select', 'select.jpg', 'Basic but useful support for row selection, column selection and cell selection. Only select by ID. Not support selecting by index. Not support wrap selection.'],
			['Single Sort', 'test_grid_singleSort', 'singlesort.jpg', 'Only one column is allowed to be sorted at any time.'],
			['Nested Sort', 'test_grid_nestedSort', 'nestedsort.jpg', 'Multiple columns can be sorted in a nested way.'],
			['Pagination', 'test_grid_paginationBarDD', 'pagination.jpg', 'Visually paging the rows, let the user control paging details. This is a useful alternative to virtual scrolling.'],
			['Export & Print', 'test_grid_exporter_print', 'exportprint.jpg', 'An export framework for grid. Currently only support exporting to CSV format. Also provides print & preview machinery.'],
			['Menus', 'test_grid_menu', 'menu.jpg', 'Showing how to connect customized menus to grid.'],
			['Persist', 'test_grid_persist', 'persist.jpg', 'An extandable feature-persistance framework, currently allowing to save column width, column order, sorting order, etc.'],
			['Extended Select', 'test_grid_extendedSelect', 'extendedselect.jpg', 'Full featured extended selection for row, column and cell. Feel more like Excel.'],
			['Filter', 'test_grid_filter', 'filter.jpg', 'Powerful filter bar and filter dialog, supporting advanced client-side or server-side filtering.'],
			//['Dijits in Cell', 'test_grid_cellDijit', ' ', 'Provides better support for dijits/widgets in grid cells. These widgets are reused to improve performance, regardless whether the virtual scrolling or pagination feature is used.'],
			['Editable Cell', 'test_grid_edit', 'editable.jpg', 'Based on the Dijits in Cell module to provide editable cell functionality. The editing dijit/widget only occur while entering editing mode.'],
			['Indirect Select', 'test_grid_indirectSelect', 'indirectselect.jpg', 'A useful enhancement for row selection, to better demonstrate the selected/unselected status of rows by means of check boxes.'],
			//['Column Lock', 'test_grid_columnLock', 'columnlock.png', 'Lock up some of the grid columns so that they don\'t move out of view when the grid body is horizontally scrolled.'],
			['Details on Demand', 'test_grid_dod', 'dod.jpg', '<b>Experimental</b> - A pretty feature providing the ability for rows to expand. Various arguments available to support different use cases.'],
			['DnD columns/rows within Grid', 'test_grid_dnd_rearrange', 'dnd.jpg', 'Rearrange grid rows and columns by drag & drop'],
			['DnD rows between grid', 'test_grid_dndrow_betweengrids', 'dnd2.jpg', 'Drag and drop grid rows to other grids.'],
			['DnD rows from/to non-grid sources', 'test_grid_dndrow_nongrid_source', 'dnd3.jpg', 'Drag and drop grid rows between grid and non-grid sources.'],
			['DnD rows to non-grid targets', 'test_grid_dndrow_nongrid_target', 'dnd4.jpg', 'Drag and drop grid rows to non-grid targets.'],
			//['Drag & Drop - Drag columns to non-grid targets', 'test_grid_dndcolumns_nongrid_target', 'dnd.jpg', 'Drag and drop grid columns to non-grid targets.'],
		0]],
		['Performance', [
 		    ['GridX with a huge store(1,000,000 rows)', 'test_grid_huge_data', 'hugestore.jpg', 'GridX can now work nicely with extremely huge data stores larger than 1 million rows'],
 		0]],		
		['Compatibility', [
			['Grid in Dijit Containers', 'test_grid_container', 'container.png', 'Another demo for the grid resize function, showing how it could be used in dijit containers.'],
		0]],
		['Other Types of Grid', [
 			['Tree Grid', 'test_grid_tree', 'tree.jpg', '<b>Experimental</b> - Makes grid support Tree structured data. Two types of tree data models are supported: nested or not. In nested mode, expandos are placed in different columns whilist all expandos are in one column in the other mode.'],
 		0]]		
	];

	window.highlightFeature = function(packIdx, index, toHighlight){
		var n = document.getElementById('f' + packIdx + '_' + index);
		if(toHighlight){
            smoothScroll({
                node: n,
                win: dojo.byId('gallery'),
                duration: 500
            }).play();
		}
		cls.toggle(n, 'featureHighlighted', toHighlight);
	};

	function createMenu(feature, packIdx, index){
		return ["<div class='menulink' onclick='highlightFeature(", packIdx, ',', index, 
			", true)' onmouseout='highlightFeature(", packIdx, ',', index, 
			", false)'><!--span class='menuindex'>", index + 1, 
			".</span--><span class='menutext'>", feature[0], 
			"</span></div>"
		].join('');
	}

	function createFeature(feature, packIdx, index){
		return ["<div id='f", packIdx, '_', index, 
			"' class='feature'><a target='_blank' href='../tests/", feature[1], 
			".html'><img src='image/", feature[2], 
			"'/><div><h3>", feature[0], 
			"</h3><p>", feature[3],
			"</p></div></a></div>"
		].join('');
	}

	dojo.ready(function(){
		var ac = new AccordionContainer({}), gallerysb = [];
		array.forEach(packs, function(p, i){
			var sb = [];
			array.forEach(p[1], function(f, j){
				if(f){
					sb.push(createMenu(f, i, j));
					gallerysb.push(createFeature(f, i, j));
				}
			});
			ac.addChild(new ContentPane({
				title: p[0],
				content: sb.join('')
			}));
		});

		dom.byId('gallery').innerHTML = gallerysb.join('');
		ac.placeAt('menulist');
		ac.startup();
	});
});
