define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/html",
	"dojo/_base/window",
	"dojo/dnd/Source",
	"dojo/dnd/Manager",
	"../../core/_Module",
	"./Avatar",
	"../AutoScroll"
], function(declare, lang, html, win, Source, DndManager, _Module, Avatar){

	return declare(_Module, {
		preload: function(args){
			this._selectStatus = {};
			this._saveSelectStatus();
			this._node = html.create('div');
			this._source = new Source(this.grid.domNode, {
				isSource: false,
				accept: this.arg('accept'),
				delay: this.arg('delay'),
				getSelectedNodes: function(){return [0];},
				getItem: lang.hitch(this, '_getItem'),
				checkAcceptance: lang.hitch(this, '_checkAcceptance'),
				onDraggingOver: lang.hitch(this, '_onDraggingOver'),
				onDraggingOut: lang.hitch(this, '_onDraggingOut'),
				onDropExternal: lang.hitch(this, '_onDropExternal'),
				onDropInternal: lang.hitch(this, '_onDropInternal')
			});
			this._source["dnd" + this.type] = this;
			this.batchConnect(
	            [this.grid, 'onCellMouseOver', '_checkDndReady'],
	            [this.grid, 'onCellMouseOut', '_dismissDndReady'],
	            [this.grid, 'onCellMouseDown', '_startDnd'],
				[win.doc, 'onmouseup', '_endDnd'],
				[win.doc, 'onmousemove', '_onMouseMove']
			);
			this.subscribe("/dnd/cancel", '_endDnd');
			this._selector = this.grid.select[this.type.toLowerCase()];
			this._load(args);
		},
		
		destory: function(){
			this.inherited(arguments);
			this._source.destory();
			html.destroy(this._node);
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
		_load: function(){},

		_isOutOfGrid: function(evt){
			var gridPos = html.position(this.grid.domNode), x = evt.clientX, y = evt.clientY;
			return y < gridPos.y || y > gridPos.y + gridPos.h || x < gridPos.x || x > gridPos.x + gridPos.w;
		},
	
		_onMouseMove: function(evt){
			if(this._source.isSource){
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
			}
		},

		_saveSelectStatus: function(enabled){
			var name, selector, selectors = this.grid.select;
			for(name in selectors){
				selector = selectors[name];
				if(selector && lang.isObject(selector)){
					this._selectStatus[name] = selector.arg('enabled');
					if(enabled !== undefined){
						selector.enabled = enabled;
					}
				}
			}
		},

		_loadSelectStatus: function(){
			var name, selector, selectors = this.grid.select;
			for(name in selectors){
				selector = selectors[name];
				if(selector && lang.isObject(selector)){
					selector.enabled = this._selectStatus[name];
				}
			}
		},
		
		_checkDndReady: function(evt){
			if(!this._dndReady && !this._dnding && this._extraCheckReady(evt)){
				this._saveSelectStatus(false);
				this._dndReady = true;
			}
		},
		
		_dismissDndReady: function(){
			if(this._dndReady){
				this._loadSelectStatus();
				delete this._dndReady;
			}
		},
		
		_startDnd: function(evt){
			this._checkDndReady(evt);
			if(this._dndReady){
				delete this._target;
				this._updateSourceSettings();
				this._node.innerHTML = this._buildDndNodes();
				
				var m = DndManager.manager();
				this._oldStartDrag = m.startDrag;
				m.startDrag = lang.hitch(this, '_startDrag', evt);
				
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
			var m = DndManager.manager();
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
				html.setSelectable(this.grid.domNode, true);
				this._loadSelectStatus();
			}
			this._source.isSource = false;
		},
		
		_createUI: function(){
			html.addClass(win.body(), 'dojoxGridxDnDCursor');
			if(this.grid.autoScroll){
				this._beginAutoScroll();
				this.grid.autoScroll.enabled = true;
			}
		},
	
		_destroyUI: function(){
			this._unmarkTargetAnchor();
			html.removeClass(win.body(), 'dojoxGridxDnDCursor');
			if(this.grid.autoScroll){
				this._endAutoScroll();
				this.grid.autoScroll.enabled = false;
			}
		},
	
		_createTargetAnchor: function(){
			return html.create("div", {
				"class": "dojoxGridxDnDAnchor dojoxGridxDnDAnchor" + this.type
			});
		},
		
		_markTargetAnchor: function(evt){
			var targetAnchor = this._targetAnchor,
				containerPos = html.position(this.grid.mainNode);
			if(!targetAnchor){
				targetAnchor = this._targetAnchor = this._createTargetAnchor();
				targetAnchor.style.display = "none";
				this.grid.mainNode.appendChild(targetAnchor);
			}
			var pos = this._calcTargetAnchorPos(evt, containerPos);			
			if(pos){
				html.style(targetAnchor, pos);
				targetAnchor.style.display = "block";
			}else{
				targetAnchor.style.display = "none";
			}
		},
		
		_unmarkTargetAnchor: function(){
			var targetAnchor = this._targetAnchor;
			if(targetAnchor){
				targetAnchor.style.display = "none";
			}
		},
		
		//---------------------------------------------------------------------------------
		_startDrag: function(evt, source, nodes, copy){
			if(this._dndReady && source === this._source){
				this._oldStartDrag.call(DndManager.manager(), source, this._node.childNodes, copy);
				delete this._dndReady;
				this._dnding = true;
				this._createUI();
				this._markTargetAnchor(evt);
				html.setSelectable(this.grid.domNode, false);	
			}
		},
		
		_getItem: function(id){
			return {
				type: this.arg('accept'),
				data: id
			};
		},
		
		_checkAcceptance: function(source){
			var res = Source.prototype.checkAcceptance.apply(this._source, arguments);
			if(res){
				if(source[this.name]){
					var g = source[this.name].grid;
					if((g === this.grid && !this.arg('canRearrange')) || //Cannot re-arrange
						(g !== this.grid && (!this.arg('canDragIn') || !source[this.name].arg('canDragOut')))	//Cannot drag in or drag out
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

