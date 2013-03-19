define([
	'dojo',
	'../utcommon',
	'../../../core/model/Model',
	'../../../core/model/Mapper',
	'../../../core/model/Marker',
	'./DummyModel'
], function(dojo, doh, Model, Mapper, Marker, DummyModel){

return function(CacheClass, createStore, totalSize, name){

var columns = {
	id: {id: 'id', field: 'id'},
	number: {id: 'number', field: 'number'}
};

var createModel = function(){
	return new Model({
		store: createStore(),
		columns: columns,
		cacheClass: CacheClass,
		cacheSize: 200,
		pageSize: 100,
		neibourSize: 100,
		modelExtensions: [
			Mapper,
			Marker
		]
	});
};

var dm = new DummyModel(totalSize);

var verify = function(m, d, t){
	return m.when({start: 0}, function(){
		try{
			var i, id;
			t.is(dm.size(), m.size(), 'size');
			for(i = 0; i < dm.size(); ++i){
				id = m.byIndex(i).data.id;
				t.is(dm.indexToId(i), id, 'id of index ' + i);
				t.is(dm.getMark(id), m.getMark(id), 'mark status of index' + i);
			}
		}catch(e){
			d.errback(e);
		}
	});
};

var doCommands = function(m, d, t, count){
	for(; count > 0; --count){
		var cmd = randomCmd();
		var args = randomArgs(cmd);
		var log = ['m.', cmd, '(', args.log, ');'].join('');
		console.log(log);
		console.log('d' + log);
		m[cmd].apply(m, args);
		dm[cmd].apply(dm, args);
	}
	console.log('=====================================================');
	return verify(m, d, t);
};

var test = function(batchCount, cmdCount){
	return function(d, t){
		try{
			var count = batchCount;
			var m = createModel();
			dm.clear();
			var func = function(){
				console.log('-----------------------------------batch: ', batchCount - count + 1);
				doCommands(m, d, t, cmdCount).then(function(){
					if(--count > 0){
						func();
					}else{
						d.callback(true);
					}
				});
			};
			func();
		}catch(e){
			d.errback(e);
		}
	};
};

var randomCmd = function(){
	var cmds = ['sort', 'move', 'filter', 'markById', 'markByIndex', 'markAll'];
	return cmds[Math.floor(Math.random() * cmds.length)];
};

var randomArgs = function(cmd){
	var mark, args;
	switch(cmd){
		case 'sort':
			var desc = Math.random() < 0.5;
			args = [[{colId: 'id', descending: desc}]];
			args.log = ['[{colId: "id", descending: ', desc, '}]'].join('');
			break;
		case 'move':
			var start = Math.floor(Math.random() * totalSize);
			var count = Math.floor(Math.random() * (totalSize - start + 1));
			var target = Math.floor(Math.random() * totalSize);
			args = [start, count, target];
			args.log = [start, ', ', count, ', ', target].join('');
			break;
		case 'filter':
			var a = Math.floor(Math.random() * totalSize);
			var clear = Math.random() < 0.1;
			args = clear ? [null] : [function(row, id){
				return (id % a) > (a / 2);
			}];
			args.log = clear ? 'null' : ['function(row, id){return (id % ', a, ') > (', a, ' / 2);}'].join('');
			break;
		case 'markById':
			var id = Math.floor(Math.random() * totalSize) + 1;
			mark = Math.random() < 0.5;
			args = [id, mark];
			args.log = [id, ', ', mark].join('');
			break;
		case 'markByIndex':
			var index = Math.floor(Math.random() * totalSize);
			mark = Math.random() < 0.5;
			args = [index, mark];
			args.log = [index, ', ', mark].join('');
			break;
		case 'markAll':
			mark = Math.random() < 0.5;
			args = [mark];
			args.log = [mark].join('');
			break;
		default:
			return [];
	}
	return args;
};

doh.ts('multi_random_queue');

doh.tt('a', test(10, 10));

doh.ts('verify');

doh.tt('a', function(d, t){
});

doh.prefix = name;
doh.go(
	'multi_random_queue',
0);

};
});

