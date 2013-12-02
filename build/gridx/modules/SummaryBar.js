//>>built
define("gridx/modules/SummaryBar",["dojo/_base/declare","../support/Summary","../core/_Module","./Bar"],function(a,b,c){return a(c,{name:"summaryBar",required:["bar"],preload:function(){this.grid.bar.defs.push({bar:"bottom",row:0,col:0,pluginClass:b,className:"gridxBarSummary",message:this.arg("message"),hookPoint:this,hookName:"summary"})}})});
//@ sourceMappingURL=SummaryBar.js.map