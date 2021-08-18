import type {App} from "vue"
import layoutBg from "./layoutBg"


const customDirective={
    install(app:App,options:any){
        app.directive('layout-bg',layoutBg)
    }
}
export default customDirective
