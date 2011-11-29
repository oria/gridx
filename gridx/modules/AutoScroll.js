define([
	"dojo/_base/declare",
	"dojo/_base/html",
	"dojo/_base/lang",
	"dojo/_base/window",
	"../core/_Module"
], function(declare, html, lang, win, _Module){

	return _Module.registerModule(
	declare(_Module, {

		name: 'autoScroll',

		constructor: function(){
			this.connect(win.doc, 'mousemove', '_onMouseMove');
		},

		getAPIPath: function(){
			return {
				autoScroll: this
			};
		},
	
		//Public ---------------------------------------------------------------------
		enabled: false,

		vertical: true,

		horizontal: true,

		margin: 20,

		//Private ---------------------------------------------------------------------

		_timeout: 100,

		_step: 10,

		_maxMargin: 100,

		_onMouseMove: function(e){
			if(this.arg('enabled')){
				var d1, d2, g = this.grid, m = this.arg('margin'), 
					pos = html.position(g.bodyNode);
				if(this.arg('vertical') && g.vScroller){
					d1 = e.clientY - pos.y - m;
					d2 = d1 + 2 * m - pos.h;
					this._vdir = d1 < 0 ? d1 : (d2 > 0 ? d2 : 0);
				}
				if(this.arg('horizontal') && g.hScroller){
					d1 = e.clientX - pos.x - m;
					d2 = d1 + 2 * m - pos.w;
					this._hdir = d1 < 0 ? d1 : (d2 > 0 ? d2 : 0);
				}
				if(!this._handler){
					this._scroll();
				}
			}
		},

		_scroll: function(){
			if(this.arg('enabled')){
				var dir, a, needScroll, g = this.grid,
					m = this._maxMargin, s = this._step,
					v = this._vdir, h = this._hdir;
				if(this.arg('vertical') && v){
					dir = v > 0 ? 1 : -1;
					a = Math.min(m, Math.abs(v)) / s;
					a = (a < 1 ? 1 : a) * s * dir;
					g.vScroller.domNode.scrollTop += a;
					needScroll = 1;
				}
				if(this.arg('horizontal') && h){
					dir = h > 0 ? 1 : -1;
					a = Math.min(m, Math.abs(h)) / s;
					a = (a < 1 ? 1 : a) * s * dir;
					g.hScroller.domNode.scrollLeft += a;
					needScroll = 1;
				}
				if(needScroll){
					this._handler = setTimeout(lang.hitch(this, this._scroll), this._timeout);
					return;
				}
			}
			delete this._handler;
		}
	}));
});
