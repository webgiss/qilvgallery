add_headtag = (tagname, properties) ->
    node = document.createElement tagname
    node[key]=properties[key] for key of properties
    document.getElementsByTagName('head')[0].appendChild(node)
add_css = (href) ->
    add_headtag(
        'link'
        rel : 'stylesheet'
        href : href
        type : 'text/css'
    )
add_script_ref = (src) ->
    add_headtag(
        'script'
        src : src
        type : 'text/javascript' 
    )
add_script_content = (content) ->
    add_headtag(
        'script'
        text : content
        type : 'text/javascript' 
    )
jquery_version = "1.4"
add_script_ref('http://ajax.googleapis.com/ajax/libs/jquery/' + jquery_version + '/jquery.min.js')
add_script_ref(window.qilv_prefix+'VK.js'+window.qilv_suffix)
add_script_ref(window.qilv_prefix+'qilvgallery.js'+window.qilv_suffix)
add_script_content("window.QILVGallery_overlays.init();window.jQuery.noConflict(true);")

window.GM_values = {} if window.GM_values == null


