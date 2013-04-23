define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/Deferred",
	"dojo/query",
	"dojo/_base/sniff",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/keys",
	"../core/_Module"
], function(declare, array, Deferred, query, has, domGeometry, domClass, domStyle, keys, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		Manages column width distribution, allow grid autoWidth and column autoResize.

		// default: Number
		//		Default column width. Applied when it's not possible to decide accurate column width from user's config.
		'default': 60,

		// autoResize: Boolean
		//		If set to true, the column width should be set to auto or percentage values,
		//		so that the column can automatically resize when the grid width is changed.
		//		(This is the default behavior of an	HTML table).
		autoResize: false,

		onUpdate: function(){
			// summary:
			//		Fired when column widths are updated.
		}
	});
=====*/

	return declare(_Module, {
		name: 'columnWidth',

		forced: ['hLayout'],

		constructor: function(){
			this._init();
		},

		preload: function(){
			var t = this,
				g = t.grid;
			t._ready = new Deferred();
			t.batchConnect(
				[g.hLayout, 'onUpdateWidth', '_onUpdateWidth'],
				[g, 'setColumns', '_onSetColumns']);
		},

		load: function(){
			this._adaptWidth();
			this.loaded.callback();
		},

		//Public-----------------------------------------------------------------------------
		'default': 60,

		autoResize: false,

		onUpdate: function(){},

		//Private-----------------------------------------------------------------------------
		_init: function(){
			var t = this,
				g = t.grid,
				dn = g.domNode,
				cols = g._columns;
			array.forEach(cols, function(col){
				if(!col.hasOwnProperty('declaredWidth')){
					col.declaredWidth = col.width = col.width || 'auto';
				}
			});
			if(g.autoWidth){
				array.forEach(cols, function(c){
					if(c.declaredWidth == 'auto'){
						c.width = t.arg('default') + 'px';
					}
				});
			}else if(t.arg('autoResize')){
				domClass.add(dn, 'gridxPercentColumnWidth');
				array.forEach(cols, function(c){
					if(!(/%$/).test(c.declaredWidth)){
						c.width = 'auto';
					}
				});
			}
		},

		_onUpdateWidth: function(){
			var t = this,
				g = t.grid;
			if(g.autoWidth){
				t._adaptWidth();
			}else{
				var noHScroller = g.hScrollerNode.style.display == 'none';
				t._adaptWidth(!noHScroller, 1);	//1 as true
				if(!t.arg('autoResize') && noHScroller){
					query('.gridxCell', g.bodyNode).forEach(function(cellNode){
						var col = g._columnsById[cellNode.getAttribute('colId')];
						if(t.arg('autoResize') ||
							!col.declaredWidth ||
							col.declaredWidth == 'auto' ||
							(/%$/).test(col.declaredWidth)){
							cellNode.style.width = col.width;
							cellNode.style.minWidth = col.width;
							cellNode.style.maxWidth = col.width;
						}
					});
				}
				t.onUpdate();
			}
		},

		_adaptWidth: function(skip, noEvent){
			var t = this,
				g = t.grid,
				dn = g.domNode,
				header = g.header,
				ltr = g.isLeftToRight(),
				marginLead = ltr ? 'marginLeft' : 'marginRight',
				marginTail = ltr ? 'marginRight' : 'marginLeft',
				lead = g.hLayout.lead,
				tail = g.hLayout.tail,
				innerNode = header.innerNode,
				bs = g.bodyNode.style,
				hs = innerNode.style,
				headerBorder = domGeometry.getBorderExtents(header.domNode).w,
				tailBorder = headerBorder,
				mainBorder = 0,
				bodyWidth = (dn.clientWidth || domStyle.get(dn, 'width')) - lead - tail - headerBorder,
				refNode = query('.gridxCell', innerNode)[0],
				padBorder = refNode ? domGeometry.getMarginBox(refNode).w - domGeometry.getContentBox(refNode).w : 0,
				isGroupHeader = g.header.arg('groups'),
				isGridHidden = !dn.offsetHeight;
			t._padBorder = padBorder;
			//FIXME: this is theme dependent. Any better way to do this?
			if(tailBorder === 0){
				tailBorder = 1;
			}else{
				mainBorder = 2;
			}
			hs[marginLead] = lead + 'px';
			hs[marginTail] = (tail > tailBorder ? tail - tailBorder : 0)  + 'px';
			g.mainNode.style[marginLead] = lead + 'px';
			g.mainNode.style[marginTail] = tail + 'px';
			bodyWidth = bodyWidth < 0 ? 0 : bodyWidth;
			if(skip){
				t.onUpdate();
				return;
			}
			if(g.autoWidth){
				var headers = query('.gridxCell', innerNode),
					totalWidth = 0;
				headers.forEach(function(node){
					var w = domStyle.get(node, 'width');
					if(isGroupHeader || !has('safari') || !isGridHidden){
						w += padBorder;
					}
					totalWidth += w;
					var c = g._columnsById[node.getAttribute('colid')];
					if(c.width == 'auto' || (/%$/).test(c.width)){
						console.log(c.id, w);
						node.style.width = c.width = w + 'px';
						node.style.minWidth = c.width;
						node.style.maxWidth = c.width;
					}
				});
				bs.width = totalWidth + 'px';
				dn.style.width = (lead + tail + totalWidth + mainBorder) + 'px';
			}else if(t.arg('autoResize')){
				hs.borderWidth = g.vScrollerNode.style.display == 'none' ? 0 : '';
			}else{
				var autoCols = [],
					cols = g._columns,
					fixedWidth = 0;
				if(!isGroupHeader && has('safari')){
					padBorder = 0;
				}
				array.forEach(cols, function(c){
					if(c.declaredWidth == 'auto'){
						autoCols.push(c);
					}else if(/%$/.test(c.declaredWidth)){
						var w = parseInt(bodyWidth * parseFloat(c.declaredWidth, 10) / 100 - padBorder, 10);
						//Check if less than zero, prevent error in IE.
						if(w < 0){
							w = 0;
						}
						var node = header.getHeaderNode(c.id);
						node.style.width = c.width = w + 'px';
						node.style.minWidth = c.width;
						node.style.maxWidth = c.width;
					}
				});
				array.forEach(cols, function(c){
					if(c.declaredWidth != 'auto'){
						var headerNode = header.getHeaderNode(c.id),
							w = !isGroupHeader && has('safari') ? parseFloat(headerNode.style.width, 10) :
								headerNode.offsetWidth || (domStyle.get(headerNode, 'width') + padBorder);
						if(/%$/.test(c.declaredWidth)){
							c.width = (w > padBorder ? w - padBorder : 0) + 'px';
						}
						fixedWidth += w;
					}
				});
				if(autoCols.length){
					var w = bodyWidth > fixedWidth ? ((bodyWidth - fixedWidth) / autoCols.length - padBorder) : t.arg('default'),
						ww = parseInt(w, 10);
					if(bodyWidth > fixedWidth){
						ww = bodyWidth - fixedWidth - (ww + padBorder) * (autoCols.length - 1) - padBorder;
					}
					w = parseInt(w, 10);
					//Check if less than zero, prevent error in IE.
					if(w < 0){
						w = 0;
					}
					if(ww < 0){
						ww = 0;
					}
					array.forEach(autoCols, function(c, i){
						var node = header.getHeaderNode(c.id);
						node.style.width = c.width = (i < autoCols.length - 1 ? w : ww) + 'px';
						node.style.minWidth = c.width;
						node.style.maxWidth = c.width;
					});
				}
			}
			if(isGroupHeader){
				// If group header is used, the column width might not be set properly 
				// (min-width/max-width not working when colspan cells exist).
				// So the actual width of the node is honored.
				query('.gridxCell', header.innerNode).forEach(function(node){
					var col = g._columnsById[node.getAttribute('colid')];
					if(/px$/.test(col.width)){
						var width = node.clientWidth - domGeometry.getPadExtents(node).w;
						if(parseInt(col.width, 10) != width){
							console.log('here! ', col.width, ', ', width);
							col.width = width = width + 'px';
							node.style.width = width;
							node.style.minWidth = width;
							node.style.maxWidth = width;
						}
					}
				});
			}
			g.hScroller.scroll(0);
			header._onHScroll(0);
			g.vLayout.reLayout();
			if(!noEvent){
				t.onUpdate();
			}
		},

		_onSetColumns: function(){
			var t = this,
				g = t.grid;
			t._init();
			g.header.refresh();
			t._adaptWidth();
			//FIXME: Is there any more elegant way to do this?
			if(g.cellWidget){
				g.cellWidget._init();
				if(g.edit){
					g.edit._init();
				}
			}
			if(g.tree){
				g.tree._initExpandLevel();
			}
			g.body.refresh();
		}
	});
});
