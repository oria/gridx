// wrapped by build app
define("dojox/data/demos/widgets/FlickrViewList", ["dojo","dijit","dojox","dojo/require!dojox/dtl/_Templated,dijit/_Widget"], function(dojo,dijit,dojox){
dojo.provide("dojox.data.demos.widgets.FlickrViewList");
dojo.require("dojox.dtl._Templated");
dojo.require("dijit._Widget");

dojo.declare("dojox.data.demos.widgets.FlickrViewList",
	[ dijit._Widget, dojox.dtl._Templated ],
	{
		store: null,
		items: null,

		templateString: dojo.cache("dojox", "data/demos/widgets/templates/FlickrViewList.html", "{% load dojox.dtl.contrib.data %}\r\n{% bind_data items to store as flickr %}\r\n<div dojoAttachPoint=\"list\">\r\n\t{% for item in flickr %}\r\n\t<div style=\"display: inline-block; align: top;\">\r\n\t\t<h5>{{ item.title }}</h5>\r\n\t\t<a href=\"{{ item.link }}\" style=\"border: none;\">\r\n\t\t\t<img src=\"{{ item.imageUrlMedium }}\">\r\n\t\t</a>\r\n\t\t<p>{{ item.author }}</p>\r\n\r\n\t\t<!--\r\n\t\t<img src=\"{{ item.imageUrl }}\">\r\n\t\t<p>{{ item.imageUrl }}</p>\r\n\t\t<img src=\"{{ item.imageUrlSmall }}\">\r\n\t\t-->\r\n\t</div>\r\n\t{% endfor %}\r\n</div>\r\n\r\n"),
	
		fetch: function(request){
			request.onComplete = dojo.hitch(this, "onComplete");
			request.onError = dojo.hitch(this, "onError");
			return this.store.fetch(request);
		},

		onError: function(){
			console.trace();
			this.items = [];
			this.render();
		},

		onComplete: function(items, request){
			this.items = items||[];
			this.render();
		}
	}
);

});
