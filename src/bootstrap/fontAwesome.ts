import {library} from "@fortawesome/fontawesome-svg-core";
import {faEye, faDownload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {IAppManager, TFInitApp} from "./project";

library.add(
    faEye, faDownload
);
export const initFontAwesome: TFInitApp = function (appManager: IAppManager) {
    appManager.registerComponents({FontAwesomeIcon})
    return appManager
}

