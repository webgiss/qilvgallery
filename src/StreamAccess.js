/**
 * Get the base name of a url.
 * 
 * @param {String} url 
 * @returns String
 */
const getBaseName = (url) => url.split('/').reduce((_,e)=>e);

export default class StreamAccess {
    constructor() {
    }

    /**
     * Download a file from an url.
     * Require NO CORS policy, either on the site, or as extension on the browser.
     * 
     * @param {String} url The url of the file to download.
     * @param {String} filename The name of the file to download.
     */
    async downloadUrl(url, filename) {
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

}


