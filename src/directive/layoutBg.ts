import { ObjectDirective } from "vue"
import bg from "../assets/images/common/layout_bg.jpg"
const layoutBg:ObjectDirective={
    mounted(el:HTMLElement,binging:any){
        const dom=document.getElementById("main-box")
        if (Object.prototype.toString.call(binging.value)==='[object Object]') {
            let layoutBg=binging.value.bg?binging.value.bg:bg
            let layoutSize=binging.value.size?binging.value.size:'312px'
            dom?.style?dom.style.backgroundImage="url("+layoutBg+")":''
            dom?.style?dom.style.backgroundSize="100% "+layoutSize:''
        }else{
            let layoutBg=binging.value?binging.value:bg
            dom?.style?dom.style.backgroundImage="url("+layoutBg+")":''
            dom?.style?dom.style.backgroundSize="100% 312px":''
        }
        dom?.style?dom.style.backgroundRepeat="no-repeat":''
    },
    unmounted(){
        const dom=document.getElementById("main-box")
        dom?.style?dom.style.backgroundImage="unset":''
    }
}

export default layoutBg