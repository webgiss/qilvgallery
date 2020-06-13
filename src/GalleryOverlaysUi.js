import DomAccess from './DomAccess';

export default class GalleryOverlaysUi {
    /**
     * @param {Object} obj
     * @param {DomAccess} obj.domAccess
     */
    constructor({ domAccess }) {
        this._domAccess = domAccess;
        this._preloadGauge = null;
        this._preloadGaugeInner = null;
    }

    /**
     * @param {Object} obj
     * @param {HTMLElement} obj.parent
     * @returns {HTMLElement}
     */
    createBlackScreen({ parent }) {
        return this._domAccess.createElement('div', { parent, id: 'qilvgallery_black_screen' });
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
     * @param {HTMLElement} params.parent
     * @param {HTMLElement[]} params.content
     * @param {string} params.position
     * @param {boolean} params.center
     * @returns {HTMLElement}
     */
    createInfoTip(params) {
        const domAccess = this._domAccess;
        if (params === undefined) {
            params = {};
        }
        const features = {
            className: 'qilvgallery_infotip',
        };

        if (features.id !== undefined) {
            features.id = params.id;
        }
        if (params.parent) {
            features.parent = params.parent;
        }
        if (params.content) {
            features.content = params.content;
        }
        if (params.classNames) {
            features.classNames = params.classNames;
        }

        const infoTip = domAccess.createElement('div', features);
        if (params.position) {
            domAccess.setCssProperty(infoTip, "position", params.position);
        }
        if ((params.center !== undefined) && params.center) {
            infoTip.classList.add('qilvgallery_infotip_center')
        }
        if (params.fadeOut !== undefined) {
            setTimeout(() => domAccess.remove(infoTip), params.fadeOut);
        }

        return infoTip;
    }


    /**
     * @param {string} message
     * @param {HTMLElement} element
     * @returns {void}
     */
    createTempMessage(message, element) {
        this.createInfoTip({
            fadeOut: 1500,
            parent: element,
            position: "fixed",
            content: [message],
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
    createInfoBox({ parent, hrefs, isCurrent }) {
        const domAccess = this._domAccess;
        const infoTip = this.createInfoTip({ parent });
        let info_tip_pre = domAccess.createElement('pre', {
            parent: infoTip,
            content: [
                hrefs.map((href) => {
                    let subElement = 'span';
                    if (isCurrent(href)) {
                        subElement = 'b';
                    }
                    return [
                        domAccess.createElement(subElement, { text: href }),
                        domAccess.createElement('br'),
                    ];
                }),
            ],
            onClick: () => {
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

                let info_tip_area = domAccess.createElement('textarea', {
                    parent: infoTip,
                    attr: {
                        rows: `${count + 1}`,
                        cols: `${maxLength + 2}`,
                        className: 'qilvgallery_infobox_textarea',
                        readonly: 1,
                        value: text,
                    },
                });
                info_tip_area.select();
            },
        });
        return infoTip;
    }

    /**
     * @param {Object} obj
     * @param {HTMLElement} obj.parent
     * @param {()=>{}} obj.onComplete
     * @param {Object} obj.preloadGaugeInfo
     * @returns {Object}
     */
    showPreloadGauge({ parent, onComplete, preloadGaugeInfo }) {
        if (!preloadGaugeInfo) {
            const preloadGauge = this._domAccess.createElement('div', { parent, className: 'qilvgallery_preload_gauge' });
            const preloadGaugeInner = this._domAccess.createElement('div', { parent: preloadGauge, className: 'qilvgallery_preload_gauge_inner' });
            preloadGaugeInfo = { preloadGauge, preloadGaugeInner, onComplete };
        }
        return preloadGaugeInfo;
    }

    /**
     * @param {Object} obj
     * @param {Object} obj.preloadGaugeInfo
     * @returns {void}
     */
    hidePreloadGauge({ preloadGaugeInfo }) {
        if (preloadGaugeInfo) {
            this._domAccess.remove(preloadGaugeInfo.preloadGaugeInner);
            this._domAccess.remove(preloadGaugeInfo.preloadGauge);
        }
    }

    /**
     * @param {Object} obj
     * @param {Number} obj.loaded
     * @param {Number} obj.total
     * @param {Object} obj.preloadGaugeInfo
     * @returns {void}
     */
    updatePreloadGauge({ loaded, total, preloadGaugeInfo }) {
        if (preloadGaugeInfo) {
            const domAccess = this._domAccess;
            const percent = `${Math.floor(loaded * 100 / total)}%`;
            domAccess.setCssProperty(preloadGaugeInfo.preloadGaugeInner, 'width', percent);
            domAccess.setTextContent(preloadGaugeInfo.preloadGaugeInner, percent);
            domAccess.setTextContent(preloadGaugeInfo.preloadGaugeInner, `${loaded} / ${total}`);
            if (loaded === total) {
                // this.hidePreloadGauge();
                preloadGaugeInfo.onComplete();
            }
        }
    }


    /**
     * 
     * @param {Object} obj
     * @param {Array<string>} obj.hrefs
     * @param {() => {}} obj.onImageLoaded
     * @param {HTMLElement} obj.parent
     */
    ensurePreloadAll({ hrefs, onImageLoaded, parent }) {
        if (!this._preloadAllPanel) {
            const domAccess = this._domAccess;

            this._preloadAllPanel = domAccess.createElement('div', { parent, id: 'qilvgallery_preload_all_panel' });
            hrefs.forEach((href) => {
                const image = domAccess.createElement('img', {
                    parent: this._preloadAllPanel,
                    onLoad: onImageLoaded,
                    attr: {
                        'src': '#'
                    }
                });
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
     * @param {string} obj.version
     * @returns {HTMLElement}
     */
    createAboutInfoBox({ parent, onClick, version }) {
        const domAccess = this._domAccess;
        const url = 'https://github.com/gissehel/qilvgallery';
        return domAccess.createElement('div', {
            parent,
            className: 'qilvgallery_about_infobox',
            content: [
                domAccess.createElement('div', {
                    className: 'qilvgallery_infotip_about_blackscreen',
                    onClick
                }),
                this.createInfoTip({
                    id: 'QILVGallery_About',
                    center: true,
                    classNames: ['qilvgallery_infotip_about'],
                    content: [
                        domAccess.createElement('p', {
                            text: 'QILV Gallery',
                            className: 'qilvgallery_infotip_about_title',
                        }),
                        domAccess.createElement('p', {
                            text: `Version : ${version}`,
                            className: 'qilvgallery_infotip_about_version',
                        }),
                        domAccess.createElement('a', {
                            text: url,
                            attr: {
                                href: url,
                                target: '_blank'
                            },
                        }),
                        domAccess.createElement('br'),
                        domAccess.createElement('div', {
                            text: 'Close',
                            className: 'qilvgallery_infotip_about_button',
                            onClick
                        })
                    ],
                })
            ],
        });
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
     * @param {{comment: string, configured: string, effective: string, defaultValue: string}[]} obj.configurations
     * @param {string} obj.version
     * @returns {HTMLElement}
     */
    createHelpInfoTip({ parent, bindings, configurations, version }) {
        const domAccess = this._domAccess;

        return this.createInfoTip({
            parent,
            classNames: ['qilvgallery_infotip_help'],
            content: [
                domAccess.createElement('p', {
                    text: `Version: ${version}`,
                }),

                domAccess.createElement('h1', {
                    text: 'Keyboard configuration',
                    className: 'qilvgallery_infotip_help_title',
                }),

                domAccess.createElement('div', {
                    className: 'qilvgallery_infotip_help_content',
                    content: bindings.map(({ keyName, methodName }) => domAccess.createElement('div', {
                        content: [
                            domAccess.createElement('b', { text: keyName }),
                            domAccess.createElement('span', { text: `: ${methodName}` }),
                        ],
                    })),
                }),

                domAccess.createElement('h1', {
                    text: 'Values',
                    className: 'qilvgallery_infotip_help_title',
                }),

                domAccess.createElement('div', {
                    className: 'qilvgallery_infotip_help_content',
                    content: configurations.map(({ comment, configured, effective, defaultValue }) => domAccess.createElement('div', {
                        content: [
                            domAccess.createElement('b', { text: comment }),
                            domAccess.createElement('span', { text: `: ${effective} (configured = ${configured} ; default = ${defaultValue})` }),
                        ],
                    }))
                }),
            ],
        });
    }


    /**
     * @returns {HTMLElement}
     */
    createMainElement() {
        return this._domAccess.createElement('div', { parent: document.body, id: 'qilvgallery_main_element' });
    }

    /**
     * @param {Object} obj
     * @param {HTMLElement} obj.parent
     * @returns {HTMLElement}
     */
    createViewer({ parent }) {
        return this._domAccess.createElement('div', { parent, id: 'qilvgallery_viewer' });
    }

    /**
     * @returns {{href: string, element: HTMLElement}[]}
     */
    getLinkRefs() {
        return this._domAccess.getElementsByTagName('a').map((this_a) => ({ href: this_a.href, element: this_a }));
    }

    /**
     * 
     * @param {Object} obj
     * @param {HTMLElement}  obj.element
     * @param {string}  obj.id
     * @returns {void}
     */
    setImageRef({ element, id }) {
        this._domAccess.addClass(element, 'qilvgallery_source_image');
        this._domAccess.addClass(element, `qilvgallery_source_image_${id}`);
    }


    /**
     * 
     * @param {Object} obj
     * @param {HTMLElement} obj.element
     * @param {boolean} obj.relative
     */
    setRelative({ element, relative }) {
        this._domAccess.setClass(element, 'qilv_relative', relative);
    }

    /**
     * 
     * @param {Object} obj
     * @param {HTMLElement} obj.element
     * @param {boolean} obj.autoX
     */
    setAutoX({ element, autoX }) {
        this._domAccess.setClass(element, 'qilv_autoX', autoX);
    }

    /**
     * 
     * @param {Object} obj
     * @param {HTMLElement} obj.element
     * @param {boolean} obj.autoY
     */
    setAutoY({ element, autoY }) {
        this._domAccess.setClass(element, 'qilv_autoY', autoY);
    }

    /**
     * 
     * @param {Object} obj
     * @param {HTMLElement} obj.element
     * @param {boolean} obj.autoY
     */
    setAutoY({ element, autoY }) {
        this._domAccess.setClass(element, 'qilv_autoY', autoY);
    }

    /**
     * 
     * @param {Object} obj
     * @param {HTMLElement} obj.element
     * @param {boolean} obj.centered
     */
    setCentered({ element, centered }) {
        this._domAccess.setClass(element, 'qilv_centered', centered);
    }

    /**
     * 
     * @param {Object} obj
     * @param {HTMLElement} obj.element
     * @param {boolean} obj.maxSize
     */
    setMaxSize({ element, maxSize }) {
        this._domAccess.setClass(element, 'qilv_maxSize', maxSize);
    }


    /**
     * 
     * @param {Object} obj
     * @param {HTMLElement} obj.element
     * @param {boolean} obj.shown
     */
    setShown({ element, shown }) {
        this._domAccess.setClass(element, 'qilv_shown', shown);
    }

    /**
     * 
     * @param {Object} obj
     * @param {HTMLElement} element
     * @param {number} transitionTime
     */
    setTransition({ element, transitionTime }) {
        this._domAccess.removeClassStartingWith(element, 'qilv_transition-');
        this._domAccess.addClass(element, `qilv_transition-${transitionTime}`);
    }

    /**
     * @returns {void}
     */
    installCss() {
        this._domAccess
            .startFluentCss({ important: true })
            .section()
            .match('#qilvgallery_viewer')
            .property('position', 'absolute')
            .property('z-index', '50000')
            .property('display', 'none')
            .property('top', '0')
            .property('bottom', '0')
            .property('margin', '0')
            .property('left', '0')
            .property('right', '0')
            .endSection()
            .section()
            .match('#qilvgallery_viewer.qilv_shown')
            .property('z-index', '50001')
            .property('display', 'block')
            .endSection()
            .section()
            .match('#qilvgallery_viewer.qilv_relative')
            .property('position', 'fixed')
            .endSection()
            .section()
            .match('.qilvgallery_infotip')
            .property('display', 'block')
            .property('position', 'absolute')
            .property('left', '4px')
            .property('top', '4px')
            .property('padding', '15px')
            .property('font-size', '13px')
            .property('background', 'linear-gradient(180deg, #f8f8f8, #dddddd)')
            .property('color', '#000000')
            .property('font-family', '"consolas","courier new",monospace')
            .property('border', '2px solid')
            .property('border-color', '#ffffff #f8f8f8 #b8b8b8 #f8f8f8')
            .property('border-radius', '5px')
            .property('z-index', '50001')
            .endSection()
            .section()
            .match('.qilvgallery_infotip > pre')
            .property('margin', '0')
            .endSection()
            .section()
            .match('.qilvgallery_preload_gauge')
            .property('z-index', '50101')
            .property('border', '1px solid black')
            .property('width', '100%')
            .property('position', 'fixed')
            .property('bottom', '0')
            .property('height', '13px')
            .property('background-color', '#eee')
            .endSection()
            .section()
            .match('.qilvgallery_preload_gauge_inner')
            .property('z-index', '50102')
            .property('border', '0')
            .property('padding', '0')
            .property('margin', '0')
            .property('width', '0%')
            .property('position', 'static')
            .property('left', '0')
            .property('top', '0')
            .property('height', '100%')
            .property('background-color', '#f03')
            .property('text-align', 'center')
            .property('font-size', '11px')
            .property('font-family', 'Arial,Verdana,sans-serif,Helvetica')
            .property('font-weight', 'bold')
            .property('color', '#000000')
            .endSection()
            .section()
            .match('.qilvgallery_infotip_about_blackscreen')
            .property('z-index', '50098')
            .property('width', '100%')
            .property('height', '100%')
            .property('position', 'fixed')
            .property('left', '0px')
            .property('top', '0px')
            .property('background', 'black')
            .property('opacity', '0.8')
            .endSection()
            .section()
            .match('.qilvgallery_infotip_about_title')
            .property('font-size', '20pt')
            .endSection()
            .section()
            .match('.qilvgallery_infotip_about_button')
            .property('width', '20em')
            .property('border', '1px solid #666')
            .property('background', '#ccc')
            .property('border-radius', '8px')
            .property('background', 'linear-gradient(0, #aaa, #eee)')
            .property('left', '0px')
            .property('right', '0px')
            .property('margin', '100px auto auto')
            .endSection()
            .section()
            .match('.qilvgallery_infotip_center')
            .property('position', 'fixed')
            .property('left', '0')
            .property('right', '0')
            .property('top', '0')
            .property('bottom', '0')
            .property('margin', 'auto')
            .endSection()
            .section()
            .match('.qilvgallery_infotip_about')
            .property('font-family', '"Trebuchet MS","Tahoma","Verdana","Arial","sans-serif"')
            .property('font-size', '15pt')
            .property('text-align', 'center')
            .property('max-width', '500px')
            .property('max-height', '300px')
            .property('border', '1px solid white')
            .property('background', 'linear-gradient(180deg, #f8f8f8, #dddddd)')
            .property('z-index', '50100')
            .endSection()
            .section()
            .match('.qilvgallery_infotip_help')
            .property('display', 'block')
            .property('position', 'absolute')
            .property('left', '4px')
            .property('top', '4px')
            .property('padding', '15px')
            .property('font-size', '13px')
            .property('border', '1px solid white')
            .property('background', 'linear-gradient(180deg, #f8f8f8, #dddddd)')
            .property('color', '#000000')
            .property('font-family', '"courier new"')
            .property('border-radius', '5px')
            .property('z-index', '50001')
            .endSection()
            .section()
            .match('.qilvgallery_infotip_help_title')
            .property('font-size', '2em')
            .property('font-weight', 'bold')
            .endSection()
            .section()
            .match('.qilvgallery_infotip_help_content')
            .property('margin-left', '10px')
            .endSection()
            .section()
            .match('.qilvgallery_infobox_textarea')
            .property('white-space', 'pre')
            .endSection()
            .section()
            .match('.qilvgallery_about_infobox')
            .property('margin', '0')
            .property('padding', '0')
            .property('border', '0')
            .endSection()
            .section()
            .match('.qilvgallery_image_outter')
            .property('margin', '0')
            .property('padding', '0')
            .property('border', '0')
            .property('position', 'absolute')
            .property('display', 'block')
            .property('opacity', '0')
            .property('left', '0')
            .property('right', '0')
            .property('top', '0')
            .property('bottom', '0')
            .property('transition', 'opacity ease-out')
            .property('transition-duration', '0s')
            .endSection()
            .section()
            .match('.qilv_transition-300 .qilvgallery_image_outter')
            .property('transition-duration', '0.3s')
            .endSection()
            .section()
            .match('.qilv_transition-800 .qilvgallery_image_outter')
            .property('transition-duration', '0.8s')
            .endSection()
            .section()
            .match('.qilv_transition-1500 .qilvgallery_image_outter')
            .property('transition-duration', '1.5s')
            .endSection()
            .section()
            .match('.qilvgallery_image_outter.qilv_shown')
            .property('opacity', '1')
            .property('display', 'block')
            .endSection()
            .section()
            .match('.qilvgallery_image')
            .property('margin', 'unset')
            .property('padding', '0')
            .property('display', 'block')
            .property('position', 'absolute')
            .property('left', '0')
            .property('top', '0')
            .property('z-index', '50000')
            .property('box-sizing', 'border-box')
            .property('border', '2px solid black')
            .property('right', 'unset')
            .property('bottom', 'unset')
            .property('width', 'auto')
            .property('height', 'auto')
            .property('max-width', 'unset')
            .property('max-height', 'unset')
            .endSection()
            .section()
            .match('.qilv_maxSize .qilvgallery_image')
            .property('max-width', '100%')
            .property('max-height', '100%')
            .endSection()
            .section()
            .match('.qilv_autoX .qilvgallery_image')
            .property('width', '100%')
            .endSection()
            .section()
            .match('.qilv_autoY .qilvgallery_image')
            .property('height', '100%')
            .endSection()
            .section()
            .match('.qilvgallery_image.qilv_loading')
            .property('border', '2px solid red')
            .endSection()
            .section()
            .match('.qilv_centered .qilvgallery_image')
            .property('right', '0')
            .property('bottom', '0')
            .property('margin', 'auto')
            .endSection()
            .section()
            .match('#qilvgallery_preload_all_panel')
            .property('display', 'none')
            .endSection()
            .section()
            .match('#qilvgallery_black_screen')
            .property('z-index', '499998')
            .property('width', '100%')
            .property('height', '100%')
            .property('left', '0')
            .property('top', '0')
            .property('background', 'black')
            .property('margin', '0')
            .property('padding', '0')
            .endSection()
            .endCss()
            ;

        return;
        this._domAccess.installCss(`

            #qilvgallery_viewer {
                position: absolute !important;
                z-index: 50000 !important;
                display: none !important;
                top: 0 !important;
                bottom: 0 !important;
                margin: 0 !important;
                left: 0 !important;
                right: 0 !important;
            }

            #qilvgallery_viewer.qilv_shown {
                z-index: 50001 !important;
                display: block !important;
            }

            #qilvgallery_viewer.qilv_relative {
                position: fixed !important;
            }

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

            .qilvgallery_about_infobox {
                margin: 0;
                padding: 0;
                border: 0;
            }

            .qilvgallery_image_outter {
                margin: 0 !important;
                padding: 0 !important;
                border: 0 !important;
                position: absolute !important;
                display:block !important;
                opacity: 0 !important;
                left: 0 !important;
                right: 0 !important;
                top: 0 !important;
                bottom: 0 !important;
                transition: opacity ease-out;
                transition-duration: 0s;
            }

            .qilv_transition-300 .qilvgallery_image_outter {
                transition-duration: 0.3s;
            }
            .qilv_transition-800 .qilvgallery_image_outter {
                transition-duration: 0.8s;
            }
            .qilv_transition-1500 .qilvgallery_image_outter {
                transition-duration: 1.5s;
            }


            .qilvgallery_image_outter.qilv_shown {
                opacity: 1 !important;
                display: block !important;
            }
 
            .qilvgallery_image {
                margin: 0 !important;
                padding: 0 !important;
                display:block !important;
                position:absolute !important;
                left:0 !important;
                top:0 !important;
                z-index:50000 !important;
                box-sizing: border-box !important;
                border: 2px solid black !important;
                right: unset !important;
                bottom: unset !important;
                margin: unset !important;
                width: auto !important;
                height: auto !important;
                max-width: unset !important;
                max-height: unset !important;
            }

            .qilv_maxSize .qilvgallery_image {
                max-width: 100% !important;
                max-height: 100% !important;
            }

            .qilv_autoX .qilvgallery_image {
                width: 100% !important;
            }

            .qilv_autoY .qilvgallery_image {
                height: 100% !important;
            }

            .qilvgallery_image.qilv_loading {
                border: 2px solid red !important;
            }
            
            .qilv_centered .qilvgallery_image {
                right: 0 !important;
                bottom: 0 !important;
                margin: auto !important;
            }
            
            #qilvgallery_preload_all_panel {
                display:none;
            }

            #qilvgallery_black_screen {
                z-index: 49998;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                background: black;
                margin: 0;
                padding: 0;
            }
        `);
    }
}