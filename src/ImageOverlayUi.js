import DomAccess from './DomAccess';

/**
 * @class
 */
export default class ImageOverlayUi {
    /**
     * @param {Object} obj
     * @param {DomAccess} obj.domAccess
     * @param {HTMLElement} obj.parent
     */
    constructor({ domAccess, parent }) {
        this._domAccess = domAccess;
        this._parent = parent;
        /**
         * @type HTMLImageElement
         */
        this._image = null;

        this._div = domAccess.createElement('div', { style: 'display:none' }, { parent });
        this._a = domAccess.createElement('a', null, { parent: this._div });
    }

    /**
     * @param {string} value
     */
    set accessKey(value) {
        this._a['accesskey'] = value;
    }

    /**
     * @returns {void}
     */
    setIsLoaded() {
        this._domAccess.setCssProperty(this._image, "border", "2px solid black");
    }

    /**
     * @returns {void}
     */
    setLoading() {
        this._domAccess.setCssProperty(this._image, "border", "2px solid red");
        this._domAccess.setCssProperty(this._image, "boxSizing", "border-box");
    }

    /**
     * @param {boolean} maxSize
     */
    setMaxSize(maxSize) {
        const stringValue = maxSize ? '100%' : '';
        const domAccess = this._domAccess;
        domAccess.setCssProperty(this._image, "maxWidth", stringValue);
        domAccess.setCssProperty(this._image, "maxHeight", stringValue);
    }

    /**
     * @param {boolean} autoX
     */
    setAutoX(autoX) {
        this._domAccess.setCssProperty(this._image, "width", autoX ? '100%' : 'auto');
    }

    /**
     * @param {boolean} autoY
     */
    setAutoY(autoY) {
        this._domAccess.setCssProperty(this._image, "height", autoY ? "100%" : 'auto');
    }

    /**
     * @param {string} href
     */
    replaceImage(href) {
        const domAccess = this._domAccess;
       
        if (this._image != null) {
            this._image.remove();
        }

        this._image = domAccess.createElement('img', {
            className: `QILVGallery_Current`,
            src: '#',
            style: 'display:block;position:absolute;left:0;top:0;z-index:50000',
        }, {
            parent: this._a
        });

        this._image.addEventListener('load', (e) => this.setIsLoaded());

        this.setLoading();
        this._image.src = href;

        this._a.href = href;
        this._a.target = '_blank';
    }

    /**
     * @returns {void}
     */
    hide(transitionTime) {
        if (transitionTime > 0) {
            // Handle transition
            /*
            this._image.css("z-index", 50001);
            this._image.fadeOut(transitionTime, () => {
                return function () {
                    this._div.css("display", "none");
                    return this._image.css("z-index", 50000);
                };
            };
            */
        } else {
            this._domAccess.setCssProperty(this._div, "display", "none");
        }
    }

    /**
     * @returns {void}
     */
    show(transitionTime) {
        if (transitionTime > 0) {
            // Handle transition
            /*
            this._image.css("z-index", 50000).css("display", "none").css("display", "block");
            return this._image.fadeIn(transitionTime, (function (_this) {
                return function () {};
            })(this));
            */
        } else {
            this._domAccess.setCssProperty(this._div, "display", "block");
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
    }

    /**
     * @returns {void}
     */
    unCenterOnScreen() {
        const domAccess = this._domAccess;
        domAccess.setCssProperty(this._image, "right", "");
        domAccess.setCssProperty(this._image, "bottom", "");
        domAccess.setCssProperty(this._image, "margin", "");
    }

    /**
     * @param {boolean} isRelative
     * @returns {void}
     */
    setRelative(isRelative) {
        const position = this._position = isRelative ? "fixed" : "absolute";
        this._domAccess.setCssProperty(this._image, "position", position);
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