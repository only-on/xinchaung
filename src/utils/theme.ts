type TThemeColor={
  themeColor: string,
  nextThemeColor:string,
  orangeColor:string,
  blueColor:string
}

const theme:TThemeColor={
  // themeColor: '#8955b5',
  themeColor: '#585CE5',
  nextThemeColor:"#585ce533",
  orangeColor:"#ff9c74",
  blueColor:"#73a0fa"
}

type TImageColor={
  mainColor:string,
  nextColor:string,
}
const image:TImageColor={
  mainColor:"#73deb3",
  nextColor:"#73a0fa"
}
export{
  theme,
  image
}