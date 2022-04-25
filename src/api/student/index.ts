import { TFHttpSend } from "src/typings/getRequest";
export default {
    getInfo: { url: `/student-course/my-experience`, method: "GET", }
}

export interface IstuIndex {
    getInfo:TFHttpSend
}