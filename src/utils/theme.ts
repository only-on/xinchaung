type TThemeColor={
  themeColor: string,
  nextThemeColor:string,
  orangeColor:string,
  blueColor:string
}

const theme:TThemeColor={
  themeColor: '#8955b5',
  nextThemeColor:"#e0d2fe",
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