define([
	'dojo/_base/query',
	'dojo/_base/array',
	'dojo/dom',
	'dojo/dom-geometry',
	'./gdoh',
	'gridx/core/model/cache/Sync',
	'../support/data/MusicData',
	'../support/stores/Memory',
	'../support/modules'
], function(query, array, dom, domGeo, doh, Cache, dataSource, storeFactory, modules){
	
	var store = storeFactory({
		dataSource: dataSource,
		size: 100
	});
	
	//------------------------------------------------------------------------
	doh.ts('filter.condition');
	
	doh.td("filter any", function(t, grid){
		var fb = grid.filterBar;
		var filterData = {"type":"any","conditions":[{"colId":"id","condition":"greater","value":95,"type":"Number"},{"colId":"Artist","condition":"contain","value":"Jimi Hendrix","type":"Text"}]};
		fb.applyFilter(filterData);
		
		var filteredStoreData = array.filter(store.data, function(item){
			return (item.id > 95) || (item.Artist.indexOf('Jimi Hendrix') >= 0);
		});
		
		console.log(grid.rowCount());
	
		t.t(filteredStoreData.length == grid.rowCount());
		
	});

	doh.td("filter any with conflict", function(t, grid){
		var fb = grid.filterBar;
		var filterData = {"type":"any","conditions":[{"colId":"id","condition":"greater","value":95,"type":"Number"},
		                                             {"colId":"id","condition":"lessEqual","value":95,"type":"Number"},
		                                             {"colId":"Artist","condition":"contain","value":"Jimi Hendrix","type":"Text"}]};
		fb.applyFilter(filterData);
		
		t.t(100 == grid.rowCount());
		
	});

	doh.td("filter all", function(t, grid){
		var fb = grid.filterBar;
		var filterData = {"type":"all","conditions":[{"colId":"id","condition":"greater","value":30,"type":"Number"},{"colId":"Artist","condition":"contain","value":"Jimi Hendrix","type":"Text"}]};
		fb.applyFilter(filterData);
		
		var filteredStoreData = array.filter(store.data, function(item){
			return (item.id > 30) && (item.Artist.indexOf('Jimi Hendrix') >= 0);
		});
		
		t.t(filteredStoreData.length == grid.rowCount());
		
	});
	
	doh.td("filter all with conflict", function(t, grid){
		var fb = grid.filterBar;
		var filterData = {"type":"all","conditions":[{"colId":"id","condition":"greater","value":30,"type":"Number"},
		                                             {"colId":"id","condition":"less","value":30,"type":"Number"},
		                                             {"colId":"Artist","condition":"contain","value":"Jimi Hendrix","type":"Text"}]};
		fb.applyFilter(filterData);

		t.t(0 == grid.rowCount());
		
	});	

	doh.td("filter with empty colId", function(t, grid){
		var fb = grid.filterBar;
		//filter with empty 
		var filterData = {"type":"all","conditions":[{"condition":"contain", "value":"Jimi Hendrix", "type":"Number"}]};
		fb.applyFilter(filterData);
		
		var filteredStoreData = array.filter(store.data, function(item){
			for(var key in item){
				if(item[key].toString().indexOf("Jimi Hendrix") >= 0)
					return true;
			}
			return false;
		});
		
		t.t(filteredStoreData.length == grid.rowCount());
		
	});
	
	return doh.go('filter', [
          'filter.condition',
    0], {
		cacheClass: Cache,
		store: store,
		structure: dataSource.layouts[0],
		modules: [
			modules.Filter,
			modules.FilterBar
		]
	});

});