(function(){
    function add_headtag(tagname, properties) {
        var node = document.createElement(tagname);
        for(key in properties) { node[key]=properties[key]; }
        document.getElementsByTagName('head')[0].appendChild(node);
    }
    function add_css(href) {
        add_headtag(
            'link',{ 
                rel:'stylesheet', 
                href:href, 
                type:'text/css' 
            }
        );
    }
    function add_script_ref(src) {
        add_headtag(
            'script',{ 
                src:src, 
                type:'text/javascript' 
            }
        );
    }
    function add_script_content(content) {
        add_headtag(
            'script',{ 
                text:content, 
                type:'text/javascript' 
            }
        );
    }
    
    var jquery_version = "1.4";
    add_script_ref('http://ajax.googleapis.com/ajax/libs/jquery/' + jquery_version + '/jquery.min.js');
    add_script_ref(window.qilv_prefix+'VK.js'+window.qilv_suffix);
    add_script_ref(window.qilv_prefix+'qilvgallery.js'+window.qilv_suffix);
    add_script_content("window.QILVGallery_overlays.init();");
    if (window.GM_values == undefined)
    {
        window.GM_values = {};
    }
})();

