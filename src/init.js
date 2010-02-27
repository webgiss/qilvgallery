(function(){
    var 
    window = this,
    undefined;
    function doinit () {
        if ((window.QILVGallery_overlays == undefined) || (window.VK == undefined)) { 
            // console.log("here");
            setTimeout(doinit, 100);
        } else {
            // console.log("thislog");
            // console.log([window.QILVGallery_overlays,window.VK]);
            window.QILVGallery_overlays.init();
            window.jQuery.noConflict(true);
        }
    }
    // console.log("now");
    doinit();
    // console.log("there");
    
})();
