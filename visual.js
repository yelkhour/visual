/*
Visual
Copyright (c) 2013 Institut d'Estadistica de Catalunya (Idescat)
http://www.idescat.cat (https://github.com/idescat/visual)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var VisualJS={version:"0.3.4",symbol:{text:"",position:"end"},legend:!0,autoheading:!0,dec:0,filter:.05,fixed:null,width:500,bwidth:500,height:500,normal:500,scripts:[],map:{},container:{},func:{},draw:function(){VisualJS.tooltip(),VisualJS.chart(),window.onresize=function(){VisualJS.canvas()}},tooltip:function(){var a=document;if(!a.getElementById(VisualJS.setup.tooltipid)){var b=a.createElement("div");b.id=VisualJS.setup.tooltipid,b.style.display="none",a.body.appendChild(b)}},getsize:function(a){var b=window,c=document,d=c.documentElement,e=c.getElementsByTagName("body")[0],f=c.getElementById(a),g=f.getElementsByTagName("h1")[0],h=f.getElementsByTagName("p")[0],i=g.clientHeight,j=h.clientHeight,k=b.innerHeight||d.clientHeight||e.clientHeight;"undefined"!=typeof k&&"undefined"!=typeof i&&"undefined"!=typeof j&&(null===VisualJS.fixed?(VisualJS.bwidth=b.innerWidth||d.clientWidth||e.clientWidth,VisualJS.width=VisualJS.bwidth-VisualJS.setup.padding.w,VisualJS.height=k-VisualJS.setup.padding.h-i-j):(VisualJS.bwidth=d.clientWidth||e.clientWidth,VisualJS.width=VisualJS.fixed[0]-VisualJS.setup.padding.w,VisualJS.height=VisualJS.fixed[1]-VisualJS.setup.padding.h-i-j)),VisualJS.visualsize=VisualJS.width<VisualJS.normal?VisualJS.setup.mini:VisualJS.setup.normal},atext:function(a){return String(a).replace(/&amp;/g,"&")},getHeading:function(a){if(VisualJS.autoheading===!1)return a.title;var b=[],c=function(a,c){"string"==typeof a&&(c===!0&&(a='<span class="'+VisualJS.setup.nowrapclass+'">'+a+"</span>"),b.push(a))};if(null!==a.time&&"object"==typeof a.time)var d=VisualJS.tformat(a.time[0]),e=VisualJS.tformat(a.time[a.time.length-1]),f=d+"&ndash;"+e;else var f=VisualJS.tformat(a.time);return c(a.title,!1),c(a.geo,!0),null!==f&&c(f,!0),VisualJS.atext(b.join(". "))},addJS:function(a,b){return b&&a.exists.call()?!1:(VisualJS.scripts.push(a.js),!0)},showTooltip:function(a,b,c){var d=document.getElementById(VisualJS.setup.tooltipid),e=VisualJS.bwidth-VisualJS.setup.margin,f={};d.innerHTML=a,d.style.display="block";var g=d.clientWidth/2;f.x=b-g,f.y=c-d.clientHeight-5,b+g>e?f.x-=b+g-e:f.x<VisualJS.setup.margin&&(f.x+=VisualJS.setup.margin-f.x),f.y<VisualJS.setup.margin&&(f.y+=1.75*d.clientHeight),d.style.left=f.x+"px",d.style.top=f.y+"px"},format:function(a){if("undefined"==typeof a||null===a)return VisualJS.setup.i18n.text.na[VisualJS.lang];a+="";for(var b=/(\d+)(\d{3})/,c=a.split("."),d=c[0],e=c.length>1?VisualJS.setup.i18n.text.dec[VisualJS.lang]+c[1]:"";b.test(d);)d=d.replace(b,"$1"+VisualJS.setup.i18n.text.k[VisualJS.lang]+"$2");return d+e},tformat:function(a){if(!a)return null;if(isNaN(a))return a;switch(a.length){case 5:var b="quarter";break;case 6:var b="month";break;default:return a}var c=VisualJS.setup.i18n.text[b];if("undefined"==typeof c)return a;var d=c[VisualJS.lang];return"undefined"==typeof d?a:d[a.slice(4)-1]+" <span>"+a.slice(0,4)+"</span>"},tooltipText:function(a,b,c){var d=c?VisualJS.container[a].symbol.text:"",e=VisualJS.format(c),f="end"===VisualJS.container[a].symbol.position?e+" "+d:d+" "+e;return b?"<strong>"+f+"</strong> "+b:f},load:function(a){function b(a){return"[object Array]"===Object.prototype.toString.call(a)}if("undefined"==typeof VisualJS.setup&&window.alert("Visual: Setup not found (visual.setup.js)!"),b(a))for(var c=0,d=a.length;d>c;c++)VisualJS.get(a[c]);else VisualJS.get(a)},get:function(a){VisualJS.id="undefined"!=typeof a.id?a.id:VisualJS.setup.id,"undefined"!=typeof a.fixed&&(VisualJS.fixed=a.fixed),VisualJS.container[VisualJS.id]="undefined"!=typeof a.symbol?{symbol:{text:"undefined"!=typeof a.symbol.text?a.symbol.text:VisualJS.symbol.text,position:"undefined"!=typeof a.symbol.position?a.symbol.position:VisualJS.symbol.position}}:{symbol:VisualJS.symbol},VisualJS.autoheading="undefined"!=typeof a.autoheading?!!a.autoheading:VisualJS.autoheading,VisualJS.legend="undefined"!=typeof a.legend?!!a.legend:VisualJS.legend,VisualJS.lang=a.lang||VisualJS.setup.i18n.lang;var b="#"+VisualJS.id,c=b+" .vis",d=VisualJS.setup.func.old("ie9");if("cmap"===a.type)if(d)document.getElementById(VisualJS.id).innerHTML="<p>"+VisualJS.setup.i18n.text.oldbrowser[VisualJS.lang]+"</p>";else{if("string"!=typeof a.by)return;VisualJS.addJS(VisualJS.setup.lib.maps,!0),VisualJS.addJS(VisualJS.setup.lib.d3,!0),VisualJS.addJS(VisualJS.setup.map[a.by],!0),VisualJS.chart=function(){var c=VisualJS.map[a.by],d=c.area[0],e=c.area[1],f="undefined"!=typeof a.filter?a.filter:VisualJS.filter,g=1-f,h="object"==typeof a.grouped&&a.grouped.length>0&&a.data[0].hasOwnProperty("group"),i=!h&&a.data[0].hasOwnProperty("val"),j=h?a.grouped.length:i?VisualJS.setup.colors.map.max:1,k=VisualJS.func.colors(VisualJS.setup.colors.map.base,j,"fill","q"),l=d3.select(b),m="object"==typeof c.center&&"function"==typeof c.projection.center?c.projection.center(c.center):c.projection,n=m.scale(c.scale).translate([d/2,e/2]),o=d3.geo.path().projection(n),p=d3.select("#"+VisualJS.setup.tooltipid);"undefined"!=typeof a.dec&&(VisualJS.dec=a.dec),VisualJS.canvas=function(){l.html("<h1></h1><p></p>"),d3.select(b+" h1").html(VisualJS.getHeading(a)),d3.select(b+" p").html(VisualJS.atext(a.source||"")),VisualJS.getsize(VisualJS.id);var q,t,u,v,w,m=d3.map(),n=[],r=function(){},s=function(){},x=VisualJS.height/e,y=VisualJS.width/d,z=Math.min(Math.round(d*x),VisualJS.width),A=Math.min(Math.round(e*y),VisualJS.height),B=Math.floor((VisualJS.width-z)/2),C=Math.floor((VisualJS.height-A)/2),D=y>x?x:y,E=l.insert("svg:svg","p").attr("width",z).attr("height",A);h?(q=d3.map(),r=function(a,b){a.set(b.id,b.group)},t=function(a,b,d){return"q"+(a.get(d[c.id])-1)},u=function(b,d){var e=a.grouped[b.get(d[c.id])-1],f=d[c.label];return"undefined"!=typeof e&&(f+=" <em>"+e+"</em>"),f}):(i?(t=function(a,b,d,e,f){var g=d3.scale.quantize().domain([e,f]).range(d3.range(j).map(function(a){return"q"+a}));return g(b.get(d[c.id]))},s=VisualJS.func.legend):t=function(a,b,d){return""!==b.get(d[c.id])?"":"q"+(j-1)},u=function(a,b){return b[c.label]});for(var F=0,G=a.data,H=G.length;H>F;F++){var I=G[F];I.hasOwnProperty("val")?m.set(I.id,I.val):m.set(I.id,""),n.push(I.val),r(q,I)}n.sort(function(a,b){return a-b});var v=d3.quantile(n,f).toFixed(VisualJS.dec),w=d3.quantile(n,g).toFixed(VisualJS.dec);E.style("margin-left",B+"px"),E.style("margin-top",C+"px"),E.style("margin-bottom",C+"px"),E.append("svg:g").attr("class","area").attr("transform","scale("+D+")").selectAll("path").data(c.features).enter().append("svg:path").attr("class",function(a){return t(q,m,a.properties,v,w)}).attr("d",o).on("mousemove",function(a){(i||"undefined"!=typeof m.get(a.properties[c.id]))&&VisualJS.showTooltip(VisualJS.tooltipText(VisualJS.id,u(q,a.properties),m.get(a.properties[c.id])),d3.event.pageX,d3.event.pageY)}).on("mouseout",function(){return p.style("display","none")}),VisualJS.legend&&"object"==typeof c.legend&&s(VisualJS.id,VisualJS.tooltipText(VisualJS.id,null,w),VisualJS.tooltipText(VisualJS.id,null,v),k[k.length-1],k[0],E,p,c.area,c.legend)},VisualJS.canvas()}}else{if(VisualJS.addJS(VisualJS.setup.lib.jquery,!0)){var e=!1;VisualJS.addJS(VisualJS.setup.lib.jquery.flot,!1)}else if(VisualJS.addJS(VisualJS.setup.lib.jquery.flot,!0))var e=!1;else var e=!0;d&&VisualJS.addJS(VisualJS.setup.lib.excanvas,!0);var f=function(){},g=[],h=[],i=[],j=a.stacked||!1,k=function(){var b=function(){};if(j)VisualJS.addJS(VisualJS.setup.lib.jquery.flot.stack,e);else if("tsbar"===a.type){VisualJS.addJS(VisualJS.setup.lib.jquery.flot.orderbars,e);var b=function(a){return a.bars}}return f=function(c,d){for(var f=0,k=d.length;k>f;f++)h.push([f,d[f]]);for(var f=0,k=c.length;k>f;f++){for(var m=[],n=c[f].val,o=n.length,p=0;o>p;p++)m.push([p,n[p]]);"tsbar"!==a.type||j||1===k?g.push({label:c[f].label,data:m}):g.push({label:c[f].label,data:m,bars:{show:!0,barWidth:.2,order:f+1,lineWidth:2}})}for(var f=0,q=g.length;q>f;f++)i.push({data:g[f].data,label:g[f].label,bars:b(g[f]),shadowSize:4});l=q>1},VisualJS.getHeading(a)};switch(a.type){case"pyram":VisualJS.addJS(VisualJS.setup.lib.jquery.flot.pyramid,e),Array.max=function(a){return Math.max.apply(Math,a)};var f=function(a,b,c){max=Math.max(Array.max(a[0].val),Array.max(a[1].val)),g[0]={label:a[0].label,data:[],pyramid:{direction:"L"}},g[1]={label:a[1].label,data:[]};for(var d=0,e=c.length;e>d;d++)g[0].data[d]=[c[d],a[0].val[d]],g[1].data[d]=[c[d],a[1].val[d]]},l=!0,m=!1,n=!1,o=!1,p=!1,q=VisualJS.getHeading(a);break;case"rank":var r=[],f=function(a){for(var d=0,e=a.length;e>d;d++)h[d]=[d,a[e-d-1][0]],r[d]=[a[e-d-1][1],d];g={data:r}},l=!1,m=!1,n=!1,o=!1,p=!0,q=VisualJS.getHeading(a);break;case"bar":VisualJS.addJS(VisualJS.setup.lib.jquery.flot.categories,e);var f=function(a){g=a,l=g.length>1},m=!0,n=!1,o=!1,p=!0,q=VisualJS.getHeading(a);break;case"tsline":var q=k(),m=null,n=!0,o=!0,p=!1;break;case"tsbar":var q=k(),m=!0,n=!1,o=!1,p=!0}VisualJS.chart=function(){f(a.data,a.time,a.by),$.fn.UseTooltip=function(b){var c=[];$(this).bind("plothover",function(d,e,f){if(f){if(c!=[f.seriesIndex,f.dataIndex]){c=[f.seriesIndex,f.dataIndex];var i=f.datapoint[0],k=f.datapoint[1],l="bar"!==a.type?f.series.label:g[i][0],m="rank"!==a.type?l:h[k][1],n="rank"!==a.type&&"bar"!==a.type?j||1===g.length?h[i][1]:"pyram"===a.type?f.series.yaxis.ticks[f.dataIndex].label:h[f.dataIndex][1]:!1,o="pyram"===a.type?Math.abs(i):"rank"!==a.type?"tsbar"!==a.type?k:j||1===g.length?g[f.seriesIndex].data[i][1]:k:i;VisualJS.showTooltip(VisualJS.tooltipText(b,n?m+" ("+n+")":m,o),e.pageX,e.pageY)}}else $("#"+VisualJS.setup.tooltipid).hide(),c=[]})},l=VisualJS.legend&&l;var d={colors:VisualJS.setup.colors.series,series:{stack:m,bars:{show:p,barWidth:.7,align:"center",fill:.9},lines:{show:n},points:{show:o,radius:1}},legend:{show:l},grid:{borderWidth:1,hoverable:!0,clickable:!1,mouseActiveRadius:10},xaxis:{},yaxis:{}};VisualJS.canvas=function(){$(b).html("<h1></h1><p></p>"),$(b+" h1").html(q),$(b+" p").html(VisualJS.atext(a.source||"")),VisualJS.getsize(VisualJS.id),$(b+" h1").after('<div class="vis '+VisualJS.visualsize+'" style="width: '+VisualJS.width+"px; height: "+VisualJS.height+'px;"></div>');var e=h.length;switch(a.type){case"pyram":d.series.pyramid={show:!0,barWidth:1},d.xaxis.max=1.02*max,d.xaxis.tickFormatter=function(a){return VisualJS.format(a)},$.plot(c,g,d);break;case"rank":d.series.bars.horizontal=!0,d.yaxis.ticks=VisualJS.height/e>11?h:0,d.xaxis.max=1.02*a.data[0][1],d.xaxis.tickFormatter=function(a){return VisualJS.format(a)},d.yaxis.autoscaleMargin=0,d.series.bars.barWidth=.5,$.plot(c,[g],d);break;case"bar":d.xaxis.mode="categories",d.xaxis.tickLength=0,d.yaxis.tickFormatter=function(a){return VisualJS.format(a)},$.plot(c,[g],d);break;case"tsline":case"tsbar":var f=function(a){var b=[],c=VisualJS.width/e;switch(a){case"year":if(25>c){for(var f=0;e>f;f++)b[f]=f%2?[h[f][0],""]:[h[f][0],h[f][1]];d.xaxis.ticks=b}else d.xaxis.ticks=h;break;case"month":case"quarter":var g="month"===a?"01":"1";if(35>c){for(var f=0;e>f;f++)b[f]=h[f][1].slice(4)!==g?[h[f][0],""]:[h[f][0],h[f][1].slice(0,4)],h[f][1]=VisualJS.tformat(h[f][1]);d.xaxis.ticks=b}else{for(var f=0;e>f;f++)h[f][1]=VisualJS.tformat(h[f][1]);d.xaxis.ticks=h}}};switch(d.yaxis.tickFormatter=function(a){return VisualJS.format(a)},h[0][1].length){case 4:f("year");break;case 5:f("quarter");break;case 6:f("month");break;default:d.xaxis.ticks=h}$.plot(c,i,d)}$(c).UseTooltip(VisualJS.id)},VisualJS.canvas()}}VisualJS.scripts.length&&"object"==typeof LazyLoad?LazyLoad.js(VisualJS.scripts,VisualJS.draw):VisualJS.draw()}};if("function"!=typeof visual)var visual=VisualJS.load;