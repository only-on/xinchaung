export interface IformSate {
  testName: string
  paperLists: Ilist[]
}
interface IQuestList {
  option: string
  content: string
  value: string
}
export interface Ilist {
  id: number
  question: string
  type_id: number
  options: Ioptions[]
  answers: Ianswers[]
  keywords: string[]
  answersList: number[]
  keywordsList: string
  origin_score: number
  isChecked: boolean
}
interface Ioptions {
  id: number
  option: string
}
interface Ianswers {
  id: number
  answer: number
}
export interface IPaperList{
  type: number
  directory: string
  desc: string
  quesList: IQuestList[],
  score: string
  checked: string   // 单选
  checkedList: string[]  // 多选
  difficulty: string
  judge: number,
  fillAnswer: string     // 填空答案
  fillChecked: boolean,   // 填空答案有序
  shortAnswer: string     // 简答答案
  shortKey: string        // 简答关键字
}
interface IteachCourse {
  getCatalogueList: Function
  addCatalogue: Function
  getLevelList: Function
  getPaperTypeList: Function
  getQuestionList: Function 
  createQuestion: Function
  getKnowledgeList: Function
  createPaper: Function
  relationQuest: Function
  getPaperList: Function
}
export interface Ihttp {
  teachCourse: IteachCourse,
}
interface IType {
  id: number
  name: string
}
export interface IpaperType {
  paperType: IType[]
  levelType: IType[]
}