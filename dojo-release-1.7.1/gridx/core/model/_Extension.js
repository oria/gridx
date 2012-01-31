define([
	'dojo/_base/declare',
	'dojo/_base/connect'
], function(declare, connect){

	return declare([], {
		// summary:
		//		Abstract base class for all model components (including cache)
		constructor: function(model){
			this._cnnts = [];
			this.model = model;
			var inner = this.inner = model._model;
			model._model = this;
			if(inner){
				this.connect(inner, 'onDelete', '_onDelete');
				this.connect(inner, 'onNew', '_onNew');
				this.connect(inner, 'onSet', '_onSet');
				this.connect(inner, 'onSizeChange', '_onSizeChange');
			}
		},

		destroy: function(){
			for(var i = this._cnnts.length - 1; i >= 0; --i){
				connect.disconnect(this._cnnts[i]);
			}
		},

		connect: function(obj, event, method, scope){
			var cnnt = connect.connect(obj, event, scope || this, method);
			this._cnnts.push(cnnt);
			return cnnt;
		},

		//Events----------------------------------------------------------------------
		//Make sure every extension has the oppotunity to decide when to fire an event at its level.
		_onNew: function(){
			this.onNew.apply(this, arguments);
		},

		_onSet: function(){
			this.onSet.apply(this, arguments);
		},

		_onDelete: function(){
			this.onDelete.apply(this, arguments);
		},

		_onSizeChange: function(){
			this.onSizeChange.apply(this, arguments);
		},

		onNew: function(){},
		onDelete: function(){},
		onSet: function(){},
		onSizeChange: function(){},

		//Protected-----------------------------------------------------------------
		_call: function(method, args){
			return this[method] ? this[method].apply(this, args || []) : this.inner && this.inner._call(method, args);
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
