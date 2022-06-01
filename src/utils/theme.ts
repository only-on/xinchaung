// import { theme } from 'src/utils/theme';
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
    primary1: '#fff7e6',
    primary2: '#FDF6F0',
    primary3: '#fff2d9',
    primary5: '#fe8020 ', // 鼠标移入颜色
    primary7: '#D78D0E' //主色点击颜色
  },
  {
    value: 'B',
    primary: '#05BBC9', // 主色
    secondary: '#FAAD14', // 辅色
    menuBg: '#102241',
    menuText: 'rgba(255, 255, 255, 0.45)',
    menuActive: '#fff',
    primary1: '#F0FBFC', // 较浅主题颜色
    primary2: '#E5F8FA', // 浅主题颜色
    primary3: '#CDEDF0',
    primary5: '#3BDEDC', // 鼠标移入颜色
    primary7: '#0392AC' //主色点击颜色
  },
  {
    value: 'C',
    primary: '#FFB849', // 主色
    secondary: '#FF8A17', // 辅色
    menuBg: '#fff',
    menuText: 'rgba(0, 0, 0, 0.65)', 
    menuActive: '#FFB849',
    primary1: '#FCFAF0', // 较浅主题颜色
    primary2: '#FFF7E7', // 浅主题颜色
    primary3: '#F8EDDC',
    primary5: '#FAAD14', // 主色鼠标移入颜色
    primary7: '#D78D0E' //主色点击颜色
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
function getTheme () {
  let systemInfo = sStorage.get('systemInfo')
  let theme = systemInfo.theme
  let themeData = themeColorList.filter((item:any) => item.value === systemInfo.theme)[0]
  return {
    systemInfo,
    themeData,
    theme
  }
}
function setTheme () {
  let {systemInfo, themeData} = getTheme()
  if (!Object.keys(systemInfo).length) return
  for (let key in systemInfo) {
    if (key === 'theme') {
      let bodyEle = document.getElementsByTagName('body')[0]
      bodyEle.style.setProperty('--primary-color', themeData.primary) // 主题色
      bodyEle.style.setProperty('--brightBtn', themeData.secondary) // 辅助色
      bodyEle.style.setProperty('--menu-bg', themeData.menuBg) // 菜单背景
      bodyEle.style.setProperty('--menu-text', themeData.menuText) // 菜单文字颜色
      bodyEle.style.setProperty('--menu-active', themeData.menuActive) // 菜单选中文字颜色
      bodyEle.style.setProperty('--primary-1', themeData.primary1)
      bodyEle.style.setProperty('--primary-2', themeData.primary2)
      bodyEle.style.setProperty('--primary-3', themeData.primary3)
      bodyEle.style.setProperty('--primary-5', themeData.primary5)
      bodyEle.style.setProperty('--primary-7', themeData.primary7)
      bodyEle.style.setProperty('--primary-atn-hover', themeData.primary5)
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
let imageData = {
  A: {
    courseBan: courseA,
    experBan: experimentA
  },
  B: {
    courseBan: courseB,
    experBan: experimentB
  },
  C: {
    courseBan: courseC,
    experBan: experimentC
  }
}
const systemImages = imageData[getTheme().theme]
console.log(systemImages)
const systemColor = {...getTheme().themeData}
export{
  theme,
  image,
  themeColorList,
  loginStyleList,
  setTheme,
  systemImages,
  systemColor
}