import CssFluent from './CssFluent';
import CssProperty from './CssProperty';

export default class CssSection {
    /**
     * 
     * @param {Object} params
     * @param {string[]} params.matches A list of css path to match
     * @param {boolean} params.important
     * @param {CssFluent} params.parent
     */
    constructor({ matches, important, parent }) {
        this._matches = matches || [];
        /** 
         * @type {CssProperty[]} 
         */
        this._properties = [];
        this._important = important || false;
        this._parent = parent;
    }

    /**
     * A a new css path to match by the section
     * 
     * @param {string} name The css path to match
     * @returns {CssSection}
     */
    match(name) {
        this._matches.push(name);
        return this;
    }

    /**
     * Add a new Css property to the section
     * 
     * @param {string} name The name of the Css property
     * @param {string} value The value of the Css property
     * @param {boolean} important true if the property should be important (default: false)
     * @return {CssSection}
     */
    property(name, value, important) {
        const property = new CssProperty({ name, value, important, parent: this });
        this._properties.push(property);
        return this;
    }

    /**
     * Stop the section, and return it's parent
     * 
     * @returns {CssFluent}
     */
    endSection() {
        return this._parent;
    }

    /**
     * @param {Object} params
     * @param {boolean} params.important
     * @param {boolean} params.format
     * @returns {string}
     */
    asCss(params) {
        params = params || {};
        let { important, format } = params;
        important = important || this._important;
        return `${this._matches.join(',')}{${this._properties.map(p => p.asCss({ important, format })).join('')}}`
    }
}