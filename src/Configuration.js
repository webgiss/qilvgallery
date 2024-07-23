import ConfigurationUi from './ConfigurationUi';
import VK from './VK';
import GalleryOverlays from './GalleryOverlays';
import { version } from './version';

export default class Configuration {
    /**
     * @param {Object} obj
     * @param {ConfigurationUi} obj.configurationUi
     * @param {VK} obj.vk
     * @param {GalleryOverlays} obj.galleryOverlays
     */
    constructor({ configurationUi, vk, galleryOverlays }) {
        this._configurationUi = configurationUi;
        this._currentConfig = null;
        this._vk = vk;
        this._galleryOverlays = galleryOverlays;
        this._defaultKeyBindings = this._galleryOverlays.getKeyBindings();
        this._defaultValues = {};
        this._name = 'Gallery';
    }

    /**
     * @returns {void}
     */
    init() {
        this._configurationUi.installCss();
        this._infoPanel = this._configurationUi.createInfoPanel({ version });
        this._bookmarkletLink = this._configurationUi.createBookmarkletLink({});
        this._namePanel = this._configurationUi.createNamePanel({
            name: this.getLinkName(),
            onValueChanged: (value) => this.changeName(value),
        });
        let config = Object.keys(this._defaultKeyBindings).map((key) => {
            return [key, this._defaultKeyBindings[key]]
        });
        this._keyboardPanel = this._configurationUi.createKeyboardPanel({
            onNewKey: () => {
                this._configurationUi.addNewKeyConfig({ keyboardPanelInfo: this._keyboardPanel });
                this.updateLink();
            },
            keys: this._vk.keys,
            actions: this._galleryOverlays.getBindableMethods(),
            config,
            onChange: (index, key, action) => {
                this.updateLink();
            },
        });
        const configurables = this._galleryOverlays.getConfigurables();
        const properties = {};
        config = [];
        Object.keys(configurables).forEach((propName) => {
            this._defaultValues[propName] = configurables[propName].default;
            properties[propName] = configurables[propName].label;
            config.push([propName, configurables[propName].default]);
        });

        this._valuePanel = this._configurationUi.createValuePanel({
            properties,
            config,
            onChange: (propName, value) => {
                this.updateLink();
            },
        });

        this.updateLink();
    }

    changeName(name) {
        this._name = name;
        this.updateLink();
    }

    /**
     * 
     * @param {string} prefixUrl 
     * @param {string} suffixUrl 
     * @param {Object<string,string>} toolConfig The configuration of the tool
     */
    getLink(prefixUrl, suffixUrl, toolConfig) {
        if (!toolConfig) {
            toolConfig = {};
        }
        const configString = `{${
            Object.keys(toolConfig).map((key) => {
                const value = toolConfig[key];
                return `'${key}':'${value}'`;
            }).join(',')
            }}`;
        const url = `${prefixUrl}gallery.js${suffixUrl}`;
        const setScript = `fetch('${url}?t='+(new Date()).getTime()).then(x=>x.blob()).then(x=>x.text()).then(x=>{const s = document.createElement('script'); s.innerText=x; document.body.append(s)});`
        const bookmarklet = `javascript:if(window.QILVGalleryOverlays){window.QILVGalleryOverlays.reload();}else{window.QILV_config=${configString};${setScript}}`;
        return bookmarklet;
    }

    /**
     * @returns {string}
     */
    getLinkName() {
        return this._name;
    }

    /**
     * @returns {Object<string, string>} return the current tool config as an object
     */
    getCurrentConfig() {
        const currentConfig = {};

        const keyboardConfiguration = this._configurationUi.getKeyboardConguration({ keyboardPanelInfo: this._keyboardPanel });
        keyboardConfiguration.forEach(([key, action]) => {
            if (this._defaultKeyBindings[key] !== action && key.length > 0 && action.length > 0) {
                currentConfig[`VK.${key}`] = `${this._galleryOverlays.__name__}.${action}`;
            }
        });
        const valueConguration = this._configurationUi.getValueConguration({ valuePanelInfo: this._valuePanel });
        valueConguration.forEach(([propName, value]) => {
            if (this._defaultValues[propName] !== `${value}`) {
                currentConfig[`QILV.${propName}`] = `${value}`;
            }
        });

        return currentConfig;
    }

    /**
     * @return {void}
     */
    updateLink() {
        const bookmarklet = this.getLink('https://qilv.gissehel.com/', '', this.getCurrentConfig());
        const name = this.getLinkName();
        this._configurationUi.updateLink(this._bookmarkletLink, name, bookmarklet);
    }
}