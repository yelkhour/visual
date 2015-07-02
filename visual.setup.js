/*
 * Copyright (c) 2014 Institut d'Estadistica de Catalunya (Idescat)
 * http://www.idescat.cat (https://github.com/idescat/visual)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

VisualJS.setup = { // v.0.10.0
  // Colors for maps and series
  colors: {
    map: {
      max: 100, // If not enough colors, legend is deceiving and it's better to
      // remove it
      base: "#f58220",
      error: "#FF0000",
    },
    series: ["#f58220", "#00b5ec", "#60bb46", "#db4599", "#004c98"]
  // series: ["#DE9848", "#A7CFF2", "#6D6E6F", "#B7CF87", "#616FAB", "#E4F0FC",
  // "#F2D875", "#9893C5"]
  },
  // Default options (They can be dynamically modified thru visual().)
  canvas: {
    unit: {
      label: "",
      symbol: "",
      position: "end"
    },
    legend: {
      show: true
    },
    grid: {
      border: 0, // grid border width
      shadow: 4, // line shadow width
      line: 2, // line width
      point: 2
    // point radius
    },
    axis: { // show axes?
      x: true,
      y: true
    },
    dec: 2, // Show only needed decimals (remove ending zeros) unless
    // (recommended) valid dec has been specified by user
    autoheading: false,

    // Arrays are not accepted here. "bar", "tsline" and "tsbar" currently don't
    // accept a number.
    range: {
      // Quantile. No filtering: 0
      cmap: 0.01, // Used in color assignation in maps

      // Multiplier. No filtering: 1
      rank: 1.02, // Increase area horizontally by 2% of the longest bar
      pyram: 1.02
    // Increase area horizontally by 2% of the longest bar
    }
  },

  // Internationalization options
  i18n: {
    lang: "fi", // default lang when no lang is specified
    text: {
      dec: { // decimal separator
        ca: ",",
        es: ",",
        en: ".",
        fi: ",",
        sv: ","
      },
      k: { // thousands separator
        ca: ".",
        es: ".",
        en: ",",
        fi: " ",
        sv: " "
      },
      month: { // Month axis labels
        ca: ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set",
            "Oct", "Nov", "Des"],
        es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep",
            "Oct", "Nov", "Dic"],
        en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
            "Oct", "Nov", "Dec"],
        fi: ["Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä", "Heinä",
            "Elo", "Syys", "Loka", "Marras", "Joulu"],
        sv: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep",
            "Okt", "Nov", "Dec"],
      },
      quarter: { // Quarter axis labels
        ca: ["I", "II", "III", "IV"],
        es: ["I", "II", "III", "IV"],
        en: ["Q1", "Q2", "Q3", "Q4"],
        fi: ["Q1", "Q2", "Q3", "Q4"],
        sv: ["Q1", "Q2", "Q3", "Q4"]
      },
      na: { // text in tooltip when value is not available
        ca: "Valor no disponible",
        es: "Valor no disponible",
        en: "Value not available",
        fi: "Ei arvoja",
        sv: "(sv) Ei arvoja"
      },
      other: { // text in tooltip when value is not available
        ca: "Altre",
        es: "Otro",
        en: "Other",
        fi: "Muut",
        sv: "Andra"
      },
      oldbrowser: { // Warning message when IE<9 (maps)
        ca: "Per visualitzar el mapa cal un navegador m&eacute;s modern.",
        es: "Para visualizar el mapa es preciso un navegador m&aacute;s moderno.",
        en: "To view the map you must use a modern browser.",
        fi: "Karttanäkymä tarvitsee modernin selaimen toimiakseen."
      }
    }
  },

  // Classes and ids of elements created by visual
  id: "visual", // id to style the container
  clas: "visual", // class to style the container
  compareids: ["VisualJSleft", "VisualJSright"], // ids to style each
  // VisualJS.compare containers
  tooltipid: "VisualJSTooltip", // id to style the tooltip
  nowrapclass: "VisualJSnw", // class to define blocks of wrappable content in
  // the title
  canvasclass: "VisualJScanvas", // canvas container (Flot)
  areaclass: "VisualJSarea", // svg:g class (D3 maps)
  legendclass: "VisualJSlegend", // svg:g class (D3 maps)
  normal: "VisualJSnormal", // visualitzation's normal size class
  mini: "VisualJSmini", // visualitzation's small size class
  colorclassprefix: "c", // prefix for color class in maps: cnohover, c0, c1,
  // c2...

  // Markup created by visual
  html: {
    heading: "h1",
    footer: "p", // "footer" element not supported by IE8
    filters: "div"
  },

  // Libraries: path and existence function
  main: { // Do not use relative paths for main files in production: they'll be
    // relative to the path where VisualJS.iframe is executed.
    visual: "support/visual/lib/visual.js",
    setup: "support/visual/lib/visual.setup.js",
    lazy: "support/visual/lib/lazyload.js"
  },
  lib: {
    d3: {
      js: "visual/lib/d3.v3.js",
      exists: function() {
        return typeof d3 === "object";
      }
    },
    jquery: {
      js: "visual/lib/jquery.1.8.3.js",
      exists: function() {
        return typeof jQuery === "function";
      },

      flot: {
        js: "visual/lib/jquery.flot.js",
        exists: function() {
          return typeof jQuery.plot === "function";
        },

        stack: {
          js: "visual/lib/jquery.flot.stack.js",
          exists: function() {
            return typeof jQuery.plot.plugins === "object"
                    && typeof jQuery.plot.plugins[0] === "object"
                    && jQuery.plot.plugins[0].name === "stack";
          }
        },
        orderbars: {
          js: "visual/lib/jquery.flot.orderbars.js",
          exists: function() {
            return typeof jQuery.plot.plugins === "object"
                    && typeof jQuery.plot.plugins[0] === "object"
                    && jQuery.plot.plugins[0].name === "orderBars";
          }
        },
        pyramid: {
          js: "visual/lib/jquery.flot.pyramid.js",
          exists: function() {
            return typeof FlotPyramid === "object";
          }
        },
        categories: {
          js: "visual/lib/jquery.flot.categories.js",
          exists: function() {
            return typeof jQuery.plot.plugins === "object"
                    && typeof jQuery.plot.plugins[0] === "object"
                    && jQuery.plot.plugins[0].name === "categories";
          }
        },
        pie: {
          js: "visual/lib/jquery.flot.pie.js",
          exists: function() {
            return typeof jQuery.plot.plugins === "object"
                    && typeof jQuery.plot.plugins[0] === "object"
                    && jQuery.plot.plugins[0].name === "pie";
          }
        },
        jFlotLabel: {
          js: "visual/lib/jquery.flot.axislabels.js",
          exists: function() {
            return typeof jQuery.plot.plugins === "object"
                    && typeof jQuery.plot.plugins[0] === "object"
                    && jQuery.plot.plugins[0].name === "jFlotLabel";
          }
        },
        time: {
          js: "visual/lib/jquery.flot.time.js",
          exists: function() {
            return typeof jQuery.plot.plugins === "object"
                    && typeof jQuery.plot.plugins[0] === "object"
                    && jQuery.plot.plugins[0].name === "time";
          }
        }

      }
    },
    maps: {
      js: "../maps/visual.maps.max.js",
      exists: function() {
        return typeof VisualJS.func.colors === "function"
                && typeof VisualJS.func.legend === "function";
      }
    },
    excanvas: {
      js: "../lib/excanvas.js",
      exists: function() {
        return typeof G_vmlCanvasManager !== "undefined";
      }
    }
  },

  // Maps: path and existence function
  map: {
    elyKeskukset: {
      js: "../../map/elyKeskukset.js",
      exists: function() {
        return typeof VisualJS.map.elyKeskukset !== "undefined";
      }
    },
    metsakeskukset: {
      js: "../../map/metsakeskukset.js",
      exists: function() {
        return typeof VisualJS.map.metsakeskukset !== "undefined";
      }
    },
    elyt2014: {
      js: "../../map/elyt2014.js",
      exists: function() {
        return typeof VisualJS.map.elyt2014 !== "undefined";
      }
    },
    kunnat2015: {
      js: "../../map/elyt2014.js",
      exists: function() {
        return typeof VisualJS.map.kunnat2015 !== "undefined";
      }
    },
    maakunta: {
      js: "../../map/maakunta.js",
      exists: function() {
        return typeof VisualJS.map.maakunta !== "undefined";
      }
    }
  },

  // IE check
  func: {
    old: function(ie) {
      return RegExp("(^|\\s)lt-" + ie + "(\\s|$)").test(
              document.documentElement.className);
    }
  },

  // Attach event listener? 0.10.*
  listen: false,

  // Margins and paddings used in container
  margin: 10,
  padding: {
    w: 30,
    h: 45
  },
  // VisualJS.compare separator width
  separator: 0
};