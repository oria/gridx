define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/_base/html',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	"dojo/text!./ModelPerfMeter.html"
], function(declare, array, html, _Widget, _TemplatedMixin, template){

return declare([_Widget, _TemplatedMixin], {
	templateString: template,
	size: 100,
	model: null,
	fetchCount: 0,
	whenCount: 0,
	hitCount: 0,
	missCount: 0,
	postCreate: function(){
		this.connect(this.model._cache, 'onAfterFetch', '_createCacheTable');
		this.connect(this.model._cache, '_checkSize', '_createCacheTable');
//        this.connect(this.model._cache, '_connectRanges', '_createCacheTable');
		this.connect(this.model._cache, '_storeFetch', '_updateFetchCount');
		this.connect(this.model._cache, 'when', '_updateWhenCount');
		this.connect(this.model._cache, '_mergePendingRequests', '_updatePendingRequestCount');
		this.connect(this.model._cache, '_finish', '_updatePendingRequestCount');
		var moniter = this;
//        this.model._cache._findMissingIndexes = function(args){
//            var i, j, r, end, newRange, ranges = [], cache = this._cache,
//                indexMap = this._struct[''],
//                totalSize = this._size[''];
//            for(i = args.range.length - 1; i >= 0; --i){
//                r = args.range[i];
//                end = r.count ? r.start + r.count : indexMap.length - 1;
//                newRange = 1;
//                for(j = r.start; j < end; ++j){
//                    var id = indexMap[j + 1];
//                    if(id === undefined || !cache[id]){
//                        moniter._updateMissCount();
//                        if(newRange){
//                            ranges.push({
//                                start: j,
//                                count: 1
//                            });
//                        }else{
//                            ++ranges[ranges.length - 1].count;
//                        }
//                        newRange = 0;
//                    }else{
//                        moniter._updateHitCount();
//                        newRange = 1;
//                    }
//                }
//                if(!r.count){
//                    if(!newRange){
//                        delete ranges[ranges.length - 1].count;
//                    }else if(totalSize < 0 || j < totalSize){
//                        ranges.push({
//                            start: j
//                        });
//                    }
//                }
//            }
//            args.range = ranges;
//            return args;
//        };
	},
	startup: function(){
		this.inherited(arguments);
		this._createCacheTable();
		this.clear();
	},
	_createCacheRow: function(rowIdx, totalWidth){ 
		var indexes = {};
		array.forEach(this.model._cache._requests, function(req){
			array.forEach(req.range, function(r){
				var end = r.count ? r.start + r.count : this.size;
				for(var i = r.start; i < end; ++i){
					indexes[i] = true;
				}
			}, this);
		}, this);
		var start = rowIdx * totalWidth;
		var sb = ['<tr>'];
		for(var i = 0; start + i < this.size && i < totalWidth; ++i){
			var slotIdx = start + i;
			sb.push('<td cacheid="ctd', slotIdx, '" class="', (this.model.byIndex(slotIdx) ? 'dojoxModelPerfCachedSlot' : '') , ' ');
			sb.push((indexes[i] ? 'dojoxModelPerfNewReqSlot' : ''), ' ');
			sb.push('" style="width: ', 1, 'px;">', (slotIdx % 100 ? '' : ('<div style="width: ' + 1 + 'px;">' + slotIdx + '</div>')) ,'</td>');
		}
		sb.push('</tr>');
		return sb.join('');
	},
	_createCacheTable: function(funcs){
		if(this.cacheTableNode.firstChild){
			html.destroy(this.cacheTableNode.firstChild);
		}
		var totalWidth = html.contentBox(this.domNode).w;
		var rowCount = Math.ceil(this.size / totalWidth);
		var sb = ["<table style='width: 100%;' class='dojoxModelPerfCacheTable'>"];
		for(var i = 0; i < rowCount; ++i){
			sb.push(this._createCacheRow(i, totalWidth, funcs || []));
		}
		sb.push("</table>");
		sb = sb.join('');
		this.cacheTableNode.innerHTML = sb;
	},
	_updateFetchCount: function(){
		this.fetchCountNode.innerHTML = ++this.fetchCount;
	},
	_updateWhenCount: function(){
		this.whenCountNode.innerHTML = ++this.whenCount;
	},
	_updatePendingRequestCount: function(){
		this.pendingReqCountNode.innerHTML = this.model._cache._requests.length;
	},
	_updateHitCount: function(){
		this.hitCountNode.innerHTML = ++this.hitCount;
	},
	_updateMissCount: function(){
		this.missCountNode.innerHTML = ++this.missCount;
	},
	clear: function(){
		this.fetchCountNode.innerHTML = this.fetchCount = 0;
		this.whenCountNode.innerHTML = this.whenCount = 0;
		this.hitCountNode.innerHTML = this.hitCount = 0;
		this.missCountNode.innerHTML = this.missCount = 0;
		this.pendingReqCountNode.innerHTML = 0;
	}
});
});
