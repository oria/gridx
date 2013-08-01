require([
	'dojo/parser',
	'dojo/keys',
	'dojo/_base/Deferred',
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	"gridx/modules/RowHeader",
	'dojo/domReady!'
], function(parser, keys, Deferred){

	var snake = [[1,2], [1,3]];
	var food;
	function cellClass(cell){
		var rowIndex = cell.row.index();
		var colIndex = cell.column.index();
		if(array.some(snake, function(point){
			return rowIndex == point[0] && colIndex == point[1];
		})){
			return 'snakeBody';
		}else if(food && rowIndex == food[0] && colIndex == food[1]){
			return 'food';
		}
		return '';
	}

	items = [];
	layout = [];
	var cn = 30;
	var rn = 10;
	var i;
	for(i = 0; i < rn; ++i){
		items.push({
			id: i + 1
		});
	}
	for(i = 0; i < cn; ++i){
		layout.push({
			id: i + 1,
			name: i + 1,
			width: '20px',
			style: 'height: 20px',
			'class': cellClass
		});
	}

	function moveSnake(){
		var head = snake[0];
		var neck = snake[1];
		var tail = snake[snake.length - 1];
		if(head[0] - neck[0] && dir > 2){
		}
	}

	function placeFood(){
		if(!food){
			food = [Math.floor(Math.random() * cn), Math.floor(Math.random() * rn)];
		}
	}

	Deferred.when(parser.parse(), function(){
		grid.connect(grid.domNode, 'onkeydown', function(evt){
			if(evt.keyCode == keys.LEFT_ARROW){
			}else if(evt.keyCode == keys.RIGHT_ARROW){
			}else if(evt.keyCode == keys.UP_ARROW){
			}else if(evt.keyCode == keys.DOWN_ARROW){
			}
		});
		setInterval(function(){
			moveSnake();
			placeFood();
			grid.body.refresh();
		}, 1000);
	});
});
