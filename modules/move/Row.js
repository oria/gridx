define([
	"dojo/_base/declare",
	"../../core/_Module",
	"../../core/model/extensions/Move"
], function(declare, _Module, Move){

	return _Module.register(
	declare(_Module, {
		name: 'moveRow',
		
		modelExtensions: [Move],

		constructor: function(){
			this.connect(this.model, 'onMoved', '_onMoved');
		},
	
		getAPIPath: function(){
			return {
				move: {
					row: this
				}
			};
		},
		
		rowMixin: {
			moveTo: function(target, skipUpdateBody){
				this.grid.move.row.move([this.index()], target, skipUpdateBody);
				return this;
			}
		},
		
		//Public-----------------------------------------------------------------
		move: function(rowIndexes, target, skipUpdateBody){
			var m = this.model;
			m.moveIndexes(rowIndexes, target);
			if(!skipUpdateBody){
				m.when();
			}
		},
		
		moveRange: function(start, count, target, skipUpdateBody){
			var m = this.model;
			m.move(start, count, target);
			if(!skipUpdateBody){
				m.when();
			}
		},
		
		//Events------------------------------------------------------------------
		onMoved: function(/* rowIndexMapping */){},
		
		//Private-----------------------------------------------------------------
		_onMoved: function(){
			this.grid.body.refresh();
			this.onMoved();
		}
	}));
});
