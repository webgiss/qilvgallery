(function(){
    function add_css(href) {
        var node = document.createElement('link');
        node.rel = 'stylesheet';
        node.href = href;
        node.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(node);
    }
    function add_script_ref(src) {
        var node = document.createElement('script');
        node.src = src;
        node.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(node);
    }
    function add_script_content(content) {
        var node = document.createElement('script');
        node.type = 'text/javascript';
        node.text = content;
        document.getElementsByTagName('head')[0].appendChild(node);
    }
    
    var jquery_version = "1.3";
    add_script_ref('http://ajax.googleapis.com/ajax/libs/jquery/' + jquery_version + '/jquery.min.js');
    add_script_ref(window.qilvbaseurl+'/VK.js');
    add_script_ref(window.qilvbaseurl+'/qilvgallery.js');
    add_script_content("window.QILVGallery_overlays.init();");
    if (window.GM_values == undefined)
    {
        window.GM_values = {};
    }
})();

