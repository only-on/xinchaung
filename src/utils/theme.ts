import {sStorage} from 'src/utils/extStorage'
import loginA from 'src/assets/images/admin/systemmain/loginA.png'
import loginB from 'src/assets/images/admin/systemmain/loginB.png'
import loginC from 'src/assets/images/admin/systemmain/loginC.png'
// 实验详情顶部图片
import experimentA from 'src/assets/images/themeA/teacherExperiment/base_info_bg.png'
import experimentB from 'src/assets/images/themeB/teacherExperiment/base_info_bg.jpg'
import experimentC from 'src/assets/images/themeC/teacherExperiment/base_info_bg.jpg'
// 课程详情顶部详情图片
import courseA from 'src/assets/images/themeA/teacherCourse/courseHeader.jpg'
import courseB from 'src/assets/images/themeB/teacherCourse/courseHeader.jpg'
import courseC from 'src/assets/images/themeC/teacherCourse/courseHeader.jpg'
// 管理端首页
import greenImg from 'src/assets/images/admin/home/enter.png'
import purpleImg from 'src/assets/images/admin/home/enter1.png'
// 教师端首页 轮播图按钮    Aleft Aright Bleft Bright Cleft Cright
import Aleft from 'src/assets/images/teacher-default/Aleft.png'
import Aright from 'src/assets/images/teacher-default/Aright.png'
import Bleft from 'src/assets/images/teacher-default/Bleft.png'
import Bright from 'src/assets/images/teacher-default/Bright.png'
import Cleft from 'src/assets/images/teacher-default/Cleft.png'
import Cright from 'src/assets/images/teacher-default/Cright.png'
import bannerlunBoA from 'src/assets/images/teacher-default/banner-bg3.jpg'
import bannerlunBoB from 'src/assets/images/teacher-default/banner-bg2.png'
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

const themeColorList:any = [
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
const THomeEchartsThemeColor={
  A:{
    Tcolor1:'rgba(255, 149, 68,.25)',// 课程完成率
    Tcolor2:'#FF9544',

    Tcolor3:'#05BBC9',// 课程成绩分布
    Tcolor4:'rgba(255, 149, 68,.25)',
    Tcolor5:'rgba(255, 149, 68,.25)'
  },
  B:{
    Tcolor1:'rgba(5,187,201,0.20)',// 课程完成率
    Tcolor2:'#05BBC9',

    Tcolor3:'#FF9544',// 课程成绩分布
    Tcolor4:'#05BBC9',
    Tcolor5:'#fff'
  },
  C:{
    Tcolor1:'rgba(255,186,73,0.20)',// 课程完成率
    Tcolor2:'#FFBA49', 

    Tcolor3:'#FF9544',// 课程成绩分布
    Tcolor4:'rgba(255, 149, 68,.25)',
    Tcolor5:'rgba(255, 149, 68,.25)'
  },
}
function getTheme () {
  // A默认的橘黄系统色    B 暗色蓝绿   C 白色+浅色黄色
  let systemInfo = sStorage.get('systemInfo')
  let theme = systemInfo ? systemInfo.theme : 'A'
  let themeData = themeColorList.filter((item:any) => item.value === theme)[0]
  Object.assign(themeData,THomeEchartsThemeColor[theme])
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
    experBan: experimentA,
    entranceLeft: greenImg,
    entranceRight: purpleImg, 
    ThomeLunbo:{
      left:Cleft,
      right:Cright,
      bannerlunBo:bannerlunBoA
    }
  },
  B: {
    courseBan: courseB,
    experBan: experimentB,
    entranceLeft: greenImg,
    entranceRight: purpleImg,
    ThomeLunbo:{
      left:Bleft,
      right:Bright,
      bannerlunBo:bannerlunBoB
    }
  },
  C: {
    courseBan: courseC,
    experBan: experimentC,
    entranceLeft: greenImg,
    entranceRight: purpleImg,
    ThomeLunbo:{
      left:Cleft,
      right:Cright,
      bannerlunBo:bannerlunBoA
    }
  }
}
export function getThemeData () {
  return {
    systemImages: imageData[getTheme().theme],
    systemColor: {...getTheme().themeData}
  }
}
export{
  theme,
  image,
  themeColorList,
  loginStyleList,
  setTheme
}