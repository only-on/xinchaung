// @ts-ignore
import AntdvMarkdown, { registration } from '@xianfe/antdv-markdown'
import { IAppManager, TFInitApp } from './project'

export const initAntdvMarkdown: TFInitApp = function (appManager: IAppManager) {
    // @ts-ignore
    appManager.installPlugins(...registration.plugins).registerComponents(registration.components)
    // @ts-ignore
    appManager.app.use(AntdvMarkdown)
    return appManager
}
