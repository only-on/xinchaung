import { ObjectDirective } from "vue"
const layoutBg:ObjectDirective={
    mounted(el:HTMLElement,binging:any){
        const dom=document.getElementById("app")
        console.log(dom);
        dom?.style?dom.style.backgroundImage="url("+binging.value+")":''
        dom?.style?dom.style.backgroundSize="100% 312px":''
        dom?.style?dom.style.backgroundRepeat="no-repeat":''
    },
    unmounted(){

    }
}

export default layoutBg