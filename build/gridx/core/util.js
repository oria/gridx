//>>built
define("gridx/core/util",{biSearch:function(d,e){var a=0,b=d.length,c;for(c=Math.floor((a+b)/2);a+1<b;c=Math.floor((a+b)/2))0<e(d[c])?b=c:a=c;return d.length&&0<=e(d[a])?a:b}});
//@ sourceMappingURL=util.js.map