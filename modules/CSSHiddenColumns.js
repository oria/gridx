define([
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/_base/Deferred",
	"dojo/_base/array",
	"../core/_Module"
], function(declare, query, Deferred, array, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		Hide columns.
		// description:
		//		Hide columns and change the column array at the same time so that other grid features 
		//		are not affected by hidden columns. That means, hidden columns can no longer be accessed 
		//		through grid.columns() function.

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

	return declare(_Module, {
		name: 'hiddenColumns',

		getAPIPath: function(){
			return {
				hiddenColumns: this
			};
		},

		constructor: function(){
		},

		load: function(args, startup){
			var t = this,
				g = t.grid,
				ids = t.arg('init', []);
			if(g.persist){
				ids.concat(g.persist.registerAndLoad('hiddenColumns', function(){
					return t.get();
				}) || []);
			}
			if(ids.length){
				startup.then(function(){
					t.add.apply(t, ids);
					t.loaded.callback();
				});
			}else{
				t.loaded.callback();
			}
		},

		add: function(){
			var t = this,
				g = t.grid,
				columnsById = g._columnsById,
				changed;
			array.forEach(arguments, function(id){
				id = id && typeof id == "object" ? id.id: id;
				var col = columnsById[id];
				if(col && !col.hidden){
					changed = 1;
					col.hidden = true;
					col._class = 'gridxHiddenColumn ';
					query('[colid="' + id + '"].gridxCell', g.domNode).addClass('gridxHiddenColumn');
				}
			});
			if(changed){
			}
		},

		remove: function(){
			var t = this,
				g = t.grid,
				columnsById = g._columnsById,
				changed;
			array.forEach(arguments, function(id){
				id = id && typeof id == "object" ? id.id: id;
				var col = columnsById[id];
				if(col && col.hidden){
					changed = 1;
					delete col.hidden;
					col._class = '';
					query('[colid="' + id + '"].gridxHiddenColumn', g.domNode).removeClass('gridxHiddenColumn');
				}
			});
		},

		clear: function(){
			query('.gridxHiddenColumn', this.grid.domNode).removeClass('gridxHiddenColumn');
			array.forEach(this.grid._columns, function(col){
				delete col.hidden;
				col._class = '';
			});
		},

		get: function(){
			return array.map(array.filter(this.grid._columns, function(col){
				return col.hidden;
			}), function(col){
				return col.id;
			});
		}
	});
});
