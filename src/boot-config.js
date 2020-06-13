import { readyPromise } from './tools';
import QILVConfigurationInit from './QILVConfigurationInit';

(() => {
    readyPromise.then(() => QILVConfigurationInit());
})()
