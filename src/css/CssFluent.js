import { ICssFluent, ICssSection } from './ICss';
import CssSection from './CssSection';

/**
 * @class
 * @implements {ICssFluent}
 */
export default class CssFluent extends ICssFluent {
    /**
     * Create a new CssFluent declaration
     * 
     * @param {Object} params
     * @param {(ICssFluent)=>{}} params.onEnd A function to call when the Css declaration has ended
     * @param {boolean} params.important
     */
    constructor(params) {
        super();
        params = params || {};
        const { onEnd, important } = params;
        /**
         * @type {ICssSection[]}
         */
        this._sections = [];
        this._important = important || false;
        this._onEnd = onEnd;
    }

    /**
     * Create a new section
     * 
     * @param {Object} params
     * @param {boolean} params.important
     * @returns {ICssSection}
     */
    section(params) {
        params = params || {};
        const { important } = params;
        const section = new CssSection({ important, parent: this });
        this._sections.push(section);
        return section;
    }

    /**
     * Stop a css declaration
     * 
     * @returns {void}
     */
    endCss() {
        const onEnd = this._onEnd;
        onEnd(this);
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
        return this._sections.map(s => s.asCss({ important, format })).join('');
    }
}