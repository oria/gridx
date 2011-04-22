define('dojox/grid/gridx/modules/dnd/_Base', [
'dojo',
'dojox/grid/gridx/core/_Module',
'dojox/grid/gridx/modules/dnd/Avatar',
'dojo/dnd/Source'
], function(dojo, _Module, Avatar, Source){

return dojo.declare('dojox.grid.gridx.modules.dnd._Base', _Module, {
	load: function(args, loaded){
		dojo.mixin(this, args);
		this._selectStatus = this.grid.selectDisabled;
		this._node = dojo.create('div');
		this._source = new Source(this.grid.bodyNode, {
			isSource: false,
			accept: this.accept,
			delay: this.delay,
			getSelectedNodes: function(){return [0];},
			getItem: dojo.hitch(this, '_getItem'),
			checkAcceptance: dojo.hitch(this, '_checkAcceptance'),
			onDraggingOver: dojo.hitch(this, '_onDraggingOver'),
			onDraggingOut: dojo.hitch(this, '_onDraggingOut'),
			onDropExternal: dojo.hitch(this, '_onDropExternal'),
			onDropInternal: dojo.hitch(this, '_onDropInternal')
		});
		this._source["dnd" + this.type] = this;
		this.batchConnect(
            [this.grid, 'onCellMouseOver', '_checkDndReady'],
            [this.grid, 'onCellMouseOut', '_dismissDndReady'],
            [this.grid, 'onCellMouseDown', '_startDnd'],
			[dojo.doc, 'onmouseup', '_endDnd'],
			[dojo.doc, 'onmousemove', '_onMouseMove']
		);
		this.subscribe("/dnd/cancel", '_endDnd');
		this._load(args);
		loaded.callback();
	},
	
	destory: function(){
		this.inherited(arguments);
		this._source.destory();
		dojo.destroy(this._node);
	},

	getAPIPath: function(){
		var ret = {
			dnd: {}
		};
		ret.dnd[this.type.toLowerCase()] = this;
		return ret;
	},
	
	//Public----------------------------------------------------------------------
	
	delay: 2,
	
	enabled: true,
	
	canDragIn: true,
	
	canDragOut: true,
	
	canRearrange: true,
	
	/*
	_load: function(){

	},

	_extraCheckReady: function(evt){

	},

	_buildDndNodes: function(){

	},

	_getDndCount: function(){

	},
	
	_calcTargetAnchorPos: function(evt, containerPos){
				
	},

	_checkExternalSourceAccept: function(){

	},
	
	_onDropInternal: function(nodes, copy){
	
	},

	_onDropExternalGrid: function(source, nodes, copy){
	
	},

	_onDropExternalOther: function(souece, node, copy){

	},
	*/

	//Private-----------------------------------------------------------------
	_isOutOfGrid: function(evt){
		var gridPos = dojo.position(this.grid.domNode), x = evt.clientX, y = evt.clientY;
		return y < gridPos.y || y > gridPos.y + gridPos.h ||
			x < gridPos.x || x > gridPos.x + gridPos.w;
	},

	_onMouseMove: function(evt){
		var isOut = this._isOutOfGrid(evt);
		if(!this._alreadyOut && isOut){
			this._alreadyOut = true;
			this._source.onOutEvent();
		}else if(this._alreadyOut && !isOut){
			this._alreadyOut = false;
			this._source.onOverEvent();
		}
		if(!isOut && (this._dnding || this._extDnding)){
			this._markTargetAnchor(evt);
		}
	},
	
	_checkDndReady: function(evt){
		if(!this._dndReady && !this._dnding && this._extraCheckReady(evt)){
			this._selectStatus = this.grid.selectDisabled;
			this.grid.selectDisabled = true;
			this._dndReady = true;
		}
	},
	
	_dismissDndReady: function(){
		if(this._dndReady){
			this.grid.selectDisabled = this._selectStatus;
			delete this._dndReady;
		}
	},
	
	_startDnd: function(evt){
		this._checkDndReady(evt);
		if(this._dndReady){
			delete this._target;

			this._updateSourceSettings();
			
			this._node.innerHTML = this._buildDndNodes();
			
			var m = dojo.dnd.manager();
			this._oldStartDrag = m.startDrag;
			m.startDrag = dojo.hitch(this, '_startDrag', evt);
			
			this._oldMakeAvatar = m.makeAvatar;
			m.makeAvatar = function(){
				return new Avatar(m);
			};
			
			m._dndInfo = {
				type: this.type,
				count: this._getDndCount()
			};
		}
	},

	_updateSourceSettings: function(){
		this._source.isSource = true;
		this._source.delay = this.delay;
	},
	
	_endDnd: function(){
		var m = dojo.dnd.manager();
		delete m._dndInfo;
		if(this._oldStartDrag){
			m.startDrag = this._oldStartDrag;
			delete this._oldStartDrag;
		}
		if(this._oldMakeAvatar){
			m.makeAvatar = this._oldMakeAvatar;
			delete this._oldMakeAvatar;
		}
		if(this._dndReady || this._dnding || this._extDnding){
			delete this._dnding;
			delete this._extDnding;
			delete this._extSource;
			this._destroyUI();
			dojo.setSelectable(this.grid.domNode, true);
			this.grid.selectDisabled = this._selectStatus;	
		}
		this._source.isSource = false;
	},
	
	_createUI: function(){
		this._oldCursor = dojo.style(dojo.body(), "cursor");
		dojo.style(dojo.body(), "cursor", "default");
	},

	_destroyUI: function(){
		this._unmarkTargetAnchor();
		dojo.style(dojo.body(), "cursor", this._oldCursor);
	},

	_createTargetAnchor: function(){
		return dojo.create("div", {
			"class": "dojoxGridxDnDAnchor dojoxGridxDnDAnchor" + this.type
		});
	},
	
	_markTargetAnchor: function(evt){
		var targetAnchor = this._targetAnchor,
			containerPos = dojo.position(this.grid.mainNode);
		if(!targetAnchor){
			targetAnchor = this._targetAnchor = this._createTargetAnchor();
			dojo.style(targetAnchor, "display", "none");
			this.grid.mainNode.appendChild(targetAnchor);
		}
		var pos = this._calcTargetAnchorPos(evt, containerPos);			
		if(pos){
			dojo.style(targetAnchor, pos);
			dojo.style(targetAnchor, "display", "");
		}else{
			dojo.style(targetAnchor, "display", "none");
		}
	},
	
	_unmarkTargetAnchor: function(){
		var targetAnchor = this._targetAnchor;
		if(targetAnchor){
			dojo.style(targetAnchor, "display", "none");
		}
	},
	
	//---------------------------------------------------------------------------------
	_startDrag: function(evt, source, nodes, copy){
		if(this._dndReady && source === this._source){
			this._oldStartDrag.call(dojo.dnd.manager(), source, this._node.childNodes, copy);
			delete this._dndReady;
			this._dnding = true;
			this._createUI();
			this._markTargetAnchor(evt);
			dojo.setSelectable(this.grid.domNode, false);	
		}
	},
	
	_getItem: function(id){
		return {
			type: this.accept,
			data: id
		};
	},
	
	_checkAcceptance: function(source){
		var res = Source.prototype.checkAcceptance.apply(this._source, arguments);
		if(res){
			if(source[this.name]){
				var g = source[this.name].grid;
				if((g === this.grid && !this.canRearrange) || //Cannot re-arrange
					(g !== this.grid && (!this.canDragIn || !source[this.name].canDragOut))	//Cannot drag in or drag out
				){
					return false;
				}else if(g !== this.grid){
					this._sourceGrid = g;
					this._extDnding = true;
				}
			}else{
				return this._checkExternalSourceAccept && this._checkExternalSourceAccept(source);
			}
		}
		return res;
	},

	
	_onDraggingOver: function(){
		if(this._dnding || this._extDnding){
			this._createUI();
		}
	},
	
	_onDraggingOut: function(){
		if(this._dnding || this._extDnding){
			this._destroyUI();	
		}
	},
	
	_onDropExternal: function(source, nodes, copy){
		if(this._target !== undefined){
			if(source[this.name]){
				this._onDropExternalGrid(source, nodes, copy);
			}else{
				this._onDropExternalOther(source, nodes, copy);
			}
		}
	}
});
});

