define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/text!./ColumnBar.html',
	'dijit/form/TextBox'
], function(declare, array, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template){

	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],{
//        columnId: '',

//        columnField: '',

//        columnName: '',

//        columnWidth: '',

		columnIndex: 0,

		templateString: template,

		fieldOptions: '[]',

		postMixInProperties: function(){
			var options = array.map(this.fields, function(field, i){
				return ['{lable: "', field, '", value: "', field, '"', i ? '' : ', selected: true', '}'].join('');
			});
			options.unshift('{label: "", value: ""}');
			options = options.join(',');
			this.fieldOptions = '[' + options + ']';
			console.log('here', this.fieldOptions);
		},

		postCreate: function(){
			var options = array.map(this.fields, function(field, i){
				return {label: field, value: field, selected: i === 0};
			});
			this.fieldNode.addOption(options);
			this.fieldNode.set('value', options[0].value);
		},

		setIndex: function(index){
			this.columnIndex = index;
			this.indexNode.innerHTML = index;
		},

		getColumn: function(){
			var field = this.fieldNode.get('value');
			return {
				index: this.columnIndex,
				id: this.idNode.get('value'),
				name: this.nameNode.get('value'),
				field: field == 'empty' ? '' : field,
				width: this.widthValueNode.get('value') + this.widthUnitNode.get('displayedValue')
			};
		},

		_onWidthUnitChange: function(data){
			var wv = this.widthValueNode;
			wv.domNode.style.width = data == 'auto' ? '0' : '50px';
			if(data == 'px'){
				wv.set('value', 50);
			}else if(data == 'em'){
				wv.set('value', 5);
			}else if(data == 'percent'){
				wv.set('value', 15);
			}else if(data == 'auto'){
				wv.set('value', '');
			}
		},

		onEdit: function(){
		},
		onAdd: function(){
		},
		onDelete: function(){
		}
	});
});
