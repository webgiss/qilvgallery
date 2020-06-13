import DomAccess from './DomAccess';

export default class ConfigurationUi {
    /**
     * @param {Object} obj
     * @param {DomAccess} obj.domAccess
     * @param {HTMLElement} obj.rootNode
     */
    constructor({ domAccess, rootNode }) {
        this._domAccess = domAccess;
        this._rootNode = rootNode;
    }

    /**
     * @returns {HTMLElement}
     */
    createInfoPanel() {
        return this._domAccess.createElement('div', {
            classNames: ['infoPanel'],
            parent: this._rootNode,
            html: '<p>Set your configuration below and drop the "Gallery" link into your toolbar to install bookmarklet.<br/>Use this bookmarklet on pages containing links to image to generate a gallery slideshow.</p>',
        });
    }

    /**
     * @returns {HTMLElement}
     */
    createBookmarkletLink() {
        return this._domAccess.createElement('a', {
            parent: this._rootNode,
            className: 'link',
            text: 'Gallery',
            attr: {
                href: '#',
            },
        });
    }

    /**
     * @returns {HTMLElement}
     */
    createNamePanel({ onValueChanged, name }) {
        return this._domAccess.createElement('div', {
            parent: this._rootNode,
            classNames: ['namePanel', 'configPanel'],
            content: [
                this._domAccess.createElement('input', {
                    className: 'nameInput',
                    attr: {
                        value: name,
                    },
                    onInput: onValueChanged,
                }),
            ],
        });
    }

    /**
     * @param {Object} obj
     * @param {()=>{}} obj.onNewKey
     * @param {string[]} obj.keys
     * @param {Object<string, string>} obj.actions
     * @param {string[][]} obj.config
     * @param {(index: number, key: string, action: string)=>{}} obj.onChange
     * @returns {Object}
     */
    createKeyboardPanel({ onNewKey, keys, actions, config, onChange }) {
        const keyList = [['', '-- select a key --'], ...keys.map((key) => [key, key])];
        const actionList = [['', '-- no action --'], ...Object.keys(actions).map((action) => [action, actions[action]])];

        const elements = [];

        const keyboardPanel = this._domAccess.createElement('div', {
            parent: this._rootNode,
            classNames: ['keyboardPanel', 'configPanel'],
        });

        const keysPanel = this._domAccess.createElement('div', {
            parent: keyboardPanel,
            className: 'keysPanel',
        });

        const keysTable = this._domAccess.createElement('table', {
            parent: keysPanel,
            className: 'keysTable',
        });

        const keyboardPanelInfo = {
            keyboardPanel,
            onChange,
            keyList,
            actionList,
            elements,
            keysTable,
        };

        config.forEach((configItem, index) => {
            const [key, action] = configItem;

            this.addNewKeyConfig({ keyboardPanelInfo, key, action, index });
        });

        this._domAccess.createElement('div', {
            parent: keyboardPanel,
            classNames: ['plusKeyPanel',],
            content: [
                this._domAccess.createElement('button', {
                    className: 'plusButton',
                    text: '+',
                    onClick: onNewKey,
                    attr: {
                        type: 'submit',
                    }
                }),
            ]
        });

        return keyboardPanelInfo;
    }

    addNewKeyConfig({ keyboardPanelInfo, key, action, index }) {
        const { elements, keyList, actionList, keysTable, onChange } = keyboardPanelInfo;

        key = key || '';
        action = action || '';
        index = index === undefined ? elements.length : index;

        const keyCombo = this._domAccess.createElement('select', {
            className: 'keyCombo',
            onChange: () => onChange(index, elements[index][0].value, elements[index][1].value),
            content: keyList.map(([keyValue, keyName]) => this._domAccess.createElement('option', { attr: { value: keyValue }, text: keyName })),
        });
        const actionCombo = this._domAccess.createElement('select', {
            className: 'actionCombo',
            onChange: () => onChange(index, elements[index][0].value, elements[index][1].value),
            content: actionList.map(([actionValue, actionName]) => this._domAccess.createElement('option', { attr: { value: actionValue }, text: actionName })),
        });

        keyCombo.value = key;
        actionCombo.value = action;

        elements.push([keyCombo, actionCombo]);

        this._domAccess.createElement('tr', {
            parent: keysTable,
            content: [
                this._domAccess.createElement('td', {
                    className: 'key',
                    content: [keyCombo],
                }),
                this._domAccess.createElement('td', {
                    className: 'action',
                    content: [actionCombo],
                }),
            ],
        });
    }

    /**
     * @param {Object} keyboardPanelInfo 
     * @returns {string[][]}
     */
    getKeyboardConguration({ keyboardPanelInfo }) {
        const { elements } = keyboardPanelInfo;
        return elements.map(([keyCombo, actionCombo]) => [keyCombo.value, actionCombo.value]);
    }

    /**
     * @param {Object<string, string>} obj.properties
     * @param {string[][]} obj.config
     * @param {(index: number, key: string, action: string)=>{}} obj.onChange
     * @returns {Object}
     */
    createValuePanel({ properties, config, onChange }) {
        const actionList = Object.keys(properties).map((action) => [action, properties[action]]);

        const elements = [];

        /**
         * @type HTMLElement
         */
        let valuesTable = null;

        const valuePanel = this._domAccess.createElement('div', {
            parent: this._rootNode,
            classNames: ['valuePanel', 'configPanel'],
            content: [
                this._domAccess.createElement('div', {
                    className: 'valuesPanel',
                    content: [
                        this._domAccess.createElement('table', {
                            className: 'valuesTable',
                            onInstance: (instance) => valuesTable = instance,
                        })
                    ],
                })
            ],
        });

        const valuePanelInfo = {
            valuePanel,
            onChange,
            actionList,
            elements,
        };

        config.forEach(([propName, value]) => {
            propName = propName || '';
            value = value || '';

            const propInput = this._domAccess.createElement('input', {
                className: 'propInput',
                attr: {
                    value: properties[propName],
                },
            });
            const valueInput = this._domAccess.createElement('input', {
                className: 'valueInput',
                onInput: () => onChange(propName, valueInput.value),
                attr: {
                    value,
                },
            });

            elements.push([propName, valueInput]);

            this._domAccess.createElement('tr', {
                parent: valuesTable,
                content: [
                    this._domAccess.createElement('td', {
                        className: 'prop',
                        content: [propInput],
                    }),
                    this._domAccess.createElement('td', {
                        className: 'value',
                        content: [valueInput],
                    }),
                ],
            });
        });

        return valuePanelInfo;
    }

    /**
     * @param {Object} valuePanelInfo
     * @returns {string[][]}
     */
    getValueConguration({ valuePanelInfo }) {
        const { elements } = valuePanelInfo;
        return elements.map(([propName, valueInput]) => [propName, valueInput.value]);
    }


    /**
     * @param {HTMLElement} linkElement The DOM link element to update
     * @param {string} label The name of the link
     * @param {string} href The value to use to update the link
     */
    updateLink(linkElement, label, href) {
        linkElement.textContent = label;
        linkElement.href = href;
    }

    /**
     * @returns {void}
     */
    installCss() {
        this._domAccess
            .startFluentCss({ important: true })

            .section()
            .match('.valuePanel')
            .match('.keyPanel')
            .property('width', '100%')
            .endSection()

            .section()
            .match('td.key')
            .match('td.action')
            .match('td.prop')
            .match('td.value')
            .property('width', '50%')
            .endSection()

            .section()
            .match('.nameInput')
            .match('.keyCombo')
            .match('.actionCombo')
            .match('.propInput')
            .match('.valueInput')
            .property('width', '100%')
            .property('height', '2em')
            .endSection()

            .section()
            .match('.valuesTable')
            .match('.keysTable')
            .property('width', '100%')
            .endSection()

            .section()
            .match('.namePanel')
            .match('.infoPanel')
            .match('.configPanel')
            .match('.link')
            .property('display', 'block')
            .property('width', 'auto')
            .property('margin-left', '100px')
            .property('margin-right', '100px')
            .property('display', 'block')
            .property('text-align', 'center')
            .property('font-family', '"Georgia"')
            .property('padding', '5px 20px')
            .property('border-radius', '10px')
            .property('text-decoration', 'none')
            .endSection()

            .section()
            .match('.infoPanel')
            .property('background-color', '#ffffff')
            .property('border', '2px #c3d9ff solid')
            .property('padding', '10px')
            .endSection()

            .section()
            .match('.configPanel')
            .property('background-color', '#c3d9ff')
            .property('border', '#c3d9ff')
            .property('padding', '10px')
            .endSection()

            .section()
            .match('.link')
            .property('background-color', '#c3d9ff')
            .property('border', '2px #0000cc solid')
            .endSection()

            .section()
            .match('a:visited')
            .match('a:active')
            .match('a:link')
            .match('a')
            .property('text-decoration', 'none')
            .property('color', '#0000cc')
            .endSection()

            .section()
            .match('.infoPanel')
            .match('.configPanel')
            .property('margin-bottom', '10px')
            .property('margin-top', '10px')
            .endSection()

            .section()
            .match('.plusKeyPanel')
            .property('margin-top', '10px')
            .endSection()

            .endCss()
            ;
        return;
        this._domAccess.installCss(`


        .valuePanel,
        .keyPanel {
            width:100%;
        }

        td.key,
        td.action,
        td.prop,
        td.value {
            width: 50%;
        }

        .nameInput,
        .keyCombo,
        .actionCombo,
        .propInput,
        .valueInput {
            width: 100%;
            height: 2em;
        }

        .valuesTable,
        .keysTable {
            width: 100%;
        }

        .namePanel,
        .infoPanel,
        .configPanel,
        .link {
            display: block;
            width: auto;
            margin-left: 100px;
            margin-right: 100px;
            display : block;
            text-align : center;
            font-family : 'Georgia';
            padding: 5px 20px;
            border-radius : 10px;
            text-decoration : none;
        }

        .infoPanel{
            background-color: #ffffff;
            border: 2px #c3d9ff solid;
            padding: 10px;
        }

        .configPanel{
            background-color: #c3d9ff;
            border: 0px #c3d9ff solid;
            padding: 10px;
        }

        .link {
            background-color: #c3d9ff;
            border: 2px #0000cc solid;
        }

        a:visited, 
        a:active, 
        a:link,
        a
        {
            text-decoration : none;
            color: #0000cc;
        }

        .infoPanel,
        .configPanel {
            margin-bottom: 10px;
            margin-top: 10px;
        }
        
        .plusKeyPanel {
            margin-top: 10px;
        }
        
        `);
    }

}
