define([
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/array",
	"dojo/query",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/keys",
	"dojo/_base/event",
	"../core/_Module"
], function(declare, Deferred, array, query, domConstruct, domClass, domStyle, keys, event, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: headerRegions.
		//		This module makes it easy to add custom contents to column header.
		//		Other modules such as NestedSort or HeaderMenu can be based upon this module.

		add: function(creater, priority, skipRefresh){
			// summary:
			//		Add a region to the header.
			// creater: function(column)
			//		A function returning a DOM node, which will be used as the region to be added to header.
			// priority: Number
			//		A priority value indicating where the region should appear in header.
			//		The smaller the value, the closer it'll be from the right border of the header (left border if RTL).
			// skipRefresh: Boolean
			//		If true, the header won't be automatically refreshed immediately after this function,
			//		so that user can add multiple regions all at once and then call the "refresh" method to show them all.
		},

		refresh: function(){
			// summary:
			//		Refresh the header so that changes to the regions can be reflected.
		}
	});
=====*/

return _Module.register(
declare(_Module, {
	name: 'headerRegions',

	forced: ['header'],

	constructor: function(){
		this._regions = [];
	},

	load: function(){
		var t = this;
		t.refresh();
		t._initFocus();
		t.aspect(t.grid.header, 'onRender', 'refresh');
		t.aspect(t.grid, 'onHeaderKeyDown', '_onKey');
		t.loaded.callback();
	},

	add: function(creater, priority, skipRefresh){
		this._regions.push({
			c: creater,
			p: priority || 0,
			n: {}
		});
		if(!skipRefresh){
			this.refresh();
		}
	},

	refresh: function(){
		var t = this,
			g = t.grid,
			regionNodes = t._regionNodes = [],
			regions = t._regions;
		if(regions.length){
			array.forEach(t._regionCnnts || [], function(cnnt){
				cnnt.remove();
				t._cnnts.splice(array.indexOf(t._cnnts, cnnt), 1);
			});
			t._regionCnnts = [];
			regions.sort(function(a, b){
				return b.p - a.p;
			});
			query('.gridxCell', g.header.domNode).forEach(function(node){
				var colId = node.getAttribute('colid'),
					col = g.column(colId, 1),
					nameNode = query('.gridxSortNode', node)[0];
				regionNodes.push(nameNode);
				nameNode.setAttribute('tabindex', -1);
				t._regionCnnts.push(t.connect(nameNode, 'onblur', '_onRegionBlur'));
				array.forEach(regions, function(region){
					var regionNode = region.n[colId];
					if(!regionNode){
						regionNode = region.n[colId] = region.c(col);
						if(regionNode){
							regionNode.setAttribute('tabindex', -1);
							domClass.add(regionNode, 'gridxHeaderRegion');
							t.connect(regionNode, 'onblur', '_onRegionBlur');
						}
					}
					if(regionNode){
						domConstruct.place(regionNode, node, 'first');
						regionNodes.push(regionNode);
					}
				});
			});
			if(!regionNodes[t._curRegionIdx]){
				t._curRegionIdx = 0;
			}
		}
	},

	//Private-------------------------------------------------------------
	_onRegionBlur: function(e){
		var dn = this.grid.header.domNode;
		query('.gridxHeaderRegionFocus', dn).removeClass('gridxHeaderRegionFocus');
		domClass.remove(dn, 'gridxHeaderFocus');
	},

	_initFocus: function(){
		var t = this,
			g = t.grid;
		g.focus.registerArea({
			name: 'header',
			priority: 0,
			focusNode: g.header.domNode,
			scope: t,
			doFocus: t._doFocus,
			onFocus: t._onFocus
		});
	},

	_doFocus: function(e){
		this._focusRegion(this._regionNodes[this._curRegionIdx]);
		return true;
	},

	_onFocus: function(e){
		var target = e.target,
			header = this.grid.header.domNode,
			i = array.indexOf(this._regionNodes, target),
			n = i < 0 ? query(target, header).closest('.gridxSortNode')[0] : target;
		n = n || query(target, header).closest('.gridxHeaderRegion')[0];
		this._focusRegion(n);
		return n;
	},

	_focusRegion: function(region){
		if(region){
			var t = this,
				g = t.grid,
				header = g.header.domNode,
				headerCell = query(region).closest('.gridxCell', header)[0];
			t._curRegionIdx = array.indexOf(t._regionNodes, region);
			try{
				region.focus();
			}catch(e){
				//In IE if region is hidden, this line will throw error.
			}
			setTimeout(function(){
				query('.gridxHeaderRegionFocus', header).removeClass('gridxHeaderRegionFocus');
				domClass.add(headerCell, 'gridxHeaderRegionFocus');
				domClass.add(header, 'gridxHeaderFocus');
				//make it asnyc so that IE will not lose focus
				//firefox and ie will lose focus when region is invisible, focus it again.
				region.focus();
				if(g.hScroller){
					g.hScroller.scrollToColumn(headerCell.getAttribute('colid'));
				}
			}, 0);
		}
	},

	_onKey: function(e){
		if(!this.grid._isCtrlKey(e) && !e.shiftKey && !e.altKey){
			var ltr = this.grid.isLeftToRight(),
				nextKey = ltr ? keys.RIGHT_ARROW : keys.LEFT_ARROW,
				prevKey = ltr ? keys.LEFT_ARROW : keys.RIGHT_ARROW;
			if(e.keyCode == nextKey){
				this._moveFocus(1);
				event.stop(e);
			}else if(e.keyCode == prevKey){
				this._moveFocus(-1);
				event.stop(e);
			}
		}
	},

	_moveFocus: function(dir){
		var t = this,
			i = t._curRegionIdx + dir,
			regionNodes = t._regionNodes;
		while(regionNodes[i] && domStyle.get(regionNodes[i], 'display') == 'none'){
			i += dir;
		}
		if(regionNodes[i]){
			t._focusRegion(regionNodes[i]);
		}
	}
}));
});
