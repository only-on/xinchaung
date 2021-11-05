self.importScripts('/spark-md5/spark-md5.min.js?t=' + new Date().getTime().toString()) // 导入脚本

// 生成文件 hash
self.onmessage = e => {
  const { chunks } = e.data
  const spark = new self.SparkMD5.ArrayBuffer()
  let percent = 0
  let count = 0
  const loadNext = index => {
    const fileReader = new FileReader()
    // eslint-disable-next-line prettier/prettier
    const chunk = chunks[index].chunk

    fileReader.readAsArrayBuffer(chunk)
    fileReader.onload = e => {
      count++
      spark.append(e.target.result)
      if (count === chunks.length) {
        self.postMessage({
          percent: 100,
          hash: spark.end(),
        })
        self.close()
      } else {
        percent += 100 / chunks.length
        self.postMessage({
          percent,
        })
        loadNext(count)
      }
    }

    fileReader.onerror = function () {
      self.postMessage({
        error: this.error,
      })
    }
  }

  loadNext(0)
}
