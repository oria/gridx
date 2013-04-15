define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"./_FilterMenuBase",
	"dijit/CheckedMenuItem"
], function(declare, array, _FilterMenuBase, CheckedMenuItem){

	return declare(_FilterMenuBase, {
		// summary:
		//		

		_createMenuItems: function(){
			var t = this,
				arr = ['A-F', 'G-L', 'M-R', 'S-Z'];
			array.forEach(arr, function(item){
				t.addChild(new CheckedMenuItem({
					label: item,
					onChange: function(){
						t._addRule();
					}
				}));
			});
		},

		_addRule: function(){
			var t = this,
				key = 'azfilter',
				reg = '';
			t.getChildren().forEach(function(mi){
				if(mi.get('checked')){
					reg += mi.get('label');
				}
			});
			if(reg){
				reg = new RegExp('^[' + reg + ']', 'i');
				t._addFilter(key, function(row){
					return reg.test(String(row.data[t.colId]));
				});
			}else{
				//If reg is empty string, remove this filter
				t._removeFilter(key);
			}
		}
	});
});
