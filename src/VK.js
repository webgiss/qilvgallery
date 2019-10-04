import IBindable from './IBindable';

/**
 * @typedef {Object} KeyBinding
 * @property {IBindable} target
 * @property {string} methodName
 */

/**
 * @class
 */
export default class VK {
    /**
     * @param {Object} obj
     * @param {Object.<string, string>} obj.config
     */
    constructor({ config }) {
        this._config = config;
        const keys = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            SHIFT: 16,
            CONTROL: 17,
            CAPS_LOCK: 20,
            ESCAPE: 27,
            SPACE: 32,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            INSERT: 45,
            DELETE: 46,
            A: 65,
            B: 66,
            C: 67,
            D: 68,
            E: 69,
            F: 70,
            G: 71,
            H: 72,
            I: 73,
            J: 74,
            K: 75,
            L: 76,
            M: 77,
            N: 78,
            O: 79,
            P: 80,
            Q: 81,
            R: 82,
            S: 83,
            T: 84,
            U: 85,
            V: 86,
            W: 87,
            X: 88,
            Y: 89,
            Z: 90,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_ADD: 107,
            NUMPAD_ENTER: 108,
            NUMPAD_SUBSTRACT: 109,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            COMMA: 188,
            PERIOD: 190,
        };
        /**
         * @type {Object.<string, number>}
         */
        this._keyValuesByName = keys;
        /**
         * @type {Object.<number, KeyBinding>}
         */
        this.globalBindings = {};
        this.handle_key_elements = [];
        /**
         * @type {Object<number, string>}
         */
        this._reverseKeysByNumber = {};
        /**
         * @type {Array<string>}
         */
        this.keys = [];
        /**
         * @type {Array<number>}
         */
        this.values = [];
        Object.keys(keys).forEach((key) => {
            const value = this._keyValuesByName[key];
            this._reverseKeysByNumber[value] = key;
            this.keys.push(key);
            this.values.push(value);
        });
    }

    /**
     * @param {number} value
     * @returns {string}
     */
    getName(value) {
        if (this._reverseKeysByNumber[value] != null) {
            return this._reverseKeysByNumber[value];
        }
        return `${value}`;
    }

    /**
     * @param {string} name 
     * @returns {number}
     */
    getValue(name) {
        name = name.toUpperCase();
        return this._keyValuesByName[name];
    }

    /**
     * @param {KeyboardEvent} e
     */
    handle_key(e) {
        if (e.ctrlKey || e.shiftKey || e.altKey) {
            return;
        }
        if (this.globalBindings[e.which] != null) {
            let { target, methodName } = this.globalBindings[e.which];
            target[methodName]({
                "event": e,
                "method_name": methodName
            });
            e.preventDefault();
            e.stopPropagation();
        }
    }

    /**
     * @param {IBindable} target
     * @param {HTMLElement} element
     */
    auto_bind(target, element) {
        if (element == null) {
            element = document;
        }
        let bindableMethods = target.getBindableMethods();
        let keyBindings = target.getKeyBindings();
        // console.log('auto_bind', { target, getBindableMethods: target.getBindableMethods, getKeyBindings: target.getKeyBindings, keyBindings, bindableMethods });
        if (bindableMethods == null) {
            bindableMethods = {};
        }
        /**
         * @type {Array<number>}
         */
        const bindingToDelete = [];
        Object.keys(this.globalBindings).forEach(/** @param {number} keyValue*/(keyValue) => {
            let keyBinding = this.globalBindings[keyValue];
            if (keyBinding.target === target) {
                bindingToDelete.push(keyValue);
            }
        });
        bindingToDelete.forEach((keyValue) => {
            delete this.globalBindings[keyValue];
        })
        Object.keys(keyBindings).forEach((keyName) => {
            let methodName = keyBindings[keyName];
            this.globalBindings[this.getValue(keyName)] = { target, methodName };
            if (Object.keys(bindableMethods).indexOf(methodName) == -1) {
                bindableMethods[methodName] = "??? (" + methodName + ")";
            }
        });
        this.keys.forEach((keyName) => {
            let methodName = this._config["VK." + keyName];
            if (methodName != null) {
                /** @type {string} */
                let prefix = target.__name__;
                prefix = prefix ? prefix + "." : "";
                if (methodName.substring(0, prefix.length) === prefix) {
                    methodName = methodName.substring(prefix.length);
                    if (methodName === "") {
                        delete this.globalBindings[this.getValue(keyName)];
                    } else {
                        this.globalBindings[this.getValue(keyName)] = { target, methodName };
                    }
                }
            }
        });
        if (this.handle_key_elements.indexOf(element) < 0) {
            this.handle_key_elements.push(element);
            element.addEventListener('keydown', (event) => this.handle_key(event));
        }
    }
}
