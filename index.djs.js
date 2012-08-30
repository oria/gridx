define([
	'dojo/_base/declare'
	,'dojos/PageContext'
	,'dojo/text!./header.html'
	,'dojo/text!./footer.html'
], function(declare, PageContext, header, footer){
    return declare(null, {
    	getText: function(){
    		
    	}
        ,getContext: function(){
        	var context = {
        		header: header
        		,footer: footer
        	};
        	return context;
        }
    });
});