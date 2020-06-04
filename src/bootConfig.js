import { readyPromise, QILVConfigurationInit } from './tools';

(() => {
    readyPromise.then(() => QILVConfigurationInit());
})()
