import { App, Plugin, Component } from 'vue'
import NavTab from 'src/components/NavTab.vue'
import Breadcrumb from 'src/components/Breadcrumb.vue'
import { initAntdv } from './antdv'
import router from "../routers/index";
import i18n from '../i18n'
import store from "../store/index";
import customDirective from '../directive'
// import { registration as AntdvMarkdownRegistration } from 'packages/antdv-markdown/src/index';

export declare interface IAppManager {
    // 安装插件，暂不支持设置options
    installPlugins: (...items: Plugin[]) => IAppManager;
    // 注册组件时，以组件对象名作为组件名
    registerComponents: (components: Record<string, Component>) => IAppManager;
    app: App<Element>
}

export declare interface IComponentPair {
    name: string;
    component: Component;
}

// 初始化app的函数类型
export type TFInitApp = (appManager: IAppManager) => IAppManager

export default function initProject(app: App<Element>) {
    const appManager: IAppManager = (function (app: App<Element>) {
        const plugins = new Set()
        const registeredComponents = new Set()
        return {
            installPlugins(...items: Plugin[]) {
                items.forEach(plugin => {
                    if (!plugins.has(plugin)) {
                        app.use(plugin)
                        plugins.add(plugin)
                    }
                })
                return this
            },
            registerComponents (components: Record<string, Component>) {
                for (let name in components) {
                    if (!registeredComponents.has(components[name])) {
                        app.component(name, components[name])
                        registeredComponents.add(components[name])
                    }
                }
                return this
            },
            app: app
        }
    })(app)
    appManager.registerComponents({NavTab, Breadcrumb}).installPlugins(router, i18n, store, customDirective)
    initAntdv(appManager)
    // initAntdv(appManager).installPlugins(...AntdvMarkdownRegistration.plugins).registerComponents(AntdvMarkdownRegistration.components)
    return app
}
