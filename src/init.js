(function() {
  var doinit, window;
  window = this;
  doinit = function() {
    if (!(window.QILVGallery_overlays != null) || !(window.VK != null)) {
      return setTimeout(doinit, 100);
    } else {
      window.QILVGallery_overlays.init();
      return window.jQuery.noConflict(true);
    }
  };
  doinit();
}).call(this);
