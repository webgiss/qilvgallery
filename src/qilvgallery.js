(function(){
    var 
    window = this,
    undefined,
    $ = window.jQuery,
    VK = window.VK,
    makeClass = function(proto) {
        var class = proto.__init__;
        class.prototype = proto;
        return class;
    },
    ImageOverlay = makeClass({
        onload_img : function(){
            $(this).css("border","2px solid black");
        },
        set_max_size : function(max_size) {
            this.max_size = max_size;
            if (this.max_size) {
                this.img.css("max-width","100%");
                this.img.css("max-height","100%");
            } else {
                this.img.css("max-width","");
                this.img.css("max-height","");
            }
        },
        set_auto_x : function(auto_x) {
            this.auto_x = auto_x;
            if (this.auto_x) {
                this.img.css("width","100%");
            } else {
                this.img.css("width","auto");
            }
        },
        set_auto_y : function(auto_y) {
            this.auto_y = auto_y;
            if (this.auto_y) {
                this.img.css("height","100%");
            } else {
                this.img.css("height","auto");
            }
        },
        update : function(selector) {
            if (this.img != undefined)
            {
                this.img.remove();
            }
            this.img = $("<img id='QILVGallery_Current_"+this.index+"' class='QILVGallery_Current' src='#' style='display:block;position:absolute;left:0;top:0;z-index:50000' />");
            this.img.css("position",this.position);
            this.img.load(this.onload_img);
            this.img.attr("current",selector);
            this.img.css("border","2px solid red");
            this.img.css("-moz-box-sizing","border-box");
            this.img.attr("src",$(this.img.attr("current")).attr("href"));
            this.set_auto_x(this.auto_x);
            this.set_auto_y(this.auto_y);
            this.set_max_size(this.max_size);
            this.a.attr("href",$(this.img.attr("current")).attr("href"));
            this.a.attr("target","_blank");
            this.a.append(this.img);
            $('#QILVGallery_Infotip').remove();
        },
        hide : function() {
            this.div.css("display","none");
            this.a.removeAttr("accesskey");
        },
        show : function() {
            this.a.attr("accesskey","l");
            this.div.css("display","block");
        },
        toggle : function() {
            if (this.div.css("display")=="none")
            {
                this.show();
            }
            else
            {
                this.hide();
            }
        },
        toggleposition : function() {
            if (this.position=="absolute")
            {
                this.position = "fixed";
            }
            else
            {
                this.position = "absolute";
            }
            this.img.css("position",this.position);
        },
        __init__ : function(index) {
            this.div = $("<div id='QILVGallery_Overlay_"+index+"' style='display:none'/>");
            this.a = $("<a/>");
            this.index = index;
            this.position = "absolute";
            $("body").append(this.div.append(this.a));
        }
    }),
    GalleryOverlays = makeClass({
        __name__ : 'Gallery',
        prev : null,
        next : null,
        current : null,
        slideshow_mode : false,
        slideshow_dir_next : true,
        slideshow_speed : 500,
        auto_x : false,
        auto_y : false,
        max_size : false,
        relative : false,
        noConflict: function(){
            window.QILVGallery_overlays = _QILVGallery_overlays;
            return this;
        },
        show_slideshow_slide : function () {
            if (this.slideshow_mode) {
                if (this.slideshow_dir_next) {
                    this.go_next();
                } else {
                    this.go_prev();
                }
                this.prepare_next_slide();
            }
        },
        prepare_next_slide : function () {
            var xthis = this;
            setTimeout(function() { xthis.show_slideshow_slide() }, this.slideshow_speed);
        },
        start_slideshow : function() {
            this.slideshow_mode = true;
            this.prepare_next_slide();
        },
        stop_slideshow : function() {
            this.slideshow_mode = false;
        },
        startstop_slideshow : function() {
            if (this.slideshow_mode)
            {
                this.stop_slideshow();
            }
            else
            {
                this.start_slideshow();
            }
        },
        speedup_slideshow : function() {
            if (this.slideshow_speed > 100)
            {
                this.slideshow_speed = this.slideshow_speed - 100;
            }
            this.create_infotip({content:'Speed : '+this.slideshow_speed+' ms',fadeOut:0,appendTo:"body",position:"fixed"});
        },
        speeddown_slideshow : function() {
            this.slideshow_speed = this.slideshow_speed + 100;
            this.create_infotip({content:'Speed : '+this.slideshow_speed+' ms',fadeOut:0,appendTo:"body",position:"fixed"});
        },
        go_prev : function() {
            var newcurrent = this.prev;
            this.slideshow_dir_next = false;
            this.current.hide();
            this.prev = this.next;
            this.next = this.current;
            this.current = newcurrent;
            this.current.show();
            this.prev.update( $(this.current.img.attr("current")).attr("gprev") );
        },
        go_next : function() {
            var newcurrent = this.next;
            this.slideshow_dir_next = true;
            this.current.hide();
            this.next = this.prev;
            this.prev = this.current;
            this.current = newcurrent;
            this.current.show();
            this.next.update( $(this.current.img.attr("current")).attr("gnext") );
        },
        go_num : function(num) {
            this.current.update(".QILVGallery_Image_"+num);
            this.prev.update( $(this.current.img.attr("current")).attr("gprev") );
            this.next.update( $(this.current.img.attr("current")).attr("gnext") );
        },
        toggle_max_size : function() {
            this.max_size = !(this.max_size);
            this.current.set_max_size(this.max_size);
            this.prev.set_max_size(this.max_size);
            this.next.set_max_size(this.max_size);
            this.create_infotip({content:this.max_size?'Max size : 100%':'No max size',fadeOut:500,appendTo:"body",position:"fixed"});
        },
        toggle_auto_x : function() {
            this.auto_x = !(this.auto_x);
            this.current.set_auto_x(this.auto_x);
            this.prev.set_auto_x(this.auto_x);
            this.next.set_auto_x(this.auto_x);
        },
        toggle_auto_y : function() {
            this.auto_y = !(this.auto_y);
            this.current.set_auto_y(this.auto_y);
            this.prev.set_auto_y(this.auto_y);
            this.next.set_auto_y(this.auto_y);
        },
        toggle_auto_xy : function() {
            if (this.auto_x || this.auto_y) {
                this.auto_x = false;
                this.auto_y = false;
            } else {
                this.auto_x = true;
                this.auto_y = true;
            }
            this.current.set_auto_x(this.auto_x);
            this.prev.set_auto_x(this.auto_x);
            this.next.set_auto_x(this.auto_x);
            this.current.set_auto_y(this.auto_y);
            this.prev.set_auto_y(this.auto_y);
            this.next.set_auto_y(this.auto_y);
        },
        is_current : function(href) {
            return this.current.img[0].src == href;
        },
        create_infotip : function(params) {
            if (params == undefined) {
                params = {};
            }
            var $info_tip = $("<div style='display:block;position:absolute;left:4px;top:4px;padding:15px;font-size:13px;background:#e9ecf9;color:#000000;font-family:courier new;border-left:2px solid #9999bb;border-top:2px solid #9999bb;border-right:2px solid #5555aa;border-bottom:2px solid #5555aa;-moz-border-radius:15px;-webkit-border-radius:15px;z-index:50001'/>");
            if (params.id != undefined) {
                $info_tip.attr("id",params.id);
            }
            if (params.position != undefined) {
                $info_tip.css("position",params.position);
            }
            if (params.content != undefined) {
                $info_tip.html(params.content);
            }
            if (params.appendTo != undefined) {
                $(params.appendTo).append($info_tip);
            }
            if (params.fadeOut != undefined) {
                setTimeout(function(){ $info_tip.fadeOut("slow",function(){ $info_tip.remove(); }); },params.fadeOut);
                $(params.appendTo).append($info_tip);
            }
            return $info_tip;
        },
        toggle_infobox : function() {
            var gallery = this;
            if ($('#QILVGallery_Infotip').length > 0) {
                $('#QILVGallery_Infotip').remove();
            } else {
                // var $info_tip = $("<div id='QILVGallery_Infotip'/>");
                var $info_tip = this.create_infotip({ id : 'QILVGallery_Infotip' });
                var $info_tip_pre = $("<pre/>");
                $info_tip.append($info_tip_pre);
            
                var text = "";
                $.each($(".QILVGallery_Image"),function(index,this_a){
                    if (gallery.is_current(this_a.href)) {
                        text += "<b>";
                    }
                    text += this_a.href;
                    if (gallery.is_current(this_a.href)) {
                        text += "</b>";
                    }
                    text += "\n";
                });
                $info_tip_pre.html(text);
                $("body").append($info_tip);
            }
        },
        toggle : function() {
            this.current.toggle();
        },
        toggleposition : function() {
            this.current.toggleposition();
            this.next.toggleposition();
            this.prev.toggleposition();
        },
        open_link : function() {
            window.open(this.current.img[0].src);
        },
        help : function() {
            var gallery = this;
            if ($('#QILVGallery_Help').length > 0) {
                $('#QILVGallery_Help').remove();
            } else {
                // var $info_tip = $("<div id='QILVGallery_Infotip'/>");
                var $info_tip = this.create_infotip({ id : 'QILVGallery_Help' });
                $info_tip.css('font-family','"Trebuchet MS",Tahoma,Verdana,Arial,sans-serif').css('font-size','10pt').css('text-align','left')
                $info_tip.append($("<h1/>").css('font-size','2em').css('font-weight','bold').html("Keyboard configuration"));
                var $info_tip_div = $("<div/>").css('margin-left','10px');
                $.each(VK.global_bindings,function(vk_value,vk_props) {
                    if (vk_props[0] == gallery)
                    {
                        // console.log([vk_value,VK.getName(vk_value)]);
                        $info_tip_div.append($("<div/>").html("<b>"+VK.getName(vk_value)+"</b>: "+((vk_props[1] in gallery.bindables) ? gallery.bindables[vk_props[1]] : vk_props[1])));
                    }
                });
                $info_tip.append($info_tip_div);
                $info_tip.append($("<h1/>").css('font-size','2em').css('font-weight','bold').html("Values"));
                $info_tip_div = $("<div/>").css('margin-left','10px');
                $.each(gallery.configurables,function(attr,comment) {
                    $info_tip_div.append($("<div/>").html("<b>"+comment+" (current value)</b>: "+(GM_values['QILV.'+attr] || "default")+" ("+gallery[attr]+")"));
                });
                $info_tip.append($info_tip_div);
                $("body").append($info_tip);
            }
        },
        configurables : {
            "slideshow_speed" : "Initial slideshow speed (ms)",
            "slideshow_mode" : "Slideshow on at start ?",
            "max_size" : "Fit the image to the screen if bigger than the screen at start ?",
            "relative" : "Show image at the top of the screen instead of the top of the page at start ?"
        },
        bindables : {
            "go_prev" : "Go to previous image",
            "go_next" : "Go to next image",
            "toggle_infobox" : "Show/hide the infobox of image list",
            "toggle" : "Show/Hide the current image",
            "open_link" : "Open the image in a new window/tab",
            "startstop_slideshow" : "Start/stop the slideshow",
            "toggleposition" : "Show current image at top of the page/top of the screen",
            "speedup_slideshow" : "Increase the slideshow speed",
            "speeddown_slideshow" : "Decrease the slideshow speed",
            "toggle_max_size" : "Fit the image if larger than the screen/Show whole image",
            "toggle_auto_x" : "Width of the image fit/doesn't fit to width of the screen",
            "toggle_auto_y" : "Height of the image fit/doesn't fit to height of the screen",
            "toggle_auto_xy" : "Width and height of the image fit/doesn't fit to width and height of the screen",
            "help" : "Show/Hide help box"
        },
        key_bindings : {
            LEFT : "go_prev",
            J : "go_prev",
            RIGHT : "go_next",
            K : "go_next",
            I : "toggle_infobox",
            H : "toggle",
            L : "open_link",
            S : "startstop_slideshow",
            R : "toggleposition",
            NUMPAD_ADD : "speedup_slideshow",
            NUMPAD_SUBSTRACT : "speeddown_slideshow",
            M : "toggle_max_size",
            X : "toggle_auto_x",
            Y : "toggle_auto_y",
            Z : "toggle_auto_xy",
            NUMPAD_MULTIPLY : "help"
        },
        __init__ : function() {
        },
        init : function() {
            var self = this;
            
            $.each(["prev","current","next"],function(index,element){
                self[element] = new ImageOverlay(index);
            });
            
            var previouslink = undefined;
            $link_list = $("a").filter(function(index) {
                var link = $(this).attr("href");
                if (link) {
                    var ok = false;
                    $.each([".png",".gif",".jpg",".jpeg"],function(i,element){
                        if (link.substr(link.length-element.length,element.length).toLowerCase()==element) {
                            if (link != previouslink) {
                                ok = true;
                                previouslink = link;
                            }
                        };
                    });
                }
                return ok;
            });
            
            $.each($link_list,function(index,this_a) {
                $(this_a).addClass("QILVGallery_Image");
                $(this_a).addClass("QILVGallery_Image_"+index);
                $(this_a).attr("gprev",".QILVGallery_Image_"+((index==0)?($link_list.length-1):(index-1)));
                $(this_a).attr("gnext",".QILVGallery_Image_"+((index==$link_list.length-1)?(0):(index+1)));
            });
        
            this.go_num(0);
            if ($link_list.length>0)
            {
                this.current.show();
            }
            else
            {
                this.create_infotip({content:'No links to image found in this page !',fadeOut:1500,appendTo:"body",position:"fixed"});
            }
            VK.auto_bind(self);
            // console.log(['init:']);
            $.each(self.configurables,function(keyname,v) {
                var value = GM_values["QILV."+keyname];
                if (value != undefined)
                {
                    if (value.match(/^\-?[0-9]+$/)) { value = parseInt(value);}
                    if (value == 'false') { value = false; }
                    if (value == 'true') { value = true; }
                    // console.log(['configuration:',keyname,value]);
                    self[keyname] = value;
                }
                // console.log(['configuration2:',self,keyname,this[keyname]]);
            });
            this.current.set_max_size(this.max_size);
            this.prev.set_max_size(this.max_size);
            this.next.set_max_size(this.max_size);
            if (this.slideshow_mode)
            {
                this.prepare_next_slide();
            }
            if (this.relative)
            {
                this.toggleposition();
            }
            return self;
        }
    }),
    _QILVGallery_overlays = window.QILVGallery_overlays,
    QILVGallery_overlays = window.QILVGallery_overlays = new GalleryOverlays();
})();