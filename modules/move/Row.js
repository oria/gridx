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
			this.model.moveIndexes(rowIndexes, target);
			if(!skipUpdateBody){
				this.model.when();
			}
			return this;
		},
		
		moveRange: function(start, count, target, skipUpdateBody){
			this.model.move(start, count, target);
			if(!skipUpdateBody){
				this.model.when();
			}
			return this;
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
