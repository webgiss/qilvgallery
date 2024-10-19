/**
 * The promise resolve when the page is ready.
 * @type {Promise<void>};
 */
const readyPromise = new Promise((resolve, reject) => {
    if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
        setTimeout(() => resolve(), 1);
    } else {
        const onContentLoaded = () => {
            resolve();
            document.removeEventListener('DOMContentLoaded', onContentLoaded, false);
        }
        document.addEventListener('DOMContentLoaded', onContentLoaded, false);
    }
});

/**
 * Download a file from an url.
 * Require NO CORS policy, either on the site, or as extension on the browser.
 * 
 * @param {String} url The url of the file to download.
 * @param {String} filename The name of the file to download.
 */
const downloadUrl = async (url, filename) => {
    if (filename === undefined) {
        filename = getBaseName(url)
    }
    const response = await fetch(url)
    const blob = await response.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
}

const getBaseName = (url) => url.split('/').reduce((_,e)=>e);

export { readyPromise, downloadUrl, getBaseName };
