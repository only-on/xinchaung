
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

export interface IExamListParam {
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
    paper_id: number | string | null
}
export type IexamData = {
    list: Array<Iexamlist>
    page: Ipage
}

export interface IScoreResult {
    average: number,
    myself: number,
    question_type: string
}

export interface ICorrectRate {
    rate: number,
    question_type: string
}

export interface IQuestions {
    id: number
    question: string
    type_id: number
    level_id: number
    pool_id: number
    default_score: number
    user_id: number
    created_at: Date
    updated_at: Date
    type: {
        id: number
        name: string
    }
    level: {
        id: number
        name: string
    }
    answers: [
        {
            id: number
            answer: string
        }
    ]
    student_answers: [
        {
            id: number
            answer: string
        }
    ]
}
export interface IDetailData {
    id: number,
    name: string,
    questions_count: number,
    paper_score_total: number,
    pass_score: number,
    myself_score: number,
    use_time_seconds: number,
    class_rank: number,
    score_result: IScoreResult[],
    correct_rate: ICorrectRate[],
    questions: IQuestions[]
}


// 开始考试
export type TStartedExam = {
    urlParams: {
        student_id: number | string
        exam_id: number | string
    }

}

// 提交考试 type
export type TSubmitAnswer={
    param:{
        relation_id: number | string
        answers: Array<string|number>
    },
    urlParams: {
        student_id:number|string
        exam_id:number|string
    }
}