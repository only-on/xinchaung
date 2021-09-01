/**
 * @param num 数字
 * @description 数字转换字母
 */

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
        if (item.content) {
            content+=item.content+','
        } else {
            content+=item.answer+','
        }
        
    })
    if (type==="content") {
        return content.substring(0,content.length-1)
    } else {
        return code
    }
    
}

// 获取url参数
function getQuery(name:string):string | null {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}


function htmlDecode(text: any) {
    //1.首先动态创建一个容器标签元素，如DIV
    var temp = document.createElement('div')
    //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
    temp.innerHTML = text
    //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
    return temp.innerText || temp.textContent
}

// 比较对象
function deepEqual(object1:Object, object2:Object) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (let index = 0; index < keys1.length; index++) {
      const val1 = object1[keys1[index]];
      const val2 = object2[keys2[index]];
      const areObjects = isObject(val1) && isObject(val2);
      if (areObjects && !deepEqual(val1, val2) || 
          !areObjects && val1 !== val2) {
        return false;
      }
    }
  
    return true;
  }
  
  // 判断是否为对象
  function isObject(object:any) {
    return object != null && typeof object === 'object';
  }

export {
    numToAbc,
    getStudentTranscriptAnswer,
    getQuery,
    htmlDecode,
    deepEqual
 }
 