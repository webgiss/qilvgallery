window = @
$ = window.jQuery
VK = window.VK

makeClass = (proto) ->
    proto.__init__.prototype = proto 
    return proto.__init__

# ----------------------------------------------------
# Class ImageOverlay
# ----------------------------------------------------
ImageOverlay = makeClass(
    onload_img : () ->
        $(@).css("border","2px solid black")

    set_max_size : (max_size) ->
        @max_size = max_size
        if @max_size
            @img.css("max-width","100%")
            @img.css("max-height","100%")
        else
            @img.css("max-width","")
            @img.css("max-height","")

    set_auto_x : (auto_x) ->
        @auto_x = auto_x
        if @auto_x
            @img.css("width","100%")
        else 
            @img.css("width","auto")

    set_auto_y : ( auto_y ) ->
        @auto_y = auto_y
        if @auto_y
            @img.css("height","100%")
        else
            @img.css("height","auto")

    update : (selector) ->
        @img.remove() if @img?

        @img = $("<img id='QILVGallery_Current_"+@index+"' class='QILVGallery_Current' src='#' style='display:block;position:absolute;left:0;top:0;z-index:50000' />")
        @img.css("position",@position)
        @img.load(@onload_img)
        @img.attr("current",selector)
        @img.css("border","2px solid red")
        @img.css("-moz-box-sizing","border-box")
        @img.attr("src",$(@img.attr("current")).attr("href"))
        @set_auto_x(@auto_x)
        @set_auto_y(@auto_y)
        @set_max_size(@max_size)
        @a.attr("href",$(@img.attr("current")).attr("href"))
        @a.attr("target","_blank")
        @a.append(@img)
        if @is_centeronscreen then @centeronscreen() else @uncenteronscreen()

        $('#QILVGallery_Infotip').remove()

    hide : () ->
        if @transition_time > 0
            @img.css("z-index",50001)
            @img.fadeOut(
                @transition_time
                () =>
                    @div.css("display","none")
                    @img.css("z-index",50000)
            )
        else
            @div.css("display","none")
        @a.removeAttr("accesskey")

    show : () ->
        @a.attr("accesskey","l")
        if @transition_time > 0
            @img.css("z-index",50000)
            @img.css("display","none")
            @div.css("display","block")
            @img.fadeIn( @transition_time,() => )
        else
            @div.css("display","block")

    is_on : () ->
        return not (@div.css("display")=="none")

    toggle : () ->
        if @is_on() then @hide() else @show()

    togglecenteronscreen : () ->
        if @is_centeronscreen then @uncenteronscreen() else @centeronscreen()

    centeronscreen : () ->
        @img.css("right","0")
        @img.css("bottom","0")
        @img.css("margin","auto")
        @is_centeronscreen = true

    uncenteronscreen : () ->
        @img.css("right","")
        @img.css("bottom","")
        @img.css("margin","")
        @is_centeronscreen = false

    get_relative : () ->
        return @position=="fixed"

    set_relative : (relative) ->
        @position = if relative then "fixed" else "absolute"
        @img.css("position",@position)

    toggleposition : () ->
        @set_relative(not(@get_relative()))

    set_transition_time : (transition_time) ->
        @transition_time = transition_time

    __init__ : (index) ->
        @div = $("<div id='QILVGallery_Overlay_"+index+"' style='display:none'/>")
        @a = $("<a/>")
        @index = index
        @position = "absolute"
        @is_centeronscreen = false
        @transition_time = 0
        $("body").append(@div.append(@a))
        return null
)

# ----------------------------------------------------
# Class GalleryOverlays
# ----------------------------------------------------
GalleryOverlays = makeClass(

    __name__ : 'Gallery'
    jquery : $
    prev : null
    next : null
    current : null
    slideshow_mode : false
    preload_all_mode : false
    slideshow_dir_next : true
    slideshow_speed : 500
    auto_x : false
    auto_y : false
    max_size : false
    relative : false
    is_center_on_screen : false
    is_black_screen : false
    transition_time : 0
    noConflict: () ->
        window.QILVGallery_overlays = _QILVGallery_overlays
        return @

    set_transition_time : (transition_time, silent) ->
        @transition_time = transition_time
        
        $.each( 
            ['prev','next','current'], 
            (index,element) => 
                @[element].set_transition_time(transition_time) 
                return true
        )
        
        @create_infotip (
            content:'Transition\'s effect\'s time : '+transition_time+' ms'
            fadeOut:0
            appendTo:"body"
            position:"fixed"
        ) unless silent

    cycle_transition_time : () ->
        if @transition_time == 0
            @transition_time = 300
        else if @transition_time <= 300
            @transition_time = 800
        else if @transition_time <= 800
            @transition_time = 1500
        else
            @transition_time = 0
        
        @set_transition_time(@transition_time)

    set_center_on_screen : (is_center_on_screen) ->
        $.each( 
            ['prev','next','current'],
            (index,element) =>
                if @[element]
                    if is_center_on_screen then @[element].centeronscreen() else @[element].uncenteronscreen()
                return true
        )
        @is_center_on_screen = is_center_on_screen

    set_black_screen : (is_black_screen) ->
        $black_screen = $("#QILVGallery_black_screen")
        
        if is_black_screen and ($black_screen.length==0)
            $div = $("<div id='QILVGallery_black_screen'/>")
            $("body").append($div)
            $div.css("z-index","49998")
            $div.css("width","100%")
            $div.css("height","100%")
            $div.css("position","fixed")
            $div.css("left","0")
            $div.css("top","0")
            $div.css("background","black")
            
        if (!is_black_screen) && ($black_screen.length>0)
            $black_screen.remove()
        @set_center_on_screen(is_black_screen)
        @is_black_screen = is_black_screen

    show_slideshow_slide : () ->
        if @slideshow_mode
            if @slideshow_dir_next then @go_next() else @go_prev()
            @prepare_next_slide()

    prepare_next_slide : () ->
        setTimeout(
            () => @show_slideshow_slide()
            @slideshow_speed
        )

    start_slideshow : () ->
        @slideshow_mode = true
        @prepare_next_slide()

    stop_slideshow : () ->
        @slideshow_mode = false

    startstop_slideshow : () ->
        if @slideshow_mode then @stop_slideshow() else @start_slideshow()

    speedup_slideshow : () ->
        @slideshow_speed = @slideshow_speed - 100  if @slideshow_speed > 100
        @create_infotip
            content:'Speed : '+@slideshow_speed+' ms'
            fadeOut:0
            appendTo:"body"
            position:"fixed"

    speeddown_slideshow : () ->
        @slideshow_speed = @slideshow_speed + 100
        @create_infotip
            content:'Speed : '+@slideshow_speed+' ms'
            fadeOut:0
            appendTo:"body"
            position:"fixed"

    go_prev : () ->
        @slideshow_dir_next = false
        @current.hide()
        [ @prev, @next, @current ] = [ @next, @current, @prev ]
        @current.show()
        @prev.update( $(@current.img.attr("current")).attr("gprev") )
        @set_black_screen(@is_black_screen)

    go_next : () ->
        @slideshow_dir_next = true
        @current.hide()
        [ @next, @prev, @current ] = [ @prev, @current, @next ]
        @current.show()
        @next.update( $(@current.img.attr("current")).attr("gnext") )
        @set_black_screen(@is_black_screen)

    go_num : (num) ->
        @current.update(".QILVGallery_Image_"+num)
        @prev.update( $(@current.img.attr("current")).attr("gprev") )
        @next.update( $(@current.img.attr("current")).attr("gnext") )
        @set_black_screen(@is_black_screen)

    toggle_max_size : () ->
        @max_size = !(@max_size)
        @current.set_max_size(@max_size)
        @prev.set_max_size(@max_size)
        @next.set_max_size(@max_size)
        @create_infotip
            content: if @max_size then 'Max size : 100%' else 'No max size'
            fadeOut:500
            appendTo:"body"
            position:"fixed"

    toggle_auto_x : () ->
        @auto_x = not(@auto_x)
        @current.set_auto_x(@auto_x)
        @prev.set_auto_x(@auto_x)
        @next.set_auto_x(@auto_x)

    toggle_auto_y : () ->
        @auto_y = !(@auto_y)
        @current.set_auto_y(@auto_y)
        @prev.set_auto_y(@auto_y)
        @next.set_auto_y(@auto_y)

    toggle_auto_xy : () ->
        if @auto_x or @auto_y 
            @auto_x = false
            @auto_y = false
        else
            @auto_x = true
            @auto_y = true
        
        @current.set_auto_x(@auto_x)
        @prev.set_auto_x(@auto_x)
        @next.set_auto_x(@auto_x)
        @current.set_auto_y(@auto_y)
        @prev.set_auto_y(@auto_y)
        @next.set_auto_y(@auto_y)

    is_current : (href) -> @current.img[0].src == href

    create_infotip : (params) ->
        params = {} unless params?
        $info_tip = $("<div style='display:block;position:absolute;left:4px;top:4px;padding:15px;font-size:13px;background:#e9ecf9;color:#000000;font-family:courier new;border-left:2px solid #9999bb;border-top:2px solid #9999bb;border-right:2px solid #5555aa;border-bottom:2px solid #5555aa;-moz-border-radius:15px;-webkit-border-radius:15px;z-index:50001'/>")
        $info_tip.attr("id",params.id) if params.id?
        $info_tip.css("position",params.position) if params.position
        $info_tip.html(params.content) if params.content
        $(params.appendTo).append($info_tip) if params.appendTo
        if params.fadeOut?
            setTimeout(
                () => 
                    $info_tip.fadeOut(
                        "slow"
                        () => $info_tip.remove()
                    )
                params.fadeOut
            )
            $(params.appendTo).append($info_tip)
        if params.center? and params.center
            $info_tip.css("position","fixed")
            $info_tip.css("left","0")
            $info_tip.css("right","0")
            $info_tip.css("top","0")
            $info_tip.css("bottom","0")
            $info_tip.css("margin","auto")
        return $info_tip

    toggle_infobox : () ->
        if $('#QILVGallery_Infotip').length > 0
            $('#QILVGallery_Infotip').remove() 
        else
            $info_tip = @create_infotip id : 'QILVGallery_Infotip'
            $info_tip_pre = $("<pre/>")
            $info_tip.append($info_tip_pre)
        
            text = ""
            $.each($(".QILVGallery_Image"), (index,this_a) =>
                text += "<b>" if @is_current(this_a.href)
                text += this_a.href
                text += "</b>" if @is_current(this_a.href)
                text += "\n"
                return true
            )
            $info_tip_pre.html(text)
            $("body").append($info_tip)

    toggle : () ->
        if @current.is_on() then $("#QILVGallery_black_screen").remove() else @set_black_screen(@is_black_screen)
        @current.toggle()

    toggleposition : () -> @set_relative(!@relative)
    
    set_relative : (relative) ->
        @relative = relative
        @current.set_relative(@relative)
        @next.set_relative(@relative)
        @prev.set_relative(@relative)

    toggle_black_screen : () ->
        @is_black_screen = not(@is_black_screen)
        @set_black_screen(@is_black_screen)

    open_link : () -> window.open(@current.img[0].src)
    
    show_preload_gauge : () ->
        if $("#QILVGallery_preload_gauge").length==0
            $gauge_container = $("<div id='QILVGallery_preload_gauge' style='z-index:50101;border:1px solid black;width:100%;position:fixed;bottom:0;height:13px;background-color:#eee' />")
            $gauge_inner = $("<div id='QILVGallery_preload_gauge_inner' style='z-index:50102;border:0;padding:0;margin:0;width:0%;position:static;left:0;top:0;height:100%;background-color:#f03;text-align:center;font-size:11px;font-family:Arial,Verdana,sans-serif,Helvetica;font-weight:bold;color:#000000' />")
            $gauge_container.append($gauge_inner)
            $("body").append($gauge_container)
            @update_preload_gauge()

    hide_preload_gauge : () -> $("#QILVGallery_preload_gauge").remove()

    update_preload_gauge : () ->
        if $("#QILVGallery_preload_gauge").length>0
            panel = $("#QILVGallery_preload_all_panel")[0]
            $("#QILVGallery_preload_gauge_inner").css("width",(Math.floor(panel._loaded*100/panel._total))+"%")
            $("#QILVGallery_preload_gauge_inner").html(panel._loaded+" / "+panel._total)
            if panel._loaded == panel._total
                $("#QILVGallery_preload_gauge").fadeOut(2000,() => $(@).remove())

    preload_all : () ->
        if $("#QILVGallery_preload_all_panel").length==0
            $panel = $("<div id='QILVGallery_preload_all_panel' style='display:none' />")
            
            $images = $(".QILVGallery_Image")
            $panel[0]._total = $images.length
            $panel[0]._loaded = 0
            $images.each (index,this_a) =>
                $img = $("<img src='#'/>")
                $img.attr('src',this_a.href)
                
                $img.load () =>
                    $panel[0]._loaded += 1
                    @update_preload_gauge()
                $panel.append($img)
                return true
            $("body").append($panel)
            @show_preload_gauge()
        else
            if $("#QILVGallery_preload_gauge").length==0
                @show_preload_gauge()
            else
                @hide_preload_gauge()

    about : () ->
        if $('#QILVGallery_About').length > 0
            $('#QILVGallery_About').remove()
            $('#QILVGallery_About_black_screen').remove()
        else 
            
            $info_tip = @create_infotip
                id : 'QILVGallery_About'
                center : true
            $info_tip.css('font-family','"Trebuchet MS",Tahoma,Verdana,Arial,sans-serif').css('font-size','15pt').css('text-align','center')
            $info_tip.css('max-width','500px')
            $info_tip.css('max-height','300px')
            $info_tip.css('border','1px solid white')
            $info_tip.css('background','#a2a2a2')
            $info_tip.css('background','-moz-linear-gradient(90deg,#888,#ddd)')
            $info_tip.css('background','-webkit-linear-gradient(90deg,#888,#ddd)')
            $info_tip.css('z-index','50100')
            $info_tip.append($('<p>QILV Gallery</p>').css('font-size','20pt'))
            $info_tip.append("<a href='http://code.google.com/p/qilvgallery/' target='_blank'>http://code.google.com/p/qilvgallery/</a>")
            $info_tip.append($('<br/>'))
            $close_button = $('<div>Close</div>')
            $close_button.css('width','20em')
            $close_button.css('width','20em')
            $close_button.css('border','1px solid #fff')
            $close_button.css('background','#ccc')
            $close_button.css('background','-moz-linear-gradient(90deg, #aaa, #eee)')
            $close_button.css('-moz-border-radius','8px')
            $close_button.css('-webkit-border-radius','8px')
            $close_button.css('left','0')
            $close_button.css('right','0')
            $close_button.css('margin','100px auto auto')
            $close_button.css('border','1px solid #666')
            $div = $("<div id='QILVGallery_About_black_screen'/>")
            $div.css("z-index","49998")
            $div.css("width","100%")
            $div.css("height","100%")
            $div.css("position","fixed")
            $div.css("left","0")
            $div.css("top","0")
            $div.css("background","black")
            $div.css('z-index','50098')
            $div.css("opacity","0.8")
            $("body").append($div)
            $("body").append($info_tip)
            on_click = () ->
                $('#QILVGallery_About').remove()
                $('#QILVGallery_About_black_screen').remove()
            $close_button.click(on_click)
            $info_tip.append($close_button)
            $div.click(on_click)

    help : () ->
        if ($('#QILVGallery_Help').length > 0) 
            $('#QILVGallery_Help').remove()
        else
            $info_tip = @create_infotip  id:'QILVGallery_Help'
            $info_tip
                .css('font-family','"Trebuchet MS",Tahoma,Verdana,Arial,sans-serif')
                .css('font-size','10pt')
                .css('text-align','left')
            $info_tip
                .append(
                    $("<h1/>")
                        .css('font-size','2em')
                        .css('font-weight','bold')
                        .html("Keyboard configuration")
                )
            $info_tip_div = $("<div/>").css('margin-left','10px')
            $.each( VK.global_bindings, (vk_value,vk_props) =>
                if (vk_props[0] == @)
                    $info_tip_div.append(
                        $("<div/>").html("<b>"+VK.getName(vk_value)+"</b>: "+( if vk_props[1] of @bindables then @bindables[vk_props[1]] else vk_props[1]))
                    )
                return true
            )
            $info_tip.append($info_tip_div)
            $info_tip.append($("<h1/>").css('font-size','2em').css('font-weight','bold').html("Values"))
            $info_tip_div = $("<div/>").css('margin-left','10px')
            $.each(@configurables, (attr,comment) =>
                $info_tip_div.append($("<div/>").html("<b>"+comment+" (current value)</b>: "+(GM_values['QILV.'+attr] || "default")+" ("+@[attr]+")"))
                return true
            )
            $info_tip.append($info_tip_div)
            $("body").append($info_tip)

    configurables : 
        "slideshow_speed" : "Initial slideshow speed (ms)"
        "transition_time" : "Initial transition's effect's time (ms)"
        "slideshow_mode" : "Slideshow on at start ?"
        "preload_all_mode" : "Preload all at start ?"
        "max_size" : "Fit the image to the screen if bigger than the screen at start ?"
        "relative" : "Show image at the top of the screen instead of the top of the page at start ?"
        "is_black_screen" : "Show on 'black screen' mode at start ?"
    
    bindables : 
        "go_prev" : "Go to previous image"
        "go_next" : "Go to next image"
        "toggle_infobox" : "Show/hide the infobox of image list"
        "toggle" : "Show/Hide the current image"
        "open_link" : "Open the image in a new window/tab"
        "startstop_slideshow" : "Start/stop the slideshow"
        "toggleposition" : "Show current image at top of the page/top of the screen"
        "speedup_slideshow" : "Increase the slideshow speed"
        "speeddown_slideshow" : "Decrease the slideshow speed"
        "toggle_max_size" : "Fit the image if larger than the screen/Show whole image"
        "toggle_auto_x" : "Width of the image fit/doesn't fit to width of the screen"
        "toggle_auto_y" : "Height of the image fit/doesn't fit to height of the screen"
        "toggle_auto_xy" : "Width and height of the image fit/doesn't fit to width and height of the screen"
        "toggle_black_screen" : "Set or remove the black screen"
        "cycle_transition_time" : "Change transition's effect's time"
        "preload_all" : "Pre-load all images (may take some resources)"
        "about" : "Show/Hide about box"
        "help" : "Show/Hide help box"

    key_bindings :
        LEFT : "go_prev"
        J : "go_prev"
        RIGHT : "go_next"
        K : "go_next"
        I : "toggle_infobox"
        H : "toggle"
        L : "open_link"
        S : "startstop_slideshow"
        R : "toggleposition"
        NUMPAD_ADD : "speedup_slideshow"
        NUMPAD_SUBSTRACT : "speeddown_slideshow"
        M : "toggle_max_size"
        X : "toggle_auto_x"
        Y : "toggle_auto_y"
        Z : "toggle_auto_xy"
        B : "toggle_black_screen"
        T : "cycle_transition_time"
        P : "preload_all"
        NUMPAD_MULTIPLY : "help"
        NUMPAD_DIVIDE : "about"

    __init__ : () ->

    init : () ->
        window.test = {}
        window.test.ImageOverlay = ImageOverlay
        window.test.makeClass = makeClass

        for index_element in [[0,"prev"],[1,"current"],[2,"next"]]
            [index, element] = index_element
            @[element] = new ImageOverlay(index)
        previouslink = undefined

        $link_list = $("a").filter (index,this_a) =>
            link = $(this_a).attr("href")
            if link
                ok = false
                $.each(
                    [".png",".gif",".jpg",".jpeg"]
                    (i,element) =>
                        if link.substr(link.length-element.length,element.length).toLowerCase()==element
                            if link != previouslink
                                ok = true
                                previouslink = link
                        return true
                )
            
            return ok;
        
        $.each(
            $link_list
            (index,this_a) =>
                $(this_a).addClass("QILVGallery_Image")
                $(this_a).addClass("QILVGallery_Image_"+index)
                $(this_a).attr("gprev",".QILVGallery_Image_"+( if index==0 then $link_list.length-1 else index-1))
                $(this_a).attr("gnext",".QILVGallery_Image_"+( if index==$link_list.length-1 then 0 else index+1))
                return true
        )
    
        @go_num(0)
        if $link_list.length>0
            @current.show()
        else
            @stop_slideshow()
            @set_black_screen(false)
            @create_infotip
                content:'No links to image found in this page !'
                fadeOut:1500
                appendTo:"body"
                position:"fixed"

        VK.auto_bind(@)
        $.each(
            @configurables,
            (keyname,v) =>
                value = GM_values["QILV."+keyname]
                if value?
                    value = parseInt(value) if (value.match(/^\-?[0-9]+$/))
                    value = false if value == 'false'
                    value = true if value == 'true'
                    @[keyname] = value
                return true
        )
        @current.set_max_size(@max_size)
        @prev.set_max_size(@max_size)
        @next.set_max_size(@max_size)
        @prepare_next_slide() if @slideshow_mode
        @preload_all() if @preload_all_mode
        
        @set_relative(@relative)
        @set_black_screen(@is_black_screen)
        @set_transition_time(@transition_time, true)

        return @
)
# ----------------------------------------------------

_QILVGallery_overlays = window.QILVGallery_overlays
QILVGallery_overlays = window.QILVGallery_overlays = new GalleryOverlays()
    
