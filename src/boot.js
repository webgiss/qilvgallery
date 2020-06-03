import { readyPromise, QILVGalleryInit } from './tools';

(() => {
    readyPromise.then(() => QILVGalleryInit());
})()
