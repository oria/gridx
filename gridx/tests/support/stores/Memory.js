define([
	'dojo/store/Memory'
], function(Memory){

return function(args){
	return new Memory({
		data: args.dataSource.getData(args.size).items
	});
};
});

