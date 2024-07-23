import ImageOverlayFactory from './ImageOverlayFactory';
import ImageOverlay from './ImageOverlay';
import VK from './VK';
import GalleryOverlaysUi from './GalleryOverlaysUi';
import { version } from './version';
import IBindable from './IBindable';

/**
 * @class
 * @implements {IBindable}
 */
export default class GalleryOverlays extends IBindable {
    /**
     * @param {Object} obj
     * @param {ImageOverlayFactory} obj.imageOverlayFactory
     * @param {GalleryOverlaysUi} obj.galleryOverlaysUi
     * @param {VK} obj.vk
     * @param {Object.<string, string>} obj.config
     */
    constructor({ imageOverlayFactory, galleryOverlaysUi, vk, config }) {
        super();
        this._imageOverlayFactory = imageOverlayFactory;
        this._galleryOverlaysUi = galleryOverlaysUi
        this._vk = vk;
        this._config = config;
        this._preloadGaugeInfo = null;

        /**
         * @type {Object.<string, {label: string, default: string}>}
         */
        this._configurables = {
            "slideshowSpeed": { label: "Initial slideshow speed (ms)", default: '500' },
            "transitionTime": { label: "Initial transition's effect's time (ms)", default: '0' },
            "slideshowMode": { label: "Slideshow on at start ?", default: 'false' },
            "preloadAllMode": { label: "Preload all at start ?", default: 'true' },
            "maxSize": { label: "Fit the image to the screen if bigger than the screen at start ?", default: 'true' },
            "relative": { label: "Show image at the top of the screen instead of the top of the page at start ?", default: 'true' },
            "blackScreenMode": { label: "Show on 'black screen' mode at start ?", default: 'true' },
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
            "toggleSlideshow": "Start/stop the slideshow",
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
            "reload": "Reload images (after changes in page content)",
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
            S: "toggleSlideshow",
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
            E: "reload",
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
        this._slideshowMode = null;
        /**
         * @type boolean
         */
        this._preloadAllMode = null;
        /**
         * @type number
         */
        this._slideshowSpeed = null;
        /**
         * @type number
         */
        this._transitionTime = null;
        /**
         * @type boolean
         */
        this._maxSize = null;
        /**
         * @type boolean
         */
        this._relative = true;
        /**
         * @type boolean
         */
        this._blackScreenMode = null;


        /**
         * @type boolean
         */
        this._slideshowDirNext = true;
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
        this._centered = false;
        /**
         * @type HTMLElement
         */
        this._blackScreen = null;
        /**
         * @type boolean
         */
        this._shown = true;
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

    getConfigurables() {
        return this._configurables;
    }

    /**
     * @returns {number}
     */
    get autoX() {
        return this._autoX;
    }

    /**
     * @param {number} value
     * @returns {void}
     */
    set autoX(value) {
        this._autoX = value;
        this._galleryOverlaysUi.setAutoX({ element: this._viewer, autoX: this._autoX });
    }

    /**
     * @returns {number}
     */
    get autoY() {
        return this._autoY;
    }

    /**
     * @param {number} value
     * @returns {void}
     */
    set autoY(value) {
        this._autoY = value;
        this._galleryOverlaysUi.setAutoY({ element: this._viewer, autoY: this._autoY });
    }

    /**
     * @returns {ImageOverlay[]}
     */
    get ImageOverlays() {
        return ['prev', 'next', 'current'].map((element) => this['_' + element]);
    }

    /**
     * @param {number} transitionTime
     * @param {boolean} silent
     */
    setTransitionTime(transitionTime, silent) {
        this._transitionTime = transitionTime;
        this._galleryOverlaysUi.setTransition({ element: this._viewer, transitionTime })

        if (!silent) {
            this.createTempMessage(`Transition's effect's time : ${transitionTime} ms`);
        }
    }

    createTempMessage(message) {
        this._galleryOverlaysUi.createTempMessage(message, this._mainElement);
    }

    /**
     * @returns {number}
     */
    get transitionTime() {
        return this._transitionTime;
    }

    /**
     * @param {number} value
     * @returns {void}
     */
    set transitionTime(value) {
        this.setTransitionTime(value, true);
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
     * @returns {boolean}
     */
    get centered() {
        return this._centered;
    }

    /**
     * @param {boolean} value
     * @returns {void}
     */
    set centered(value) {
        this._centered = value;
        this._galleryOverlaysUi.setCentered({ element: this._viewer, centered: this._centered });
    }

    /**
     * @param {boolean} value
     */
    setBlackScreenMode(value) {
        if (value && (!this._blackScreen)) {
            this._blackScreen = this._galleryOverlaysUi.createBlackScreen({ parent: this._viewer });
        }
        if ((!value) && (this._blackScreen)) {
            this._galleryOverlaysUi.removeBlackScreen(this._blackScreen);
            this._blackScreen = null;
        }
        this.centered = value;
    }

    /**
     * @returns {boolean}
     */
    get blackScreenMode() {
        return this._blackScreenMode;
    }

    /**
     * @param {boolean} value
     */
    set blackScreenMode(value) {
        this._blackScreenMode = value;
        this.setBlackScreenMode(value);
    }

    /**
     * @return {boolean}
     */
    get slideshowMode() {
        return this._slideshowMode;
    }

    /**
     * @param {boolean} value
     */
    set slideshowMode(value) {
        this._slideshowMode = value;
        if (this._slideshowMode) {
            this.prepareNextSlide();
        }
    }

    /**
     * @return {boolean}
     */
    get preloadAllMode() {
        return this._preloadAllMode;
    }

    /**
     * @param {boolean} value
     */
    set preloadAllMode(value) {
        this._preloadAllMode = value;
        if (this._preloadAllMode) {
            this.preloadAll({ parent: this._mainElement });
        }
    }

    /**
     * @returns {boolean}
     */
    get shown() {
        return this._shown;
    }

    /**
     * @params {boolean} value
     */
    set shown(value) {
        this._shown = value;
        this._galleryOverlaysUi.setShown({ element: this._viewer, shown: this._shown })
    }

    /**
     * @returns {void}
     */
    showSlideshowSlide() {
        if (this.slideshowMode) {
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
    toggleSlideshow() {
        this.slideshowMode = !this.slideshowMode;
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
        this.setSlideshowSpeed(value, false);
    }

    /**
     * @param {number} value
     * @param {boolean} silent
     */
    setSlideshowSpeed(value, silent) {
        this._slideshowSpeed = value;
        if (!silent) {
            this.createTempMessage(`Speed : ${this._slideshowSpeed} ms`);
        }
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

        const currentId = this._current.id;
        const prevId = this._links[currentId].prevId;
        this._prev.update(prevId, this._links[prevId].href);

        this.removeBoxes();
        this.shown = true;
    }

    /**
     * @returns {void}
     */
    goNext() {
        this._slideshowDirNext = true;
        this._current.hide();
        [this._current, this._prev, this._next] = [this._next, this._current, this._prev];
        this._current.show();

        const currentId = this._current.id;
        const nextId = this._links[currentId].nextId;
        this._next.update(nextId, this._links[nextId].href);

        this.removeBoxes();
        this.shown = true;
    }

    /**
     * @param {number} id 
     */
    goNum(id) {
        const prevId = this._links[id].prevId;
        const nextId = this._links[id].nextId;

        this._current.update(id, this._links[id].href);
        this._prev.update(prevId, this._links[prevId].href);
        this._next.update(nextId, this._links[nextId].href);

        this.removeBoxes();
        this.shown = true;
    }

    /**
     * @returns {void}
     */
    removeBoxes() {
        this.removeInfoBox();
        this.removeAbout();
        this.removeHelp();
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
        this.setMaxSize(value, false);
    }

    /**
     * @param {boolean} value
     * @param {boolean} silent
     */
    setMaxSize(value, silent) {
        this._maxSize = value;
        this._galleryOverlaysUi.setMaxSize({ element: this._viewer, maxSize: this._maxSize });
    }

    /**
     * @returns {void}
     */
    toggleMaxSize() {
        this.maxSize = !this.maxSize;
    }

    /**
     * @returns {void}
     */
    toggleAutoX() {
        this.autoX = !this.autoX;
    }

    /**
     * @returns {void}
     */
    toggleAutoY() {
        this.autoY = !this.autoY;
    }

    /**
     * @returns {void}
     */
    toggleAutoXY() {
        if (this.autoX || this.autoY) {
            this.autoX = false;
            this.autoY = false;
        } else {
            this.autoX = true;
            this.autoY = true;
        }
    }

    /**
     * @returns {boolean}
     */
    isCurrent(href) {
        return this._current.imageSource === href;
    }

    /**
     * @returns {void}
     */
    removeInfoBox() {
        if (this._infoBox) {
            this._galleryOverlaysUi.removeInfoBox(this._infoBox);
            this._infoBox = null;
        }
    }

    /**
     * @returns {void}
     */
    toggleInfoBox() {
        if (this._infoBox) {
            this.removeInfoBox();
        } else {
            this._infoBox = this._galleryOverlaysUi.createInfoBox({
                hrefs: Object.values(this._links).map((link) => link.href),
                isCurrent: (href) => this.isCurrent(href),
                parent: this._mainElement,
            });
        }
    }

    /**
     * @returns {void}
     */
    toggle() {
        this.shown = !this.shown;
    }

    /**
     * @returns {void}
     */
    togglePosition() {
        this.relative = !this.relative;
    }

    /**
     * @param {boolean} value
     * @returns {void}
     */
    set relative(value) {
        this._relative = value;
        this._galleryOverlaysUi.setRelative({ element: this._viewer, relative: this._relative });
    }

    /**
     * @returns {boolean}
     */
    get relative() {
        return this._relative;
    }

    /**
     * @returns {void}
     */
    toggleBlackScreen() {
        this.blackScreenMode = !this.blackScreenMode;
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
        this._preloadGaugeInfo = this._galleryOverlaysUi.showPreloadGauge({
            parent: this._mainElement,
            onComplete: () => this.hidePreloadGauge(),
            preloadGaugeInfo: this._preloadGaugeInfo
        });
        this.updatePreloadGauge();
    }

    /**
     * @returns {void}
     */
    hidePreloadGauge() {
        this._galleryOverlaysUi.hidePreloadGauge({ preloadGaugeInfo: this._preloadGaugeInfo });
        this._preloadGaugeInfo = null;
    }

    /**
     * @returns {void}
     */
    updatePreloadGauge() {
        this._galleryOverlaysUi.updatePreloadGauge({
            loaded: this._loaded,
            total: this._totalToLoad,
            preloadGaugeInfo: this._preloadGaugeInfo
        });
    }

    /**
     * @param {Object} obj
     * @param {HTMLElement} obj.parent
     * @returns {void}
     */
    preloadAll({ parent }) {
        const hrefs = Object.values(this._links).map((link) => link.href);
        this._loaded = 0;
        this._totalToLoad = hrefs.length;
        const onImageLoaded = () => {
            this._loaded += 1;
            this.updatePreloadGauge();
        };
        this._galleryOverlaysUi.ensurePreloadAll({ hrefs, onImageLoaded, parent });

        if (!this._preloadGaugeInfo) {
            this.showPreloadGauge();
        }
    }

    /**
     * @returns {void}
     */
    about() {
        if (this._aboutInfoBox) {
            this.removeAbout();
        } else {
            this._aboutInfoBox = this._galleryOverlaysUi.createAboutInfoBox({
                parent: this._mainElement,
                onClick: () => {
                    this.removeAbout();
                },
                version,
            })
        }
    }

    /**
     * @returns {void}
     */
    removeAbout() {
        if (this._aboutInfoBox != null) {
            this._galleryOverlaysUi.removeAboutInfoBox(this._aboutInfoBox);
            this._aboutInfoBox = null;
        }
    }

    /**
     * @returns {void}
     */
    help() {
        if (this._helpInfoTip) {
            this.removeHelp();
        } else {
            /** @type {{keyName: string, methodName: string}[]} */
            const bindings = [];
            /** @type {{comment: string, config: string, effective: string}[]} */
            const configurations = [];

            Object.keys(this._vk.globalBindings).forEach(/** @param {number} key*/(key) => {
                const value = this._vk.globalBindings[key];
                const bindableMethods = this.getBindableMethods();
                if (value && value.target === this) {
                    const { methodName } = value;
                    bindings.push({
                        keyName: this._vk.getName(key),
                        methodName: methodName in bindableMethods ? bindableMethods[methodName] : methodName
                    });
                }
            })
            Object.keys(this._configurables).forEach((attr) => {
                const comment = this._configurables[attr].label;
                const configured = this._config['QILV.' + attr] || undefined;
                const defaultValue = this._configurables[attr].default;
                const effective = this[attr];

                configurations.push({ comment, configured, effective, defaultValue });
            });

            this._helpInfoTip = this._galleryOverlaysUi.createHelpInfoTip({
                parent: this._mainElement,
                bindings,
                configurations,
                version,
            })
        }
    }

    /**
     * @returns {void}
     */
    removeHelp() {
        if (this._helpInfoTip) {
            this._galleryOverlaysUi.removeHelpInfoTip(this._helpInfoTip)
            this._helpInfoTip = null;
        }
    }

    /**
     * @returns {void}
     */
    init() {
        this._mainElement = this._galleryOverlaysUi.createMainElement();
        this._viewer = this._galleryOverlaysUi.createViewer({ parent: this._mainElement });
        this._galleryOverlaysUi.installCss();

        this._prev = this._imageOverlayFactory.createImageOverylay(this._viewer);
        this._current = this._imageOverlayFactory.createImageOverylay(this._viewer);
        this._next = this._imageOverlayFactory.createImageOverylay(this._viewer);

        /**
         * @type {Object.<string, {id: string, prevId: number, nextId: number, href: string}>}
         */
        this._links = {};

        this.reload();
        
        this._vk.auto_bind(this);

        Object.keys(this._configurables).forEach((keyName) => {
            // let comment = this._configurables[keyName].label;
            let value = this._config["QILV." + keyName] || this._configurables[keyName].default;
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

        this.preloadAllMode = this._preloadAllMode;
        this.relative = this._relative;
        this.autoX = this._autoX;
        this.autoY = this._autoY;
        this.setMaxSize(this._maxSize, true);
        this.centered = this._centered;
        this.blackScreenMode = this._blackScreenMode;
        this.transitionTime = this._transitionTime;
        this.slideshowMode = this._slideshowMode;
        this.setSlideshowSpeed(this._slideshowSpeed, true);
        this.shown = this._shown;
    }

    /**
     * @returns {void}
     */
    reload() {
        let previousHref = null;

        Object.values(this._links).forEach(({ id, prevId, nextId, href, element }) => { 
            this._galleryOverlaysUi.cleanImageRef({ element, id });
        });

        this._links = {};

        const linkList = this._galleryOverlaysUi.getLinkRefs().filter((linkRef) => {
            const { href, element } = linkRef;
            let ok = false;
            if (href) {
                [".png", ".gif", ".jpg", ".jpeg"].map((extension) => {
                    if (href.indexOf("?") === -1) {
                        if (href.substring(href.length - extension.length).toLowerCase() === extension) {
                            if (href !== previousHref) {
                                ok = true;
                            }
                        }
                    }
                });
            }
            if (element && element.parentElement) {
                if (element.parentElement.classList.contains('qilvgallery_image_outter')) {
                    ok = false;
                }
            }
            if (ok) {
                previousHref = href;
            }
            return ok;
        })

        linkList.forEach(({ element, href }, index) => {
            const id = `${index}`;
            this._galleryOverlaysUi.setImageRef({ element, id });

            const prevId = index === 0 ? linkList.length - 1 : index - 1;
            const nextId = index === linkList.length - 1 ? 0 : index + 1;

            this._links[id] = { id, prevId, nextId, href, element };
        });

        if (linkList.length == 0) {
            this._galleryOverlaysUi.createTempMessage('No links to image found in this page !', document.body);
            this.slideshowMode = false;
            this.blackScreenMode = false;
            return;
        } else {
            this.goNum(0);            
        }
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
