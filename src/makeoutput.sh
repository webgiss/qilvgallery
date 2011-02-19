WORKING_DIR=../work
OUTPUT_DIR=../output

[ -e "$WORKING_DIR" ] || mkdir -p "$WORKING_DIR"
[ -e "$OUTPUT_DIR" ] || mkdir -p "$OUTPUT_DIR"

wget -O "$WORKING_DIR"/jquery.min.js http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js
coffee -o "$WORKING_DIR" -c *.coffee
(cat "$WORKING_DIR"/jquery.min.js; yui-compressor "$WORKING_DIR"/VK.js; yui-compressor "$WORKING_DIR"/qilvgallery.js; yui-compressor "$WORKING_DIR"/qilvgallery-launch.js) > "$OUTPUT_DIR"/qilvgallery-total.min.js
(cat "$WORKING_DIR"/jquery.min.js; yui-compressor "$WORKING_DIR"/VK.js; yui-compressor "$WORKING_DIR"/qilvgallery.js; yui-compressor "$WORKING_DIR"/gallery.js) > "$OUTPUT_DIR"/qilvgallery-configuration.min.js
cp gallery.html "$OUTPUT_DIR"/gallery.html



