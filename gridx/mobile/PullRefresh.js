define([
	'dojo/_base/declare',
	'dojo/dom-construct',
	'dojo/dom-class'
], function(declare, dom, css){
	return declare(null, {
		readyToRefresh: false,
		postMixInProperties: function(){
			this.inherited(arguments);
		},
		buildRendering: function(){
			this.inherited(arguments);
			var self = this;
			this.connect(this.bodyPane, 'scrollTo', function(to){
				if((typeof to.y) != "number")return;
				var wrapper = self.pullRefreshWrapper;
				if(to.y == 0){
					if(self.readyToRefresh){
						console.log('doing refresh now');
						//wrapper.style.top = 0;
						//self.bodyPane.containerNode.style.paddingTop = '60px';
						//to.y = 60;
					}
				}else if(to.y > 60){
					if(!self.readyToRefresh){
						self.readyToRefresh = true;
						wrapper.lastChild.innerHTML = 'Release to refresh now';
						css.add(wrapper, 'releaseToRefresh');
					}
				}else{
					if(self.readyToRefresh){
						self.readyToRefresh = false;
						wrapper.lastChild.innerHTML = 'Pull to refresh';
						css.remove(wrapper, 'releaseToRefresh');
					}
				}
				
				//var t = to.y - 60;
				//wrapper.style.top = t + 'px';
			});
		},
		_buildBody: function(){
			this.inherited(arguments);
			this.pullRefreshWrapper = dom.create('div', {
				className: 'mobileGridxPullRefreshWrapper'
			}, this.bodyPane.containerNode, 'first');
			this.pullRefreshWrapper.innerHTML = '<img src="'+this._blankGif+'"/><span class="mobileGridxPullRefreshLabel">Pull to refresh</span>';
		},
		pullRefresh: function(){
		}
	});
});