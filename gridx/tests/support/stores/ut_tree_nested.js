define([
'dojo',
'dojo/data/ItemFileWriteStore',
'../../core/model/AsyncTreeCache',
'../../core/Core',
'../../modules/Tree'
], function(dojo, Store, Cache, Core, Tree){

var seed = 9973;
var randomNumber = function(range){
	var a = 8887;
	var c = 9643;
	var m = 8677;
	seed = (a * seed + c) % m;
	var res = Math.floor(seed / m * range);
	return res;
};

var chars = "0,1,2,3, ,4,5,6,7, ,8,9,a,b, ,c,d,e,f, ,g,h,i,j, ,k,l,m,n, ,k,o,p,q, ,r,s,t,u, ,v,w,x,y, ,z".split(',');
var randomString = function(){
	var len = randomNumber(50), i, str = [];
	for(i = 0; i < len; ++i){
		str.push(chars[randomNumber(chars.length)]);
	}
	return str.join('');
};

var randomDate = function(){
	return new Date(randomNumber(10000000000000));
};

var generateItem = function(parentId, index, level){
	return {
		id: parentId + "-" + (index + 1),
		number: level <= 1 ? randomNumber(10000) : undefined,
		string: level <= 2 ? randomString() : undefined,
		date: level <= 3 ? randomDate().toDateString() : undefined,
		time: randomDate().toTimeString().split(' ')[0],
		bool: randomNumber(10) < 5
	};
};

var generateLevel = function(parentId, level, maxLevel, maxChildrenCount){
	var i, item, res = [];
	var childrenCount = randomNumber(maxChildrenCount);
	for(i = 0; i < childrenCount; ++i){
		item = generateItem(parentId, i, level);
		res.push(item);
		if(level < maxLevel){
			item['level' + (level - 1) + 'Child'] = generateLevel(item.id, level + 1, maxLevel, maxChildrenCount);
		}
	}
	return res;
};

var normalizeArgs = function(args){
	var i, res = {
		range: [],
		id: []
	},
	isIndex = function(a){
		return typeof a === 'number' && a >= 0;
	},
	isRange = function(a){
		return a && typeof a.start === 'number' && a.start >= 0;
	},
	f = function(a){
		if(isRange(a)){
			res.range.push(a);
		}else if(isIndex(a)){
			res.range.push({start: a, count: 1});
		}else if(dojo.isArrayLike(a)){
			for(i = a.length - 1; i >= 0; --i){
				if(isIndex(a[i])){
					res.range.push({
						start: a[i],
						count: 1
					});
				}else if(isRange(a[i])){
					res.range.push(a[i]);
				}else if(dojo.isString(a)){
					res.id.push(a[i]);
				}
			}
		}else if(dojo.isString(a)){
			res.id.push(a);
		}
	};
	if(args && (args.index || args.range || args.id)){
		f(args.index);
		f(args.range);
		if(dojo.isArrayLike(args.id)){
			for(i = args.id.length - 1; i >= 0; --i){
				res.id.push(args.id[i]);
			}
		}else if(args.id !== undefined){
			res.id.push(args.id);
		}
	}else{
		f(args);
	}
	if(!res.range.length && !res.id.length && this.size() < 0){
		res.range.push({start: 0, count: 1});
	}
	return res;
};

var store = new Store({
	data: {
		identifier: 'id',
		label: 'id',
		items: generateLevel('item', 1, 3, 10)
	}
});

var columns = [
	{id: 'id', field: 'id'},
	{id: 'number', field: 'number', expandField: 'level0Child', nestedLevel: 0},
	{id: 'string', field: 'string', expandField: 'level1Child', nestedLevel: 1},
	{id: 'date', field: 'date', expandField: 'level2Child', nestedLevel: 2},
	{id: 'time', field: 'time'},
	{id: 'bool', field: 'bool'}
];

var createCore = function(){
	var core = new Core();
	core._reset({
		store: store,
		structure: columns,
		cacheClass: Cache,
		cacheSize: 1,
		pageSize: 1,
		nested: true,
		modules: [
			Tree
		]
	});
	core._load(new dojo.Deferred());
	return core;
};

var printLevel = function(items, level){
	dojo.forEach(items, function(item){
		var s = [];
		for(var i = 0; i < level; ++i){
			s.push('  ');
		}
		s.push(store.getValue(item, 'id'));
		console.log(s.join(''));
		if(item['level' + level + 'Child']){
			printLevel(item['level' + level + 'Child'], level + 1);
		}
	});
};

store.fetch({
	start: 0,
	onComplete: function(items){
		printLevel(items, 0);	
	}
});

var v = function(t, core, vidx, parentId, idx){
	var rowInfo = core.tree.getRowInfoByVisualIndex(vidx, 0);
	t.is(parentId, rowInfo.parentId);
	t.is(idx, rowInfo.start);
	t.is(1, rowInfo.count);
};

var test = function(preOps, toExpand, beforeExpand, afterExpand){
	return function(t){
		var d = new doh.Deferred();
		var core = createCore();
		var i, f = dojo.partial(v, t, core);
		var func = function(id){
			if(id[0] === '-'){
				return core.tree.collapse(id.substring(1));
			}else{
				return core.tree.expand(id);
			}
		};
		(new dojo.DeferredList(dojo.map(preOps, func))).then(function(){
			for(i = 0; i < beforeExpand.length; ++i){
				f.apply(0, beforeExpand[i]);
			}
			(new dojo.DeferredList(dojo.map(toExpand, func))).then(function(){
				try{
					for(i = 0; i < afterExpand.length; ++i){
						f.apply(0, afterExpand[i]);
					}
					d.callback(true);
				}catch(e){
					d.errback(e);
				}
			});
			core._uninit();
		});
		return d;
	};
};

var testSets = [
	{name: 'a', funcs: [
		{
			name: 'aa',
			timeout: 5000,
			runTest: test([], [
				'item-1'
			], [
				[0, '', 0],
				[1, '', 1]
			], [
				[0, '', 0],
				[1, 'item-1', 0],
				[2, 'item-1', 1],
				[3, 'item-1', 2],
				[4, 'item-1', 3],
				[5, 'item-1', 4],
				[6, '', 1]
			])
		},
		{
			name: 'bb',
			timeout: 5000,
			runTest: test([], [
				'item-1',
				'item-2'
			], [
				[0, '', 0],
				[1, '', 1],
				[2, '', 2],
				[3, '', 3]
			], [
				[0, '', 0],
				[1, 'item-1', 0],
				[2, 'item-1', 1],
				[3, 'item-1', 2],
				[4, 'item-1', 3],
				[5, 'item-1', 4],
				[6, '', 1],
				[7, 'item-2', 0],
				[8, 'item-2', 1],
				[9, 'item-2', 2],
				[10, '', 2],
				[11, '', 3]
			])
		},
		{	
			name: 'cc',
			timeout: 5000,
			runTest: test([], [
				'item-1',
				'item-1-1'
			], [
				[0, '', 0],
				[1, '', 1],
				[2, '', 2],
				[3, '', 3]
			], [
				[0, '', 0],
				[1, 'item-1', 0],
				[2, 'item-1-1', 0],
				[3, 'item-1-1', 1],
				[4, 'item-1-1', 2],
				[5, 'item-1-1', 3],
				[6, 'item-1-1', 4],
				[7, 'item-1-1', 5],
				[8, 'item-1-1', 6],
				[9, 'item-1', 1],
				[10, 'item-1', 2],
				[11, 'item-1', 3],
				[12, 'item-1', 4],
				[13, '', 1],
				[14, '', 2],
				[15, '', 3]
			])
		},
		{
			name: 'dd',
			timeout: 5000,
			runTest: test([
				'item-1', 
				'item-1-1'
			], [
				'-item-1',
				'item-1'
			], [
				[0, '', 0],
				[1, 'item-1', 0],
				[2, 'item-1-1', 0],
				[3, 'item-1-1', 1],
				[4, 'item-1-1', 2],
				[5, 'item-1-1', 3],
				[6, 'item-1-1', 4],
				[7, 'item-1-1', 5],
				[8, 'item-1-1', 6],
				[9, 'item-1', 1],
				[10, 'item-1', 2],
				[11, 'item-1', 3],
				[12, 'item-1', 4],
				[13, '', 1],
				[14, '', 2],
				[15, '', 3]
			], [
				[0, '', 0],
				[1, 'item-1', 0],
				[2, 'item-1-1', 0],
				[3, 'item-1-1', 1],
				[4, 'item-1-1', 2],
				[5, 'item-1-1', 3],
				[6, 'item-1-1', 4],
				[7, 'item-1-1', 5],
				[8, 'item-1-1', 6],
				[9, 'item-1', 1],
				[10, 'item-1', 2],
				[11, 'item-1', 3],
				[12, 'item-1', 4],
				[13, '', 1],
				[14, '', 2],
				[15, '', 3]
			])
		}, 
		{
			name: 'ee',
			timeout: 5000,
			runTest: test([
				'item-1',
				'item-2',
				'item-3',
				'item-2-2',
				'-item-2'
			], [
				'item-2'
			], [
				[0, '', 0],
				[1, 'item-1', 0],
				[2, 'item-1', 1],
				[3, 'item-1', 2],
				[4, 'item-1', 3],
				[5, 'item-1', 4],
				[6, '', 1],
				[7, '', 2],
				[8, 'item-3', 0],
				[9, '', 3]
			], [
				[0, '', 0],
				[1, 'item-1', 0],
				[2, 'item-1', 1],
				[3, 'item-1', 2],
				[4, 'item-1', 3],
				[5, 'item-1', 4],
				[6, '', 1],
				[7, 'item-2', 0],
				[8, 'item-2', 1],
				[9, 'item-2-2', 0],
				[10, 'item-2-2', 1],
				[11, 'item-2', 2],
				[12, '', 2],
				[13, 'item-3', 0],
				[14, '', 3]
			])
		},
		{
			name: 'ff',
			timeout: 5000,
			runTest: test([
				'item-1',
				'item-1',
				'item-1'
			], [
				'-item-1',
				'-item-1'
			], [
				[0, '', 0],
				[1, 'item-1', 0],
				[2, 'item-1', 1],
				[3, 'item-1', 2],
				[4, 'item-1', 3],
				[5, 'item-1', 4],
				[6, '', 1],
				[7, '', 2],
				[8, '', 3]
			], [
				[0, '', 0],
				[1, '', 1],
				[2, '', 2],
				[3, '', 3]
			])
		}, 
		{
			name: 'gg',
			timeout: 5000,
			runTest: test([
				'item-1',
				'item-2',
				'-item-1',
				'item-2-1'
			], [
				'item-1',
				'item-2',
				'-item-1',
				'item-2-1',
				'-item-2'
			], [
				[0, '', 0],
				[1, '', 1],
				[2, 'item-2', 0],
				[3, 'item-2-1', 0],
				[4, 'item-2-1', 1],
				[5, 'item-2-1', 2],
				[6, 'item-2-1', 3],
				[7, 'item-2-1', 4],
				[8, 'item-2', 1],
				[9, 'item-2', 2],
				[10, '', 2],
				[11, '', 3]
			], [
				[0, '', 0],
				[1, '', 1],
				[2, '', 2],
				[3, '', 3]
			])
		}
	]}
];

var registerDoh = function(ts){
	doh.register(ts.name, ts.funcs);
};
registerDoh(testSets[0]);

});

