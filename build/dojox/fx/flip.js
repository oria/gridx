//>>built
define("dojox/fx/flip","dojo/_base/kernel dojo/_base/html dojo/dom dojo/dom-construct dojo/dom-geometry dojo/_base/connect dojo/_base/Color dojo/_base/sniff dojo/_base/lang dojo/_base/window dojo/_base/fx dojo/fx ./_base".split(" "),function(F,p,G,z,H,A,I,J,B,D,E,C,r){F.experimental("dojox.fx.flip");r.flip=function(c){var n=z.create("div"),d=c.node=G.byId(c.node),g=d.style,b=null,l=null,a=null,s=c.lightColor||"#dddddd",w=c.darkColor||"#555555",t=p.style(d,"backgroundColor"),u=c.endColor||t,q={},m=
[],h=c.duration?c.duration/2:250,a=c.dir||"left",k=0.9,l="transparent",x=c.whichAnim,v=c.axis||"center",k=c.depth,e=function(a){return"#000000"===(new I(a)).toHex()?"#000001":a};7>J("ie")&&(u=e(u),s=e(s),w=e(w),t=e(t),l="black",n.style.filter="chroma(color\x3d'#000000')");(function(a){return function(){var c=p.coords(a,!0);b={top:c.y,left:c.x,width:c.w,height:c.h}}})(d)();l={position:"absolute",top:b.top+"px",left:b.left+"px",height:"0",width:"0",zIndex:c.zIndex||g.zIndex||0,border:"0 solid "+l,fontSize:"0",
visibility:"hidden"};d=[{},{top:b.top,left:b.left}];a={left:"Left Right Top Bottom Width Height endHeightMin Left endHeightMax".split(" "),right:"Right Left Top Bottom Width Height endHeightMin Left endHeightMax".split(" "),top:"Top Bottom Left Right Height Width endWidthMin Top endWidthMax".split(" "),bottom:"Bottom Top Left Right Height Width endWidthMin Top endWidthMax".split(" ")}[a];"undefined"!=typeof k?(k=Math.max(0,Math.min(1,k))/2,k=0.4+(0.5-k)):k=Math.min(0.9,Math.max(0.4,b[a[5].toLowerCase()]/
b[a[4].toLowerCase()]));for(var e=d[0],f=4;6>f;f++)"center"==v||"cube"==v?(b["end"+a[f]+"Min"]=b[a[f].toLowerCase()]*k,b["end"+a[f]+"Max"]=b[a[f].toLowerCase()]/k):"shortside"==v?(b["end"+a[f]+"Min"]=b[a[f].toLowerCase()],b["end"+a[f]+"Max"]=b[a[f].toLowerCase()]/k):"longside"==v&&(b["end"+a[f]+"Min"]=b[a[f].toLowerCase()]*k,b["end"+a[f]+"Max"]=b[a[f].toLowerCase()]);"center"==v?e[a[2].toLowerCase()]=b[a[2].toLowerCase()]-(b[a[8]]-b[a[6]])/4:"shortside"==v&&(e[a[2].toLowerCase()]=b[a[2].toLowerCase()]-
(b[a[8]]-b[a[6]])/2);q[a[5].toLowerCase()]=b[a[5].toLowerCase()]+"px";q[a[4].toLowerCase()]="0";q["border"+a[1]+"Width"]=b[a[4].toLowerCase()]+"px";q["border"+a[1]+"Color"]=t;e["border"+a[1]+"Width"]=0;e["border"+a[1]+"Color"]=w;e["border"+a[2]+"Width"]=e["border"+a[3]+"Width"]="cube"!=v?(b["end"+a[5]+"Max"]-b["end"+a[5]+"Min"])/2:b[a[6]]/2;e[a[7].toLowerCase()]=b[a[7].toLowerCase()]+b[a[4].toLowerCase()]/2+(c.shift||0);e[a[5].toLowerCase()]=b[a[6]];c=d[1];c["border"+a[0]+"Color"]={start:s,end:u};
c["border"+a[0]+"Width"]=b[a[4].toLowerCase()];c["border"+a[2]+"Width"]=0;c["border"+a[3]+"Width"]=0;c[a[5].toLowerCase()]={start:b[a[6]],end:b[a[5].toLowerCase()]};B.mixin(l,q);p.style(n,l);D.body().appendChild(n);s=function(){z.destroy(n);g.backgroundColor=u;g.visibility="visible"};if("last"==x){for(f in e)e[f]={start:e[f]};e["border"+a[1]+"Color"]={start:w,end:u};c=e}(!x||"first"==x)&&m.push(E.animateProperty({node:n,duration:h,properties:e}));(!x||"last"==x)&&m.push(E.animateProperty({node:n,
duration:h,properties:c,onEnd:s}));A.connect(m[0],"play",function(){n.style.visibility="visible";g.visibility="hidden"});return C.chain(m)};r.flipCube=function(c){var n=[],d=H.getMarginBox(c.node),g=d.w/2,d=d.h/2,g={top:{pName:"height",args:[{whichAnim:"first",dir:"top",shift:-d},{whichAnim:"last",dir:"bottom",shift:d}]},right:{pName:"width",args:[{whichAnim:"first",dir:"right",shift:g},{whichAnim:"last",dir:"left",shift:-g}]},bottom:{pName:"height",args:[{whichAnim:"first",dir:"bottom",shift:d},
{whichAnim:"last",dir:"top",shift:-d}]},left:{pName:"width",args:[{whichAnim:"first",dir:"left",shift:-g},{whichAnim:"last",dir:"right",shift:g}]}}[c.dir||"left"].args;c.duration=c.duration?2*c.duration:500;c.depth=0.8;c.axis="cube";for(d=g.length-1;0<=d;d--)B.mixin(c,g[d]),n.push(r.flip(c));return C.combine(n)};r.flipPage=function(c){var n=c.node,d=p.coords(n,!0),g=d.x,b=d.y,l=d.w,a=d.h,s=p.style(n,"backgroundColor"),w=c.lightColor||"#dddddd",t=c.darkColor,u=z.create("div"),q=[],m=[],h=c.dir||"right",
k={left:["left","right","x","w"],top:["top","bottom","y","h"],right:["left","left","x","w"],bottom:["top","top","y","h"]},x={right:[1,-1],left:[-1,1],top:[-1,1],bottom:[1,-1]};p.style(u,{position:"absolute",width:l+"px",height:a+"px",top:b+"px",left:g+"px",visibility:"hidden"});g=[];for(b=0;2>b;b++){var a=(l=b%2)?k[h][1]:h,v=l?"last":"first",e=l?s:w,f=l?e:c.startColor||n.style.backgroundColor;m[b]=B.clone(u);var y=function(a){return function(){z.destroy(m[a])}}(b);D.body().appendChild(m[b]);g[b]=
{backgroundColor:l?f:s};g[b][k[h][0]]=d[k[h][2]]+x[h][0]*b*d[k[h][3]]+"px";p.style(m[b],g[b]);q.push(dojox.fx.flip({node:m[b],dir:a,axis:"shortside",depth:c.depth,duration:c.duration/2,shift:x[h][b]*d[k[h][3]]/2,darkColor:t,lightColor:w,whichAnim:v,endColor:e}));A.connect(q[b],"onEnd",y)}return C.chain(q)};r.flipGrid=function(c){var n=c.rows||4,d=c.cols||4,g=[],b=z.create("div"),l=c.node,a=p.coords(l,!0),s=a.x,w=a.y,t=a.w,u=a.h,q=a.w/d,m=a.h/n,a=[];p.style(b,{position:"absolute",width:q+"px",height:m+
"px",backgroundColor:p.style(l,"backgroundColor")});for(var h=0;h<n;h++){var k=h%2,x=k?"right":"left",v=k?1:-1,e=B.clone(l);p.style(e,{position:"absolute",width:t+"px",height:u+"px",top:w+"px",left:s+"px",clip:"rect("+h*m+"px,"+t+"px,"+u+"px,0)"});D.body().appendChild(e);g[h]=[];for(var f=0;f<d;f++){var y=B.clone(b),r=k?f:d-(f+1),E=function(a,b,c){return function(){b%2?p.style(a,{clip:"rect("+b*m+"px,"+t+"px,"+(b+1)*m+"px,"+(c+1)*q+"px)"}):p.style(a,{clip:"rect("+b*m+"px,"+(t-(c+1)*q)+"px,"+(b+1)*
m+"px,0px)"})}}(e,h,f);D.body().appendChild(y);p.style(y,{left:s+r*q+"px",top:w+h*m+"px",visibility:"hidden"});r=dojox.fx.flipPage({node:y,dir:x,duration:c.duration||900,shift:v*q/2,depth:0.2,darkColor:c.darkColor,lightColor:c.lightColor,startColor:c.startColor||c.node.style.backgroundColor});y=function(a){return function(){z.destroy(a)}}(y);A.connect(r,"play",this,E);A.connect(r,"play",this,y);g[h].push(r)}a.push(C.chain(g[h]))}A.connect(a[0],"play",function(){p.style(l,{visibility:"hidden"})});
return C.combine(a)};return r});
//@ sourceMappingURL=flip.js.map