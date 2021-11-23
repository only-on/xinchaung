import type {App} from "vue"
import layoutBg from "./layoutBg"
import roleRole from "./roleMenu"

const customDirective={
    install(app:App,options:any){
        app.directive('layout-bg',layoutBg)
        app.directive("role",roleRole)
    }
}
export default customDirective
