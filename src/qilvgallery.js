(function(){
    var 
    window = this,
    undefined,
    $ = window.jQuery,
    VK = window.VK,
    _QILVGallery_overlays = window.QILVGallery_overlays,
    QILVGallery_overlays = window.QILVGallery_overlays = {
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
            var $info_tip = $("<div style='display:block;position:absolute;left:4px;top:4px;padding:15px;font-size:13px;background:#eef;color:#000000;font-family:courier new;border-left:2px solid #9999bb;border-top:2px solid #9999bb;border-right:2px solid #5555aa;border-bottom:2px solid #5555aa;-moz-border-radius:15px;-webkit-border-radius:15px;z-index:50001'/>");
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
        configurables : [
            "slideshow_speed",
            "slideshow_mode",
            "max_size",
            "relative"
        ],
        bindables : [
            "go_prev",
            "go_next",
            "toggle_infobox",
            "toggle",
            "open_link",
            "startstop_slideshow",
            "toggleposition",
            "speedup_slideshow",
            "speeddown_slideshow",
            "toggle_max_size",
            "toggle_auto_x",
            "toggle_auto_y",
            "toggle_auto_xy"
        ],
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
            Z : "toggle_auto_xy"
        },
        init : function() {
            var self = this;
            
            $.each(["prev","current","next"],function(index,element){
                self[element] = {
                    div : $("<div id='QILVGallery_Overlay_"+index+"' style='display:none'/>"),
                    a : $("<a/>"),
                    index : index,
                    position : "absolute",
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
                    init : function() {
                        $("body").append(this.div.append(this.a));
                    }
                };
                self[element].init();
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
            $.each(self.configurables,function(index,keyname) {
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
    }
})();