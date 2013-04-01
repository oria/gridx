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
			var arr = ['A-Fs', 'G-L', 'M-R', 'S-Z'];

			array.forEach(arr, function(item){
				this.addChild(new CheckedMenuItem({
					label: item,
					onChange: function(){alert(1);}
					,onClick: function(){alert(2);}
				}));
			}, this);
		},

		_doFilter: function(){
			console.log('abc');
			this.grid.filter.setFilter(function(){
				console.log(arguments);
				return true;
			});
		}

	});

});