
export interface Iexamlist {
    id: number
    name: string,
    status: "已结束" | "进行中" | "未开始"
    start_date: string
    times: string
    teacher: string
}

export interface Ipage {
    currentPage?: number
    pageCount?: number
    perPage?: number
    totalCount?: number
}

export interface IExamListParam{
    limit: number,
    name: string,
    page: number,
    status: number | string,
}
export interface IExamListParams {
    param: IExamListParam
    urlParams: {
        student_id: string
    }
}

export interface IExamResult {
    student_id: number | string
    paper_id: number | string |null
}
export type IexamData = {
    list: Array<Iexamlist>
    page: Ipage
}