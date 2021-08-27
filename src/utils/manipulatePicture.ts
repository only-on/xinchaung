/** 
 * @author wenhe
 * @description 处理canvas、图片、file文件
 */
import html2canvas from "html2canvas"

/**
 * 
 * @param element 
 * @returns promise
 * @description 截图
 */
function screenshot(el: HTMLElement): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        html2canvas(el).then(function (canvas: HTMLCanvasElement) {
            resolve(canvas)
        }).catch(err => {
            reject(err)
        })
    })

}
/** 
* @param canvas 画布
* @description 画布转换图片base64
*/

function canvasToImage(canvas: HTMLCanvasElement) {
    let image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image
}

/**
 * @param fileName 文件名称
 * @param canvas 画布
 * @description canvas转file对象
 */

function canvasToFile(canvas: HTMLCanvasElement, fileName: string): File {
    let dataUrl: string = canvas.toDataURL("image/png")
    let arr: Array<string> = dataUrl.split(",");
    let mimes = arr[0].match(/:(.*?);/)
    let mine: string = mimes === null ? "" : mimes[0]
    let bstr: string = atob(arr[1])
    let n: number = bstr.length
    let u8arr: Uint8Array = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    let file = new File([u8arr], fileName, { type: mine })
    return file
}

/**
 * @param img 文件
 * @param callback 回调函数（base64Url）
 */

function imageFileToBase64(img: Blob): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => (resolve(reader.result as string)));
        reader.readAsDataURL(img);
    })

}

export {
    canvasToImage,
    canvasToFile,
    imageFileToBase64,
    screenshot
}