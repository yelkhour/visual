/*
 Visual
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

/*global d3, LazyLoad*/

var addJSLibraries = true;
var VisualJS = {
    version : "0.10.7",
    show : true, //To be used when a callback function is specified: "false" means "don't run VisualJS.chart()", that is, load everything but don't draw.
    old : false, //You can change it to true programmatically if you already know the browser is IE<9
    fixed : null,
    width : 500,
    bwidth : 500, //body width
    height : 500,
    normal : 500, //If less than this value, apply mini style; otherwise, normal style (see setup)
    maxValue : null,
    scripts : [],

    map : {},
    container : {}, //To allow multiple direct embeddings, particular features of every container are saved here
    pub : {}, //To expose Visual-generated content to the outside world
    func : {}, //Space for external functions
    callback : null, //Or specify a default callback function when the user hasn't specified one

    /* Public functions */

    getSize : function(id) {
        var vsetup = VisualJS.setup;
        var html = vsetup.html;
        var headingElement = html.heading;
        var footerElement = html.footer;
        var w = window;
        var d = document;
        var e = d.documentElement;
        var g = d.getElementsByTagName("body")[0];
        var vis = d.getElementById(id);
        var head = vis.getElementsByTagName(headingElement)[0].clientHeight;
        var foot = vis.getElementsByTagName(footerElement)[0].clientHeight;
        var bheight = w.innerHeight || e.clientHeight || g.clientHeight, headfoot = 0//To compensate absence of head or foot (dicrease height padding [default is vsetup.padding.h])
        ;

        if (!head) {
            headfoot += 11;
        }
        if (!foot) {
            headfoot += 11;
        }

        if ( typeof bheight !== "undefined" && typeof head !== "undefined" && typeof foot !== "undefined") {
            if (VisualJS.fixed === null) {//Normal case: full page for visualization (embedded via iframe)
                VisualJS.bwidth = w.innerWidth || e.clientWidth || g.clientWidth;
                VisualJS.width = VisualJS.bwidth - vsetup.padding.w;
                VisualJS.height = bheight - vsetup.padding.h - head - foot + headfoot;
            } else {//Embed visualization on a page via script
                VisualJS.bwidth = e.clientWidth || g.clientWidth;
                VisualJS.width = VisualJS.fixed[0] - vsetup.padding.w;
                VisualJS.height = VisualJS.fixed[1] - vsetup.padding.h - head - foot + headfoot;
            }
        }

        // We take into account width because height has little impact on label space
        VisualJS.visualsize = (VisualJS.width < VisualJS.normal) ? vsetup.mini : vsetup.normal;

        //Return false when not enough space to draw a chart
        return (VisualJS.width > 10 && VisualJS.height > 10);
    },
    showTooltip : function(html, x, y) {
        var tt = document.getElementById(VisualJS.setup.tooltipid), visRightLimit = VisualJS.bwidth - VisualJS.setup.margin, //Visual right limit
        pos = {}//Final tooltip position
        ;
        tt.innerHTML = html;
        tt.style.display = "block";
        //Paint to get width
        var ttHalfWidth = tt.clientWidth / 2;
        //Half of tooltip width
        //Default: tooltip top and centered
        pos.x = x - ttHalfWidth;
        pos.y = y - tt.clientHeight - 5;
        //5 to avoid cursor

        if (x + ttHalfWidth > visRightLimit) {//Outside right: --> move to left
            pos.x -= (x + ttHalfWidth) - visRightLimit;
        } else if (pos.x < VisualJS.setup.margin) {//Outside left --> move to right
            pos.x += VisualJS.setup.margin - pos.x;
        }
        //Outside top --> move down
        if (pos.y < VisualJS.setup.margin) {
            pos.y += tt.clientHeight * 1.75;
        }//Outside bottom not possible
        tt.style.left = pos.x + "px";
        tt.style.top = pos.y + "px";
    },
    iframe : function(o, css) {
        addJSLibraries = true;
        var vsetup = VisualJS.setup;
        var clas = ( typeof o.clas === "string") ? o.clas : vsetup.clas;
        var html = '<!DOCTYPE html>\n<!--[if lt IE 7]><html class="lt-ie9 lt-ie8 lt-ie7"> <![endif]-->\n<!--[if IE 7]><html class="lt-ie9 lt-ie8"> <![endif]-->\n<!--[if IE 8]><html class="lt-ie9"> <![endif]-->\n<!--[if gt IE 8]><!--> <html> <!--<![endif]-->\n<head>';
        var create = function() {
            var d = document;
            var iframe = d.createElement("iframe");
            var e = d.getElementById(o.id);

            //iframe.seamless="seamless";
            iframe.frameBorder = "0";
            iframe.scrolling = "no";
            e.parentNode.insertBefore(iframe, e.nextSibling);
            //we insert iframe after script
            return iframe;
        }, content = function(iframe, html) {
            if ( typeof iframe !== "undefined") {
                var iframeDoc;
                if (iframe.contentDocument) {
                    iframeDoc = iframe.contentDocument;
                } else if (iframe.contentWindow) {
                    iframeDoc = iframe.contentWindow.document;
                } else if (window.frames[iframe.name]) {
                    iframeDoc = window.frames[iframe.name].document;
                }
                if (iframeDoc) {
                    iframeDoc.open();
                    iframeDoc.write(html);
                    iframeDoc.close();
                }
            }
        };

        if ( typeof css === "string") {
            if (css.indexOf("{") === -1) {//No "{"? We assume it's a URI
                html += '<link href="' + css + '" rel="stylesheet" type="text/css"\/>';
            } else {
                html += '<style type="text/css">' + css + '<\/style>';
            }
        }
        html += '<script type="text/javascript" src="' + VisualJS.setup.main.visual + '"><\/script>';
        html += '<script type="text/javascript" src="' + VisualJS.setup.main.setup + '"><\/script>';
        html += '<script type="text/javascript" src="' + VisualJS.setup.main.lazy + '"><\/script>';
        html += '<\/head><body><div id="' + o.id + '" class="' + clas + '"><\/div><script>window.setTimeout(function(){visual(' + JSON.stringify(o) + ');},1);<\/script><\/body><\/html>';
        content(create(), html);
    },

    /* Draws two charts side by side
     Input: {
     css : "/styles/visual.css", //CSS file or CSS rules, or array of size 2 of CSS files or CSS rules
     title : "Optional",
     footer : "Optional",
     load : [{},{}]
     }
     */
    compare : function(o) {
        var vsetup = VisualJS.setup;
        var sepw = VisualJS.setup.separator;
        var id = ( typeof o.id === "string") ? o.id : vsetup.id;
        var css = (Object.prototype.toString.call(o.css) === "[object Array]") ? ((o.css.length === 0) ? ["", ""] : ((o.css.length === 1) ? [o.css[0], o.css[0]] : o.css
        )
        ) : //Not an array (string assumed)
        [o.css, o.css];
        var d = document;
        var h1 = d.createElement(vsetup.html.heading);
        var par = d.createElement(vsetup.html.footer);
        var div = d.getElementById(id);
        var separator = d.createElement("div");
        var style = d.createElement("style");
        var resize = function() {
            //It returns false when not enough space to draw a chart
            if (!VisualJS.getSize(id)) {
                return;
            }
            var height = VisualJS.height + (( typeof o.footer === "string" && o.footer !== "") ? 14 : 0), width = VisualJS.width + vsetup.margin, rule = "iframe{ float: left; width: " + Math.floor(((width - sepw) / 2) - vsetup.margin) + "px; height:" + height + "px; }"//Let's round it down instead of letting browsers use their own criterion
            ;
            if (style.styleSheet) {//IE
                style.styleSheet.cssText = rule;
            } else {
                style.innerHTML = rule;
            }
            separator.style.height = height + "px";
        };
        var span;

        var h1 = $('h1', {
            text : ( typeof o.title === "string") ? o.title : ""
        });

        var filters = $("div", {
            id : "filters"
        });

        par.innerHTML = ( typeof o.footer === "string") ? o.footer : "";
        par.style.clear = "both";
        div.appendChild(h1);
        div.appendChild(filters);
        div.appendChild(par);
        d.getElementsByTagName("head")[0].appendChild(style);
        separator.style.width = sepw + "px";
        if ("styleFloat" in separator.style) {//IE
            separator.style.styleFloat = "left";
        } else {
            separator.style.cssFloat = "left";
        }

        for (var i = 0; i < 2; i++) {
            span = d.createElement("span");
            if ( typeof o.load[i].id !== "string") {
                o.load[i].id = vsetup.compareids[i];
            }
            span.id = o.load[i].id;
            div.insertBefore(span, par);
            VisualJS.iframe(o.load[i], css[i]);
        }
        div.insertBefore(separator, span);
        resize();
        if ( typeof window.onorientationchange !== "undefined") {
            window.onorientationchange = resize;
        } else {
            window.onresize = resize;
        }
    },

    //if o is array, then loop
    load : function(o) {
        var listener = function(event) {
            var message = JSON.parse(event.data), post = function(obj) {
                event.source.postMessage(JSON.stringify(obj), "*");
            };

            if ( typeof message.action === "undefined") {
                post({
                    type : "error",
                    data : [{
                        id : "400",
                        label : "\"action\" is required."
                    }]
                });
            } else {
                if (message.action === "send") {
                    var id = message.id || VisualJS.id, vis = VisualJS.container[id] || VisualJS.container[id];
                    if (vis) {
                        if (vis.type === "cmap" && !vis.data[0].hasOwnProperty("label")) {
                            var label = [];
                            // key: "id", val:"label"
                            for (var m = VisualJS.map[vis.by], i = m.features.length; i--; ) {
                                label[m.features[i].properties[m.id]] = m.features[i].properties[m.label];
                            }

                            //add 'label' to data
                            for (var data = vis.data, j = data.length; j--; ) {
                                data[j].label = label[data[j].id];
                            }
                        }
                        post(vis);
                    } else {
                        post({
                            type : "error",
                            data : [{
                                id : "404",
                                label : "A visualisation with the specified \"id\" was not found"
                            }]
                        });
                    }
                } else {
                    post({
                        type : "error",
                        data : [{
                            id : "400",
                            label : "\"action\" value is not correct."
                        }]
                    });
                }
            }
        };
        if ( typeof VisualJS.setup === "undefined") {
            window.alert("Visual: Setup not found (visual.setup.js)!");
        }

        if (Object.prototype.toString.call(o) !== "[object Array]") {
            VisualJS.get(o);
        } else {
            for (var i = 0, len = o.length; i < len; i++) {
                VisualJS.get(o[i]);
            }
        }

        if (VisualJS.container[VisualJS.id].listen) {
            if (window.addEventListener) {
                addEventListener("message", listener, false);
            } else {
                document.attachEvent("onmessage", listener);
            }
        }

    },

    //o: object passed thru visual(o)
    get : function(o) {
        var vsetup = VisualJS.setup;
        var html = vsetup.html;
        var scanvas = vsetup.canvas;
        var headingElement = html.heading;
        var filtersElement = html.filters;
        var footerElement = html.footer;
        var ie8 = VisualJS.old || vsetup.func.old("ie9"), //Means: less than IE9
        isRange = function(r) {
            if ( typeof r !== "undefined" && Object.prototype.toString.call(r) === "[object Array]" && r.length === 2 && typeof r[0] === "number" && typeof r[1] === "number" && r[0] < r[1]) {
                return true;
            } else {
                return false;
            }
        }, validate = function(node, type, setup) {
            if ( typeof node === "string") {
                if ( typeof o[node] !== type) {
                    o[node] = setup[node];
                }
            } else {//node is an array
                if (node.length == 2 && typeof o[node[0]][node[1]] !== type) {
                    o[node[0]][node[1]] = setup[node[0]][node[1]];
                } else if (node.length == 3 && typeof o[node[0]][node[1]][[node[2]]] !== type) {
                    o[node[0]][node[1]][[node[2]]] = setup[node[0]][node[1]][[node[2]]];
                }
            }
        }, nts = [//[node, type, setup]
        //VisualJS
        ["show", "boolean", VisualJS], ["callback", "function", VisualJS],
        //vsetup
        ["id", "string", vsetup], ["listen", "boolean", vsetup],
        //scanvas
        ["dec", "number", scanvas], ["autoheading", "boolean", scanvas],
        //legend
        ["legend", "object", scanvas], [["legend", "show"], "boolean", scanvas], [["legend", "columns"], "number", scanvas], [["legend", "bottom"], "boolean", scanvas],
        //grid
        ["grid", "object", scanvas], [["grid", "border"], "number", scanvas], [["grid", "shadow"], "number", scanvas], [["grid", "line"], "number", scanvas], [["grid", "point"], "number", scanvas],
        //x axis
        ["axis", "object", scanvas], [["axis", "x"], "object", scanvas], [["axis", "x", "show"], "boolean", scanvas], [["axis", "x", "label"], "string", scanvas],
        //y axis
        [["axis", "y"], "object", scanvas], [["axis", "y", "show"], "boolean", scanvas], [["axis", "y", "label"], "string", scanvas],
        //horizontal
        ["horizontal", "boolean", scanvas]];

        //validate all nodes
        for (var i = 0; i < nts.length; i++) {
            validate(nts[i][0], nts[i][1], nts[i][2]);
        }

        VisualJS.id = o.id;
        VisualJS.pub[VisualJS.id] = {
            heading : null,
            legend : null
        };
        if ( typeof o.fixed === "object") {
            VisualJS.fixed = o.fixed;
        }

        if ( typeof o.unit === "object" && o.unit !== null) {
            validate(["unit", "label"], "string", scanvas);
            validate(["unit", "symbol"], "string", scanvas);
            validate(["unit", "position"], "string", scanvas);
        } else {
            o.unit = scanvas.unit;
        }

        o.lang = o.lang || vsetup.i18n.lang;
        if (!( typeof o.range === "number" || isRange(o.range))) {
            o.range = (scanvas.range.hasOwnProperty(o.type) && typeof scanvas.range[o.type] === "number" ) ? scanvas.range[o.type] : null// Only possible if "bar", "tbar", tsline" as setup does not provide a default value (number)
            ;
        }

        //add object o
        VisualJS.container[VisualJS.id] = o;

        var selector = "#" + VisualJS.id, canvasSel = selector + " ." + vsetup.canvasclass, //Currently, only used in Flot,
        container = VisualJS.container[VisualJS.id], getHeading = function() {
            if (container.autoheading === false) {
                return container.title;
            }

            var t = [], add = function(s, nw) {
                if ( typeof s === "string" && s !== "") {
                    if (nw === true) {
                        s = '<span class="' + VisualJS.setup.nowrapclass + '">' + s + "</span>";
                    }
                    t.push(s);
                }
            }, time;
            if (container.time !== null && typeof container.time === "object") {
                var start = tformat(container.time[0], VisualJS.id), end = tformat(container.time[container.time.length - 1], VisualJS.id);
                time = start + "&ndash;" + end;
            } else {
                time = tformat(container.time, VisualJS.id);
            }

            add(container.title, false);
            add(container.geo, true);
            add(time, true);

            return atext(t.join(". "));
        }, draw = function() {
            var chart = false;
            if ( typeof VisualJS.chart === "function") {//can be undefined if "cmap" && old browser
                tooltip();
                container.show && VisualJS.chart();

                var onResize = function() {
                    canvas();
                    if (container.callback !== null) {
                        container.callback.call({
                            id : VisualJS.id,
                            chart : chart,
                            heading : VisualJS.pub[VisualJS.id].heading,
                            legend : VisualJS.pub[VisualJS.id].legend
                        });
                    }
                };
                if ( typeof window.onorientationchange !== "undefined") {
                    window.onorientationchange = onResize;
                } else {
                    window.onresize = onResize;
                }

                chart = true;
            }
            if (container.callback !== null) {
                container.callback.call({
                    id : VisualJS.id,
                    chart : chart,
                    heading : VisualJS.pub[VisualJS.id].heading,
                    legend : VisualJS.pub[VisualJS.id].legend
                });
            }
        }, atext = function(s) {
            return String(s).replace(/&amp;/g, "&");
            //More general .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
        },
        // Add "script" to scripts' array
        // check: false adds script without verifying its existance (used when a parent lib is already missing and existing conditions cannot be met).
        addJS = function(script, check) {
            if (!check || !script.exists.call()) {
                VisualJS.scripts.push(script.js);
                return true;
            }
            return false;
        }, tooltipText = function(id, l, v) {
            var lab = ( typeof v === "number" && VisualJS.container[id].unit.label !== "") ? " " + VisualJS.container[id].unit.label : "";
            var si = ( typeof v === "number") ? VisualJS.container[id].unit.symbol : "";
            var va = format(v, id), t = (va !== VisualJS.setup.i18n.text.na[VisualJS.container[id].lang]) ? ((VisualJS.container[id].unit.position === "end") ? va + lab + (si !== "" ? " " + si : si) : si + va + lab ) : /* Value not available*/
            va;
            return l ? "<strong>" + t + "</strong> " + l : t;
            //no need to atext()
        }, format = function(n, id) {
            if ( typeof n === "undefined" || n === null || isNaN(n)) {
                return VisualJS.setup.i18n.text.na[VisualJS.container[id].lang];
            }
            if ( typeof n === "number") {
                var s = n.toFixed(VisualJS.container[id].dec), rgx = /(\d+)(\d{3})/, x = s.split("."), x1 = x[0], x2 = (x.length > 1) ? VisualJS.setup.i18n.text.dec[VisualJS.container[id].lang] + x[1] : "";
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, "$1" + VisualJS.setup.i18n.text.k[VisualJS.container[id].lang] + "$2");
                }
                return x1 + x2;
            }
            return "";
        }, tformat = function(t, id) {
            var f;

            if (!t) {//undefined, null, "", 0
                return null;
            }
            //Formatted dates are string numbers
            if (isNaN(t)) {
                return t;
            }
            switch(t.length) {
            case 5:
                f = "quarter";
                break;
            case 6:
                f = "month";
                break;
            default:
                return t;
            }
            var label = VisualJS.setup.i18n.text[f];

            if ( typeof label === "undefined") {
                return t;
            }
            var text = label[VisualJS.container[id].lang];
            if ( typeof text === "undefined") {
                return t;
            }
            var period = text[t.slice(4) - 1];
            if ( typeof period === "undefined") {
                return t;
            }
            return period + " <span>" + t.slice(0, 4) + "</span>";
        },
        /* html: tooltip html content
         x, y: mouse coordinates
         Returns: posTT (tooltip coordinates [x,y])
         */
        tooltip = function() {
            var d = document;
            if (!d.getElementById(VisualJS.setup.tooltipid)) {
                var tt = d.createElement("div");
                tt.id = VisualJS.setup.tooltipid;
                tt.style.display = "none";
                d.body.appendChild(tt);
            }
        }, getTick = function(x, y, item, label, pos) {
            if (o.type === "pie") {
                return null;
            } else if (o.type !== "rank" && o.type !== "bar") {
                if (o.horizontal) {
                    if (!(stacked || series.length === 1)) {
                        return x;
                    }
                    return ticks[y][0];
                } else {
                    if (stacked || series.length === 1) {
                        return ticks[x][1];
                    } else if (o.type === "pyram") {
                        return series[pos.x < 0 ? 0 : 1].data[item.dataIndex][0];
                    } else {
                        return ticks[item.dataIndex][1];
                    }
                    return false;
                }
            }
        }, getValue = function(x, y, item, series) {
            // var val = (o.type === "pie") ? y[0][1] : (o.type === "pyram") ? Math.abs(x) : (o.type !== "rank") ? ((o.type !== "tsbar" && o.type !== "barline") ? y : o.horizontal ?
            // series[item.seriesIndex].data[y][0] : (stacked || series.length === 1) ? series[item.seriesIndex].data[x][1] : y ) : x;

            if (o.type === "pie") {
                return y[0][1];
            } else if (o.type === "pyram") {
                return Math.abs(x);
            } else if (o.type === "rank") {
                return x;
            } else if (o.type !== "tsbar" && o.type !== "barline") {
                return y;
            }
            if (o.horizontal) {
                if (!(stacked || series.length === 1)) {
                    return x;
                }
                return series[item.seriesIndex].data[y][0];
            } else {
                if (stacked || series.length === 1) {
                    return series[item.seriesIndex].data[x][1];
                }
            }
            return x;
        }, canvas;

        if (o.type === "cmap") {
            if (ie8) {
                document.getElementById(VisualJS.id).innerHTML = "<p>" + vsetup.i18n.text.oldbrowser[container.lang] + "</p>";
            } else {
                if ( typeof o.by !== "string") {
                    return;
                }

                addJS(vsetup.lib.maps, true);
                addJS(vsetup.lib.d3, true);
                addJS(vsetup.map[o.by], true);

                ///////// CHART
                VisualJS.chart = function() {
                    var heading = getHeading();
                    var map = VisualJS.map[o.by];
                    var mwidth = map.area[0];
                    var mheight = map.area[1];
                    //hasGroups: grouped property exists, is object (array), has content and data seems to include a group property
                    var hasGroups = ( typeof o.grouped === "object" && typeof o.grouped.label === "object" && o.grouped.label.length > 0 && o.data[0].hasOwnProperty("group"));
                    var hasValues = o.data[0].hasOwnProperty("val");
                    var num = (hasGroups) ? o.grouped.label.length : ((hasValues) ? vsetup.colors.map.max : 1), prefix = vsetup.colorclassprefix;
                    var colors = VisualJS.func.colors(vsetup.colors.map.base, num, "fill", prefix, ((hasGroups && typeof o.grouped.color === "object" && o.grouped.color.length === o.grouped.label.length) ? o.grouped.color : []), VisualJS.id);
                    var visual = d3.select(selector);
                    var projection = d3.geo[map.projection]();
                    //Support for projections that don't support the center method (albersUSA, for example).
                    var proj = ( typeof map.center === "object" && typeof projection.center === "function") ? projection.center(map.center) : projection;
                    var xy = proj.scale(map.scale).translate([mwidth / 2, mheight / 2]);
                    var path = d3.geo.path().projection(xy);
                    var tooltip = d3.select("#" + vsetup.tooltipid);

                    canvas = function() {
                        visual.html("<" + headingElement + "></" + headingElement + "><" + filtersElement + " id = 'filters'></" + filtersElement + "><" + footerElement + "></" + footerElement + ">");
                        d3.select(selector + " " + headingElement).html(heading);
                        d3.select(selector + " " + footerElement).html(atext(o.footer || ""));
                        $('<div>', {
                            id : 'legend'
                        }).addClass("legend").addClass('visual').appendTo(selector + " " + footerElement);

                        //It returns false when not enough space to draw a chart
                        if (!VisualJS.getSize(VisualJS.id)) {
                            return;
                        }
                        var id = VisualJS.id;
                        var valors = d3.map();
                        var labels = d3.map();
                        var hasLabels = o.data[0].hasOwnProperty("label");
                        var val = [], groups;
                        //key: id, value: group
                        var setGroups = function() {
                        };
                        var legend = function() {
                        };
                        var getAreaLabel;
                        var colorClass;
                        var quantiles;
                        var hh = VisualJS.height / mheight;
                        var ww = VisualJS.width / mwidth;
                        var width = Math.min(Math.round(mwidth * hh), VisualJS.width);
                        var height = Math.min(Math.round(mheight * ww), VisualJS.height);
                        var left = Math.floor((VisualJS.width - width) / 2);
                        var topbottom = Math.floor((VisualJS.height - height) / 2);
                        var scale = (hh < ww) ? hh : ww;
                        var vis = visual.insert("svg:svg", footerElement).attr("width", width).attr("height", height);

                        if (hasGroups) {
                            groups = d3.map();
                            setGroups = function(g, r) {
                                g.set(r.id, r.group);
                            };
                            colorClass = function(g, v, p) {
                                return prefix + (g.get(p[map.id]) - 1);
                            };
                            getAreaLabel = function(g, p) {
                                var em = o.grouped.label[(g.get(p[map.id]) - 1)];
                                var ret = (hasLabels) ? labels.get(p[map.id]) : (map.labels ? (map.labels[o.lang] ? p[map.labels[o.lang]] : p[map.label]) : p[map.label]);

                                if ( typeof em !== "undefined") {
                                    ret += " <em>" + em + "</em>";
                                }
                                return ret;
                            };
                        } else {
                            if (hasValues) {
                                colorClass = function(g, v, p, inf, sup) {
                                    var value = v.get(p[map.id]);
                                    if ( typeof value === "undefined") {
                                        return "";
                                    }
                                    if (inf === sup) {//No variation in the data: use centered color (quantize would return undefined)
                                        return prefix + (num / 2).toFixed(0);
                                    }
                                    var quantize = d3.scale.quantize().domain([inf, sup]).range(d3.range(num).map(function(i) {
                                        return prefix + i;
                                    }));
                                    return quantize(value);
                                };
                                legend = VisualJS.func.legend;
                            } else {
                                colorClass = function(g, v, p) {
                                    return (v.get(p[map.id]) !== "") ? "" : prefix + (num - 1);
                                };
                            }
                            getAreaLabel = function(g, p) {
                                return (hasLabels) ? labels.get(p[map.id]) : (map.labels ? (map.labels[o.lang] ? p[map.labels[o.lang]] : p[map.label]) : p[map.label]);
                            };
                        }

                        for (var i = 0, odata = o.data, nobs = odata.length; i < nobs; i++) {
                            var r = odata[i];
                            if (r.hasOwnProperty("val")) {
                                if (r.val !== null) {//Remove regions with val: null
                                    valors.set(r.id, r.val);
                                    val.push(r.val);
                                }
                            } else {//If no val property on data (for example, grouped info), then do not print value on tooltip.
                                valors.set(r.id, "");
                            }
                            if (hasLabels) {//key=id, value=label
                                labels.set(r.id, r.label);
                            }
                            setGroups(groups, r);
                            //Does nothing if no groups
                        }
                        val.sort(function(a, b) {
                            return a - b;
                        });

                        var increase = nobs / 5;
                        var legendValues = [val[0]];
                        for (var i = 0; i < nobs; i++) {
                            if (increase < i) {
                                legendValues.push(val[i]);
                                increase = increase + increase;
                            }
                        }

                        var quantiles = [];
                        if ( typeof container.range === "number") {//Number
                            quantiles.push(d3.quantile(val, container.range * 20));
                            quantiles.push(d3.quantile(val, container.range * 40));
                            quantiles.push(d3.quantile(val, container.range * 60));
                            quantiles.push(d3.quantile(val, container.range * 80));
                        } else {//isRange (can't be null)
                            quantiles.push(container.range[0]);
                            quantiles.push(container.range[1]);
                        }

                        vis.style("margin-left", left + "px");
                        vis.style("margin-top", topbottom + "px");
                        vis.style("margin-bottom", topbottom + "px");
                        vis.append("svg:g").attr("class", vsetup.areaclass).attr("transform", "scale(" + scale + ")").selectAll("path").data(map.features).enter().append("svg:path").attr("class", function(d) {
                            if (d.properties[map.id] === "" || d.properties[map.label] === "" || //Polygon is not relevant
                            (!hasValues && typeof valors.get(d.properties[map.id]) === "undefined")) {//Don't hover non-highlighted areas
                                return prefix + "nohover";
                            }
                            return colorClass(groups, valors, d.properties, quantiles[0], quantiles[quantiles.length - 1]);
                        }).attr("d", path).on("mousemove", function(d) {
                            if (d.properties[map.id] !== "" && d.properties[map.label] !== "" && //Polygon is not relevant
                            (hasValues || hasGroups || typeof valors.get(d.properties[map.id]) !== "undefined")) {
                                VisualJS.showTooltip(tooltipText(id, getAreaLabel(groups, d.properties), valors.get(d.properties[map.id])), d3.event.pageX, d3.event.pageY);
                            }
                        }).on("mouseout", function() {
                            return tooltip.style("display", "none");
                        });

                        if ( typeof legendValues !== "undefined") {//No grouped nor highlighted-area map
                            var infsup = [tooltipText(id, null, quantiles[0]), tooltipText(id, null, quantiles[1]), tooltipText(id, null, quantiles[2]), tooltipText(id, null, quantiles[3])];
                            var lightdark = [colors[colors.length - 25]/*lighter color*/, colors[colors.length - 50], colors[colors.length - 75], colors[0] /*darker color*/];
                            var strict = [quantiles[0] < legendValues[0] || format(quantiles[0], id) === format(legendValues[0], id), quantiles[1] < legendValues[1] || format(quantiles[1], id) === format(legendValues[1], id), quantiles[2] < legendValues[2] || format(quantiles[2], id) === format(legendValues[2], id), quantiles[3] > legendValues[legendValues.length - 1] || format(quantiles[3], id) === format(legendValues[legendValues.length - 1], id)];

                            VisualJS.pub[VisualJS.id].legend = {
                                color : lightdark,
                                text : infsup,
                                symbol : [(strict[0] ? "==" : "<="), (strict[1] ? "==" : ">"), (strict[2] ? "==" : ">"), (strict[3] ? "==" : ">=")]
                            };

                            if (container.legend.show && typeof map.legend === "object") {//If map.legend specified (area array), draw it
                                legend(//new params since 0.8.0
                                infsup, lightdark, vis, tooltip, map.area, map.legend, strict);
                            }
                        }

                        VisualJS.pub[VisualJS.id].heading = heading;
                        $("#visual h1").css('width', $('body').outerWidth() * 0.9);
                        $("#visual p").css('width', $('body').outerWidth() * 0.9);
                    };
                    canvas();
                };
            }
        } else {
            var hasFlot;
            //(o.type==="tsline" || o.type==="tsbar" || o.type==="bar" || o.type==="rank"  || o.type==="pyram")
            if (addJS(vsetup.lib.jquery, true)) {//No jQuery? Add Flot without checking
                hasFlot = false;
                addJS(vsetup.lib.jquery.flot, false);
                addJS(vsetup.lib.jquery.flot.jFlotLabel, false);
                addJS(vsetup.lib.jquery.flot.time, false);
            } else {//Has jQuery but not Flot?
                if (addJS(vsetup.lib.jquery.flot, true)) {
                    hasFlot = false;
                } else {
                    hasFlot = true;
                }
                addJS(vsetup.lib.jquery.flot.jFlotLabel, hasFlot);
                addJS(vsetup.lib.jquery.flot.time, hasFlot);
            }

            if (ie8) {
                addJS(vsetup.lib.excanvas, true);
            }

            var transform = function() {
            }, //Local function in load(). It will be redefined.
            series = [], ticks = [], opt = [], max, stacked = o.stacked || false, ts = function() {
                //If autoheading, check for leading and trailing zeros
                if (container.autoheading) {
                    var tlen = o.time.length, dlen = o.data.length, d, t, u, n, nuls, ulen;

                    //trim leading nulls
                    if (o.data[0].val[0] === null) {

                        for ( t = 0, n = true, nuls = []; t < tlen; t++) {
                            for ( d = 0; d < dlen; d++) {
                                n = n && (o.data[d].val[t] === null);
                            }
                            if (!n) {
                                break;
                            }
                            nuls.push(n);
                        }
                        ulen = nuls.length;
                        for ( u = 0; u < ulen; u++) {
                            if (nuls[u]) {
                                o.time.shift();
                                for ( d = 0; d < dlen; d++) {
                                    o.data[d].val.shift();
                                }
                            }
                        }
                        tlen = o.time.length;
                        //update
                    }

                    //trim trailing nulls (same routine in reverse order)
                    if (o.data[0].val[tlen - 1] === null) {
                        for ( t = tlen, n = true, nuls = []; t--; ) {
                            for ( d = 0, dlen = o.data.length; d < dlen; d++) {
                                n = n && (o.data[d].val[t] === null);
                            }
                            if (!n) {
                                break;
                            }
                            nuls.push(n);
                        }

                        for ( u = nuls.length; u--; ) {
                            if (nuls[u]) {
                                o.time.pop();
                                for ( d = 0; d < dlen; d++) {
                                    o.data[d].val.pop();
                                }
                            }
                        }
                    }
                }

                var fbars = function() {
                    return;
                    //When stacked an undefined is expected in bars (null or false won't work)
                };
                if (stacked) {
                    addJS(vsetup.lib.jquery.flot.stack, hasFlot);
                    //Check plugin only if we have Flot
                } else {
                    if (o.type === "tsbar" || o.type === "barline") {
                        addJS(vsetup.lib.jquery.flot.orderbars, hasFlot);
                        //Check plugin only if we have Flot
                        fbars = function(si) {
                            return si.bars;
                        };
                    }
                }
                transform = function(d, t) {// Local in load(), not ts().
                    VisualJS.ticks = [];
                    var i, len;
                    for ( i = 0, len = t.length; i < len; i++) {
                        if (o.horizontal) {
                            ticks.push([i, t[i]]);
                            VisualJS.ticks.push([t[i], i]);
                            //keep original ticks
                        } else {
                            ticks.push([i, t[i]]);
                            VisualJS.ticks.push([i, t[i]]);
                            //keep original ticks
                        }
                    }
                    for ( i = 0, len = d.length; i < len; i++) {
                        for (var data = [], v = d[i].val, vlen = v.length, j = 0; j < vlen; j++) {
                            if (!o.maxValue || v[j] > o.maxValue) {
                                o.maxValue = v[j];
                            }
                            if (o.horizontal) {
                                data.push([v[j], j]);
                            } else {
                                data.push([j, v[j]]);
                            }

                        }
                        if ((o.type !== "tsbar" && o.type !== "barline") || stacked || len === 1) {//if tsbar with one series (len===1) must be treated like stacked (even though it's not)
                            series.push({
                                label : d[i].label,
                                data : data
                            });
                        } else {
                            series.push({
                                label : d[i].label,
                                data : data,
                                bars : {
                                    show : true,
                                    barWidth : 0.2,
                                    order : i + 1,
                                    lineWidth : 2
                                }
                            });
                            //barWidth should probably be computed dynamically considering number of series (this value allows only for a max of 3 series)
                        }
                    }
                    var slen = series.length;
                    for ( i = 0; i < slen; i++) {
                        opt.push({
                            data : series[i].data,
                            label : series[i].label.slice(0, 40),
                            bars : fbars(series[i]),
                            shadowSize : container.grid.shadow
                        });
                    }
                    if (o.type === "barline" && !o.linesFirst) {
                        var firstElement = series.shift();
                        series.push(firstElement);
                        firstElement = opt.shift();
                        opt.push(firstElement);
                    }
                    shlegend = o.legend.show;
                    //(slen > 1);
                };
                return getHeading();
            }, shlegend, stack, lines, points, bars, heading, pie;

            Array.max = function(a) {
                return Math.max.apply(Math, a);
            };

            var widthRatio = 1;
            var miniWidthRatio = 1;
            var heightRatio = 1;
            if (!o.legend.bottom) {
                miniWidthRatio = 0.7;
            } else {
                heightRatio = 0.9;
            }

            //0.70;
            switch(o.type) {
            case "pyram":
                addJS(vsetup.lib.jquery.flot.pyramid, hasFlot);
                //Check plugin only if we have Flot

                points = false;
                bars = false;
                heading = getHeading();
                transform = function(d, t, b) {
                    max = Math.max(Array.max(d[0].val), Array.max(d[1].val));
                    series[0] = {
                        label : d[0].label,
                        data : [],
                        pyramid : {
                            direction : "L"
                        }
                    };
                    series[1] = {
                        label : d[1].label,
                        data : []
                    };
                    for (var i = 0, len = b.length; i < len; i++) {
                        series[0].data[i] = [b[i], d[0].val[i]];
                        series[1].data[i] = [b[i], d[1].val[i]];
                        // ticks[i]=b[i]; ticks are not used
                    }
                };
                shlegend = true;
                stack = false;
                stacked = false;
                //if stacked was included when pyram, false it
                lines = false;
                widthRatio = miniWidthRatio;
                break;
            case "rank":
                var data = [];
                lines = false;
                points = false;
                bars = true;
                heading = getHeading();
                transform = function(d) {
                    var values = [];
                    for (var i = 0, len = d.length; i < len; i++) {
                        //Include in reverse order
                        ticks[i] = [i, d[len-i-1][0]];
                        var val = d[len-i-1][1];
                        values.push(val);
                        data[i] = [val, i];
                    }
                    series = {
                        data : data
                    };
                    max = Array.max(values);
                };
                shlegend = false;
                //Currently only one series allowed when rank (no series loop)
                stack = false;
                //See previous line
                break;
            case "bar":
                addJS(vsetup.lib.jquery.flot.categories, hasFlot);
                //Check plugin only if we have Flot
                points = false;
                bars = true;
                heading = getHeading();
                lines = false;
                transform = function(d, t, b) {
                    var i, len;
                    if ( typeof b !== "object" || b === null) {//Without "by": simplified call
                        //was simply series=d
                        len = d.length;
                        for ( i = 0; i < len; i++) {
                            if (d[i][1] !== null) {
                                series.push(['<span>' + d[i][0] + '</span>', d[i][1]]);
                                //span: temporary solution to avoid x-axis label overlapping
                            }
                        }
                    } else {
                        //An array without "label" and "val"
                        if ( typeof d[0] === "number") {
                            len = b.length;
                            for ( i = 0; i < len; i++) {
                                if (d[i] !== null) {
                                    series.push(['<span">' + b[i] + '</span>', d[i]]);
                                    //span: temporary solution to avoid x-axis label overlapping
                                }
                            }
                        }
                        //Pending: An array with "label" and "val" for multiple bars per category...
                    }
                    shlegend = (series.length > 1);
                };
                stack = true;
                break;
            case "tsline":
                heading = ts();
                stack = o.stacked;
                points = true;
                bars = false;
                lines = true;
                widthRatio = miniWidthRatio;
                break;
            case "barline":
            case "tsbar":
                heading = ts();
                stack = o.stacked;
                points = false;
                bars = true;
                lines = false;
                widthRatio = miniWidthRatio;
                break;
            case "pie":
                addJS(vsetup.lib.jquery.flot.pie, hasFlot);
                //Check plugin only if we have Flot

                var data = [];
                heading = getHeading();
                stack = null;
                points = false;
                bars = false;
                lines = false;
                pie = true;

                transform = function(d) {
                    var values = [];
                    for (var i = 0, len = d.length; i < len; i++) {
                        //Include in reverse order
                        // ticks[i] = [i, d[len-i-1][0]];
                        var val = d[len-i-1][1];
                        values.push(val);
                        data.push({
                            label : d[len-i-1][0],
                            data : val,
                            color : vsetup.colors.series[i % vsetup.colors.series.leght]
                        });
                    }

                    data.sort(function(a, b) {
                        if (!a) {
                            return 1;
                        }
                        if (!b) {
                            return -1;
                        }
                        return b.data - a.data;
                    });
                    series = {
                        data : data
                    };
                    max = Array.max(values);
                };
                widthRatio = miniWidthRatio;
                break;
            }

            VisualJS.chart = function() {
                transform(o.data, o.time, o.by);
                $.fn.UseTooltip = function(id) {
                    var previousPoint = [];

                    $(this).bind("plothover", function(event, pos, item) {
                        if (item) {
                            if (previousPoint != [item.seriesIndex, item.dataIndex]) {
                                previousPoint = [item.seriesIndex, item.dataIndex];
                                var x = item.datapoint[0];
                                var y = item.datapoint[1];
                                var itemlab = (o.type !== "bar") ? item.series.label : series[x][0];
                                var label = (o.type !== "rank") ? itemlab : ticks[y][1];
                                var tick = getTick(x, y, item, label, pos);
                                var val = getValue(x, y, item, series);
                                VisualJS.showTooltip(tooltipText(id, (tick) ? label + " (" + tick + ")" : label, val), pos.pageX, //item.pageX
                                pos.pageY //item.pageY
                                );
                            }
                        } else {
                            $("#" + vsetup.tooltipid).hide();
                            previousPoint = [];
                        }
                    });
                };

                shlegend = container.legend && shlegend;
                var setup = {
                    colors : vsetup.colors.series,
                    series : {
                        stack : stack,
                        bars : {
                            show : bars,
                            barWidth : 0.7,
                            align : "center",
                            fill : 0.9
                        },
                        lines : {
                            show : lines,
                            lineWidth : container.grid.line,
                            fill : o.fillLine
                        },
                        points : {
                            show : points,
                            radius : container.grid.point
                        },
                        pie : {
                            show : pie,
                            radius : 1,
                            label : {
                                show : true,
                                radius : 3 / 4,
                                formatter : function(label, series) {
                                    return "<div style='font-size:150%; text-align:center; padding:2px; color:white;'>" + Math.round(series.percent) + "%</div>";
                                },
                                background : {
                                    opacity : 0.5
                                }
                            },
                            combine : {
                                color : '#ff6a6a',
                                threshold : o.combineThreshold,
                                label : vsetup.i18n.text.other[o.lang]
                            },
                        }
                    },
                    legend : {
                        show : shlegend,
                        container : "#legend",
                        noColumns : o.legend.bottom ? (o.legend.columns ? o.legend.columns : 6) : 1
                    },
                    grid : {
                        borderWidth : container.grid.border,
                        hoverable : true,
                        clickable : false,
                        mouseActiveRadius : 10,
                    },
                    xaxis : {
                        show : container.axis.x.show,
                        axisLabel : container.axis.x.label,
                        axisLabelUseCanvas : true,
                    },
                    yaxis : {
                        min : container.forceYAxisMinValue,
                        show : container.axis.y.show,
                        axisLabel : container.axis.y.label,
                        axisLabelUseCanvas : true,
                        max : o.useSameAxisMaxValue ? o.maxValue * 1.1 : null
                    },
                };
                if (container.axis && container.axis.y && container.axis.y.label2) {
                    setup.y2axis = {
                        min : container.forceYAxisMinValue,
                        show : container.axis.y.show,
                        axisLabel : container.axis.y.label2,
                        axisLabelUseCanvas : true,
                        max : o.useSameAxisMaxValue ? o.maxValue * 1.1 : null
                    };
                }
                var processBar = function(id, setup, ticklen) {
                    setup.yaxis.tickFormatter = function(val) {
                        return format(val, id);
                    };
                    if (setup.y2axis) {
                        setup.y2axis.tickFormatter = function(val) {
                            return format(val, id);
                        };
                    }
                    var ratio = VisualJS.width / ticklen;
                    var xticks = [];
                    var digcrit = "01";
                    var textFontSize = $(".visual p").css('fontSize').replace(/[^0-9.]/g, "");

                    //first month

                    if (!o.horizontal && typeof container.range !== "number" && container.range !== null) {//isRange
                        setup.yaxis.min = container.range[0];
                        //we don't check if min provided is lower than actual min
                        setup.yaxis.max = container.range[1];
                        //we don't check if max provided is greater than actual max
                    } else if (o.horizontal) {
                        setup.yaxis.ticks = ((VisualJS.height / ticklen) > 11) ? ticks.slice(0) : 0;
                    }

                    switch(VisualJS.ticks[0][1].length) {//Assuming all time periods follow the same pattern
                    case 4:
                        //Annual time series (4 digits)
                        // Magic rule: Only one year of every two must be displayed if width (mini) is small in comparison with # of ticks
                        if (ratio < 45) {
                            var freq = (ratio > 30) ? 2 : ((ratio > 15) ? 3 : ((ratio > 8) ? 5 : 7));
                            //if very small, only paint 1 of 3 ticks
                            for ( i = 0; i < ticklen; i++) {
                                xticks[i] = (i % freq) ? [ticks[i][0], ""] : [ticks[i][0], ticks[i][1]];
                            }
                            setup.xaxis.ticks = xticks;
                        } else {
                            setup.xaxis.ticks = ticks;
                        }
                        break;
                    case 5:
                        //quarterly (5 digits)
                        digcrit = "1";
                    //first quarter
                    case 6:
                        //monthly (6 digits)
                        //Magic rule: do not show month/quarter when width is small in comparison with # of ticks
                        if (ratio < 35) {
                            for ( i = 0; i < ticklen; i++) {
                                xticks[i] = (VisualJS.ticks[i][1].slice(4) !== digcrit) ? [VisualJS.ticks[i][0], ""] : [VisualJS.ticks[i][0], VisualJS.ticks[i][1].slice(0, 4)];
                                //Formatting time
                                ticks[i][1] = tformat(VisualJS.ticks[i][1], VisualJS.id);
                            }
                            setup.xaxis.ticks = xticks;
                        } else {
                            for ( i = 0; i < ticklen; i++) {
                                //Formatting time
                                ticks[i][1] = tformat(VisualJS.ticks[i][1], VisualJS.id);
                            }
                            setup.xaxis.ticks = ticks;
                        }
                        break;
                    default:
                        //leave ticks alone
                        if (!o.horizontal) {
                            if (ticklen > 5) {
                                var newTicks = [];
                                var showItem = ((ticklen / (ratio / (textFontSize / VisualJS.ticks[0][1].length))) + 1).toFixed(0);
                                //(ticklen / 4).toFixed(0);
                                for ( i = 0; i < ticklen; i++) {
                                    xticks[i] = (i % showItem !== 0 || (i === (ticklen - 1) && showItem !== 1)) ? [VisualJS.ticks[i][0], ""] : [VisualJS.ticks[i][0], VisualJS.ticks[i][1]];
                                    //Formatting time
                                    ticks[i][1] = tformat(VisualJS.ticks[i][1], VisualJS.id);
                                }
                                setup.xaxis.ticks = xticks;
                            } else {
                                setup.xaxis.ticks = ticks;
                            }
                        }
                    }
                    return setup;
                };
                canvas = function() {
                    var id = VisualJS.id, ticklen = ticks.length, i;
                    $(selector).html("<" + headingElement + "></" + headingElement + "><" + footerElement + "></" + footerElement + ">");
                    $(selector + " " + headingElement).html(heading);
                    $(selector + " " + footerElement).html(atext(o.footer || ""));

                    $("#legend").remove();
                    var legendElemet = $('<div>', {
                        id : 'legend'
                    });
                    if (!o.legend.bottom) {
                        legendElemet.addClass("legendRight").addClass('visual').prependTo('body');
                    } else {
                        legendElemet.addClass("legendBottom").addClass('visual').insertBefore(selector + " " + footerElement);
                    }
                    //It returns false when not enough space to draw a chart
                    if (!VisualJS.getSize(id)) {
                        return;
                    }
                    $(selector + " " + headingElement).after('<div class="' + vsetup.canvasclass + ' ' + VisualJS.visualsize + '" style="width: ' + VisualJS.width * widthRatio + 'px; height: ' + VisualJS.height * heightRatio + 'px;"></div>');
                    $(selector + " " + headingElement).after('<' + filtersElement + ' id="filters"></' + filtersElement + '>');

                    var plot;
                    switch(o.type) {
                    case "pyram":
                        setup.series.pyramid = {
                            show : true,
                            barWidth : 1
                        };
                        //ticks are undefined for pyramid: we remove the Y-axis if too many categories. Instead of ticklen, series[0].data.length is used.
                        setup.yaxis.show = ((VisualJS.height / series[0].data.length) > 11 ) ? container.axis.y : false;
                        //If too many categories and not enough height, remove y-labels
                        setup.xaxis.max = ( typeof container.range === "number") ? max * container.range : container.range[1];
                        //isRange (can't be null). min is ignored. If max is lower than actual max it will be discarded (but increase in VisualJS.range won't be applied). Otherwise: Increase area using VisualJS.range in the longest bar
                        setup.xaxis.tickFormatter = function(val) {
                            return format(val, id);
                        };

                        plot = $.plot(canvasSel, series, setup);
                        break;
                    case "rank":
                        setup.series.bars.horizontal = true;
                        setup.yaxis.ticks = ((VisualJS.height / ticklen) > 11) ? ticks.slice(0) : 0;
                        //If too many categories and not enough height, remove y-labels

                        if ( typeof container.range === "number") {
                            setup.xaxis.max = max * container.range;
                        } else {//isRange (can't be null)
                            setup.xaxis.min = container.range[0];
                            //we don't check if min provided is lower than actual min
                            setup.xaxis.max = container.range[1];
                            //we don't check if max provided is greater than actual max
                        }
                        setup.xaxis.tickFormatter = function(val) {
                            return format(val, id);
                        };
                        setup.yaxis.autoscaleMargin = 0;
                        setup.series.bars.barWidth = 0.5;

                        plot = $.plot(canvasSel, [series], setup);
                        break;
                    case "bar":
                        setup.xaxis.mode = "categories";
                        setup.xaxis.tickLength = 0;
                        setup.yaxis.tickFormatter = function(val) {
                            return format(val, id);
                        };
                        if ( typeof container.range !== "number" && container.range !== null) {//isRange
                            setup.yaxis.min = container.range[0];
                            //we don't check if min provided is lower than actual min
                            setup.yaxis.max = container.range[1];
                            //we don't check if max provided is greater than actual max
                        }

                        plot = $.plot(canvasSel, [series], setup);
                        break;
                    case "pie":
                        $.plot(canvasSel, series.data, setup);
                        break;
                    //Time series
                    case "tsline":
                        setup = processBar(id, setup, ticklen);
                        setup.grid.markings = [{
                            color : "#999",
                            lineWidth : 1,
                            yaxis : {
                                from : 0,
                                to : 0
                            }
                        }];
                        plot = $.plot(canvasSel, opt, setup);
                        //Zero line in tsline
                        break;
                    case "barline":
                        setup = processBar(id, setup, ticklen);

                        var lineOptsFunc = function(lineData) {
                            return lineOpts = {
                                stack : false,
                                label : lineData.label,
                                data : lineData.data,
                                lines : {
                                    show : true
                                },
                                bars : {
                                    show : false
                                },
                                points : {
                                    show : true,
                                    radius : 3
                                },
                                yaxis : 2
                            };
                        };
                        //if (o.multipleAxis) {
                        var lineData = o.linesFirst ? opt.slice(1, opt.length) : opt.pop();

                        //last element
                        if (lineData.length) {
                            opt = [opt.shift()];
                            for (var i = 0; i < lineData.length; i++) {
                                opt.push(lineOptsFunc(lineData[i]));
                            }
                        } else {
                            opt.push(lineOptsFunc(lineData));
                        }
                        //}

                        setup.yaxes = [{
                            min : 0,
                            tickFormatter : function(val) {
                                return format(val, id);
                            },
                            max : o.useSameAxisMaxValue ? o.maxValue * 1.1 : null
                        }, {
                            min : 0,
                            // align if we are to the right
                            alignTicksWithAxis : "right" == "right" ? 1 : null,
                            position : "right",
                            tickFormatter : function(val) {
                                return format(val, id);
                            },
                            max : o.useSameAxisMaxValue ? o.maxValue * 1.1 : null
                        }];
                        plot = $.plot(canvasSel, opt, setup);
                        break;
                    case "tsbar":
                        setup = processBar(id, setup, ticklen);
                        if (o.horizontal) {
                            setup.series.bars.horizontal = o.horizontal;
                        }
                        plot = $.plot(canvasSel, opt, setup);
                    }
                    $("#visual #filters").css('width', $("#visual .VisualJScanvas").outerWidth() * 0.9);
                    $("#visual h1").css('width', $("#visual .VisualJScanvas").outerWidth() * 0.9);
                    $("#visual p").css('width', $("#visual .VisualJScanvas").outerWidth() * 0.9);
                    if (!o.legend.bottom) {
                        $("#legend").css('height', $("#visual .VisualJScanvas").outerHeight() * 0.9);
                        $("#legend").css('width', ($("body").outerWidth() - $("#visual .VisualJScanvas").outerWidth()) * 0.85);
                    } else {
                        $("#legend").css('width', $("body").outerWidth() * 0.95);
                    }
                    $(canvasSel).UseTooltip(VisualJS.id);
                    VisualJS.pub[VisualJS.id].heading = heading;
                };
                canvas();
            };
        }

        if (VisualJS.scripts.length && typeof LazyLoad === "object" && addJSLibraries) {
            LazyLoad.js(VisualJS.scripts, draw);
            addJSLibraries = false;
        } else {//If no Lazyload, user must manually include the required libs
            draw();
        }
    }
};

if ( typeof visual !== "function") {
    //Create the visual alias
    var visual = VisualJS.load;
} //If you already have a visual() function, use VisualJS.load({...});