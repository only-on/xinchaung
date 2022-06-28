
import {getThemeData} from 'src/utils/theme'
const {systemColor} = getThemeData()

const getTypeList = (deg: string) => {
return {
  1: {
    name: "桌面",
    color: "#ff9544",
    backgroundColor: "linear-gradient("+deg+",rgba(255,149,68,0.14), rgba(255,199,156,0.14) 36%, rgba(255,255,255,0.14))",
    detailebBackgroundColor: "linear-gradient(90deg,rgba(255, 149, 68, 0.14), rgba(255, 199, 156, 0.14) 36%, rgba(19, 51, 85, 0.14))",
  },
  2: {
    name: "命令行",
    color: "#1cb2b3",
    backgroundColor: "linear-gradient("+deg+",rgba(28,178,179,0.14), rgba(85,218,219,0.14) 36%, rgba(255,255,255,0.14))",
    detailebBackgroundColor:"linear-gradient(90deg,rgba(28, 178, 179, 0.14), rgba(85, 218, 219, 0.14) 36%, rgba(19, 51, 85, 0.14))",  
  },
  3: {
    name: "IDE",
    color: "#06B434",
    backgroundColor: "linear-gradient("+deg+",rgba(28,179,53,0.14), rgba(110,227,141,0.14) 36%, rgba(255,255,255,0.14))",
    detailebBackgroundColor: "linear-gradient(90deg,rgba(28, 179, 53, 0.14), rgba(110, 227, 141, 0.14) 36%, rgba(19, 51, 85, 0.14))",  
  },
  4: {
    name: "Jupyter",
    color: "#3094EF",
    backgroundColor: "linear-gradient("+deg+",rgba(48,148,239,0.14), rgba(93,178,255,0.14) 36%, rgba(255,255,255,0.14))",
    detailebBackgroundColor: "linear-gradient(90deg,rgba(28, 179, 53, 0.14), rgba(110, 227, 141, 0.14) 36%, rgba(19, 51, 85, 0.14))",  
  },
  5: {
    name: "任务",
    color: "#834CE4",
    backgroundColor: "linear-gradient("+deg+",rgba(111,48,239,0.14), rgba(162,124,228,0.14) 36%, rgba(255,255,255,0.14))",
    detailebBackgroundColor: "linear-gradient(90deg,rgba(111, 48, 239, 0.14), rgba(162, 124, 228, 0.14) 36%, rgba(19, 51, 85, 0.14))",  
  },
  6: {
    name: "视频",
    color: "#cccc33",
    backgroundColor: "linear-gradient("+deg+",rgba(204,204,51,0.14), rgba(204,204,51,0.14), rgba(255,255,255,0.14))",
    detailebBackgroundColor: "linear-gradient(90deg,rgba(204, 204, 51, 0.14), rgba(204, 204, 51, 0.14) 36%, rgba(19, 51, 85, 0.14))",  
  },
  7: {
    name: "文档",
    color: "#00c8ff",
    backgroundColor: "linear-gradient("+deg+",rgba(0,200,255,0.14), rgba(0,200,255,0.14) 36%, rgba(255,255,255,0.14))",
    detailebBackgroundColor: "linear-gradient(90deg, rgba(0, 200, 255, 0.14), rgba(0, 200, 255, 0.14) 36%, rgba(19, 51, 85, 0.14))",  
  },
}
};
export  {
  getTypeList 
}