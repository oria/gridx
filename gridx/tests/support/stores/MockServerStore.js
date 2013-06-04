define('gridx/tests/MockServerStore', [
'dojo',
'dojo/data/ItemFileWriteStore'
], function(dojo){

return dojo.declare('gridx.tests.MockServerStore', dojo.data.ItemFileWriteStore, {
	constructor: function(){
		var oldFetch = this.fetch;
		this.fetch = function(request){
			var t = request.start * 10, _this = this;
			setTimeout(function(){
				oldFetch.call(_this, request);
			}, 200);
			return request;
		}
	}
});
});
