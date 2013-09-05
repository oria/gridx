define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'../core/_Module'
], function(declare, array, _Module){

/*=====
=====*/

	return declare(_Module, {
		name: "structureSwitch",
		required: ['hiddenColumns'],
		'default': '',
		auto: true,
		orientation: true,

		constructor: function(){
			var t = this,
				config = t.arg('config', {}),
				condition = t.arg('condition', {}),
				portrait = t.arg('portrait'),
				landscape = t.arg('landscape');
			t.arg('auto');
			if(portrait){
				config.portrait = portrait;
			}
			if(landscape){
				config.landscape = landscape;
			}
			if(t.arg('orientation')){
				if(config.portrait){
					condition.portrait = function(){
						return 'orientation' in window && window.orientation === 0;
					};
				}
				if(config.landscape){
					condition.portrait = function(){
						return Math.abs(window.orientation) == 90;
					};
				}
			}
			t.connect(window, 'orientationchange', '_check');
			t.connect(window, 'onresize', '_check');
		},

		preload: function(){
			var dft = this.config[this.arg('default')];
			if(dft){
				var toHide = array.filter(array.map(this.grid._columns, function(col){
					return col.id;
				}), function(id){
					return array.indexOf(dft, id) < 0;
				});
				[].push.apply(this.grid.hiddenColumns.arg('init', []), toHide);
			}
		},

		load: function(args, startup){
			var t = this;
			startup.then(function(){
				t._check();
				t.loaded.callback();
			});
		},

		//Public----------------------------------------------------------------------------
		to: function(name){
			var g = this.grid;
			var structure = this.config[name] || g.structure;
			if(structure){
				var hiddenColumns = g.hiddenColumns;
				var toHide = array.filter(g._columns, function(col){
					return array.indexOf(structure, col.id) < 0;
				});
				var toShow = array.filter(structure, function(col){
					return !g._columnsById[col.id];
				});
				hiddenColumns.add.apply(hiddenColumns, toHide);
				hiddenColumns.remove.apply(hiddenColumns, toShow);
			}
		},

		//Private-----------------------------------------------------------------------------
		_check: function(){
			var t = this;
			if(t.auto){
				for(var name in t.condition){
					if(t.condition[name](t.grid)){
						t.to(name);
						break;
					}
				}
				t.grid.resize();
			}
		}
	});
});
