define([
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/data/TestData'
], function(memoryFactory, IFWSFactory, dataSource){
	return {
		syncStores: [
			memoryFactory({
				dataSource: dataSource,
				size: 0
			}),
			memoryFactory({
				dataSource: dataSource,
				size: 10
			})
		],
		asyncStores: [
			IFWSFactory({
				isAsync: 1,
				asyncTimeout: 50,
				dataSource: dataSource,
				size: 10
			})
		]
	};
});
