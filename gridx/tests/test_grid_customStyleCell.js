require([
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/modules'
], function(){

	cellStyle = function(cell){
		return ["height: 73px; background-position: ",
			cell.column.index() * -80.52, "px ",
			cell.row.index() * -81, "px;"
		].join("");
	};
});
