define([
	'dojo/_base/declare',
	'gridx/core/model/AsyncCache',
	'gridx/tests/ut/utcommon'
], function(declare, 
Cache, doh){

doh.prefix = 'AsyncCache.';
doh.ts('_mergeRanges');

//Blackbox tests
doh.td('sorted single indexes', function(t){
	var mergeRanges = Cache.prototype._mergeRanges;
	var args = {range: [
		{start: 0, count: 1},
		{start: 1, count: 1},
		{start: 2, count: 1},
		{start: 3, count: 1},
		{start: 4, count: 1},
		{start: 5, count: 1},
		{start: 6, count: 1},
		{start: 7, count: 1}
	]};
	args = mergeRanges(args);
	t.is(1, args.range.length);
	t.is(0, args.range[0].start);
	t.is(8, args.range[0].count);
});

doh.td('reverse sorted single indexes', function(t){
	var mergeRanges = Cache.prototype._mergeRanges;
	var args = {range: [
		{start: 7, count: 1},
		{start: 6, count: 1},
		{start: 5, count: 1},
		{start: 4, count: 1},
		{start: 3, count: 1},
		{start: 2, count: 1},
		{start: 1, count: 1},
		{start: 0, count: 1}
	]};
	args = mergeRanges(args);
	t.is(1, args.range.length);
	t.is(0, args.range[0].start);
	t.is(8, args.range[0].count);
});

doh.td('overlay two ranges', function(t){
	var mergeRanges = Cache.prototype._mergeRanges;
	var args = {range: [
		{start: 0, count: 50},
		{start: 10, count: 50}
	]};
	args = mergeRanges(args);
	t.is(1, args.range.length);
	t.is(0, args.range[0].start);
	t.is(60, args.range[0].count);
});

doh.td('reverse overlay two ranges', function(t){
	var mergeRanges = Cache.prototype._mergeRanges;
	var args = {range: [
		{start: 20, count: 50},
		{start: 10, count: 30}
	]};
	args = mergeRanges(args);
	t.is(1, args.range.length);
	t.is(10, args.range[0].start);
	t.is(60, args.range[0].count);
});

doh.td('overlay half close ranges', function(t){
	var mergeRanges = Cache.prototype._mergeRanges;
	var args = {range: [
		{start: 20},
		{start: 10, count: 30}
	]};
	args = mergeRanges(args);
	t.is(1, args.range.length);
	t.is(10, args.range[0].start);
	t.is(null, args.range[0].count);
});

doh.td('partly overlay half close ranges', function(t){
	var mergeRanges = Cache.prototype._mergeRanges;
	var args = {range: [
		{start: 0},
		{start: 10, count: 30}
	]};
	args = mergeRanges(args);
	t.is(1, args.range.length);
	t.is(0, args.range[0].start);
	t.is(null, args.range[0].count);
});

doh.td('two half close ranges', function(t){
	var mergeRanges = Cache.prototype._mergeRanges;
	var args = {range: [
		{start: 0},
		{start: 10}
	]};
	args = mergeRanges(args);
	t.is(1, args.range.length);
	t.is(0, args.range[0].start);
	t.is(null, args.range[0].count);
});

//Whitebox tests
doh.td('1', function(t){
	var mergeRanges = Cache.prototype._mergeRanges;
	var args = {range: []};
	args = mergeRanges(args);
	t.is(0, args.range.length);
});

doh.td('2', function(t){
	var mergeRanges = Cache.prototype._mergeRanges;
	var args = {range: [
		{start: 10, count: 10},
		{start: 5, count: 10}
	]};
	args = mergeRanges(args);
	t.is(1, args.range.length);
	t.is(5, args.range[0].start);
	t.is(15, args.range[0].count);
});

doh.td('3', function(t){
	var mergeRanges = Cache.prototype._mergeRanges;
	var args = {range: [
		{start: 10, count: 10},
		{start: 5, count: 5}
	]};
	args = mergeRanges(args);
	t.is(1, args.range.length);
	t.is(5, args.range[0].start);
	t.is(15, args.range[0].count);
});

doh.td('4', function(t){
	var mergeRanges = Cache.prototype._mergeRanges;
	var args = {range: [
		{start: 10, count: 10},
		{start: 5, count: 2}
	]};
	args = mergeRanges(args);
	t.is(2, args.range.length);
	t.is(5, args.range[0].start);
	t.is(2, args.range[0].count);
	t.is(10, args.range[1].start);
	t.is(10, args.range[1].count);
});

doh.td('5', function(t){
	var mergeRanges = Cache.prototype._mergeRanges;
	var args = {range: [
		{start: 10, count: 10},
		{start: 5}
	]};
	args = mergeRanges(args);
	t.is(1, args.range.length);
	t.is(5, args.range[0].start);
	t.is(null, args.range[0].count);
});

doh.td('6', function(t){
	var mergeRanges = Cache.prototype._mergeRanges;
	var args = {range: [
		{start: 10},
		{start: 5, count: 5}
	]};
	args = mergeRanges(args);
	t.is(1, args.range.length);
	t.is(5, args.range[0].start);
	t.is(null, args.range[0].count);
});

doh.td('7', function(t){
	var mergeRanges = Cache.prototype._mergeRanges;
	var args = {range: [
		{start: 5, count: 10},
		{start: 10, count: 2}
	]};
	args = mergeRanges(args);
	t.is(1, args.range.length);
	t.is(5, args.range[0].start);
	t.is(10, args.range[0].count);
});

///////////////////////////////////////////////////////
doh.ts('_findMissingIndexes');

var findMissingIndexes = Cache.prototype._findMissingIndexes;
//Blackbox test
doh.td('1', function(t){
	var c = {
		_indexMap: [],
		totalCount: -1
	};
	var args = {range: [
		{start: 5, count: 10}
	]};
	args = findMissingIndexes.call(c, args);
	t.is(1, args.range.length);
	t.is(5, args.range[0].start);
	t.is(10, args.range[0].count);
});

doh.td('2', function(t){
	var c = {
		_indexMap: [],
		totalCount: -1
	};
	var args = {range: [
		{start: 5}
	]};
	args = findMissingIndexes.call(c, args);
	t.is(1, args.range.length);
	t.is(5, args.range[0].start);
	t.is(null, args.range[0].count);
});

doh.td('3', function(t){
	var map = [];
	var c = {
		_indexMap: map,
		totalCount: -1
	};
	map[10] = 1;
	var args = {range: [
		{start: 5, count: 20}
	]};
	args = findMissingIndexes.call(c, args);
	t.is(2, args.range.length);
	t.is(5, args.range[0].start);
	t.is(5, args.range[0].count);
	t.is(11, args.range[1].start);
	t.is(14, args.range[1].count);
});

/////////////////////////////////////////////////////////
//doh.ts('_connectRanges');
//doh.ts('_minus');

//doh.td('1', function(t){
//});

doh.go(
	'_mergeRanges',
	'_findMissingIndexes',
0);
});

