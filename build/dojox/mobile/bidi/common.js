//>>built
define("dojox/mobile/bidi/common",["dojo/_base/array","dijit/_BidiSupport"],function(c,d){return common={enforceTextDirWithUcc:function(a,b){return b?(b="auto"===b?d.prototype._checkContextual(a):b,("rtl"===b?common.MARK.RLE:common.MARK.LRE)+a+common.MARK.PDF):a},removeUCCFromText:function(a){return!a?a:a.replace(/\u202A|\u202B|\u202C/g,"")},setTextDirForButtons:function(a){var b=a.getChildren();b&&a.textDir&&c.forEach(b,function(b){b.set("textDir",a.textDir)},a)},MARK:{LRE:"\u202a",RLE:"\u202b",
PDF:"\u202c"}}});
//@ sourceMappingURL=common.js.map