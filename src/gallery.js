(function() {
  var add_css, add_headtag, add_script_content, add_script_ref, jquery_version;
  add_headtag = function(tagname, properties) {
    var key, node;
    node = document.createElement(tagname);
    for (key in properties) {
      node[key] = properties[key];
    }
    return document.getElementsByTagName('head')[0].appendChild(node);
  };
  add_css = function(href) {
    return add_headtag('link', {
      rel: 'stylesheet',
      href: href,
      type: 'text/css'
    });
  };
  add_script_ref = function(src) {
    return add_headtag('script', {
      src: src,
      type: 'text/javascript'
    });
  };
  add_script_content = function(content) {
    return add_headtag('script', {
      text: content,
      type: 'text/javascript'
    });
  };
  jquery_version = "1.4";
  add_script_ref('http://ajax.googleapis.com/ajax/libs/jquery/' + jquery_version + '/jquery.min.js');
  add_script_ref(window.qilv_prefix + 'VK.js' + window.qilv_suffix);
  add_script_ref(window.qilv_prefix + 'qilvgallery.js' + window.qilv_suffix);
  add_script_content("window.QILVGallery_overlays.init();window.jQuery.noConflict(true);");
  if (window.GM_values === null) {
    window.GM_values = {};
  }
}).call(this);
