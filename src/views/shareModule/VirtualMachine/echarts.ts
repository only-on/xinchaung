import * as echarts from "echarts"

export function histogram(el: any, data: any) {
    const chartsData = {
        my_time: {
            text: "我的用时",
            color: "#fab924"
        },
        average_time: {
            text: "平均用时",
            color: "#20b28f"
        }
    }

    console.log(data, el);
    const histogramCanvas = echarts.init(el.value)
    const bardata: any = []
    const xData: any = []
    Object.keys(data).forEach((key: any) => {
        if (['my_time', 'average_time'].includes(key)) {
            xData.push(chartsData[key].text)
            
            let temp = {
               
                value: data[key],
                // label: {
                //     show: true,
                //     position: 'top'
                //   },
                itemStyle: {
                    color: chartsData[key].color,
                },

            }
            
            bardata.push(temp)
        }

    })
    console.log("series",bardata)
    console.log("xData",xData)
    const option = {
        xAxis: {
            type: 'category',
            data: [...xData]
        },
        yAxis: [{
            type: 'value',
            splitLine: {
                show: false
            }
        }],
        grid: {
            left: 30
        },
        series: [
            {
              data: bardata,
              type: 'bar',
              label: {
                    show: true,
                    position: 'top',
                    formatter:(params:any)=>{
                        return Number(params.value).toFixed(2)+'分钟'
                    }
                  },
            }
          ]
    };
    histogramCanvas.setOption(option)
}