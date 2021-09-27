/* eslint-disable */
/**
 * @description 点击获取选择内容
 */
let copyText: any = ""
document.addEventListener('copy', function () {
    if (window.getSelection) {
        let text:any  = window.getSelection()?.toString()
        copyText=text;
        return window.getSelection()?.toString()
        // @ts-ignore
    } else if (document.selection && document.selection.createRange) {
        // @ts-ignore
        copyText = document.selection.createRange().text;
        // @ts-ignore
        return document.selection.createRange().text;
    }
    return ""
})

export { copyText }
