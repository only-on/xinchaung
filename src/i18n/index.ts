import { LocaleMessages } from '@intlify/core-base'
import { VueMessageType } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import zhCN from './zh_CN'
import enUS from './en_US'
import zh_AI_CN from './zh_AI_CN'

const messages: LocaleMessages<VueMessageType> = {
    'zh-cn': zh_AI_CN,
    'en': enUS
}

const i18n = createI18n({
    legacy: false, // 关闭legacy来使用composition api.
    globalInjection: true, // 全局注册 $t方法
    locale: 'zh-cn', // 这里必须和ant-design的ConfigProvider的locale初始值一模一样
    fallbackLocale: 'en',
    messages
})

// console.log('[i18n] messages: ', messages)
export default i18n