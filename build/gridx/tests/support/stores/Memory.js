define([
	'dojo/store/Memory'
], function(Memory){

return function(args){
	var data = args.maxLevel ? args.dataSource.getData(args.maxLevel, args.maxChildrenCount) :
		args.dataSource.getData(args.size);
	return new Memory({
		data: data.items
	});
};
});

