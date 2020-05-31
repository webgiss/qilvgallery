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

        this.relative = false;
        this._isCenterOnScreen = false;
        this._transitionTime = 0;

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
     * @param {boolean} value
     */
    setMaxSize(value) {
        this._maxSize = value;
        this._imageOverlayUi.setMaxSize(this._maxSize);
    }

    /**
     * @param {boolean} value
     */
    setAutoX(value) {
        this._autoX = value;
        this._imageOverlayUi.setMaxSize(this._autoX);
    }

    /**
     * @param {boolean} value
     */
    setAutoY(value) {
        this._autoY = value;
        this._imageOverlayUi.setMaxSize(this._autoY);
    }

    /**
     * @param {number} id
     * @param {string} href
     */
    update(id, href) {
        this.id = id;
        this._imageOverlayUi.replaceImage(href);
        this.setAutoX(this._autoX);
        this.setAutoY(this._autoY);
        this.setMaxSize(this._maxSize);

        if (this._isCenterOnScreen) {
            this.centerOnScreen();
        } else {
            this.unCenterOnScreen();
        }
    }

    /**
     * @returns {void}
     */
    hide() {
        this._isOn = false;
        this._imageOverlayUi.hide(this._transitionTime);
        this._imageOverlayUi.accessKey = undefined;
    }

    /**
     * @returns {void}
     */
    show() {
        this._isOn = true;
        this._imageOverlayUi.accessKey = 'l';
        this._imageOverlayUi.show(this._transitionTime);
    }

    /**
     * @returns {boolean}
     */
    get isOn() {
        return this._isOn;
    }

    /**
     * @returns {void}
     */
    toggle() {
        if (this.isOn) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * @returns {void}
     */
    centerOnScreen() {
        this._imageOverlayUi.centerOnScreen();
        this._isCenterOnScreen = true;
    }

    /**
     * @returns {void}
     */
    unCenterOnScreen() {
        this._imageOverlayUi.centerOnScreen();
        this._isCenterOnScreen = false;
    }

    /**
     * @returns {boolean}
     */
    get relative() {
        return this._relative;
    }

    /**
     * @param {boolean} value
     */
    set relative(value) {
        this._relative = value;
        this._imageOverlayUi.setRelative(this._relative);
    }

    /**
     * @returns {void}
     */
    togglePosition() {
        this.relative = !(this.relative);
    }

    /**
     * @param {number} value 
     */
    setTransitionTime(value) {
        return this._transitionTime = value;
    }

    /**
     * @returns {string}
     */
    get imageSource() {
        return this._imageOverlayUi.imageSource;
    }
}

