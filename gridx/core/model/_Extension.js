define([
	'dojo/_base/declare',
	'dojo/_base/connect',
	'dojo/_base/array'
], function(declare, connect, array){

	return declare([], {
		constructor: function(model, args){
			this._cnnts = [];
			this.model = model;
			this.inner = model._model;
			model._model = this;
			if(this.inner){
				this.connect(this.inner, 'onNew', 'onNew');
				this.connect(this.inner, 'onDelete', 'onDelete');
				this.connect(this.inner, 'onSet', 'onSet');
				this.connect(this.inner, "onSizeChange", "onSizeChange");
			}
		},

		destroy: function(){
			array.forEach(this._cnnts, connect.disconnect);
		},

		connect: function(obj, event, method, scope){
			var cnnt = connect.connect(obj, event, scope || this, method);
			this._cnnts.push(cnnt);
			return cnnt;
		},

		onNew: function(){},
		onDelete: function(){},
		onSet: function(){},
		onSizeChange: function(){},

		//Protected-----------------------------------------------------------------
		_call: function(method, args){
			return this[method] ? this[method].apply(this, args || []) : this.inner._call(method, args);
		},

		_mixinAPI: function(){
			var i, model = this.model, 
				api = function(method){
					return function(){
						return model._model._call(method, arguments);
					};
				};
			for(i = arguments.length - 1; i >= 0; --i){
				model[arguments[i]] = api(arguments[i]);
			}
		}
	});
});
