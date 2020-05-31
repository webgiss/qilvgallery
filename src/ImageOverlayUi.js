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

        this._div = domAccess.createElement('div', { className: 'qilvgallery_image_outter' }, { parent });
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
        this._domAccess.removeClass(this._image, 'loading');
    }

    /**
     * @returns {void}
     */
    setLoading() {
        this._domAccess.addClass(this._image, 'loading');
    }

    /**
     * @param {boolean} maxSize
     */
    setMaxSize(maxSize) {
        if (maxSize) {
            this._domAccess.addClass(this._image, 'maxSize');
        } else {
            this._domAccess.removeClass(this._image, 'maxSize');
        }
    }

    /**
     * @param {boolean} autoX
     */
    setAutoX(autoX) {
        if (autoX) {
            this._domAccess.addClass(this._image, 'autoX');
        } else {
            this._domAccess.removeClass(this._image, 'autoX');
        }
    }

    /**
     * @param {boolean} autoY
     */
    setAutoY(autoY) {
        if (autoY) {
            this._domAccess.addClass(this._image, 'autoY');
        } else {
            this._domAccess.removeClass(this._image, 'autoY');
        }
    }

    /**
     * @param {string} href
     */
    replaceImage(href) {
        if (this._image != null) {
            this._image.remove();
        }

        this._image = this._domAccess.createElement('img', { src: '#' }, {
            classNames: [ 'qilvgallery_image' ],
            parent: this._a,
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
            this._domAccess.removeClass(this._div, 'shown');
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
            this._domAccess.addClass(this._div, 'shown');
        }
    }

    /**
     * @returns {void}
     */
    centerOnScreen() {
        this._domAccess.addClass(this._image, 'centered');
    }

    /**
     * @returns {void}
     */
    unCenterOnScreen() {
        this._domAccess.removeClass(this._image, 'centered');
    }

    /**
     * @param {boolean} isRelative
     * @returns {void}
     */
    setRelative(isRelative) {
        if (isRelative) {
            this._domAccess.addClass(this._image, 'relative');
        } else {
            this._domAccess.removeClass(this._image, 'relative');
        }
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