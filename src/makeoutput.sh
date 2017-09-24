WORKING_DIR=../work
OUTPUT_DIR=../docs
SRC_DIR=../src

rm -rf "$WORKING_DIR"
rm -rf "$OUTPUT_DIR"

[ -e "$WORKING_DIR" ] || mkdir -p "$WORKING_DIR"
[ -e "$OUTPUT_DIR" ] || mkdir -p "$OUTPUT_DIR"

coffee -o "$WORKING_DIR" -c "$SRC_DIR"/*.coffee

cd "$WORKING_DIR"

curl http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.js > jquery.js
uglifyjs -o "$OUTPUT_DIR"/qilvgallery-total.min.js jquery.js VK.js qilvgallery.js qilvgallery-launch.js
uglifyjs -o "$OUTPUT_DIR"/qilvgallery-configuration.min.js jquery.js VK.js qilvgallery.js gallery.js
cat jquery.js VK.js qilvgallery.js qilvgallery-launch.js > "$OUTPUT_DIR"/qilvgallery-total.js
cat jquery.js VK.js qilvgallery.js gallery.js > "$OUTPUT_DIR"/qilvgallery-configuration.js

cp "$SRC_DIR"/gallery.html "$OUTPUT_DIR"/gallery.html
cp "$SRC_DIR"/gallery.html "$OUTPUT_DIR"/gallery.min.html
cp "$SRC_DIR"/gallery.html "$OUTPUT_DIR"/index.html

sed -e 's/.min././; s/\r//g' -i "$OUTPUT_DIR"/qilvgallery-configuration.js
sed -e 's/.min././; s/\r//g' -i "$OUTPUT_DIR"/gallery.html
sed -e 's/gallery.min.html/index.html/; s/\r//g' -i "$OUTPUT_DIR"/index.html
echo -n "qilv.gissehel.com" > "$OUTPUT_DIR"/CNAME

cd "$SRC_DIR"




