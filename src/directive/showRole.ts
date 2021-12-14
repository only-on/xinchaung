import { ObjectDirective } from "vue"
import storage from "src/utils/extStorage"
const showRole: ObjectDirective = {
    mounted(el: HTMLElement, binging: any) {
        console.log(el, binging.value, 'gggggggggghh')
        const role = storage.lStorage.get("role")
        if (role === 2) {
            el.style.display = "none"
        }
    }
}
export default showRole