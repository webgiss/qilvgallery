import DomAccess from './DomAccess';
import IBindable from './IBindable';

/**
 * @class
 * @implements {IBindable}
 */
export default class ConfigurationUi {
    /**
     * @param {Object} obj
     * @param {DomAccess} obj.domAccess
     * @param {HTMLElement} obj.rootNode
     */
    constructor({ domAccess, rootNode }) {
        this._domAccess = domAccess;
        this._rootNode = rootNode;
    }

    /**
     * @returns {HTMLElement}
     */
    createInfoPanel() {
        return this._domAccess.createElement('div', { 
            classNames:['infoPanel'], 
            parent: this._rootNode,
            html: '<p>Set your configuration below and drop the "Gallery" link into your toolbar to install bookmarklet.<br/>Use this bookmarklet on pages containing links to image to generate a gallery slideshow.</p>',
        });
    }

    /**
     * @returns {HTMLElement}
     */
    createBookmarkletLink() {
        return this._domAccess.createElement('a', { 
            parent: this._rootNode,
            text: 'Gallery',
        });
    }

    /**
     * @returns {HTMLElement}
     */
    createNamePanel() {

    }

    /**
     * @returns {HTMLElement}
     */
    createKeyboardPanel() {

    }

    /**
     * @returns {HTMLElement}
     */
    createValuePanel() {

    }

    /**
     * @returns {void}
     */
    installCss() {
        this._domAccess.installCss(`
        `);
    }

}
