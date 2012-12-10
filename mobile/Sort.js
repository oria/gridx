define([
	'dojo/_base/declare',
	'dojo/_base/array'
], function(declare, array){
	return declare(null, {
		// summary:
		//	Provide sort api for the grid
		//	and provide a single UI in the header like traditional grid sorting.
		sort: function(args){
			// summary:
			//	Sort the grid by args which in store sorting format.
			if(args && (args.length || args.attribute)){
				this.queryOptions.sort = args.length ? args : [args];
			}else{
				this.queryOptions.sort = null;
			}
			this.refresh();
			this.updateSortIndicators();
		},
		
		_buildHeader: function(){
			// summary:
			//	Add click to sort capability for header, only for single sort.
			this.inherited(arguments);
			if(this._headerClickHandler){return;}
			this._headerClickHandler = this.connect(this.headerNode, 'onclick', function(evt){
				var cell = evt.target;
				if(!/th/i.test(cell.tagName))return;
				if(!this.queryOptions){this.queryOptions = {};}
				var col = this.columns[cell.cellIndex], sort = this.queryOptions.sort;
				
				//Initial sort may be a array or null..
				if(sort){sort = sort.length ? sort[0] : sort;}
				else{sort = {};}
			
				if(sort.attribute != col.field){
					sort = {attribute: col.field, descending: false};
				}else{
					if(sort.descending)sort.attribute = null;
					else if(!sort.descending)sort.descending = true;
				}
				this.sort(sort);
			}, this);
		},
		
		updateSortIndicators: function(){
			// summary:
			//	Update the sorting indicators. Maybe override to provide other sorting UI.
			//	Only support single sort now
			
			var cols = this.columns, sort = this.queryOptions.sort, 
				ht = this.headerNode.firstChild.firstChild;//header table
			if(sort)sort = sort.length ? sort[0] : sort;
			else sort = {};
			
			array.forEach(ht.rows[0].cells, function(cell, i){
				var txt = cell.innerHTML.replace(/ *[↑↓]$/g, '');
				var col = cols[cell.cellIndex];
				if(col.field == sort.attribute){
					txt += sort.descending ? ' ↓' : ' ↑';
				}
				cell.innerHTML = txt;
			});
		}
	});
});