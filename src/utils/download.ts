import {saveAs} from "file-saver"
import {message} from "ant-design-vue"
export function downloadUrl(url:string,name?:string){
    fetch(url).then((response:Response)=>{
        if (response.ok) {
            return response.blob
        }
    }).then((myBlob)=>{
        if (myBlob) {
            name?saveAs(url,name):saveAs(url)
        }else{
            message.error("未找到文件")
        }
    }).catch((err:Error)=>{
        message.error(err.message)
    })
    
}