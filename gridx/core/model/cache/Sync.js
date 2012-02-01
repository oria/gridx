define([
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"./_Cache"
], function(declare, Deferred, _Cache){

	return declare(_Cache, {
		keep: function(){},
		free: function(){},

		when: function(args, callback){
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

		prepare: function(method, args){
			if(this._size[''] < 0){
				this._storeFetch({ start: 0 });
				if(this.store.getChildren){
					this._fetchChildren();
				}
			}
		},

		_fetchChildren: function(){
			var struct = this._strut, parentIds = struct[''].slice(1);
			while(parentIds.length){
				var pid = parentIds.shift();
				this._loadChildren(pid).then(function(){
					var children = _struct[pid].slice(1);
					[].push.apply(parentIds, children);
				});
			}
		}
	});
});
