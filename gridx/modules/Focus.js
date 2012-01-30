define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/keys",
	"../core/_Module",
	"../util"
], function(declare, array, connect, keys, _Module, util){
	
	/*=====
		gridx.module.Focus.__FocusArea = function(){
			// name: String (mandatory)
			//		The name of this area. Must be unique. Must not be empty.
			//
			// priority: Number (mandatory)
			//		This number decides the position of this area in the TAB sequence.
			//		Areas with bigger priority number, their position in TAB sequence comes later.
			//		If two areas have the same priority, then the later registered area is put *above* the earlier one.
			//		That is, no matter TAB or SHIFT-TAB, the upper area is accessed first.
			//
			// focusNode: DOM-Node?
			//		If provided, this is the node of this area. 
			//		When this area is focused, *onFocus* will be called. When blurred, *onBlur* will be called.
			//
			// doFocus: Function(evt, step)?
			//		If provided, will be called when TABing to this area.
			//		If not provided, default to successful focus.
			//		Return TRUE if successfully focused. FALSE if not.
			//
			// doBlur: Function(evt, step)?
			//		If provided, will be called when TABing out of this area.
			//		If not provided, default to successful blur.
			//		Return TRUE if successfully blurred. FALSE if not.
			//
			// onFocus: function(evt)?
			//		If provided, will be called when the *focusNode* of this area is focused.
			//		If return TRUE, later areas on this node will be skipped and this area becomes the current focused area.
			//		If return FALSE, call later areas on this same node.
			//
			// onBlur: function(evt)?
			//		If provided, will be called when the *focusNode* of this area is blurred.
			//		When *focusNode* is blurred, only the currently focused area will be called.
		};
	=====*/
	
	return _Module.register(
	declare(_Module, {
		// summary
		//		This module controls the TAB sequence of all the UI modules.
		//		But this module is (or at least can be) a non-UI module, because it does not handle the actual focus job.
		
		name: 'focus',
		
		getAPIPath: function(){
			return {
				focus: this
			};
		},

		constructor: function(){
			this._areas = {};
			this._tabQueue = [];
			this._focusNodes = [];
		},

		preload: function(){
			var g = this.grid;
			this.batchConnect(
				[g.domNode, 'onmousedown', '_onMouseDown'],
				[g.domNode, 'onkeydown', '_onTabDown'],
				[g.domNode, 'onfocus', '_focus'],
				[g.lastFocusNode, 'onfocus', '_focus'],
				[g, 'onBlur', '_doBlur']
			);
		},
	
		destroy: function(){
			this._areas = null;
			this._areaQueue = null;
			this._focusNodes = [];
			this._queueIdx = -1;
			this.inherited(arguments);
		},
	
		//Public----------------------------------------------------------
		registerArea: function(/* __FocusArea */ area){
			// summary:
			//		Register a new focus area, so this area will be included in the TAB sequence.
			//		If there's an existing area with the same name, it is removed and replaced by the new area.
			//		This function always succeed. No exception.
			// area: __FocusArea
			//		A focus area definition.
			if(area && area.name && typeof area.priority === 'number'){
				if(this._areas[area.name]){
					this.removeArea(area.name);
				}
				var dummy = function(){return true;};
				area.doFocus = area.doFocus || dummy;
				area.doBlur = area.doBlur || dummy;
				area.onFocus = area.onFocus || dummy;
				area.onBlur = area.onBlur || dummy;
				area.connects = area.connects || [];
	
				this._areas[area.name] = area;
				var i = util.biSearch(this._tabQueue, function(a){
					return a.p - area.priority;
				});
				//If the priority is the same, put this area above the current one.
				if(this._tabQueue[i] && this._tabQueue[i].p === area.priority){
					this._tabQueue[i].stack.unshift(area.name);
					//Assuming areas with same priority must have same focusNode.
					this._focusNodes[i] = area.focusNode || this._focusNodes[i];
				}else{
					this._tabQueue.splice(i, 0, {
						p: area.priority,
						stack: [area.name]
					});
					this._focusNodes.splice(i, 0, area.focusNode);
				}
			}
		},
		//_tabQueue: [{p: 1, stack: ['name']}]
	
		focusArea: function(/* String */ areaName, forced){
			// summary:
			//		Focus the area with name of *areaName*.
			//		If the current area is not this area, blur the current area.
			//		If the current area is this area, this is a no-op and return TRUE.
			//		If the area with this name does not exist, this is a no-op and return FALSE.
			// return: Boolean
			//		TRUE if the focus is successful, FALSE if not.	
			var area = this._areas[areaName];
			if(area){
				var curArea = this._areas[this.currentArea()];
				if(curArea && curArea.name === areaName){
					if(forced){
						curArea.doFocus();
					}
					return true;
				}else if(!curArea || curArea.doBlur()){
					if(curArea){
						this.onBlurArea(curArea.name);
					}
					if(area.doFocus()){
						this.onFocusArea(area.name);
						this._updateCurrentArea(area);
						return true;
					}
					this._updateCurrentArea();
				}
			}
			return false;
		},
	
		currentArea: function(){
			// summary:
			//		Get the name of the current focus area. 
			// return: String
			//		The name of the current Area. Return "" if no area is focused.
			var a = this._tabQueue[this._queueIdx];
			return a ? a.stack[this._stackIdx] : '';
		},
	
		tab: function(step, evt){
			// summary:
			//		Move focus from one area to another.
			// step: Integer
			//		If positive, then move forward along the TAB sequence.
			//		If negative, then move backward along the TAB sequence (SHIFT-TAB).
			//		If zero or other invalid values, this is a no-op.
			//		The absolute value of *step* is the distance between the target area and the current area
			//		in the whole TAB sequence.
			// evt: Object
			//		This can either be a real Event object or a mock object with same information .
			// return: String
			//		The name of currently focused area. Return "" if no area is focused.
			var curArea = this._areas[this.currentArea()];
			if(!step){
				return curArea ? curArea.name : '';
			}
			var cai = this._queueIdx + step,
				dir = step > 0 ? 1 : -1;
			if(curArea){
				var blurResult = curArea.doBlur(evt, step);
				var nextArea = this._areas[blurResult];
				if(blurResult){
					this.onBlurArea(curArea.name);
				}
				if(nextArea && nextArea.doFocus(evt, step)){
					this.onFocusArea(nextArea.name);
					this._updateCurrentArea(nextArea);
					return nextArea.name;
				}else if(!blurResult){
					return curArea.name;
				}
			}
			for(; cai >= 0 && cai < this._tabQueue.length; cai += dir){
				var i, stack = this._tabQueue[cai].stack;
				for(i = 0; i < stack.length; ++i){
					var areaName = stack[i];
					if(this._areas[areaName].doFocus(evt, step)){
						this.onFocusArea(areaName);
						this._queueIdx = cai;
						this._stackIdx = i;
						return areaName;
					}
				}
			}
			this._tabingOut = true;
			if(step < 0){
				this._queueIdx= -1;
				this.grid.domNode.focus();
			}else{
				this._queueIdx = this._tabQueue.length;
				this.grid.lastFocusNode.focus();
			}
			return "";
		},
	
		removeArea: function(areaName){
			// summary:
			//		Remove the area with name of *areaName*.
			//		If there's no such area, this is a no-op and return FALSE.
			//		If currently focused area is removed, then current area becomes empty.
			// areaName: String
			//		The name of the area to be removed.
			// return: Boolean
			//		TRUE if this operation is successful, FALSE if not.
			var area = this._areas[areaName];
			if(area){
				if(this.currentArea() === areaName){
					this._updateCurrentArea();
				}
				var i = util.biSearch(this._tabQueue, function(a){
					return a.p - area.priority;
				});
				var j, stack = this._tabQueue[i].stack;
				for(j = stack.length - 1; j >= 0; --j){
					if(stack[j] === area.name){
						stack.splice(j, 1);
						break;
					}
				}
				if(!stack.length){
					this._tabQueue.splice(i, 1);
					this._focusNodes.splice(i, 1);
				}
				array.forEach(area.connects, connect.disconnect);
				delete this._areas[areaName];
				return true;
			}
			return false;
		},

		onFocusArea: function(/* String areaName */){
			//Fired when an area is focused.
		},

		onBlurArea: function(/* String areaName */){
			//Fired when an area is blurred.
		},
	
		//Private----------------------------------------------------------
		//_areas: null,
		//_tabQueue: null,
		//_focusNodes: null,
		_queueIdx: -1,
		_stackIdx: 0,
	
		_onTabDown: function(evt){
			if(evt.keyCode === keys.TAB){
				this.tab(evt.shiftKey ? -1 : 1, evt);
			}
		},
	
		//-----------------------------------------------------------------------
		_onMouseDown: function(evt){
			var node = evt.target,
				currentArea = this._areas[this.currentArea()];
			while(node && node !== this.grid.domNode){
				var i = array.indexOf(this._focusNodes, node);
				if(i >= 0){
					var j, stack = this._tabQueue[i].stack;
					for(j = 0; j < stack.length; ++j){
						var area = this._areas[stack[j]];
						if(area.onFocus(evt)){
							if(currentArea && currentArea.name !== area.name){
								currentArea.onBlur(evt);
								this.onBlurArea(currentArea.name);
							}
							this.onFocusArea(area.name);
							this._queueIdx = i;
							this._stackIdx = j;
							return;
						}
					}
					return;
				}
				node = node.parentNode;
			}
			if(node === this.grid.domNode && currentArea){
				this._doBlur(evt, currentArea);
			}
			if(!node || node === this.grid.domNode){
				util.stopEvent(evt);
			}
		},
		
		_focus: function(evt){
			if(this._tabingOut){
				this._tabingOut = false;
			}else if(evt.target === this.grid.domNode){
				this._queueIdx = -1;
				this.tab(1);
			}else if(evt.target === this.grid.lastFocusNode){
				this._queueIdx = this._tabQueue.length;
				this.tab(-1);
			}
		},
		
		_doBlur: function(evt, area){
			if(!area && this.currentArea()){
				area = this._areas[this.currentArea()];
			}
			if(area){
				area.onBlur(evt);
				this.onBlurArea(area.name);
				this._updateCurrentArea();
			}
		},
		
		_updateCurrentArea: function(area){
			if(area){
				var i = this._queueIdx = util.biSearch(this._tabQueue, function(a){
					return a.p - area.priority;
				});
				var stack = this._tabQueue[i].stack;
				this._stackIdx = array.indexOf(stack, area.name);
			}else{
				this._queueIdx = null;
				this._stackIdx = 0;
			}
		}
	}));
});
