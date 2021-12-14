import * as echarts from "echarts"


export function pieCanvas(nams: any[], data: any, color: any, el: HTMLElement) {
    const options = {
        grid: {
            right: 0,
            left: 0
        },
        tooltip: {
            trigger: "item",
            formatter: function (val: any) {
                return val.name.split(" ").join("\\n")
            }
        },
        // legend: {
        //     top: 'center',
        //     left: 'center',
        //     data:nams,
        //     formatter:function(name:any){
        //         // let target;
        //         // for(let i=0;i<data.length;i++){
        //         //     if(data[i].name===name){
        //         //         target=data[i].value
        //         //     }
        //         // }
        //         // let arr=["{a|"+target+"}","{b|"+name+"}"]
        //         // return arr.join("\n")

        //     },
        //   },
        series: [
            {
                type: 'pie',
                radius: ['38%', '60%'],
                center: ['52%', '50%'],
                label: {
                    formatter: '{b} \n {d}',
                    position: 'outside',
                    color: '#202735',
                    fontSize: "14",
                    overflow: 'none',
                },
                labelLine: {
                    show: true
                },
                color: color,
                itemStyle: {
                    label: {
                        show: true,
                        textStyle: { color: '#3c4858', fontSize: "10" },
                        formatter: function (val: any) {
                            return val.name.split(" ").join("\n")
                        }
                    }


                },
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
    let echartsCanvas = echarts.init(el)
    echartsCanvas.setOption(options)
    window.onresize = function () {
        echartsCanvas.resize()
    }
    return echartsCanvas
}

export function gaugeCanvas(name: string, data: any, color: string, el: HTMLElement) {

    var option = {
        tooltip: {
            formatter: "{b} : {c}%"
        },
        center:['50%', '50%'],
        series: [
            {
                name: name,
                type: 'gauge',
                radius: '85%',
                title: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize: 13,
                    color: color,
                    offsetCenter:["0","-40px"]
                },
                axisLine: {
                    lineStyle: {
                        width: 20,
                        color: [
                            [1, color]
                        ]
                    }
                },
                pointer: {
                    itemStyle: {
                        color: color
                    }
                },
                axisTick: {
                    distance: -20,
                    length: 8,
                    lineStyle: {
                        color: '#fff',
                        width: 1
                    }
                },
                splitLine: {
                    distance: -20,
                    length: 30,
                    lineStyle: {
                        color: '#fff',
                          width: 2
                    }
                },
                axisLabel: {
                    color: color,
                    // distance: 40,
                    fontSize: 12
                },
                detail: { formatter: '{value}%', fontSize: 15, fontWeight: 'bold', color: color },

                data: [{
                    value: data, name: '使用率', label: {

                        fontSize: 12,
                        color: color

                    }
                }],
            }
        ]
    };
    const gaugeCanvas = echarts.init(el)
    gaugeCanvas.setOption(option)
    window.onresize = function () {
        gaugeCanvas.resize()
    }
    return gaugeCanvas
}