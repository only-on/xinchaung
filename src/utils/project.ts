import { App } from 'vue'
import NavTab from 'src/components/NavTab.vue'
import Breadcrumb from 'src/components/Breadcrumb.vue'
import initAntdv from './antdv'
import router from "../routers/index";
import i18n from '../i18n'
import store from "../store/index";
import customDirective from '../directive'

export default function initProject(app: App<Element>) {
    app.component('NavTab', NavTab).component('Breadcrumb', Breadcrumb).use(router).use(i18n).use(store).use(customDirective)
    initAntdv(app)
    return app
}