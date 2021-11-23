import {ObjectDirective} from "vue"
import storage from "src/utils/extStorage"
/**
 * @description
 * @param 
 */
const roleRole:ObjectDirective={
    mounted(el:HTMLElement,binging:any){
        const role=storage.lStorage.get("role")
        console.log(el,binging,role);
        if (binging.value&&Object.prototype.toString.call(binging.value)==="[object Array]") {
            if (binging.value[0]==0&&[3,1].includes(role)) {
                console.log(binging.value[0]);
                el.style.display="inline-block"
            }else{
                el.style.display="none"
            }
        }else{
            el.style.display="none"
        }
        
    }
}
export default roleRole