declare module "*.js"
declare module '*.md';
declare module 'swiper/vue';
declare module 'http-build-query';
declare module 'echarts/extension/dataTool'
declare module 'vue-codemirror'
declare module '@codemirror/*'
declare module 'lodash'
interface Window {
    _config:{
        TUS_SERVE_IP: string,
        SOCKET_SERVE_IP:string
    },
    XC_ROLE:number|string  // role 权限
}
