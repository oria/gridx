define([
	'dojo/_base/sniff',
	'./AutoPagedBody',
	'./VirtualVScroller',
	'./TouchVScroller'
], function(has, AutoPagedBody, VirtualVScroller, TouchVScroller){

	return has('ios') || has('android') ? [AutoPagedBody, TouchVScroller] : VirtualVScroller;
});
