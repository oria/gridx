define([
	'dojo/dom-construct'
], function(domConstruct){

	return {
		panel: function(){
			return document.getElementById('casePanel');
		},
		add: function(){
			var node = domConstruct.create.apply(domConstruct, arguments);
			var casePanel = document.getElementById('casePanel');
			casePanel.appendChild(node);
			return node;
		},
		addInput: function(type, value){
			var casePanel = document.getElementById('casePanel');
			var input = document.createElement('input');
			input.setAttribute('type', type);
			input.value = value;
			casePanel.appendChild(input);
			return input;
		},
		addButton: function(name, onClick){
			var casePanel = document.getElementById('casePanelBtnGroup');
			var btn = document.createElement('input');
			btn.setAttribute('type', 'button');
			btn.setAttribute('value', name);
			btn.onclick = onClick;
			casePanel.appendChild(btn);
			return btn;
		}
	};
});
