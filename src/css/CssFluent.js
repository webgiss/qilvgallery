import CssSection from './CssSection';
export default class CssFluent {
    /**
     * Create a new CssFluent declaration
     * 
     * @param {Object} params
     * @param {(CssFluent)=>{}} params.onEnd A function to call when the Css declaration has ended
     * @param {boolean} params.important
     */
    constructor(params) {
        params = params || {};
        const { onEnd, important } = params;
        /**
         * @type {CssSection[]}
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
     * @returns {CssSection}
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