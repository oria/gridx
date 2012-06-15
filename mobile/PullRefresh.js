define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/aspect',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojo/i18n!./nls/PullRefresh'
], function(declare, array, aspect, dom, css, i18n){
	return declare(null, {
		readyToRefresh: false,
		state: 'normal',
		triggerHeight: 50,
		maxId: 20,
		queryOptions: {sort: [{attribute: 'id', descending: true}], start: 980, count: 20},
		postMixInProperties: function(){
			this.inherited(arguments);
		},
		buildRendering: function(){
			this.inherited(arguments);
			var self = this;
			aspect.before(this.bodyPane, 'slideTo', function(to, duration, easing){
				if((typeof to.y) != "number")return;
				if(to.y == 0 && self.state != 'normal'){
					to.y = self.triggerHeight;
					if(self.state == 'ready'){
						self._loadNew();
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
		_loadNew: function(){
			var self = this, q = this.query, opt = this.queryOptions;
			console.log('loading new...');
			window.setTimeout(function(){	//time out for demo purpose
				opt.start -= 20;	//every time load 20 rows
				self.store.fetch({
					query: q,
					queryOptions: opt,
					sort: opt && opt.sort || [],
					onComplete: function(items){
						var arr = [];
						array.forEach(items, function(item, i){
							arr.push(self._createRow(item, i));
						});
						dom.place(arr.join(''), self.pullRefreshWrapper, 'after');
						self._loadComplete();
					},
					onError: function(err){
						console.error('Failed to fetch items from store:', err);
					},
					start: opt && opt.start,
					count: opt && opt.count
				});
			}, 1500);
		},
		_loadComplete: function(){
			this._setPullRefreshState('normal');
			this.bodyPane.slideTo({y:0});
		},
		_setPullRefreshState: function(state){
			// summary:
			//	Set state of the grid
			// state:
			//	normal|ready|loading
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
			this.pullRefreshWrapper = dom.create('div', {
				className: 'mobileGridxPullRefreshWrapper'
			}, this.bodyPane.containerNode, 'first');
			this.pullRefreshWrapper.innerHTML = '<img src="'+this._blankGif+'"/><span class="mobileGridxPullRefreshLabel">' + i18n.pullToRefresh + '</span>';
		}
	});
});