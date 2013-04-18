define([
	'dojo/_base/declare',
	'gridx/core/model/_Extension',
	'gridx/tests/ut/utcommon'
], function(declare, 
_Extension, doh){

doh.prefix = '_Extension.';
doh.ts('_call');

doh.td('existing method without args', function(t){
	var ext = new declare([_Extension], {
		msg: 'ext',
		func: function(){
			return this.msg;
		}
	})({});
	t.is('ext', ext._call('func'));
});

doh.td('existing method with args', function(t){
	var ext = new declare([_Extension], {
		func: function(msg){
			return msg;
		}
	})({});
	t.is('ext', ext._call('func', ['ext']));
});

doh.td('inner method', function(t){
	var model = {};
	var ext1 = new declare([_Extension], {
		func: function(msg){
			return msg;
		}
	})(model);
	var ext2 = new _Extension(model);
	t.is('ext', ext2._call('func', ['ext']));
});

///////////////////////////////////////////////
doh.ts('_mixinAPI');

doh.td('two extra apis', function(t){
	var model = {};
	var ext = new declare([_Extension], {
		func1: function(){
			return 1;
		},
		func2: function(){
			return 2;
		}
	})(model);
	ext._mixinAPI('func1', 'func2');
	t.is(1, model.func1());
	t.is(2, model.func2());
});

doh.go(
    '_call',
	'_mixinAPI',
0);
});

