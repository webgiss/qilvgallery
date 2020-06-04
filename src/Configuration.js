import ConfigurationUi from './ConfigurationUi';

/**
 * @class
 * @implements {IBindable}
 */
export default class Configuration {
    /**
     * @param {Object} obj
     * @param {ConfigurationUi} obj.configurationUi
     */
    constructor({ configurationUi }) {
        this._configurationUi = configurationUi;
    }

    /**
     * @returns {void}
     */
    init() {
        this._infoPanel = this._configurationUi.createInfoPanel();
        this._bookmarkletLink = this._configurationUi.createBookmarkletLink();
        this._namePanel = this._configurationUi.createNamePanel();
        this._keyboardPanel = this._configurationUi.createKeyboardPanel();
        this._valuePanel = this._configurationUi.createValuePanel();
    }

}