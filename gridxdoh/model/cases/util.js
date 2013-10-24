define([
	'dojo/_base/lang',
	'../util/data/AllData',
	'../util/stores/Memory',
	'gridx/core/model/Model',
	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async'
], function(lang, dataSource, storeFactory, Model, Sync, Async){

	function createModel(useAsyncCache, args){
		var store = storeFactory(lang.mixin({
			dataSource: dataSource
		}, args || {}));

		return new Model({
			cacheClass: useAsyncCache ? Async : Sync,
			store: store,
			columnsById: {
				id: { field: 'id' },
				order: { field: 'order' },

				Genre: { field: 'Genre' },
				Artist: { field: 'Artist' },
				Album: { field: 'Album' },
				Name: { field: 'Name' },
				Composer: { field: 'Composer' },
				Track: { field: 'Track' },
				Year: { field: 'Year' },
				"Download Date": { field: '"Download Date"' },
				"Last Played": { field: '"Last Played"' },
				Length: { field: 'Length' },
				Heard: { field: 'Heard' },
				Color: { field: 'Color' },
				Progress: { field: 'Progress' },

				name: { field: 'name' },
				server: { field: 'server' },
				platform: { field: 'platform' },
				status: { field: 'status' },
				progress: { field: 'progress' },

				number: { field: 'number' },
				string: { field: 'string' },
				date: { field: 'date' },
				time: { field: 'time' },
				bool: { field: 'bool' }
			}
		});
	}

	return {
		createModel: createModel
	};
});
