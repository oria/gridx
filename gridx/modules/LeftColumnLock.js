define('dojox/grid/gridx/modules/LeftColumnLock', [
'dojo',
'dojox/grid/gridx/core/_Module'
], function(dojo, _Module){
	
dojo.declare('dojox.grid.gridx.modules.LeftColumnLock', _Module, {
	name: 'leftColumnLock',
	count: 0,	//locked columns count
	required: ['body'],
	load: function(args, deferLoadFinish, deferStartup){
		var _this = this, g = this.grid, body = dojo.body();
		deferStartup.then(function(){
			console.debug('left column lock loaded');
			_this.bodyNode = dojo.create('div', {className: 'dojoxGridxLeftColumnLockNode'}, g.mainNode, 'last');
			_this.bodyNode.style.display = 'none';
			_this.connect(g.body, 'onChange', '_sync');
			_this.connect(g.bodyNode, 'onscroll', '_sync');
			
			if(_this.grid.header){
				_this.headerNode = dojo.create('div', {className: 'dojoxGridxLeftColumnLockHeaderNode'}, g.header.domNode, 'last');
				var c = _this.grid.columnResizer;
				if(c){
					_this.connect(_this.headerNode, 'mousemove', '_mousemove', c);
					_this.connect(_this.headerNode, 'mouseout', '_mouseout', c);
					_this.connect(_this.headerNode, 'onmousedown', '_mousedown', c);
				}
			}
			
			deferLoadFinish.callback();
		});
	},
	getAPIPath: function(){
		return {
			leftColumnLock: this
		};
	},
	
	lockColumns: function(count){
		this.count = count;
		this._sync();
	},
	unlockColumns: function(){
		this.bodyNode.innerHTML = this.headerNode.innerHTML = '';
		this.bodyNode.style.display = this.headerNode.style.display = 'none';
		this.count = 0;
	},
	
	_sync: function(){
		if(!this.count){return;}
		this._syncBody();
		this._syncHeader();
	},
	_syncHeader: function(){
		var node = this.headerNode, _this = this;
		dojo.style(node, {
			display: 'block',
			position: 'absolute',
			left: 0,
			top: this.grid.header.domNode.offsetTop + 'px'
		});
		node.innerHTML = this._buildHeaderRow();
	},
	_syncBody: function(){
		var node = this.bodyNode, sb = [], _this = this,count = this.count;
		node.innerHTML = '';
		dojo.style(node, {
			display: 'block',
			height: '100%',
			backgroundColor: '#ffffff',
			left: 0,
			top: 0
		});
		dojo.forEach(this.grid.bodyNode.childNodes, function(n){
			sb.push(_this._buildRow(n, count));
		});
		node.innerHTML = sb.join('');
		node.scrollTop = this.grid.bodyNode.scrollTop;
	},
	
	
	_buildRow: function(rowNode){
		//summary:
		//	Build a lock row stub
		var row = rowNode.firstChild.rows[0];
		var r0 = this.grid.bodyNode.childNodes[0].firstChild.rows[0], w = 0, _this = this;
		for(var i = 0; i< this.count; i++){
			w += r0.cells[i].offsetWidth;
		}
		var sb = [];
		sb.push('<div class="dojoxGridxRow" lockrowid="'
			, dojo.attr(rowNode, 'rowid'), '" style="height: ', dojo.style(rowNode, 'height'), 'px; width: '
			, w, 'px"><table style="height:100%"><tr>');
		for(var i = 0; i < this.count; i++){
			var cell = row.cells[i];
			sb.push('<td lockcolid="' + dojo.attr(cell, 'colid') + '" style="width: ', dojo.style(cell, 'width'), 'px">');
			sb.push(cell.innerHTML, '</td>');
		}
		sb.push('</tr></table></div>');
		return sb.join('');
	},
	
	_buildHeaderRow: function(){
		//summary:
		//	Build a lock header row stub
		var rowNode = this.grid.header.domNode;
		var tr = rowNode.firstChild.rows[0], w = 0, _this = this;
		
		for(var i = 0; i< this.count; i++){
			w += tr.cells[i].offsetWidth;
		}
		var sb = [];
		sb.push('<div class="dojoxGridxHeaderRow" lockrowid="'
			, dojo.attr(rowNode, 'rowid'), '" style="height: ', dojo.style(rowNode, 'height'), 'px; width: '
			, w, 'px"><table style="height:100%"><tr>');
		for(var i = 0; i < this.count; i++){
			var cell = tr.cells[i];
			sb.push('<th colid="' + dojo.attr(cell, 'colid') + '" style="width: ', dojo.style(cell, 'width'), 'px">');
			sb.push(cell.innerHTML, '</th>');
		}
		sb.push('</tr></table></div>');
		return sb.join('');
	}

});

return dojox.grid.gridx.modules.LeftColumnLock;
});
