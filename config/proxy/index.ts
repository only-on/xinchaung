const url="http://192.168.101.150/"

export default {
    "/exams/":{
        target: url,
        changeOrigin: true,
    },
    '/proxyPrefix': {
      target: 'http://192.168.101.150:85',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/proxyPrefix/, '')
    },
    '/ws': {
      target: 'http://192.168.101.150:9034',
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(/^\/ws/, '')
    }
}