export declare interface ILayoutTabItem {
    name: string
    componenttype: number
}

export declare interface ILayoutConfiguration {
    showNav: boolean // 是否需要导航条
    navPosition: 'inside' | 'outside' //  inside   outside   导航位于内容区   内or外
    navType: boolean // 面包屑true未默认灰色    false为白色
    tabs: ILayoutTabItem[] // tab切换项 例 [{name:'随堂论坛',componenttype:0}]
    componenttype: any | undefined //  tab选中项   传tabs时需赋值 undefined做初始化，随后navtab组件会改其值为tabs的首项。 可监听configuration.componenttype 回调处理
    showContent: boolean // 是否需要内容区盒子   不需要则 layout只带顶部导航
}
