export const option=(data:any)=>{
  let option = {
    title:[{
      text:'使用统计',
      top: '36%',
      left: '33%',
    }],
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: "vertical",
      icon: "circle",
      top: '30%',
      right: '5%',
      formatter:(params:any) => {
        let arr = [
          { value: 1048, name:data},
          { value: 735, name: '日志数据' },
          { value: 580, name: '素材资源' },
          { value: 484, name: '其它' },
          { value: 300, name: '镜像' }
        ] //图表数据
        let sum:any=0
        arr.forEach((item:any)=>{
          sum=sum+item.value
        })
        let item = arr.filter((i:any)=> {
          return i.name == params
        })[0]
        if (!item) return
        let p = Math.round((item.value/sum) * 100)
        return [`${params}`, `${p}%`].join(` | `)
      }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        center:['40%','40%'],
        radius: ['30%', '50%'],
        data: [
          { value: 1048, name:data},
          { value: 735, name: '日志数据' },
          { value: 580, name: '素材资源' },
          { value: 484, name: '其它' },
          { value: 300, name: '镜像' }
        ],
        labelLine:{//指示线样式设置
          show:true
      },
      }
    ]
  };
  return option
}