/**
 * @interface ICssSerializable
 */

export class ICssSerializable {
    /**
     * Export the object as a Css string
     * 
     * @param {Object} params 
     * @param {boolean} params.important
     * @param {boolean} params.format
     * @returns {string}
     */
    asCss(params) {
        throw new Error('not implemented');
    }
}

/**
 * @interface ICssFluent
 * @implements {ICssSerializable}
 */
export class ICssFluent extends ICssSerializable {
    /**
     * Create a new section
     * 
     * @param {Object} params params
     * @param {boolean} params.important
     * @returns {ICssSection}
     */
    section(params) {
        throw new Error('not implemented');
    }

    /**
     * Stop a css declaration
     * 
     * @returns {void}
     */
    endCss() {
        throw new Error('not implemented');
    }
}

/**
 * @interface ICssSection
 * @implements {ICssSerializable}
 */

export class ICssSection extends ICssSerializable {
    /**
     * Add a new css path to match by the section
     * 
     * @param {string} name
     * @returns {ICssSection}
     */
    match(name) {
        throw new Error('not implemented');
    }

    /**
     * Add a new Css property to the section
     * 
     * @param {string} name The name of the Css property
     * @param {string} value The value of the Css property
     * @param {boolean} important true if the property should be important (default: false)
     * @return {ICssSection}
     */
    property(name, value, important) {
        throw new Error('not implemented');
    }

    /**
     * Stop the section, and return it's parent
     * 
     * @returns {ICssFluent}
     */
    endSection() {
        throw new Error('not implemented');
    }
}

/**
 * @interface ICssProperty
 * @implements {ICssSerializable}
 */

export class ICssProperty extends ICssSerializable { }

