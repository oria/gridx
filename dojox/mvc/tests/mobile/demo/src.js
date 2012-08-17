define("dojox/mvc/MobileDemoContactModel", ["dojox/mvc/getStateful"], function(getStateful){
	// module:
	//		dojox/mvc/MobileDemoContactModel
	// summary:
	//		The data model of contact info for this demo.

	return getStateful({
		Serial: "360324",
		First: "John",
		Last: "Doe",
		Email: "jdoe@us.ibm.com",
		ShipTo: {
			Street: "123 Valley Rd",
			City: "Katonah",
			State: "NY",
			Zip: "10536"
		},
		BillTo: {
			Street: "17 Skyline Dr",
			City: "Hawthorne",
			State: "NY",
			Zip: "10532"
		}
	});
});

define("dojox/mvc/MobileDemoContactListModel", ["dojox/mvc/getStateful"], function(getStateful){
	// module:
	//		dojox/mvc/MobileDemoContactListModel
	// summary:
	//		The data model of contact list info for this demo.

	return getStateful([ 
		{
			uniqueId: "0",
			First: "Chad",
			Last: "Chapman",
			Location: "CA",
			Office: "1278",
			Email: "c.c@test.com",
			Tel: "408-764-8237",
			Fax: "408-764-8228"
		},
		{
			uniqueId: "1",
			First: "Irene",
			Last: "Ira",
			Location: "NJ",
			Office: "F09",
			Email: "i.i@test.com",
			Tel: "514-764-6532",
			Fax: "514-764-7300"
		},
		{
			uniqueId: "2",
			First: "John",
			Last: "Jacklin",
			Location: "CA",
			Office: "6701",
			Email: "j.j@test.com",
			Tel: "408-764-1234",
			Fax: "408-764-4321"
		}
	]);
});

define("dojox/mvc/MobileDemoContactController", [
	"dojo/_base/declare",
	"dojox/mvc/EditModelRefController",
	"dojox/mvc/ListController"
], function(declare, EditModelRefController, ListController){
	// module:
	//		dojox/mvc/MobileDemoContactController
	// summary:
	//		The controller for contact info for this demo.

	return declare([EditModelRefController, ListController]);
});

define("dojox/mvc/MobileDemoContactListController", [
	"dojo/_base/declare",
	"dijit/registry",
	"dojox/mvc/getStateful",
	"dojox/mvc/ListController",
	"dojox/mvc/StoreRefController"
], function(declare, registry, getStateful, ListController, StoreRefController){
	// module:
	//		dojox/mvc/MobileDemoContactListController
	// summary:
	//		The controller for contact list info for this demo.

	return declare([ListController, StoreRefController], {
		// summaryScrollableViewId: String
		//		The ID of the scrollable view representing summary (in list).
		summaryScrollableViewId: "",

		// detailScrollableViewId: String
		//		The ID of the scrollable view representing detail (in form).
		detailScrollableViewId: "",

		// initialFocusElementId: String
		//		The ID of the element that should get the focus when list selection switches, etc.
		initialFocusElementId: "",

		setDetailsContext: function(/*String*/ uniqueId){
			// summary:
			//		Called to move to the repeatdetails page when an item is selected on the WidgetList Data Binding page. 
			// uniqueId: String
			//		The ID of the row. 

			this.set("cursorId", uniqueId);
			registry.byId(this.initialFocusElementId).focus();
		},

		addEmpty: function(){
			// summary:
			//		Called to add an empty item when the white plus icon is pressed on the WidgetList Data Binding page. 

			var payload = getStateful({
				uniqueId: "" + Math.random(),
				First: "",
				Last: "",
				Location: "CA",
				Office: "",
				Email: "",
				Tel: "",
				Fax: ""
			});
			this[this._refInModelProp].push(payload);
			this.set("cursor", payload);
			registry.byId(this.summaryScrollableViewId).performTransition(this.detailScrollableViewId, 1, "none");
			registry.byId(this.initialFocusElementId).focus();
		},

		remove: function(/*String*/ uniqueId){
			// summary:
			//		Called to remove an item when the red circle minus icon is pressed on the WidgetList Data Binding page. 

			for(var model = this[this._refInModelProp], i = 0; i < model.length; i++){
				if(model[i][this.idProperty] == uniqueId){
					model.splice(i, 1);
					if(i < this[this._refInModelProp].get("length")){
						this.set("cursorIndex", i);
					}
					return;
				}
			}
		}
	});
});

define("dojox/mvc/MobileDemoGenerateActions", [
	"dojo/dom",
	"dojo/json",
	"dijit/registry"
], function(dom, json, registry){
	// module:
	//		dojox/mvc/MobileDemoGenerateActions
	// summary:
	//		The action handlers for Generate example of this demo.

	return {
		switchToData: function(){
			// summary:
			//		Called when the "Update Model" button is pressed on the Generate View page. 

			dom.byId("outerModelArea").style.display = "";
			try {
				dom.byId("modelArea").focus(); // hack: do this to force focus off of the textbox, bug on mobile?
				dom.byId("viewArea").style.display = "none";
				registry.byId("modelArea").set("value", json.stringify(registry.byId("view").get("children")));
			} catch(e) {
				console.log(e);
			}
		},

		switchToGenerated: function(){
			// summary:
			//		Called when the "Update View" button is pressed on the Generate Simple Form. 

			dom.byId("outerModelArea").style.display = "none";
			dom.byId("viewArea").style.display = "";              		
		}
	};
});

require([
	"dojo/dom",
	"dojo/has",
	"dojox/mobile/parser",
	"dojox/mvc/at",
	"dojox/mvc/Generate",
	"dojox/mvc/Group",
	"dojox/mvc/Output",
	"dojox/mvc/Templated",
	"dojox/mvc/WidgetList",
	"dojox/mvc/_InlineTemplateMixin",
	"dojox/mvc/MobileDemoContactModel",
	"dojox/mvc/MobileDemoContactListModel",
	"dojox/mvc/MobileDemoContactController",
	"dojox/mvc/MobileDemoContactListController",
	"dojox/mvc/MobileDemoGenerateActions",
	"dojox/mobile",
	"dojox/mobile/deviceTheme",
	"dojox/mobile/Button",
	"dojox/mobile/Heading",
	"dojox/mobile/ScrollableView",
	"dojox/mobile/TextArea",
	"dojox/mobile/TextBox",
	"dojo/domReady!"
], function(dom, has, parser, at){
	if(!has("webkit")){
		require(["dojox/mobile/compat"]);
	}
	window.at = at;
	parser.parse();
	dom.byId("wholepage").style.display = "";
});
