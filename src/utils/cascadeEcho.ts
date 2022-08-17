/**
 * @param cascaData 要处理的数字
 * @description 处理级联选择数据回显
 */
function cascadeEcho(cascaData:any){
    let names:any=[]
    console.log(cascaData,'cascaData')
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
   console.log(modelData,'modelData',detailData,'detailData')
}

export{
    cascadeEcho,
    doSubmitData,
    doEditSubmit
}