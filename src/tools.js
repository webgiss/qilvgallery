import DomAccess from './DomAccess';
import ImageOverlayFactory from './ImageOverlayFactory';
import GalleryOverlaysUi from './GalleryOverlaysUi';
import VK from './VK';
import GalleryOverlays from './GalleryOverlays';

/**
 * The promise resolve when the page is ready.
 * @type {Promise<void>};
 */
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
});

/**
 * Initialise QILVGallery_init
 * @returns {void}
 */

const QILVGalleryInit = () => {
    if (!window.QILVGalleryOverlays) {
        /** @type {Object.<string, string>} */
        const config = window.QILV_config || window.GM_values || {};
        const domAccess = new DomAccess();
        const imageOverlayFactory = new ImageOverlayFactory({ domAccess });
        const galleryOverlaysUi = new GalleryOverlaysUi({ domAccess });
        const vk = new VK({ config });
        const galleryOverlays = new GalleryOverlays({
            imageOverlayFactory,
            galleryOverlaysUi,
            vk,
            config,
        });
        window.QILVGalleryOverlays = galleryOverlays;
        galleryOverlays.init();
    }
}

export { readyPromise, QILVGalleryInit };
