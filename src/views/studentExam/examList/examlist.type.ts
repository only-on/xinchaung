
export interface Iexamlist {
    id: number
    name: string,
    status: "已结束" | "进行中" | "未开始"
    start_date: string
    times: string
    teacher: string
}

export interface Ipage {
    currentPage: number
    pageCount: number
    perPage: number
    totalCount: number
}

export type IexamData ={
    list: Array<Iexamlist>
    page:Ipage
}