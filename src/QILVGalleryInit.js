import DomAccess from './DomAccess';
import ImageOverlayFactory from './ImageOverlayFactory';
import GalleryOverlaysUi from './GalleryOverlaysUi';
import VK from './VK';
import GalleryOverlays from './GalleryOverlays';
import StreamAccess from './StreamAccess';

/**
 * Initialise QILVGallery_init
 * @returns {void}
 */

export default QILVGalleryInit = () => {
    if (!window.QILVGalleryOverlays) {
        /** @type {Object.<string, string>} */
        const config = window.QILV_config || window.GM_values || {};
        const domAccess = new DomAccess();
        const imageOverlayFactory = new ImageOverlayFactory({ domAccess });
        const galleryOverlaysUi = new GalleryOverlaysUi({ domAccess });
        const vk = new VK({ config });
        const streamAccess = new StreamAccess();
        const galleryOverlays = new GalleryOverlays({
            imageOverlayFactory,
            galleryOverlaysUi,
            vk,
            config,
            streamAccess,
        });
        window.QILVGalleryOverlays = galleryOverlays;
        galleryOverlays.init();
    } else {
        window.QILVGalleryOverlays.reload();
        window.QILVGalleryOverlays.shown = true;
    }
}

