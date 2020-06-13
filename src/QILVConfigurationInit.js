import DomAccess from './DomAccess';
import VK from './VK';
import GalleryOverlays from './GalleryOverlays';
import ConfigurationUi from './ConfigurationUi';
import Configuration from './Configuration';

/**
 * Initialise QILVConfiguration
 * @returns {void}
 */

export default QILVConfigurationInit = () => {
    const domAccess = new DomAccess();
    const configurationUi = new ConfigurationUi({ domAccess, rootNode: document.body });
    const vk = new VK({});
    const galleryOverlays = new GalleryOverlays({
        imageOverlayFactory : null,
        galleryOverlaysUi : null,
        vk,
        config : {},
    });
    const configuration = new Configuration({
        configurationUi,
        vk,
        galleryOverlays
    });
    window.QILVConfiguration = configuration;
    configuration.init();
}

