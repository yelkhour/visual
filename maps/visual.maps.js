/*
colors, legend (0.8.0) (Must be UTF8+BOM for IE)
Copyright (c) 2014 Institut d'Estadistica de Catalunya (Idescat)
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
VisualJS.func.colors=function(t,e,r,n,a,l){var o=document,i=function(t,e,r){var n;return 0>r?r+=1:r>1&&(r-=1),n=1>6*r?t+(e-t)*r*6:1>2*r?e:2>3*r?t+(e-t)*(2/3-r)*6:t,255*n},s=function(t){var e,r,n,a,l,o,s=t.h,u=t.s/100,c=t.l/100;return 0==u?a=l=o=255*c:(r=.5>=c?c*(u+1):c+u-c*u,e=2*c-r,n=s/360,a=i(e,r,n+1/3),l=i(e,r,n),o=i(e,r,n-1/3)),{r:Math.round(a),g:Math.round(l),b:Math.round(o)}},u=function(t){return parseInt(t,16)},c=function(t){return t=t.replace("#",""),{r:u(t.substr(0,2)),g:u(t.substr(2,2)),b:u(t.substr(4,2))}},g=function(t){var e,r,n=t.r/255,a=t.g/255,l=t.b/255,o=Math.max(n,a,l),i=Math.min(n,a,l),s=(o+i)/2;if(o===i)e=r=0;else{var u=o-i;switch(r=s>.5?u/(2-o-i):u/(o+i),o){case n:e=(a-l)/u+(l>a?6:0);break;case a:e=(l-n)/u+2;break;case l:e=(n-a)/u+4}e/=6}return{h:Math.floor(360*e),s:Math.floor(100*r),l:Math.floor(100*s)}},d=o.createElement("style"),h=new Array,f=g(c(t));d.setAttribute("type","text/css"),o.getElementsByTagName("head")[0].appendChild(d);var b,p=(97-f.l)/--e,v="undefined"==typeof a?0:a.length,y="";if(l="undefined"==typeof l?"":"#"+l,v>0)for(var m=0;v>m;m++)y+=l+" ."+n+m+"{"+r+": "+a[m]+"} ";else{for(var m=0;e>=m;m++)b=s(f),h[m]={r:b.r,g:b.g,b:b.b},y+=l+" ."+n+(e-m)+"{"+r+": rgb("+b.r+","+b.g+","+b.b+")}",f.l+=p;b=c(VisualJS.setup.colors.map.error),h[h.length-1]={r:b.r,g:b.g,b:b.b},y+=l+" path {"+r+": rgb("+b.r+","+b.g+","+b.b+")}"}return d.innerHTML=y,h},VisualJS.func.legend=function(t,e,r,n,a,l,o){var i=a[0],s=a[1],u=250,c=170,g=15,d=4,h=5,f=l[0],b=l[1],p=Math.min(r.attr("width"),r.attr("height")),v=r.append("svg:g").attr("class",VisualJS.setup.legendclass),y=[{color:"fill:rgb("+e[0].r+","+e[0].g+","+e[0].b+"); ",text:(o[0]?"":"≤ ")+t[0]},{color:"fill:rgb("+e[1].r+","+e[1].g+","+e[1].b+")",text:(o[1]?"":"≥ ")+t[1]},{color:"fill:rgb("+e[2].r+","+e[2].g+","+e[2].b+")",text:(o[2]?"":"≥ ")+t[2]},{color:"fill:rgb("+e[3].r+","+e[3].g+","+e[3].b+")",text:(o[3]?"":"≥ ")+t[3]}],m=function(t){var e=document,r=e.createElement("span");r.style.whiteSpace="nowrap",r.style.visibility="hidden",r.innerHTML=t,e.body.appendChild(r);var n=r.getBoundingClientRect();return r.parentNode.removeChild(r),n},x=m(y[0].text+"!!!"),M=f/i*r.attr("width"),w=b/s*r.attr("height"),S=w;p>c&&(v.selectAll("rect").data(y).enter().append("svg:rect").attr("x",M).attr("y",function(){return S+=g+d}).attr("width",g).attr("height",g).attr("style",function(t){return t.color}),p>u?(S=w+g/2+x.height/4,v.selectAll("text").data(y).enter().append("svg:text").attr("x",M+g+h).attr("y",function(){return S+=g+d}).text(function(t){return t.text})):v.selectAll("rect").on("mousemove",function(t){VisualJS.showTooltip(t.text,d3.event.pageX,d3.event.pageY)}).on("mouseout",function(){n.style("display","none")}))};