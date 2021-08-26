// 数字转换字母
function numToAbc(num:number){
    return  String.fromCharCode(64+num)
}

// 获取学生成绩单选、多选答案
/**
 * 
 * @param answers 答案集合
 * @param type 其中之一content、code、contentAndCode
 * @description 获取学生成绩单选、多选答案
 */
function getStudentTranscriptAnswer(answers:Array<any>,type:string=""){
    let code=""
    let content=""
    let contentAndCode=""
    answers.forEach((item,index)=>{
        code+=numToAbc(index+1)+' '
        content+=item.answer+','
    })
    if (type==="conetnt") {
        return content.substring(content.length-1)
    } else {
        return code
    }
    
}
 export {
    numToAbc,
    getStudentTranscriptAnswer
 }
 