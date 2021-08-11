// import  request  from "../utils/fetch.js";
// //   预设了四中数据格式  URLENCODED(默认)    JSON   TEXT  FORMDATA

import MyServer from '../request/getRequest.js'
// import teacherExperimental from './modules/teacherExperimental'
// MyServer.parseRouter('teacherExperimental',teacherExperimental)
const files:any= import.meta.globEager("./modules/*.ts") 
for (const key in files) {
    let k=key.split('/')[2].split('.')[0]
    let moduleFiles=files[key].default
    MyServer.parseRouter(k,moduleFiles)
}

export default MyServer;