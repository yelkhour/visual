/*
colors, legend (0.8.0)
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

VisualJS.func.colors=function(cHexa, rang, atribut, clas, custcolors, id){
	var
		d=document,
		HueToRgb=function (m1, m2, hue) {
			var v;
			if (hue<0) {hue += 1;}
			else if (hue > 1) {	hue -= 1;}
			if (6 * hue < 1) {v=m1 + (m2 - m1) * hue * 6;}
			else if (2 * hue < 1) {v=m2;}
			else if (3 * hue < 2){v=m1 + (m2 - m1) * (2/3 - hue) * 6;}
			else {v=m1;}
			return 255 * v;
		},
		hsl2rgb=function (hsl) {
			var
				h=hsl.h,
				s=hsl.s/100,
				l=hsl.l/100,
				m1, m2, hue, r, g, b
			;
			if (s == 0) {r=g=b=(l * 255);}
			else {
				if (l <= 0.5) {m2=l * (s + 1);}
				else {m2=l + s - l * s;}
				m1=l * 2 - m2;
				hue=h / 360;
				r=HueToRgb(m1, m2, hue + 1/3);
				g=HueToRgb(m1, m2, hue);
				b=HueToRgb(m1, m2, hue - 1/3);
			}
			return {r: Math.round(r), g: Math.round(g), b: Math.round(b)};
		},
		hex2Dec=function (h){
			return parseInt(h,16);
		},
		hex2rgb=function (c){
			c=c.replace("#","");
			return {
				r: hex2Dec(c.substr(0,2)),
				g: hex2Dec(c.substr(2,2)),
				b: hex2Dec(c.substr(4,2))
			};
		},
		rgb2hsl=function (rgb){
			var
				r=rgb.r/255,
				g=rgb.g/255,
				b=rgb.b/255,
				max=Math.max(r, g, b), min=Math.min(r, g, b),
				h, s, l=(max + min) / 2
			;

			if(max===min){
				h=s=0; // achromatic
			}else{
				var df=max - min;
				s=l > 0.5 ? df / (2 - max - min) : df / (max + min);
				switch(max){
					case r: h=(g - b) / df + (g < b ? 6 : 0); break;
					case g: h=(b - r) / df + 2; break;
					case b: h=(r - g) / df + 4; break;
				}
				h /= 6;
			}
			return {h:Math.floor(h * 360), s:Math.floor(s * 100), l:Math.floor(l * 100)};
		},
		stylesheet=d.createElement("style"),
		colors=new Array(),
		hsl=rgb2hsl(hex2rgb(cHexa))
	;

	stylesheet.setAttribute("type", "text/css");
	d.getElementsByTagName("head")[0].appendChild(stylesheet);
	var
		incr=(97-hsl.l)/--rang,
		len=(typeof custcolors==="undefined") ? 0 : custcolors.length,
		rules="",
		rgb
	;
	id=(typeof id==="undefined") ? "" : "#"+id;
	if(len>0){ //Custom colors
		for(var i=0; i<len; i++){
            rules+= id+" ."+clas+i+"{" + atribut + ": "+custcolors[i]+"} ";
		}
	}else{
		for(var i=0; i<=rang; i++){
			rgb=hsl2rgb (hsl);
			colors[i]={r:rgb.r, g:rgb.g, b:rgb.b};
			rules+= id+" ."+clas+(rang-i)+"{" + atribut + ": rgb("+rgb.r+","+rgb.g+","+rgb.b+")}";
			hsl.l += incr;
		}
        rgb=hex2rgb(VisualJS.setup.colors.map.error);
        colors[colors.length-1]={r:rgb.r, g:rgb.g, b:rgb.b};
        rules+= id + " path " + "{" + atribut + ": rgb("+rgb.r+","+rgb.g+","+rgb.b+")}";
	}
	stylesheet.innerHTML = rules;
	return colors;
};

VisualJS.func.legend=function(infsup, lightdark, vis, tooltip, area, pos, strict) { //Requires visual v. 0.8.0
	var
		mapw=area[0],
		maph=area[1],
		showValLimit=250, // height/width less than this value -> don't show text legend
		minLimit=170, // height/width less than this value -> don't show legend
		size=15, //square size (15x15)
		offsetY=4, //space between squares
		offsetX=5, //space between square and text
		x=pos[0], //legend position
		y=pos[1], //legend position
		hwmin=Math.min(vis.attr("width"), vis.attr("height")),
		leg=vis.append("svg:g").attr("class", VisualJS.setup.legendclass),
		info=[ // Colors and values in the legend
			{  //less than
				color: "fill:rgb(" + lightdark[0].r + "," + lightdark[0].g + "," + lightdark[0].b + "); ",
				text: (strict[0] ? "" :  "\u2264 ") + infsup[0]
			},
            {	//greater than
				color: "fill:rgb(" + lightdark[1].r + "," + lightdark[1].g + "," + lightdark[1].b + ")",
				text: (strict[1] ? "" :  "\u2265 ") + infsup[1]
			},
			{	//greater than
				color: "fill:rgb(" + lightdark[2].r + "," + lightdark[2].g + "," + lightdark[2].b + ")",
				text: (strict[2] ? "" :  "\u2265 ") + infsup[2]
			},
            {	//greater than
				color: "fill:rgb(" + lightdark[3].r + "," + lightdark[3].g + "," + lightdark[3].b + ")",
				text: (strict[3] ? "" :  "\u2265 ") + infsup[3]
			}
		],
		getBB=function(html){ // returns width/height of the text (Bounding Box)
			var d=document;
			var s=d.createElement("span");
			s.style.whiteSpace="nowrap";
			s.style.visibility="hidden";
			s.innerHTML=html;
			d.body.appendChild(s);
			var bb=s.getBoundingClientRect();
			s.parentNode.removeChild(s);
			return bb;
		},
		bbHigherVal=getBB(info[0].text + "!!!"),
		xIni=(x / mapw) * vis.attr("width"),
		yIni=(y / maph) * vis.attr("height"),
		posY=yIni
	;

	if(hwmin>minLimit){  //Show legend
		//squares
		leg.selectAll("rect")
			.data(info)
			.enter()
			.append("svg:rect")
			.attr("x", xIni)
			.attr("y", function(){posY+=size+offsetY; return posY;})
			.attr("width", size)
			.attr("height", size)
			.attr("style", function(d){return d.color;})
		;
		if(hwmin>showValLimit){ //case 1: show values
			//Align text to square horizontally
			posY=yIni+(size/2)+(bbHigherVal.height/4);
			//text
			leg.selectAll("text")
				.data(info)
				.enter()
				.append("svg:text")
				.attr("x",xIni+size+offsetX) //Horizontal space of 5px between square and text
				.attr("y",function(){posY+=size+offsetY; return posY;})
				.text(function(d){return d.text;})
			;
		}else{ //case 2: show tooltip
			// Attach tooltip
			leg.selectAll("rect")
				.on("mousemove", function(d){
					VisualJS.showTooltip(d.text, d3.event.pageX, d3.event.pageY);
				})
				.on("mouseout", function(){tooltip.style("display", "none");});
		}
	} //case 3: no legend
};