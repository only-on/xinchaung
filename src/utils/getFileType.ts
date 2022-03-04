export const getFileType = (fileName: string) => {
  // 后缀获取
  let suffix = ''
  // 获取类型结果
  let result: string | undefined
  try {
    const flieArr = fileName.split('.')
    suffix = flieArr[flieArr.length - 1]
  } catch (err) {
    suffix = ''
  }
  // fileName无后缀返回 false
  if (!suffix) {
    return 'other'
  }
  suffix = suffix.toLocaleLowerCase()
  // 匹配txt
  const txtlist = ['txt']
  result = txtlist.find(item => item === suffix)
  if (result) {
    return 'txt'
  }
  // 匹配 excel
  const excelist = ['xls', 'xlsx']
  result = excelist.find(item => item === suffix)
  if (result) {
    return 'excel'
  }
  const csvList = ['csv']
  result = csvList.find(item => item === suffix)
  if (result) {
    return 'csv'
  }
  // 匹配 word
  const wordlist = ['doc', 'docx']
  result = wordlist.find(item => item === suffix)
  if (result) {
    return 'word'
  }

  // 匹配 ppt
  const pptlist = ['ppt', 'pptx']
  result = pptlist.find(item => item === suffix)
  if (result) {
    return 'ppt'
  }
// 匹配 pdf
  const pdflist = ['pdf']
  result = pdflist.find(item => item === suffix)
  if (result) {
    return 'pdf'
  }
  // 匹配 压缩包
  const rarList = ['rar','tar']
  result = rarList.find(item => item === suffix)
  if (result) {
    return 'rar'
  }
  // 匹配 压缩包
  const zipList = ['zip']
  result = zipList.find(item => item === suffix)
  if (result) {
    return 'zip'
  }
  // 匹配 markdown
  const markdown = ['md']
  result = markdown.find(item => item === suffix)
  if (result) {
    return 'md'
  }
  // 匹配 mp4
  const mp4List = ['mp4']
  result = mp4List.find(item => item === suffix)
  if (result) {
    return 'mp4'
  }
  // 匹配 python
  const pyList = ['py']
  result = pyList.find(item => item === suffix)
  if (result) {
    return 'py'
  }
  // 其他 文件类型
  return 'other'
}

// 获取文件后缀
export const getFileSuffix = (fileName: string) => {
  // 后缀
  let suffix = ''
  try {
    const fileArray = fileName.split('.')
    suffix = fileArray[fileArray.length - 1]
  } catch (error) {
    suffix = ''
  }
  return suffix
}
