jQuery ($) ->
    [ prefix_url, suffix_url ] = [ window.qilv_prefix_url, window.qilv_suffix_url ]
    
    setlink = (keyboard_config) ->
        keystring = "";
        if keyboard_config?
            keystring = "window.GM_values={"
            first = true
            $.each(
                keyboard_config, 
                (key,value) ->
                    keystring += "," if (!first)
                    first = false
                    keystring += "'"
                    keystring += key
                    keystring += "':'"
                    keystring += value
                    keystring += "'"
                    return null
            )
            keystring += "};"
        $('#gallery_link').attr('href',"javascript:(function(){if(window.QILVGallery_overlays){window.QILVGallery_overlays.current.show();}else{"+keystring+"var n=document.createElement('script');n.type='text/javascript';n.src='"+prefix_url+"qilvgallery-total.min.js"+suffix_url+"';document.getElementsByTagName('head')[0].appendChild(n);}})();");
        $('#gallery_link').hide()
        $('#gallery_link').fadeIn('slow')

    setlinkname = () ->
        $('#gallery_link').text($('#namefield').val())

    setlink_using_param = () ->
        config = {}
        $('#keyspanel table tr').each (index,tr) ->
            key = $(tr).find("td.key select").val()
            action = $(tr).find("td.action select").val()
            if key != ''
                if QILVGallery_overlays.key_bindings[key] != action
                    config['VK.'+key] = QILVGallery_overlays.__name__ + '.' + action
            return null
                    
        $('#valuespanel table tr').each (index,tr) ->
            name = $(tr).find("td.key select").val()
            value = $(tr).find("td.action input").val()
            value = parseInt(value) if value.match(/^\-?[0-9]+$/)
            value=true if value=='true'
            value=false if value=='false'
            if QILVGallery_overlays[name] != value
                config['QILV.'+name] = value
            return null
            
        setlink(config)
        return null

    addkeysbuttons = (keyname,actionname) ->
        $line = $("<tr><td class='key'></td><td class='action'></td></tr>")
        
        $('#keyspanel table').append $line
        $line.find('td').css('width','50%')
        $combo = $('<select style="width:100%"/>')
        $line.find('td.key').append($combo)
        $combo.append($('<option/>').html("-- select a key --").attr('value',''))
        $.each(
            VK.keys,
            (index,key) ->
                $option = $('<option/>').html(key).attr('value',key)
                if key == keyname
                    $option.attr('selected','true');
                $combo.append($option);
                return null
        )
        $combo.change setlink_using_param
        
        $combo = $('<select style="width:100%"/>')
        $line.find('td.action').append($combo)
        $combo.append($('<option/>').html("-- no action --").attr('value',''))
        $.each(
            QILVGallery_overlays.bindables,
            (value,comment) ->
                $option = $('<option/>').html(comment).attr('value',value)
                if value == actionname
                    $option.attr('selected','true')
                $combo.append($option)
                return null
        )
        $combo.change(setlink_using_param)
        return null
        
    addvaluesbuttons = (name,value,comment) ->
        $line = $("<tr><td class='key'></td><td class='action'></td></tr>")
        $('#valuespanel table').append($line)
        $line.find('td').css('width','50%')
        $combo = $('<select style="width:100%"/>')
        $line.find('td.key').append($combo)
        $combo.append($('<option/>').html(comment).attr('value',name))
        
        $combo.change(setlink_using_param)
        $combo = $('<input style="width:100%"/>').html(value).attr('value',value)
        $line.find('td.action').append($combo)
        $combo.change(setlink_using_param)
        return null

    
    setlink({})

    $('#namepanel')
        .append("<input id='namefield' style='width:100%'/>")

    $('#namefield')
        .change(setlinkname)
        .keyup(setlinkname)
        .val($('#gallery_link').text())
    
    $('#keyboardpanel')
        .append("<div id='keyspanel'/>")
        .append("<div id='pluskeyspanel' class='pluspanel'/>")
        
    $('#keyspanel')
        .append("<table style='width:100%'></table>")
        
    $('#pluskeyspanel')
        .append("<button id='pluskeysbutton' class='plusbutton' type='submit'>+</button>")
        .click () ->
            addkeysbuttons()
            $combo.change(setlink_using_param)
            return null

    $.each(
        QILVGallery_overlays.key_bindings
        (key,action) -> addkeysbuttons(key,action)
    )

    $('#valuepanel').append("<div id='valuespanel'/>")
    $('#valuespanel').append("<table style='width:100%'></table>")
    
    $.each(
        QILVGallery_overlays.configurables
        (name,comment) -> addvaluesbuttons(name,QILVGallery_overlays[name],comment)
    );
    setlink_using_param()
