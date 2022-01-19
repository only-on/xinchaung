import type { App } from "vue"
import layoutBg from "./layoutBg"
import roleRole from "./roleMenu"
import showRole from "./showRole"
const customDirective = {
    install(app: App, options: any) {
        app.directive('layout-bg', layoutBg)
        app.directive("role", roleRole)
        app.directive("show-role", showRole)
    }
}
export default customDirective
