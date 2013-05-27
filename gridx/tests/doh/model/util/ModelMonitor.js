define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/_base/Deferred',
	'dojo/_base/lang',
	'dojo/_base/html',
	'dojo/_base/query',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
//    'gridx/core/model/Mapper',
//    'gridx/core/model/Marker',
	"dojo/text!./ModelMonitor.html"
], function(declare, array, Deferred, lang, html, query, _Widget, _TemplatedMixin, Mapper, Marker, template){

var getColor = function(id){
	id = parseInt(id, 10);
	var color = ((id % 2) & 0xf) | 
		((id % 3) << 4 & 0xf0) | 
		((id % 5) << 8 & 0xf00) |
		((id % 7) << 12 & 0xf000) |
		((id % 11) << 16 & 0xf0000) |
		(id << 20 & 0xf00000);
	color = 0xffefef - color;
	color = color.toString(16);
	while(color.length < 6){
		color = '0' + color;
	}
	return '#' + color;
};

return declare([_Widget, _TemplatedMixin], {
	templateString: template,

	model: null,

	postCreate: function(){
		this.connect(this.domNode, 'onmouseover', function(e){
			query('.modelMonitorRowHover', this.domNode).forEach(function(node){
				html.removeClass(node, 'modelMonitorRowHover');
			});
			var id = e.target.getAttribute('rowid');
			if(id !== null){
				query('[rowid="' + id + '"]', this.domNode).forEach(function(node){
					html.addClass(node, 'modelMonitorRowHover');
				});
			}
		});
		this.connect(this.domNode, 'onmouseout', function(e){
			query('.modelMonitorRowHover', this.domNode).forEach(function(node){
				html.removeClass(node, 'modelMonitorRowHover');
			});
		});
		if(this.model){
			this.init();
		}
	},

	init: function(){
		this.cache = this.model._cache;
		this.store = this.cache.store;
		for(var i = 0; i < this.model._exts.length; ++i){
			var ext = this.model._exts[i];
			if(ext.move){
				this.mapper = ext;
			}else if(ext.markById){
				this.marker = ext;
			}
		}
		this.refresh();
	},

	beginWatch: function(){
		if(!this._handle){
			this._handler = this.connect(this.model, '_hooker', 'refresh');
		}
	},

	stopWatch: function(){
		if(this._handle){
			this.disconnect(this._handle);
			this._handle = null;
		}
	},

	refresh: function(){
		this._fillStorePane();
		this._fillCachePane();
		this._fillMarkPane();
		this._fillMapPane();
		this._fillFilterPane();
		this._fillIndexPane();
	},

	//Private
	_storeRowCreater: function(row, index, size){
		return ['<div class="modelMonitorStoreRow',
			'" rowindex="', index, 
			'" rowid="', row.id, 
			'" style="background-color: ', getColor(row.id), 
			';">', row.id, '</div>'
		].join('');
	},

	_cacheRowCreater: function(row, index, size){
		return ['<div class="modelMonitorCacheRow ',
//            row.inCache ? 'modelMonitorInCache' : '',
			'" rowindex="', index, 
			'" rowid="', row.id,
			'" style="background-color: ', row.inCache ? getColor(row.id) : '#fff', 
			';">', row.id, '</div>'
		].join('');
	},
	_markRowCreater: function(row, index, size){
		return ['<div class="modelMonitorMarkRow',
			'" rowindex="', index, 
			'" rowid="', row.id,
			'" style="background-color: ', row.isSelected ? getColor(row.id) : '#fff', 
			';">', row.id, '</div>'
		].join('');
	},

	_mapRowCreater: function(row, index, size){
		return ['<div class="modelMonitorMapRow',
			'" rowindex="', index, 
			'" rowid="', row.id,
			'" style="background-color: ', row.isMapped ? getColor(row.id) : '#fff', 
			';">', row.id, '</div>'
		].join('');
	},

	_filterRowCreater: function(row, index, size){
		return ['<div class="modelMonitorFilterRow',
			'" rowindex="', index, 
			'" rowid="', row.id,
			'" style="background-color: ', getColor(row.id), 
			';">', row.id, '</div>'
		].join('');
	},

	_indexRowCreater: function(row, index, size){
		return ['<div class="modelMonitorIndexRow',
			'" rowindex="', index, 
			'" rowid="', row.id,
			'">', index, '</div>'
		].join('');
	},

	_populatePane: function(rows, pane, rowCreater){
		var s = [], size = rows.length;
		array.forEach(rows, function(row, i){
			s.push(rowCreater(row, i, size));
		});
		pane.innerHTML = s.join('');
	},

	_storeFetch: function(){
		var d = new Deferred();
		var options = this.model._cache.options || {};
		options.start = 0;
		if(this.store.fetch){
			this.store.fetch(lang.mixin({
				onComplete: function(items){
					d.callback(items);
				}
			}, options));
		}else{
			var results = this.store.query(options.query, options);
			Deferred.when(results, function(items){
				d.callback(items);
			});
		}
		return d;
	},

	_fillStorePane: function(){
		var _this = this;
		this._storeFetch().then(function(items){
			var rows = array.map(items, function(item){
				return {
					id: _this.store.getIdentity(item)
				};
			});
			_this._populatePane(rows, _this.storePane, _this._storeRowCreater);
		});
	},

	_fillCachePane: function(){
		var _this = this;
		this._storeFetch().then(function(items){
			var rows = array.map(items, function(item){
				var id = _this.store.getIdentity(item); 
				return {
					id: id,
					inCache: _this.cache._cache[id]
				};
			});
			_this._populatePane(rows, _this.cachePane, _this._cacheRowCreater);
		});
	},

	_fillMarkPane: function(){
		if(!this.marker)return;
		var _this = this;
		this._storeFetch().then(function(items){
			var rows = array.map(items, function(item, i){
				var id = _this.store.getIdentity(item); 
				return {
					id: id,
					isSelected: _this.marker.getMark(id)
				};
			});
			_this._populatePane(rows, _this.markPane, _this._markRowCreater);
		});
	},

	_fillMapPane: function(){
		if(!this.mapper)return;
		var _this = this;
		this._storeFetch().then(function(items){
			var rows = [];
			array.forEach(items, function(item, i){
				var id = _this.store.getIdentity(item); 
				var idx = _this.mapper._mapIndex(i, true);
				rows[idx] = {
					id: id,
					isMapped: idx != i
				};
			});
			_this._populatePane(rows, _this.mapPane, _this._mapRowCreater);
		});
	},

	_fillFilterPane: function(){
		if(!this.mapper)return;
		if(this.mapper._filterMap){
			var rows = [];
			for(var i = 0; i < this.mapper._filterMap.length; ++i){
				rows.push({
					id: this.mapper._filterIdMap[i]
				});
				this._populatePane(rows, this.filterPane, this._filterRowCreater);
			}
		}else{
			var _this = this;
			this._storeFetch().then(function(items){
				var rows = [];
				array.forEach(items, function(item, i){
					var id = _this.store.getIdentity(item); 
					var idx = _this.mapper._mapIndex(i, true);
					rows[idx] = {
						id: id
					};
				});
				_this._populatePane(rows, _this.filterPane, _this._filterRowCreater);
			});
		}
	},

	_fillIndexPane: function(){
		if(this.mapper && this.mapper._filterMap){
			var rows = [];
			for(var i = 0; i < this.mapper._filterMap.length; ++i){
				rows.push({
					id: this.mapper._filterIdMap[i]
				});
				this._populatePane(rows, this.indexPane, this._indexRowCreater);
			}
		}else{
			var _this = this;
			this._storeFetch().then(function(items){
				var rows = [];
				array.forEach(items, function(item, i){
					var id = _this.store.getIdentity(item); 
					var idx = _this.mapper ? _this.mapper._mapIndex(i, true) : i;
					rows[idx] = {
						id: id
					};
				});
				_this._populatePane(rows, _this.indexPane, _this._indexRowCreater);
			});
		}
	}
});
});
