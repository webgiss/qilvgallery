import DomAccess from './DomAccess';
import ImageOverlay from './ImageOverlay';
import VK from './VK';

/**
 * @class
 * @implements {IBindable}
 */
export default class GalleryOverlays {
    /**
     * @param {Object} obj
     * @param {DomAccess} obj.domAccess
     * @param {VK} obj.vk
     * @param {Object.<string, string>} obj.config
     */
    constructor({
        domAccess,
        vk,
        config
    }) {
        this._domAccess = domAccess;
        this._vk = vk;
        this._config = config;

        /**
         * @type {Object.<string, string>}
         */
        this._configurables = {
            "slideshowSpeed": "Initial slideshow speed (ms)",
            "transitionTime": "Initial transition's effect's time (ms)",
            "slideshowMode": "Slideshow on at start ?",
            "preloadAllMode": "Preload all at start ?",
            "maxSize": "Fit the image to the screen if bigger than the screen at start ?",
            "relative": "Show image at the top of the screen instead of the top of the page at start ?",
            "blackScreenMode": "Show on 'black screen' mode at start ?",
        };

        /**
         * @type {Object.<string, string>}
         */
        this._bindables = {
            "goPrev": "Go to previous image",
            "goNext": "Go to next image",
            "toggleInfoBox": "Show/hide the infobox of image list",
            "toggle": "Show/Hide the current image",
            "openLink": "Open the image in a new window/tab",
            "startStopSlideshow": "Start/stop the slideshow",
            "togglePosition": "Show current image at top of the page/top of the screen",
            "speedUpSlideshow": "Increase the slideshow speed",
            "speedDownSlideshow": "Decrease the slideshow speed",
            "toggleMaxSize": "Fit the image if larger than the screen/Show whole image",
            "toggleAutoX": "Width of the image fit/doesn't fit to width of the screen",
            "toggleAutoY": "Height of the image fit/doesn't fit to height of the screen",
            "toggleAutoXY": "Width and height of the image fit/doesn't fit to width and height of the screen",
            "toggleBlackScreen": "Set or remove the black screen",
            "cycleTransitionTime": "Change transition's effect's time",
            "preloadAll": "Pre-load all images (may take some resources)",
            "about": "Show/Hide about box",
            "help": "Show/Hide help box",
        };

        /**
         * @type {Object.<string, string>}
         */
        this._key_bindings = {
            BACKSPACE: "goPrev",
            J: "goPrev",
            SPACE: "goNext",
            K: "goNext",
            I: "toggleInfoBox",
            H: "toggle",
            L: "openLink",
            S: "startStopSlideshow",
            R: "togglePosition",
            NUMPAD_ADD: "speedUpSlideshow",
            NUMPAD_SUBSTRACT: "speedDownSlideshow",
            M: "toggleMaxSize",
            X: "toggleAutoX",
            Y: "toggleAutoY",
            Z: "toggleAutoXY",
            B: "toggleBlackScreen",
            T: "cycleTransitionTime",
            P: "preloadAll",
            NUMPAD_MULTIPLY: "help",
            NUMPAD_DIVIDE: "about"
        };
        this.__name__ = 'Gallery';

        /**
         * @type ImageOverlay
         */
        this._prev = null;
        /**
         * @type ImageOverlay
         */
        this._next = null;
        /**
         * @type ImageOverlay
         */
        this._current = null;


        /**
         * @type boolean
         */
        this._slideshowMode = false;
        /**
         * @type boolean
         */
        this._preloadAllMode = true;
        /**
         * @type boolean
         */
        this._slideshowDirNext = true;
        /**
         * @type number
         */
        this._slideshowSpeed = 500;
        /**
         * @type boolean
         */
        this._autoX = false;
        /**
         * @type boolean
         */
        this._autoY = false;
        /**
         * @type boolean
         */
        this._maxSize = true;
        /**
         * @type boolean
         */
        this._relative = false;
        /**
         * @type boolean
         */
        this._isCenterOnScreen = false;
        /**
         * @type boolean
         */
        this._blackScreenMode = true;
        /**
         * @type number
         */
        this._transitionTime = 0;
        /**
         * @type HTMLElement
         */
        this._blackScreen = null;
    }

    /**
     * @returns {Object.<string,string>}
     */
    getBindableMethods() {
        return this._bindables;
    }

    /**
     * @returns {Object.<string,string>}
     */
    getKeyBindings() {
        return this._key_bindings;
    }

    /**
     * @returns {ImageOverlay[]}
     */
    get ImageOverlays() {
        return ['prev', 'next', 'current'].map((element) => {
            return this['_' + element];
        });
    }

    /**
     * @param {number} transitionTime
     * @param {boolean} silent
     */
    setTransitionTime(transitionTime, silent) {
        this._transitionTime = transitionTime;
        this.ImageOverlays.map((element) => element.setTransitionTime(transitionTime));

        if (!silent) {
            return this.createInfoTip({
                content: `Transition's effect's time : ${transitionTime} ms`,
                fadeOut: 500,
                appendTo: this._main_element,
                position: "fixed"
            });
        }
    }

    /**
     * @returns {void}
     */
    cycleTransitionTime() {
        let transitionTime = this._transitionTime;
        if (transitionTime === 0) {
            transitionTime = 300;
        } else if (transitionTime <= 300) {
            transitionTime = 800;
        } else if (transitionTime <= 800) {
            transitionTime = 1500;
        } else {
            transitionTime = 0;
        }
        this.setTransitionTime(transitionTime);
    }

    /**
     * @param {boolean} shouldCenterOnScreen
     */
    setCenterOnScreen(shouldCenterOnScreen) {
        this.ImageOverlays.forEach((element) => {
            if (shouldCenterOnScreen) {
                element.centerOnScreen();
            } else {
                element.unCenterOnScreen();
            }
        });
        this._isCenterOnScreen = shouldCenterOnScreen;
    }

    /**
     * @param {boolean} shouldBlackScreen
     */
    setBlackScreen(shouldBlackScreen) {
        const domAccess = this._domAccess;
        if (shouldBlackScreen && (!this._blackScreen)) {
            this._blackScreen = domAccess.createElement('div', {
                id: 'QILVGallery_black_screen'
            }, {
                parent: this._main_element,
            });
            domAccess.setCssProperty(this._blackScreen, 'zIndex', '49998');
            domAccess.setCssProperty(this._blackScreen, 'width', '100%');
            domAccess.setCssProperty(this._blackScreen, 'height', '100%');
            domAccess.setCssProperty(this._blackScreen, 'position', 'fixed');
            domAccess.setCssProperty(this._blackScreen, 'left', '0');
            domAccess.setCssProperty(this._blackScreen, 'top', '0');
            domAccess.setCssProperty(this._blackScreen, 'background', 'black');
        }
        if ((!shouldBlackScreen) && (this._blackScreen)) {
            domAccess.remove(this._blackScreen);
            this._blackScreen = null;
        }
        this.setCenterOnScreen(shouldBlackScreen);
        this._blackScreenMode = shouldBlackScreen;
    }

    /**
     * @returns {void}
     */
    showSlideshowSlide() {
        if (this._slideshowMode) {
            if (this._slideshowDirNext) {
                this.goNext();
            } else {
                this.goPrev();
            }
            this.prepareNextSlide();
        }
    }

    /**
     * @returns {void}
     */
    prepareNextSlide() {
        setTimeout(() => this.showSlideshowSlide(), this._slideshowSpeed);
    }

    /**
     * @returns {void}
     */
    startSlideshow() {
        this._slideshowMode = true;
        this.prepareNextSlide();
    }

    /**
     * @returns {void}
     */
    stopSlideshow() {
        this._slideshowMode = false;
    }

    /**
     * @returns {void}
     */
    startStopSlideshow() {
        if (this._slideshowMode) {
            this.stopSlideshow();
        } else {
            this.startSlideshow();
        }
    }

    /**
     * @returns {number}
     */
    get slideshowSpeed() {
        return this._slideshowSpeed;
    }

    /**
     * @param {number} value
     */
    set slideshowSpeed(value) {
        this._slideshowSpeed = value;
        this.createInfoTip({
            content: `Speed : ${this._slideshowSpeed} ms`,
            fadeOut: 500,
            appendTo: this._main_element,
            position: 'fixed'
        });
    }

    /**
     * @returns {void}
     */
    speedUpSlideshow() {
        if (this.slideshowSpeed > 100) {
            this.slideshowSpeed = this.slideshowSpeed - 100;
        }
    }

    /**
     * @returns {void}
     */
    speedDownSlideshow() {
        this.slideshowSpeed = this.slideshowSpeed + 100;
    }

    /**
     * @returns {void}
     */
    goPrev() {
        this._slideshowDirNext = false;
        this._current.hide();
        [this._next, this._current, this._prev] = [this._current, this._prev, this._next];
        this._current.show();
        const element = document.querySelector(this._current._selector);
        this._prev.update(element.gprev);
        this.removeInfoBox();
        this.setBlackScreen(this._blackScreenMode);
    }

    /**
     * @returns {void}
     */
    goNext() {
        this._slideshowDirNext = true;
        this._current.hide();
        [this._current, this._prev, this._next] = [this._next, this._current, this._prev];
        this._current.show();
        const element = document.querySelector(this._current._selector);
        this._next.update(element.gnext);
        this.removeInfoBox();
        this.setBlackScreen(this._blackScreenMode);
    }

    /**
     * @param {number} num 
     */
    goNum(num) {
        this._current.update(`.QILVGallery_Image_${num}`);
        const element = document.querySelector(this._current._selector);
        this._prev.update(element.gprev);
        this._next.update(element.gnext);
        this.removeInfoBox();
        this.setBlackScreen(this._blackScreenMode);
    }

    /**
     * @returns {boolean}
     */
    get maxSize() {
        return this._maxSize;
    }

    /**
     * @param {boolean} value
     */
    set maxSize(value) {
        this._maxSize = value;
        return this.createInfoTip({
            content: this._maxSize ? 'Max size : 100%' : 'No max size',
            fadeOut: 500,
            appendTo: this._main_element,
            position: "fixed"
        });
    }

    /**
     * @returns {void}
     */
    toggleMaxSize() {
        this.maxSize = !this.maxSize;
        this._current.setMaxSize(this.maxSize);
        this._prev.setMaxSize(this.maxSize);
        this._next.setMaxSize(this.maxSize);
    }

    /**
     * @returns {void}
     */
    toggleAutoX() {
        this._autoX = !this._autoX;
        this._current.setAutoX(this._autoX);
        this._prev.setAutoX(this._autoX);
        this._next.setAutoX(this._autoX);
    }

    /**
     * @returns {void}
     */
    toggleAutoY() {
        this._autoY = !this._autoY;
        this._current.setAutoY(this._autoY);
        this._prev.setAutoY(this._autoY);
        this._next.setAutoY(this._autoY);
    }

    /**
     * @returns {void}
     */
    toggleAutoXY() {
        if (this._autoX || this._autoY) {
            this._autoX = false;
            this._autoY = false;
        } else {
            this._autoX = true;
            this._autoY = true;
        }
        this._current.setAutoX(this._autoX);
        this._prev.setAutoX(this._autoX);
        this._next.setAutoX(this._autoX);
        this._current.setAutoY(this._autoY);
        this._prev.setAutoY(this._autoY);
        this._next.setAutoY(this._autoY);
    }

    /**
     * @returns {boolean}
     */
    isCurrent(href) {
        this._current.imageSource === href;
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
     * @returns {void}
     */
    removeInfoBox() {
        if (this._infoBox) {
            this._domAccess.remove(this._infoBox);
            this._infoBox = null;
        }
    }

    /**
     * @returns {void}
     */
    toggleInfoBox() {
        const domAccess = this._domAccess;
        if (this._infoBox) {
            this.removeInfoBox();
        } else {
            this._infoBox = this.createInfoTip({
                appendTo: this._main_element,
            });
            let info_tip_pre = domAccess.createElement('pre', null, {
                parent: this._infoBox
            });
            domAccess.getElementsByClassName('QILVGallery_Image').forEach((this_a) => {
                let subElement = 'span';
                let href = this_a.href;
                if (this.isCurrent(href)) {
                    subElement = 'b';
                }
                domAccess.createElement(subElement, null, {
                    parent: info_tip_pre,
                    text: href
                });
                domAccess.createElement('br', null, {
                    parent: info_tip_pre
                });
            });
            info_tip_pre.addEventListener('click', () => {
                let text = '';
                let maxLength = 0;
                let count = 0;
                domAccess.getElementsByClassName('QILVGallery_Image').forEach((this_a) => {
                    let href = this_a.href;
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
        }
    }


    /**
     * @returns {void}
     */
    toggle() {
        const isOn = this._current.isOn;
        const hasBlackScren = this._blackScreen;
        const blackScreenMode = this._blackScreenMode;
        if (this._current.isOn) {
            if (this._blackScreen) {
                this._domAccess.remove(this._blackScreen);
                this._blackScreen = null;
            }
        } else {
            if (this._blackScreenMode) {
                this.setBlackScreen(this._blackScreenMode);
            }
        }
        this._current.toggle();
    }

    /**
     * @returns {void}
     */
    togglePosition() {
        this.setRelative(!this._relative);
    }

    /**
     * @returns {void}
     */
    setRelative(relative) {
        this._relative = relative;
        this._current.relative = this._relative;
        this._next.relative = this._relative;
        this._prev.relative = this._relative;
    }

    /**
     * @returns {boolean}
     */
    get relative() {
        return this._current.relative;
    }

    /**
     * @returns {void}
     */
    toggleBlackScreen() {
        this.setBlackScreen(!this._blackScreenMode);
    }

    /**
     * @returns {void}
     */
    openLink() {
        window.open(this._current.imageSource);
    }

    /**
     * @returns {void}
     */
    showPreloadGauge() {
        if (!this._preloadGauge) {
            this._preloadGauge = this._domAccess.createElement('div', {
                className: 'qilvgallery_preload_gauge',
            }, {
                parent: this._main_element,
            });

            this._preloadGaugeInner = this._domAccess.createElement('div', {
                className: 'qilvgallery_preload_gauge_inner',
            }, {
                parent: this._preloadGauge,
            });
            this.updatePreloadGauge();
        }
    }

    /**
     * @returns {void}
     */
    hidePreloadGauge() {
        this._domAccess.remove(this._preloadGaugeInner);
        this._domAccess.remove(this._preloadGauge);
    }

    /**
     * @returns {void}
     */
    updatePreloadGauge() {
        const domAccess = this._domAccess;
        if (this._preloadGauge) {
            const panel = this._preloadAllPanel;
            const percent = `${Math.floor(panel._loaded * 100 / panel._total)}%`;
            domAccess.setCssProperty(this._preloadGaugeInner, 'width', percent);
            domAccess.setTextContent(this._preloadGaugeInner, percent);
            domAccess.setTextContent(this._preloadGaugeInner, `${panel._loaded} / ${panel._total}`);
            if (panel._loaded === panel._total) {
                this.hidePreloadGauge();
            }
        }
    }

    /**
     * @returns {void}
     */
    preloadAll() {
        const domAccess = this._domAccess;
        if (!this._preloadAllPanel) {
            this._preloadAllPanel = domAccess.createElement('div', {
                id: 'QILVGallery_preload_all_panel',
            }, {
                parent: this._main_element,
            });
            const images = domAccess.getElementsByClassName('QILVGallery_Image');
            this._preloadAllPanel._total = images.length;
            this._preloadAllPanel._loaded = 0;
            images.forEach((this_a) => {
                const image = domAccess.createElement('img', {
                    'src': '#'
                }, {
                    parent: this._preloadAllPanel
                });
                image.addEventListener('load', (event) => {
                    this._preloadAllPanel._loaded += 1;
                    this.updatePreloadGauge();
                });
                image.src = this_a.href;
            });
            this.showPreloadGauge();
        } else {
            if (!this._preloadGauge) {
                this.showPreloadGauge();
            } else {
                this.hidePreloadGauge();
            }
        }
    }

    /**
     * @returns {void}
     */
    about() {
        const domAccess = this._domAccess;
        if (this._aboutInfoTip) {
            domAccess.remove(this._aboutInfoTip);
            this._aboutInfoTip = null;
            domAccess.remove(this._aboutInfoTipBlackScreen);
            this._aboutInfoTipBlackScreen = null;
        } else {
            this._aboutInfoTipBlackScreen = domAccess.createElement('div', {
                className: 'qilvgallery_infotip_about_blackscreen',
            }, {
                parent: this._main_element,
            });
            const aboutInfoTip = this._aboutInfoTip = this.createInfoTip({
                id: 'QILVGallery_About',
                center: true,
                appendTo: this._main_element,
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
            domAccess.createElement('br', null, {
                parent: aboutInfoTip
            });
            const closeButton = domAccess.createElement('div', {
                className: 'qilvgallery_infotip_about_button',
            }, {
                text: 'Close',
                parent: aboutInfoTip
            });
            const onClick = () => {
                domAccess.remove(this._aboutInfoTip);
                this._aboutInfoTip = null;
                domAccess.remove(this._aboutInfoTipBlackScreen);
                this._aboutInfoTipBlackScreen = null;
            };
            closeButton.addEventListener('click', onClick);
            this._aboutInfoTipBlackScreen.addEventListener('click', onClick);
        }
    }

    /**
     * @returns {void}
     */
    help() {
        const domAccess = this._domAccess;
        if (this._helpInfoTip) {
            domAccess.remove(this._helpInfoTip);
            this._helpInfoTip = null;
        } else {
            const help_info_tip = this._helpInfoTip = this.createInfoTip({
                id: 'QILVGallery_Help',
                appendTo: this._main_element,
                classNames: ['qilvgallery_infotip_help']
            });
            domAccess.createElement('h1', {
                className: 'qilvgallery_infotip_help_title',
            }, {
                text: 'Keyboard configuration',
                parent: help_info_tip,
            })
            let infoTipDiv = domAccess.createElement('div', {
                className: 'qilvgallery_infotip_help_content',
            }, {
                parent: help_info_tip,
            })

            Object.keys(this._vk.globalBindings).forEach(/** @param {number} key*/(key) => {
                const value = this._vk.globalBindings[key];
                if (value && value.target === this) {
                    const { methodName } = value;
                    const div = domAccess.createElement('div', null, {
                        parent: infoTipDiv,
                    });
                    domAccess.createElement('b', null, {
                        parent: div,
                        text: this._vk.getName(key)
                    });
                    const bindableMethods = this.getBindableMethods();
                    const name = methodName in bindableMethods ? bindableMethods[methodName] : methodName;
                    domAccess.createElement('span', null, {
                        parent: div,
                        text: `: ${name}`
                    });
                }
            })
            domAccess.createElement('h1', {
                className: 'qilvgallery_infotip_help_title',
            }, {
                text: 'Values',
                parent: help_info_tip,
            });
            infoTipDiv = domAccess.createElement('div', {
                className: 'qilvgallery_infotip_help_content',
            }, {
                parent: help_info_tip,
            });

            Object.keys(this._configurables).forEach((attr) => {
                const comment = this._configurables[attr];
                const div = domAccess.createElement('div', null, {
                    parent: infoTipDiv,
                });
                domAccess.createElement('b', null, {
                    parent: div,
                    text: comment
                });
                const configValue = this._config['QILV.' + attr] || "default";
                const effectiveValue = this[attr];
                domAccess.createElement('span', null, {
                    parent: div,
                    text: `: ${configValue} (${effectiveValue})`
                });
            });
        }
    }

    /**
     * @returns {void}
     */
    _installCss() {
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

    /**
     * @returns {void}
     */
    init() {
        const domAccess = this._domAccess;
        this._main_element = domAccess.createElement('div', {
            id: 'QILVGallery_main_element'
        }, {
            parent: document.body,
        });

        this._installCss();
        this._prev = new ImageOverlay({
            domAccess,
            index: 0,
            element: this._main_element,
        });
        this._current = new ImageOverlay({
            domAccess,
            index: 1,
            element: this._main_element,
        });
        this._next = new ImageOverlay({
            domAccess,
            index: 2,
            element: this._main_element,
        });
        let previousLink = null;
        const linkList = domAccess.getElementsByTagName('a').filter((this_a) => {
            let link = this_a.href;
            let ok = false;
            if (link) {
                [".png", ".gif", ".jpg", ".jpeg"].map((extension) => {
                    if (link.indexOf("?") === -1) {
                        if (link.substr(link.length - extension.length, extension.length).toLowerCase() === extension) {
                            if (link !== previousLink) {
                                ok = true;
                            }
                        }
                    }
                });
            }
            if (ok) {
                previousLink = link;
            }
            return ok;
        });

        linkList.forEach((this_a, index) => {
            this_a.classList.add('QILVGallery_Image');
            this_a.classList.add('QILVGallery_Image_' + index);
            const prevIndex = index === 0 ? linkList.length - 1 : index - 1;
            const nextIndex = index === linkList.length - 1 ? 0 : index + 1;
            this_a['gprev'] = '.QILVGallery_Image_' + prevIndex;
            this_a['gnext'] = '.QILVGallery_Image_' + nextIndex;
        });

        if (linkList.length == 0) {
            this.createInfoTip({
                content: 'No links to image found in this page !',
                fadeOut: 1500,
                appendTo: document.body,
                position: "fixed"
            });
            this.stopSlideshow();
            this.setBlackScreen(false);
            return;
        }

        this.goNum(0);
        this._vk.auto_bind(this);

        Object.keys(this._configurables).forEach((keyName) => {
            let comment = this._configurables[keyName];
            let value = this._config["QILV." + keyName];
            if (value != null) {
                if (value.match(/^\-?[0-9]+$/)) {
                    value = parseInt(value);
                }
                if (value === 'false') {
                    value = false;
                }
                if (value === 'true') {
                    value = true;
                }
                this['_' + keyName] = value;
            }
        });

        this._current.show();

        this._current.setMaxSize(this._maxSize);
        this._prev.setMaxSize(this._maxSize);
        this._next.setMaxSize(this._maxSize);

        if (this._slideshowMode) {
            this.prepareNextSlide();
        }

        if (this._preloadAllMode) {
            this.preloadAll();
        }

        this.setRelative(this._relative);
        this.setBlackScreen(this._blackScreenMode);
        this.setTransitionTime(this._transitionTime, true);
        this;
    }

    /**
     * @returns {Object.<string, string>}
     */
    get bindables() {
        return this._bindables;
    }

    /**
     * @param {Object.<string, string>} value
     */
    set bindables(value) {
        this._bindables = value;
    }
}
