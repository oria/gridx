define([
	'dojo/_base/declare',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'dojo/store/Memory',
	'dijit/_Widget',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dijit/form/TextBox',
	'dijit/form/NumberTextBox',
	'dijit/form/CheckBox',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/modules/Focus',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit'
], function(declare, dataSource, storeFactory, Memory, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, TextBox, NumberTextBox){

	store = storeFactory({
		dataSource: dataSource, 
		size: 100
	});

	declare('gridx.tests.CustomEditor', [_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: [
			'<table><tr><td style="width: 100px;">',
				'<label>Composer:</label>',
			'</td><td>',
				'<div data-dojo-type="dijit.form.TextBox" data-dojo-attach-point="composer"></div>',
			'</td></tr><tr><td style="width: 100px;">',
				'<label>Song Name:</label>',
			'</td><td>',
				'<div data-dojo-type="dijit.form.TextBox" data-dojo-attach-point="songName"></div>',
			'</td></tr><tr><td style="width: 100px;">',
				'<label>Year:</label>',
			'</td><td>',
				'<div data-dojo-type="dijit.form.NumberTextBox" data-dojo-attach-point="year"></div>',
			'</td></tr></table>'
		].join(''),
		_setValueAttr: function(value){
			this.composer.set('value', value[0]);
			this.songName.set('value', value[1]);
			this.year.set('value', parseInt(value[2], 10));
		},
		_getValueAttr: function(value){
			return [
				this.composer.get('value'),
				this.songName.get('value'),
				this.year.get('value')
			];
		},
		focus: function(){
			this.composer.focus();
		}
	});

	layout = [
		{ field: "id", name:"ID", width: '20px'},
		{ name: "Edit Multiple Fields", editable: true,
			//Construct our own cell data using multiple fields
			formatter: function(rawData){
				return rawData.Composer + ': ' + rawData.Name + ' [' + rawData.Year + ']';
			},
			//Use our own editor
			editor: 'gridx.tests.CustomEditor',
			editorArgs: {
				//Feed our editor with proper values
				toEditor: function(storeData, gridData){
					return [
						gridData.split(':')[0].trim(),
						gridData.split('[')[0].split(':')[1].trim(),
						gridData.split('[')[1].split(']')[0]
					];
				}
			},
			//Define our own "applyEdit" process
			customApplyEdit: function(cell, value){
				return cell.row.setRawData({
					Composer: value[0],
					Name: value[1],
					Year: value[2]
				});
			}
		}
	];
});
