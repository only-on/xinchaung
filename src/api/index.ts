

// import  request  from "../utils/fetch.js";
// //   预设了四中数据格式  URLENCODED(默认)    JSON   TEXT  FORMDATA
// function getList(param){
//   return request({
//     url:`/api/content/content/search?init_type=0`,
//     method: "GET",
//     body: param,
//   })
// }

// export{login,getList}



import MyServer from '../request/getRequest'

// import teacherExperimental from './modules/teacherExperimental'
const files:any= import.meta.globEager("./modules/*.ts") 
for (const key in files) {
    // console.log(files[key]);
    let k=key.split('/')[2].split('.')[0]
    let moduleFiles=files[key].default
    MyServer.parseRouter(k,moduleFiles)
}

// MyServer.parseRouter('teacherExperimental',teacherExperimental)
export default MyServer;