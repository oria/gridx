

dojo.setObject('DebugUtil',{
	timer:{
		_cache:{}
		,start:function(id){
			if(!id)this.defaultTimer = (new Date()).getTime();
			else this._cache[id] = (new Date()).getTime();
		}
		,end:function(id, msg, noConsole, callback){
			if(id && !this._cache[id]){
				msg = id;
				id = null;
			}
			var t = this.getTime(id);
			var startTime = id ? this._cache[id] : this.defaultTimer;
			if(!noConsole)console.debug((msg||'') + ': ' + t + 'ms');
			if(callback)callback(t);
			return t;
		}
		,getTime:function(id){
			return (new Date()).getTime() - (id ? this._cache[id] : this.defaultTimer);
		}
		,trackFunction: function(obj, funcName, msg){
		    obj = obj || window;
		    var func = obj[funcName];
		    var self = this;
		    obj[funcName] = function(){
		    	var _id = (new Date()).getTime()+'';
		        self.start(_id);
		        var re = func.apply(obj, arguments);
		        var arr = [];
		        for(var i=0; i<arguments.length;i++)arr.push(arguments[i]+'');
		       
		        self.end(_id, msg || ('Function "' + funcName + '('+arr.join(',')+')' + '" execution time'));
		        return re;
		    }
		}
	}

	
});