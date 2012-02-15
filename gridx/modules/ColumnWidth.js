define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/html",
	"dojo/_base/Deferred",
	"dojo/_base/query",
	"dojo/_base/sniff",
	"dojo/_base/event",
	"dojo/keys",
	"dojox/html/metrics",
	"../core/_Module"
], function(declare, array, html, Deferred, query, sniff, event, keys, metrics, _Module){

	return _Module.register(
	declare(_Module, {
		name: 'columnWidth',
	
		forced: ['hLayout', 'header'],

		getAPIPath: function(){
			return {
				columnWidth: this
			};
		},

		constructor: function(){
			this._ready = new Deferred();
		},

		preload: function(){
			var g = this.grid;
			if(!g.hScroller){
				this.percentage = true;
			}
			this.batchConnect(
				[g, '_onResizeBegin', function(changeSize, ds){
					ds.header = new Deferred();
					if(!this.arg('percentage')){
						this._adaptWidth();
					}else{
						g.bodyNode.style.width = (g.domNode.clientWidth - g.hLayout.lead - g.hLayout.tail) + 'px';
					}
					ds.header.callback();
				}],
				[g.hLayout, 'onUpdateWidth', function(){
					this._adaptWidth();
					this._ready.callback();
				}],
				[g, 'setColumns', '_adaptWidth']
			);
		},

		load: function(){
			var loaded = this.loaded;
			this._ready.then(function(){
				loaded.callback();
			});
		},

		//Public-----------------------------------------------------------------------------
		'default': 60,

		percentage: false,

		//Private-----------------------------------------------------------------------------
		_adaptWidth: function(){
			var g = this.grid,
				header = g.header,
				ltr = g.isLeftToRight(),
				marginLead = ltr ? 'marginLeft' : 'marginRight',
				marginTail = ltr ? 'marginRight' : 'marginLeft',
				lead = g.hLayout.lead,
				tail = g.hLayout.tail,
				innerNode = header.innerNode,
				padBorder = 0;
			if(!sniff('webkit')){
				var refNode = query('.dojoxGridxCell', innerNode)[0];
				padBorder = html.getMarginBox(refNode).w - html.getContentBox(refNode).w;
			}
			innerNode.style[marginLead] = lead + 'px';
			innerNode.style[marginTail] = tail + 'px';
			g.bodyNode.style[marginLead] = lead + 'px';
			var bodyWidth = g.domNode.clientWidth - lead - tail;
			if(g.autoWidth){
				array.forEach(g._columns, function(col){
					if(!col.width){
						col.width = this.arg('default') + 'px';
					}
				}, this);
				header.refresh();
				var headers = query('th.dojoxGridxCell', innerNode);
				var totalWidth = 0;
				headers.forEach(function(node){
					var w = node.offsetWidth;
					totalWidth += w;
					g._columnsById[node.getAttribute('colid')].width = (w - padBorder) + 'px';
				});
				header._columnsWidth = totalWidth;
				g.bodyNode.style.width = totalWidth + 'px';
				g.domNode.style.width = (lead + tail + totalWidth) + 'px';
			}else if(this.arg('percentage')){
				g.bodyNode.style.width = bodyWidth + 'px';
				html.addClass(g.domNode, 'dojoxGridxPercentColumnWidth');
				array.forEach(g._columns, function(col){
					if(!col.width || !/%$/.test(col.width)){
						col.width = 'auto';
					}
				});
				header.refresh();
			}else{
				var autoCols = [];
				var fixedWidth = 0;
				g.bodyNode.style.width = bodyWidth + 'px';
				array.forEach(g._columns, function(col){
					if(!col.width || col.width == 'auto'){
						col.width = 'auto';
						autoCols.push(col);
					}else if(/%$/.test(col.width)){
						col.width = (bodyWidth * parseFloat(col.width, 10) / 100 - padBorder) + 'px';
					}
				});
				header.refresh();
				array.forEach(g._columns, function(col){
					if(col.width != 'auto'){
						var node = header.getHeaderNode(col.id);
						var w = node.offsetWidth;
						col.width = (w - padBorder) + 'px';
						fixedWidth += w;
					}
				});
				var w = (bodyWidth > fixedWidth ? ((bodyWidth - fixedWidth) / autoCols.length - padBorder) : 
					this.arg('default')) + 'px';
				array.forEach(autoCols, function(col){
					col.width = w; 
				});
				header.refresh();
			}
		}
	}));
});

