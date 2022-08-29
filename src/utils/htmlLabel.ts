// 修复被破坏的html代码，做法为：去除被破坏的标签，给落单的成对
// 标签补上他们的结束标签
function fixHtml(html: string) {
  // 成对标签，完整，成对
  const patternClosureTag = /<(\w+)[^>]*?>[\s\S]*?<\/\1>/g;
  // 自闭合标签，完整，雌雄同体
  const patternSelfCloseTag = /<\w+[^>]*?\/>/g;
  // 被损坏的起始标签，不完整，残疾
  const patternSpoiledTag = /<\w+[^>]*?$/g;
  // 起始标签，完整，单身
  const patternStartTag = /<(\w+)[^>]*?>/g;

  // 去除损坏的标签
  let htmlFinal = html.replace(patternSpoiledTag, "");
  // 临时变量，用于过滤、筛选出单身标签
  let htmlProcessing = htmlFinal;
  // 去除完整闭合的标签
  htmlProcessing = htmlProcessing.replace(patternClosureTag, "");
  // 去除自闭合标签
  htmlProcessing = htmlProcessing.replace(patternSelfCloseTag, "");

  // 剩下的都是未损坏的未闭合标签，找到他们，给他们把闭合标签加上
  const singles = [];
  let matched = null;
  do {
    matched = patternStartTag.exec(htmlProcessing);
    if (matched && matched.length >= 2) {
      singles.push(matched[1]);
    }
  } while (matched);

  // 追加丢失的标签
  const res = singles.reverse().map((item) => {
    return "</" + item + ">";
  });
  res.forEach((item) => {
    htmlFinal += item;
  });
  return htmlFinal;
}

 // 移除所有的html标签，只留文字
 function removeHtmlTag(html: string) {
  // 自闭合标签，除了img
  const patternSelfCloseTag = /<(?!img)\w+[^>]*?\/>/g;
  // 起始标签，除了strong、b、span
  const patternStartTag = /<(?!(strong|span))(?!(b>)|(b +[^>]*?>))\w+[^>]*?>/g;
  // 结束标签，除了strong、b、span
  const patternEndTag = /<\/(?!(strong|b|span)>)\w+>/g;
  html = html
    .replace(patternSelfCloseTag, "")
    .replace(patternStartTag, "")
    .replace(patternEndTag, "");
  return html;
}

/**
 * 获取html的文字
 * html html代码
 */
function removeHtmlAllTag(html: string) {
  // 图片  
  const imgTag = /<(img)[^>]*?>/g;
  // 视频
  const videoTag = /<(video)[^>]*?>[\s\S]*?<\/\1>/g;
  // 语音
  const audioTag = /<(audio)[^>]*?>[\s\S]*?<\/\1>/g;
  // 起始标签 除了img video audio
  const patternStartTag = /<(?!(img|video|audio))\w+[^>]*?>/g;
  // 结束标签
  const patternEndTag = /<\/(?!(img|video|audio))\w+>/g;
  // 去掉换行
  const brTag = /[.\n]*/g;
  html = html
    .replace(patternStartTag, "")
    .replace(patternEndTag, "")
    .replace(imgTag, "【图片】")
    .replace(videoTag, "【视频】")
    .replace(audioTag, "【语音】")
    .replace(brTag, "");
  return html;
}
export {
  fixHtml,
  removeHtmlTag,
  removeHtmlAllTag,
}