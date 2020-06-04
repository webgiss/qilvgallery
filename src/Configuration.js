import ConfigurationUi from './ConfigurationUi';
import VK from './VK';
import GalleryOverlays from './GalleryOverlays';

/**
 * @class
 * @implements {IBindable}
 */
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
        this._infoPanel = this._configurationUi.createInfoPanel({});
        this._bookmarkletLink = this._configurationUi.createBookmarkletLink({});
        this._namePanel = this._configurationUi.createNamePanel({
            name: this.getLinkName(),
            onValueChanged: (value) => this.changeName(value),
        });
        let config = Object.keys(this._defaultKeyBindings).map((key)=>{
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
        Object.keys(configurables).forEach((propName)=>{
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
        const setScript = `fetch('${url}').then(x=>x.blob()).then(x=>x.text()).then(x=>{const s = document.createElement('script'); s.innerText=x; document.body.append(s)});`
        const bookmarklet = `javascript:if(window.QILVGalleryOverlays){window.QILVGalleryOverlays.current.show();}else{window.QILV_config=${configString};${setScript}}`;
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

        const keyboardConfiguration = this._configurationUi.getKeyboardConguration({ keyboardPanelInfo : this._keyboardPanel });
        keyboardConfiguration.forEach(([key, action])=>{
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

    grut() {
        const prefix_url = window.qilv_prefix_url;
        const suffix_url = window.qilv_suffix_url;

        const setlink = (keyboard_config) => {
            const bookmarklet = this.getLink(prefix_url, suffix_url, keyboard_config);
            $('#gallery_link').attr('href', bookmarklet);
            $('#gallery_link').hide();
            return $('#gallery_link').fadeIn('slow');
        };
        const setlinkname = () => $('#gallery_link').text($('#namefield').val());
        const setlink_using_param = () => {
            var config;
            config = {};
            $('#keyspanel table tr').each(function (index, tr) {
                var action, key;
                key = $(tr).find("td.key select").val();
                action = $(tr).find("td.action select").val();
                if (key !== '') {
                    if (QILVGallery_overlays.key_bindings[key] !== action) {
                        config['VK.' + key] = QILVGallery_overlays.__name__ + '.' + action;
                    }
                }
                return null;
            });
            $('#valuespanel table tr').each(function (index, tr) {
                var name, value;
                name = $(tr).find("td.key select").val();
                value = $(tr).find("td.action input").val();
                if (value.match(/^\-?[0-9]+$/)) {
                    value = parseInt(value);
                }
                if (value === 'true') {
                    value = true;
                }
                if (value === 'false') {
                    value = false;
                }
                if (QILVGallery_overlays[name] !== value) {
                    config['QILV.' + name] = value;
                }
                return null;
            });
            setlink(config);
            return null;
        };
        const addkeysbuttons = function (keyname, actionname) {
            var $combo, $line;
            $line = $("<tr><td class='key'></td><td class='action'></td></tr>");
            $('#keyspanel table').append($line);
            $line.find('td').css('width', '50%');
            $combo = $('<select style="width:100%"/>');
            $line.find('td.key').append($combo);
            $combo.append($('<option/>').html("-- select a key --").attr('value', ''));
            $.each(VK.keys, function (index, key) {
                var $option;
                $option = $('<option/>').html(key).attr('value', key);
                if (key === keyname) {
                    $option.attr('selected', 'true');
                }
                $combo.append($option);
                return null;
            });
            $combo.change(setlink_using_param);
            $combo = $('<select style="width:100%"/>');
            $line.find('td.action').append($combo);
            $combo.append($('<option/>').html("-- no action --").attr('value', ''));
            $.each(QILVGallery_overlays.bindables, function (value, comment) {
                var $option;
                $option = $('<option/>').html(comment).attr('value', value);
                if (value === actionname) {
                    $option.attr('selected', 'true');
                }
                $combo.append($option);
                return null;
            });
            $combo.change(setlink_using_param);
            return null;
        };
        const addvaluesbuttons = function (name, value, comment) {
            var $combo, $line;
            $line = $("<tr><td class='key'></td><td class='action'></td></tr>");
            $('#valuespanel table').append($line);
            $line.find('td').css('width', '50%');
            $combo = $('<select style="width:100%"/>');
            $line.find('td.key').append($combo);
            $combo.append($('<option/>').html(comment).attr('value', name));
            $combo.change(setlink_using_param);
            $combo = $('<input style="width:100%"/>').html(value).attr('value', value);
            $line.find('td.action').append($combo);
            $combo.change(setlink_using_param);
            return null;
        };
        setlink({});
        $('#namepanel').append("<input id='namefield' style='width:100%'/>");
        $('#namefield').change(setlinkname).keyup(setlinkname).val($('#gallery_link').text());
        $('#keyboardpanel').append("<div id='keyspanel'/>").append("<div id='pluskeyspanel' class='pluspanel'/>");
        $('#keyspanel').append("<table style='width:100%'></table>");
        $('#pluskeyspanel').append("<button id='pluskeysbutton' class='plusbutton' type='submit'>+</button>").click(function () {
            addkeysbuttons();
            $combo.change(setlink_using_param);
            return null;
        });
        $.each(QILVGallery_overlays.key_bindings, function (key, action) {
            return addkeysbuttons(key, action);
        });
        $('#valuepanel').append("<div id='valuespanel'/>");
        $('#valuespanel').append("<table style='width:100%'></table>");
        $.each(QILVGallery_overlays.configurables, function (name, comment) {
            return addvaluesbuttons(name, QILVGallery_overlays[name], comment);
        });
        return setlink_using_param();
    }



}