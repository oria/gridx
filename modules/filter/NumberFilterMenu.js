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
		,numbers: []
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
			var arr = [], n = this.numbers.shift();
			while(this.numbers.length){
				if(n === -Infinity){
					n = this.numbers.shift();
					arr.push('< ' + n);
				}else{
					var s;
					if(this.numbers[0] === Infinity){
						s = '> ' + n;
						this.numbers.length = 0;
					}else{
						var s = n + ' - ';
						n = this.numbers.shift();
						s += n;
					}
					arr.push(s);
				}
			}

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
			var exp = '1>1';
			mis.forEach(function(mi){
				if(mi.get('checked')){
					var label = mi.get('label');
					if(/\</.test(label)){
						exp += '|| value ' + label;
					}else if(/\>/.test(label)){
						exp += '|| value' + label;
					}else{
						var arr = label.split(' ');
						var low = arr[0], high = arr[2];
						exp += '|| (value >=' + low + ' && value <=' + high + ')'
					}
				}
			});
			console.log(exp);
			var checker = null;
			if(exp != '1>1')checker = eval('(function(value){return '+exp + ';})');

			this.grid.filter.setFilter(function(row){
				if(!checker || checker(eval(row.data[colId]))){
					return true;
				}else{
					return false;
				}
			});
		}

	});

});