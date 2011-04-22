define("dojox/grid/gridx/tests/GridConfig", [
"dojo",
"dijit",
"dojo.parser",
"dijit.form.CheckBox",
"dijit.form.RadioButton",
"dijit.form.TextBox",
"dijit.form.Select"
], function(dojo, dijit){

return dojo.declare("dojox.grid.gridx.tests.GridConfig", [dijit._Widget, dijit._Templated], {
	templateString: dojo.cache('dojox.grid.gridx.tests', 'grid_config.html'),
	
	widgetsInTemplate: true,
	
	stores: {},
	
	gridAttrs: {},
	
	coreModules: [],
	
	modules: {},
	
	modelExts: {},
	
	getID: function(type, name){
		return this.id + "_" + type + "_" + name;
	},
	
	_createStoresNode: function(){
		var sb = [], f;
		for(var storeName in this.stores){
			var storeLayout = this.stores[storeName];
			sb.push("<tr><td><div dojoType='dijit.form.RadioButton' id='", this.getID('rb', storeName), 
				"' name='", this.getID('rb', 'store'), "' ", 
				storeLayout.defaultCheck ? "checked='true'" : "", 
				"></div><label for='", this.getID('rb', storeName), "'>", storeName, "</label>",
				"</td><td><select dojoType='dijit.form.Select' id='", this.getID('select', storeName), "' ", storeLayout.defaultCheck ? "" : "disabled='true'", ">");
			f = 0;
			for(var layoutName in storeLayout.layouts){
				sb.push("<option value='", layoutName, "' selected='", !f++, "'>", layoutName,"</option>");
			}
			sb.push("</select></td></tr>");
		}
		this.storesNode.innerHTML = sb.join('');
	},
	
	_createArgsNode: function(){
		var sb = [], f;
		for(var attrName in this.gridAttrs){
			var attr = this.gridAttrs[attrName];
			sb.push("<tr><td><div dojoType='dijit.form.CheckBox' id='", this.getID('cbattr', attrName), "' ", attr.defaultCheck ? "checked='true'" : "", "></div>",
				"<label for='", this.getID('cbattr', attrName), "'>", attrName, "</label>",
				"</td><td><select dojoType='dijit.form.Select' id='", this.getID('selectattr', attrName), "' ", attr.defaultCheck ? "" : "disabled='true'", ">");
			f = 0;
			for(var valueName in attr){
				if(valueName === 'defaultCheck')continue;
				sb.push("<option value='", valueName, "'>", valueName, "</option>");
			}
			sb.push("</select></td></tr>");
		}
		this.argsNode.innerHTML = sb.join('');
	},
	
	_createExtsNode: function(){
		var sb = [];
		for(var extName in this.modelExts){
			var ext = this.modelExts[extName];
			sb.push("<tr><td><div dojoType='dijit.form.CheckBox' id='", this.getID('cb', extName), "' extName='", extName, "'></div>",
				"<label for='", this.getID('cb', extName), "'>", extName, "</label>",
				"</td></tr>");
		}
		this.extsNode.innerHTML = sb.join('');
	},
	
	_createModsNode: function(){
		var sb = [], f;
		for(var modName in this.modules){
			var mod = this.modules[modName];
			sb.push("<tr><td><div dojoType='dijit.form.CheckBox' id='", this.getID('cb', modName), "'  modName='", modName, "' ", mod.defaultCheck ? "checked='true' disabled='true'" : "", "></div>", 
				"<label for='", this.getID('cb', modName), "'>", modName, "</label>",
				"</td><td><select dojoType='dijit.form.Select' id='", this.getID('select', modName), "' ", mod.defaultCheck ? "" : "disabled='true'", ">");
			f = 0;
			for(var implName in mod){
				if(implName === 'defaultCheck')continue;
				sb.push("<option value='", implName, "'>", implName, "</option>");
			}
			sb.push("</select></td></tr>");
		}
		this.modsNode.innerHTML = sb.join('');
	},
	
	postCreate: function(){
		this._createStoresNode();
		this._createArgsNode();
		this._createExtsNode();
		this._createModsNode();
		
		dojo.parser.parse(this.domNode);
		
		for(var storeName in this.stores){
			this.connect(dijit.byId(this.getID('rb', storeName)), 'onChange', dojo.hitch(this, '_onChangeCheckBox', storeName, 'rb'));
		}
		
		for(var attrName in this.gridAttrs){
			this.connect(dijit.byId(this.getID('cb', attrName)), 'onChange', dojo.hitch(this, '_onChangeCheckBox', attrName, 'cbattr'));
		}
		
		for(var modName in this.modules){
			this.connect(dijit.byId(this.getID('cb', modName)), 'onChange', dojo.hitch(this, '_onChangeCheckBox', modName, 'cb'));
		}
	},
	
	_onChangeCheckBox: function(name, type){
		var b = dijit.byId(this.getID(type, name));
		var toEnable = b.get('checked');
		dijit.byId(this.getID('select', name)).set('disabled', !toEnable);
	},
	
	_getStoreLayout: function(){
		var store, structure;
		for(var storeName in this.stores){
			if(dijit.byId(this.getID('rb', storeName)).get('checked')){
				store = this.stores[storeName].store;
				var layoutName = dijit.byId(this.getID('select', storeName)).get('value');
				structure = this.stores[storeName].layouts[layoutName];
				break;
			}
		}
		return {
			store: store,
			structure: structure
		}
	},
	
	_getAttrs: function(){
		var attrs = {};
		for(var attrName in this.gridAttrs){
			var attr = this.gridAttrs[attrName];
			if(dijit.byId(this.getID('cbattr', attrName)).get('checked')){
				var valueName = dijit.byId(this.getID('selectattr', attrName)).get('value');
				attrs[attrName] = attr[valueName];
			}
		}
		return attrs;
	},
	
	_getExts: function(){
		var modExts = [];
		for(var extName in this.modelExts){
			if(dijit.byId(this.getID('cb', extName)).get('checked')){
				modExts.push(this.modelExts[extName]);
			}
		}
		return modExts;
	},
	
	_getMods: function(){
		var mods = [];
		for(var modName in this.modules){
			var mod = this.modules[modName];
			if(dijit.byId(this.getID('cb', modName)).get('checked')){
				var implName = dijit.byId(this.getID('select', modName)).get('value');
				mods.push(mod[implName]);
			}
		}
		return mods.concat(this.coreModules);
	},
	
	getGridArgs: function(){
		var ret = dojo.mixin(this._getAttrs(), this._getStoreLayout(), {
			modelExtensions: this._getExts(),
			modules: this._getMods()
		});
		console.log("grid args:", ret);
		return ret;
	},
	
	_selectAllAttrs: function(checked){
		for(var attrName in this.gridAttrs){
			dijit.byId(this.getID('cbattr', attrName)).set('checked', checked);
		}
	},
	
	_selectAllExts: function(checked){
		for(var extName in this.modelExts){
			dijit.byId(this.getID('cb', extName)).set('checked', checked);
		}
	},
	
	_selectAllMods: function(checked){
		for(var modName in this.modules){
			if(!this.modules[modName].defaultCheck){
				dijit.byId(this.getID('cb', modName)).set('checked', checked);
			}
		}
	},
	
	_showAddAttributePart: function(){
		if(this.addAttrPart.style.display){
			this.addAttrPart.style.display = '';
			this.addAttrButton.innerHTML = 'Cancel';
		}else{
			this.addAttrPart.style.display = 'none';
			this.addAttrButton.innerHTML = 'New Attribute';
		}
		this.inputAttrName.set('value', '');
		this.inputAttrValue.set('value', '');
	},
	
	_addAttribute: function(){
		var attrName = this.inputAttrName.get('value');
		var value = this.inputAttrValue.get('value');
		if(attrName && value){
			if(!this.gridAttrs[attrName]){
				this.gridAttrs[attrName] = {};
				var sb = ["<tr><td><div dojoType='dijit.form.CheckBox' id='", this.getID('cbattr', attrName), "' checked='true'></div>",
						"<label for='", this.getID('cbattr', attrName), "'>", attrName, "</label>",
						"</td><td><select dojoType='dijit.form.Select' id='", this.getID('selectattr', attrName), "'></select></td></tr>"];
				this.argsNode.innerHTML += sb.join('');
				dojo.parser.parse(this.argsNode);
			}
			var slt = dijit.byId(this.getID('selectattr', attrName));
			slt.addOption({
				label: value,
				value: value,
				selected: true
			});
			this._showAddAttributePart();
			this.gridAttrs[attrName][value] = dojo.fromJson(value);
		}
	},
	
	_onCreate: function(){
		this.onCreate(this.getGridArgs());
	},
	
	onCreate: function(){},
	
	onDestroy: function(){}
});
});