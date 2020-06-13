import CssSection from './CssSection';

export default class CssProperty {
    /**
     * Create a CssProperty
     * 
     * @param {Object} params
     * @param {string} params.name
     * @param {string} params.value 
     * @param {boolean} params.important
     * @param {CssSection} params.parent 
     */
    constructor(params) {
        params = params || {};
        const { name, value, important, parent } = params;
        this._name = name;
        this._value = value;
        this._important = important || false;
        this._parent = parent;
    }

    /**
     * @param {boolean} value
     */
    set important(value) {
        this._important = value;
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
        return `${this._name}:${this._value}${important ? " !important" : ""};`;
    }
}