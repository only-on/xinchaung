// import { router } from '/routers';
/**
 * 自动化处理文件：自动引入路由的核心文件
 */

const files:any= import.meta.globEager("../modules/*.ts") 
let configRouters:Array<any> = []

for (const key in files) {
  if(key!=='../modules/index.ts'){
    configRouters.push(files[key].default)
  }
}
 export default configRouters
