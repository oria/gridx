define([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/dom-class',
	'../GTest'
], function(array, query, domClass, GTest){
	GTest.statusCheckers.push(
	{
		id: 'paginationBarPosition 1',
		name: 'Pagination bar should be in the place correctly as the position is set',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.arg('position');
		},
		checker: function(grid, doh){
			var p = grid.paginationBar.arg('position');
			switch(p.toLowerCase()){
				case 'bottom':
					doh.t(query('.gridxPaginationBar', grid.footerNode).length, 
						'paginationbar does not locate in the footer');
					doh.f(query('.gridxPaginationBar', grid.headerNode).length, 
						'paginationbar locate in the header');						
					break;

				case 'top':
					doh.t(query('.gridxPaginationBar', grid.headerNode).length, 
						'paginationbar does no locate in the header');
					doh.f(query('.gridxPaginationBar', grid.footerNode).length, 
						'paginationbar not locate in the footer');
					
					break;
				
				case 'both':
					doh.t(query('.gridxPaginationBar', grid.footerNode).length, 
						'paginationbar does not locate in the footer');

					doh.t(query('.gridxPaginationBar', grid.headerNode).length, 
						'paginationbar does not locate in the header');
					
					break;				
			}
		}
	}
);
});
