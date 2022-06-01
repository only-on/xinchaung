
import {sStorage} from 'src/utils/extStorage'
import loginA from 'src/assets/images/admin/systemmain/loginA.png'
import loginB from 'src/assets/images/admin/systemmain/loginB.png'
import loginC from 'src/assets/images/admin/systemmain/loginC.png'
import experimentA from 'src/assets/images/teacherExperimentResourcePool/base_info_bg.png'
import experimentB from 'src/assets/images/teacherExperimentResourcePool/base_info_bgB.jpg'
import experimentC from 'src/assets/images/teacherExperimentResourcePool/base_info_bgC.jpg'
import courseA from 'src/assets/images/teacherCourse/courseHeader.jpg'
import courseB from 'src/assets/images/teacherCourse/courseHeaderB.jpg'
import courseC from 'src/assets/images/teacherCourse/courseHeaderC.jpg'
type TThemeColor={
  themeColor: string,
  nextThemeColor:string,
  orangeColor:string,
  blueColor:string,
  cyanColor: string
}

const theme:TThemeColor={
  // themeColor: '#8955b5',
  themeColor: '#ff9544',
  nextThemeColor:"#585ce533",
  orangeColor:"#ff9c74",
  blueColor:"#73a0fa",
  cyanColor: "#00cbc2",
}

type TImageColor={
  mainColor:string,
  nextColor:string,
}
const image:TImageColor={
  mainColor:"#73deb3",
  nextColor:"#73a0fa"
}
interface ImoduleObj {
  class: string,
  type: string
}
const themeColorList = [
  {
    value: 'A',
    primary: '#FF9544', // 主色
    secondary: '#1cb2b3', // 辅色
    menuBg: '#192843',
    menuText: 'rgba(255, 255, 255, 0.45)',
    menuActive: '#fff',
    light1: '#fff7e6',
    light2: '#FDF6F0',
    light3: '#fff2d9',
    light5: '#fe8020 ', // 鼠标移入颜色
    light7: '#D78D0E' //主色点击颜色
  },
  {
    value: 'B',
    primary: '#05BBC9', // 主色
    secondary: '#FAAD14', // 辅色
    menuBg: '#102241',
    menuText: 'rgba(255, 255, 255, 0.45)',
    menuActive: '#fff',
    light1: '#F0FBFC', // 较浅主题颜色
    light2: '#E5F8FA', // 浅主题颜色
    light3: '#CDEDF0',
    light5: '#3BDEDC', // 鼠标移入颜色
    light7: '#0392AC' //主色点击颜色
  },
  {
    value: 'C',
    primary: '#FFB849', // 主色
    secondary: '#FF8A17', // 辅色
    menuBg: '#fff',
    menuText: 'rgba(0, 0, 0, 0.65)', 
    menuActive: '#FFB849',
    light1: '#FCFAF0', // 较浅主题颜色
    light2: '#FFF7E7', // 浅主题颜色
    light3: '#F8EDDC',
    light5: '#FAAD14', // 主色鼠标移入颜色
    light7: '#D78D0E' //主色点击颜色
  }
]
 const loginStyleList = [
  {
    value: 'A',
    label: loginA
  },
  {
    value: 'B',
    label: loginB
  },
  {
    value: 'C',
    label: loginC
  }
]
// 课程、实验详情顶部背景图
const detailBg = {
  course: {
    A: courseA,
    B: courseB,
    C: courseC
  },
  experiment: {
    A: experimentA,
    B: experimentB,
    C: experimentC
  }
}
function setTheme (moduleObj?: ImoduleObj) {
  let systemInfo = sStorage.get('systemInfo').theme
  // 设置课程、实验顶部背景图
  if (moduleObj) {
    let currentTheme = sStorage.get('systemInfo').theme
    let ele:any = document.getElementsByClassName(moduleObj.class)[0]
    ele.style.background = `url(${detailBg[moduleObj.type][currentTheme]})`
    return
  }
  if (!Object.keys(systemInfo).length) return
  for (let key in systemInfo) {
    if (key === 'theme') {
      let themeData = themeColorList.filter((item:any) => item.value === systemInfo[key])[0]
      let bodyEle = document.getElementsByTagName('body')[0]
      bodyEle.style.setProperty('--primary-color', themeData.primary) // 主题色
      bodyEle.style.setProperty('--brightBtn', themeData.secondary) // 辅助色
      bodyEle.style.setProperty('--menu-bg', themeData.menuBg) // 菜单背景
      bodyEle.style.setProperty('--menu-text', themeData.menuText) // 菜单文字颜色
      bodyEle.style.setProperty('--menu-active', themeData.menuActive) // 菜单选中文字颜色
      bodyEle.style.setProperty('--primary-1', themeData.light1)
      bodyEle.style.setProperty('--primary-2', themeData.light2)
      bodyEle.style.setProperty('--primary-3', themeData.light3)
      bodyEle.style.setProperty('--primary-5', themeData.light5)
      bodyEle.style.setProperty('--primary-7', themeData.light7)
      bodyEle.style.setProperty('--primary-atn-hover', themeData.light5)
      // bodyEle.style.setProperty('--menu-active', themeData.menuActive)
      
    }
    if (key === 'logo_url') {
      let favEle:any = document.getElementById('custom_favicon');
      favEle.href = systemInfo[key]
    }
    if (key === 'site_name') {
      document.title = systemInfo[key]
    }
  }
}
export{
  theme,
  image,
  themeColorList,
  loginStyleList,
  setTheme
}