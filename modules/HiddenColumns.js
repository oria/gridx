define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/dom-class",
	"dojo/_base/query",
	"../core/_Module"
], function(declare, array, domClass, query, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		Hide columns efficiently.
		// description:
		//		Hide columns and change the column array at the same time so that other grid features 
		//		are not affected by hidden columns. That means, hidden columns can no longer be accessed 
		//		through grid.columns() function.
		//		This module combines the benefits of two different ways of hiding columns. One is to use CSS only.
		//		This approach is simple and efficient, but hidden columns can still be accessed by grid API, so all 
		//		other column related grid features has to be aware of the hidden columns, which introduces too much
		//		complexity. The other approach is to use grid.setColumns(), this way can perfectly solve the mis-match
		//		between UI and API, but it is quite inefficient because the whole grid is re-renderred.
		//		This module has the efficiency of the first approach while still maintaining the API consistancy of 
		//		the second approach.

		// init: String[]
		//		IDs of columns to be hidden when grid is initially created.
		init: [],

		add: function(colId){
			// summary:
			//		Hide all the given columns in arguments.
			// colId: String|gridx.core.Column...
			//		Column IDs can be provided directly as arguments.
			//		gridx.core.Column object can also be provided.
			// example:
			//	|	//Hide columnA
			//	|	grid.hiddenColumns.add("columnA");
			//	|	//Hide columnB, columnC and columnD
			//	|	grid.hiddenColumns.add("columnB", "columnC", "columnD");
			//	|	//Column object is also acceptable.
			//	|	var col = grid.column("columnA");
			//	|	grid.hiddenColumns.add(col);
		},

		remove: function(colId){
			// summary:
			//		Show all the given columns in arguments.
			// colId: String|gridx.core.Column...
			//		Column IDs can be provided directly as arguments.
			//		gridx.core.Column object can also be provided.
			// example:
			//	|	//show columnA
			//	|	grid.hiddenColumns.remove("columnA");
			//	|	//show columnB, columnC and columnD
			//	|	grid.hiddenColumns.remove("columnB", "columnC", "columnD");
			//	|	//Column object is also acceptable.
			//	|	var col = { id: "columnA", ...};	//Can also be a column object retreived before it is hidden.
			//	|	grid.hiddenColumns.remove(col);
		},

		clear: function(){
			// summary:
			//		Show all hidden columns.
		},

		get: function(){
			// summary:
			//		Get an array of current hidden column IDs.
			// returns:
			//		An array of current hidden column IDs.
		}
	});
=====*/

	function keysOfDict(obj){
		var res = [];
		for(var i in obj){
			res.push(i);
		}
		return res;
	}

	return declare(_Module, {
		name: 'hiddenColumns',

		getAPIPath: function(){
			return {
				hiddenColumns: this
			};
		},

		constructor: function(){
			this._cols = {};
		},

		load: function(args, startup){
			var t = this,
				ids = t.arg('init', []);
			if(t.grid.persist){
				ids.concat(t.grid.persist.registerAndLoad('hiddenColumns', function(){
					return keysOfDict(t._cols);
				}) || []);
			}
			if(ids.length){
				startup.then(function(){
					t.add.apply(t, ids);
				});
			}
		},

		add: function(){
			var t = this,
				g = t.grid;
			array.forEach(arguments, function(id){
				id = id && typeof id == "object" ? id.id: id;
				var col = g._columnsById[id];
				if(col){
					query('[colid="' + id + '"].gridxCell', g.domNode).
						addClass('gridxHiddenColumn').
						removeClass('gridxCell');
					delete col.index;
					delete g._columnsById[id];
					t._cols[id] = col;
					g._columns.splice(array.indexOf(g._columns, col), 1);
				}
			});
			array.forEach(g._columns, function(col, i){
				col.index = i;
			});
			g.columnWidth.refresh();
			g.body.onForcedScroll();
		},

		remove: function(){
			var t = this,
				g = t.grid;
			array.forEach(arguments, function(id){
				id = id && typeof id == "object" ? id.id: id;
				var col = t._cols[id];
				if(col){
					query('[colid="' + id + '"].gridxHiddenColumn', g.domNode).
						removeClass('gridxHiddenColumn').
						addClass('gridxCell');
					g._columnsById[id] = col;
					g._columns.push(col);
					delete t._cols[id];
				}
			});
			query('.gridxCell', g.headerNode).forEach(function(node, i){
				var id = node.getAttribute('colid');
				g._columnsById[id].index = i;
			});
			g._columns.sort(function(a, b){
				return a.index - b.index;
			});
			g.columnWidth.refresh();
		},

		clear: function(){
			this.remove.apply(this, keysOfDict(this._cols));
		},

		get: function(){
			var res = [];
			for(var id in this._cols){
				res.push(this._cols[id]);
			}
			return res;
		}
	});
});
