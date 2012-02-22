define([
	"dojo/_base/kernel",
	"../core/_Module",
	"dojo/_base/declare",
	"dojo/_base/html"
], function(dojo, _Module){
	return _Module.register(
		dojo.declare( _Module, {

		name: "rotater",
		
		required: ["body", "header"],

		getAPIPath: function(){
			return {rotater: this};
		},

		load: function(args, deferStartup){
			this.connect(this.grid, "resize", this.resize);
		},

		resize: function(size){
			var grid = this.grid;
			if(size){
				// TODO: basic resize function should be in Grid itself?
				dojo.marginBox(grid.domNode, size);
			}else{
				size = dojo.marginBox(grid.domNode);
			}
			if(size.w){
				dojo.marginBox(grid.bodyNode, {w: size.w});
			}

			var landscape = (size.w && size.h && size.w > size.h);
			if(grid.landscapeStructure && this._landscape != landscape){
				this._landscape = landscape;
				var structure = (landscape ? grid.landscapeStructure : grid.structure);
				grid.setColumns(structure);
				grid.header.refresh();
				grid.body.refresh();
			}
		}
	}));
});