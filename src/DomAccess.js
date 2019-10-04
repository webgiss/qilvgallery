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
        // console.log('setStyle', {element, name, value});
        if (element) {
            element.style[name] = value;
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
}
