define('dojox/grid/gridx/tests/MockServerStore', [
'dojo',
'dojo/data/ItemFileWriteStore'
], function(dojo){

return dojo.declare('dojox.grid.gridx.tests.MockServerStore', dojo.data.ItemFileWriteStore, {
	fetch: function(request){
		var t = request.start * 10, args = arguments, _this = this, spr = this.inherited;
		setTimeout(function(){
			spr.call(_this, args);
		}, 10);
		return request;
	}
});
});
