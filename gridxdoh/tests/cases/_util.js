define([
], function(){

	return {
		panel: function(){
			return document.getElementById('casePanel');
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
			var casePanel = document.getElementById('casePanel');
			var btn = document.createElement('input');
			btn.setAttribute('type', 'button');
			btn.setAttribute('value', name);
			btn.onclick = onClick;
			casePanel.appendChild(btn);
			return btn;
		}
	};
});
