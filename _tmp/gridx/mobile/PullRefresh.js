define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/aspect',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojo/query',
	'dojo/i18n!./nls/PullRefresh'
], function(declare, lang, array, aspect, dom, css, query, i18n){
	return declare(null, {
		readyToRefresh: false,
		state: 'normal',
		triggerHeight: 50,
		
		// lastId:
		//		used to store last id value for query, so that server side knows the state of grid
		lastId: null,
		
		buildRendering: function(){
			// summary:
			//		Add pull refresh related ui elements, and connect events to them.
			
			this.inherited(arguments);
			var self = this;
			aspect.before(this.bodyPane, 'slideTo', function(to, duration, easing){
				if((typeof to.y) != "number")return;
				if(to.y == 0 && self.state != 'normal'){
					to.y = self.triggerHeight;
					if(self.state == 'ready'){
						self.loadNew();
						self._setPullRefreshState('loading');
					}
				}
			});
			this.connect(this.bodyPane, 'scrollTo', function(to){
				if((typeof to.y) != "number")return;
				var wrapper = self.pullRefreshWrapper;
				if(to.y == 0){
					if(self.state == 'ready'){}
				}else if(to.y > self.triggerHeight){
					if(self.state == 'normal'){
						self._setPullRefreshState('ready');
					}
				}else{
					if(self.state == 'ready'){
						self._setPullRefreshState('normal');
					}
				}
			});
		},
		loadNew: function(){
			// summary:
			//		Called when pull refresh triggers.
			//		It loads data from server side and create extra rows at the top.
			
			var q = lang.mixin({
				'lastId': this.lastId
			}, this.query);
			this.store.query(q, this.queryOptions).then(
				lang.hitch(this, '_loadNewComplete'), 
				lang.hitch(this, 'onError')
			);
		},
		_loadNewComplete: function(results){
			// summary:
			//		Called after store finishes fetching data from server side.
			
			var items = results.items || results, arr = [];
			if(items.length){
				var rows = query('>.mobileGridxRow', this.bodyPane.containerNode);
				this.lastId = items[0][this.store.idProperty];
				array.forEach(items, function(item){
					arr.push(this._createRow(item));
				}, this);
				dom.place(arr.join(''), this.pullRefreshWrapper, 'after');
			}
			this._setPullRefreshState('normal');
			this.bodyPane.slideTo({y:0});
		},
		_setPullRefreshState: function(state){
			// summary:
			//		Set state of the grid
			// state:
			//		normal|ready|loading
			var wrapper = this.pullRefreshWrapper, labelNode = wrapper.lastChild;
			css.remove(wrapper, 'releaseToRefresh');
			css.remove(wrapper, 'inLoading');
			this.state = state;
			switch(state){
				case 'normal':
					labelNode.innerHTML = i18n.pullToRefresh;
					break;
				case 'ready':
					labelNode.innerHTML = i18n.releaseToRefresh;
					css.add(wrapper, 'releaseToRefresh');
					break;
				case 'loading':
					labelNode.innerHTML = i18n.waitForLoading;
					css.add(wrapper, 'inLoading');
					break;
				default:
					break;
			}
		},

		_buildBody: function(){
			this.inherited(arguments);
			
			//Add an extra node for pull refresh UI
			this.pullRefreshWrapper = dom.create('div', {
				className: 'mobileGridxPullRefreshWrapper'
			}, this.bodyPane.containerNode, 'first');
			this.pullRefreshWrapper.innerHTML = '<img src="'+this._blankGif+'"/><span class="mobileGridxPullRefreshLabel">' + i18n.pullToRefresh + '</span>';
		}
	});
});
