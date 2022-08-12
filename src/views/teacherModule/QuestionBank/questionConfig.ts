
const createQuestionTypeList = [
  {key:1, name:'选择题',path:'./QuestionBank/createQues'},
  {key:2, name:'判断题',path:'./QuestionBank/createQues'},
  {key:3, name:'填空题',path:'./QuestionBank/createQues'},
  {key:4, name:'简答题',path:'./QuestionBank/createQues'},
  {key:5, name:'编程题',path:'./QuestionBank/createProgramming'},
  {key:6, name:'模型题',path:'./QuestionBank/createModelQuestion'},
  {key:7, name:'批量导入',path:'./QuestionBank/batchImport'},
];

interface IChoiceOptions {
  content: string
  origin_option: string
}
interface IQuestionList {
  id: number
  is_init: boolean
  is_public: boolean
  used_by: string
  difficulty: string
  kind: string
  category_id: number
  created_at: number
  choice_correct_options: string[]
  choice_options: IChoiceOptions[]
  oj_problem_id: number
  priority: null
  question: string
  question_analysis: string
  question_desc: null
  short_answer_keys: null
  short_answer_reference: null
  judge_correct: null
  ai_test_desc: null
  blank_correct: null
}
export {
  createQuestionTypeList,
  IQuestionList,
}