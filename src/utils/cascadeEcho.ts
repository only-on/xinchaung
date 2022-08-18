import { courseScoreOption } from "src/views/teacherModule/teachingQuality/echartOption"
import { json } from "stream/consumers"

/**
 * @param cascaData 要处理的数字
 * @description 处理级联选择数据回显
 */
function cascadeEcho(cascaData:any){
    let names:any=[]
    cascaData.forEach((item:any,index:any)=>{
        if(Array.isArray(item)){
            names.push([])
            item.forEach((g:any)=>{
                names[index].push(g.name)
            })
        }else{
            names.push(item.name)
        }
    })
    return names
}

/**
 * @param subidsArr  要提交给后端的数据
 * @description 处理级联选择提交的数据
 */
 function doSubmitData(subidsArr:any){
    let flagArr:boolean=false
    const ids:any=[]
    subidsArr.forEach((item:any)=>{
        if(Array.isArray(item)){
            flagArr=true
            ids.push(item[item.length-1])
        }

    })
    if(flagArr){
        return ids
    }else{
        return subidsArr[subidsArr.length-1]
    }
 }

 /**
 * @param modelData  绑定的值
 * @param detailData  后端返回的值
 * @description 处理级联选择编辑后要提交的数据
 */
function doEditSubmit(modelData:any,detailData:any){
   let flagArr:boolean=false
   let ids:any=[]
   detailData.forEach((item:any)=>{
       if(Array.isArray(item)){
           flagArr=true
        //    ids.push(item[item.length-1])
       }
   })
   if(!flagArr){
       if(JSON.stringify(modelData)==JSON.stringify(cascadeEcho(detailData))){
         return  detailData[detailData.length-1].id
       }else{
        return doSubmitData(modelData)
       }
   }else{
    // 如果用户没有再次操作处理返回的数据
    if(JSON.stringify(modelData)==JSON.stringify(cascadeEcho(detailData))){
        detailData.forEach((item:any)=>{
            console.log(item,item[item.length-1],'item')
            ids.push(item[item.length-1].id)
            console.log(ids)
        })
    }else{  
            const arrs:any=[]
            modelData.forEach((it:any)=>{
                arrs.push()
            })
        // 如果不一致 先找到哪一项不一样
        modelData.forEach((item:any,index:any)=>{
                console.log(cascadeEcho(detailData),'哈哈哈哈哈哈哈哈哈哈')
                console.log(item,'xixix额')
          
            let iIndex:any=cascadeEcho(detailData).indexOf(item)
            if(iIndex!==-1){
                console.log(iIndex,'iIndex')
                // ids.push(detailData[iIndex-1][detailData[iIndex-1].length-1].id)
                // console.log(ids,'ids')
            }else{
                console.log(iIndex,'jIndex')
                // ids.push(item[item.length-1].id)
                // console.log(ids,'ids')
            }
        })   
    }
    return ids
   }
}
export{
    cascadeEcho,
    doSubmitData,
    doEditSubmit
}