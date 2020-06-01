import ImageOverlayUi from './ImageOverlayUi';

/**
 * @class
 */
export default class ImageOverlay {
    /**
     * @param {Object} obj
     * @param {ImageOverlayUi} obj.imageOverlayUi
     */
    constructor({ imageOverlayUi }) {
        this._imageOverlayUi = imageOverlayUi;

        return null;
    }

    /**
     * @returns {string}
     */
    get id() {
        return this._id;
    }

    /**
     * @param {string} value
     */
    set id(value) {
        this._id = value;
    }

    /**
     * @param {number} id
     * @param {string} href
     */
    update(id, href) {
        this.id = id;
        this._imageOverlayUi.replaceImage(href);
    }

    /**
     * @returns {void}
     */
    hide() {
        this._imageOverlayUi.hide();
        this._imageOverlayUi.accessKey = undefined;
    }

    /**
     * @returns {void}
     */
    show() {
        this._imageOverlayUi.accessKey = 'l';
        this._imageOverlayUi.show();
    }

    /**
     * @returns {string}
     */
    get imageSource() {
        return this._imageOverlayUi.imageSource;
    }
}

