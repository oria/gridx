define([
	'./_util',
	'dojo/parser',
	'gridx/allModules'
], function(util, parser, modules){
	
	defaultShow = false;
	showExpando = true;
	useAnimation = true;
	contentType = 'form';
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

	function setTextContent(node){
		// node.innerHTML = '<button data-dojo-type="dijit/form/Button" data-dojo-props="label: 123">cut</button>';
		// dojo.parser.parse(node);

		node.innerHTML = '<div style="color: #777; padding:5px">' 
			+ getDummyText(20,140) + '</div>';
	}
	
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
	
	return [
		{
			title: 'dod',
			guide: [
			],
			cache: "gridx/core/model/cache/Async",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '80px'},
				{id: 'order', field: 'order', name: 'Order', width: '80px'},
				{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px', alwaysEditing: true},
				{id: 'Artist', field: 'Artist', name: 'Artist', width: '120px', editable: true},
				{id: 'Year', field: 'Year', name: 'Year', width: '80px', editable: true},
				{id: 'Album', field: 'Album', name: 'Album', width: '160px', editable: true},
				{id: 'Name', field: 'Name', name: 'Name', width: '150px', alwaysEditing: true},
				{id: 'Length', field: 'Length', name: 'Length', width: '80px', editable: true},
				{id: 'Track', field: 'Track', name: 'Track', width: '80px', editable: true},
				{id: 'Composer', field: 'Composer', name: 'Composer', width: '160px', editable: true},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '160px'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '120px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
			],
			modules: [
				// "gridx/modules/ColumnLock",
				// "gridx/modules/CellWidget",
				// "gridx/modules/Edit",
				// "gridx/modules/ColumnResizer",
				"gridx/modules/RowHeader",
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
		
		/*{
			title: 'row lock',
			guide: [
				'Always align with other rows during horizontal scrolling',
				'Locked row should be over unlocked rows when vertical scrolling',
				'RowHeader should align with locked rows during vertical scrolling',
				'unlock rows',
				'Edit some cell in locked row to make it higher, the rows should keep align well',
				'[10910]vertical scroll the grid, rowHeader also be locked and should be align with rows'
			],
			cache: "gridx/core/model/cache/Async",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '80px'},
				{id: 'order', field: 'order', name: 'Order', width: '80px'},
				{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px', alwaysEditing: true},
				{id: 'Artist', field: 'Artist', name: 'Artist', width: '120px', editable: true},
				{id: 'Year', field: 'Year', name: 'Year', width: '80px', editable: true},
				{id: 'Album', field: 'Album', name: 'Album', width: '160px', editable: true},
				{id: 'Name', field: 'Name', name: 'Name', width: '80px', editable: true},
				{id: 'Length', field: 'Length', name: 'Length', width: '80px', editable: true},
				{id: 'Track', field: 'Track', name: 'Track', width: '80px', editable: true},
				{id: 'Composer', field: 'Composer', name: 'Composer', width: '160px', editable: true},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '160px'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '120px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
			],
			modules: [
				"gridx/modules/RowLock",
				"gridx/modules/CellWidget",
				"gridx/modules/Edit",
				"gridx/modules/ColumnResizer",
				"gridx/modules/RowHeader",
				"gridx/modules/SingleSort",
				"gridx/modules/extendedSelect/Cell"
			],
			props: {
				rowLockCount: 1
			},
			onCreated: function(grid){
				var input = util.addInput('text', 1);
				util.addButton('lock', function(){
					var lockCount = parseInt(input.value, 10);
					grid.rowLock.lock(lockCount);
				});
				util.addButton('unlock', function(){
					grid.rowLock.unlock();
				});
			}
		},
		{
			title: 'column lock and row lock',
			guide: [
				'left top cells are both column-locked and row locked.'
			],
			cache: "gridx/core/model/cache/Async",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '80px'},
				{id: 'order', field: 'order', name: 'Order', width: '80px'},
				{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px', alwaysEditing: true},
				{id: 'Artist', field: 'Artist', name: 'Artist', width: '120px'},
				{id: 'Year', field: 'Year', name: 'Year', width: '80px'},
				{id: 'Album', field: 'Album', name: 'Album', width: '160px'},
				{id: 'Name', field: 'Name', name: 'Name', width: '80px'},
				{id: 'Length', field: 'Length', name: 'Length', width: '80px'},
				{id: 'Track', field: 'Track', name: 'Track', width: '80px'},
				{id: 'Composer', field: 'Composer', name: 'Composer', width: '160px'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '160px'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '120px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
			],
			modules: [
				"gridx/modules/RowLock",
				"gridx/modules/ColumnLock",
				"gridx/modules/CellWidget",
				"gridx/modules/Edit",
				"gridx/modules/ColumnResizer",
				"gridx/modules/RowHeader",
				"gridx/modules/SingleSort",
				"gridx/modules/extendedSelect/Cell"
			],
			props: {
				columnLockCount: 1,
				rowLockCount: 1
			},
			onCreated: function(grid){
				util.add('label', {
					innerHTML: 'column lock:'
				});
				var collockInput = util.addInput('text', 1);
				util.addButton('lock', function(){
					var lockCount = parseInt(collockInput.value, 10);
					grid.columnLock.lock(lockCount);
				});
				util.addButton('unlock', function(){
					grid.columnLock.unlock();
				});
				util.add('br');

				util.add('label', {
					innerHTML: 'row lock:'
				});
				var rowlockInput = util.addInput('text', 1);
				util.addButton('lock', function(){
					var lockCount = parseInt(rowlockInput.value, 10);
					grid.rowLock.lock(lockCount);
				});
				util.addButton('unlock', function(){
					grid.rowLock.unlock();
				});
			}
		}*/
	];
});
