define('dojox/grid/gridx/core/Header', ['dojo','dijit','dijit/_Widget'], function(dojo, dijit){
	
dojo.declare('dojox.grid.gridx.core.Header', dijit._Widget, {
	grid: null,
	postCreate: function(){
		this.inherited(arguments);
		this.update();
	},
	
	update: function(){
		var sb = ['<div class="dojoxGridxHeaderRow"><table><tr>'];
		var len = this.grid.columnCount();
		console.debug('column count: ', len);
		for(var i = 0; i < len; i++){
			var col = this.grid.column(i);
			sb.push('<th colid="', col.id, '" style="width: ', col.width, '">');
			sb.push(col.name());
			sb.push('</th>');
		}
		sb.push('</tr></table></div>');
		this.domNode.innerHTML = sb.join('');
		this.rowNode = this.domNode.firstChild;
	},
	resize: function(){}
});	

return dojox.grid.gridx.core.Header;
	
});