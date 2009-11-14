(function(){
    var window = this,
    undefined,
    $ = window.jQuery,
    _VK = window.VK,
    VK = window.VK = {
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
        
        A:65,
        B:66,
        C:67,
        D:68,
        E:69,
        F:70,
        G:71,
        H:72,
        I:73,
        J:74,
        K:75,
        L:76,
        M:77,
        N:78,
        O:79,
        P:80,
        Q:81,
        R:82,
        S:83,
        T:84,
        U:85,
        V:86,
        W:87,
        X:88,
        Y:89,
        Z:90,

        NUMPAD_MULTIPLY: 106, 
        NUMPAD_ADD: 107, 
        NUMPAD_ENTER: 108, 
        NUMPAD_SUBSTRACT: 109, 
        NUMPAD_DECIMAL: 110, 
        NUMPAD_DIVIDE: 111, 
        COMMA: 188, 
        PERIOD: 190,
        init : function() {
            var self = this;
            self.reverse={};
            self.keys = []
            self.values = []
            $.each(self, function(key,value) {
                if ( !(isNaN(parseInt(value))) && (key.toUpperCase()===key))
                {
                    self.reverse[value] = key;
                    self.keys.push(key);
                    self.values.push(value);
                }
            });
            return self;
        },
        noConflict: function(){
            window.VK = _VK;
            return this;
        },
        getName : function(value) {
            if (this.reverse[value]!=undefined)
            {
                return this.reverse[value];
            }
            return value+"";
        },
        getValue : function(name) {
            name = name.toUpperCase();
            return this[name];
        },
        global_bindings : {
        },
        handle_key : function(e) {
            if (this.global_bindings[e.which] != undefined) {
                var target = this.global_bindings[e.which][0];
                var method_name = this.global_bindings[e.which][1];
                var result = target[method_name]({
                    "event" : e,
                    "method_name" : method_name
                });
                // if (result == true) {
                e.preventDefault();
                //}
            }
        },
        handle_key_elements : [],
        auto_bind : function(target, element) {
            var self = this;
            if (element == undefined) {
                element = document;
            }
            element = $(element);

            if (target.bindables == undefined) {
                target.bindables = [];
            }
                        
            var binding_to_delete = [];
            $.each(self.global_bindings,function(keyvalue,targetmethod) {
                if (targetmethod[0] == target) {
                    binding_to_delete.push(keyvalue);
                }
            });
            $.each(binding_to_delete,function(index,keyvalue) {
                delete self.global_bindings[keyvalue];
            });
            $.each(target.key_bindings,function(keyname,methodname) {
                self.global_bindings[self.getValue(keyname)] = [target,methodname];
                if (!(methodname in target.bindables)) {
                    target.bindables.push(methodname);
                }
            });
            $.each(self.keys,function(index,keyname) {
                var methodname = GM_values["VK."+keyname];
                if (methodname != undefined) {
                    var prefix = target.__name__;
                    if (prefix == undefined) {
                        prefix = "";
                    } else {
                        prefix = prefix + ".";
                    }
                    if (methodname.substring(0,prefix.length) == prefix) {
                        methodname = methodname.substring(prefix.length);
                        if (methodname == "") {
                            delete self.global_bindings[self.getValue(keyname)];
                        } else {
                            self.global_bindings[self.getValue(keyname)] = [target,methodname];
                        }
                    }
                }
            });

            if (!(element[0] in self.handle_key_elements)) {
                self.handle_key_elements.push(element[0]);
                element.keydown(function(e) { self.handle_key(e); });
            }
        },
        reverse : undefined
    }.init();
})();
