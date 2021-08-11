import { LocaleMessageDictionary, VueMessageType } from "vue-i18n"

const files: Record<string, { [key: string]: any }> = import.meta.globEager("./*.ts")
let messages: LocaleMessageDictionary<VueMessageType> = {}

for (const key in files) {
    if (key !== './index.ts') {
        let k = key.split('/')[1].split('.')[0]
        messages = Object.assign(messages, { [k]: files[key].default })
    }
}
// console.log('[i18n/en_US] messages: ', messages)
export default messages
