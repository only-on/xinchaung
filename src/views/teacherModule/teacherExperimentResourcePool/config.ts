
import {getThemeData} from 'src/utils/theme'
const {systemColor} = getThemeData()

const getTypeList = (deg: string) => {
return {
  1: {
    name: "桌面",
    color: systemColor.primary,
    backgroundColor:
      "linear-gradient("+deg+",rgba(255,149,68,0.14), rgba(255,199,156,0.14) 36%, rgba(255,255,255,0.14))",
    detailebBackgroundColor:"linear-gradient("+deg+",rgba(255,149,68,0.14), rgba(255,199,156,0.14) 36%, #133355)",
  },
  2: {
    name: "命令行",
    color: systemColor.secondary,
    backgroundColor:
      "linear-gradient("+deg+",rgba(28,178,179,0.14), rgba(85,218,219,0.14) 36%, rgba(255,255,255,0.14))",
    detailebBackgroundColor:"linear-gradient("+deg+",rgba(28,178,179,0.14), rgba(85,218,219,0.14) 36%, #133355)",  
  },
  4: {
    name: "Jupyter",
    color: "#3094EF",
    backgroundColor:
      "linear-gradient("+deg+",rgba(48,148,239,0.14), rgba(93,178,255,0.14) 36%, rgba(255,255,255,0.14))",
    detailebBackgroundColor:"linear-gradient("+deg+",rgba(48,148,239,0.14), rgba(93,178,255,0.14) 36%, #133355)",  
  },
  3: {
    name: "IDE",
    color: "#06B434",
    backgroundColor:
      "linear-gradient("+deg+",rgba(28,179,53,0.14), rgba(110,227,141,0.14) 36%, rgba(255,255,255,0.14))",
      detailebBackgroundColor:"linear-gradient("+deg+",rgba(28,179,53,0.14), rgba(110,227,141,0.14) 36%, #133355)",  
  },
  5: {
    name: "任务",
    color: "#834CE4",
    backgroundColor:
      "linear-gradient("+deg+",rgba(111,48,239,0.14), rgba(162,124,228,0.14) 36%, rgba(255,255,255,0.14))",
      detailebBackgroundColor:"linear-gradient("+deg+",rgba(111,48,239,0.14), rgba(162,124,228,0.14) 36%, #133355)",  
  },
  7: {
    name: "文档",
    color: "#00c8ff",
    backgroundColor:
      "linear-gradient("+deg+",rgba(0,200,255,0.14), rgba(0,200,255,0.14) 36%, rgba(255,255,255,0.14))",
      detailebBackgroundColor:"linear-gradient("+deg+",rgba(0,200,255,0.14), rgba(0,200,255,0.14) 36%, #133355)",  
  },
  6: {
    name: "视频",
    color: "#cccc33",
    backgroundColor:
      "linear-gradient("+deg+",rgba(204,204,51,0.14), rgba(204,204,51,0.14) 36%, rgba(255,255,255,0.14));",
      detailebBackgroundColor:"linear-gradient("+deg+",rgba(204,204,51,0.14), rgba(204,204,51,0.14) 36%, #133355)",  
  },
}
};
export  {
  getTypeList 
}