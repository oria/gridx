define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom",
	"dojo/_base/window",
	"dojo/_base/sniff",
	"dojo/dnd/Source",
	"dojo/dnd/Manager",
	"../../core/_Module",
	"./Avatar",
	"../AutoScroll"
], function(declare, lang, Deferred, domConstruct, domGeometry, domClass, domStyle, dom, win, sniff, Source, DndManager, _Module, Avatar){

	return _Module.register(
	declare(_Module, {
		name: '_dnd',

		constructor: function(){
			this.accept = [];
			this._profiles = {};
			this._selectStatus = {};
			this._node = domConstruct.create('div');
			var g = this.grid, doc = win.doc;
			this.batchConnect(
	            [g, 'onCellMouseOver', '_checkDndReady'],
	            [g, 'onCellMouseOut', '_dismissDndReady'],
	            [g, 'onCellMouseDown', '_beginDnd'],
				[doc, 'onmouseup', '_endDnd'],
				[doc, 'onmousemove', '_onMouseMove']
			);
			this.subscribe("/dnd/cancel", '_endDnd');
		},

		load: function(args){
			var n = this.grid.bodyNode, hitch = lang.hitch;
			this._source = new Source(n, {
				isSource: false,
				accept: this.accept,
				getSelectedNodes: function(){return [0];},
				getItem: hitch(this, '_getItem'),
				checkAcceptance: hitch(this, '_checkAcceptance'),
				onDraggingOver: hitch(this, '_onDraggingOver'),
				onDraggingOut: hitch(this, '_onDraggingOut'),
				onDropExternal: hitch(this, '_onDropExternal'),
				onDropInternal: hitch(this, '_onDropInternal')
			});
			if(sniff('ff')){
				this._fixFF(this._source, n);
			}
			this._source.grid = this.grid;
			this._saveSelectStatus();
			this.loaded.callback();
		},
		
		destory: function(){
			this.inherited(arguments);
			this._source.destory();
			domConstruct.destroy(this._node);
		},
	
		getAPIPath: function(){
			return {
				dnd: {
					_dnd: this
				}
			};
		},

		//Public----------------------------------------------------------------------
		profile: null,

		register: function(name, profile){
			this._profiles[name] = profile;
			[].push.apply(this.accept, profile.arg('accept'));
		},
		
		//Private-----------------------------------------------------------------
		_fixFF: function(source){
			return this.connect(win.doc, 'onmousemove', function(evt){
				var pos = domGeometry.position(source.node),
					x = evt.clientX,
					y = evt.clientY,
					alreadyIn = source._alreadyIn;
				isIn = y >= pos.y && y <= pos.y + pos.h && x >= pos.x && x <= pos.x + pos.w;
				if(!alreadyIn && isIn){
					source._alreadyIn = 1;
					source.onOverEvent();
				}else if(alreadyIn && !isIn){
					source._alreadyIn = 0;
					source.onOutEvent();
				}
			});
		},
	
		_onMouseMove: function(evt){
			if(this._alreadyIn && (this._dnding || this._extDnding)){
				this._markTargetAnchor(evt);
			}
		},

		_saveSelectStatus: function(enabled){
			var name, selector, selectors = this.grid.select;
			if(selectors){
				for(name in selectors){
					selector = selectors[name];
					if(selector && lang.isObject(selector)){
						this._selectStatus[name] = selector.arg('enabled');
						if(enabled !== undefined){
							selector.enabled = enabled;
						}
					}
				}
			}
		},

		_loadSelectStatus: function(){
			var name, selector, selectors = this.grid.select;
			if(selectors){
				for(name in selectors){
					selector = selectors[name];
					if(selector && lang.isObject(selector)){
						selector.enabled = this._selectStatus[name];
					}
				}
			}
		},

		_checkDndReady: function(evt){
			if(!this._dndReady && !this._dnding && !this._extDnding){
				for(var name in this._profiles){
					var p = this._profiles[name];
					if(p.arg('enabled') && p._checkDndReady(evt)){
						this.profile = p;
						this._saveSelectStatus(false);
						domClass.add(win.body(), 'dojoxGridxDnDReadyCursor');
						this._dndReady = true;
						return;
					}
				}
			}
		},
		
		_dismissDndReady: function(){
			if(this._dndReady){
				this._loadSelectStatus();
				delete this._dndReady;
				domClass.remove(win.body(), 'dojoxGridxDnDReadyCursor');
			}
		},

		_beginDnd: function(evt){
			this._checkDndReady(evt);
			if(this._dndReady){
				this._source.isSource = true;
				this._source.canNotDragOut = !this.profile.arg('provide').length;
				this._node.innerHTML = this.profile._buildDndNodes();
				var m = DndManager.manager();
				this._oldStartDrag = m.startDrag;
				m.startDrag = lang.hitch(this, '_startDrag', evt);
				
				this._oldMakeAvatar = m.makeAvatar;
				m.makeAvatar = function(){
					return new Avatar(m);
				};
				m._dndInfo = {
					cssName: this.profile._cssName,
					count: this.profile._getDndCount()
				};
				this.profile._onBeginDnd(this._source);
				dom.setSelectable(this.grid.bodyNode, false);	
			}
		},
	
		_endDnd: function(){
			this._source.isSource = false;
			this._alreadyIn = 0;
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
				this._destroyUI();
				dom.setSelectable(this.grid.bodyNode, true);
				domClass.remove(win.body(), 'dojoxGridxDnDReadyCursor');
				this.profile._onEndDnd();
				this._loadSelectStatus(false);
			}
		},
		
		_createUI: function(){
			domClass.add(win.body(), 'dojoxGridxDnDCursor');
			if(this.grid.autoScroll){
				this.profile._onBeginAutoScroll();
				this.grid.autoScroll.enabled = true;
			}
		},
	
		_destroyUI: function(){
			this._unmarkTargetAnchor();
			domClass.remove(win.body(), 'dojoxGridxDnDCursor');
			if(this.grid.autoScroll){
				this.profile._onEndAutoScroll();
				this.grid.autoScroll.enabled = false;
			}
		},
	
		_createTargetAnchor: function(){
			return domConstruct.create("div", {
				"class": "dojoxGridxDnDAnchor"
			});
		},
		
		_markTargetAnchor: function(evt){
			if(this._extDnding || this.profile.arg('canRearrange')){
				var targetAnchor = this._targetAnchor,
					containerPos = domGeometry.position(this.grid.mainNode);
				if(!targetAnchor){
					targetAnchor = this._targetAnchor = this._createTargetAnchor();
					targetAnchor.style.display = "none";
					this.grid.mainNode.appendChild(targetAnchor);
				}
				domClass.add(targetAnchor, 'dojoxGridxDnDAnchor' + this.profile._cssName);
				var pos = this.profile._calcTargetAnchorPos(evt, containerPos);
				if(pos){
					domStyle.set(targetAnchor, pos);
					targetAnchor.style.display = "block";
				}else{
					targetAnchor.style.display = "none";
				}
			}
		},
		
		_unmarkTargetAnchor: function(){
			var targetAnchor = this._targetAnchor;
			if(targetAnchor){
				targetAnchor.style.display = "none";
				domClass.remove(targetAnchor, 'dojoxGridxDnDAnchor' + this.profile._cssName);
			}
		},
		
		//---------------------------------------------------------------------------------
		_startDrag: function(evt, source, nodes, copy){
			if(this._dndReady && source === this._source){
				this._oldStartDrag.call(DndManager.manager(), source, this._node.childNodes, copy);
				delete this._dndReady;
				this._dnding = 1;
				this._alreadyIn = 1;
				this._createUI();
				this._markTargetAnchor(evt);
			}
		},
		
		_getItem: function(id){
			return {
				type: this.profile.arg('provide'),
				data: this.profile._getItemData(id)
			};
		},
		
		_checkAcceptance: function(source, nodes){
			var getHash = function(arr){
				var res = {};
				for(var i = arr.length - 1; i >= 0; --i){
					res[arr[i]] = 1;
				}
				return res;
			};
			var checkAcceptance = Source.prototype.checkAcceptance;
			var res = checkAcceptance.apply(this._source, arguments);
			if(res){
				if(source.grid === this.grid){
					return this.profile.arg('canRearrange');
				}
				if(!source.canNotDragOut){
					for(var name in this._profiles){
						var p = this._profiles[name];
						var accepted = checkAcceptance.apply({
							accept: getHash(p.arg('accept'))
						}, arguments);
						if(p.arg('enabled') && accepted &&
							(!p.checkAcceptance || p.checkAcceptance.apply(p, arguments))){
							this.profile = p;
							this._extDnding = true;
							return true;
						}
					}
				}
			}
			return false;
		},
		
		_onDraggingOver: function(){
			if(this._dnding || this._extDnding){
				this._alreadyIn = 1;
				this._createUI();
			}
		},
		
		_onDraggingOut: function(){
			if(this._dnding || this._extDnding){
				this._alreadyIn = 0;
				this._destroyUI();
			}
		},

		_onDropInternal: function(nodes, copy){
			this.profile._onDropInternal(nodes, copy);
		},
		
		_onDropExternal: function(source, nodes, copy){
			var _this = this, dropped = this.profile._onDropExternal(source, nodes, copy);
			Deferred.when(dropped, function(){
				if(!copy){
					if(source.grid){
						source.grid.dnd._dnd.profile.onDraggedOut(_this._source);
					}else{
						source.deleteSelectedNodes();
					}
				}
			});
		}
	}));
});
