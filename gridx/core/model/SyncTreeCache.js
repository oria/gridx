define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/Deferred",
	"./_TreeCache"
], function(declare, array, Deferred, _TreeCache){

	return declare('gridx.core.model.TreeSyncCache', _TreeCache, {
	
		constructor: function(){
			this._init();
		},
	
		when: function(args, callback){
			this._init();
			var d = new Deferred();
			try{
				if(callback){
					callback();
				}
				d.callback();
			}catch(e){
				d.errback(e);
			}
			return d;
		},
		
		//--------------------------------------------------------------------
		_fetchAll: function(item, level){
			var _this = this;
			this._storeFetch({start: 0}, item, level).then(function(items){
				array.forEach(items, function(child){
					if(child){
						_this._fetchAll(child, level + 1);
					}
				});
			});
		},
	
		_init: function(){
			if(this._size[''] >= 0){ return; }
			this._fetchAll(null, 0);
		},
	
		//----------------------------------------------------------------------------------
		_onNew: function(item, parentInfo){
			this._init();
			var parentId = this.store.getIdentity(parentInfo.item),
				index = this.size(parentId),
				id = this.store.getIdentity(item);
			this._addRow(item, index, parentId);
			this.onNew(id, index, this._cache[id]);
		},
	
		_onSet: function(item){
			this._init();
			var id = this.store.getIdentity(item), 
				index = this.idToIndex(id);
			this._addRow(item, index, this.treePath(id).pop());
			this.onSet(id, index, this._cache[id]);
		},
	
		_onDelete: function(item){
			var id = this.store.fetch ? this.store.getIdentity(item) : item, 
				path = this.treePath(id),
				index;
			if(path.length){
				var children, i, j, ids = [id], parentId = path.pop();
				index = array.indexOf(this._struct[parentId], id);
				this._struct[parentId].splice(idx, 1);
				--this._size[parentId];
	
				for(i = 0; i < ids.length; ++i){
					children = this._struct[ids[i]];
					if(children){
						for(j = children.length - 1; j > 0; --j){
							ids.push(children[j]);
						}
					}
				}
				for(i = ids.length - 1; i >= 0; --i){
					j = ids[i];
					delete this._cache[j];
					delete this._struct[j];
					delete this._size[j];
					var idx = array.indexOf(this._priority, id);
					if(idx >= 0){
						this._priority.splice(idx, 1);
					}
				}
			}
			this.onDelete(id, index);
		}
	});
});
