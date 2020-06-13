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

        this._div = domAccess.createElement('div', { 
            parent, 
            className: 'qilvgallery_image_outter',
            content: [
                domAccess.createElement('a', { 
                    parent: this._div,
                    onInstance: (element) => this._a = element,
                })
            ],
        });
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
        this._domAccess.removeClass(this._image, 'qilv_loading');
    }

    /**
     * @returns {void}
     */
    setLoading() {
        this._domAccess.addClass(this._image, 'qilv_loading');
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
            onLoad: () => this.setIsLoaded(),
            attr: { 
                src: '#' 
            },
        });

        this.setLoading();
        this._image.src = href;

        this._a.href = href;
        this._a.target = '_blank';
    }

    /**
     * @returns {void}
     */
    hide() {
        this._domAccess.removeClass(this._div, 'qilv_shown');
    }

    /**
     * @returns {void}
     */
    show() {
        this._domAccess.addClass(this._div, 'qilv_shown');
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