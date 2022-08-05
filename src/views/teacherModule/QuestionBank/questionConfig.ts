
const createQuestionTypeList = [
  {key:1, name:'选择题',path:'./QuestionBank/createQues'},
  {key:2, name:'判断题',path:'./QuestionBank/createQues'},
  {key:3, name:'填空题',path:'./QuestionBank/createQues'},
  {key:4, name:'解答题',path:'./QuestionBank/createQues'},
  {key:5, name:'编程题',path:'./QuestionBank/createProgramming'},
  {key:6, name:'模型题',path:'./QuestionBank/createModelQuestion'},
  {key:7, name:'批量导入',path:'./QuestionBank/batchImport'},
];
const questionTypeList = {
  1: {
    name:'选择题', keyword: '选择', bgColor: '#51B048'
  },
  2: {
    name:'判断题', keyword: '判断', bgColor: '#CCCC33'
  },
  3: {
    name:'填空题', keyword: '填空', bgColor: '#FAAD14'
  },
  4: {
    name:'解答题', keyword: '解答', bgColor: '#00C8FF'
  },
  5: {
    name:'编程题', keyword: '编程', bgColor: '#3094EF'
  },
  6: {
    name:'模型题', keyword: '模型', bgColor: '#4B6CF5'
  },
  7: {
    name:'SQL题', keyword: 'SQL', bgColor: '#2dc3c4'
  },
};
const levelTypeList = {
  1: {
    name:'简单', color: '#51B048', bgColor: 'rgba(81,176,72,0.15)',
  },
  2: {
    name:'适中', color: '#3094EF', bgColor: 'rgba(48,148,239,0.15)',
  },
  3: {
    name:'困难', color: '#F5222D', bgColor: 'rgba(245,34,45,0.15)',
  },
};
const useTypeList = {
  1: { name:'作业题' },
  2: { name:'考试题' },
}
export {
  createQuestionTypeList,
  questionTypeList,
  levelTypeList,
  useTypeList,
}