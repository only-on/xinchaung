
import {getThemeData} from 'src/utils/theme'
const {systemColor} = getThemeData()
const getTopicType={
    1: {
      name: "选择题",
      subname: '选择',
      bgColor: '#51B048'
    },
    2: {
      name: "判断题",
      subname: '判断',
      bgColor: '#CCCC33'
    },
    3: {
      name: "填空题",
      subname: '填空',
      bgColor: '#FAAD14'
    },
    4: {
      name: "简答题",
      subname: '简答',
      bgColor: '#00C8FF'
    },
    5: {
      name: "编程题",
      subname: '编程',
      bgColor: '#3094EF'
    },
    6: {
      name: "模型题",
      subname: '模型',
      bgColor: '#4B6CF5'
    },
    7: {
      name: "SQL题",
      subname: 'SQL',
      bgColor: '#2dc3c4'
    },
}
export  default getTopicType
