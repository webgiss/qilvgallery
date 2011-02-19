window = this
jQueryVersion = "1.4.4"

add_script = (src) ->
    node = document.createElement 'script'
    node.src = src
    node.type = 'text/javascript'
    document.getElementsByTagName('head')[0].appendChild(node)

prefix_url = if window.qilv_prefix_url? then window.qilv_prefix_url else ''
suffix_url = if window.qilv_suffix_url? then window.qilv_suffix_url else ''

jquery_explicit_load = false
if not(window.jQuery?) or (window.jQuery.fn.jquery != jQueryVersion)
    jquery_explicit_load = true
    add_script 'http://ajax.googleapis.com/ajax/libs/jquery/'+jQueryVersion+'/jquery.min.js'
    
wait_for_jquery = (on_jquery_here) ->
    if not(window.jQuery?) or (window.jQuery.fn.jquery != jQueryVersion)
        setTimeout (() -> wait_for_jquery(on_jquery_here)), 100
    else
        on_jquery_here()
        
wait_for_vk = (on_vk_here) ->
    if not(window.VK?)
        setTimeout (() -> wait_for_vk(on_vk_here)), 100
    else
        on_vk_here()
        
wait_for_qilvgallery = (on_qilvgallery_here) ->
    if not(window.QILVGallery_overlays?)
        setTimeout (() -> wait_for_qilvgallery(on_qilvgallery_here)), 100
    else
        on_qilvgallery_here()
        
wait_for_jquery () ->
    add_script prefix_url+'VK.js'+suffix_url
    wait_for_vk () -> 
        add_script prefix_url+'qilvgallery.js'+suffix_url
        wait_for_qilvgallery () ->
            if window.qilv_configuration? 
                add_script prefix_url+'gallery.js'+suffix_url
            else
                window.QILVGallery_overlays.init()
                window.jQuery.noConflict(true) if jquery_explicit_load

