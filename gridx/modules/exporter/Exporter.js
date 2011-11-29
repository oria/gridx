define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"../../core/_Module",
	"dojo/_base/Deferred",
	"dojo/_base/array"
], function(declare, lang, _Module, Deferred, array){

/*=====
	var __ExportArgs = function(){
		//columns: String[]?
		//		An array of column ID. Indicates which columns to be exported. 
		//		If invalid or empty array, export all grid columns.
		//start: Number?
		//		Indicates from which row to start exporting. If invalid, 
		//		default to 0.
		//count: Number?
		//		Indicates how many rows to export starting from the start row. 
		//		If invalid, export all rows up to the end of grid.
		//selectedOnly: Boolean?
		//		Whether only export selected rows. This constraint is applied 
		//		upon the rows specified by start and count parameters.
		//		This paramter and the filter parameter can be used togetther. 
		//		Default to false.
		//filter: Function?
		//		A predicate function (returns Boolean) to judge whether to 
		//		export a row. 
		//		This constraint is applied upon the result rows of the 
		//		selectedOnly parameter, if provided.
		//useStoreData: Boolean?
		//		Indicates whether to export grid data (formatted data) or 
		//		store data. Default to false.
		//formatter: Function?
		//		A customized way to export data, if neither grid data nor store 
		//		data could meet the requirement. A grid cell object will be 
		//		passed in as an argument.
		//includeHeader: Boolean?
		//		Indicates whether to export grid header. Default to true.
		//progressStep: Number?
		//		Number of rows in each progress. Default to 10.
		//		After each progress, the deferred.progress() is called, so the 
		//		exporting process can be controlled by the user.
	};
=====*/

	return _Module.registerModule(
	declare(_Module, {
		name: 'exporter',

		getAPIPath: function(){
			return {
				'exporter': this
			};
		},
	
		//Package ---------------------------------------------------------------------
		_export: function(/* __ExportArgs */ args, writer){
			//summary:
			//		Go through the grid using the given args and writer implementation.
			//		Return a dojo.Deferred object. Users can cancel and see progress 
			//		of the exporting process.
			//		Pass the exported result to the callback function of the Deferred object.
			var d = new Deferred(), g = this.grid, model = this.model,  
				columns = this._getColumns(args), progressStep = args.progressStep || 10,
				includeHeader = !!args.includeHeader;
			try{
				if(includeHeader && false !== writer.beforeHeader(args, {columnIds: columns})){
					array.forEach(columns, function(columnId){
						writer.handleHeaderCell(args, {columnId: columnId});
					});
					writer.afterHeader(args, {columnIds: columns});
				}
				if(false !== writer.beforeBody(args)){
					if(args.selectedOnly && g.select){
						var ids, rowIds = [], colIds = [], selectedIds = {}, colId, pagedRowIds = [], i;
						if(g.select.cell && g.select.cell.getSelected().length > 0){
							ids = g.select.cell.getSelected();
							array.forEach(ids, function(id){
								if(array.indexOf(rowIds, id[0]) < 0){
									rowIds.push(id[0]);
									selectedIds[id[0]] = [];
									array.forEach(ids, function(i){
										if(i[0] == id[0] && array.indexOf(selectedIds[id[0]], i[1]) < 0){
											selectedIds[id[0]].push(i[1]);
										}
									});
								}
							});
							model.when({id: rowIds}, function(){
								rowIds.sort(function(a, b){return model.idToIndex(a) - model.idToIndex(b);});
								for(i = 0; i < rowIds.length; i += progressStep){
									pagedRowIds = rowIds.slice(i, i + progressStep);
									this._exportProgress(args, writer, pagedRowIds, columns, selectedIds);
									d.progress(i/rowIds.length);
								}
							}, this);
						}else if(g.select.row && g.select.row.getSelected().length > 0){
							rowIds = g.select.row.getSelected();
							model.when({id: rowIds}, function(){
								rowIds.sort(function(a, b){return model.idToIndex(a) - model.idToIndex(b);});
								for(i = 0; i < rowIds.length; i += progressStep){
									pagedRowIds = rowIds.slice(i, i + progressStep);
									this._exportProgress(args, writer, pagedRowIds, columns);
									d.progress(i/rowIds.length);
								}
							}, this);
						}else if(g.select.column && g.select.column.getSelected().length > 0){
							var index;
							for(i = 0; i < g.rowCount(); i += progressStep){
								model.when({start: i, count: progressStep}, function(){
									pagedRowIds = [];
									for(index = i; index < i + progressStep; index++){
										pagedRowIds.push(model.indexToId(index));
									}
									this._exportProgress(args, writer, pagedRowIds, columns);
									d.progress(i/g.rowCount());
								}, this);
							}
						}
					}else{
						var start = args.start || 0,
							count = args.count || g.rowCount();
						var index;
						for(i = start; i < start + count; i += progressStep){
							model.when({start: i, count: progressStep}, function(){
								pagedRowIds = [];
								for(index = i; index < i + progressStep && index < start + count; index++){
									pagedRowIds.push(model.indexToId(index));
								}
								this._exportProgress(args, writer, pagedRowIds, columns);
								d.progress(i/g.rowCount());
							}, this);
						}
					}
					writer.afterBody(args, {columnIds: columns});
				}
				d.callback(writer.getResult());
			}catch(e){
				d.errback(new Error(e));
			}
			return d;
		},
		
		//[Private]=======
		_exportProgress: function(args, writer, rowIds, columns, validCols){
			// summary:
			//		export by a progress
			var g = this.grid, model = g.model, cellContext,
				filter = lang.isFunction(args.filter) ? args.filter : function(){return true;},
				fmt = function(colId, rowId){
					if(lang.isFunction(args.formatter)){
						return args.formatter(g.cell(rowId, colId, true)) || "";
					}else if(args.useStoreData){
						var field = g._columnsById[colId].field;
						return field ? model.byId(rowId).rawData[field] : "";
					}else{
						return model.byId(rowId).data[colId] || "";
					}
				};
			if(false !== writer.beforeProgress(args, { columnIds: columns, rowIds: rowIds })){
				// export by rows
				array.forEach(rowIds, function(rowId){
					if(filter(rowId) && false !== writer.beforeRow(args, {columnIds: columns, rowId: rowId})){
						array.forEach(columns, function(c){
							cellContext = {columnId: c, rowId: rowId};
							cellContext.data = !validCols || array.indexOf(validCols[rowId], c) > -1 ?
								fmt(c, rowId) : "";
							writer.handleCell(args, cellContext);
						});
						writer.afterRow(args, {columnIds: columns, rowId: rowId});
					}
				});
				writer.afterProgress(args, {columnIds: columns, rowIds: rowIds});
			}
		},
		
		_getColumns: function(args){
			var g = this.grid, columns = [], i;
			if(args.selectedOnly && g.select){
				if(g.select.row && g.select.row.getSelected().length > 0){
					array.forEach(g._columns, function(c){
						columns.push(c.id);
					});
				}else if(g.select.column && g.select.column.getSelected().length > 0){
					columns = g.select.column.getSelected();
				}else if(g.select.cell && g.select.cell.getSelected().length > 0){
					array.forEach(g.select.cell.getSelected(), function(cell){
						if(array.indexOf(columns, cell[1]) < 0){
							columns.push(cell[1]);
						}
					});
				}
			}else if(lang.isArray(args.columns) && args.columns.length > 0){
				for(i = args.columns.length; i >= 0; i--){
					if(args.columns[i] && g._columnsById[args.columns[i]]){
						columns.push(args.columns[i]);
					}
				}
				if(columns.length < 1){
					array.forEach(g._columns, function(c){
						columns.push(c.id);
					});
				}
			}else{
				array.forEach(g._columns, function(c){
					columns.push(c.id);
				});
			}
			return columns.sort(function(a, b){return g._columnsById[a].index - g._columnsById[b].index});
		}
	}));
});
