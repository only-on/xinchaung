declare module "*.js"
declare module '*.md';
declare module 'swiper/vue';
interface Window {
    _config:{
        TUS_SERVE_IP: string,
        SOCKET_SERVE_IP:string
    },
    XC_ROLE:number|string  // role 权限
}
