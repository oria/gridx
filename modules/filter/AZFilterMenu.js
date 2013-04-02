define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dijit/Menu",
	"dijit/CheckedMenuItem",
	"../Filter"

], function(declare, lang, array, Menu, CheckedMenuItem, Filter){

	return declare([Menu], {
		grid: null
		,colId: null
		,leftClickToOpen: true
		,postCreate: function(){
			this.inherited(arguments);
			this._createMenuItems();
		},

		bindGrid: function(grid){
			//summary:
			//	Attach the menu with grid, so that it could do filter actions
			this.grid = grid;
		},

		_createMenuItems: function(){
			var f = lang.hitch(this, '_doFilter');
			var arr = ['A-F', 'G-L', 'M-R', 'S-Z'];

			array.forEach(arr, function(item){
				this.addChild(new CheckedMenuItem({
					label: item,
					onChange: f
				}));
			}, this);
		},

		_doFilter: function(){
			var colId = this.colId;
			var mis = this.getChildren();
			var reg = '';
			mis.forEach(function(mi){
				if(mi.get('checked')){
					reg += mi.get('label');
				}
			});
			console.log(reg);
			if(reg){
				//maybe reg is empty string
				reg = new RegExp('^[' + reg + ']', 'i');
			}
			this.grid.filter.setFilter(function(row){
				if(!reg || reg.test(row.data[colId])){
					return true;
				}else{
					return false;
				}
			});
		}

	});

});