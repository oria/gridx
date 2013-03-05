define([
	"dojo/dom-construct",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/request/iframe"
],function(domConstruct, declare, lang, arrayUtil, request){
	

	return declare("dojox.form.uploader._IFrame", [], {
		// summary:
		//		A mixin for dojox/form/Uploader that adds Ajax upload capabilities via an iframe.
		//
		// description:
		//		Only supported by IE, due to the specific iFrame hack used.  Progress events are not
		//		supported.
		//		
		//
	
		postMixInProperties: function(){
			this.inherited(arguments);
			if(this.uploadType === "iframe"){
				this.uploadType = "iframe";
				this.upload = this.uploadIFrame;
			}
		},
	
		uploadIFrame: function(data){
			// summary:
			//		Internal. You could use this, but you should use upload() or submit();
			//		which can also handle the post data.
	
			var form, destroyAfter = false;
			data.uploadType = this.uploadType;
			if(!this.getForm()){
				//enctype can't be changed once a form element is created
				form = domConstruct.place('<form enctype="multipart/form-data" method="post"></form>', this.domNode);
				arrayUtil.forEach(this._inputs, function(n, i){
					if(n.value) form.appendChild(n);
				}, this);
				destroyAfter = true;
			}else{
				form = this.form;
			}
	
			var url = this.getUrl();
			var self = this;
			request.post(url, {
				form: form,
				handleAs: "json",
				content: data
			}).then(function(result){
				if(destroyAfter){ domConstruct.destroy(form); }
				if(data["ERROR"] || data["error"]){
					self.onError(result);
				}else{
					self.onComplete(result);
				}
			}, function(err){
				console.error('error parsing server result', err);
				if(destroyAfter){ domConstruct.destroy(form); }
				self.onError(err);
			});
		}
	});
});
