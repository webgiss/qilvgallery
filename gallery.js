var e=new Promise((function(e){if("complete"===document.readyState||"loading"!==document.readyState&&!document.documentElement.doScroll)setTimeout((function(){return e()}),1);else{var t=function(){e(),document.removeEventListener("DOMContentLoaded",t,!1)};document.addEventListener("DOMContentLoaded",t,!1)}}));function t(e,t,i){return t=c(t),function(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(e,n()?Reflect.construct(t,i||[],c(e).constructor):t.apply(e,i))}function n(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(n=function(){return!!e})()}function i(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var i=n.call(e,t||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}function r(e){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r(e)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,i(r.key),r)}}function s(e,t,n){return t&&a(e.prototype,t),n&&a(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&u(e,t)}function c(e){return c=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},c(e)}function u(e,t){return u=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},u(e,t)}function p(e){return function(e){if(Array.isArray(e))return h(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return h(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return h(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function h(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}var d=s((function e(){o(this,e)}),[{key:"asCss",value:function(){throw new Error("not implemented")}}]),y=function(e){function n(){return o(this,n),t(this,n,arguments)}return l(n,d),s(n,[{key:"section",value:function(){throw new Error("not implemented")}},{key:"endCss",value:function(){throw new Error("not implemented")}}])}(),f=function(e){function n(){return o(this,n),t(this,n,arguments)}return l(n,d),s(n,[{key:"match",value:function(){throw new Error("not implemented")}},{key:"property",value:function(){throw new Error("not implemented")}},{key:"endSection",value:function(){throw new Error("not implemented")}}])}(),m=function(e){function n(){return o(this,n),t(this,n,arguments)}return l(n,d),s(n)}(),v=function(e){function n(e){var i;o(this,n),i=t(this,n);var r=e=e||{},a=r.name,s=r.value,l=r.important,c=r.parent;return i._name=a,i._value=s,i._important=l||!1,i._parent=c,i}return l(n,m),s(n,[{key:"important",set:function(e){this._important=e}},{key:"asCss",value:function(e){var t=e=e||{},n=t.important;return t.format,n=n||this._important,"".concat(this._name,":").concat(this._value).concat(n?" !important":"",";")}}])}(),_=function(e){function n(e){var i,r=e.matches,a=e.important,s=e.parent;return o(this,n),(i=t(this,n))._matches=r||[],i._properties=[],i._important=a||!1,i._parent=s,i}return l(n,f),s(n,[{key:"match",value:function(e){return this._matches.push(e),this}},{key:"property",value:function(e,t,n){var i=new v({name:e,value:t,important:n,parent:this});return this._properties.push(i),this}},{key:"endSection",value:function(){return this._parent}},{key:"asCss",value:function(e){var t=e=e||{},n=t.important,i=t.format;return n=n||this._important,"".concat(this._matches.join(","),"{").concat(this._properties.map((function(e){return e.asCss({important:n,format:i})})).join(""),"}")}}])}(),g=function(e){function n(e){var i;o(this,n),i=t(this,n);var r=e=e||{},a=r.onEnd,s=r.important;return i._sections=[],i._important=s||!1,i._onEnd=a,i}return l(n,y),s(n,[{key:"section",value:function(e){var t=(e=e||{}).important,n=new _({important:t,parent:this});return this._sections.push(n),n}},{key:"endCss",value:function(){(0,this._onEnd)(this)}},{key:"asCss",value:function(e){var t=e=e||{},n=t.important,i=t.format;return n=n||this._important,this._sections.map((function(e){return e.asCss({important:n,format:i})})).join("")}}])}(),k=s((function e(){o(this,e)}),[{key:"setCssProperty",value:function(e,t,n){e&&(e.style[t]=n)}},{key:"setCssProperties",value:function(e,t){var n=this;e&&Object.keys(t).forEach((function(i){n.setCssProperty(e,i,t[i])}))}},{key:"installCss",value:function(e){var t=document.createElement("style");t.type="text/css",t.innerHTML=e,document.getElementsByTagName("head")[0].appendChild(t)}},{key:"startFluentCss",value:function(e){var t=e.important,n=e.format,i=this;return new g({onEnd:function(e){var r=e.asCss({important:t,format:n});i.installCss(r)}})}},{key:"setHtmlContent",value:function(e,t){e.innerHTML=t}},{key:"setTextContent",value:function(e,t){e.innerText=t}},{key:"createElement",value:function(e,t){var n=document.createElement(e),i=this;return t&&Object.keys(t).forEach((function(e){switch(e){case"attr":var o=t.attr;Object.keys(o).forEach((function(e){n[e]=o[e]}));break;case"style":i.setCssProperties(n,t.style);break;case"id":n.id=t.id;break;case"className":n.classList.add(t.className);break;case"classNames":var a;(a=n.classList).add.apply(a,p(t.classNames));break;case"parent":var s=t.parent;s&&s.appendChild(n);break;case"html":i.setHtmlContent(n,t.html);break;case"text":i.setTextContent(n,t.text);break;case"onClick":n.addEventListener("click",t.onClick);break;case"onChange":n.addEventListener("change",(function(e){return t.onChange(e.target.value)}));break;case"onInput":n.addEventListener("input",(function(e){return t.onInput(e.target.value)}));break;case"onLoad":n.addEventListener("load",(function(){return t.onLoad()}));break;case"content":var l=function(e){e.forEach((function(e){e instanceof HTMLElement?n.appendChild(e):r(e)===r("")?n.appendChild(document.createTextNode(e)):r(e)===r([])&&l(e)}))};l(t.content);break;case"onInstance":(0,t.onInstance)(n)}})),n}},{key:"remove",value:function(e){e&&e.parentNode&&e.parentNode.removeChild(e)}},{key:"getElementsByClassName",value:function(e){return p(document.getElementsByClassName(e))}},{key:"getElementsByTagName",value:function(e){return p(document.getElementsByTagName(e))}},{key:"addClass",value:function(e,t){e&&e.classList.add(t)}},{key:"removeClass",value:function(e,t){e&&e.classList.remove(t)}},{key:"setClass",value:function(e,t,n){e&&(n?e.classList.add(t):e.classList.remove(t))}},{key:"removeClassStartingWith",value:function(e,t){e&&p(e.classList).filter((function(e){return e.startsWith(t)})).forEach((function(t){e.classList.remove(t)}))}}]),b=s((function e(t){var n=this,i=t.domAccess,r=t.parent;o(this,e),this._domAccess=i,this._parent=r,this._image=null,this._div=i.createElement("div",{parent:r,className:"qilvgallery_image_outter",content:[i.createElement("a",{parent:this._div,onInstance:function(e){return n._a=e}})]})}),[{key:"accessKey",set:function(e){this._a.accesskey=e}},{key:"setIsLoaded",value:function(){this._domAccess.removeClass(this._image,"qilv_loading")}},{key:"setLoading",value:function(){this._domAccess.addClass(this._image,"qilv_loading")}},{key:"replaceImage",value:function(e){var t=this;null!=this._image&&this._image.remove(),this._image=this._domAccess.createElement("img",{classNames:["qilvgallery_image"],parent:this._a,onLoad:function(){return t.setIsLoaded()},attr:{src:"#"}}),this.setLoading(),this._image.src=e,this._a.href=e,this._a.target="_blank",this._a.download=e.split("/").reduce((function(e,t){return t}))}},{key:"hide",value:function(){this._domAccess.removeClass(this._div,"qilv_shown")}},{key:"show",value:function(){this._domAccess.addClass(this._div,"qilv_shown")}},{key:"imageSource",get:function(){return this._image?this._image.src:null}}]),w=s((function e(t){var n=t.imageOverlayUi;return o(this,e),this._imageOverlayUi=n,null}),[{key:"id",get:function(){return this._id},set:function(e){this._id=e}},{key:"update",value:function(e,t){this.id=e,this._imageOverlayUi.replaceImage(t)}},{key:"hide",value:function(){this._imageOverlayUi.hide(),this._imageOverlayUi.accessKey=void 0}},{key:"show",value:function(){this._imageOverlayUi.accessKey="l",this._imageOverlayUi.show()}},{key:"imageSource",get:function(){return this._imageOverlayUi.imageSource}}]),x=s((function e(){o(this,e)}),[{key:"getBindableMethods",value:function(){return null}},{key:"getKeyBindings",value:function(){return null}}]),S=s((function e(t){var n=this,i=t.config;o(this,e),this._config=i;var r={BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CONTROL:17,CAPS_LOCK:20,ESCAPE:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,INSERT:45,DELETE:46,A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,NUMPAD_MULTIPLY:106,NUMPAD_ADD:107,NUMPAD_ENTER:108,NUMPAD_SUBSTRACT:109,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,COMMA:188,PERIOD:190};this._keyValuesByName=r,this.globalBindings={},this.handle_key_elements=[],this._reverseKeysByNumber={},this.keys=[],this.values=[],Object.keys(r).forEach((function(e){var t=n._keyValuesByName[e];n._reverseKeysByNumber[t]=e,n.keys.push(e),n.values.push(t)}))}),[{key:"getName",value:function(e){return null==this._reverseKeysByNumber[e]?"".concat(e):this._reverseKeysByNumber[e]}},{key:"getValue",value:function(e){return e=e.toUpperCase(),this._keyValuesByName[e]}},{key:"handle_key",value:function(e){if(!(e.ctrlKey||e.shiftKey||e.altKey)&&null!=this.globalBindings[e.which]){var t=this.globalBindings[e.which],n=t.target,i=t.methodName;n[i]({event:e,method_name:i}),e.preventDefault(),e.stopPropagation()}}},{key:"auto_bind",value:function(e,t){var n=this;null==t&&(t=document);var i=e.getBindableMethods(),r=e.getKeyBindings();null==i&&(i={});var o=[];Object.keys(this.globalBindings).forEach((function(t){n.globalBindings[t].target===e&&o.push(t)})),o.forEach((function(e){delete n.globalBindings[e]})),Object.keys(r).forEach((function(t){var o=r[t];n.globalBindings[n.getValue(t)]={target:e,methodName:o},-1==Object.keys(i).indexOf(o)&&(i[o]="??? ("+o+")")})),this.keys.forEach((function(t){var i=n._config["VK."+t];if(null!=i){var r=e.__name__;r=r?r+".":"",i.substring(0,r.length)===r&&(""===(i=i.substring(r.length))?delete n.globalBindings[n.getValue(t)]:n.globalBindings[n.getValue(t)]={target:e,methodName:i})}})),0>this.handle_key_elements.indexOf(t)&&(this.handle_key_elements.push(t),t.addEventListener("keydown",(function(e){return n.handle_key(e)})))}}]),A=s((function e(t){var n=t.domAccess;o(this,e),this._domAccess=n,this._preloadGauge=null,this._preloadGaugeInner=null}),[{key:"createBlackScreen",value:function(e){var t=e.parent;return this._domAccess.createElement("div",{parent:t,id:"qilvgallery_black_screen"})}},{key:"removeBlackScreen",value:function(e){this._domAccess.remove(e)}},{key:"createInfoTip",value:function(e){var t=this._domAccess;void 0===e&&(e={});var n={className:"qilvgallery_infotip"};void 0!==n.id&&(n.id=e.id),e.parent&&(n.parent=e.parent),e.content&&(n.content=e.content),e.classNames&&(n.classNames=e.classNames);var i=t.createElement("div",n);return e.position&&t.setCssProperty(i,"position",e.position),void 0!==e.center&&e.center&&i.classList.add("qilvgallery_infotip_center"),void 0!==e.fadeOut&&setTimeout((function(){return t.remove(i)}),e.fadeOut),i}},{key:"createTempMessage",value:function(e,t){this.createInfoTip({fadeOut:1500,parent:t,position:"fixed",content:[e]})}},{key:"removeInfoBox",value:function(e){e&&this._domAccess.remove(e)}},{key:"createInfoBox",value:function(e){var t=e.parent,n=e.hrefs,i=e.isCurrent,r=this._domAccess,o=this.createInfoTip({parent:t}),a=r.createElement("pre",{parent:o,content:[n.map((function(e){var t="span";return i(e)&&(t="b"),[r.createElement(t,{text:e}),r.createElement("br")]}))],onClick:function(){var e="",t=0,i=0;n.forEach((function(n){e+=n,e+="\n",i+=1,n.length>t&&(t=n.length)})),r.remove(a),r.createElement("textarea",{parent:o,attr:{rows:"".concat(i+1),cols:"".concat(t+2),className:"qilvgallery_infobox_textarea",readonly:1,value:e}}).select()}});return o}},{key:"showPreloadGauge",value:function(e){var t=e.parent,n=e.onComplete,i=e.preloadGaugeInfo;if(!i){var r=this._domAccess.createElement("div",{parent:t,className:"qilvgallery_preload_gauge"});i={preloadGauge:r,preloadGaugeInner:this._domAccess.createElement("div",{parent:r,className:"qilvgallery_preload_gauge_inner"}),onComplete:n}}return i}},{key:"hidePreloadGauge",value:function(e){var t=e.preloadGaugeInfo;t&&(this._domAccess.remove(t.preloadGaugeInner),this._domAccess.remove(t.preloadGauge))}},{key:"updatePreloadGauge",value:function(e){var t=e.loaded,n=e.total,i=e.preloadGaugeInfo;if(i){var r=this._domAccess,o="".concat(Math.floor(100*t/n),"%");r.setCssProperty(i.preloadGaugeInner,"width",o),r.setTextContent(i.preloadGaugeInner,o),r.setTextContent(i.preloadGaugeInner,"".concat(t," / ").concat(n)),t===n&&i.onComplete()}}},{key:"ensurePreloadAll",value:function(e){var t=this,n=e.hrefs,i=e.onImageLoaded,r=e.parent;if(!this._preloadAllPanel){var o=this._domAccess;this._preloadAllPanel=o.createElement("div",{parent:r,id:"qilvgallery_preload_all_panel"}),n.forEach((function(e){o.createElement("img",{parent:t._preloadAllPanel,onLoad:i,attr:{src:"#"}}).src=e}))}}},{key:"resetImageList",value:function(){this._preloadAllPanel&&this._domAccess.remove(this._preloadAllPanel),this._preloadAllPanel=null}},{key:"removeAboutInfoBox",value:function(e){this._domAccess.remove(e)}},{key:"createAboutInfoBox",value:function(e){var t=e.parent,n=e.onClick,i=e.version,r=this._domAccess,o="https://github.com/webgiss/qilvgallery";return r.createElement("div",{parent:t,className:"qilvgallery_about_infobox",content:[r.createElement("div",{className:"qilvgallery_infotip_about_blackscreen",onClick:n}),this.createInfoTip({id:"QILVGallery_About",center:!0,classNames:["qilvgallery_infotip_about"],content:[r.createElement("p",{text:"QILV Gallery",className:"qilvgallery_infotip_about_title"}),r.createElement("p",{text:"Version : ".concat(i),className:"qilvgallery_infotip_about_version"}),r.createElement("a",{text:o,attr:{href:o,target:"_blank"}}),r.createElement("br"),r.createElement("div",{text:"Close",className:"qilvgallery_infotip_about_button",onClick:n})]})]})}},{key:"removeHelpInfoTip",value:function(e){this._domAccess.remove(e)}},{key:"createHelpInfoTip",value:function(e){var t=e.parent,n=e.bindings,i=e.configurations,r=e.version,o=this._domAccess;return this.createInfoTip({parent:t,classNames:["qilvgallery_infotip_help"],content:[o.createElement("p",{text:"Version: ".concat(r)}),o.createElement("h1",{text:"Keyboard configuration",className:"qilvgallery_infotip_help_title"}),o.createElement("div",{className:"qilvgallery_infotip_help_content",content:n.map((function(e){var t=e.keyName,n=e.methodName;return o.createElement("div",{content:[o.createElement("b",{text:t}),o.createElement("span",{text:": ".concat(n)})]})}))}),o.createElement("h1",{text:"Values",className:"qilvgallery_infotip_help_title"}),o.createElement("div",{className:"qilvgallery_infotip_help_content",content:i.map((function(e){var t=e.comment,n=e.configured,i=e.effective,r=e.defaultValue;return o.createElement("div",{content:[o.createElement("b",{text:t}),o.createElement("span",{text:": ".concat(i," (configured = ").concat(n," ; default = ").concat(r,")")})]})}))})]})}},{key:"createMainElement",value:function(){return this._domAccess.createElement("div",{parent:document.body,id:"qilvgallery_main_element"})}},{key:"createViewer",value:function(e){var t=e.parent;return this._domAccess.createElement("div",{parent:t,id:"qilvgallery_viewer"})}},{key:"getLinkRefs",value:function(){return this._domAccess.getElementsByTagName("a").map((function(e){return{href:e.href,element:e}}))}},{key:"setImageRef",value:function(e){var t=e.element,n=e.id;this._domAccess.addClass(t,"qilvgallery_source_image"),this._domAccess.addClass(t,"qilvgallery_source_image_".concat(n))}},{key:"cleanImageRef",value:function(e){var t=e.element,n=e.id;this._domAccess.removeClass(t,"qilvgallery_source_image"),this._domAccess.removeClass(t,"qilvgallery_source_image_".concat(n))}},{key:"setRelative",value:function(e){var t=e.element,n=e.relative;this._domAccess.setClass(t,"qilv_relative",n)}},{key:"setAutoX",value:function(e){var t=e.element,n=e.autoX;this._domAccess.setClass(t,"qilv_autoX",n)}},{key:"setAutoY",value:function(e){var t=e.element,n=e.autoY;this._domAccess.setClass(t,"qilv_autoY",n)}},{key:"setCentered",value:function(e){var t=e.element,n=e.centered;this._domAccess.setClass(t,"qilv_centered",n)}},{key:"setMaxSize",value:function(e){var t=e.element,n=e.maxSize;this._domAccess.setClass(t,"qilv_maxSize",n)}},{key:"setShown",value:function(e){var t=e.element,n=e.shown;this._domAccess.setClass(t,"qilv_shown",n)}},{key:"setTransition",value:function(e){var t=e.element,n=e.transitionTime;this._domAccess.removeClassStartingWith(t,"qilv_transition-"),this._domAccess.addClass(t,"qilv_transition-".concat(n))}},{key:"installCss",value:function(){this._domAccess.startFluentCss({important:!0}).section().match("#qilvgallery_viewer").property("position","absolute").property("z-index","50000").property("display","none").property("top","0").property("bottom","0").property("margin","0").property("left","0").property("right","0").endSection().section().match("#qilvgallery_viewer.qilv_shown").property("z-index","50001").property("display","block").endSection().section().match("#qilvgallery_viewer.qilv_relative").property("position","fixed").endSection().section().match(".qilvgallery_infotip").property("display","block").property("position","absolute").property("left","4px").property("top","4px").property("padding","15px").property("font-size","13px").property("background","linear-gradient(180deg, #f8f8f8, #dddddd)").property("color","#000000").property("font-family",'"consolas","courier new",monospace').property("border","2px solid").property("border-color","#ffffff #f8f8f8 #b8b8b8 #f8f8f8").property("border-radius","5px").property("z-index","50001").endSection().section().match(".qilvgallery_infotip > pre").property("margin","0").endSection().section().match(".qilvgallery_preload_gauge").property("z-index","50101").property("border","1px solid black").property("width","100%").property("position","fixed").property("bottom","0").property("height","13px").property("background-color","#eee").endSection().section().match(".qilvgallery_preload_gauge_inner").property("z-index","50102").property("border","0").property("padding","0").property("margin","0").property("width","0%").property("position","static").property("left","0").property("top","0").property("height","100%").property("background-color","#f03").property("text-align","center").property("font-size","11px").property("font-family","Arial,Verdana,sans-serif,Helvetica").property("font-weight","bold").property("color","#000000").endSection().section().match(".qilvgallery_infotip_about_blackscreen").property("z-index","50098").property("width","100%").property("height","100%").property("position","fixed").property("left","0px").property("top","0px").property("background","black").property("opacity","0.8").endSection().section().match(".qilvgallery_infotip_about_title").property("font-size","20pt").endSection().section().match(".qilvgallery_infotip_about_button").property("width","20em").property("border","1px solid #666").property("background","#ccc").property("border-radius","8px").property("background","linear-gradient(0, #aaa, #eee)").property("left","0px").property("right","0px").property("margin","100px auto auto").endSection().section().match(".qilvgallery_infotip_center").property("position","fixed").property("left","0").property("right","0").property("top","0").property("bottom","0").property("margin","auto").endSection().section().match(".qilvgallery_infotip_about").property("font-family",'"Trebuchet MS","Tahoma","Verdana","Arial","sans-serif"').property("font-size","15pt").property("text-align","center").property("max-width","500px").property("max-height","300px").property("border","1px solid white").property("background","linear-gradient(180deg, #f8f8f8, #dddddd)").property("z-index","50100").endSection().section().match(".qilvgallery_infotip_help").property("display","block").property("position","absolute").property("left","4px").property("top","4px").property("padding","15px").property("font-size","13px").property("border","1px solid white").property("background","linear-gradient(180deg, #f8f8f8, #dddddd)").property("color","#000000").property("font-family",'"courier new"').property("border-radius","5px").property("z-index","50001").endSection().section().match(".qilvgallery_infotip_help_title").property("font-size","2em").property("font-weight","bold").endSection().section().match(".qilvgallery_infotip_help_content").property("margin-left","10px").endSection().section().match(".qilvgallery_infobox_textarea").property("white-space","pre").endSection().section().match(".qilvgallery_about_infobox").property("margin","0").property("padding","0").property("border","0").endSection().section().match(".qilvgallery_image_outter").property("margin","0").property("padding","0").property("border","0").property("position","absolute").property("display","block").property("opacity","0").property("left","0").property("right","0").property("top","0").property("bottom","0").property("transition","opacity ease-out").property("transition-duration","0s").endSection().section().match(".qilv_transition-300 .qilvgallery_image_outter").property("transition-duration","0.3s").endSection().section().match(".qilv_transition-800 .qilvgallery_image_outter").property("transition-duration","0.8s").endSection().section().match(".qilv_transition-1500 .qilvgallery_image_outter").property("transition-duration","1.5s").endSection().section().match(".qilvgallery_image_outter.qilv_shown").property("opacity","1").property("display","block").endSection().section().match(".qilvgallery_image").property("margin","unset").property("padding","0").property("display","block").property("position","absolute").property("left","0").property("top","0").property("z-index","50000").property("box-sizing","border-box").property("border","2px solid black").property("right","unset").property("bottom","unset").property("width","auto").property("height","auto").property("max-width","unset").property("max-height","unset").endSection().section().match(".qilv_maxSize .qilvgallery_image").property("max-width","100%").property("max-height","100%").endSection().section().match(".qilv_autoX .qilvgallery_image").property("width","100%").endSection().section().match(".qilv_autoY .qilvgallery_image").property("height","100%").endSection().section().match(".qilvgallery_image.qilv_loading").property("border","2px solid red").endSection().section().match(".qilv_centered .qilvgallery_image").property("right","0").property("bottom","0").property("margin","auto").endSection().section().match("#qilvgallery_preload_all_panel").property("display","none").endSection().section().match("#qilvgallery_black_screen").property("z-index","499998").property("width","100%").property("height","100%").property("left","0").property("top","0").property("background","black").property("margin","0").property("padding","0").endSection().endCss()}}]),E=s((function e(t){var n=t.domAccess;o(this,e),this._domAccess=n}),[{key:"createImageOverylay",value:function(e){var t=this._domAccess,n=new b({domAccess:t,parent:e});return new w({imageOverlayUi:n})}}]),I=function(e){function n(e){var i,r=e.imageOverlayFactory,a=e.galleryOverlaysUi,s=e.vk,l=e.config;return o(this,n),(i=t(this,n))._imageOverlayFactory=r,i._galleryOverlaysUi=a,i._vk=s,i._config=l,i._preloadGaugeInfo=null,i._configurables={slideshowSpeed:{label:"Initial slideshow speed (ms)",default:"500"},transitionTime:{label:"Initial transition's effect's time (ms)",default:"0"},slideshowMode:{label:"Slideshow on at start ?",default:"false"},preloadAllMode:{label:"Preload all at start ?",default:"true"},maxSize:{label:"Fit the image to the screen if bigger than the screen at start ?",default:"true"},relative:{label:"Show image at the top of the screen instead of the top of the page at start ?",default:"true"},blackScreenMode:{label:"Show on 'black screen' mode at start ?",default:"true"}},i._bindables={goPrev:"Go to previous image",goNext:"Go to next image",toggleInfoBox:"Show/hide the infobox of image list",toggle:"Show/Hide the current image",openLink:"Open the image in a new window/tab",toggleSlideshow:"Start/stop the slideshow",togglePosition:"Show current image at top of the page/top of the screen",speedUpSlideshow:"Increase the slideshow speed",speedDownSlideshow:"Decrease the slideshow speed",toggleMaxSize:"Fit the image if larger than the screen/Show whole image",toggleAutoX:"Width of the image fit/doesn't fit to width of the screen",toggleAutoY:"Height of the image fit/doesn't fit to height of the screen",toggleAutoXY:"Width and height of the image fit/doesn't fit to width and height of the screen",toggleBlackScreen:"Set or remove the black screen",cycleTransitionTime:"Change transition's effect's time",preloadAll:"Pre-load all images (may take some resources)",reload:"Reload images (after changes in page content)",about:"Show/Hide about box",help:"Show/Hide help box"},i._key_bindings={BACKSPACE:"goPrev",J:"goPrev",SPACE:"goNext",K:"goNext",I:"toggleInfoBox",H:"toggle",L:"openLink",S:"toggleSlideshow",R:"togglePosition",NUMPAD_ADD:"speedUpSlideshow",NUMPAD_SUBSTRACT:"speedDownSlideshow",M:"toggleMaxSize",X:"toggleAutoX",Y:"toggleAutoY",Z:"toggleAutoXY",B:"toggleBlackScreen",T:"cycleTransitionTime",P:"preloadAll",E:"reload",NUMPAD_MULTIPLY:"help",NUMPAD_DIVIDE:"about"},i.__name__="Gallery",i._prev=null,i._next=null,i._current=null,i._slideshowMode=null,i._preloadAllMode=null,i._slideshowSpeed=null,i._transitionTime=null,i._maxSize=null,i._relative=!0,i._blackScreenMode=null,i._slideshowDirNext=!0,i._autoX=!1,i._autoY=!1,i._centered=!1,i._blackScreen=null,i._shown=!0,i}return l(n,x),s(n,[{key:"getBindableMethods",value:function(){return this._bindables}},{key:"getKeyBindings",value:function(){return this._key_bindings}},{key:"getConfigurables",value:function(){return this._configurables}},{key:"autoX",get:function(){return this._autoX},set:function(e){this._autoX=e,this._galleryOverlaysUi.setAutoX({element:this._viewer,autoX:this._autoX})}},{key:"autoY",get:function(){return this._autoY},set:function(e){this._autoY=e,this._galleryOverlaysUi.setAutoY({element:this._viewer,autoY:this._autoY})}},{key:"ImageOverlays",get:function(){var e=this;return["prev","next","current"].map((function(t){return e["_"+t]}))}},{key:"setTransitionTime",value:function(e,t){this._transitionTime=e,this._galleryOverlaysUi.setTransition({element:this._viewer,transitionTime:e}),t||this.createTempMessage("Transition's effect's time : ".concat(e," ms"))}},{key:"createTempMessage",value:function(e){this._galleryOverlaysUi.createTempMessage(e,this._mainElement)}},{key:"transitionTime",get:function(){return this._transitionTime},set:function(e){this.setTransitionTime(e,!0)}},{key:"cycleTransitionTime",value:function(){var e=this._transitionTime;e=0===e?300:300>=e?800:800>=e?1500:0,this.setTransitionTime(e)}},{key:"centered",get:function(){return this._centered},set:function(e){this._centered=e,this._galleryOverlaysUi.setCentered({element:this._viewer,centered:this._centered})}},{key:"setBlackScreenMode",value:function(e){e&&!this._blackScreen&&(this._blackScreen=this._galleryOverlaysUi.createBlackScreen({parent:this._viewer})),!e&&this._blackScreen&&(this._galleryOverlaysUi.removeBlackScreen(this._blackScreen),this._blackScreen=null),this.centered=e}},{key:"blackScreenMode",get:function(){return this._blackScreenMode},set:function(e){this._blackScreenMode=e,this.setBlackScreenMode(e)}},{key:"slideshowMode",get:function(){return this._slideshowMode},set:function(e){this._slideshowMode=e,this._slideshowMode&&this.prepareNextSlide()}},{key:"preloadAllMode",get:function(){return this._preloadAllMode},set:function(e){this._preloadAllMode=e,this._preloadAllMode&&this.preloadAll({parent:this._mainElement})}},{key:"shown",get:function(){return this._shown},set:function(e){this._shown=e,this._galleryOverlaysUi.setShown({element:this._viewer,shown:this._shown})}},{key:"showSlideshowSlide",value:function(){this.slideshowMode&&(this._slideshowDirNext?this.goNext():this.goPrev(),this.prepareNextSlide())}},{key:"prepareNextSlide",value:function(){var e=this;setTimeout((function(){return e.showSlideshowSlide()}),this._slideshowSpeed)}},{key:"toggleSlideshow",value:function(){this.slideshowMode=!this.slideshowMode}},{key:"slideshowSpeed",get:function(){return this._slideshowSpeed},set:function(e){this.setSlideshowSpeed(e,!1)}},{key:"setSlideshowSpeed",value:function(e,t){this._slideshowSpeed=e,t||this.createTempMessage("Speed : ".concat(this._slideshowSpeed," ms"))}},{key:"speedUpSlideshow",value:function(){100<this.slideshowSpeed&&(this.slideshowSpeed-=100)}},{key:"speedDownSlideshow",value:function(){this.slideshowSpeed+=100}},{key:"goPrev",value:function(){this._slideshowDirNext=!1,this._current.hide();var e=[this._current,this._prev,this._next];this._next=e[0],this._current=e[1],this._prev=e[2],this._current.show();var t=this._current.id,n=this._links[t].prevId;this._prev.update(n,this._links[n].href),this.removeBoxes(),this.shown=!0}},{key:"goNext",value:function(){this._slideshowDirNext=!0,this._current.hide();var e=[this._next,this._current,this._prev];this._current=e[0],this._prev=e[1],this._next=e[2],this._current.show();var t=this._current.id,n=this._links[t].nextId;this._next.update(n,this._links[n].href),this.removeBoxes(),this.shown=!0}},{key:"goNum",value:function(e){var t=this._links[e].prevId,n=this._links[e].nextId;this._current.update(e,this._links[e].href),this._prev.update(t,this._links[t].href),this._next.update(n,this._links[n].href),this.removeBoxes(),this.shown=!0}},{key:"removeBoxes",value:function(){this.removeInfoBox(),this.removeAbout(),this.removeHelp()}},{key:"maxSize",get:function(){return this._maxSize},set:function(e){this.setMaxSize(e,!1)}},{key:"setMaxSize",value:function(e){this._maxSize=e,this._galleryOverlaysUi.setMaxSize({element:this._viewer,maxSize:this._maxSize})}},{key:"toggleMaxSize",value:function(){this.maxSize=!this.maxSize}},{key:"toggleAutoX",value:function(){this.autoX=!this.autoX}},{key:"toggleAutoY",value:function(){this.autoY=!this.autoY}},{key:"toggleAutoXY",value:function(){this.autoX||this.autoY?(this.autoX=!1,this.autoY=!1):(this.autoX=!0,this.autoY=!0)}},{key:"isCurrent",value:function(e){return this._current.imageSource===e}},{key:"removeInfoBox",value:function(){this._infoBox&&(this._galleryOverlaysUi.removeInfoBox(this._infoBox),this._infoBox=null)}},{key:"toggleInfoBox",value:function(){var e=this;this._infoBox?this.removeInfoBox():this._infoBox=this._galleryOverlaysUi.createInfoBox({hrefs:Object.values(this._links).map((function(e){return e.href})),isCurrent:function(t){return e.isCurrent(t)},parent:this._mainElement})}},{key:"toggle",value:function(){this.shown=!this.shown}},{key:"togglePosition",value:function(){this.relative=!this.relative}},{key:"relative",get:function(){return this._relative},set:function(e){this._relative=e,this._galleryOverlaysUi.setRelative({element:this._viewer,relative:this._relative})}},{key:"toggleBlackScreen",value:function(){this.blackScreenMode=!this.blackScreenMode}},{key:"openLink",value:function(){window.open(this._current.imageSource)}},{key:"showPreloadGauge",value:function(){var e=this;this._preloadGaugeInfo=this._galleryOverlaysUi.showPreloadGauge({parent:this._mainElement,onComplete:function(){return e.hidePreloadGauge()},preloadGaugeInfo:this._preloadGaugeInfo}),this.updatePreloadGauge()}},{key:"hidePreloadGauge",value:function(){this._galleryOverlaysUi.hidePreloadGauge({preloadGaugeInfo:this._preloadGaugeInfo}),this._preloadGaugeInfo=null}},{key:"updatePreloadGauge",value:function(){this._galleryOverlaysUi.updatePreloadGauge({loaded:this._loaded,total:this._totalToLoad,preloadGaugeInfo:this._preloadGaugeInfo})}},{key:"preloadAll",value:function(e){var t=this,n=e.parent,i=Object.values(this._links).map((function(e){return e.href}));this._loaded=0,this._totalToLoad=i.length,this._galleryOverlaysUi.ensurePreloadAll({hrefs:i,onImageLoaded:function(){t._loaded+=1,t.updatePreloadGauge()},parent:n}),this._preloadGaugeInfo||this.showPreloadGauge()}},{key:"about",value:function(){var e=this;this._aboutInfoBox?this.removeAbout():this._aboutInfoBox=this._galleryOverlaysUi.createAboutInfoBox({parent:this._mainElement,onClick:function(){e.removeAbout()},version:"4.0.0 - bd1a2ec"})}},{key:"removeAbout",value:function(){null!=this._aboutInfoBox&&(this._galleryOverlaysUi.removeAboutInfoBox(this._aboutInfoBox),this._aboutInfoBox=null)}},{key:"help",value:function(){var e=this;if(this._helpInfoTip)this.removeHelp();else{var t=[],n=[];Object.keys(this._vk.globalBindings).forEach((function(n){var i=e._vk.globalBindings[n],r=e.getBindableMethods();if(i&&i.target===e){var o=i.methodName;t.push({keyName:e._vk.getName(n),methodName:o in r?r[o]:o})}})),Object.keys(this._configurables).forEach((function(t){var i=e._configurables[t].label,r=e._config["QILV."+t]||void 0,o=e._configurables[t].default,a=e[t];n.push({comment:i,configured:r,effective:a,defaultValue:o})})),this._helpInfoTip=this._galleryOverlaysUi.createHelpInfoTip({parent:this._mainElement,bindings:t,configurations:n,version:"4.0.0 - bd1a2ec"})}}},{key:"removeHelp",value:function(){this._helpInfoTip&&(this._galleryOverlaysUi.removeHelpInfoTip(this._helpInfoTip),this._helpInfoTip=null)}},{key:"init",value:function(){var e=this;this._mainElement=this._galleryOverlaysUi.createMainElement(),this._viewer=this._galleryOverlaysUi.createViewer({parent:this._mainElement}),this._galleryOverlaysUi.installCss(),this._prev=this._imageOverlayFactory.createImageOverylay(this._viewer),this._current=this._imageOverlayFactory.createImageOverylay(this._viewer),this._next=this._imageOverlayFactory.createImageOverylay(this._viewer),this._links={},this.reload(),this._vk.auto_bind(this),Object.keys(this._configurables).forEach((function(t){var n=e._config["QILV."+t]||e._configurables[t].default;null!=n&&(n.match(/^\-?[0-9]+$/)&&(n=parseInt(n)),"false"===n&&(n=!1),"true"===n&&(n=!0),e["_"+t]=n)})),this._current.show(),this.preloadAllMode=this._preloadAllMode,this.relative=this._relative,this.autoX=this._autoX,this.autoY=this._autoY,this.setMaxSize(this._maxSize,!0),this.centered=this._centered,this.blackScreenMode=this._blackScreenMode,this.transitionTime=this._transitionTime,this.slideshowMode=this._slideshowMode,this.setSlideshowSpeed(this._slideshowSpeed,!0),this.shown=this._shown}},{key:"reload",value:function(){var e=this,t=null;Object.values(this._links).forEach((function(t){var n=t.id;t.prevId,t.nextId,t.href;var i=t.element;e._galleryOverlaysUi.cleanImageRef({element:i,id:n})})),this._links={},this._galleryOverlaysUi.resetImageList();var n=this._galleryOverlaysUi.getLinkRefs().filter((function(e){var n=e.href,i=e.element,r=!1;return n&&[".png",".gif",".jpg",".jpeg"].map((function(e){-1===n.indexOf("?")&&n.substring(n.length-e.length).toLowerCase()===e&&n!==t&&(r=!0)})),i&&i.parentElement&&i.parentElement.classList.contains("qilvgallery_image_outter")&&(r=!1),r&&(t=n),r}));return n.forEach((function(t,i){var r=t.element,o=t.href,a="".concat(i);e._galleryOverlaysUi.setImageRef({element:r,id:a});var s=0===i?n.length-1:i-1,l=i===n.length-1?0:i+1;e._links[a]={id:a,prevId:s,nextId:l,href:o,element:r}})),0==n.length?(this._galleryOverlaysUi.createTempMessage("No links to image found in this page !",document.body),this.slideshowMode=!1,void(this.blackScreenMode=!1)):(this.goNum(0),void(this.preloadAllMode&&this.preloadAll()))}},{key:"bindables",get:function(){return this._bindables},set:function(e){this._bindables=e}}])}(),O=QILVGalleryInit=function(){if(window.QILVGalleryOverlays)window.QILVGalleryOverlays.reload(),window.QILVGalleryOverlays.shown=!0;else{var e=window.QILV_config||window.GM_values||{},t=new k,n=new E({domAccess:t}),i=new A({domAccess:t}),r=new S({config:e}),o=new I({imageOverlayFactory:n,galleryOverlaysUi:i,vk:r,config:e});window.QILVGalleryOverlays=o,o.init()}};e.then((function(){return O()}));