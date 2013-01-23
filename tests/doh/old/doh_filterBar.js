define([
	'dojo/_base/query',
	'dojo/_base/array',
	'dojo/dom',
	'dojo/dom-style',
	'dojo/dom-geometry',
	'./gdoh',
	'gridx/core/model/cache/Sync',
	'../support/data/MusicData',
	'../support/stores/Memory',
	'../support/modules'
], function(query, array, dom, domStyle, domGeo, doh, Cache, dataSource, storeFactory, modules){
	
	var store = storeFactory({
		dataSource: dataSource,
		size: 100
	});
	
	//------------------------------------------------------------------------
//	doh.ts('filterBar.applyFilter');
//	
//	doh.td("apply filter any", function(t, grid){
//		var fb = grid.filterBar;
//		var filterData = {"type":"any","conditions":[{"colId":"id","condition":"greater","value":95,"type":"Number"},{"colId":"Artist","condition":"contain","value":"Jimi Hendrix","type":"Text"}]};
//		fb.applyFilter(filterData);
//		
//		var filteredStoreData = array.filter(store.data, function(item){
//			return (item.id > 95) || (item.Artist.indexOf('Jimi Hendrix') >= 0);
//		});
//		
//		console.log(grid.rowCount());
//	
//		t.t(filteredStoreData.length == grid.rowCount());
//		
//	});


	doh.ts("filter.clearFilter");
	
	doh.td("clear filter", function(t, grid){
		var fb = grid.filterBar;
		var filterData = {"type":"any","conditions":[{"colId":"id","condition":"greater","value":95,"type":"Number"},{"colId":"Artist","condition":"contain","value":"Jimi Hendrix","type":"Text"}]};
		fb.applyFilter(filterData);
		fb.clearFilter();
		
		t.t(fb._cfmDlg.domNode.offsetHeight > 0);
		//fb._cfmDlg.hide();
		
		//fb._cfmDlg.domNode.parentNode.removeChild(fb._cfmDlg.domNode);

		
	});
	

	doh.ts("filter.showFilterDialog");
	
	doh.td("clear filter", function(t, grid){
		var fb = grid.filterBar;
		var filterData = {"type":"any","conditions":[{"colId":"id","condition":"greater","value":95,"type":"Number"},{"colId":"Artist","condition":"contain","value":"Jimi Hendrix","type":"Text"}]};
		fb.applyFilter(filterData);
		fb.showFilterDialog();
		
		t.t(fb._filterDialog.domNode.offsetHeight > 0);
		console.log('filter dialog offsetHeight is ' + fb._filterDialog.domNode.offsetHeight);
		//fb._cfmDlg.hide();
		
		//fb._cfmDlg.domNode.parentNode.removeChild(fb._cfmDlg.domNode);

		
	});
		
	
	return doh.go('filter', [
          'filterBar.applyFilter',
          'filter.clearFilter',
          'filter.showFilterDialog',
        0], {
		cacheClass: Cache,
		store: store,
		structure: dataSource.layouts[1],
		modules: [
			modules.Filter,
			modules.FilterBar
		]
	});

});