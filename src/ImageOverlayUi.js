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

        this._div = domAccess.createElement('div', { parent, className: 'qilvgallery_image_outter' });
        this._a = domAccess.createElement('a', { parent: this._div });
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
     * @param {string} href
     */
    replaceImage(href) {
        if (this._image != null) {
            this._image.remove();
        }

        this._image = this._domAccess.createElement('img', {
            classNames: [ 'qilvgallery_image' ],
            parent: this._a,
            attr: { src: '#' },
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
    hide() {
        this._domAccess.removeClass(this._div, 'shown');
    }

    /**
     * @returns {void}
     */
    show() {
        this._domAccess.addClass(this._div, 'shown');
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