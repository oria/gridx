define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'../core/_Module'
], function(declare, array, _Module){

/*=====
	Row.isUnselectable = function(){
		// summary:
		//		Check is the row is unselectable.
	};
	
	Row.isSelectable = function(){
		// summary:
		//		Check if the row is selectable.
	};
	
	return declare(_Module,{
		// summary:
		//		This module provide the unselectable row funcitonality for gridx.

		// enabled: Boolean
		// The variable is a flag of the module to show if the module is on or off.
		enabled: true,
		
		isUnselectable: function(row){
			// summary: 
			//		Return true if the specific row is unselectable or false if selectable.
			// row: Object|Row
			//		The row to check. 
		},
		
		isSelectable: function(row){
			// summary: 
			//		Return true if the specific row is selectable or false if unselectable.
			// row: Object|Row
			//		The row to check;
		},
		
		addUnselectableInfo: function(id){
			// summary:
			//		Add the unselectable info of a row with the given id to the usInfo.
			// id: String
			//		Row id.
		},
		
		turnOn: function(){
			// summary:
			//		Turn the module functionality on.
		},
		
		turnOff: function(){
			// summary:
			//		Turn the module functionality off.
		}
		
		
 	})
 =====*/	
	return declare(_Module, {
		name: "unselectableRow",
		
		required: ['selectRow'],
		
		getAPIPath: function(){
			return {
				unselectableRow: this
			};
		},
		
		rowMixin: {
			isSelectable: function(){
				return this.grid.unselectableRow.isSelectable(this.id);
			},
			
			isUnselectable: function(){
				return this.grid.unselectableRow.isUnselectable(this.id);
			}
		},
		
		preload: function(){
			var t = this,
				c = 'connect',
				m = t.grid.model
				s = m.store;
			t.usInfo = {};
			t.rule = t.arg('rule');
			t.enabled = t.arg('enabled');
			if(t.enabled){
				t.aspect(m._cache, 'onLoadRow', 'addUnselectableInfo');
			}
			old = s.fetch;
			t[c](s, old ? "onSet" : "put", "_onSet");
			t[c](s, old ? "onNew" : "add", "_onNew");
			t[c](s, old ? "onDelete" : "remove", "_onDelete");
		},
		
		rule: function(){
			return false;
		},
		
		enabled: true,
		
		isUnselectable: function(id){
		//	return this.arg('enabled')? this._isUnselectable(row) : false;
			var t = this;
			return t.enabled? t.usInfo[id] : false;
		},
		
		isSelectable: function(row){
			return !this.isUnselectable(row);
		},
		
		clear: function(){
			var t = this;
			t.rule = {};
			t.usInfo = {};
		},
		
		turnOn: function(){
			this.enabled = true;
			this.grid.body.refresh();
		},
		
		turnOff: function(){
			this.enabled = false;
			this.grid.body.refresh();
		},
		
		addUnselectableInfo: function(id){
			var t = this,
				g = t.grid,
				row = g.row(id, 1),
				usInfo = t.usInfo;
			usInfo[id] = t._isUnselectable(row);
		},

		onSet: function(){},
		onNew: function(){},
		onDelete: function(){},

		//private ----------------------------------------------------------------------------
		_isUnselectable: function(row){
			var t = this,
				id = t.rule.id || [],
				index = t.rule.index || [],
				visualIndex = t.rule.visualIndex || [],
				rules = t.rule.rules;
			
			var inId = array.indexOf(id, row.id) >= 0,
				inIndex = array.indexOf(index, row.index()) >= 0 ,
				inVisualIndex = array.indexOf(visualIndex, row.visualIndex()) >= 0;
			
			return array.some(rules, function(rule){
				return rule.apply(t, [row]);
			}) || inId || inIndex || inVisualIndex;
			
		},
		
		_onSet: function(item){
			var t = this,
				id = t.grid.store.getIdentity(item);
			t.addUnselectableInfo(id);
			t.onSet(id, t.grid.select.row.isSelected(id));
		},
		
		_onNew: function(item){
			var t = this,
				id = t.grid.store.getIdentity(item);
			t.addUnselectableInfo(id);
			t.onNew(id);
		},
		
		_onDelete: function(item){
			var t = this,
				id = t.grid.store.getIdentity(item);
			t.onDelete(id);
		}
	});
});
