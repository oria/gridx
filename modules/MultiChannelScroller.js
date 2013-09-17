define([
	'dojo/_base/kernel',
	'dojo/_base/sniff',
	'./AutoPagedBody',
	'./VirtualVScroller',
	'./TouchVScroller'
], function(kernel, has, AutoPagedBody, VirtualVScroller, TouchVScroller){
	kernel.experimental('gridx/modules/MultiChannelScroller');

	return has('ios') || has('android') ? [AutoPagedBody, TouchVScroller] : VirtualVScroller;
});
