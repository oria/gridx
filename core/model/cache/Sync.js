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
			var s = this._struct, pids = s[''].slice(1), pid;
			while(pids.length){
				pid = pids.shift();
				this._loadChildren(pid).then(function(){
					[].push.apply(pids, s[pid].slice(1));
				});
			}
		}
	});
});
