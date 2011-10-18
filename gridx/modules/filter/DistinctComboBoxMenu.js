define([
'dojo',
'dijit',
'dijit/form/_ComboBoxMenu'
], function(dojo, dijit){
	dojo.declare('gridx.modules.filter.DistinctComboBoxMenu', dijit.form._ComboBoxMenu, {
		createOptions: function(results, options, labelFunc){
			var hash = {};
			arguments[0] = results.filter(function(item){
				var label = labelFunc(item).label;
				if(hash[label]){return false;}
				else{return hash[label] = true;}
			});
			this.inherited(arguments);
		}
	});
	return gridx.modules.filter.DistinctComboBoxMenu;
});