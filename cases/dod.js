define([
	'./_util',
	'dojo/parser',
	'gridx/allModules',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore'
], function(util, parser, modules, Grid, Cache, dataSource, storeFactory){
	
	defaultShow = false;
	showExpando = true;
	useAnimation = true;
	contentType = 'form';
	var isP = true;
	
	
	//dod support functions
	detailProvider = asyncDetailProvider = function(grid, rowId, detailNode, renderred){
		setContent(detailNode);
		window.setTimeout(function(){
			renderred.callback();
		}, 2000);
		return renderred;
	};
	syncDetailProvider = function(grid, rowId, detailNode, renderred){
		setContent(detailNode);
		renderred.callback();
		return renderred;
	};
	function setContent(node){
		switch(contentType){
			case 'text':
				setTextContent(node);
				break;
			case 'form':
				setFormContent(node);
				break;
			case 'chart':
				setChartContent(node);
				break;
			default:
				alert('error: unkonw content type: ' + contentType);
				break;
		}
	}

	/*function setTextContent(node){
		// node.innerHTML = '<button data-dojo-type="dijit/form/Button" data-dojo-props="label: 123">cut</button>';
		// dojo.parser.parse(node);

		node.innerHTML = '<div style="color: #777; padding:5px">' + getDummyText(20,140) + '</div>';
	}*/
	
	function setFormContent(node){
		node.innerHTML = ['<div style="margin: 10px; background:white;padding: 10px;"><table style="width:400px">',
				'<tr>',
				'	<td><label for="name">Name:</label></td>',
				'	<td><input data-dojo-type="dijit.form.ValidationTextBox"',
				'		data-dojo-props=\'required:true, name:"name" \'/></td>',
				'</tr>',
				'<tr id="newRow" style="display: none;">',
				'	<td><label for="lastName">Last Name:</label></td>',
				'	<td><input /></td>',
				'</tr>',
				'<tr>',
				'	<td><label for="birth">Birthdate (before 2006-12-31):</label></td>',
				'	<td><div><input data-dojo-type="dijit.form.DateTextBox" data-dojo-props=\'value:"2000-01-01",',
				'		required:true, name:"birth", constraints:{min:"1900-01-01", max:"2006-12-31"} \'/> <br>',
				'	</div></td>',
				'</tr>',
				'<tr>',
				'	<td><label for="notes">Notes (optional)</label></td>',
				'	<td><input data-dojo-type="dijit.form.TextBox"',
				'		data-dojo-props=\'name:"notes" \'/></td>',
				'</tr>',
				'<tr id="newRow2" style="display: none;">',
				'	<td><label for="color">Favorite Color</label></td>',
				'	<td><select id="color">',
				'		<option value="red">Red</option>',
				'		<option value="yellow">Yellow</option>',
				'		<option value="blue">Blue</option>',
				'	</select></td>',
				'</tr>',
			'</table></div>'].join('');
		parser.parse(node);
	}
	
	
	//dod nested grid support functions
	globalCache = Cache;
	globalStore = storeFactory({
				dataSource: dataSource, 
				size: 50
	});
//    globalStructure = dataSource.layouts[1].slice(10);
	globalStructure =[
			{id: 'inner-id', field: 'id', name: 'Identity', dataType: 'number'},
			{id: 'inner-Genre', field: 'Genre', name: 'Genre', dataType: 'enum',
				enumOptions: ['a', 'b', 'c']},
			{id: 'inner-Artist', field: 'Artist', name: 'Artist', dataType: 'string'},
			{id: 'inner-Album', field: 'Album', name: 'Album', dataType: 'string'},
			{id: 'inner-Name', field: 'Name', name: 'Name', dataType: 'string'},
			{id: 'inner-Year', field: 'Year', name: 'Year', dataType: 'number'},
			{id: 'inner-Length', field: 'Length', name: 'Length', dataType: 'string'},
			{id: 'inner-Track', field: 'Track', name: 'Track', dataType: 'number'}
	];
	
	nestedDetailProvider = nestedAsyncDetailProvider = function(grid, rowId, detailNode, renderred){
		setNestedContent(detailNode, renderred);
		return renderred;
	};
	
	window.syncDetailProvider = function(grid, rowId, detailNode, renderred){
		setContent(detailNode);
		renderred.callback();
		return renderred;
	};
	
	function setNestedContent(node, renderred){
		switch(contentType){
			case 'text':
				setTextContent(node, renderred);
				break;
			case 'form':
				if(!isP){
					setFormContentDeclaritively(node, renderred);
				}else{
					setFormContentProgrammatically(node, renderred);
				}
				break;
			case 'chart':
				setChartContent(node, renderred);
				break;
			default:
				alert('error: unkonw content type: ' + contentType);
				break;
		}
	}
	
	function setTextContent(node, renderred){
		// node.innerHTML = '<button data-dojo-type="dijit/form/Button" data-dojo-props="label: 123">cut</button>';
		// dojo.parser.parse(node);
		
		node.innerHTML = '<div style="color: #777; padding:5px">' + getDummyText(20,140) + '</div>';
		
		if(renderred){
			renderred.callback();
		}
	}
	function setFormContentProgrammatically(node, renderred){
		var rowNode = node.parentNode;
		var rowId = rowNode.getAttribute('rowid');
		
//        if(rowId % 2){		//odd
//            var num = 3;
//            var width = (100 / num - 1) + '%';
//            
//            for(var i = 0; i < num; i++){
//                var grid = new Grid({
//                    cacheClass:globalCache,
//                    store: globalStore,
//                    structure: globalStructure,
//                    modules: [	'gridx/modules/Pagination',
//                                'gridx/modules/pagination/PaginationBar',
//                                'gridx/modules/RowHeader',
//                                'gridx/modules/Filter',
//                                'gridx/modules/filter/FilterBar'
//                    ],
//                    style: 'width: ' + width + '; float: left'
//                });
//                grid.placeAt(node);
//                grid.startup();
//            }
//            
//        }else{		//even
			var subSt = new Date().getTime();
			var grid = new Grid({
				cacheClass:globalCache,
				store: globalStore,
				structure: globalStructure,
				modules: [
					'gridx/modules/Pagination',
					'gridx/modules/pagination/PaginationBar',
					'gridx/modules/RowHeader',
					'gridx/modules/IndirectSelect',
					'gridx/modules/select/Row',
					'gridx/modules/Filter',
					'gridx/modules/filter/FilterBar'
				],
				selectRowTriggerOnCell: true,
				style: 'height: 200px; width: 100%;'
			});
			grid.placeAt(node);
			grid.startup();		
			console.log('sub grid start time is:');
			console.log(new Date().getTime() - subSt);
//        }
		setTimeout(function(){
			renderred.callback();
		}, 1000);
	}
	function nestedGridProvider(grid, rowId, detailNode, renderred){
		var g = new Grid({
			cacheClass:globalCache,
			store: storeFactory({
				dataSource: dataSource,
				size: 2
			}),
			structure: [
				{id: 'inner-id', field: 'id', name: 'Identity', dataType: 'number'},
				{id: 'inner-Artist', field: 'Artist', name: 'Artist', dataType: 'string'},
				{id: 'inner-Album', field: 'Album', name: 'Album', dataType: 'string'},
				{id: 'inner-Name', field: 'Name', name: 'Name', dataType: 'string'},
				{id: 'inner-Year', field: 'Year', name: 'Year', dataType: 'number'},
				{id: 'inner-Length', field: 'Length', name: 'Length', dataType: 'string'},
				{id: 'inner-Track', field: 'Track', name: 'Track', dataType: 'number'}
			],
			modules: [
			],
			headerHidden: true,
			autoHeight: true,
			selectRowTriggerOnCell: true,
			style: 'width: 100%;'
		});
		g.placeAt(detailNode);
		g.startup();
		setTimeout(function(){
			renderred.callback();
		}, 1000);
		return renderred;
	}
	
	function setFormContentDeclaritively(node, renderred){
		node.innerHTML = [
			'<div style="margin: 10px; background:white;padding: 10px;"><table style="width:400px">',
				'<tr>',
				'	<td><label for="name">Name:</label></td>',
				'	<td><input data-dojo-type="dijit.form.ValidationTextBox"',
				'		data-dojo-props=\'required:true, name:"name" \'/></td>',
				'</tr>',
				'<tr id="newRow" style="display: none;">',
				'	<td><label for="lastName">Last Name:</label></td>',
				'	<td><input /></td>',
				'</tr>',
				'<tr>',
				'	<td><label for="birth">Birthdate (before 2006-12-31):</label></td>',
				'	<td><div><input data-dojo-type="dijit.form.DateTextBox" data-dojo-props=\'value:"2000-01-01",',
				'		required:true, name:"birth", constraints:{min:"1900-01-01", max:"2006-12-31"} \'/> <br>',
				'	</div></td>',
				'</tr>',
				'<tr>',
				'	<td><label for="notes">Notes (optional)</label></td>',
				'	<td><input data-dojo-type="dijit.form.TextBox"',
				'		data-dojo-props=\'name:"notes" \'/></td>',
				'</tr>',
				'<tr id="newRow2" style="display: none;">',
				'	<td><label for="color">Favorite Color</label></td>',
				'	<td><select id="color">',
				'		<option value="red">Red</option>',
				'		<option value="yellow">Yellow</option>',
				'		<option value="blue">Blue</option>',
				'	</select></td>',
				'</tr>',
			'</table></div>',
			// '<div style="height: 300px"></div>',
			// '<table><tr><td>',
			'<div data-dojo-type="gridx/Grid" style="width: 49%; float: left"',
			'			data-dojo-props="cacheClass:globalCache,',
			'							store: globalStore,',
			'							structure: globalStructure,',
			'							modules: [',
			'								\'gridx/modules/Pagination\',',
			'								\'gridx/modules/pagination/PaginationBar\',',
			'								\'gridx/modules/RowHeader\'',
			']"></div>',
			// '</td>',
			// '<td>',
			'<div data-dojo-type="gridx/Grid" style="width: 49%; float: left"',
			'			data-dojo-props="cacheClass:globalCache,',
			'							store: globalStore,',
			'							structure: globalStructure,',
			'							modules: [',
			'								\'gridx/modules/Pagination\',',
			'								\'gridx/modules/pagination/PaginationBar\',',
			'								\'gridx/modules/RowHeader\'',
			']"></div>'
			// '</td></tr></table>'
			].join('');
			
			
			var currentGrid = dijit.registry.byNode(dojo.query(node).closest('.gridx')[0]);
			parser.parse(node).then(function(){
				// var ws = dijit.registry.findWidgets(node);
				// console.log(ws);
				// for(var i = 0; i < ws.length; i++){
					// console.log(i)
					// if(ws[i].domNode.classList.contains('gridx')){
						// var g = ws[i]
						// g.connect(currentGrid.dod, '_detailLoadComplete', function(row){
							// if(node.parentNode == row.node()){
								// g.body.refresh();
								// // g.header.refresh();
								// console.log('body refresh');
							// }
						// })
// 					
					// }
				// }
				// setTimeout(function(){
					renderred.callback();
					// setTimeout(function(){
						var gridNodes = dojo.query('.gridx', node);
						var ws = [];
						for(var i = 0; i < gridNodes.length; i++){
							var w = dijit.byNode(gridNodes[i]);
							ws.push(w);
							console.log(w.body);
							w.body.refresh();
							console.log(w.domNode);
						}
						console.log(ws.domNode);
						
					// }, 0)
					
				// }, 2000)
			});
	}
	
	
	
	return [
		{
			title: 'dod',
			guide: [
			],
			cache: "gridx/core/model/cache/Async",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'order', field: 'order', name: 'Order'},
				{id: 'Genre', field: 'Genre', name: 'Genre'},
				{id: 'Artist', field: 'Artist', name: 'Artist'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Album', field: 'Album', name: 'Album'},
				{id: 'Name', field: 'Name', name: 'Name'}
			],
			modules: [
				// "gridx/modules/ColumnLock",
				// "gridx/modules/CellWidget",
				// "gridx/modules/Edit",
				// "gridx/modules/ColumnResizer",
				"gridx/modules/RowHeader",
				"gridx/modules/select/Row",
				"gridx/modules/IndirectSelect",
				// "gridx/modules/SingleSort",
				// "gridx/modules/extendedSelect/Cell",
				{
					moduleClass: modules.Dod,
					defaultShow: defaultShow,
					useAnimation: useAnimation,
					showExpando: showExpando,
					detailProvider: detailProvider
				},
				"gridx/modules/VirtualVScroller"
			],
			props: {
				selectRowTriggerOnCell: true,
				columnLockCount: 1
			},
			onCreated: function(grid){
				var input = util.addInput('text', 1);
				util.addButton('show detail', function(){
					var rowId = parseInt(input.value, 10);
					grid.dod.show(grid.row(rowId, 1));
				});
				util.addButton('hide detail', function(){
					var rowId = parseInt(input.value, 10);
					grid.dod.hide(grid.row(rowId, 1));
				});
			}
		},
		{
			title: 'dod nested grid',
			guide: [
			],
			cache: "gridx/core/model/cache/Async",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'order', field: 'order', name: 'Order'},
				{id: 'Genre', field: 'Genre', name: 'Genre'},
				{id: 'Artist', field: 'Artist', name: 'Artist'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Album', field: 'Album', name: 'Album'},
				{id: 'Name', field: 'Name', name: 'Name'}
			],
			modules: [
				// "gridx/modules/ColumnLock",
				// "gridx/modules/CellWidget",
				// "gridx/modules/Edit",
				// "gridx/modules/ColumnResizer",
				"gridx/modules/RowHeader",
				"gridx/modules/select/Row",
				"gridx/modules/IndirectSelect",
				// "gridx/modules/SingleSort",
				// "gridx/modules/extendedSelect/Cell",
				{
					moduleClass: modules.Dod,
					defaultShow: defaultShow,
					useAnimation: useAnimation,
					showExpando: showExpando,
					detailProvider: nestedDetailProvider
				},
				"gridx/modules/VirtualVScroller"
			],
			props: {
			},
			onCreated: function(grid){
				var input = util.addInput('text', 1);
				util.addButton('show detail', function(){
					var rowId = parseInt(input.value, 10);
					grid.dod.show(grid.row(rowId, 1));
				});
				util.addButton('hide detail', function(){
					var rowId = parseInt(input.value, 10);
					grid.dod.hide(grid.row(rowId, 1));
				});
			}
		},
		{
			title: 'dod nested grid autoHeight headerHidden',
			guide: [
			],
			cache: "gridx/core/model/cache/Async",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'order', field: 'order', name: 'Order'},
				{id: 'Genre', field: 'Genre', name: 'Genre'},
				{id: 'Artist', field: 'Artist', name: 'Artist'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Album', field: 'Album', name: 'Album'},
				{id: 'Name', field: 'Name', name: 'Name'}
			],
			modules: [
				// "gridx/modules/ColumnLock",
				// "gridx/modules/CellWidget",
				// "gridx/modules/Edit",
				// "gridx/modules/ColumnResizer",
//                "gridx/modules/RowHeader",
//                "gridx/modules/select/Row",
//                "gridx/modules/IndirectSelect",
				// "gridx/modules/SingleSort",
				// "gridx/modules/extendedSelect/Cell",
				{
					moduleClass: modules.Dod,
					defaultShow: defaultShow,
					useAnimation: useAnimation,
					showExpando: true,
					detailProvider: nestedGridProvider
				},
				"gridx/modules/VirtualVScroller"
			],
			props: {
			},
			onCreated: function(grid){
				var input = util.addInput('text', 1);
				util.addButton('show detail', function(){
					var rowId = parseInt(input.value, 10);
					grid.dod.show(grid.row(rowId, 1));
				});
				util.addButton('hide detail', function(){
					var rowId = parseInt(input.value, 10);
					grid.dod.hide(grid.row(rowId, 1));
				});
			}

		}
	];
});
