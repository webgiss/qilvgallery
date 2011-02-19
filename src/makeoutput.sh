wget -O ../output/jquery.min.js http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js
coffee -o ../output -c *.coffee
(cat ../output/jquery.min.js; yui-compressor ../output/VK.js; yui-compressor ../output/qilvgallery.js; yui-compressor ../output/qilvgallery-launch.js) > ../output/qilvgallery-total.min.js
(cat ../output/jquery.min.js; yui-compressor ../output/VK.js; yui-compressor ../output/qilvgallery.js; yui-compressor ../output/gallery.js) > ../output/qilvgallery-configuration.min.js
cp gallery.html ../output/gallery.html


