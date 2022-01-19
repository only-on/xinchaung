function examStatus(status:number) {
    let statusTemp= {
      1:"进行中",
      2:"未开始",
      3:"已结束"
    }
    return statusTemp[status]
  }

  export {
    examStatus
  }