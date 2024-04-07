import CssFluent from './css/CssFluent';
import { ICssFluent } from './css/ICss';

/**
 * @class Access to the DOM
 */
export default class DomAccess {
    /**
     * @param {HTMLElement} element 
     * @param {string} name 
     * @param {string} value 
     */
    setCssProperty(element, name, value) {
        if (element) {
            element.style[name] = value;
        }

    }

    /**
     * @param {HTMLElement} element 
     * @param {Object.<string, string>} properties
     */
    setCssProperties(element, properties) {
        const self = this;
        if (element) {
            Object.keys(properties).forEach((property) => {
                self.setCssProperty(element, property, properties[property]);
            })
        }
    }

    /**
     * Install a css content
     * @param {string} cssText 
     */
    installCss(cssText) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = cssText;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    /**
     * @param {Object} obj
     * @param {boolean} obj.important
     * @param {boolean} obj.format
     * @returns {CssFluent}
     */
    startFluentCss({ important, format }) {
        /**
         * @param {ICssFluent} cssFluent
         */
        const self = this;
        const onEnd = (cssFluent) => {
            const css = cssFluent.asCss({ important, format });
            self.installCss(css)
        };
        return new CssFluent({ onEnd });
    }

    /**
     * @param {HTMLElement} element
     * @param {string} content
     */
    setHtmlContent(element, content) {
        element.innerHTML = content;
    }

    /**
     * @param {HTMLElement} element
     * @param {string} content
     */
    setTextContent(element, content) {
        element.innerText = content;
    }

    /**
     * 
     * @param {string} name 
     * @param {Object} features 
     * @param {HTMLElement} features.parent
     * @param {string} features.id
     * @param {string} features.html
     * @param {string} features.text
     * @param {Object<string, string>} features.style
     * @param {string} features.className
     * @param {string[]} features.classNames
     * @param {HTMLElement[]} features.content
     * @param {()=>{}} features.onClick
     * @param {(value: string)=>{}} features.onChange
     * @param {(value: string)=>{}} features.onInput
     * @param {()=>{}} features.onLoad
     * @param {(value: HTMLElement)=>{}} features.onInstance
     */
    createElement(name, features) {
        const element = document.createElement(name);
        const self = this;

        if (features) {
            Object.keys(features).forEach((feature) => {
                switch (feature) {
                    case 'attr': {
                        const props = features.attr;
                        Object.keys(props).forEach((key) => {
                            element[key] = props[key];
                        });
                    }
                        break;
                    case 'style': {
                        self.setCssProperties(element, features.style);
                    }
                        break;
                    case 'id': {
                        element.id = features.id;
                    }
                        break;
                    case 'className': {
                        element.classList.add(features.className);
                    }
                        break;
                    case 'classNames': {
                        element.classList.add(...features.classNames);
                    }
                        break;
                    case 'parent': {
                        const parent = features.parent;
                        if (parent) {
                            parent.appendChild(element);
                        }
                    }
                        break;
                    case 'html': {
                        self.setHtmlContent(element, features.html);
                    }
                        break;
                    case 'text': {
                        self.setTextContent(element, features.text);
                    }
                        break;
                    case 'onClick': {
                        element.addEventListener('click', features.onClick);
                    }
                        break;
                    case 'onChange': {
                        element.addEventListener('change', (e) => features.onChange(e.target.value));
                    }
                        break;
                    case 'onInput': {
                        element.addEventListener('input', (e) => features.onInput(e.target.value));
                    }
                        break;
                    case 'onLoad': {
                        element.addEventListener('load', () => features.onLoad());
                    }
                        break;
                    case 'content': {
                        const addContent = (content) => {
                            content.forEach((subElement) => {
                                if (subElement instanceof HTMLElement) {
                                    element.appendChild(subElement);
                                } else if (typeof (subElement) === typeof ('')) {
                                    element.appendChild(document.createTextNode(subElement));
                                } else if (typeof (subElement) === typeof ([])) {
                                    addContent(subElement);
                                }
                            });
                        };
                        addContent(features.content);
                    }
                        break;
                    case 'onInstance': {
                        const onInstance = features.onInstance;
                        onInstance(element);
                    }
                        break;
                }
            });
        }
        return element;
    }

    /**
     * Remove an element
     * @param {HTMLElement} element
     */
    remove(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    /**
     * 
     * @param {string} className 
     * @returns {HTMLElement[]}
     */
    getElementsByClassName(className) {
        return [...document.getElementsByClassName(className)];
    }

    /**
     * 
     * @param {string} tagName
     * @returns {HTMLElement[]}
     */
    getElementsByTagName(tagName) {
        return [...document.getElementsByTagName(tagName)];
    }

    /**
     * 
     * @param {HTMLElement} element 
     * @param {string} className 
     * @returns {void}
     */
    addClass(element, className) {
        if (element) {
            element.classList.add(className);
        }
    }

    /**
     * 
     * @param {HTMLElement} element 
     * @param {string} className 
     * @returns {void}
     */
    removeClass(element, className) {
        if (element) {
            element.classList.remove(className);
        }
    }

    /**
     * 
     * @param {HTMLElement} element
     * @param {string} className
     * @param {boolean} isPresent : true if the className should be present
     * @returns {void}
     */
    setClass(element, className, isPresent) {
        if (element) {
            if (isPresent) {
                element.classList.add(className);
            } else {
                element.classList.remove(className);
            }

        }
    }

    /**
     * 
     * @param {HTMLElement} element 
     * @param {string} className 
     * @returns {void}
     */
    removeClassStartingWith(element, classNamePrefix) {
        if (element) {
            [...element.classList].filter((className) => className.startsWith(classNamePrefix)).forEach((className) => {
                element.classList.remove(className);
            });
        }
    }


}

