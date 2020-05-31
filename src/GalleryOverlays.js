import ImageOverlayFactory from './ImageOverlayFactory';
import ImageOverlay from './ImageOverlay';
import VK from './VK';
import GalleryOverlaysUi from './GalleryOverlaysUi';

/**
 * @class
 * @implements {IBindable}
 */
export default class GalleryOverlays {
    /**
     * @param {Object} obj
     * @param {ImageOverlayFactory} obj.imageOverlayFactory
     * @param {GalleryOverlaysUi} obj.galleryOverlaysUi
     * @param {VK} obj.vk
     * @param {Object.<string, string>} obj.config
     */
    constructor({ imageOverlayFactory, galleryOverlaysUi, vk, config }) {
        this._imageOverlayFactory = imageOverlayFactory;
        this._galleryOverlaysUi = galleryOverlaysUi
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
        return ['prev', 'next', 'current'].map((element) => this['_' + element]);
    }

    /**
     * @param {number} transitionTime
     * @param {boolean} silent
     */
    setTransitionTime(transitionTime, silent) {
        this._transitionTime = transitionTime;
        this.ImageOverlays.forEach((element) => element.setTransitionTime(transitionTime));

        if (!silent) {
            this._galleryOverlaysUi.createTempMessage(`Transition's effect's time : ${transitionTime} ms`, this._mainElement);
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
        if (shouldBlackScreen && (!this._blackScreen)) {
            this._blackScreen = this._galleryOverlaysUi.createBlackScreen({parent: this._mainElement});
        }
        if ((!shouldBlackScreen) && (this._blackScreen)) {
            this._galleryOverlaysUi.removeBlackScreen(this._blackScreen);
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
        this._galleryOverlaysUi.createTempMessage(`Speed : ${this._slideshowSpeed} ms`, this._mainElement);
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

        const currentId = this._current.id;
        const nextId = this._links[currentId].nextId;
        this._next.update(nextId, this._links[nextId].href);

        this.removeInfoBox();
        this.setBlackScreen(this._blackScreenMode);
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
        this._galleryOverlaysUi.createTempMessage(this._maxSize ? 'Max size : 100%' : 'No max size', this._mainElement);
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
        if (this._current.isOn) {
            if (this._blackScreen) {
                this._galleryOverlaysUi.removeBlackScreen(this._blackScreen);
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
        this._galleryOverlaysUi.showPreloadGauge({ parent: this._mainElement });
        this.updatePreloadGauge();
    }

    /**
     * @returns {void}
     */
    hidePreloadGauge() {
        this._galleryOverlaysUi.hidePreloadGauge();
    }

    /**
     * @returns {void}
     */
    updatePreloadGauge() {
        this._galleryOverlaysUi.updatePreloadGauge({ loaded: this._loaded, total: this._totalToLoad });
    }

    /**
     * @returns {void}
     */
    preloadAll() {
        const hrefs = Object.values(this._links).map((link)=>link.href);
        this._loaded = 0;
        this._totalToLoad = hrefs.length;
        const onImageLoaded = () => {
            this._loaded += 1;
            this.updatePreloadGauge();
        };
        this._galleryOverlaysUi.ensurePreloadAll({ hrefs, onImageLoaded });

        if (! this._galleryOverlaysUi.hasPreloadGauge) {
            // this.hidePreloadGauge();
            // } else {
            this.showPreloadGauge();
        }
    }

    /**
     * @returns {void}
     */
    about() {
        if (this._aboutInfoTip) {
            if (this._aboutInfoBox != null) {
                this._galleryOverlaysUi.removeAboutInfoBox(this._aboutInfoBox);
                this._aboutInfoBox = null;
            }
        } else {
            this._aboutInfoBox = this._galleryOverlaysUi.createAboutInfoBox({
                parent: this._mainElement,
                onClick: () => {
                    if (this._aboutInfoBox != null) {
                        this._galleryOverlaysUi.removeAboutInfoBox(this._aboutInfoBox);
                        this._aboutInfoBox = null;
                    }
                }
            })
        }
    }

    /**
     * @returns {void}
     */
    help() {
        if (this._helpInfoTip) {
            this._galleryOverlaysUi.removeHelpInfoTip(this._helpInfoTip)
            this._helpInfoTip = null;
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
                        methodName:methodName in bindableMethods ? bindableMethods[methodName] : methodName 
                    });
                }
            })
            Object.keys(this._configurables).forEach((attr) => {
                const comment = this._configurables[attr];
                const config = this._config['QILV.' + attr] || "default";
                const effective = this[attr];

                configurations.push({comment, config, effective});
            });

            this._helpInfoTip = this._galleryOverlaysUi.createHelpInfoTip({
                parent: this._mainElement,
                bindings ,
                configurations ,
            })
        }
    }

    /**
     * @returns {void}
     */
    init() {
        this._mainElement = this._galleryOverlaysUi.createMainElement();
        this._galleryOverlaysUi.installCss();

        this._prev = this._imageOverlayFactory.createImageOverylay(this._mainElement);
        this._current = this._imageOverlayFactory.createImageOverylay(this._mainElement);
        this._next = this._imageOverlayFactory.createImageOverylay(this._mainElement);
        
        let previousHref = null;

        const linkList = this._galleryOverlaysUi.getLinkRefs().filter((linkRef) => {
            const {element, href} = linkRef;
            let ok = false;
            if (href) {
                [".png", ".gif", ".jpg", ".jpeg"].map((extension) => {
                    if (href.indexOf("?") === -1) {
                        if (href.substr(href.length - extension.length, extension.length).toLowerCase() === extension) {
                            if (href !== previousHref) {
                                ok = true;
                            }
                        }
                    }
                });
            }
            if (ok) {
                previousHref = href;
            }
            return ok;
        })

        /**
         * @type {Object.<string, {id: string, prevId: number, nextId: number, href: string}>}
         */
        this._links = {};

        linkList.forEach(({ element, href }, index) => {
            const id = `${index}`;
            this._galleryOverlaysUi.setImageRef({ element, id });

            const prevId = index === 0 ? linkList.length - 1 : index - 1;
            const nextId = index === linkList.length - 1 ? 0 : index + 1;

            this._links[id] = { id, prevId, nextId, href };
        });

        if (linkList.length == 0) {
            this._galleryOverlaysUi.createTempMessage('No links to image found in this page !', document.body);
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
