define([
	'dojo/store/Memory'
], function(Memory){

return function(args){
	var data = args.dataSource.getData(args);
	return new Memory({
		data: data.items
	});
};
});

