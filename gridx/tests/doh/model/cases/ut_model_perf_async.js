dojo.provide("gridx.tests.model.ut_model_perf_async");

dojo.require('dojox.data.QueryReadStore');
dojo.require("gridx.core.model.AsyncCache");
dojo.require('gridx.core.model.Mapper');
dojo.require('gridx.core.model.Marker');
dojo.require('gridx.core.model.Model');
dojo.require("doh.runner");

(function(){
var store = new dojox.data.QueryReadStore({
	url: "../../gridx/tests/demoStore.php?datastore=true&totalsize=1000",
	requestMethod: "post"
});

dojo.declare('ModelPerfTest', null, {
	constructor: function(args){
		dojo.mixin(this, args);
		this.results = [];
		this.model = new gridx.core.model.Model({
			isAsync: true,
			store: this.store,
			cacheSize: this.cacheSize,
			pageSize: this.pageSize,
			neighborSize: this.neighborSize,
			modelExtensions: [
				gridx.core.model.Mapper,
				gridx.core.model.Marker
			]
		});
	},
	destroy: function(){
		this.model.destroy();
	},
	randomRange: function(){
		var s = Math.floor(Math.random() * this.total);
		var c = Math.ceil(Math.random() * (this.total - s));
		return {
			start: s,
			count: c
		};
	},
	randomIndex: function(){
		return Math.floor(Math.random() * this.total);
	},
	randomId: function(){
		return Math.floor(Math.random() * this.total) + 1;
	},
	createRequest: function(){
		var req = {
			index: [],
			range: [],
			id: []
		};
		var i;
		for(i = 0; i < this.indexCount; ++i){
			req.index.push(this.randomIndex());
		}
		for(i = 0; i < this.rangeCount; ++i){
			req.range.push(this.randomRange());
		}
		for(i = 0; i < this.idCount; ++i){
			req.id.push(this.randomId());
		}
		return req;
	},
	verify: function(t, req){
		var m = this.model;
		dojo.forEach(req.index, function(i){
			t.is(i + 1, m.byIndex(i).data.id);
		});
		dojo.forEach(req.range, function(r){
			var end = r.count >= 0 ? r.start + r.count : this.total;
			for(var i = r.start; i < end && i < this.total; ++i){
				t.is(i + 1, m.byIndex(i).data.id);
			}
		});
		dojo.forEach(req.id, function(id){
			t.is(id, m.byId(id).data.id);
		});
	},
	singleTest: function(t){
		var fetchCnt = 0, m = this.model, _this = this, 
			reqCount = this.indexCount + this.rangeCount + this.idCount,
			req = this.createRequest();
		var handle = dojo.connect(m._cache, "_storeFetch", function(){
			++fetchCnt;
		});
		return m.when(req, dojo.hitch(this, 'verify', t, req)).then(function(){
			t.is(_this.cacheSize, m._cache._priority.length)
			dojo.disconnect(handle);
			_this.results.push(fetchCnt);
			console.warn("TOTAL FETCH COUNT: ", fetchCnt, ", REQUEST COUNT: ", reqCount,
				", TE: ", (1 - fetchCnt / reqCount) * 100,
				", SE: ", (1 - m._cache.cacheSize / _this.total) * 100);
		});
	},
	test: function(t){
		var cnt = this.sampleCount, _this = this, d = new dojo.Deferred();
		var f = function(){
			if(cnt--){
				_this.singleTest(t).then(f);
			}else{
				var fcnt = _this.getAvgFetchCount();
				var v = _this.getVariance();
				console.warn("### RESULT: AVG FETCH COUNT: ",fcnt,", VARIANCE: ",v);
				d.callback();
			}
		};
		f();
		return d;
	},
	getAvgFetchCount: function(){
		var sum = 0;
		dojo.forEach(this.results, function(cnt){
			sum += cnt;
		});
		return sum / this.results.length;
	},
	getVariance: function(){
		var u = this.getAvgFetchCount();
		var sum = 0;
		dojo.forEach(this.results, function(cnt){
			sum += (cnt - u) * (cnt - u);
		});
		return Math.sqrt(sum / this.results.length); 
	}
});
var testSets = [
	{name: "ModelAscynPerformance", funcs: [
		{
			name: "testCleanModelPerf",
			timeout: 100000000,
			runTest: function(t){
				var d = new doh.Deferred();
				var tt = new ModelPerfTest({
					store: store,
					cacheSize: 200,
					pageSize: 200,
					neighborSize: 100,
					//----------------
					total: 1000,
					indexCount: 10,
					rangeCount: 10,
					idCount: 10,
					sampleCount: 50
				});
				tt.test(t).then(function(){
					tt.destroy();
					d.callback(true);
				});
				return d;
			}
		}
	]}
];
var registerDoh = function(ts){
	doh.register(ts.name, ts.funcs);
};
registerDoh(testSets[0]);

})();
