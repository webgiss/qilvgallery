window = this
doinit = () ->
    if not(window.QILVGallery_overlays?) or not(window.VK?)
        setTimeout(doinit, 100)
    else
        window.QILVGallery_overlays.init()
        window.jQuery.noConflict(true)
doinit()
