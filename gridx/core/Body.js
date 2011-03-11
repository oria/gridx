define('dojox/grid/gridx/core/Body', [
'dojo',
'dijit',
'dijit/_Widget',
'dijit/_Templated',
'text!dojox/grid/gridx/templates/body.html'], function(dojo, dijit){
	
dojo.declare('dojox.grid.gridx.core.Body', [dijit._Widget], {
	grid: null,
	postCreate: function(){
		this.inherited(arguments);
		//this.connect(this.model, 'onSet', 'setCellValue');
	},
	clear: function(){
		this.domNode.innerHTML = '';
		this.domNode.scrollTop = 0;
	},
	onChange: function(){},
	renderRows: function(start, count, position/*?top|bottom*/){
		console.debug('body rendering: ', start, count);
		if(count <= 0){
			return;
		}
		var rows, sb = [];
		if(typeof(start) === 'number'){
			rows = this.grid.rows(start, count);
		}
		console.debug('rows length: ', rows.length);
		dojo.forEach(rows, function(row){
			if(!row){
				return;
			}
			sb.push(this._buildRow(row));
		}, this);
		switch(position){
			case 'top':
				dojo.place(sb.join(''), this.domNode, 'first');
				break;
			case 'bottom':
				dojo.place(sb.join(''), this.domNode, 'last');
				break;
			default:
				this.clear();
				this.domNode.innerHTML = sb.join('');
				break;
		}
		this.onChange();
	},
	_buildRow: function(/*row|index*/row){
		if(typeof(row) === 'number'){
			row = this.grid.row(row);
			if(!row){
				return '';
			}
		}
		var sb = ['<div class="dojoxGridxRow" rowid="', row.id, '"><table><tr>'];
		var columns = this.grid.columns();
		for(var i = 0, len = columns.length; i < len; ++i){
			var col = columns[i];
			sb.push('<td style="width: ', col.width, '">');
			var s;
			if(col.template){
				s = col.template.replace(/\$\{([^}]+)\}/ig, function(m, key){
					return row.cell(key, true).data();
				});
			}else{
				s = row.cell(i).data();
			}
			sb.push(s, '</td>');
		}
		sb.push('</tr></table></div>');
		return sb.join('');
	}
});
return dojox.grid.gridx.core.Body;
	
});