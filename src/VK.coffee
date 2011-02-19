window = @
$ = window.jQuery
_VK = window.VK
return VK = window.VK = (
    BACKSPACE: 8 
    TAB: 9
    ENTER: 13
    SHIFT: 16 
    CONTROL: 17
    CAPS_LOCK: 20
    ESCAPE: 27
    SPACE: 32 
    PAGE_UP: 33
    PAGE_DOWN: 34
    END: 35
    HOME: 36
    LEFT: 37
    UP: 38
    RIGHT: 39
    DOWN: 40 
    INSERT: 45
    DELETE: 46 
    
    A:65
    B:66
    C:67
    D:68
    E:69
    F:70
    G:71
    H:72
    I:73
    J:74
    K:75
    L:76
    M:77
    N:78
    O:79
    P:80
    Q:81
    R:82
    S:83
    T:84
    U:85
    V:86
    W:87
    X:88
    Y:89
    Z:90

    NUMPAD_MULTIPLY: 106 
    NUMPAD_ADD: 107 
    NUMPAD_ENTER: 108 
    NUMPAD_SUBSTRACT: 109 
    NUMPAD_DECIMAL: 110 
    NUMPAD_DIVIDE: 111 
    COMMA: 188 
    PERIOD: 190
    
    init : () ->
        @reverse = {}
        @keys = []
        @values = []
        $.each(
            @, 
            (key,value) =>
                if not(isNaN(parseInt(value))) && (key.toUpperCase()==key)
                    @reverse[value] = key
                    @keys.push(key)
                    @values.push(value)
                return true
        )
        return @

    noConflict: () ->
        window.VK = _VK
        return @

    getName : (value) ->
        return @reverse[value] if @reverse[value]?
        return value+""

    getValue : (name) ->
        name = name.toUpperCase()
        return @[name]

    global_bindings : {}

    handle_key : (e) ->
        if @global_bindings[e.which]?
            [ target, method_name ] = @global_bindings[e.which]
            result = target[method_name]
                "event" : e
                "method_name" : method_name
            
            e.preventDefault()

    handle_key_elements : []

    auto_bind : (target, element) ->
        element = document unless element?
        element = $(element)

        target.bindables = {} unless target.bindables?
                    
        binding_to_delete = []

        $.each(
            @global_bindings
            (keyvalue,targetmethod) =>
                if targetmethod[0] == target
                    binding_to_delete.push(keyvalue)
                return true
        )

        for keyvalue in binding_to_delete 
            delete @global_bindings[keyvalue]

        $.each(
            target.key_bindings,
            (keyname,methodname) =>
                @global_bindings[@getValue(keyname)] = [target,methodname]
                if !(methodname of target.bindables)
                    target.bindables[methodname] = "??? (" + methodname + ")"
                return true
        )
        $.each(
            @keys,
            (index,keyname) =>
                methodname = GM_values["VK."+keyname]
                if methodname?
                    prefix = target.__name__
                    prefix = if prefix then prefix + "." else ""
                    if methodname.substring(0,prefix.length) == prefix
                        methodname = methodname.substring(prefix.length)
                        if methodname == ""
                            delete @global_bindings[@getValue(keyname)]
                        else 
                            @global_bindings[@getValue(keyname)] = [target,methodname]
                return true
        )

        if not(element[0] in @handle_key_elements)
            @handle_key_elements.push(element[0])
            element.keydown( (e) => @handle_key(e) )

    reverse : null
).init()
