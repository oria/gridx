define('dojox/grid/gridx/Grid', [
'dojo',
'dijit',
'dojox/grid/gridx/core/Core',
'dijit/_Widget',
'dijit/_Templated',
'text!dojox/grid/gridx/templates/grid.html'
], function(dojo, dijit, Core){

return dojo.declare('dojox.grid.gridx.Grid', [dijit._Widget, dijit._Templated, Core], {
	templateString: dojo.cache('dojox.grid.gridx', 'templates/grid.html'),

	postMixInProperties: function(){
		this.modules = [
			//Put default modules here!
		].concat(this.modules || []);
		this._initMouseEvents();
		this.reset(this);
	},

	postCreate: function(){
		this.inherited(arguments);
		this._deferStartup = new dojo.Deferred();
		this._loadModules(this._deferStartup).then(dojo.hitch(this, this.onModulesLoaded));
	},

	startup: function(){
		this.inherited(arguments);
		this._deferStartup.callback();
	},
	destroy: function(){
		this._uninit();
		this.inherited(arguments);
	},
	onModulesLoaded: function(){
	},
	
	//Mouse event handling begin
	_compNames: ['Cell', 'HeaderCell', 'Row', 'Header'],
	_mouseEventNames: ['Click', 'DblClick', 'MouseDown', 'MouseUp', 'MouseOver', 'MouseOut', 'MouseMove', 'ContextMenu'],
	_initMouseEvents: function(){
		dojo.forEach(this._compNames, function(comp){
			dojo.forEach(this._mouseEventNames, function(event){
				var evtName = 'on' + comp + event;
				if(!this[evtName]){
					this[evtName] = dijit._connectOnUseEventHandler;
				}
			}, this);
		}, this);
	},
	_connectMouseEvents: function(node, connector, scope){
		dojo.forEach(this._mouseEventNames, function(eventName){
			this.connect(node, 'on' + eventName.toLowerCase(), dojo.hitch(scope, connector, eventName));
		}, this);
	},
	_isConnected: function(eventName){
		return this[eventName] !== dijit._connectOnUseEventHandler;
	}
	//Mouse event handling end
});
});
