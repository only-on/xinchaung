/**
 * @param num 数字
 * @description 数字转换字母
 */

function numToAbc(num: number) {
    return String.fromCharCode(64 + num)
}


// 节内转换算法
function SectionToChinese(section: any) {
    let chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var chnUnitChar = ["", "十", "百", "千"];
    var strIns = '', chnStr = '';
    var unitPos = 0;
    var zero = true;
    while (section > 0) {
        var v = section % 10;
        if (v === 0) {
            if (!zero) {
                zero = true;
                chnStr = chnNumChar[v] + chnStr;
            }
        } else {
            zero = false;
            strIns = chnNumChar[v];
            strIns += chnUnitChar[unitPos];
            chnStr = strIns + chnStr;
        }
        unitPos++;
        section = Math.floor(section / 10);
    }
    return chnStr;
}
/**
 * @param num 数字
 * @description 数字转换中文数字
 */

function NoToCh(num: number) {
    let chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    let chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
    var unitPos = 0;
    var strIns = '', chnStr = '';
    var needZero = false;

    if (num === 0) {
        return chnNumChar[0];
    }
    while (num > 0) {
        var section = num % 10000;
        if (needZero) {
            chnStr = chnNumChar[0] + chnStr;
        }
        strIns = SectionToChinese(section);
        strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
        chnStr = strIns + chnStr;
        needZero = (section < 1000) && (section > 0);
        num = Math.floor(num / 10000);
        unitPos++;
    }
    return chnStr;
}

// 获取学生成绩单选、多选答案
/**
 * 
 * @param answers 答案集合
 * @param type 其中之一content、code、contentAndCode
 * @description 获取学生成绩单选、多选答案
 */
function getCorrectAnswer(answers: Array<any>, type: string = "") {
    let code = ""
    let content = ""
    let contentAndCode = ""
    console.log(answers);
    if (!answers) {
        return ""
    }
    answers.forEach((item, index) => {
        code += numToAbc(index + 1) + ' '
        if (item.content) {
            content += item.content + ','
        } else {
            content += item.answer + ','
        }

    })
    if (type === "content") {
        return content.substring(0, content.length - 1)
    } else {
        return code
    }

}



// 获取url参数
function getQuery(name: string): string | null {
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
function deepEqual(object1: Object, object2: Object) {
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
function isObject(object: any) {
    return object != null && typeof object === 'object';
}

/**
 * @description 倒计时
 * @param start 开始时间
 * @param end 结束时间
 */
export interface Itimes {
    d: number | string
    h: number | string
    m: number | string
    s: number | string

}
function countDown(start: Date, end: Date): Itimes {
    let startTime = new Date(start)
    let endTime = new Date(end)
    var seconds = parseInt(((endTime.getTime() - startTime.getTime()) / 1000).toString())
    return {
        d: parseInt((seconds / 3600 / 24).toString()), // 天数
        h: parseInt((seconds / 3600 % 24).toString()), // 小算
        m: parseInt((seconds / 60 % 60).toString()), // 分钟
        s: parseInt((seconds % 60).toString()), // 秒
    }
}
// 判断时间大小
function contrastTime(start: Date, end: Date) {
    return (end.getTime() - start.getTime()) > 0 ? true : false
}

function isJsonString(str: any) {
    try {
        if (typeof JSON.parse(str) === "object") {
            return true
        }
    } catch (e) {

    }
    return false
}
// 笔记内容回显
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
function goHtml(val: string) {
    if (val.split('ops').length > 1) {
        // console.log(val);
        var val2:any=val.indexOf('base64')===-1?val:"{\"ops\":[{\"insert\":\" \\n\"}]}";
        // console.log(val2);
        var text=JSON.parse(val2)
        var converter = new QuillDeltaToHtmlConverter(text.ops, {})
        var html = converter.convert()
        // console.log(html);
        return html
    } else {
        return val
    }
}
// 获取地址栏参数
function urlSearch() {
    var str=location.href; //取得整个地址栏
    var num=str.indexOf("?") 
    str=str.substr(num+1); //取得所有参数
    var arr=str.split("&"); //各个参数放到数组里
    let obj:any = {}
    for(let i=0;i < arr.length;i++){ 
        num=arr[i].indexOf("="); 
        if(num>0){ 
            let name=arr[i].substring(0,num);
            let value=arr[i].substr(num+1);
            obj[name] = value
        } 
    } 
    return obj
}
export {
    numToAbc,
    getCorrectAnswer,
    getQuery,
    htmlDecode,
    deepEqual,
    countDown,
    contrastTime,
    isJsonString,
    goHtml,
    NoToCh,
    urlSearch
}
