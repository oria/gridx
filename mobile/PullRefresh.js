define([
	'dojo/_base/declare',
	'dojo/aspect',
	'dojo/dom-construct',
	'dojo/dom-class'
], function(declare, aspect, dom, css){
	return declare(null, {
		readyToRefresh: false,
		state: 'normal',
		triggerHeight: 50,
		maxId: 20,
		queryOptions: {sort: [{attribute: 'id', descending: true}]},
		query: function(item){
			return item.id > 0 && item.id <= 20;
		},
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
			var self = this;
			console.log('loading new...');
			window.setTimeout(function(){
				var arr = [];
				self._queryResults = self.store.query(function(item){
					return item.id > self.maxId && item.id <= self.maxId + 20;
				}, self.queryOptions);
				self._queryResults.forEach(function(item, i){
					arr.push(self._createRow(item, i));
				});
				self.maxId += 20;
				dom.place(arr.join(''), self.pullRefreshWrapper, 'after');
				self._loadComplete();
			}, 2000);
		},
		_loadComplete: function(){
			this._setPullRefreshState('normal');
			this.bodyPane.slideTo({y:0});
		},
		_setPullRefreshState: function(state){
			//summary:
			//	Set state of the grid
			//state:
			//	normal|ready|loading
			var wrapper = this.pullRefreshWrapper, labelNode = wrapper.lastChild;
			css.remove(wrapper, 'releaseToRefresh');
			css.remove(wrapper, 'inLoading');
			this.state = state;
			switch(state){
				case 'normal':
					labelNode.innerHTML = 'Pull to refresh';
					break;
				case 'ready':
					labelNode.innerHTML = 'Release to refresh';
					css.add(wrapper, 'releaseToRefresh');
					break;
				case 'loading':
					labelNode.innerHTML = 'Wait for loading...';
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
			this.pullRefreshWrapper.innerHTML = '<img src="'+this._blankGif+'"/><span class="mobileGridxPullRefreshLabel">Pull to refresh</span>';
		}
	});
});