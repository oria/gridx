define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"./_Cache"
], function(declare, lang, Deferred, _Cache){

/*=====
	return declare(_Cache, {
		// summary:
		//		Implement a cache for client side store.
	});
=====*/

	function fetchChildren(self){
		var s = self._struct,
			pids = s[''].slice(1),
			pid,
			appendChildren = function(pid){
				[].push.apply(pids, s[pid].slice(1));
			};
		while(pids.length){
			pid = pids.shift();
			self._storeFetch({
				parentId: pid
			}).then(lang.partial(appendChildren, pid));
		}
	}

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

		//Private---------------------------------------------
		_init: function(/*method, args*/){
			var t = this;
			if(!t._filled){
				t._storeFetch({ start: 0 });
				if(t.store.getChildren){
					fetchChildren(t);
				}
				t.model._onSizeChange();
			}
		}
	});
});
