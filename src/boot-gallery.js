import { readyPromise } from './tools';
import QILVGalleryInit from './QILVGalleryInit';

(() => {
    readyPromise.then(() => QILVGalleryInit());
})()
