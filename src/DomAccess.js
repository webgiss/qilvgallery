/**
 * @class
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
        if (element) {
            Object.keys(properties).forEach((property) => {
                this.setCssProperty(element, property, properties[property]);
            })
        }
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
     * @param {Object} props 
     * @param {Object} features 
     * @param {HTMLElement} features.parent
     * @param {string} features.html
     * @param {string} features.text
     * @param {Object<string, string>} features.style
     * @param {string[]} features.classNames
     */
    createElement(name, props, features) {
        const element = document.createElement(name);

        if (props) {
            Object.keys(props).forEach((key) => {
                element[key] = props[key];
            });
        }

        if (features) {
            Object.keys(features).forEach((feature) => {
                switch (feature) {
                    case 'style': {
                        const style = features.style;
                        this.setCssProperties(element, style);
                    }
                    break;
                    case 'classNames': {
                        const classNames = features.classNames;
                        element.classList.add(...classNames);
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
                        this.setHtmlContent(element, features.html);
                    }
                    break;
                    case 'text': {
                        this.setTextContent(element, features.text);
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

