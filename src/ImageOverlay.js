import DomAccess from './DomAccess';

/**
 * @class
 */
export default class ImageOverlay {
    /**
     * @param {Object} obj
     * @param {DomAccess} obj.domAccess
     * @param {number} obj.index
     */
    constructor({
        domAccess,
        index
    }) {
        this._domAccess = domAccess;
        this._index = index;
        /**
         * @type HTMLImageElement
         */
        this._image = null;

        this._div = domAccess.createElement('div', {
            id: `QILVGallery_Overlay_${this._index}`,
            style: 'display:none'
        }, {
                parent: document.body
            });

        this._a = domAccess.createElement('a', null, {
            parent: this._div
        });

        this._position = "absolute";
        this._isCenterOnScreen = false;
        this._transitionTime = 0;

        return null;
    }

    /**
     * @returns {void}
     */
    onloadImage() {
        this._domAccess.setCssProperty(this._image, "border", "2px solid black");
    }

    /**
     * @param {boolean} value
     */
    setMaxSize(value) {
        this._maxSize = value;
        const stringValue = this._maxSize ? '100%' : '';
        const domAccess = this._domAccess;
        domAccess.setCssProperty(this._image, "maxWidth", stringValue);
        domAccess.setCssProperty(this._image, "maxHeight", stringValue);
    }

    /**
     * @param {boolean} value
     */
    setAutoX(value) {
        this._autoX = value;
        this._domAccess.setCssProperty(this._image, "width", this._autoX ? '100%' : 'auto');
    }

    /**
     * @param {boolean} value
     */
    setAutoY(value) {
        this._autoY = value;
        this._domAccess.setCssProperty(this._image, "height", this._autoY ? "100%" : 'auto');
    }

    /**
     * @param {string} selector
     */
    update(selector) {
        if (this._image != null) {
            this._image.remove();
        }
        const domAccess = this._domAccess;
        this._image = domAccess.createElement('img', {
            id: `QILVGallery_Current_${this._index}`,
            className: `QILVGallery_Current`,
            src: '#',
            style: 'display:block;position:absolute;left:0;top:0;z-index:50000',
        }, {
                parent: this._a
            });
        domAccess.setCssProperty(this._image, 'position', this._position);
        this._image.addEventListener('load', (e) => this.onloadImage());
        this._selector = selector;
        const image = document.querySelector(selector);
        if (image) {
            const href = image.href;

            domAccess.setCssProperty(this._image, "border", "2px solid red");
            domAccess.setCssProperty(this._image, "boxSizing", "border-box");
            this._image.src = href;

            this.setAutoX(this._autoX);
            this.setAutoY(this._autoY);
            this.setMaxSize(this._maxSize);

            this._a.href = href;
            this._a.target = '_blank';

            if (this._isCenterOnScreen) {
                this.centerOnScreen();
            } else {
                this.unCenterOnScreen();
            }
        }
    }

    /**
     * @returns {void}
     */
    hide() {
        this._isOn = false;
        if (this.transition_time > 0) {
            // Handle transition
            /*
            this._image.css("z-index", 50001);
            this._image.fadeOut(this.transition_time, () => {
                return function () {
                    this._div.css("display", "none");
                    return this._image.css("z-index", 50000);
                };
            };
            */
        } else {
            this._domAccess.setCssProperty(this._div, "display", "none");
        }
        this._a['accesskey'] = undefined;
    }

    /**
     * @returns {void}
     */
    show() {
        this._isOn = true;
        this._a['accesskey'] = "l";
        if (this.transition_time > 0) {
            // Handle transition
            /*
            this._image.css("z-index", 50000).css("display", "none").css("display", "block");
            return this._image.fadeIn(this.transition_time, (function (_this) {
                return function () {};
            })(this));
            */
        } else {
            this._domAccess.setCssProperty(this._div, "display", "block");
        }
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
        const domAccess = this._domAccess;
        domAccess.setCssProperty(this._image, "right", "0");
        domAccess.setCssProperty(this._image, "bottom", "0");
        domAccess.setCssProperty(this._image, "margin", "auto");
        this._isCenterOnScreen = true;
    }

    /**
     * @returns {void}
     */
    unCenterOnScreen() {
        const domAccess = this._domAccess;
        domAccess.setCssProperty(this._image, "right", "");
        domAccess.setCssProperty(this._image, "bottom", "");
        domAccess.setCssProperty(this._image, "margin", "");
        this._isCenterOnScreen = false;
    }

    /**
     * @returns {boolean}
     */
    get relative() {
        return this._position === "fixed";
    }

    /**
     * @param {boolean} value
     */
    set relative(value) {
        this._position = value ? "fixed" : "absolute";
        this._domAccess.setCssProperty(this._image, "position", this._position);
    }

    /**
     * @returns {void}
     */
    togglePosition() {
        this._relative = !(this._relative);
    }

    /**
     * @param {number} value 
     */
    setTransitionTime(value) {
        return this.transition_time = value;
    }

    /**
     * @returns {string}
     */
    get imageSource() {
        if (this._image) {
            return this._image.src;
        }
        return null;
    }
}

