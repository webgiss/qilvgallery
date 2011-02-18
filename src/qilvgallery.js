(function() {
  var $, GalleryOverlays, ImageOverlay, QILVGallery_overlays, VK, makeClass, window, _QILVGallery_overlays;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window = this;
  $ = window.jQuery;
  VK = window.VK;
  makeClass = function(proto) {
    proto.__init__.prototype = proto;
    return proto.__init__;
  };
  ImageOverlay = makeClass({
    onload_img: function() {
      return $(this).css("border", "2px solid black");
    },
    set_max_size: function(max_size) {
      this.max_size = max_size;
      if (this.max_size) {
        this.img.css("max-width", "100%");
        return this.img.css("max-height", "100%");
      } else {
        this.img.css("max-width", "");
        return this.img.css("max-height", "");
      }
    },
    set_auto_x: function(auto_x) {
      this.auto_x = auto_x;
      if (this.auto_x) {
        return this.img.css("width", "100%");
      } else {
        return this.img.css("width", "auto");
      }
    },
    set_auto_y: function(auto_y) {
      this.auto_y = auto_y;
      if (this.auto_y) {
        return this.img.css("height", "100%");
      } else {
        return this.img.css("height", "auto");
      }
    },
    update: function(selector) {
      if (this.img != null) {
        this.img.remove();
      }
      this.img = $("<img id='QILVGallery_Current_" + this.index + "' class='QILVGallery_Current' src='#' style='display:block;position:absolute;left:0;top:0;z-index:50000' />");
      this.img.css("position", this.position);
      this.img.load(this.onload_img);
      this.img.attr("current", selector);
      this.img.css("border", "2px solid red");
      this.img.css("-moz-box-sizing", "border-box");
      this.img.attr("src", $(this.img.attr("current")).attr("href"));
      this.set_auto_x(this.auto_x);
      this.set_auto_y(this.auto_y);
      this.set_max_size(this.max_size);
      this.a.attr("href", $(this.img.attr("current")).attr("href"));
      this.a.attr("target", "_blank");
      this.a.append(this.img);
      if (this.is_centeronscreen) {
        this.centeronscreen();
      } else {
        this.uncenteronscreen();
      }
      return $('#QILVGallery_Infotip').remove();
    },
    hide: function() {
      if (this.transition_time > 0) {
        this.img.css("z-index", 50001);
        this.img.fadeOut(this.transition_time, __bind(function() {
          this.div.css("display", "none");
          return this.img.css("z-index", 50000);
        }, this));
      } else {
        this.div.css("display", "none");
      }
      return this.a.removeAttr("accesskey");
    },
    show: function() {
      this.a.attr("accesskey", "l");
      if (this.transition_time > 0) {
        this.img.css("z-index", 50000);
        this.img.css("display", "none");
        this.div.css("display", "block");
        return this.img.fadeIn(this.transition_time, __bind(function() {}, this));
      } else {
        return this.div.css("display", "block");
      }
    },
    is_on: function() {
      return !(this.div.css("display") === "none");
    },
    toggle: function() {
      if (this.is_on()) {
        return this.hide();
      } else {
        return this.show();
      }
    },
    togglecenteronscreen: function() {
      if (this.is_centeronscreen) {
        return this.uncenteronscreen();
      } else {
        return this.centeronscreen();
      }
    },
    centeronscreen: function() {
      this.img.css("right", "0");
      this.img.css("bottom", "0");
      this.img.css("margin", "auto");
      return this.is_centeronscreen = true;
    },
    uncenteronscreen: function() {
      this.img.css("right", "");
      this.img.css("bottom", "");
      this.img.css("margin", "");
      return this.is_centeronscreen = false;
    },
    get_relative: function() {
      return this.position === "fixed";
    },
    set_relative: function(relative) {
      this.position = relative ? "fixed" : "absolute";
      return this.img.css("position", this.position);
    },
    toggleposition: function() {
      return this.set_relative(!(this.get_relative()));
    },
    set_transition_time: function(transition_time) {
      return this.transition_time = transition_time;
    },
    __init__: function(index) {
      this.div = $("<div id='QILVGallery_Overlay_" + index + "' style='display:none'/>");
      this.a = $("<a/>");
      this.index = index;
      this.position = "absolute";
      this.is_centeronscreen = false;
      this.transition_time = 0;
      $("body").append(this.div.append(this.a));
      return null;
    }
  });
  GalleryOverlays = makeClass({
    __name__: 'Gallery',
    jquery: $,
    prev: null,
    next: null,
    current: null,
    slideshow_mode: false,
    slideshow_dir_next: true,
    slideshow_speed: 500,
    auto_x: false,
    auto_y: false,
    max_size: false,
    relative: false,
    is_center_on_screen: false,
    is_black_screen: false,
    transition_time: 0,
    noConflict: function() {
      window.QILVGallery_overlays = _QILVGallery_overlays;
      return this;
    },
    set_transition_time: function(transition_time, silent) {
      this.transition_time = transition_time;
      $.each(['prev', 'next', 'current'], __bind(function(index, element) {
        this[element].set_transition_time(transition_time);
        return true;
      }, this));
      if (!silent) {
        return this.create_infotip({
          content: 'Transition\'s effect\'s time : ' + transition_time + ' ms',
          fadeOut: 0,
          appendTo: "body",
          position: "fixed"
        });
      }
    },
    cycle_transition_time: function() {
      if (this.transition_time === 0) {
        this.transition_time = 300;
      } else if (this.transition_time <= 300) {
        this.transition_time = 800;
      } else if (this.transition_time <= 800) {
        this.transition_time = 1500;
      } else {
        this.transition_time = 0;
      }
      return this.set_transition_time(this.transition_time);
    },
    set_center_on_screen: function(is_center_on_screen) {
      $.each(['prev', 'next', 'current'], __bind(function(index, element) {
        if (this[element]) {
          if (is_center_on_screen) {
            this[element].centeronscreen();
          } else {
            this[element].uncenteronscreen();
          }
        }
        return true;
      }, this));
      return this.is_center_on_screen = is_center_on_screen;
    },
    set_black_screen: function(is_black_screen) {
      var $black_screen, $div;
      $black_screen = $("#QILVGallery_black_screen");
      if (is_black_screen && ($black_screen.length === 0)) {
        $div = $("<div id='QILVGallery_black_screen'/>");
        $("body").append($div);
        $div.css("z-index", "49998");
        $div.css("width", "100%");
        $div.css("height", "100%");
        $div.css("position", "fixed");
        $div.css("left", "0");
        $div.css("top", "0");
        $div.css("background", "black");
      }
      if ((!is_black_screen) && ($black_screen.length > 0)) {
        $black_screen.remove();
      }
      this.set_center_on_screen(is_black_screen);
      return this.is_black_screen = is_black_screen;
    },
    show_slideshow_slide: function() {
      if (this.slideshow_mode) {
        if (this.slideshow_dir_next) {
          this.go_next();
        } else {
          this.go_prev();
        }
        return this.prepare_next_slide();
      }
    },
    prepare_next_slide: function() {
      return setTimeout(__bind(function() {
        return this.show_slideshow_slide();
      }, this), this.slideshow_speed);
    },
    start_slideshow: function() {
      this.slideshow_mode = true;
      return this.prepare_next_slide();
    },
    stop_slideshow: function() {
      return this.slideshow_mode = false;
    },
    startstop_slideshow: function() {
      if (this.slideshow_mode) {
        return this.stop_slideshow();
      } else {
        return this.start_slideshow();
      }
    },
    speedup_slideshow: function() {
      if (this.slideshow_speed > 100) {
        this.slideshow_speed = this.slideshow_speed - 100;
      }
      return this.create_infotip({
        content: 'Speed : ' + this.slideshow_speed + ' ms',
        fadeOut: 0,
        appendTo: "body",
        position: "fixed"
      });
    },
    speeddown_slideshow: function() {
      this.slideshow_speed = this.slideshow_speed + 100;
      return this.create_infotip({
        content: 'Speed : ' + this.slideshow_speed + ' ms',
        fadeOut: 0,
        appendTo: "body",
        position: "fixed"
      });
    },
    go_prev: function() {
      var _ref;
      this.slideshow_dir_next = false;
      this.current.hide();
      _ref = [this.next, this.current, this.prev], this.prev = _ref[0], this.next = _ref[1], this.current = _ref[2];
      this.current.show();
      this.prev.update($(this.current.img.attr("current")).attr("gprev"));
      return this.set_black_screen(this.is_black_screen);
    },
    go_next: function() {
      var _ref;
      this.slideshow_dir_next = true;
      this.current.hide();
      _ref = [this.prev, this.current, this.next], this.next = _ref[0], this.prev = _ref[1], this.current = _ref[2];
      this.current.show();
      this.next.update($(this.current.img.attr("current")).attr("gnext"));
      return this.set_black_screen(this.is_black_screen);
    },
    go_num: function(num) {
      this.current.update(".QILVGallery_Image_" + num);
      this.prev.update($(this.current.img.attr("current")).attr("gprev"));
      this.next.update($(this.current.img.attr("current")).attr("gnext"));
      return this.set_black_screen(this.is_black_screen);
    },
    toggle_max_size: function() {
      this.max_size = !this.max_size;
      this.current.set_max_size(this.max_size);
      this.prev.set_max_size(this.max_size);
      this.next.set_max_size(this.max_size);
      return this.create_infotip({
        content: this.max_size ? 'Max size : 100%' : 'No max size',
        fadeOut: 500,
        appendTo: "body",
        position: "fixed"
      });
    },
    toggle_auto_x: function() {
      this.auto_x = !this.auto_x;
      this.current.set_auto_x(this.auto_x);
      this.prev.set_auto_x(this.auto_x);
      return this.next.set_auto_x(this.auto_x);
    },
    toggle_auto_y: function() {
      this.auto_y = !this.auto_y;
      this.current.set_auto_y(this.auto_y);
      this.prev.set_auto_y(this.auto_y);
      return this.next.set_auto_y(this.auto_y);
    },
    toggle_auto_xy: function() {
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
      return this.next.set_auto_y(this.auto_y);
    },
    is_current: function(href) {
      return this.current.img[0].src === href;
    },
    create_infotip: function(params) {
      var $info_tip;
      if (params == null) {
        params = {};
      }
      $info_tip = $("<div style='display:block;position:absolute;left:4px;top:4px;padding:15px;font-size:13px;background:#e9ecf9;color:#000000;font-family:courier new;border-left:2px solid #9999bb;border-top:2px solid #9999bb;border-right:2px solid #5555aa;border-bottom:2px solid #5555aa;-moz-border-radius:15px;-webkit-border-radius:15px;z-index:50001'/>");
      if (params.id != null) {
        $info_tip.attr("id", params.id);
      }
      if (params.position) {
        $info_tip.css("position", params.position);
      }
      if (params.content) {
        $info_tip.html(params.content);
      }
      if (params.appendTo) {
        $(params.appendTo).append($info_tip);
      }
      if (params.fadeOut != null) {
        setTimeout(__bind(function() {
          return $info_tip.fadeOut("slow", __bind(function() {
            return $info_tip.remove();
          }, this));
        }, this), params.fadeOut);
        $(params.appendTo).append($info_tip);
      }
      if ((params.center != null) && params.center) {
        $info_tip.css("position", "fixed");
        $info_tip.css("left", "0");
        $info_tip.css("right", "0");
        $info_tip.css("top", "0");
        $info_tip.css("bottom", "0");
        $info_tip.css("margin", "auto");
      }
      return $info_tip;
    },
    toggle_infobox: function() {
      var $info_tip, $info_tip_pre, text;
      if ($('#QILVGallery_Infotip').length > 0) {
        return $('#QILVGallery_Infotip').remove();
      } else {
        $info_tip = this.create_infotip({
          id: 'QILVGallery_Infotip'
        });
        $info_tip_pre = $("<pre/>");
        $info_tip.append($info_tip_pre);
        text = "";
        $.each($(".QILVGallery_Image"), __bind(function(index, this_a) {
          if (this.is_current(this_a.href)) {
            text += "<b>";
          }
          text += this_a.href;
          if (this.is_current(this_a.href)) {
            text += "</b>";
          }
          text += "\n";
          return true;
        }, this));
        $info_tip_pre.html(text);
        return $("body").append($info_tip);
      }
    },
    toggle: function() {
      if (this.current.is_on()) {
        $("#QILVGallery_black_screen").remove();
      } else {
        this.set_black_screen(this.is_black_screen);
      }
      return this.current.toggle();
    },
    toggleposition: function() {
      return this.set_relative(!this.relative);
    },
    set_relative: function(relative) {
      this.relative = relative;
      this.current.set_relative(this.relative);
      this.next.set_relative(this.relative);
      return this.prev.set_relative(this.relative);
    },
    toggle_black_screen: function() {
      this.is_black_screen = !this.is_black_screen;
      return this.set_black_screen(this.is_black_screen);
    },
    open_link: function() {
      return window.open(this.current.img[0].src);
    },
    show_preload_gauge: function() {
      var $gauge_container, $gauge_inner;
      if ($("#QILVGallery_preload_gauge").length === 0) {
        $gauge_container = $("<div id='QILVGallery_preload_gauge' style='z-index:50101;border:1px solid black;width:100%;position:fixed;bottom:0;height:13px;background-color:#eee' />");
        $gauge_inner = $("<div id='QILVGallery_preload_gauge_inner' style='z-index:50102;border:0;padding:0;margin:0;width:0%;position:static;left:0;top:0;height:100%;background-color:#f03;text-align:center;font-size:11px;font-family:Arial,Verdana,sans-serif,Helvetica;font-weight:bold;color:#000000' />");
        $gauge_container.append($gauge_inner);
        $("body").append($gauge_container);
        return this.update_preload_gauge();
      }
    },
    hide_preload_gauge: function() {
      return $("#QILVGallery_preload_gauge").remove();
    },
    update_preload_gauge: function() {
      var panel;
      if ($("#QILVGallery_preload_gauge").length > 0) {
        panel = $("#QILVGallery_preload_all_panel")[0];
        $("#QILVGallery_preload_gauge_inner").css("width", (Math.floor(panel._loaded * 100 / panel._total)) + "%");
        $("#QILVGallery_preload_gauge_inner").html(panel._loaded + " / " + panel._total);
        if (panel._loaded === panel._total) {
          return $("#QILVGallery_preload_gauge").fadeOut(2000, __bind(function() {
            return $(this).remove();
          }, this));
        }
      }
    },
    preload_all: function() {
      var $images, $panel;
      if ($("#QILVGallery_preload_all_panel").length === 0) {
        $panel = $("<div id='QILVGallery_preload_all_panel' style='display:none' />");
        $images = $(".QILVGallery_Image");
        $panel[0]._total = $images.length;
        $panel[0]._loaded = 0;
        $images.each(__bind(function(index, this_a) {
          var $img;
          $img = $("<img src='#'/>");
          $img.attr('src', this_a.href);
          $img.load(__bind(function() {
            $panel[0]._loaded += 1;
            return this.update_preload_gauge();
          }, this));
          $panel.append($img);
          return true;
        }, this));
        $("body").append($panel);
        return this.show_preload_gauge();
      } else {
        if ($("#QILVGallery_preload_gauge").length === 0) {
          return this.show_preload_gauge();
        } else {
          return this.hide_preload_gauge();
        }
      }
    },
    about: function() {
      var $close_button, $div, $info_tip, on_click;
      if ($('#QILVGallery_About').length > 0) {
        $('#QILVGallery_About').remove();
        return $('#QILVGallery_About_black_screen').remove();
      } else {
        $info_tip = this.create_infotip({
          id: 'QILVGallery_About',
          center: true
        });
        $info_tip.css('font-family', '"Trebuchet MS",Tahoma,Verdana,Arial,sans-serif').css('font-size', '15pt').css('text-align', 'center');
        $info_tip.css('max-width', '500px');
        $info_tip.css('max-height', '300px');
        $info_tip.css('border', '1px solid white');
        $info_tip.css('background', '#a2a2a2');
        $info_tip.css('background', '-moz-linear-gradient(90deg,#888,#ddd)');
        $info_tip.css('background', '-webkit-linear-gradient(90deg,#888,#ddd)');
        $info_tip.css('z-index', '50100');
        $info_tip.append($('<p>QILV Gallery</p>').css('font-size', '20pt'));
        $info_tip.append("<a href='http://code.google.com/p/qilvgallery/' target='_blank'>http://code.google.com/p/qilvgallery/</a>");
        $info_tip.append($('<br/>'));
        $close_button = $('<div>Close</div>');
        $close_button.css('width', '20em');
        $close_button.css('width', '20em');
        $close_button.css('border', '1px solid #fff');
        $close_button.css('background', '#ccc');
        $close_button.css('background', '-moz-linear-gradient(90deg, #aaa, #eee)');
        $close_button.css('-moz-border-radius', '8px');
        $close_button.css('-webkit-border-radius', '8px');
        $close_button.css('left', '0');
        $close_button.css('right', '0');
        $close_button.css('margin', '100px auto auto');
        $close_button.css('border', '1px solid #666');
        $div = $("<div id='QILVGallery_About_black_screen'/>");
        $div.css("z-index", "49998");
        $div.css("width", "100%");
        $div.css("height", "100%");
        $div.css("position", "fixed");
        $div.css("left", "0");
        $div.css("top", "0");
        $div.css("background", "black");
        $div.css('z-index', '50098');
        $div.css("opacity", "0.8");
        $("body").append($div);
        $("body").append($info_tip);
        on_click = function() {
          $('#QILVGallery_About').remove();
          return $('#QILVGallery_About_black_screen').remove();
        };
        $close_button.click(on_click);
        $info_tip.append($close_button);
        return $div.click(on_click);
      }
    },
    help: function() {
      var $info_tip, $info_tip_div;
      if ($('#QILVGallery_Help').length > 0) {
        return $('#QILVGallery_Help').remove();
      } else {
        $info_tip = this.create_infotip({
          id: 'QILVGallery_Help'
        });
        $info_tip.css('font-family', '"Trebuchet MS",Tahoma,Verdana,Arial,sans-serif').css('font-size', '10pt').css('text-align', 'left');
        $info_tip.append($("<h1/>").css('font-size', '2em').css('font-weight', 'bold').html("Keyboard configuration"));
        $info_tip_div = $("<div/>").css('margin-left', '10px');
        $.each(VK.global_bindings, __bind(function(vk_value, vk_props) {
          if (vk_props[0] === this) {
            $info_tip_div.append($("<div/>").html("<b>" + VK.getName(vk_value) + "</b>: " + (vk_props[1] in this.bindables ? this.bindables[vk_props[1]] : vk_props[1])));
          }
          return true;
        }, this));
        $info_tip.append($info_tip_div);
        $info_tip.append($("<h1/>").css('font-size', '2em').css('font-weight', 'bold').html("Values"));
        $info_tip_div = $("<div/>").css('margin-left', '10px');
        $.each(this.configurables, __bind(function(attr, comment) {
          $info_tip_div.append($("<div/>").html("<b>" + comment + " (current value)</b>: " + (GM_values['QILV.' + attr] || "default") + " (" + this[attr] + ")"));
          return true;
        }, this));
        $info_tip.append($info_tip_div);
        return $("body").append($info_tip);
      }
    },
    configurables: {
      "slideshow_speed": "Initial slideshow speed (ms)",
      "transition_time": "Initial transition's effect's time (ms)",
      "slideshow_mode": "Slideshow on at start ?",
      "max_size": "Fit the image to the screen if bigger than the screen at start ?",
      "relative": "Show image at the top of the screen instead of the top of the page at start ?",
      "is_black_screen": "Show on 'black screen' mode at start ?"
    },
    bindables: {
      "go_prev": "Go to previous image",
      "go_next": "Go to next image",
      "toggle_infobox": "Show/hide the infobox of image list",
      "toggle": "Show/Hide the current image",
      "open_link": "Open the image in a new window/tab",
      "startstop_slideshow": "Start/stop the slideshow",
      "toggleposition": "Show current image at top of the page/top of the screen",
      "speedup_slideshow": "Increase the slideshow speed",
      "speeddown_slideshow": "Decrease the slideshow speed",
      "toggle_max_size": "Fit the image if larger than the screen/Show whole image",
      "toggle_auto_x": "Width of the image fit/doesn't fit to width of the screen",
      "toggle_auto_y": "Height of the image fit/doesn't fit to height of the screen",
      "toggle_auto_xy": "Width and height of the image fit/doesn't fit to width and height of the screen",
      "toggle_black_screen": "Set or remove the black screen",
      "cycle_transition_time": "Change transition's effect's time",
      "preload_all": "Pre-load all images (may take some resources)",
      "about": "Show/Hide about box",
      "help": "Show/Hide help box"
    },
    key_bindings: {
      LEFT: "go_prev",
      J: "go_prev",
      RIGHT: "go_next",
      K: "go_next",
      I: "toggle_infobox",
      H: "toggle",
      L: "open_link",
      S: "startstop_slideshow",
      R: "toggleposition",
      NUMPAD_ADD: "speedup_slideshow",
      NUMPAD_SUBSTRACT: "speeddown_slideshow",
      M: "toggle_max_size",
      X: "toggle_auto_x",
      Y: "toggle_auto_y",
      Z: "toggle_auto_xy",
      B: "toggle_black_screen",
      T: "cycle_transition_time",
      P: "preload_all",
      NUMPAD_MULTIPLY: "help",
      NUMPAD_DIVIDE: "about"
    },
    __init__: function() {},
    init: function() {
      var $link_list, element, index, index_element, previouslink, _i, _len, _ref;
      window.test = {};
      window.test.ImageOverlay = ImageOverlay;
      window.test.makeClass = makeClass;
      _ref = [[0, "prev"], [1, "current"], [2, "next"]];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        index_element = _ref[_i];
        index = index_element[0], element = index_element[1];
        this[element] = new ImageOverlay(index);
      }
      previouslink = void 0;
      $link_list = $("a").filter(__bind(function(index, this_a) {
        var link, ok;
        link = $(this_a).attr("href");
        if (link) {
          ok = false;
          $.each([".png", ".gif", ".jpg", ".jpeg"], __bind(function(i, element) {
            if (link.substr(link.length - element.length, element.length).toLowerCase() === element) {
              if (link !== previouslink) {
                ok = true;
                previouslink = link;
              }
            }
            return true;
          }, this));
        }
        return ok;
      }, this));
      $.each($link_list, __bind(function(index, this_a) {
        $(this_a).addClass("QILVGallery_Image");
        $(this_a).addClass("QILVGallery_Image_" + index);
        $(this_a).attr("gprev", ".QILVGallery_Image_" + (index === 0 ? $link_list.length - 1 : index - 1));
        $(this_a).attr("gnext", ".QILVGallery_Image_" + (index === $link_list.length - 1 ? 0 : index + 1));
        return true;
      }, this));
      this.go_num(0);
      if ($link_list.length > 0) {
        this.current.show();
      } else {
        this.stop_slideshow();
        this.set_black_screen(false);
        this.create_infotip({
          content: 'No links to image found in this page !',
          fadeOut: 1500,
          appendTo: "body",
          position: "fixed"
        });
      }
      VK.auto_bind(this);
      $.each(this.configurables, __bind(function(keyname, v) {
        var value;
        value = GM_values["QILV." + keyname];
        if (value != null) {
          if (value.match(/^\-?[0-9]+$/)) {
            value = parseInt(value);
          }
          if (value === 'false') {
            value = false;
          }
          if (value === 'true') {
            value = true;
          }
          this[keyname] = value;
        }
        return true;
      }, this));
      this.current.set_max_size(this.max_size);
      this.prev.set_max_size(this.max_size);
      this.next.set_max_size(this.max_size);
      if (this.slideshow_mode) {
        this.prepare_next_slide();
      }
      this.set_relative(this.relative);
      this.set_black_screen(this.is_black_screen);
      this.set_transition_time(this.transition_time, true);
      return this;
    }
  });
  _QILVGallery_overlays = window.QILVGallery_overlays;
  QILVGallery_overlays = window.QILVGallery_overlays = new GalleryOverlays();
}).call(this);
