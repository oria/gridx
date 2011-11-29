define([
	"dojo/_base/declare",
	"../../core/_Module",
	"../../core/model/Mapper"
], function(declare, _Module, Mapper){

	return _Module.registerModule(
	declare(_Module, {
		name: 'moveRow',
		
		modelExtensions: [Mapper],
	
		getAPIPath: function(){
			return {
				move: {
					row: this
				}
			};
		},
		
		rowMixin: {
			moveTo: function(target, skipUpdateBody){
				this.grid.move.row.moveRange(this.index(), 1, target, skipUpdateBody);
				return this;
			}
		},
		
		//Public-----------------------------------------------------------------
		move: function(rowIndexes, target, skipUpdateBody){
			if(typeof rowIndexes === 'number'){
				rowIndexes = [rowIndexes];
			}
			var map = [], i, len, indexes = [], start, count, result = target, preCount = 0;
			for(i = 0, len = rowIndexes.length; i < len; ++i){
				map[rowIndexes[i]] = true;
			}
			for(i = 0, len = map.length; i < len; ++i){
				if(map[i]){
					indexes.push(i);
					if(start === undefined){
						start = i;
					}
				}
			}
			count = map.length - start;
			map = {};
			len = indexes.length;
			for(i = len; i >= 0; --i){
				if(indexes[i] < result){
					this.model.move(indexes[i], 1, result);
					map[indexes[i]] = result--;
					++preCount;
				}
			}
			for(i = 0; i < len; ++i){
				if(indexes[i] >= target){
					result = target + i - preCount;
					this.model.move(indexes[i], 1, result);
					map[indexes[i]] = result;
				}
			}
			if(!skipUpdateBody){
				this._moveComplete(map, start, count, target);
			}
			return this;
		},
		
		moveRange: function(start, count, target, skipUpdateBody){
			var result = this.model.move(start, count, target), map = {}, i;
			for(i = start; i < start + count; ++i){
				map[i] = result + i;
			}
			if(!skipUpdateBody){
				this._moveComplete(map, start, count, target);
			}
			return this;
		},
		
		//Events------------------------------------------------------------------
		onMoved: function(/* rowIndexMapping */){},
		
		//Private-----------------------------------------------------------------
		_moveComplete: function(map, start, count, target){
			if(start > target){
				count += start - target;
				start = target;
			}else if(start + count < target){
				count = target + 1 - start;
			}
			var _this = this;
			this.model.when({start: start, count: count}).then(function(){
				_this.grid.body.refresh(start, count);
				_this.onMoved(map);
			});
		}
	}));
});
