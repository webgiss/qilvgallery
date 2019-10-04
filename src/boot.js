import DomAccess from './DomAccess';
import VK from './VK';
import GalleryOverlays from './GalleryOverlays';

(() => {
    const readyPromise = new Promise((resolve, reject) => {
        if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
            setTimeout(() => resolve(), 1);
        } else {
            const onContentLoaded = () => {
                resolve();
                document.removeEventListener('DOMContentLoaded', onContentLoaded, false);
            }
            document.addEventListener('DOMContentLoaded', onContentLoaded, false);
        }
    })

    /**
     * Initialise QILVGallery_init
     */
    const QILVGallery_init = () => {
        if (!window.QILVGallery_overlays) {
            /** @type {Object.<string, string>} */
            const config = {};
            const domAccess = new DomAccess();
            const vk = new VK({ config });
            const QILVGallery_overlays = new GalleryOverlays({
                domAccess,
                vk,
                config
            });
            window.QILVGallery_overlays = QILVGallery_overlays;
            QILVGallery_overlays.init();
        }
    }

    readyPromise.then(() => QILVGallery_init());
})()
