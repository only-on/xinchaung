
import loginImg1 from 'src/assets/images/admin/systemmain/login1.png'
import loginImg2 from 'src/assets/images/admin/systemmain/login1.png'
import loginImg3 from 'src/assets/images/admin/systemmain/login1.png'
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
const themeColorList = [
  {
    value: 'A',
    label: '#192843'
  },
  {
    value: 'B',
    label: '#659BFE'
  },
  {
    value: 'C',
    label: '#C665FE'
  }
]
 const loginStyleList = [
  {
    value: 'A',
    label: loginImg1
  },
  {
    value: 'B',
    label: loginImg2
  },
  {
    value: 'C',
    label: loginImg3
  }
]
function setThemeColor (type:string, letter:string) {
  if (!letter) return
  let data = type === 'theme' ? themeColorList : loginStyleList
  let color = data.filter((item:any) => item.value === letter)[0].label
  document.getElementsByTagName('body')[0].style.setProperty('--theme-color', color)
}
export{
  theme,
  image,
  themeColorList,
  loginStyleList,
  setThemeColor
}