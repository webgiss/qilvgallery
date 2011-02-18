(function() {
  var $, VK, window, _VK;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  window = this;
  $ = window.jQuery;
  _VK = window.VK;
  return VK = window.VK = {
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
    init: function() {
      this.reverse = {};
      this.keys = [];
      this.values = [];
      $.each(this, __bind(function(key, value) {
        if (!(isNaN(parseInt(value))) && (key.toUpperCase() === key)) {
          this.reverse[value] = key;
          this.keys.push(key);
          this.values.push(value);
        }
        return true;
      }, this));
      return this;
    },
    noConflict: function() {
      window.VK = _VK;
      return this;
    },
    getName: function(value) {
      if (this.reverse[value] != null) {
        return this.reverse[value];
      }
      return value + "";
    },
    getValue: function(name) {
      name = name.toUpperCase();
      return this[name];
    },
    global_bindings: {},
    handle_key: function(e) {
      var method_name, result, target, _ref;
      if (this.global_bindings[e.which] != null) {
        _ref = this.global_bindings[e.which], target = _ref[0], method_name = _ref[1];
        result = target[method_name]({
          "event": e,
          "method_name": method_name
        });
        return e.preventDefault();
      }
    },
    handle_key_elements: [],
    auto_bind: function(target, element) {
      var binding_to_delete, _ref;
      if (element == null) {
        element = document;
      }
      element = $(element);
      if (target.bindables == null) {
        target.bindables = {};
      }
      binding_to_delete = [];
      $.each(this.global_bindings, __bind(function(keyvalue, targetmethod) {
        if (targetmethod[0] === target) {
          binding_to_delete.push(keyvalue);
        }
        return true;
      }, this));
      $.each(binding_to_delete, __bind(function(index, keyvalue) {
        delete this.global_bindings[keyvalue];
        return true;
      }, this));
      $.each(target.key_bindings, __bind(function(keyname, methodname) {
        this.global_bindings[this.getValue(keyname)] = [target, methodname];
        if (!(methodname in target.bindables)) {
          target.bindables[methodname] = "??? (" + methodname + ")";
        }
        return true;
      }, this));
      $.each(this.keys, __bind(function(index, keyname) {
        var methodname, prefix;
        methodname = GM_values["VK." + keyname];
        if (methodname != null) {
          prefix = target.__name__;
          prefix = prefix ? prefix + "." : "";
          if (methodname.substring(0, prefix.length) === prefix) {
            methodname = methodname.substring(prefix.length);
            if (methodname === "") {
              delete this.global_bindings[this.getValue(keyname)];
            } else {
              this.global_bindings[this.getValue(keyname)] = [target, methodname];
            }
          }
        }
        return true;
      }, this));
      if (!(_ref = element[0], __indexOf.call(this.handle_key_elements, _ref) >= 0)) {
        this.handle_key_elements.push(element[0]);
        return element.keydown(__bind(function(e) {
          return this.handle_key(e);
        }, this));
      }
    },
    reverse: null
  }.init();
}).call(this);
