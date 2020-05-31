import DomAccess from './DomAccess';

/**
 * @class
 * @implements {IBindable}
 */
export default class GalleryOverlaysUi {
    /**
     * @param {Object} obj
     * @param {DomAccess} obj.domAccess
     */
    constructor({ domAccess }) {
        this._domAccess = domAccess;
        this._blackScreen = null;
        this._preloadGauge = null;
        this._preloadGaugeInner = null;
    }

    /**
     * @param {Object} obj
     * @param {HTMLElement} obj.parent
     * @returns {HTMLElement}
     */
    createBlackScreen({parent}) {
        const domAccess = this._domAccess;
        const blackScreen = domAccess.createElement('div', { id: 'QILVGallery_black_screen' }, { parent });
        domAccess.setCssProperties(blackScreen, {
            'zIndex': '49998', 
            'width': '100%',
            'height': '100%',
            'position': 'fixed',
            'left': '0',
            'top': '0',
            'background': 'black',
            'margin': '0',
            'padding': '0',
        });

        return blackScreen;
    }

    /**
     * @param {HTMLElement} blackScreen
     * @returns {void}
     */
    removeBlackScreen(blackScreen) {
        this._domAccess.remove(blackScreen);
    }

    /**
     * @param {Object} params 
     * @param {string} params.id
     * @param {HTMLElement} params.appendTo
     * @param {string} params.content
     * @param {string} params.position
     * @param {boolean} params.center
     * @returns {HTMLElement}
     */
    createInfoTip(params) {
        const domAccess = this._domAccess;
        if (params == null) {
            params = {};
        }
        const props = {
            className: 'qilvgallery_infotip',
        };
        const features = {};

        if (params.id != null) {
            props.id = params.id;
        }
        if (params.appendTo) {
            features.parent = params.appendTo;
        }
        if (params.content) {
            features.html = params.content;
        }
        const infoTip = domAccess.createElement('div', props, features);
        if (params.classNames) {
            params.classNames.forEach((name)=>infoTip.classList.add(name));
        }
        if (params.position) {
            domAccess.setCssProperty(infoTip, "position", params.position);
        }
        if ((params.center != null) && params.center) {
            infoTip.classList.add('qilvgallery_infotip_center')
        }
        if (params.fadeOut != null) {
            setTimeout(() => domAccess.remove(infoTip), params.fadeOut);
        }

        return infoTip;
    }


    /**
     * 
     * @param {Object} obj
     * @param {string} obj.message
     * @param {HTMLElement} obj.element
     * @returns {void}
     */
    createTempMessage({message, element}) {
        this.createInfoTip({
            content: message,
            fadeOut: 500,
            appendTo: element,
            position: "fixed"
        });
    }

    /**
     * @param {HTMLElement} infoBox
     * @returns {void}
     */
    removeInfoBox(infoBox) {
        if (infoBox) {
            this._domAccess.remove(infoBox);
        }
    }

    /**
     * @param {Object} obj
     * @param {HTMLElement} obj.parent
     * @param {Array<string>} obj.hrefs
     * @param {(href: string) => boolean} obj.isCurrent
     * @return {HTMLElement}
     */
    createInfoBox({parent, hrefs, isCurrent}) {
        const infoTip = this.createInfoTip({
            appendTo: parent,
        });
        const info_tip_pre = domAccess.createElement('pre', null, {
            parent: infoTip
        });
        hrefs.forEach((href) => {
            let subElement = 'span';
            if (isCurrent(href)) {
                subElement = 'b';
            }
            domAccess.createElement(subElement, null, {
                parent: info_tip_pre,
                text: href
            });
            domAccess.createElement('br', null, {
                parent: info_tip_pre
            });
        })
        info_tip_pre.addEventListener('click', () => {
            let text = '';
            let maxLength = 0;
            let count = 0;
            hrefs.forEach((href) => {
                text += href;
                text += '\n';
                count += 1;
                if (href.length > maxLength) {
                    maxLength = href.length;
                }
            });
            domAccess.remove(info_tip_pre);

            info_tip_pre = null;

            let info_tip_area = domAccess.createElement('textarea', {
                id: '',
                rows: `${count + 1}`,
                cols: `${maxLength + 2}`,
                className: 'qilvgallery_infobox_textarea',
                readonly: 1,
                value: text,
            }, {
                parent: this._infoBox,
            });
            info_tip_area.select();
        });
        return infoTip;
    }

    /**
     * @param {HTMLElement} parent
     * @returns {void}
     */
    showPreloadGauge({parent}) {
        if (!this._preloadGauge) {
            this._preloadGauge = this._domAccess.createElement('div', { className: 'qilvgallery_preload_gauge' }, { parent });
            this._preloadGaugeInner = this._domAccess.createElement('div', { className: 'qilvgallery_preload_gauge_inner' }, { parent: this._preloadGauge });
        }
    }

    /**
     * @returns {void}
     */
    hidePreloadGauge() {
        if (this._preloadGauge) {
            this._domAccess.remove(this._preloadGaugeInner);
            this._domAccess.remove(this._preloadGauge);
            this._preloadGauge = null;
            this._preloadGaugeInner = null;
        }
    }

    /**
     * @returns {boolean}
     */
    get hasPreloadGauge() {
        return this._preloadGauge !== null;
    }

    /**
     * @param {Object} obj
     * @param {Number} obj.loaded
     * @param {Number} obj.total
     * @returns {void}
     */
    updatePreloadGauge({ loaded, total }) {
        if (this._preloadGauge) {
            const domAccess = this._domAccess;
            const percent = `${Math.floor(loaded * 100 / total)}%`;
            domAccess.setCssProperty(this._preloadGaugeInner, 'width', percent);
            domAccess.setTextContent(this._preloadGaugeInner, percent);
            domAccess.setTextContent(this._preloadGaugeInner, `${loaded} / ${total}`);
            if (loaded === total) {
                this.hidePreloadGauge();
            }
        }
    }


    /**
     * 
     * @param {Object} obj
     * @param {Array<string>} obj.hrefs
     * @param {() => {}} obj.onImageLoaded
     */
    ensurePreloadAll({hrefs, onImageLoaded}) {
        if (!this._preloadAllPanel) {
            const domAccess = this._domAccess;

            this._preloadAllPanel = domAccess.createElement('div', { id: 'QILVGallery_preload_all_panel' }, { parent: this._main_element });
            hrefs.forEach((href) => {
                const image = domAccess.createElement('img', { 'src': '#' }, { parent: this._preloadAllPanel });
                image.addEventListener('load', onImageLoaded );
                image.src = href;
            });
        }
    }



    /**
     * @param {HTMLElement} aboutInfoBox 
     */

    removeAboutInfoBox(aboutInfoBox) {
        const domAccess = this._domAccess;
        domAccess.remove(aboutInfoBox);
    }

    /**
     * 
     * @param {Object} obj 
     * @param {HTMLElement} obj.parent
     * @param {() => {}} obj.onClick
     * @returns {HTMLElement}
     */
    createAboutInfoBox({parent}) {
        const domAccess = this._domAccess;
        const aboutInfoBox = domAccess.createElement('div', null, { parent: parent });
        const aboutInfoTipBlackScreen = domAccess.createElement('div', { className: 'qilvgallery_infotip_about_blackscreen' }, { parent: aboutInfoBox });
        const aboutInfoTip = this.createInfoTip({
            id: 'QILVGallery_About',
            center: true,
            appendTo: aboutInfoBox,
            classNames: ['qilvgallery_infotip_about'],
        });
        domAccess.createElement('p', null, {
            text: 'QILV Gallery',
            className: 'qilvgallery_infotip_about_title',
            parent: aboutInfoTip
        });
        domAccess.createElement('a', {
            href: 'https://github.com/gissehel/qilvgallery',
            target: '_blank'
        }, {
            text: 'https://github.com/gissehel/qilvgallery',
            parent: aboutInfoTip
        });
        domAccess.createElement('br', null, { parent: aboutInfoTip });
        const closeButton = domAccess.createElement('div', { className: 'qilvgallery_infotip_about_button' }, { text: 'Close', parent: aboutInfoTip });
        closeButton.addEventListener('click', onClick);
        aboutInfoTipBlackScreen.addEventListener('click', onClick);

        return aboutInfoBox;
    }

    /**
     * @param {Object} obj
     * @param {HTMLElement} obj.helpInfoTip
     */
    removeHelpInfoTip(helpInfoTip) {
        const domAccess = this._domAccess;
        domAccess.remove(helpInfoTip);
    }

    /**
     * @param {Object} obj
     * @param {HTMLElement} obj.parent
     * @param {{keyName: string, methodName: string}[]} obj.bindings
     * @param {{comment: string, config: string, effective: string}[]} obj.configurations
     * @returns {HTMLElement}
     */
    createHelpInfoTip({parent, bindings, configurations}) {
        const domAccess = this._domAccess;

        const helpInfoTip = this.createInfoTip({
            id: 'QILVGallery_Help',
            appendTo: parent,
            classNames: ['qilvgallery_infotip_help']
        });

        domAccess.createElement('h1', {
            className: 'qilvgallery_infotip_help_title',
        }, {
            text: 'Keyboard configuration',
            parent: help_info_tip,
        });

        const infoTipDiv = domAccess.createElement('div', {
            className: 'qilvgallery_infotip_help_content',
        }, {
            parent: help_info_tip,
        });

        bindings.forEach(({keyName, methodName})=>{
            const div = domAccess.createElement('div', null, { parent: infoTipDiv });
            domAccess.createElement('b', null, { parent: div, text: keyName });
            domAccess.createElement('span', null, { parent: div, text: `: ${methodName}` });
        });

        domAccess.createElement('h1', { className: 'qilvgallery_infotip_help_title' }, {
            text: 'Values',
            parent: help_info_tip,
        });

        infoTipDiv = domAccess.createElement('div', { className: 'qilvgallery_infotip_help_content' }, { parent: help_info_tip });

        configurations.forEach(({comment, config, effective})=>{
            const div = domAccess.createElement('div', null, { parent: infoTipDiv });
            domAccess.createElement('b', null, { parent: div, text: comment });
            domAccess.createElement('span', null, { parent: div, text: `: ${config} (${effective})` });
        })

        return helpInfoTip;
    }


    /**
     * @returns {HTMLElement}
     */
    createMainElement() {
        return this._domAccess.createElement('div', { id: 'QILVGallery_main_element' }, { parent: document.body });
    }



    /**
     * @returns {{href: string, element: HTMLElement}[]}
     */
    getLinkRefs() {
        return this._domAccess.getElementsByTagName('a').map((this_a) => ({href: this_a.href, element: this_a}));
    }

    /**
     * 
     * @param {Object} obj
     * @param {HTMLElement}  obj.element
     * @param {string}  obj.id
     * @returns {void}
     */
    setImageRef({element, id}) {
        element.classList.add('QILVGallery_Image');
        element.classList.add(`QILVGallery_Image_${id}`);
    }

    /**
     * @returns {void}
     */
    installCss() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .qilvgallery_infotip {
                display:block;
                position:absolute;
                left:4px;
                top:4px;
                padding:15px;
                font-size:13px;
                background:linear-gradient(180deg, #f8f8f8, #dddddd);
                color:#000000;
                font-family:"consolas", "courier new",monospace;
                border: 2px solid;
                border-color: #ffffff #f8f8f8 #b8b8b8 #f8f8f8;
                -moz-border-radius:5px;
                -webkit-border-radius:5px;
                border-radius:5px;
                z-index:50001
            }

            .qilvgallery_infotip > pre {
                margin: 0;
            }
            .qilvgallery_preload_gauge {
                z-index:50101;
                border:1px solid black;
                width:100%;
                position:fixed;
                bottom:0;
                height:13px;
                background-color:#eee;
            }
            .qilvgallery_preload_gauge_inner {
                z-index:50102;
                border:0;
                padding:0;
                margin:0;
                width:0%;
                position:static;
                left:0;
                top:0;
                height:100%;
                background-color:#f03;
                text-align:center;
                font-size:11px;
                font-family:Arial,Verdana,sans-serif,Helvetica;
                font-weight:bold;
                color:#000000;
            }

            .qilvgallery_infotip_about_blackscreen {
                z-index: 50098;
                width: 100%;
                height: 100%;
                position: fixed;
                left: 0px;
                top: 0px;
                background: black;
                opacity: 0.8;           
            }

            .qilvgallery_infotip_about_title {
                fontSize : 20pt;
            }

            .qilvgallery_infotip_about_button {
                width: 20em;
                border: 1px solid #666;
                background: #ccc;
                border-radius: 8px;
                background: linear-gradient(0, #aaa, #eee);
                left: 0px;
                right: 0px;
                margin: 100px auto auto;
            }

            .qilvgallery_infotip_center {
                position: fixed;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto;
            }
    
            .qilvgallery_infotip_about {
                font-family: "Trebuchet MS","Tahoma","Verdana","Arial","sans-serif";
                font-size: 15pt;
                text-align: center;
                max-width: 500px;
                max-height: 300px;
                border: 1px solid white;
                background: linear-gradient(180deg, #f8f8f8, #dddddd);
                z-index: 50100;
            }
    
            .qilvgallery_infotip_help {
                display: block;
                position: absolute;
                left: 4px;
                top: 4px;
                padding: 15px;
                font-size: 13px;
                border: 1px solid white;
                background: linear-gradient(180deg, #f8f8f8, #dddddd);
                color: rgb(0, 0, 0);
                font-family: "courier new";
                border-radius: 5px;
                z-index: 50001;
            }

            .qilvgallery_infotip_help_title {
                font-size: 2em;
                font-weight: bold;
            }

            .qilvgallery_infotip_help_content {
                margin-left: 10px;
            }

            .qilvgallery_infobox_textarea {
                white-space:pre;
            }

            #QILVGallery_preload_all_panel {
                display:none;
            }
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

}