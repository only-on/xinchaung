import * as echarts from "echarts"
// 成绩详情分布图
function scoreDetailEcharts(el: HTMLDivElement, data: any) {
    const chart = echarts.init(el)
    let options = {
        grid: {
            top: '20%',
            left: '0%',
            right: '0%',
            bottom: '10%',
            // containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                shadowStyle: {
                    color: '#ceccdf',
                }
            },
            extraCssText: 'width:160px;height:90px;',
            backgroundColor: "rgba(30, 30, 30,0.8)",
            borderWidth: '0',
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            data: ['我的成绩', '平均分'],
            itemWidth: 28,
            itemHeight: 13,
            right: 10,
        },
        xAxis: [
            {
                data: ['选择题', '判断题', '填空题', '简答题', '实操考核题'],
                type: 'category',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: '#6c6e72',
                        fontSize: '14'
                    },

                },
                itemStyle: {
                    normal: {
                        color: 'red',
                        emphasis: {
                            color: 'red',
                        }
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisTick: { show: false },
                interval: 50,
                itemStyle: {
                    normal: {
                        color: 'red',
                        emphasis: {
                            color: 'red',
                        }
                    }
                }
            }
        ],
        series: [
            {
                name: '我的成绩',
                type: 'bar',
                itemStyle: {
                    color: "#8955b5",
                    normal: {
                        show: true,
                        color: '#8955b5',
                        barBorderRadius: 5
                    }
                },
                zlevel: 2,
                barWidth: 28,
                label: {
                    show: true,
                    position: ['0', '-20'],
                    distance: 5,
                    formatter: '{c}' + '分',
                    color: "#8955b5"
                },
                data: [320, 332, 301, 334, 390]
            },
            {
                name: '平均分',
                type: 'bar',
                itemStyle: {
                    normal: {
                        show: true,
                        color: '#e3c3fd',
                        barBorderRadius: 5
                    }
                },
                zlevel: 1,
                barWidth: 28,
                label: {
                    show: true,
                    color: '#6C6E72',
                    position: ['0', '-20'],
                    formatter: '{c}' + '分'
                },
                data: [120, 35, 41, 90, 220]
            }
        ]
    }
    chart.setOption(options)
    return chart;
}

function accuracyEcharts(el: HTMLDivElement, data: any) {
    let accuracyChart = echarts.init(el)
    let xAxisData = ['选择题', '判断题', '填空题', '简答题', '实操考核']
    let rightData = [50, 60, 20, 70, 30]
    var series = [{
        name: '条',
        type: 'bar',
        xAxisIndex: 0,
        data: rightData,
        barWidth: 12,
        label: {
            show: true,
            position: ['8', '-12'],
            distance: 5,
            formatter: function (parms: any) {
                return '{b|}' + '{d|>}' + (parms.value - 16) + '%'
            },
            rich: {
                d: { //箭头
                    color: '#8955B5',
                },
                c: {
                    color: '#07a387',
                    align: 'left',
                },
                b: { //横线
                    width: 20,
                    height: 0,
                    borderWidth: 1,
                    borderColor: '#8955B5',
                    align: 'left'
                },
            },
            textStyle: {
                color: '#8955B5',
            }
        },
        itemStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#8955b5  ' // 0% 处的颜色
                }, {
                    offset: 1,
                    color: '#8955b5 ' // 100% 处的颜色
                }], false),
                barBorderRadius: [10, 10, 0, 0],
            }
        },
        z: 2
    },
    {
        name: '外框',
        type: 'bar',
        xAxisIndex: 2,
        barGap: '-100%',
        data: [130, 130, 130, 130, 130],
        barWidth: 28,
        itemStyle: {
            normal: {
                color: '#e0d4ff',
                barBorderRadius: [30, 30, 0, 0],
            }
        },
        z: 0
    },
    {
        name: '圆',
        type: 'scatter',
        hoverAnimation: false,
        data: [0, 0, 0, 0, 0],
        xAxisIndex: 0,
        symbolSize: 48,
        itemStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#8955b5'
                },
                {
                    offset: 1,
                    color: '#c3c4fd'
                }
                ]),
                opacity: 1,
            }
        },
        label: {
            show: true,
            formatter: function (params: any) {
                switch (params.name) {
                    case '选择题': return '{a|}';
                    case '判断题': return '{b|}';
                    case '填空题': return '{c|}';
                    case '简答题': return '{d|}';
                    case '实操考核': return '{e|}';
                }
            },
            rich: {
                a: {
                    backgroundColor: {
                        image: window.location.origin + '/src/assets/exam/choice.png'
                    },
                    height: 24
                },
                b: {
                    backgroundColor: {
                        image: window.location.origin + '/src/assets/exam/judgement.png'
                    },
                    height: 20
                },
                c: {
                    backgroundColor: {
                        image: window.location.origin + '/src/assets/exam/completion.png'
                    },
                    height: 24
                },
                d: {
                    backgroundColor: {
                        image: window.location.origin + '/src/assets/exam/shortAnswer.png'
                    },
                    height: 24
                },
                e: {
                    backgroundColor: {
                        image: window.location.origin + '/src/assets/exam/shicao.png'
                    },
                    height: 24
                }
            }
        },
        z: 2
    },
    {
        name: '外圆',
        type: 'scatter',
        hoverAnimation: false,
        data: [0, 0, 0, 0, 0],
        xAxisIndex: 2,
        symbolSize: 60,
        itemStyle: {
            normal: {
                color: '#c3c4fd',
                opacity: 1,
            }
        },
        z: 0
    }
    ];

    var AccuracyOption = {
        backgroundColor: 'transparent',
        boundaryGap: false,
        grid: {
            left: '0%',
            right: '10%',
            bottom: '0%',
            top: '0%',
            containLabel: true
        },
        tooltip: {
            show: false,
            trigger: 'item',
            padding: [8, 10], //内边距
            formatter: '{b}<br />正确率: {c0}%',
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                textStyle: {
                    color: '#6c6e72',
                    fontSize: '14',
                },
                margin: 40,
            },
            data: xAxisData
        },
        {
            type: 'category',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitArea: {
                show: false
            },
            splitLine: {
                show: false
            },
            data: xAxisData
        },
        {
            type: 'category',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitArea: {
                show: false
            },
            splitLine: {
                show: false
            },
            data: xAxisData
        }, {
            show: false,
            min: -110,
            max: 100,

        }],
        yAxis: [{
            show: false,
            min: 0,
            max: 130,
        }, {
            show: false,
            data: [],
            min: 0,
            max: 130,
        }],
        series: series

    };
    accuracyChart.setOption(AccuracyOption)
    return accuracyChart
}

export {
    scoreDetailEcharts,
    accuracyEcharts
}

export default {
    scoreDetailEcharts,
    accuracyEcharts
}