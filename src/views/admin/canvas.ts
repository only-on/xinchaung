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
                center: ['50%', '50%'],
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
        echartsCanvas.resize({
            height:"auto",
            width:'auto'
        })
    }
    return echartsCanvas
}

export function gaugeCanvas(name: string, data: any, color: string, el: HTMLElement) {

    var option = {
        tooltip: {
            formatter: "{b} : {c}%"
        },
        center: ['50%', '50%'],
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
                    offsetCenter: ["0", "-40px"]
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

export function lineCnvas(data: any, el: HTMLElement) {
    console.log(data);
    let colors = ["#6194FF", "#FDCA72", "#9771EB", "#FA6673", "#36D188"];
    let series = []
    let num = 0
    let legendData = []
    var name={
        cpu:"CPU",
        disk:"磁盘",
        disk_system:"系统硬盘",
        ram:"内存",
        www_disk:"数据硬盘"
    }
    for (const key in data.graph) {
        if (Object.hasOwnProperty.call(data.graph, key)) {
            num++
            let obj = {
                name: name[key],
                type: 'line',
                smooth: true,
                data: data.graph[key],

                normal: {
                    color: colors[num]
                }

            }
            series.push(obj)
            legendData.push({ name: name[key] })
        }
    }
    var option = {
        grid: {
            left: '5%',
            top: '10%',
            right: '5%',
            bottom: '10%',
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            show: true,
            icon: 'rect',
            orient: 'horizontal',
            itemWidth: 16.5,
            itemHeight: 6,
            // itemGap: 30,
            textStyle: {
                fontSize: 14
            },
            data: legendData
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.time
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: false
            },
            splitLine: {
                show: true,
                width: 0.08,
                lineStyle: {
                    type: "solid",
                    color: "rgba(0,0,0,0.15)"
                }
            }
        },
        series: series
    }
    const lineEcharts = echarts.init(el)
    lineEcharts.setOption(option)
    window.onresize=function() {
        lineEcharts.resize()
    }
    return lineEcharts
}