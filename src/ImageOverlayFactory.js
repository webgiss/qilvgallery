import DomAccess from './DomAccess';
import ImageOverlay from './ImageOverlay';
import ImageOverlayUi from './ImageOverlayUi';
import VK from './VK';
import GalleryOverlaysUi from './GalleryOverlaysUi';

/**
 * @class
 */
export default class ImageOverlayFactory {
    /**
     * @param {Object} obj
     * @param {DomAccess} obj.domAccess
     */
    constructor({ domAccess }) {
        this._domAccess = domAccess;
    }

    /**
     * @param {HTMLElement} parent 
     */
    createImageOverylay(parent) {
        const domAccess = this._domAccess;
        const imageOverlayUi = new ImageOverlayUi({ domAccess, parent });
        const imageOverlay = new ImageOverlay({ imageOverlayUi });
        return imageOverlay;
    }
}