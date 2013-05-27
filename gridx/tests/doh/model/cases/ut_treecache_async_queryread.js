define([
'dojo',
'../../core/model/AsyncTreeCache',
'dojo/data/ItemFileWriteStore'
], function(dojo, Cache, Store){

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

var generateItem = function(parentId, index){
	return {
		id: parentId + "-" + (index + 1),
		number: randomNumber(10000),
		string: randomString(),
		date: randomDate().toDateString(),
		time: randomDate().toTimeString().split(' ')[0],
		bool: randomNumber(10) < 5
	};
};

var generateLevel = function(parentId, level, maxLevel, maxChildrenCount){
	var i, item, res = [];
	var childrenCount = randomNumber(maxChildrenCount);
	for(i = 0; i < childrenCount; ++i){
		item = generateItem(parentId, i);
		res.push(item);
		if(level < maxLevel){
			item.children = generateLevel(item.id, level + 1, maxLevel, maxChildrenCount);
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

var columns = {
	id: {id: 'id', field: 'id'},
	number: {id: 'number', field: 'number'}
};
var cache = new Cache({
	store: store,
	columns: columns,
	cacheSize: 1,
	pageSize: 1
});

var printLevel = function(items, level){
	dojo.forEach(items, function(item){
		var s = [];
		for(var i = 0; i < level; ++i){
			s.push('  ');
		}
		s.push(store.getValue(item, 'id'));
		console.log(s.join(''));
		if(item.children){
			printLevel(item.children, level + 1);
		}
	});
};

store.fetch({
	start: 0,
	onComplete: function(items){
		printLevel(items, 0);	
	}
});

var test = function(req, verify){
	return function(t){
		var d = new doh.Deferred();
		cache.clear();
		cache.when(normalizeArgs(req), function(){
			try{
				verify(t);
				d.callback(true);
			}catch(e){
				d.errback(e);
			}
		});
		return d;
	};
};


var testSets = [
	{name: 'a', funcs: [
		{
			name: 'aa',
			timeout: 5000,
			runTest: test({
				id: ['item-1']
			}, function(t){
				t.is('item-1', cache.byId('item-1').data.id);
				t.is(4, cache.size());
			})
		},
		{
			name: 'bb',
			timeout: 5000,
			runTest: test({
				id: ['item-1-2']
			}, function(t){
				t.is('item-1', cache.byId('item-1').data.id);
				t.is('item-1-2', cache.byId('item-1-2').data.id);
				t.is(4, cache.size());
				t.is(5, cache.size('item-1'));
			})
		},
		{
			name: 'cc',
			timeout: 5000,
			runTest: test({
				id: ['item-1-3-5']
			}, function(t){
				t.is('item-1-3-5', cache.byId('item-1-3-5').data.id);
				t.is('item-1-3', cache.byId('item-1-3').data.id);
				t.is('item-1', cache.byId('item-1').data.id);
				t.is(4, cache.size());
				t.is(5, cache.size('item-1'));
				t.is(9, cache.size('item-1-3'));
			})
		},
		{
			name: 'dd',
			timeout: 5000,
			runTest: test({
				id: ['item-1-3-5', 'item-2-2-2']
			}, function(t){
				t.is('item-1', cache.byId('item-1').data.id);
				t.is('item-1-3', cache.byId('item-1-3').data.id);
				t.is('item-1-3-5', cache.byId('item-1-3-5').data.id);
				t.is('item-2', cache.byId('item-2').data.id);
				t.is('item-2-2', cache.byId('item-2-2').data.id);
				t.is('item-2-2-2', cache.byId('item-2-2-2').data.id);
				t.is(4, cache.size());
				t.is(5, cache.size('item-1'));
				t.is(9, cache.size('item-1-3'));
				t.is(9, cache.size('item-2'));
				t.is(4, cache.size('item-2-2'));
			})
		}
	]},
	{name: 'b', funcs: [
		{
			name: 'aa',
			timeout: 5000,
			runTest: test(0, function(t){
				t.is('item-1', cache.byIndex(0).data.id);
				t.is('item-1', cache.byId('item-1').data.id);
				t.is(4, cache.size());
			})
		},
		{
			name: 'bb',
			timeout: 5000,
			runTest: test({parentId: 'item-2', start: 1, count: 2}, function(t){
				t.is('item-2-2', cache.byIndex(1, 'item-2').data.id);
				t.is('item-2-3', cache.byIndex(2, 'item-2').data.id);
				t.is(4, cache.size());
			})
		},
		{
			name: 'cc',
			timeout: 5000,
			runTest: test([
				{parentId: 'item-1', start: 1, count: 2}, 
				{parentId: 'item-1-2', start: 2, count: 2}
			], function(t){
				t.is('item-1-2', cache.byIndex(1, 'item-1').data.id);
				t.is('item-1-3', cache.byIndex(2, 'item-1').data.id);
				t.is('item-1-2-3', cache.byIndex(2, 'item-1-2').data.id);
				t.is('item-1-2-4', cache.byIndex(3, 'item-1-2').data.id);
				t.is(4, cache.size());
				t.is(5, cache.size('item-1'));
			})
		},
		{
			name: 'dd',
			timeout: 5000,
			runTest: test([
				{parentIndexPath: [2, 5], start: 1, count: 2},
				{parentId: 'item-4', start: 2, count: 3}
			], function(t){
				t.is('item-3-6-2', cache.byIndex(1, 'item-3-6').data.id);
				t.is('item-3-6-3', cache.byIndex(2, 'item-3-6').data.id);
				t.is('item-4-3', cache.byIndex(2, 'item-4').data.id);
				t.is('item-4-4', cache.byIndex(3, 'item-4').data.id);
				t.is(4, cache.size());
				t.is(7, cache.size('item-3'));
				t.is(9, cache.size('item-3-6'));
				t.is(6, cache.size('item-4'));
			})
		}
	]}
];

var registerDoh = function(ts){
	doh.register(ts.name, ts.funcs);
};
registerDoh(testSets[0]);
registerDoh(testSets[1]);

});

